import {portfolioSections} from '@/lib/portfolio-sections'
import type {MetadataRoute} from 'next'
import {siteServices} from '@/lib/site-content'
import {getPayloadClient} from '@/lib/payload'
import {siteUrl} from '@/lib/seo'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const [services,payload]=await Promise.all([siteServices(),getPayloadClient()])
 const projects=await payload.find({collection:'projects',where:{_status:{equals:'published'}},limit:100,depth:0,draft:false,overrideAccess:false,select:{slug:true,updatedAt:true}})
 const pages:MetadataRoute.Sitemap=[
  {url:siteUrl,changeFrequency:'weekly',priority:1},
  ...['/about','/services','/work','/contact','/privacy'].map(path=>({url:siteUrl+path,changeFrequency:'monthly' as const,priority:path==='/work'||path==='/services'?0.9:0.7})),
  ...portfolioSections.map(section=>({url:`${siteUrl}/work/sections/${section.slug}`,changeFrequency:'weekly' as const,priority:0.9})),
  ...services.map(service=>({url:`${siteUrl}/services/${service.slug}`,changeFrequency:'monthly' as const,priority:0.8})),
  ...projects.docs.map(project=>({url:`${siteUrl}/work/${project.slug}`,lastModified:project.updatedAt,changeFrequency:'monthly' as const,priority:0.7})),
 ]
 return pages
}
export const dynamic='force-dynamic'
