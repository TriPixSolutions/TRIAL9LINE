import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { seoMetadata } from '@/lib/seo'
import './journal.css'

export const metadata = seoMetadata({
  title: 'Blog on Food Photography, Video and Marketing',
  description: 'Practical notes from Trail9ine Media on photographing menus, filming kitchens and turning restaurant enquiries into bookings.',
  path: '/blog',
})

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'blogs', where: { published: { equals: true } }, sort: '-createdAt',
    pagination: false, depth: 0, overrideAccess: false, select: { title: true, slug: true, summary: true },
  })
  return <section className="studio-container journal">
    <h1>Studio blog</h1>
    <div className="journal-list">{posts.docs.map(post => <article key={post.id}>
      <h2><Link href={'/blog/' + post.slug}>{String(post.title)}</Link></h2>
      <p>{String(post.summary)}</p>
    </article>)}</div>
    {posts.docs.length === 0 && <p>Our next article is on its way.</p>}
  </section>
}
