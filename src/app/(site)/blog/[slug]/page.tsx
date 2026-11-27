import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { seoMetadata, siteUrl } from '@/lib/seo'
import '../journal.css'

const getPost = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blogs', where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
    limit: 1, depth: 0, overrideAccess: false,
  })
  if (!docs.length) notFound()
  return docs[0]
})

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug)
  const meta = seoMetadata({ title: post.metaTitle || post.title, description: post.metaDescription || post.summary,
    path: '/blog/' + post.slug, keywords: String(post.keywords || '').split(',').map(k => k.trim()).filter(Boolean) })
  return { ...meta, openGraph: { ...meta.openGraph, type: 'article' as const, modifiedTime: post.updatedAt } }
}

export default async function ArticlePage({ params }: Props) {
  const post = await getPost((await params).slug)
  const data = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title,
    description: post.summary, dateModified: post.updatedAt, mainEntityOfPage: siteUrl + '/blog/' + post.slug,
    author: { '@type': 'Organization', name: 'Trail9ine Media', url: siteUrl } }
  return <article className="studio-container journal journal-story">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
    <Link href="/blog">← Studio blog</Link>
    <h1>{post.title}</h1><p className="journal-summary">{post.summary}</p>
    {String(post.body).split(/\r?\n\s*\r?\n/).map((block, i) => block.startsWith('## ')
      ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>)}
    {post.source && /^https:\/\//i.test(post.source) && <p><a href={post.source}>Further reading · {new URL(post.source).hostname}</a></p>}
  </article>
}
