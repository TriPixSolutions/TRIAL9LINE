import {cloudinaryClient} from '../lib/cloudinary'
import {getPayloadClient} from '../lib/payload'
async function run(){
 await cloudinaryClient().api.ping()
 console.log('Cloudinary API connection verified.')
 const payload=await getPayloadClient()
 const existing=await payload.find({collection:'media',where:{alt:{equals:'Cloudinary integration verification — commercial photography'}},limit:1})
 const asset=existing.docs[0]||await payload.create({collection:'media',data:{alt:'Cloudinary integration verification — commercial photography',mediaType:'image'},filePath:process.cwd()+'/public/images/agency/commercial-photography.webp'})
 if(!asset.cloudinaryId||!asset.url?.startsWith('https://res.cloudinary.com/'))throw new Error('Upload metadata verification failed')
 console.log('Authenticated media upload, persisted metadata and CDN URL verified.')
 process.exit(0)
}run().catch(()=>{console.error('Cloudinary verification failed. Check credentials or network access; no secret values are logged.');process.exit(1)})
