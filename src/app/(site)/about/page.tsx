import {siteGlobal} from '@/lib/site-content'
import {mediaUrl} from '@/lib/public-projects'
import type { Metadata } from 'next'
import { Action, InquiryCTA, StudioImage } from '@/components/public/Studio'
import { studioProcess } from '@/lib/studio-content'
export const metadata: Metadata = { title: 'About the Studio', description: 'Meet Trail9ine Media, an independent creative and marketing studio founded in Toronto in 2025.' }
export default async function AboutPage() {
  const content=await siteGlobal('about-page')
  return <>
    <section className="studio-container page-heading about-hero">

      <div className="about-hero-grid"><h1 className="page-title">{content.heroHeadline}</h1><p>{content.heroIntro}</p></div>
      <div className="media-frame about-image"><StudioImage src={mediaUrl(content.heroImage,"/images/interior-dining.webp")} alt="A lively restaurant filled with people, warm light and conversation" priority /></div>

    </section>
    <section className="studio-container section-pad story-grid">
      <div className="story-copy" data-reveal><h2 className="section-title">{content.storyHeading}</h2><p>{content.storyBody}</p><p>Today, our work spans social media, film, photography, branding and digital marketing. Different skills, working towards one consistent impression.</p><p>We have a particular appetite for restaurants and hospitality. The preparation, the people, the atmosphere: there is always more to the story than what is on the menu.</p></div>
      <div className="media-frame story-image" data-reveal><StudioImage src={mediaUrl(content.storyImage,"/images/food-reel-cover.webp")} alt="Hands preparing and presenting a restaurant dish" sizes="(max-width:767px) 100vw, 50vw" /></div>
    </section>
    <section className="people-section"><div className="studio-container">
      <div className="section-intro"><div><h2 className="section-title">Small studio.<br />Shared ambition.</h2></div><p>Co-founded by Riyan and Shamil, bringing together creative production and marketing expertise.</p></div>
      <div className="founders-row"><div className="founder-name"><h3>Riyan</h3><span>Co-founder</span></div><div className="founder-name"><h3>Shamil</h3><span>Co-founder</span></div></div>
      <p className="people-support">Supported by a collaborative network of editors, designers, content planners and social media specialists.</p>
    </div></section>
    <section className="studio-container section-pad"><div className="section-intro"><div><h2 className="section-title">Clear thinking.<br />Careful execution.</h2></div><p>Clarity before output. Craft in the details. Consistency across everything we make.</p></div><div className="process-row">{studioProcess.map((step, i) => <div key={step.title} className="process-item" data-reveal><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
    <InquiryCTA heading="Tell us your story." text="We’ll bring curiosity, a clear direction and the right creative skills." />
  </>
}
