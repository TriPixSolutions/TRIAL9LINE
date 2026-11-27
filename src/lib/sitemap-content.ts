import { getPayloadClient } from './payload'
import { portfolioSections } from './portfolio-sections'
import { siteServices } from './site-content'
import { siteUrl } from './seo'

export const groups = [
  { name: 'Pages and services', file: 'page-sitemap.xml' },
  { name: 'Blog posts', file: 'post-sitemap.xml' },
  { name: 'Portfolio', file: 'work-sitemap.xml' },
] as const

export type Entry = { url: string; updated?: string }

export async function pageEntries(): Promise<Entry[]> {
  const services = await siteServices()
  return ['/', '/about', '/services', '/work', '/blog', '/contact', '/privacy', '/sitemap',
    ...services.map(service => '/services/' + encodeURIComponent(service.slug)),
  ].map(path => ({ url: siteUrl + path }))
}

export async function blogEntries(): Promise<Entry[]> {
  const payload = await getPayloadClient()
  const posts = await payload.find({ collection: 'blogs', where: { published: { equals: true } },
    pagination: false, depth: 0, overrideAccess: false, select: { slug: true, updatedAt: true } })
  return posts.docs.map(post => ({ url: siteUrl + '/blog/' + encodeURIComponent(String(post.slug)), updated: String(post.updatedAt) }))
}

export async function workEntries(): Promise<Entry[]> {
  const payload = await getPayloadClient()
  const projects = await payload.find({ collection: 'projects', where: { _status: { equals: 'published' } },
    pagination: false, draft: false, depth: 0, overrideAccess: false, select: { slug: true, updatedAt: true } })
  return [
    ...portfolioSections.map(section => ({ url: siteUrl + '/work/sections/' + section.slug })),
    ...projects.docs.map(project => ({ url: siteUrl + '/work/' + encodeURIComponent(String(project.slug)), updated: String(project.updatedAt) })),
  ]
}
