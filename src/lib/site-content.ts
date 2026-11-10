import { agencyAlt } from './agency-imagery'
import {isTemplateImage} from './editorial-presentation'
import {editorialImages} from './editorial-images'
import { cache } from 'react'
import { getPayloadClient } from './payload'
import { studioServices, type StudioService } from './studio-content'
import { mediaUrl } from './public-projects'
export const siteGlobal = cache(async (slug: 'home-page'|'about-page'|'site-settings'|'work-page') => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug, depth: 1, overrideAccess: false })
})
export const siteServices = cache(async (): Promise<StudioService[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({collection:'services',where:{active:{equals:true}},sort:['displayOrder','title'],limit:100,depth:1,overrideAccess:false})
  if (!result.totalDocs) {const count=await payload.count({collection:'services',overrideAccess:true});return count.totalDocs?[]:studioServices}
  return result.docs.map((s:any)=>{
    const defaultService=studioServices.find(item=>item.slug===s.slug)
    const useDefault=defaultService && ((!s.image&&!s.imageUrl) || isTemplateImage(s.image,s.imageUrl))
    return {slug:s.slug,title:s.title,shortTitle:s.shortTitle,headline:s.headline,description:s.description,
      image:useDefault?defaultService.image:mediaUrl(s.image,s.imageUrl),
      detailImage:useDefault?defaultService.detailImage:undefined, detailImageAlt:useDefault?Object.values(editorialImages).find(image=>image.src===defaultService.detailImage)?.alt:undefined,
      imageAlt:useDefault?(Object.values(editorialImages).find(image=>image.src===defaultService.image)?.alt || defaultService.imageAlt):agencyAlt(s.image,s.imageUrl,s.imageAlt || s.image?.alt || s.title),
      scope:(s.scope||[]).map((v:any)=>v.text),related:(s.relatedProjects||[]).map((p:any)=>typeof p==='object'?p.slug:'').filter(Boolean),contactValue:s.contactValue}
  })
})
