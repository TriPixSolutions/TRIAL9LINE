'use client'
import React,{useState} from 'react'
import {useDocumentInfo,useFormFields} from '@payloadcms/ui'
export function InquiryRetry(){
 const {id}=useDocumentInfo(),status=useFormFields(([fields])=>fields.emailStatus?.value as string)
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('')
 if(!id)return null
 async function retry(){setBusy(true);setMessage('');try{const response=await fetch('/api/inquiries/retry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({inquiryId:id})});const result=await response.json();if(!response.ok)throw new Error(result.error);setMessage(result.results?.[0]?.success?'Notification accepted by the email provider. Refresh to see the latest status.':result.results?.[0]?.error||'Notification is queued for processing.')}catch(error){setMessage(error instanceof Error?error.message:'Could not retry.')}finally{setBusy(false)}}
 return <div className="studio-admin-guide"><div><h3>Email notification</h3><p>The inquiry is saved independently of email delivery. Only failed jobs can be retried.</p><p role="status">{message}</p></div><button className="studio-admin-primary" type="button" disabled={busy||status!=='failed'} onClick={retry}>{busy?'Retrying…':'Retry failed notification'}</button></div>
}
