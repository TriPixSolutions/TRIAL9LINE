import { StudioImage } from './Studio'
import { ProjectVideo } from './ProjectVideo'
import { resolveSectionVideo, type ProjectVideoSource } from '@/lib/project-video'
import { editorialGallery } from '@/lib/editorial-presentation'
import { mediaUrl } from '@/lib/public-projects'
import { PortfolioCategoryFilter, type PortfolioFilterCategory } from './PortfolioCategoryFilter'

type Project = Record<string, any>

function category(value: unknown): PortfolioFilterCategory | null {
  if (!value || typeof value !== 'object') return null
  const item = value as { slug?: unknown; name?: unknown; active?: unknown }
  if (item.active === false || typeof item.slug !== 'string' || typeof item.name !== 'string') return null
  return { slug: item.slug, name: item.name }
}

function filterCategories(items: { category?: PortfolioFilterCategory | null }[]) {
  return [...new Map(items.flatMap(item => item.category ? [[item.category.slug, item.category] as const] : [])).values()]
}

function assetUrl(value: unknown, fallback?: string | null) {
  if (value && typeof value === 'object') {
    const asset = value as { cloudinaryUrl?: string; url?: string }
    return asset.cloudinaryUrl || asset.url || fallback || null
  }
  return fallback || null
}

function legacyEntries(projects: Project[]) {
  return projects.map(project => {
    const blocks = editorialGallery(project, mediaUrl) as any[]
    const result = blocks.find(block => block.blockType === 'videoResults') || blocks.find(block => block.blockType === 'video')
    const media = blocks.flatMap(block => block.blockType === 'mediaGrid' ? block.gridItems || [] : [])
    return {
      id: project.id,
      title: project.title,
      summary: project.editorialHeadline || project.servicesSummary,
      result,
      source: result ? resolveSectionVideo(result.videoFile, result.videoUrl, result.videoShape) : null,
      media,
    }
  })
}

type ContentVideo = {
  id: string
  project: string
  title: string
  caption?: string
  source: ProjectVideoSource
  category?: PortfolioFilterCategory | null
}

