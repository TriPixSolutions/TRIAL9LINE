import { StudioImage } from './Studio'
import { ProjectVideo } from './ProjectVideo'
import { resolveSectionVideo } from '@/lib/project-video'
import { editorialGallery } from '@/lib/editorial-presentation'
import { mediaUrl } from '@/lib/public-projects'

type Project = Record<string, any>

function ReferenceBoard({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return <img
    src={src}
    srcSet={`${src.replace('.webp', '-480.webp')} 480w, ${src.replace('.webp', '-960.webp')} 960w, ${src} ${width}w`}
    sizes="(max-width: 1280px) 100vw, 1200px"
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
  />
}

function entries(projects: Project[]) {
  return projects.map(project => {
    const blocks = editorialGallery(project, mediaUrl) as any[]
    const result = blocks.find(block => block.blockType === 'videoResults') || blocks.find(block => block.blockType === 'video')
    const media = blocks.flatMap(block => block.blockType === 'mediaGrid' ? block.gridItems || [] : [])
    const poster = media.find((item: any) => item.kind !== 'video' && item.url)?.url || mediaUrl(project.coverImage, project.coverImageUrl)
    return { id: project.id, title: project.title, summary: project.editorialHeadline || project.servicesSummary, result, source: result ? resolveSectionVideo(result.videoFile, result.videoUrl, result.videoShape) : null, poster, media }
  })
}

function FilmCard({ item, index }: { item: ReturnType<typeof entries>[number]; index: number }) {
  const visual = <>{item.poster && <StudioImage src={item.poster} alt={item.title + ' film still'} sizes="(max-width:700px) 100vw, 50vw" />}<span className="discipline-film-overlay"><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.source?.kind === 'instagram' ? 'Instagram film' : 'Commercial production'} ↗</small></span></>
  return item.source?.originalUrl
    ? <a className="discipline-film-card" href={item.source.originalUrl} target="_blank" rel="noopener noreferrer">{visual}</a>
    : <div className="discipline-film-card">{visual}</div>
}

function VideoProduction({ projects }: { projects: Project[] }) {
  const items = entries(projects)
  return <><div className="discipline-index" aria-label="Production categories"><span>Cinematic films</span><span>Restaurant stories</span><span>Short-form production</span></div><section className="discipline-section"><div className="discipline-heading"><p>01 / Film production</p><h2>Stories made to move.</h2><span>Commercial films, venue stories and food-led production arranged as one watchlist.</span></div><div className="discipline-film-grid">{items.map((item, index) => <FilmCard key={item.id} item={item} index={index} />)}</div></section></>
}

