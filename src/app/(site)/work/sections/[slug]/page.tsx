import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { portfolioSections, belongsToSection, sectionGallery } from '@/lib/portfolio-sections'
import { placementWhere } from '@/lib/project-presentation'
import { editorialGallery } from '@/lib/editorial-presentation'
import { mediaUrl } from '@/lib/public-projects'
import { GalleryBlock } from '@/components/public/GalleryBlock'
import { InquiryCTA, StudioImage } from '@/components/public/Studio'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const section = portfolioSections.find(item => item.slug === slug)
  return { title: section?.title || 'Work not found', description: section?.description }
}
export default async function PortfolioSectionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const section = portfolioSections.find(item => item.slug === slug)
  if (!section) notFound()
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'projects', where: { and: [{ _status: { equals: 'published' } }, placementWhere('work')] }, select: { servicesSummary: true, categories: true, portfolioSections: true }, depth: 1, pagination: false, overrideAccess: false, draft: false, sort: ['displayOrder', 'id'] })
  const projects = result.docs.filter(project => belongsToSection(project, slug))
  const pageCount = Math.max(1, Math.ceil(projects.length / 6))
  const page = Math.min(pageCount, Math.max(1, parseInt((await searchParams).page || '1', 10) || 1))
  const ids = projects.slice((page - 1) * 6, page * 6).map(project => project.id)
  const visible = ids.length ? (await payload.find({ collection: 'projects', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }, placementWhere('work')] }, limit: 6, depth: 2, overrideAccess: false, draft: false, sort: ['displayOrder', 'id'] })).docs : []
  return <>
    <section className="studio-container page-heading"><h1 className="page-title">{section.title}</h1><div className="page-heading-bottom"><p>{section.description}</p><Link className="text-link" href="/work">Explore all work</Link></div></section>
    <section className="studio-container project-gallery" aria-label={section.title + ' portfolio'}>
      {visible.map(project => <article key={project.id} className="portfolio-contribution">
        {project.overview && <p className="portfolio-intro">{project.overview}</p>}
        {sectionGallery(editorialGallery(project, mediaUrl), slug).map((block: any, index: number) => <GalleryBlock key={block.id || index} block={block} />)}
      </article>)}
      {!projects.length && <div className="empty-state"><p>Selected work in this discipline is being prepared. Get in touch to discuss your project.</p></div>}
      {!projects.length && <div className="media-frame" style={{ aspectRatio: '16/9' }}><StudioImage src={section.image} alt={section.title + ' studio illustration'} /></div>}
      {pageCount > 1 && <nav className="pagination" aria-label="More portfolio work">
        {page > 1 && <Link href={'?page=' + (page - 1)}>Previous</Link>}
        <span>{page} / {pageCount}</span>
        {page < pageCount && <Link href={'?page=' + (page + 1)}>Next</Link>}
      </nav>}
    </section>
    <InquiryCTA heading="Let’s make something together." />
  </>
}
