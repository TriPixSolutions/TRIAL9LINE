import { siteGlobal } from '@/lib/site-content'
import type { Metadata } from 'next'
import { PortfolioSections } from '@/components/public/PortfolioSections'
import { InquiryCTA } from '@/components/public/Studio'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Our Work', description: 'Explore video production, content creation, performance marketing, food photography and creative design by Trail9ine Media.' }
export default async function WorkPage() {
  const settings = await siteGlobal('work-page')
  return <>
    <section className="studio-container page-heading work-heading">
      <h1 className="page-title">{settings.headline}</h1>
      <div className="page-heading-bottom"><p>{settings.intro}</p></div>
    </section>
    <section className="studio-container" aria-label="Explore work by service"><PortfolioSections className={"work-grid work-columns-" + (settings.columns || "3") + " work-layout-" + (settings.gridLayout || "uniform") + " work-ratio-" + (settings.imageRatio || "landscape")} /></section>
    <InquiryCTA heading="Let’s make the next one." />
  </>
}
