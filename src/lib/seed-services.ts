import type {Payload} from 'payload'
import {studioServices} from './studio-content'
const values=['social-media','video-production','photography','branding-design','digital-marketing','website-designing']
export async function seedServices(payload:Payload, onlySlug?: string){
 for(const [i,service] of studioServices.entries()){
  if(onlySlug && service.slug!==onlySlug)continue
  const exists=await payload.find({collection:'services',where:{slug:{equals:service.slug}},limit:1,depth:0})
  if(exists.totalDocs)continue
  const projects=service.related.length?await payload.find({collection:'projects',where:{slug:{in:service.related}},limit:100,depth:0}):null
  try { await payload.create({collection:'services',data:{...service,image:undefined,imageUrl:service.image,scope:service.scope.map(text=>({text})),relatedProjects:projects?.docs.map(p=>p.id)||[],contactValue:values[i],displayOrder:i+1,active:true}}) } catch(error) {
   const concurrent=await payload.count({collection:'services',where:{slug:{equals:service.slug}},overrideAccess:true})
   if(!concurrent.totalDocs)throw error
  }
 }
}
