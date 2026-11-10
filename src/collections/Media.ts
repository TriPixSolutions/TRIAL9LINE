import {APIError,type Field,type CollectionConfig} from 'payload'
import path from 'path'
import { manageContent } from '../lib/access'
import {usesCloudinary,uploadMediaFile} from '../lib/cloudinary'
const providerFields=['cloudinaryId','cloudinaryAssetId','cloudinaryVersion','cloudinaryUrl','cloudinaryResourceType']
export const Media:CollectionConfig={
 slug:'media',labels:{singular:'Media asset',plural:'Media Library'},
 upload:{
  focalPoint:true,
  staticDir:path.resolve(process.cwd(),'public/media'),disableLocalStorage:usesCloudinary(),
  mimeTypes:['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm'],
  adminThumbnail:({doc})=>String(doc.cloudinaryUrl||doc.url||'')||null,
 },
 admin:{useAsTitle:'alt',defaultColumns:['filename','alt','mimeType','updatedAt'],group:'Portfolio',description:'Upload once, reuse across your projects. Images are public assets; keep confidential files out of the library. Maximum file size: 20 MB.'},
 access:{read:()=>true,create:manageContent,update:manageContent,delete:manageContent},
 hooks:{
  beforeChange:[async({data,req,originalDoc,context})=>{
   if(context.mediaImport) return data
   // Provider metadata is written only from an actual server upload, never from submitted form fields.
   for(const key of providerFields) data[key]=originalDoc?.[key]||null
   if(req.file&&usesCloudinary()){
    try{
     const asset=await uploadMediaFile(req.file.data,req.file.mimetype)
     Object.assign(data,{cloudinaryId:asset.public_id,cloudinaryAssetId:asset.asset_id,cloudinaryVersion:asset.version,cloudinaryUrl:asset.secure_url,cloudinaryResourceType:asset.resource_type,width:asset.width,height:asset.height})
    }catch{throw new APIError('The image could not be uploaded to Cloudinary. Check the connection or try again.',502)}
   }
   return data
  }],
  afterRead:[({doc})=>{if(doc.cloudinaryUrl){doc.url=doc.cloudinaryUrl;doc.thumbnailURL=doc.cloudinaryUrl}return doc}],
  beforeDelete:[async({id,req})=>{
   const paths=['coverImage','gallery.mediaItem','gallery.mediaLeft','gallery.mediaRight','gallery.videoPoster','gallery.stripImages.media']
   const projects=await req.payload.find({collection:'projects',where:{or:paths.map(p=>({[p]:{equals:id}}))},limit:1,depth:0,draft:true,overrideAccess:true,req})
   const published=await req.payload.find({collection:'projects',where:{or:paths.map(p=>({[p]:{equals:id}}))},limit:1,depth:0,draft:false,overrideAccess:true,req})
   const globals=await Promise.all(['home-page','about-page'].map(slug=>req.payload.findGlobal({slug,depth:0,overrideAccess:true,req})))
   const services=await req.payload.find({collection:'services',where:{image:{equals:id}},limit:1,depth:0,overrideAccess:true,req})
   if(projects.totalDocs||published.totalDocs||services.totalDocs||globals.some(g=>g.heroImage===id||g.storyImage===id)) throw new APIError('This asset is used by a project or service. Replace it there before removing it from the library.',409)
   // Keep originals in Cloudinary for recovery. Removing a library record never destroys a provider file.
  }],
 },
 fields:[
  {name:'alt',type:'text',required:true,label:'Describe this image',admin:{description:'A short description for screen readers and your media library.'}},
  {name:'caption',type:'text',label:'Default caption (optional)'},
  {name:'mediaType',type:'select',defaultValue:'image',options:[{label:'Image',value:'image'},{label:'Video',value:'video'}]},
  ...providerFields.map(name=>({name,type:name==='cloudinaryVersion'?'number':'text',admin:{hidden:true}} as Field)),
 ],
}