function ContentCreation({ projects }: { projects: Project[] }) {
  const items = entries(projects).filter(item => item.source)
  return <><div className="discipline-index" aria-label="Content categories"><span>Scripted stories</span><span>Trending &amp; funny</span><span>Food content</span></div><section className="discipline-section"><div className="discipline-heading"><p>01 / Social-first content</p><h2>Built for the feed.</h2><span>Reels, scripted moments and menu-led stories made for vertical viewing.</span></div><div className="discipline-reel-grid">{items.map((item, index) => <article key={item.id} className="discipline-reel-card"><div className="discipline-reel-number">{String(index + 1).padStart(2, '0')}</div><ProjectVideo source={item.source!} title={item.result?.heading || item.title + ' reel'} poster={item.poster} sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, 33vw" /><h3>{item.title}</h3><p>{item.result?.heading || item.summary}</p></article>)}</div></section></>
}

function compactMetric(value: unknown, fallback: string) {
  return typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value) : fallback
}

function PerformanceMarketing({ projects }: { projects: Project[] }) {
  const items = entries(projects).filter(item => item.result)
  const sampleViews = ['1.2M', '1.9M', '239K', '780K', '540K', '1M']
  const sampleReach = ['2.4M', '2.8M', '410K', '1.1M', '860K', '1.7M']
  const sampleGrowth = [24, 32, 18, 21, 16, 27]
  return <section className="discipline-section performance-report"><div className="discipline-heading"><p>Illustrative Meta campaign report</p><h2>Creative, with a result.</h2><span>A presentation-ready view of campaign activity. Figures are sample portfolio metrics and can be replaced in the dashboard.</span></div><div className="performance-shell"><div className="performance-summary"><div><span>Campaigns</span><strong>{String(items.length).padStart(2, '0')}</strong><small>Active portfolio set</small></div><div><span>Sample reach</span><strong>4.8M</strong><small>Across featured work</small></div><div><span>Avg. growth</span><strong>+23%</strong><small>Illustrative benchmark</small></div><div className="performance-ring"><span>Engagement</span><strong>8.4%</strong><i aria-hidden="true" /></div></div><div className="performance-table" role="table" aria-label="Campaign performance examples"><div className="performance-row performance-row-head" role="row"><span>Campaign</span><span>Views</span><span>Reach</span><span>Growth</span></div>{items.map((item, index) => <div className="performance-row" role="row" key={item.id}><span><i>{String(index + 1).padStart(2, '0')}</i><strong>{item.title}</strong></span><span>{compactMetric(item.result.views, sampleViews[index] || '—')}</span><span>{compactMetric(item.result.reach, sampleReach[index] || '—')}</span><span className="positive">+{item.result.growth || sampleGrowth[index] || 20}%</span></div>)}</div></div></section>
}

function FoodPhotography({ projects }: { projects: Project[] }) {
  const photos = entries(projects).flatMap(item => item.media.filter((photo: any) => photo.kind !== 'video' && photo.url && !/campaign|poster|design|graphic/i.test([photo.title, photo.caption].filter(Boolean).join(' '))).map((photo: any) => ({ ...photo, project: item.title })))
  return <section className="discipline-section"><div className="discipline-heading"><p>Restaurant / Beverages / Desserts</p><h2>Food, with character.</h2><span>Natural-looking restaurant imagery shaped around the dish, the light and the atmosphere.</span></div><figure className="portfolio-reference-board"><ReferenceBoard src="/images/editorial/portfolio-food-board.webp" alt="Trail9ine food photography selection with drinks, biriyani, desserts and restaurant lifestyle photography" width={2560} height={1440} /></figure><div className="food-photo-grid">{photos.map((photo: any, index: number) => <figure key={(photo.id || photo.url) + index} className={index % 5 === 0 ? 'is-wide' : ''}><StudioImage src={photo.url} alt={photo.alt || photo.title || photo.project + ' food photograph'} sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 33vw" /><figcaption><strong>{photo.project}</strong><span>{photo.title || 'Restaurant photography'}</span></figcaption></figure>)}</div></section>
}

function CreativeDesigns({ projects }: { projects: Project[] }) {
  const posters = entries(projects).flatMap(item => item.media.filter((poster: any) => poster.kind !== 'video' && poster.url && /campaign|poster|design|graphic|creative/i.test([poster.title, poster.caption].filter(Boolean).join(' '))).map((poster: any) => ({ ...poster, project: item.title })))
  return <section className="discipline-section"><div className="discipline-heading creative-heading"><p>Campaigns / Social media / Hospitality</p><h2>One studio. Many identities.</h2><span>Campaign posters and social graphics, each shaped around the brand, audience and moment.</span></div><figure className="portfolio-reference-board"><ReferenceBoard src="/images/editorial/portfolio-creative-board.webp" alt="Trail9ine restaurant campaign poster and social graphic selection" width={1672} height={941} /></figure><div className="creative-project-index">{posters.map((poster: any, index: number) => <div key={(poster.id || poster.url) + index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{poster.project}</strong><small>{poster.title || 'Campaign creative'}</small></div>)}</div></section>
}

export function PortfolioDiscipline({ slug, projects }: { slug: string; projects: Project[] }) {
  if (slug === 'video-production') return <VideoProduction projects={projects} />
  if (slug === 'content-creation') return <ContentCreation projects={projects} />
  if (slug === 'performance-marketing') return <PerformanceMarketing projects={projects} />
  if (slug === 'food-photography') return <FoodPhotography projects={projects} />
  return <CreativeDesigns projects={projects} />
}
