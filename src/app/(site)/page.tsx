import {siteGlobal,siteServices} from '@/lib/site-content'
import {mediaUrl} from '@/lib/public-projects'
import {isTemplateImage} from '@/lib/editorial-presentation'
import {StudioAccent} from '@/components/public/StudioAccent'
import Link from 'next/link'
import Image from 'next/image'

import { PortfolioSections } from '@/components/public/PortfolioSections'
import { Action, Arrow, InquiryCTA, StudioImage } from '@/components/public/Studio'
import { seoMetadata } from '@/lib/seo'
export const dynamic = 'force-dynamic'
export const metadata = seoMetadata({
  title: 'Creative Marketing Agency Toronto | Trail9ine Media',
  description: 'Trail9ine Media is a Toronto creative marketing agency specializing in video production, content creation, food photography, design and paid advertising.',
  path: '/',
  keywords: ['restaurant marketing agency Toronto', 'hospitality marketing Toronto'],
})
const clientLogos = [
  { name: '90s Lounge', src: '/images/clients/90s-lounge.png' },
  { name: 'Biryani N BarBQ', src: '/images/clients/biryani-n-barbq.png' },
  { name: 'Dosa King', src: '/images/clients/dosa-king.png' },
  { name: 'Kairali', src: '/images/clients/kairali.png' },
  { name: 'Lulu Shawarma & Meat', src: '/images/clients/lulu-shawarma.png' },
  { name: 'Piravi Indian Bistro', src: '/images/clients/piravi.png' },
  { name: 'Tharavadu', src: '/images/clients/tharavadu.png' },
]
const homeProcess = [
  { title: 'Discover & Plan', text: 'We learn about your business, audience and goals. Then we develop a creative direction and content plan tailored to your brand.' },
  { title: 'Create & Produce', text: 'From planning and filming to photography and editing, we handle the creative production and prepare the final content for your review.' },
  { title: 'Publish & Improve', text: 'We help bring your content to the right platforms, maintain a consistent presence and review performance to guide what comes next.' },
]
export default async function HomePage() {
  const [content,studioServices]=await Promise.all([siteGlobal('home-page'),siteServices()])
  const customHero = content.heroImage && !isTemplateImage(content.heroImage) ? content.heroImage : null
  const heroSource = mediaUrl(customHero) || '/images/editorial/home-restaurant-campaign.webp'
  const oldHeadline = 'Creative marketing\nfor brands\nthat grow.'
  const headline = content.heroHeadline && content.heroHeadline !== oldHeadline
    ? content.heroHeadline
    : 'Creative work\nthat moves brands.'
  const heroLines = String(headline).split('\n').filter(Boolean)
  return <>
    <section className="campaign-hero" aria-labelledby="hero-title">
      <div className="campaign-scene">
        <StudioImage
          src={heroSource}
          alt={customHero?.alt || 'An editor checks social insights on a phone while editing a restaurant reel, with a camera and storyboard nearby'}
          priority
          sizes="(max-width:1100px) 100vw, 74vw"
        />
      </div>
      <div className="studio-container campaign-hero-inner">
        <div className="campaign-copy">
          <h1 id="hero-title">{heroLines.map((line,i)=><span key={i} className={i === heroLines.length - 1 && i > 0 ?"campaign-grow":"hero-copy-line"}>{line}{i<heroLines.length-1&&<br/>}</span>)}</h1>
          <p className="campaign-description">{content.heroIntro}</p>
          <div className="campaign-actions"><Action href="/contact" light>Start a project</Action><Link href="#selected-work" className="campaign-work-link">View selected work <Arrow diagonal /></Link></div>
        </div>
        <Link href="/services" className="campaign-service-note" aria-label="Explore our strategy, content and growth services">
          <span>Strategy</span>
          <span>Content</span>
          <span>Growth <Arrow diagonal /></span>
        </Link>
      </div>
    </section>
    <section className="studio-container section-pad" id="selected-work">
      <div className="section-intro" data-reveal><div><h2 className="section-title">A little of<br />what we do.</h2></div><p>Film, content, campaigns, photography and design.<br />Explore our work by discipline.</p></div>
      <PortfolioSections />
      <div className="section-bottom"><p>Content, campaigns and collaborations.</p><Link className="text-link" href="/work">View all projects <Arrow diagonal /></Link></div>
    </section>
    <section className="studio-container studio-intro" data-reveal><div><h2 className="statement">{content.agencyIntroHeading}</h2><div className="studio-intro-bottom"><p>{content.agencyIntroBody}</p><Link className="text-link" href="/about">Meet the studio <Arrow diagonal /></Link></div></div></section>
    <section className="capability-section"><div className="studio-container capability-layout"><div data-reveal><h2 className="section-title">Good thinking.<br />Better making.</h2><p>A single production or a connected brand presence. We bring the right skills to the table.</p><div className="media-frame"><StudioImage src="/images/bts/home-production-set.webp" alt="Trail9ine Media filming food content on location in a Toronto restaurant" sizes="250px" /></div></div>
      <div className="capability-services" data-reveal="capability">{studioServices.map((service, i) => <Link className="service-line" href={'/services/' + service.slug} key={service.slug}><span className="service-index">0{i + 1}</span><h3>{service.shortTitle}</h3><Arrow diagonal /></Link>)}</div>
    </div></section>
    <section className="home-clients" aria-labelledby="home-clients-title">
      <div className="studio-container home-clients-inner">
        <p className="home-clients-kicker">Selected clients</p>
        <h2 id="home-clients-title">Brands we’ve helped<br />show up with confidence.</h2>
        <div className="home-client-grid">
          {clientLogos.map(client => <div className="home-client-logo" key={client.name}>
            <Image src={client.src} alt={`${client.name} logo`} width={1000} height={420} sizes="(max-width: 700px) 44vw, (max-width: 1100px) 29vw, 21vw" />
          </div>)}
        </div>
      </div>
    </section>
    <section className="studio-container section-pad"><div className="section-intro"><div><StudioAccent /><h2 className="section-title">Simple process.<br />Considered work.</h2></div><p>From understanding your business to creating content that represents your brand, we make the process straightforward.</p></div><div className="process-row">{homeProcess.map((step, i) => <div className="process-item" key={step.title} data-reveal><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
    <InquiryCTA />
  </>
}