function contentVideos(projects: Project[]): ContentVideo[] {
  const dedicated = projects.flatMap(project => [...(project.contentVideos || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).flatMap((video: any, index: number) => {
    const source = resolveSectionVideo(video.videoFile, video.videoUrl, video.format)
    return source ? [{
      id: `${project.id}-content-${video.id || index}`,
      project: project.title,
      title: video.title || project.title,
      caption: video.caption,
      source,
      category: category(video.subcategory),
    }] : []
  }))
  if (dedicated.length) return dedicated

  return legacyEntries(projects).flatMap((item, index) => item.source ? [{
    id: `${item.id}-legacy-${index}`,
    project: item.title,
    title: item.result?.heading || item.title,
    caption: item.result?.caption || item.summary,
    source: item.source,
  }] : [])
}

function VideoPortfolio({ projects, contentCreation = false }: { projects: Project[]; contentCreation?: boolean }) {
  const videos = contentVideos(projects)
  return <section className={`portfolio-showcase content-showcase ${contentCreation?'content-creation-showcase':'video-production-showcase'}`}>
    <header className="showcase-heading">
      <h2>{contentCreation?'Made for the feed.':'Made to be watched.'}</h2>
      <p>{contentCreation?'Social-first reels and everyday brand stories, presented in their original format.':'Films, commercials and cinematic reels—presented in their original format.'}</p>
    </header>
    <PortfolioCategoryFilter categories={filterCategories(videos)}><div className="content-video-grid">
      {videos.map(video => <article data-portfolio-category={video.category?.slug || 'uncategorized'} className={video.source.portrait ? 'content-video is-portrait' : 'content-video is-landscape'} key={video.id}>
        <ProjectVideo source={video.source} title={video.title} instant />
        <div><strong>{video.title}</strong><span>{video.category?.name || video.project}</span>{video.caption && <p>{video.caption}</p>}</div>
      </article>)}
    </div></PortfolioCategoryFilter>
  </section>
}

function compactMetric(value: unknown, fallback = '—') {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
    : fallback
}

type MarketingReport = {
  id: string
  campaign: string
  project: string
  period?: string
  spend?: string
  reach?: number
  impressions?: number
  clicks?: number
  leads?: number
  ctr?: number
  summary?: string
  image?: string | null
  illustrative?: boolean
  category?: PortfolioFilterCategory | null
}

function marketingReports(projects: Project[]): MarketingReport[] {
  const dedicated = projects.flatMap(project => [...(project.marketingReports || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).map((report: any, index: number) => ({
    id: `${project.id}-report-${report.id || index}`,
    project: project.title,
    campaign: report.campaignName || project.title,
    period: report.period,
    spend: report.spend,
    reach: report.results?.reach,
    impressions: report.results?.impressions,
    clicks: report.results?.clicks,
    leads: report.results?.leads,
    ctr: report.results?.ctr,
    summary: report.summary,
    image: assetUrl(report.reportImage, report.reportImageUrl),
    illustrative: report.isIllustrative === true,
    category: category(report.subcategory),
  })))
  if (dedicated.length) return dedicated

  const samples = [
    { reach: 2400000, impressions: 5100000, clicks: 48300, leads: 1280, ctr: 2.8 },
    { reach: 1800000, impressions: 3900000, clicks: 37600, leads: 940, ctr: 3.1 },
    { reach: 860000, impressions: 2100000, clicks: 18900, leads: 610, ctr: 2.4 },
  ]
  return legacyEntries(projects).slice(0, 3).map((item, index) => ({
    id: `${item.id}-sample-report`,
    project: item.title,
    campaign: `${item.title} awareness`,
    period: item.result?.reportingPeriod || 'Portfolio example',
    reach: item.result?.reach || samples[index].reach,
    impressions: samples[index].impressions,
    clicks: samples[index].clicks,
    leads: samples[index].leads,
    ctr: samples[index].ctr,
    summary: 'Illustrative campaign reporting layout',
    illustrative: true,
  }))
}

function PerformanceMarketing({ projects }: { projects: Project[] }) {
  const reports = marketingReports(projects)
  const totalReach = reports.reduce((sum, report) => sum + (report.reach || 0), 0)
  const totalClicks = reports.reduce((sum, report) => sum + (report.clicks || 0), 0)
  const averageCtr = reports.length ? reports.reduce((sum, report) => sum + (report.ctr || 0), 0) / reports.length : 0
  const illustrative = reports.some(report => report.illustrative)

  return <section className="portfolio-showcase marketing-showcase">
    <header className="showcase-heading">
      <h2>Creative that performs.</h2>
      <p>Campaign results presented with the clarity of a Meta Ads report.</p>
    </header>
    <div className="meta-report">
      <div className="meta-report-bar"><strong>Campaign performance</strong><span>{illustrative ? 'Illustrative portfolio report' : 'Campaign reporting'}</span></div>
      <div className="meta-kpis">
        <div><span>Reach</span><strong>{compactMetric(totalReach)}</strong><small>Unique accounts</small></div>
        <div><span>Link clicks</span><strong>{compactMetric(totalClicks)}</strong><small>Across campaigns</small></div>
        <div><span>Average CTR</span><strong>{averageCtr.toFixed(1)}%</strong><small>Click-through rate</small></div>
        <div className="meta-kpi-chart" aria-label="Performance trend"><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="meta-report-body">
        <div className="meta-campaign-list">
          <div className="meta-table-head"><span>Campaign</span><span>Reach</span><span>Clicks</span><span>CTR</span></div>
          {reports.map(report => <article key={report.id}>
            <span><strong>{report.campaign}</strong><small>{report.project} · {report.period || 'Current period'}</small></span>
            <b>{compactMetric(report.reach)}</b><b>{compactMetric(report.clicks)}</b><b>{report.ctr != null ? `${report.ctr}%` : '—'}</b>
          </article>)}
        </div>
        <aside className="meta-result-card">
          {reports[0]?.image ? <StudioImage src={reports[0].image} alt={`${reports[0].campaign} Meta Ads report`} sizes="(max-width:900px) 100vw, 36vw" /> : <>
            <span>RESULT OVERVIEW</span>
            <strong>{compactMetric(reports[0]?.impressions)}</strong>
            <p>Impressions</p>
            <div className="meta-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <small>{reports[0]?.summary || 'Campaign reporting preview'}</small>
          </>}
        </aside>
      </div>
    </div>
    <PortfolioCategoryFilter categories={filterCategories(reports)}><div className="marketing-report-grid">{reports.map(report=><article data-portfolio-category={report.category?.slug || 'uncategorized'} key={`${report.id}-details`}>
      <header><div><span>{report.period || 'Campaign report'}</span><h3>{report.campaign}</h3></div>{report.spend&&<strong>{report.spend}<small>Amount spent</small></strong>}</header>
      {report.image&&<div className="marketing-report-image"><StudioImage src={report.image} alt={`${report.campaign} Meta Ads screenshot`} sizes="(max-width:900px) 100vw, 50vw" /></div>}
      <dl>{[['Reach',report.reach],['Impressions',report.impressions],['Link clicks',report.clicks],['Leads',report.leads],['CTR',report.ctr!=null?`${report.ctr}%`:undefined]].map(([label,value])=><div key={String(label)}><dt>{label}</dt><dd>{typeof value==='number'?compactMetric(value):value||'—'}</dd></div>)}</dl>
      {report.summary&&<p>{report.summary}</p>}
    </article>)}</div></PortfolioCategoryFilter>
    {illustrative && <p className="report-disclaimer">Sample figures are illustrative and can be replaced with confirmed Meta Ads results in the dashboard.</p>}
  </section>
}

type PortfolioImage = { id: string; project: string; title?: string; description?: string; url: string; category?: PortfolioFilterCategory | null }

function foodPhotos(projects: Project[]): PortfolioImage[] {
  const dedicated = projects.flatMap(project => [...(project.foodPhotos || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).flatMap((photo: any, index: number) => {
    const url = assetUrl(photo.photo, photo.photoUrl)
    return url ? [{ id: `${project.id}-food-${photo.id || index}`, project: project.title, title: photo.title, description: photo.description, url, category: category(photo.subcategory) }] : []
  }))
  if (dedicated.length) return dedicated
  return legacyEntries(projects).flatMap(item => item.media.filter((photo: any) => photo.kind !== 'video' && photo.url && !/campaign|poster|design|graphic/i.test([photo.title, photo.caption].filter(Boolean).join(' '))).map((photo: any, index: number) => ({ id: `${item.id}-food-legacy-${index}`, project: item.title, title: photo.title, description: photo.caption, url: photo.url })))
}

function FoodPhotography({ projects }: { projects: Project[] }) {
  const photos = foodPhotos(projects)
  return <section className="portfolio-showcase food-showcase">
    <header className="showcase-heading">
      <h2>Food, in focus.</h2>
      <p>Restaurant photography built around colour, texture and appetite.</p>
    </header>
    <PortfolioCategoryFilter categories={filterCategories(photos)}><div className="food-masonry">
      {photos.map((photo, index) => <figure data-portfolio-category={photo.category?.slug || 'uncategorized'} className={index % 7 === 0 || index % 7 === 4 ? 'is-large' : ''} key={photo.id}>
        <StudioImage src={photo.url} alt={photo.title || `${photo.project} food photography`} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 33vw" />
        <figcaption><strong>{photo.project}</strong>{photo.title && <span>{photo.title}</span>}</figcaption>
      </figure>)}
    </div></PortfolioCategoryFilter>
  </section>
}

function designPosters(projects: Project[]): PortfolioImage[] {
  const dedicated = projects.flatMap(project => [...(project.designPosters || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).flatMap((poster: any, index: number) => {
    const url = assetUrl(poster.poster, poster.posterUrl)
    return url ? [{ id: `${project.id}-design-${poster.id || index}`, project: project.title, title: poster.title, description: poster.description, url, category: category(poster.subcategory) }] : []
  }))
  if (dedicated.length) return dedicated
  const titles = [
    'Too Tired To Cook?', 'Wrap Your Hunger Away', 'Hummus with Salad', 'Ramadan Campaign',
    'One Snack?', 'Craving Something Grilled?', 'Broasted Chicken', 'New Year Campaign',
    'Father’s Day', 'Good Food, Good Mood', 'Chicken Shawaya', 'Hungry?',
  ]
  return titles.map((title, index) => ({
    id: `portfolio-poster-${index + 1}`,
    project: 'Restaurant campaigns',
    title,
    url: `/images/editorial/creative-poster-${String(index + 1).padStart(2, '0')}.webp`,
  }))
}

function CreativeDesigns({ projects }: { projects: Project[] }) {
  const posters = designPosters(projects)
  return <section className="portfolio-showcase design-showcase">
    <header className="showcase-heading">
      <h2>Designed to be noticed.</h2>
      <p>Campaign posters and social graphics, each presented as an individual piece.</p>
    </header>
    <PortfolioCategoryFilter categories={filterCategories(posters)}><div className="poster-grid">
      {posters.map(poster => <figure data-portfolio-category={poster.category?.slug || 'uncategorized'} key={poster.id}>
        <div><StudioImage src={poster.url} alt={poster.title || `${poster.project} campaign design`} sizes="(max-width:620px) 100vw, (max-width:1000px) 50vw, 33vw" /></div>
        <figcaption><strong>{poster.title || poster.project}</strong><span>{poster.project}</span></figcaption>
      </figure>)}
    </div></PortfolioCategoryFilter>
  </section>
}

export function PortfolioDiscipline({ slug, projects }: { slug: string; projects: Project[] }) {
  if (slug === 'video-production') return <VideoPortfolio projects={projects} />
  if (slug === 'content-creation') return <VideoPortfolio projects={projects} contentCreation />
  if (slug === 'performance-marketing') return <PerformanceMarketing projects={projects} />
  if (slug === 'food-photography') return <FoodPhotography projects={projects} />
  return <CreativeDesigns projects={projects} />
}
