import { StudioImage } from './Studio'
import { ProjectVideo } from './ProjectVideo'
import { resolveProjectVideo } from '@/lib/project-video'
export interface GalleryBlockItem {
  imageRatio?:string; id?: string; blockType: 'wideImage' | 'imagePair' | 'portraitStrip' | 'video' | 'captionedImage' | 'textBlock'
  imageAlt?:string; imageLeftAlt?:string; imageRightAlt?:string; imageUrl?: string | null; imageLeftUrl?: string | null; imageRightUrl?: string | null
  stripImages?: Array<{ url: string; alt?:string; caption?: string | null }>
  videoPosterAlt?:string; videoUrl?: string | null; videoPosterUrl?: string | null; heading?: string | null; title?: string | null; caption?: string | null; body?: string | null
}
export function GalleryBlock({ block }: { block: GalleryBlockItem }) {
  const caption = block.caption ? <figcaption>{block.caption}</figcaption> : null
  if (block.blockType === 'textBlock') return <div className="gallery-text">{block.heading && <h3>{block.heading}</h3>}{block.body && <p>{block.body}</p>}</div>
  if (block.blockType === 'video') {
    const source = resolveProjectVideo(block.videoUrl)
    if (!source) return block.videoPosterUrl ? <figure className="gallery-block"><div className="media-frame"><StudioImage src={block.videoPosterUrl} alt={block.videoPosterAlt || 'Project preview'} /></div>{caption}</figure> : null
    return <figure className="gallery-block"><ProjectVideo source={source} title={block.heading || block.title || 'Project film'} poster={block.videoPosterUrl} />{caption}</figure>
  }
  if (block.blockType === 'imagePair') {
    const images = [block.imageLeftUrl, block.imageRightUrl].filter(Boolean) as string[]
    if (!images.length) return null
    return <figure className="gallery-block"><div className="gallery-pair">{images.map((src, i) => <div key={src + i} className="media-frame"><StudioImage src={src} alt={(i===0?block.imageLeftAlt:block.imageRightAlt) || block.caption || 'Project image '+(i+1)} sizes="(max-width:540px) 100vw, 50vw" /></div>)}</div>{caption}</figure>
  }
  if (block.blockType === 'portraitStrip') return <div className="gallery-block gallery-strip">{block.stripImages?.filter(image => image.url).map((image, i) => <figure key={image.url + i}><div className="media-frame"><StudioImage src={image.url} alt={image.alt || image.caption || 'Project detail ' + (i + 1)} sizes="(max-width:767px) 100vw, 33vw" /></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>
  if (!block.imageUrl) return null
  return <figure className={"gallery-block gallery-ratio-"+(block.imageRatio||"landscape")}><div className="media-frame"><StudioImage src={block.imageUrl} alt={block.imageAlt || block.caption || 'Project photography'} /></div>{caption}</figure>
}
