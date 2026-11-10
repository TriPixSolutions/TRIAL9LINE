import {NextRequest,NextResponse} from 'next/server'
import {createLocalReq} from 'payload'
import {getPayloadClient} from '@/lib/payload'
import {inquirySchema,checkRateLimit,generateInquiryReference} from '@/lib/inquiries'
const message='Thanks for telling us about your project. Your inquiry has been received.'
export async function POST(req:NextRequest){try{return await submit(req)}catch{return NextResponse.json({success:false,error:'Your inquiry couldn’t be sent. Your details are still here—please try again.'},{status:500})}}
async function submit(req:NextRequest){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'127.0.0.1'
 if(!checkRateLimit(ip))return NextResponse.json({success:false,error:'Too many submissions. Please wait before trying again.'},{status:429})
 let body:unknown;try{body=await req.json()}catch{return NextResponse.json({success:false,error:'Please submit a valid form.'},{status:400})}
 const parsed=inquirySchema.safeParse(body)
 if(!parsed.success)return NextResponse.json({success:false,error:'Please complete all required fields correctly.',issues:parsed.error.format()},{status:400})
 const {_hp_website,idempotencyKey,...data}=parsed.data
 if(_hp_website?.trim())return NextResponse.json({success:true,reference:generateInquiryReference(),message})
 const payload=await getPayloadClient()
 const key=idempotencyKey||undefined
 const findExisting=async()=>key?(await payload.find({collection:'inquiries',where:{idempotencyKey:{equals:key}},limit:1,overrideAccess:true})).docs[0]:null
 const existing=await findExisting()
 if(existing)return NextResponse.json({success:true,reference:existing.reference,message})
 const localReq=await createLocalReq({},payload)
 const transactionID=await payload.db.beginTransaction()
 if(transactionID!==null)localReq.transactionID=transactionID
 try{
  const inquiry=await payload.create({collection:'inquiries',data:{...data,idempotencyKey:key,reference:generateInquiryReference(),leadStatus:'new',emailStatus:'pending'},req:localReq,overrideAccess:true})
  await payload.create({collection:'notification-outbox',data:{inquiry:inquiry.id,status:'pending',attempts:0,maxAttempts:5,nextAttemptAt:new Date().toISOString()},req:localReq,overrideAccess:true})
  if(transactionID!==null)await payload.db.commitTransaction(transactionID)
  // Delivery belongs exclusively to the durable worker; it cannot race an immediate send.
  return NextResponse.json({success:true,reference:inquiry.reference,message},{status:201})
 }catch{
  if(transactionID!==null)await payload.db.rollbackTransaction(transactionID)
  const duplicate=await findExisting()
  if(duplicate)return NextResponse.json({success:true,reference:duplicate.reference,message})
  return NextResponse.json({success:false,error:'Your inquiry couldn’t be sent. Your details are still here—please try again.'},{status:500})
 }
}
