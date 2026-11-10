import {config} from 'dotenv'
config({path:'.env.local',quiet:true})
async function run(){const [{getPayloadClient},{runNotificationWorker}]=await Promise.all([import('../lib/payload'),import('../lib/notification-worker')]);console.log(await runNotificationWorker(await getPayloadClient()));process.exit(0)}
run().catch(()=>{console.error('Worker failed; check database and mail configuration.');process.exit(1)})
