import {randomUUID} from 'node:crypto'
import type {Payload,Where} from 'payload'
import {defaultInquiryRecipient,sendInquiryNotification} from './email'
const backoff=[1,5,15,60]
function due(now:string):Where{return {or:[{and:[{status:{equals:'pending'}},{nextAttemptAt:{less_than_equal:now}}]},{and:[{status:{equals:'processing'}},{leaseExpiresAt:{less_than:now}}]}]}}
export async function runNotificationWorker(payload:Payload,onlyId?:string|number){
 const started=Date.now()
 const now=new Date().toISOString()
 const events=await payload.find({collection:'notification-outbox',where:onlyId?{and:[{id:{equals:onlyId}},due(now)]}:due(now),limit:5,depth:0,overrideAccess:true})
 const results=[]
 for(const event of events.docs){
  if(Date.now()-started>60000)break
  const leaseToken=randomUUID()
  const owned:Where={and:[{id:{equals:event.id}},{leaseToken:{equals:leaseToken}}]}
  // Adapter-level conditional update translates to one atomic findOneAndUpdate on MongoDB.
  const claimed:any=await payload.db.updateOne({collection:'notification-outbox',where:{and:[{id:{equals:event.id}},due(now)]},data:{status:'processing',recipient:event.recipient || defaultInquiryRecipient(),leaseToken,leaseExpiresAt:new Date(Date.now()+5*60000).toISOString()}})
  if(!claimed)continue
  const attempts=Number(claimed.attempts||0),maximum=Number(claimed.maxAttempts||5)
  if(attempts>=maximum){await payload.db.updateOne({collection:'notification-outbox',where:owned,data:{status:'failed',leaseToken:null,leaseExpiresAt:null}});continue}
  const count=attempts+1
  let accepted=false,error='',providerMessageId:string|undefined
  const inquiryId=typeof claimed.inquiry==='object'?claimed.inquiry.id:claimed.inquiry
  try{
   const inquiry=await payload.findByID({collection:'inquiries',id:inquiryId,overrideAccess:true})
   const result=await sendInquiryNotification(inquiry as any,'trail9ine-inquiry-'+String(inquiry.reference),claimed.recipient)
   accepted=result.success;error=result.error||'';providerMessageId=result.providerMessageId
  }catch{error='Notification dispatch failed. Check provider configuration and retry.'}
  const status=accepted?'completed':count>=maximum?'failed':'pending'
  const updated=await payload.db.updateOne({collection:'notification-outbox',where:owned,data:{status,attempts:count,providerMessageId:providerMessageId||null,lastError:error,leaseToken:null,leaseExpiresAt:null,nextAttemptAt:status==='pending'?new Date(Date.now()+backoff[Math.min(count-1,3)]*60000).toISOString():null}})
  if(!updated)continue
  await payload.update({collection:'inquiries',id:inquiryId,data:{emailStatus:accepted?'provider_accepted':'failed',providerMessageId:providerMessageId||undefined,notificationAttempts:count,lastNotificationAttemptAt:new Date().toISOString(),lastNotificationError:error},overrideAccess:true})
  results.push({id:event.id,success:accepted,...(error?{error}:{})})
 }
 return {processed:results.length,results}
}
