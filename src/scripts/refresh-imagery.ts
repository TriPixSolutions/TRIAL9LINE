import { resolve } from 'node:path'
import { getPayloadClient } from '../lib/payload'
import { agencyAsset } from '../lib/agency-imagery'

async function run() {
  const apply = process.argv.includes('--apply')
  const payload = await getPayloadClient()
  const media = await payload.find({collection:'media',pagination:false,depth:0})
  let count=0
  for (const doc of media.docs) {
    const replacement=agencyAsset(doc)
    if (!replacement || doc.caption==='Illustrative agency imagery') continue
    count++
    if(apply) await payload.update({collection:'media',id:doc.id,filePath:resolve(process.cwd(),'public',replacement.src.slice(1)),data:{alt:replacement.alt,caption:'Illustrative agency imagery',focalX:50,focalY:50}})
  }
  console.log(`${apply?'Updated':'Would update'} ${count} bundled template media records. Other uploads are preserved.`)
}
run().then(()=>process.exit(0)).catch(()=>{console.error('Image refresh stopped. Check database and media-provider connectivity; rerunning safely skips completed records.');process.exit(1)})
