import Link from 'next/link'
import { blogEntries, groups, pageEntries, workEntries } from '@/lib/sitemap-content'
import { seoMetadata } from '@/lib/seo'

export const metadata = seoMetadata({ title: 'Sitemap', description: 'Find Trail9ine Media pages, blog articles and portfolio work.', path: '/sitemap' })

export default async function SitemapDirectory() {
  const sections = await Promise.all([pageEntries(), blogEntries(), workEntries()])
  return <div className="studio-container" style={{ paddingBlock: '5rem', overflowWrap: 'anywhere' }}>
    <h1>Sitemap</h1>
    {groups.map((group, i) => <section key={group.file} style={{ marginTop: '2rem' }}>
      <h2>{group.name}</h2>
      <ul>{sections[i].map(entry => <li key={entry.url}><Link href={entry.url}>{new URL(entry.url).pathname}</Link></li>)}</ul>
    </section>)}
  </div>
}
