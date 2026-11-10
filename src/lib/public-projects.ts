import type { Where } from 'payload'
import { placementWhere } from './project-presentation'
import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { ProjectCardData } from '@/components/public/ProjectCard'

import { agencyAsset, agencyAlt } from './agency-imagery'
export function mediaUrl(media: unknown, fallback?: string | null): string {
  const source = media && typeof media === 'object' && ('cloudinaryUrl' in media || 'url' in media) ? String((media as any).cloudinaryUrl || (media as any).url || '') : fallback || ''
  if (!source) return ''
  const safe = source.startsWith('/') && !source.startsWith('//') || /^https?:\/\//i.test(source)
  if (!safe) return ''
  const replacement = agencyAsset(media, source)
  if (replacement) return replacement.src
  return source
}
export function projectCard(doc: any): ProjectCardData {
  return { title: doc.title, slug: doc.slug, editorialHeadline: doc.editorialHeadline, servicesSummary: doc.servicesSummary, coverImageUrl: mediaUrl(doc.coverImage, doc.coverImageUrl), coverAlt: agencyAlt(doc.coverImage, doc.coverImageUrl, doc.coverImage?.alt || doc.title), coverPosition: doc.coverImage && !agencyAsset(doc.coverImage, doc.coverImageUrl) ? `${doc.coverImage.focalX??50}% ${doc.coverImage.focalY??50}%` : undefined, categories: (doc.categories || []).filter((c: any) => c && typeof c === 'object') }
}
export async function publicProjects(options: { limit?: number; page?: number; categoryId?: string | number; slugs?: string[]; placement?: 'home'|'work'|'discovery' } = {}) {
  const payload = await getPayloadClient()
  const where: Where = { and: [{_status:{equals:'published'}}, placementWhere(options.placement || 'work') as Where] }
  if (options.categoryId !== undefined) where.categories = { in: [options.categoryId] }
  if (options.slugs) where.slug = { in: options.slugs }
  return payload.find({ collection: 'projects', where, sort: options.placement==='home'?['homeOrder','displayOrder','id']:['displayOrder','id'], limit: Math.max(1, Math.min(100, Math.trunc(options.limit || 12))), page: options.page || 1, depth: 1, select: {title:true,slug:true,editorialHeadline:true,servicesSummary:true,coverImage:true,coverImageUrl:true,categories:true,updatedAt:true}, draft: false, overrideAccess: false })
}
export const publicProject = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'projects', where: { slug: { equals: slug }, _status: { equals: 'published' } }, depth: 2, limit: 1, draft: false, overrideAccess: false })
  return result.docs[0] || null
})

export async function redirectProject(slug:string){
 const payload=await getPayloadClient();const result=await payload.find({collection:'projects',where:{and:[{_status:{equals:'published'}},{'previousSlugs.slug':{equals:slug}}]},limit:1,depth:0,overrideAccess:false,draft:false});return result.docs[0]?.slug
}
