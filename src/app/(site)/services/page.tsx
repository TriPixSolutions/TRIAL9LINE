import Link from 'next/link'
import type { Metadata } from 'next'
import { siteServices } from '@/lib/site-content'
import { Arrow, InquiryCTA, StudioImage } from '@/components/public/Studio'
export const metadata: Metadata = { title: 'Services & Capabilities', description: 'Social media, video production, food photography, branding and digital marketing from Trail9ine Media, Toronto.' }
export default async function ServicesPage() {
  const studioServices=await siteServices()
  return <>
    <section className="services-hero-v2">
      <div className="studio-container services-hero-inner">
        <div><h1>Creative work.<br />From every<br /><span>angle.</span></h1><p>Film, photography, design and marketing. Different skills, working together around your business.</p><a className="text-link" href="#capabilities">Explore our services <Arrow /></a></div>
        <div className="services-hero-images"><div className="media-frame"><StudioImage src="/images/branding-studio.webp" alt="Brand identity materials, typography samples and colour swatches" priority sizes="(max-width:767px) 50vw, 27vw" /></div><div className="media-frame"><StudioImage src="/images/tharavadu-macro.webp" alt="Detailed commercial food photography" priority sizes="(max-width:767px) 50vw, 27vw" /></div></div>
      </div>
    </section>
    <section className="studio-container" id="capabilities" aria-label="Our services">{studioServices.map((service, i) => <article className="service-editorial" key={service.slug} data-reveal>

      <div><h2>{service.title}</h2><p>{service.description}</p><div className="scope-preview">{service.scope.slice(0, 3).map(item => <span key={item}>{item}</span>)}</div><Link className="text-link" href={'/services/' + service.slug}>Explore the service <Arrow diagonal /></Link></div>
      <Link href={'/services/' + service.slug} aria-label={'Explore ' + service.title} className="media-frame"><StudioImage src={service.image} alt={service.imageAlt} sizes="(max-width:767px) 100vw, 35vw" /></Link>
    </article>)}</section>
    <section className="studio-container studio-intro"><div><h2 className="statement">A shoot can be more than a single post.<span className="muted"> We consider how each piece works with the next, so the whole thing feels like you.</span></h2><div className="studio-intro-bottom"><p>Not sure what you need? Tell us about the business and we’ll work out a sensible starting point together.</p><Link className="text-link" href="/contact">Let’s talk <Arrow diagonal /></Link></div></div></section>
    <InquiryCTA heading="What’s next for your brand?" text="A single project or a creative partnership. Let’s find the right starting point." />
  </>
}
