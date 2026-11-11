import {siteGlobal} from '@/lib/site-content'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { publicProjects, projectCard } from '@/lib/public-projects'
import { ProjectCard } from '@/components/public/ProjectCard'
import { Arrow, InquiryCTA } from '@/components/public/Studio'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Selected Work', description: 'Explore film, food photography and social media projects by Toronto creative studio Trail9ine Media.' }
export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const query = await searchParams
  const settings=await siteGlobal('work-page')
  const headline = settings.headline === 'The work.' ? 'Good work has a point of view.' : settings.headline
  const previousIntro = 'Food, atmosphere and the character behind a brand. A selection of stories we’ve helped bring into focus.'
  const intro = settings.intro === previousIntro ? 'Selected films, campaigns and creative work for restaurants and hospitality brands.' : settings.intro
  const limit=Math.min(24,Math.max(3,Number(settings.pageSize)||12))
  const payload = await getPayloadClient()
  const categoryResult = await payload.find({ collection: 'categories', where: { active: { equals: true } }, sort: 'displayOrder', limit: 100, overrideAccess: false })
  const categories = [{ name: 'All projects', slug: 'all', id: undefined as string | number | undefined }, ...categoryResult.docs.map(c => ({ name: String(c.name), slug: String(c.slug), id: c.id }))]
  const requestedCategory = query.category || 'all'
  const active = categories.find(c => c.slug === requestedCategory) || categories[0]
  let page = Math.max(1, Math.min(10000, Number.parseInt(query.page || '1', 10) || 1))
  let result = await publicProjects({ categoryId: active.id, page, limit })
  if (result.totalPages && page > result.totalPages) { page = result.totalPages; result = await publicProjects({ categoryId: active.id, page, limit }) }
  const pageHref = (number: number) => '/work?' + new URLSearchParams({ ...(active.slug !== 'all' ? { category: active.slug } : {}), page: String(number) }).toString()
  return <>
    <section className="studio-container page-heading work-heading">

      <h1 className="page-title">{headline}</h1>
      <div className="page-heading-bottom"><p>{intro}</p><Link className="text-link" href="/contact">Make something with us <Arrow diagonal /></Link></div>
    </section>
    <section className="studio-container" aria-label="Project collection">
      <div className="work-toolbar" data-reveal>{settings.showFilters!==false&&<nav className="work-filters" aria-label="Filter projects by category">{categories.map(cat => <Link key={cat.slug} href={cat.slug === 'all' ? '/work' : '/work?category=' + encodeURIComponent(cat.slug)} aria-current={active.slug === cat.slug ? 'page' : undefined} scroll={false}>{cat.name}</Link>)}</nav>}<span className="work-total">{String(result.totalDocs).padStart(2, '0')} projects</span></div>
      {result.docs.length ? <div className={"work-grid work-columns-"+(settings.columns||"3")+" work-layout-"+settings.gridLayout+" work-ratio-"+settings.imageRatio}>{result.docs.map(doc => <ProjectCard key={doc.id} project={projectCard(doc)} />)}</div> : <div className="empty-state"><p>No projects in this category yet.</p><Link className="text-link" href="/work">Explore all work <Arrow /></Link></div>}
      {result.totalPages > 1 && <nav className="pagination" aria-label="Portfolio pagination">
        {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
        {Array.from({ length: result.totalPages }, (_, i) => i + 1).filter(n => n === 1 || n === result.totalPages || Math.abs(n - page) <= 2).map(n => <Link key={n} href={pageHref(n)} aria-current={n === page ? 'page' : undefined}>{n}</Link>)}
        {page < result.totalPages && <Link href={pageHref(page + 1)}>Next</Link>}
      </nav>}
    </section>
    <InquiryCTA heading="Let’s make the next one." />
  </>
}
