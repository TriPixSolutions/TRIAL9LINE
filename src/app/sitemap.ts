import {portfolioSections} from '@/lib/portfolio-sections'
import type {MetadataRoute} from 'next'
import {siteServices} from '@/lib/site-content'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base=process.env.NEXT_PUBLIC_SERVER_URL||'http://localhost:3000'
 const services=await siteServices()
 return [...['','/about','/services','/work','/contact','/privacy'].map(path=>({url:base+path})),...portfolioSections.map(s=>({url:base+'/work/sections/'+s.slug})),...services.map(s=>({url:base+'/services/'+s.slug}))]
}
export const dynamic='force-dynamic'
