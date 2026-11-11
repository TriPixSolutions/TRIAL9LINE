import { StudioImage } from './Studio'
import { ProjectVideo } from './ProjectVideo'
import { ProjectResults } from './ProjectResults'
import { resolveSectionVideo, type VideoShape } from '@/lib/project-video'

type GalleryMedia = {
  url?: string | null
  alt?: string | null
  caption?: string | null
}
type VideoFields = {
  videoFile?: unknown
  videoUrl?: string | null
  videoShape?: VideoShape | null
}
export interface GalleryBlockItem extends VideoFields {
  id?: string
  blockType: 'wideImage' | 'imagePair' | 'portraitStrip' | 'video' | 'videoResults' | 'mediaGrid' | 'captionedImage' | 'textBlock'
  imageRatio?: string
  imageAlt?: string
  imageLeftAlt?: string
  imageRightAlt?: string
  imageUrl?: string | null
  imageLeftUrl?: string | null
  imageRightUrl?: string | null
  stripImages?: GalleryMedia[]
  gridItems?: (GalleryMedia & VideoFields & { id?: string; kind?: string; title?: string | null })[]
  videoPosterUrl?: string | null
  videoPosterAlt?: string
  videoSide?: 'left' | 'right'
  resultClient?: string | null
  reportingPeriod?: string | null
  views?: number | null
  saves?: number | null
  shares?: number | null
  reach?: number | null
  growth?: number | null
  extraMetrics?: { label?: string | null; value?: string | null }[]
  heading?: string | null
  title?: string | null
  caption?: string | null
  body?: string | null
}

function Caption({ children }: { children?: string | null }) {
  return children ? <figcaption>{children}</figcaption> : null
}

function VideoFigure({ block, split = false }: { block: GalleryBlockItem; split?: boolean }) {
  const source = resolveSectionVideo(block.videoFile, block.videoUrl, block.videoShape)
  if (!source && !block.videoPosterUrl) return null
  return <figure className="gallery-block project-film">
    {source ? <ProjectVideo
      source={source}
      title={block.heading || block.title || 'Project video'}
      poster={block.videoPosterUrl}
      sizes={split ? '(max-width:700px) 100vw, 48vw' : undefined}
    /> : <div className="media-frame"><StudioImage src={block.videoPosterUrl!} alt={block.videoPosterAlt || 'Project video thumbnail'} /></div>}
    <Caption>{block.caption}</Caption>
  </figure>
}

export function GalleryBlock({ block, clientName }: { block: GalleryBlockItem; clientName?: string | null }) {
  if (block.blockType === 'textBlock') {
    if (!block.heading && !block.body && !block.imageUrl) return null
    return <section className={'gallery-text' + (block.imageUrl ? ' gallery-story-with-photo' : '')}>
      {(block.heading || block.body) && <div>{block.heading && <h2>{block.heading}</h2>}{block.body && <p>{block.body}</p>}</div>}
      {block.imageUrl && <figure className={'gallery-block gallery-ratio-' + (block.imageRatio || 'landscape')}>
        <div className="media-frame"><StudioImage src={block.imageUrl} alt={block.imageAlt || block.heading || 'Project photograph'} sizes="(max-width:700px) 100vw, 50vw" /></div>
        <Caption>{block.caption}</Caption>
      </figure>}
    </section>
  }

  if (block.blockType === 'video') return <VideoFigure block={block} />

  if (block.blockType === 'videoResults') {
    const hasVideo = Boolean(resolveSectionVideo(block.videoFile, block.videoUrl, block.videoShape) || block.videoPosterUrl)
    const hasResults = [block.views, block.saves, block.shares, block.reach, block.growth].some(value => typeof value === 'number' && Number.isFinite(value))
      || block.extraMetrics?.some(metric => metric.label?.trim() && metric.value?.trim())
    const hasStory = Boolean(block.heading || block.body || hasResults)
    if (!hasVideo && !hasStory) return null
    return <section className={'project-result-section' + (hasVideo && hasStory ? ' has-split' : '') + (block.videoSide === 'right' ? ' video-right' : '')}>
      {hasVideo && <VideoFigure block={block} split />}
      {hasStory && <div className="project-result-story">
        {(block.resultClient || clientName) && <p className="project-result-client">{block.resultClient || clientName}</p>}
        {block.heading && <h2>{block.heading}</h2>}
        {block.body && <p className="project-result-description">{block.body}</p>}
        <ProjectResults results={block} />
      </div>}
    </section>
  }

  if (block.blockType === 'mediaGrid') {
    const items = (block.gridItems || []).flatMap(item => {
      const source = item.kind === 'video' ? resolveSectionVideo(item.videoFile, item.videoUrl, item.videoShape) : null
      return item.url || source ? [{ ...item, source }] : []
    })
    if (!items.length) return null
    return <section className="project-media-section">
      {block.heading && <h2>{block.heading}</h2>}
      <div className="project-media-grid">
        {items.map((item, index) => <figure key={item.id || index} className="gallery-block">
          {item.source ? <ProjectVideo
            source={item.source}
            title={item.title || 'Project reel'}
            poster={item.url}
            sizes="(max-width:520px) 100vw, (max-width:860px) 50vw, 33vw"
          /> : <div className="media-frame"><StudioImage src={item.url!} alt={item.alt || item.title || 'Project artwork'} sizes="(max-width:520px) 100vw, (max-width:860px) 50vw, 33vw" /></div>}
          {(item.title || item.caption) && <figcaption>{item.title && <strong>{item.title}</strong>}{item.caption && <span>{item.caption}</span>}</figcaption>}
        </figure>)}
      </div>
    </section>
  }

  if (block.blockType === 'imagePair') {
    const images = [
      { src: block.imageLeftUrl, alt: block.imageLeftAlt },
      { src: block.imageRightUrl, alt: block.imageRightAlt },
    ].filter((image): image is { src: string; alt: string | undefined } => Boolean(image.src))
    if (!images.length) return null
    return <figure className="gallery-block">
      <div className="gallery-pair">{images.map(({ src, alt }, index) => <div key={src + index} className="media-frame"><StudioImage src={src} alt={alt || block.caption || 'Project photograph'} sizes="(max-width:540px) 100vw, 50vw" /></div>)}</div>
      <Caption>{block.caption}</Caption>
    </figure>
  }

  if (block.blockType === 'portraitStrip') return <div className="gallery-block gallery-strip">
    {block.stripImages?.map((image, index) => image.url && <figure key={image.url + index}>
      <div className="media-frame"><StudioImage src={image.url} alt={image.alt || image.caption || 'Project detail'} sizes="(max-width:767px) 100vw, 33vw" /></div>
      <Caption>{image.caption}</Caption>
    </figure>)}
  </div>

  if (!block.imageUrl) return null
  return <figure className={'gallery-block gallery-ratio-' + (block.imageRatio || 'landscape')}>
    <div className="media-frame"><StudioImage src={block.imageUrl} alt={block.imageAlt || block.caption || 'Project photograph'} /></div>
    <Caption>{block.caption}</Caption>
  </figure>
}
