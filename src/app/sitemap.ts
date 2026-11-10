import type {MetadataRoute} from 'next'
import {getPayloadClient} from '@/lib/payload'
import {placementWhere} from '@/lib/project-presentation'
import {siteServices} from '@/lib/site-content'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base=process.env.NEXT_PUBLIC_SERVER_URL||'http://localhost:3000',p=await getPayloadClient()
 const projects=await p.find({collection:'projects',where:{and:[{_status:{equals:'published'}},placementWhere('discovery')]},pagination:false,depth:0,overrideAccess:false,draft:false})
 const services=await siteServices()
 return [...['','/about','/services','/work','/contact','/privacy'].map(path=>({url:base+path})),...services.map(s=>({url:base+'/services/'+s.slug})),...projects.docs.map(d=>({url:base+'/work/'+d.slug,lastModified:new Date(d.updatedAt)}))]
}
export const dynamic='force-dynamic'
