import {siteGlobal} from '@/lib/site-content'
import {mediaUrl} from '@/lib/public-projects'
import {isTemplateImage} from '@/lib/editorial-presentation'
import type { Metadata } from 'next'
import { Action, InquiryCTA, StudioImage } from '@/components/public/Studio'
import { studioProcess } from '@/lib/studio-content'
export const metadata: Metadata = { title: 'About the Studio', description: 'Meet Trail9ine Media, an independent creative and marketing studio founded in Toronto in 2025.' }
export default async function AboutPage() {
  const content=await siteGlobal('about-page')
  return <>
    <section className="studio-container page-heading about-hero">

      <div className="about-hero-grid"><h1 className="page-title">{content.heroHeadline}</h1><p>{content.heroIntro}</p></div>
      <div className="media-frame about-image"><StudioImage src={!content.heroImage||isTemplateImage(content.heroImage)?'/images/editorial/polish-about-planning.webp':mediaUrl(content.heroImage)} alt="A creative team planning a hospitality campaign around a studio worktable" priority /></div>

    </section>
    <section className="studio-container section-pad story-grid">
      <div className="story-copy" data-reveal><h2 className="section-title">{content.storyHeading}</h2><p>{content.storyBody}</p><p>Today, our work spans social media, film, photography, branding and digital marketing. Different skills, working towards one consistent impression.</p><p>We have a particular appetite for restaurants and hospitality. The preparation, the people, the atmosphere: there is always more to the story than what is on the menu.</p></div>
      <div className="media-frame story-image" data-reveal><StudioImage src={!content.storyImage||isTemplateImage(content.storyImage)?'/images/editorial/polish-about-on-location.webp':mediaUrl(content.storyImage)} alt="A small production crew setting up a food shoot in a restaurant" sizes="(max-width:767px) 100vw, 50vw" /></div>
    </section>
    <section className="people-section"><div className="studio-container">
      <div className="section-intro" data-reveal>
        <h2 className="section-title">The people behind the work.</h2>
        <p>Riyan and Shamil founded Trail9ine Media in Toronto. The studio brings creative production and marketing together for restaurants and hospitality brands.</p>
      </div>
      <div className="founders-row">
        <article className="founder-name" data-reveal><h3>Riyan</h3><span>Co-founder</span></article>
        <article className="founder-name" data-reveal><h3>Shamil</h3><span>Co-founder</span></article>
      </div>
      <p className="people-support">Editors, designers and social media specialists join the team around each brief. That lets us take a project from the first conversation through production, editing and publishing.</p>
    </div></section>
    <section className="studio-container section-pad"><div className="section-intro"><div><h2 className="section-title">Clear thinking.<br />Careful execution.</h2></div><p>Clarity before output. Craft in the details. Consistency across everything we make.</p></div><div className="process-row">{studioProcess.map((step, i) => <div key={step.title} className="process-item" data-reveal><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
    <InquiryCTA heading="Tell us your story." text="We’ll bring curiosity, a clear direction and the right creative skills." />
  </>
}
