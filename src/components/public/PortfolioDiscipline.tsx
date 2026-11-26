import { StudioImage } from './Studio'
import { ProjectVideo } from './ProjectVideo'
import { resolveProjectVideo, resolveSectionVideo, type ProjectVideoSource } from '@/lib/project-video'
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
  spendValue?: number
  costPerLead?: number
  summary?: string
  image?: string | null
  illustrative?: boolean
  category?: PortfolioFilterCategory | null
}

function moneyValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return undefined
  const parsed = Number(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

function marketingReports(projects: Project[]): MarketingReport[] {
  const dedicated = projects.flatMap(project => [...(project.marketingReports || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).map((report: any, index: number) => {
    const spendValue = moneyValue(report.spend)
    const sample = [
      { reach: 118400, impressions: 286900, clicks: 5740, leads: 86, ctr: 2.0 },
      { reach: 76900, impressions: 164700, clicks: 3130, leads: 65, ctr: 1.9 },
    ][index % 2]
    const illustrative = report.isIllustrative === true
    const reach = report.results?.reach ?? (illustrative ? sample.reach : undefined)
    const impressions = report.results?.impressions ?? (illustrative ? sample.impressions : undefined)
    const clicks = report.results?.clicks ?? (illustrative ? sample.clicks : undefined)
    const leads = report.results?.leads ?? (illustrative ? sample.leads : undefined)
    const ctr = report.results?.ctr ?? (illustrative ? sample.ctr : undefined)
    return {
      id: `${project.id}-report-${report.id || index}`,
      project: project.title,
      campaign: report.campaignName || project.title,
      period: report.period,
      spend: report.spend,
      reach,
      impressions,
      clicks,
      leads,
      ctr,
      spendValue,
      costPerLead: spendValue && leads ? spendValue / leads : undefined,
      summary: report.summary,
      image: assetUrl(report.reportImage, report.reportImageUrl),
      illustrative,
      category: category(report.subcategory),
    }
  }))
  if (dedicated.length) return dedicated

  return [
    {
      id: 'sample-lead-generation',
      project: 'Paid Social',
      campaign: 'Restaurant Lead Generation',
      period: '30-day campaign snapshot',
      spend: '$4,860',
      spendValue: 4860,
      reach: 118400,
      impressions: 286900,
      clicks: 5740,
      leads: 338,
      ctr: 2.0,
      costPerLead: 14.38,
      summary: 'Lead-focused creative paired with audience testing and weekly optimisation.',
      illustrative: true,
    },
    {
      id: 'sample-catering-enquiries',
      project: 'Paid Social',
      campaign: 'Catering Enquiries',
      period: '30-day campaign snapshot',
      spend: '$3,240',
      spendValue: 3240,
      reach: 76900,
      impressions: 164700,
      clicks: 3130,
      leads: 172,
      ctr: 1.9,
      costPerLead: 18.84,
      summary: 'Conversion-led ads built around high-intent catering and event enquiries.',
      illustrative: true,
    },
  ]
}

function PerformanceMarketing({ projects }: { projects: Project[] }) {
  const reports = marketingReports(projects)
  const totalReach = reports.reduce((sum, report) => sum + (report.reach || 0), 0)
  const totalLeads = reports.reduce((sum, report) => sum + (report.leads || 0), 0)
  const totalSpend = reports.reduce((sum, report) => sum + (report.spendValue || 0), 0)
  const averageCostPerLead = totalLeads > 0 && totalSpend > 0
    ? totalSpend / totalLeads
    : reports.length ? reports.reduce((sum, report) => sum + (report.costPerLead || 0), 0) / reports.length : 0
  const averageCtr = reports.length ? reports.reduce((sum, report) => sum + (report.ctr || 0), 0) / reports.length : 0
  const illustrative = reports.some(report => report.illustrative)

  return <section className="portfolio-showcase marketing-showcase">
    <header className="showcase-heading">
      <h2>Creative that performs.</h2>
      <p>Lead generation, cost efficiency and campaign results presented with the clarity of a Meta Ads report.</p>
    </header>
    <div className="meta-report">
      <div className="meta-report-bar"><strong>Campaign performance</strong><span>{illustrative ? 'Sample campaign snapshot' : 'Campaign reporting'}</span></div>
      <div className="meta-kpis">
        <div><span>Qualified leads</span><strong>{compactMetric(totalLeads)}</strong><small>Across campaigns</small></div>
        <div><span>Average cost / lead</span><strong>${averageCostPerLead.toFixed(2)}</strong><small>Blended CPL</small></div>
        <div><span>Reach</span><strong>{compactMetric(totalReach)}</strong><small>Unique accounts</small></div>
        <div><span>Average CTR</span><strong>{averageCtr.toFixed(1)}%</strong><small>Click-through rate</small></div>
      </div>
      <div className="meta-report-body">
        <div className="meta-campaign-list">
          <div className="meta-table-head"><span>Campaign</span><span>Leads</span><span>Cost / lead</span><span>CTR</span></div>
          {reports.map(report => <article key={report.id}>
            <span><strong>{report.campaign}</strong><small>{report.project} · {report.period || 'Current period'}</small></span>
            <b>{compactMetric(report.leads)}</b><b>{report.costPerLead != null ? `$${report.costPerLead.toFixed(2)}` : '—'}</b><b>{report.ctr != null ? `${report.ctr}%` : '—'}</b>
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
      <dl>{[['Reach',report.reach],['Impressions',report.impressions],['Link clicks',report.clicks],['Leads',report.leads],['Cost / lead',report.costPerLead!=null?`$${report.costPerLead.toFixed(2)}`:undefined],['CTR',report.ctr!=null?`${report.ctr}%`:undefined]].map(([label,value])=><div key={String(label)}><dt>{label}</dt><dd>{typeof value==='number'?compactMetric(value):value||'—'}</dd></div>)}</dl>
      {report.summary&&<p>{report.summary}</p>}
    </article>)}</div></PortfolioCategoryFilter>
    {illustrative && <p className="report-disclaimer">Representative figures shown for the reporting preview. Replace them with verified live campaign data in the dashboard.</p>}
  </section>
}

type PortfolioImage = { id: string; project: string; title?: string; description?: string; url: string; category?: PortfolioFilterCategory | null; ratio?: string; fit?: 'full' | 'cover'; position?: string }
type DesignPoster = Omit<PortfolioImage, 'url'> & { url?: string | null; source?: ProjectVideoSource | null }

function foodPhotoRatio(photo: any) {
  const media = photo.photo && typeof photo.photo === 'object' ? photo.photo : null
  if (Number(media?.width) > 0 && Number(media?.height) > 0) return `${media.width} / ${media.height}`
  return ({
    'portrait-2-3': '2 / 3',
    'portrait-3-5': '3 / 5',
    'portrait-3-4': '3 / 4',
    'portrait-4-5': '4 / 5',
  } as Record<string, string>)[photo.photoShape] || '4 / 5'
}

function foodPhotos(projects: Project[]): PortfolioImage[] {
  const dedicated = projects.flatMap(project => [...(project.foodPhotos || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).flatMap((photo: any, index: number) => {
    const url = assetUrl(photo.photo, photo.photoUrl)
    return url ? [{
      id: `${project.id}-food-${photo.id || index}`,
      project: project.title,
      title: photo.title,
      description: photo.description,
      url,
      category: category(photo.subcategory),
      ratio: foodPhotoRatio(photo),
      fit: photo.photoFit === 'cover' ? 'cover' as const : 'full' as const,
      position: photo.photoPosition || 'center',
    }] : []
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
      {photos.map(photo => <figure data-portfolio-category={photo.category?.slug || 'uncategorized'} key={photo.id}>
        <div className={`food-photo-frame is-${photo.fit || 'full'}`} style={{ aspectRatio: photo.ratio || '4 / 5' }}>
          <StudioImage src={photo.url} alt={photo.title || `${photo.project} food photography`} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 33vw" position={photo.position} />
        </div>
        <figcaption><strong>{photo.title || photo.project}</strong><span>{photo.category?.name || photo.project}</span></figcaption>
      </figure>)}
    </div></PortfolioCategoryFilter>
  </section>
}

function designPosters(projects: Project[]): DesignPoster[] {
  const dedicated = projects.flatMap(project => [...(project.designPosters || [])].sort((a: any,b: any)=>(a.displayOrder ?? 9999)-(b.displayOrder ?? 9999)).flatMap((poster: any, index: number) => {
    const url = assetUrl(poster.poster, poster.posterUrl)
    const source = resolveProjectVideo(poster.instagramUrl)
    return url || source ? [{ id: `${project.id}-design-${poster.id || index}`, project: project.title, title: poster.title, description: poster.description, url, source, category: category(poster.subcategory) }] : []
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
  const groups = [...new Map(posters.map(poster => [poster.category?.slug || 'uncategorized', {
    category: poster.category || { slug: 'uncategorized', name: poster.project },
    posters: posters.filter(item => (item.category?.slug || 'uncategorized') === (poster.category?.slug || 'uncategorized')),
  }])).values()]
  return <section className="portfolio-showcase design-showcase">
    <header className="showcase-heading">
      <h2>Designed to be noticed.</h2>
      <p>Campaign posters and social graphics, each presented as an individual piece.</p>
    </header>
    <PortfolioCategoryFilter categories={filterCategories(posters)}><div className="poster-brand-groups">
      {groups.map(group => <section className="poster-brand-group" data-portfolio-category={group.category.slug} key={group.category.slug}>
        <header className="poster-brand-header"><h3>{group.category.name}</h3><span>{String(group.posters.length).padStart(2, '0')} creatives</span></header>
        <div className="poster-grid">{group.posters.map(poster => <figure key={poster.id}>
          <div>{poster.url ? <StudioImage src={poster.url} alt={poster.title || `${group.category.name} campaign design`} sizes="(max-width:620px) 100vw, (max-width:1000px) 50vw, 33vw" /> : poster.source ? <ProjectVideo source={poster.source} title={poster.title || `${group.category.name} campaign design`} instant /> : null}</div>
          <figcaption><strong>{poster.title || group.category.name}</strong><span>{group.category.name}</span></figcaption>
        </figure>)}</div>
      </section>)}
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
