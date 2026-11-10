import {v2 as cloudinary, type UploadApiResponse} from 'cloudinary'
export const usesCloudinary = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME)
export function cloudinaryClient(){
 const {CLOUDINARY_CLOUD_NAME:cloud_name,CLOUDINARY_API_KEY:api_key,CLOUDINARY_API_SECRET:api_secret}=process.env
 if(!cloud_name||!api_key||!api_secret) throw new Error('Cloudinary credentials are incomplete. Configure all three server environment values.')
 cloudinary.config({cloud_name,api_key,api_secret,secure:true})
 return cloudinary
}
export async function uploadMediaFile(data:Buffer,mimetype:string):Promise<UploadApiResponse>{
 if(data.length>20*1024*1024) throw new Error('Choose a file smaller than 20 MB.')
 if(!/^image\/(jpeg|png|webp|avif|gif)$/.test(mimetype)&&!/^video\/(mp4|webm)$/.test(mimetype)) throw new Error('Choose a JPG, PNG, WebP, AVIF, GIF, MP4 or WebM file.')
 const client=cloudinaryClient()
 return new Promise((resolve,reject)=>{
  const stream=client.uploader.upload_stream({folder:'trail9ine/projects',resource_type:mimetype.startsWith('video/')?'video':'image',timeout:30000,use_filename:false,unique_filename:true,overwrite:false},(error,result)=>error||!result?reject(new Error('Media upload failed. Please try again.')):resolve(result))
  stream.end(data)
 })
}
