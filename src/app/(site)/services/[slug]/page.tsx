import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { siteServices } from '@/lib/site-content'
import { publicProjects } from '@/lib/public-projects'
import { Action, Arrow, InquiryCTA, StudioImage } from '@/components/public/Studio'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = (await siteServices()).find(s => s.slug === slug)
  return { title: service ? service.title + ' Toronto' : 'Service not found', description: service?.description }
}
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = (await siteServices()).find(s => s.slug === slug)
  if (!service) notFound()
  const related = service.related.length ? (await publicProjects({ slugs: service.related, limit: 2, placement:'discovery' })).docs : []
  const contact = '/contact?service=' + encodeURIComponent(service.contactValue||service.slug)
  return <>
    <section className="studio-container service-detail-hero">
      <div><h1>{service.headline}</h1><p>{service.description}</p><Action href={contact}>Discuss your project</Action></div>
      <div className="media-frame"><StudioImage src={service.detailImage || service.image} alt={service.detailImageAlt || service.imageAlt} priority sizes="(max-width:767px) 100vw, 45vw" /></div>
    </section>
    <section className="studio-container scope-section" data-reveal><div><h2>What we can do for you.</h2></div><ul className="scope-list">{service.scope.map(item => <li key={item}>{item}</li>)}</ul></section>
    {related.length > 0 && <section className="studio-container related-work"><div className="section-intro"><div><h2 className="section-title">See it in the work.</h2></div><Link href="/work" className="text-link">All projects <Arrow diagonal /></Link></div><div className="related-grid">{related.map(doc => <Link key={doc.id} href={'/work/'+doc.slug} className="next-project"><div><h3>{String(doc.title)}</h3><p>{String(doc.servicesSummary || '')}</p></div><Arrow diagonal /></Link>)}</div></section>}
    <InquiryCTA heading="Let’s make it happen." text="Tell us what you have in mind. We’ll take it from there." href={contact} label="Discuss this service" />
  </>
}
