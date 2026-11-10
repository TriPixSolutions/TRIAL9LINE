import Link from 'next/link'
import { headers } from 'next/headers'
import { permanentRedirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { publicProject, publicProjects, mediaUrl, redirectProject } from '@/lib/public-projects'
import { getPayloadClient } from '@/lib/payload'
import { GalleryBlock, type GalleryBlockItem } from '@/components/public/GalleryBlock'
import { Arrow, InquiryCTA, StudioImage } from '@/components/public/Studio'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> }
async function loadProject(slug: string, preview?: string) {
  if (preview === 'true') {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || !['owner', 'editor'].includes(String(user.role))) return null
    const result = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, draft: true, depth: 2, limit: 1, overrideAccess: false, user })
    return result.docs[0] || null
  }
  return publicProject(slug)
}
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const doc = await loadProject(slug, query.preview)
  return { title: doc?.metaTitle || doc?.title || 'Project not found', description: doc?.metaDescription || doc?.overview, alternates: { canonical: '/work/' + encodeURIComponent(slug) }, ...(query.preview === 'true' ? { robots: { index: false, follow: false } } : {}) }
}
export default async function ProjectPage({ params, searchParams }: Props) {
  const { slug } = await params
  const query = await searchParams
  const doc = await loadProject(slug, query.preview)
  if (!doc) { if(query.preview!=='true'){const target=await redirectProject(slug);if(target)permanentRedirect('/work/'+encodeURIComponent(target))}notFound() }
  const cover = mediaUrl(doc.coverImage, doc.coverImageUrl)
  const payload=await getPayloadClient()
  const nextId=typeof doc.nextProject==='object'&&doc.nextProject?doc.nextProject.id:doc.nextProject
  const chosen=nextId&&nextId!==doc.id?(await payload.find({collection:'projects',where:{and:[{id:{equals:nextId}},{_status:{equals:'published'}}]},limit:1,depth:1,overrideAccess:false,draft:false})).docs[0]:null
  const next=chosen||(await publicProjects({placement:'discovery',limit:2})).docs.find(p=>p.id!==doc.id)
  const gallery: GalleryBlockItem[] = (doc.gallery || []).map((item: any) => ({
    ...item, imageAlt:item.mediaItem?.alt, imageLeftAlt:item.mediaLeft?.alt, imageRightAlt:item.mediaRight?.alt, imageUrl: mediaUrl(item.mediaItem, item.imageUrl),
    imageLeftUrl: mediaUrl(item.mediaLeft, item.imageLeftUrl), imageRightUrl: mediaUrl(item.mediaRight, item.imageRightUrl),
    videoPosterUrl: mediaUrl(item.videoPoster, item.videoPosterUrl),
    stripImages: (item.stripImages || []).map((image: any) => ({ url: mediaUrl(image.media, image.url), caption: image.caption, alt:image.media?.alt })),
  }))
  return <div className={'project-presentation layout-'+(doc.layout||'editorial')+' hero-ratio-'+(doc.heroRatio||'wide')+' gallery-spacing-'+(doc.gallerySpacing||'comfortable')}>
    {query.preview === 'true' && <div className="preview-banner">Private draft preview · This version is visible only to authorised staff.</div>}
    <section className="studio-container project-heading"><div className="page-breadcrumb"><Link href="/work">All work</Link><span>/</span><span>{doc.title}</span></div>
      <div className="project-title-row"><h1 className="page-title">{doc.title}</h1>{doc.editorialHeadline && <p>{doc.editorialHeadline}</p>}</div>
      <dl className="project-facts"><div><dt>Client</dt><dd>{doc.clientName || doc.title}</dd></div>{doc.industry && <div><dt>Industry</dt><dd>{doc.industry}</dd></div>}<div><dt>What we did</dt><dd>{doc.servicesSummary || (doc.categories || []).map((c: any) => c.name).filter(Boolean).join(' · ')}</dd></div></dl>
    </section>
    {cover && <div className="studio-container"><div className="media-frame project-hero"><StudioImage src={cover} alt={doc.coverImage?.alt || doc.editorialHeadline || doc.title} priority /></div></div>}
    <section className="studio-container project-overview"><div><p>{doc.overview}</p>{doc.externalLink && /^https?:\/\//i.test(doc.externalLink) && <Link className="text-link project-external" href={doc.externalLink} target="_blank" rel="noopener noreferrer">Visit the client <Arrow diagonal /></Link>}</div></section>
    {gallery.length > 0 && <section className="studio-container project-gallery" aria-label="Project gallery">{gallery.map((block, i) => <GalleryBlock key={block.id || i} block={block} />)}</section>}
    {next && <div className="studio-container"><Link href={'/work/' + encodeURIComponent(next.slug)} className="next-project"><div><h2>{next.title}</h2></div><Arrow diagonal /></Link></div>}
    <InquiryCTA heading="Your story, next." text="Have something in mind? We’d love to hear about it." />
  </div>
}
