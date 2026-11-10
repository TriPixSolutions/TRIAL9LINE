// Run from a Hostinger cron job with NEXT_PUBLIC_SERVER_URL and WORKER_AUTH_SECRET
// set in the cron environment. Never put the secret in a query string.
const base=process.env.NEXT_PUBLIC_SERVER_URL,secret=process.env.WORKER_AUTH_SECRET
if(!base||!secret)throw new Error('Cron requires NEXT_PUBLIC_SERVER_URL and WORKER_AUTH_SECRET.')
const url=new URL('/api/notifications/worker',base)
if(url.protocol!=='https:')throw new Error('Cron requires the HTTPS deployment URL.')
try {
  const response=await fetch(url,{method:'POST',headers:{authorization:'Bearer '+secret},signal:AbortSignal.timeout(95000),redirect:'error'})
  if(!response.ok)throw new Error('Worker returned HTTP '+response.status)
  const result=await response.json()
  console.log('Notification pass completed:',result.processed,'jobs processed.')
  if(result.results?.some(item=>!item.success))process.exitCode=1
} catch {console.error('Notification cron failed. Inspect the application inbox and runtime logs.');process.exitCode=1}
