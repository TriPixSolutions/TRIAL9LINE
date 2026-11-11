import {describe,it,expect,afterAll} from 'vitest'
import {NextRequest} from 'next/server'
import {POST} from '@/app/api/inquiries/route'
import {getPayloadClient} from '@/lib/payload'
import {runNotificationWorker} from '@/lib/notification-worker'
const key='qa-inquiry-'+Date.now(),ids:Array<string|number>=[]
const data={fullName:'Test Visitor',businessName:'QA Studio',email:'qa@example.invalid',serviceInterest:'photography',message:'Please discuss our photography project.',privacyAcknowledged:true,idempotencyKey:key}
const request=(body:unknown)=>new NextRequest('http://localhost:3000/api/inquiries',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'qa-'+key},body:JSON.stringify(body)})
afterAll(async()=>{const p=await getPayloadClient();for(const id of ids){await p.delete({collection:'notification-outbox',where:{inquiry:{equals:id}}});await p.delete({collection:'inquiries',id})}})
describe('Durable contact workflow',()=>{
 it('validates before accepting a submission',async()=>{const r=await POST(request({}));expect(r.status).toBe(400)})
 it('persists exactly one inquiry and notification job on a repeated submission',async()=>{
  const p=await getPayloadClient()
  await p.updateGlobal({slug:'site-settings',data:{inquiryNotificationEmail:'studio@example.com'}})
  const first=await POST(request(data))
  await p.updateGlobal({slug:'site-settings',data:{inquiryNotificationEmail:'new-inbox@example.com'}})
  const second=await POST(request(data))
  expect(first.status).toBe(201);expect(second.status).toBe(200)
  expect((await first.json()).reference).toBe((await second.json()).reference)
  const found=await p.find({collection:'inquiries',where:{idempotencyKey:{equals:key}}});expect(found.totalDocs).toBe(1);ids.push(found.docs[0].id)
  const jobs=await p.find({collection:'notification-outbox',where:{inquiry:{equals:found.docs[0].id}}});expect(jobs.totalDocs).toBe(1);expect(jobs.docs[0].status).toBe('pending')
  expect(jobs.docs[0].recipient).toBe('studio@example.com')
  const publicSettings=await p.findGlobal({slug:'site-settings',overrideAccess:false})
  expect(publicSettings).not.toHaveProperty('inquiryNotificationEmail')
 })
 it('records a bounded failure when email is not configured, without losing the inquiry',async()=>{
  const p=await getPayloadClient(),jobs=await p.find({collection:'notification-outbox',where:{inquiry:{equals:ids[0]}}}),id=jobs.docs[0].id
  const previousKey=process.env.RESEND_API_KEY,previousSimulation=process.env.EMAIL_SIMULATION
  delete process.env.RESEND_API_KEY;process.env.EMAIL_SIMULATION='false'
  try{
   const result=await runNotificationWorker(p,id);expect(result.results[0].success).toBe(false)
   const job=await p.findByID({collection:'notification-outbox',id});expect(job.attempts).toBe(1);expect(job.status).toBe('pending');expect(job.leaseToken).toBeNull()
   expect((await p.findByID({collection:'inquiries',id:ids[0]})).emailStatus).toBe('failed')
   await p.update({collection:'notification-outbox',id,data:{attempts:5,nextAttemptAt:new Date(0).toISOString()}})
   await runNotificationWorker(p,id)
   const exhausted=await p.findByID({collection:'notification-outbox',id});expect(exhausted.status).toBe('failed');expect(exhausted.attempts).toBe(5)
  }finally{if(previousKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=previousKey;if(previousSimulation===undefined)delete process.env.EMAIL_SIMULATION;else process.env.EMAIL_SIMULATION=previousSimulation}
 })
})
