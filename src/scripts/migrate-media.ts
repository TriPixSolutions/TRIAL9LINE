import {getPayloadClient} from '../lib/payload'
import {mediaUrl} from '../lib/public-projects'
import {usesCloudinary} from '../lib/cloudinary'
import {basename,resolve} from 'node:path'
import {access} from 'node:fs/promises'
async function run(){
 if(!usesCloudinary())throw new Error('Configure Cloudinary before importing media.')
 const p=await getPayloadClient(),cache=new Map<string,string|number>()
 async function image(url:string|undefined,alt:string){
  const source=mediaUrl(null,url);if(!source.startsWith('/images/'))return null
  if(cache.has(source))return cache.get(source)
  const filename=basename(source),file=resolve(process.cwd(),'public',source.slice(1))
  if(!file.startsWith(resolve(process.cwd(),'public/images')+'/'))return null
  try{await access(file)}catch{return null}
  const existing=(await p.find({collection:'media',where:{filename:{equals:filename}},limit:1,depth:0})).docs[0]
  const doc=existing||await p.create({collection:'media',data:{alt,mediaType:'image'},filePath:file})
  cache.set(source,doc.id);return doc.id
 }
 const projects=await p.find({collection:'projects',pagination:false,depth:0})
 for(const project of projects.docs){
  const data:any={}
  if(!project.coverImage&&project.coverImageUrl)data.coverImage=await image(project.coverImageUrl,project.editorialHeadline||project.title)
  const gallery=[]
  for(const item of project.gallery||[]){const g={...item};for(const [field,url] of [['mediaItem','imageUrl'],['mediaLeft','imageLeftUrl'],['mediaRight','imageRightUrl'],['videoPoster','videoPosterUrl']])if(!g[field]&&g[url])g[field]=await image(g[url],g.caption||project.title)
   if(g.stripImages){const images=[];for(const row of g.stripImages)images.push({...row,media:row.media||await image(row.url,row.caption||project.title)});g.stripImages=images}gallery.push(g)
  }
  data.gallery=gallery;await p.update({collection:'projects',id:project.id,data,draft:project._status==='draft'})
 }
 const services=await p.find({collection:'services',pagination:false,depth:0})
 for(const service of services.docs)if(!service.image&&service.imageUrl){const id=await image(service.imageUrl,service.imageAlt||service.title);if(id)await p.update({collection:'services',id:service.id,data:{image:id}})}
 console.log('Project and service media imported/reused:',cache.size,'assets. Source files retained.')
 process.exit(0)
}
run().catch(()=>{console.error('Media migration stopped. Existing source files and project URL fallbacks are retained.');process.exit(1)})
