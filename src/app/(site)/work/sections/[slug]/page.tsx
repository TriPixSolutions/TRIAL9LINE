import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { portfolioSections, belongsToSection } from '@/lib/portfolio-sections'
import { placementWhere } from '@/lib/project-presentation'
import { PortfolioDiscipline } from '@/components/public/PortfolioDiscipline'
import { InquiryCTA, StudioImage } from '@/components/public/Studio'
import { seoMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'content-production') return seoMetadata({ title: 'Video Production Portfolio Toronto', description: 'Watch cinematic films, campaign videos, restaurant content and social reels produced by Trail9ine Media in Toronto, Canada.', path: '/work/sections/video-production' })
  const section = portfolioSections.find(item => item.slug === slug)
  if (!section) return seoMetadata({ title: 'Portfolio Not Found', description: 'The requested Trail9ine Media portfolio section could not be found.', path: `/work/sections/${slug}`, noIndex: true })
  const descriptions: Record<string, string> = {
    'video-production': 'Watch cinematic films, campaign videos, restaurant content and social reels produced by Trail9ine Media in Toronto, Canada.',
    'content-creation': 'Explore scripted stories, trending reels and viral social content created by Trail9ine Media for Toronto and Canadian brands.',
    'performance-marketing': 'Explore performance marketing campaigns, paid social creative and clear advertising reports from Trail9ine Media in Toronto.',
    'food-photography': 'Explore professional food and restaurant photography by Trail9ine Media for hospitality brands in Toronto and across Canada.',
    'creative-designs': 'Explore social media posters, restaurant campaigns and creative graphic design work by Trail9ine Media in Toronto, Canada.',
  }
  return seoMetadata({ title: `${section.title} Portfolio Toronto`, description: descriptions[section.slug], path: `/work/sections/${section.slug}`, keywords: [`${section.title} Toronto`] })
}
export default async function PortfolioSectionPage({ params }: Props) {
  const { slug } = await params
  if (slug === 'content-production') permanentRedirect('/work/sections/video-production')
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
