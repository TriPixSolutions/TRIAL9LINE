import {NextRequest,NextResponse} from 'next/server'
import {getPayloadClient} from '@/lib/payload'
import {runNotificationWorker} from '@/lib/notification-worker'
export async function POST(req:NextRequest){
 const payload=await getPayloadClient(),{user}=await payload.auth({headers:req.headers})
 if(!user||!['owner','inquiry_manager'].includes(String(user.role)))return NextResponse.json({error:'Unauthorized'},{status:403})
 try{
  const {inquiryId}=await req.json();if(!inquiryId)return NextResponse.json({error:'Missing inquiryId'},{status:400})
  const outbox=(await payload.find({collection:'notification-outbox',where:{inquiry:{equals:inquiryId}},limit:1,overrideAccess:true})).docs[0]
  if(!outbox)return NextResponse.json({error:'No notification job found'},{status:404})
  const reset=await payload.db.updateOne({collection:'notification-outbox',where:{and:[{id:{equals:outbox.id}},{status:{equals:'failed'}}]},data:{status:'pending',attempts:0,nextAttemptAt:new Date().toISOString(),leaseExpiresAt:null,leaseToken:null}})
  if(!reset)return NextResponse.json({error:'Only a failed notification can be retried. Pending or accepted notifications will not be sent again.'},{status:409})
  return NextResponse.json(await runNotificationWorker(payload,outbox.id))
 }catch{return NextResponse.json({error:'Could not retry this notification'},{status:500})}
}
