import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { portfolioSections, belongsToSection } from '@/lib/portfolio-sections'
import { placementWhere } from '@/lib/project-presentation'
import { PortfolioDiscipline } from '@/components/public/PortfolioDiscipline'
import { InquiryCTA, StudioImage } from '@/components/public/Studio'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'video-production' || slug === 'content-creation') return { title: 'Content Production', description: 'Films, reels and social-first stories made for screens of every shape.' }
  const section = portfolioSections.find(item => item.slug === slug)
  return { title: section?.title || 'Work not found', description: section?.description }
}
export default async function PortfolioSectionPage({ params }: Props) {
  const { slug } = await params
  if (slug === 'video-production' || slug === 'content-creation') permanentRedirect('/work/sections/content-production')
  const section = portfolioSections.find(item => item.slug === slug)
  if (!section) notFound()
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'projects', where: { and: [{ _status: { equals: 'published' } }, placementWhere('work')] }, depth: 2, pagination: false, overrideAccess: false, draft: false, sort: ['displayOrder', 'id'] })
  const projects = result.docs.filter(project => belongsToSection(project, slug))
  return <>
    <section className="studio-container page-heading"><h1 className="page-title">{section.title}</h1><div className="page-heading-bottom"><p>{section.description}</p><Link className="text-link" href="/work">Explore all work</Link></div></section>
    <main className="studio-container discipline-portfolio" aria-label={section.title + ' portfolio'}>
      {projects.length > 0 && <PortfolioDiscipline slug={slug} projects={projects} />}
      {!projects.length && <div className="empty-state"><p>Selected work in this discipline is being prepared. Get in touch to discuss your project.</p></div>}
      {!projects.length && <div className="media-frame" style={{ aspectRatio: '16/9' }}><StudioImage src={section.image} alt={section.title + ' studio illustration'} /></div>}
    </main>
    <InquiryCTA heading="Let’s make something together." />
  </>
}
