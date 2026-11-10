import {NextRequest,NextResponse} from 'next/server'
import {timingSafeEqual} from 'node:crypto'
import {getPayloadClient} from '@/lib/payload'
import {runNotificationWorker} from '@/lib/notification-worker'
export const dynamic='force-dynamic'
export const maxDuration=90
async function run(req:NextRequest){
 const expected=process.env.WORKER_AUTH_SECRET
 const provided=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'').trim()||''
 if(!expected||provided.length!==expected.length||!timingSafeEqual(Buffer.from(provided),Buffer.from(expected)))return NextResponse.json({error:'Unauthorized worker invocation'},{status:401})
 try{return NextResponse.json(await runNotificationWorker(await getPayloadClient()))}catch{return NextResponse.json({error:'Worker could not complete this pass'},{status:500})}
}
export const POST=run
export const GET=run
