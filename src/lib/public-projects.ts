import type { Where } from 'payload'
import { placementWhere } from './project-presentation'
import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { ProjectCardData } from '@/components/public/ProjectCard'

const presentationAssets: Record<string, string> = {
  '/images/tharavadu-case-study.png': '/images/tharavadu-macro.webp',
  '/images/social-marketing.png': '/images/social-reel-cover.webp',
  '/images/work-grid.png': '/images/hero-culinary.webp',
}
export function mediaUrl(media: unknown, fallback?: string | null): string {
  const source = media && typeof media === 'object' && ('cloudinaryUrl' in media || 'url' in media) ? String((media as any).cloudinaryUrl || (media as any).url || '') : fallback || ''
  if (!source) return ''
  const safe = source.startsWith('/') && !source.startsWith('//') || /^https?:\/\//i.test(source)
  if (!safe) return ''
  if (presentationAssets[source]) return presentationAssets[source]
  const localPhotos = ['hero-culinary', 'food-reel-cover', 'social-reel-cover', 'interior-dining', 'tharavadu-macro']
  for (const name of localPhotos) if (source === '/images/' + name + '.png') return '/images/' + name + '.webp'
  return source
}
export function projectCard(doc: any): ProjectCardData {
  return { title: doc.title, slug: doc.slug, editorialHeadline: doc.editorialHeadline, servicesSummary: doc.servicesSummary, coverImageUrl: mediaUrl(doc.coverImage, doc.coverImageUrl), coverAlt: doc.coverImage?.alt || doc.title, coverPosition: doc.coverImage ? `${doc.coverImage.focalX??50}% ${doc.coverImage.focalY??50}%` : undefined, categories: (doc.categories || []).filter((c: any) => c && typeof c === 'object') }
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
