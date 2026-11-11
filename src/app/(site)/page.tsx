import {siteGlobal,siteServices} from '@/lib/site-content'
import {mediaUrl} from '@/lib/public-projects'
import {isTemplateImage} from '@/lib/editorial-presentation'
import {StudioAccent} from '@/components/public/StudioAccent'
import Link from 'next/link'
import { publicProjects, projectCard } from '@/lib/public-projects'
import { studioProcess } from '@/lib/studio-content'
import { ProjectCard } from '@/components/public/ProjectCard'
import { Action, Arrow, InquiryCTA, StudioImage } from '@/components/public/Studio'
export const dynamic = 'force-dynamic'
export default async function HomePage() {
  const [content,studioServices]=await Promise.all([siteGlobal('home-page'),siteServices()])
  const customHero = content.heroImage && !isTemplateImage(content.heroImage) ? content.heroImage : null
  const heroSource = mediaUrl(customHero) || '/images/editorial/home-restaurant-campaign.webp'
  const oldHeadline = 'Creative marketing\nfor brands\nthat grow.'
  const headline = content.heroHeadline && content.heroHeadline !== oldHeadline
    ? content.heroHeadline
    : 'Creative work\nthat moves brands.'
  const heroLines = String(headline).split('\n').filter(Boolean)
  const result = await publicProjects({ limit: Number(content.homeProjectLimit)||4, placement:'home' })
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
          <div className="campaign-actions"><Action href="/contact" light>Start a project</Action><Link href={result.docs.length ? "#selected-work" : "/work"} className="campaign-work-link">View selected work <Arrow diagonal /></Link></div>
        </div>
        <Link href="/services" className="campaign-service-note" aria-label="Explore our strategy, content and growth services">
          <span>Strategy</span>
          <span>Content</span>
          <span>Growth <Arrow diagonal /></span>
        </Link>
      </div>
    </section>
    {result.docs.length>0&&<section className="studio-container section-pad" id="selected-work">
      <div className="section-intro" data-reveal><div><h2 className="section-title">A little of<br />what we do.</h2></div><p>Different restaurants. Distinct personalities.<br />A closer look at the stories we help tell.</p></div>
      <div className="featured-grid">{result.docs.map(doc => <div key={doc.id} data-reveal><ProjectCard project={projectCard(doc,'home')} /></div>)}</div>
      <div className="section-bottom"><p>Content, campaigns and collaborations.</p><Link className="text-link" href="/work">View all projects <Arrow diagonal /></Link></div>
    </section>}
    <section className="studio-container studio-intro" data-reveal><div><h2 className="statement">{content.agencyIntroHeading}</h2><div className="studio-intro-bottom"><p>{content.agencyIntroBody}</p><Link className="text-link" href="/about">Meet the studio <Arrow diagonal /></Link></div></div></section>
    <section className="capability-section"><div className="studio-container capability-layout"><div data-reveal><h2 className="section-title">Good thinking.<br />Better making.</h2><p>A single production or a connected brand presence. We bring the right skills to the table.</p><div className="media-frame"><StudioImage src="/images/editorial/home-capability.webp" alt="A professional video editing workstation in natural daylight" sizes="250px" /></div></div>
      <div className="capability-services" data-reveal="capability">{studioServices.map((service, i) => <Link className="service-line" href={'/services/' + service.slug} key={service.slug}><span className="service-index">0{i + 1}</span><h3>{service.shortTitle}</h3><Arrow diagonal /></Link>)}</div>
    </div></section>
    <section className="studio-container section-pad"><div className="section-intro"><div><StudioAccent /><h2 className="section-title">Simple process.<br />Considered work.</h2></div><p>Understanding the business comes first. Everything we make follows from there.</p></div><div className="process-row">{studioProcess.map((step, i) => <div className="process-item" key={step.title} data-reveal><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
    <InquiryCTA />
  </>
}
