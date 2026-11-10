const root = '/images/agency/'
const assets = {
  'social-strategy': { src: root+'social-strategy.webp', alt: 'Social feed planning, a content calendar and brand colour swatches' },
  'film-production': { src: root+'film-production.webp', alt: 'Professional cinema camera and lighting in a minimal production studio' },
  'commercial-photography': { src: root+'commercial-photography.webp', alt: 'Camera and softbox arranged for a commercial product photoshoot' },
  'brand-design': { src: root+'brand-design.webp', alt: 'Brand stationery, paper samples and graphic design materials' },
  'digital-campaigns': { src: root+'digital-campaigns.webp', alt: 'Digital campaign creative and audience analytics at a studio desk' },
  'creative-studio': { src: root+'creative-studio.webp', alt: 'Illustrative creative workspace with design proofs, a camera and moodboards' },
}
const legacy: Record<string, keyof typeof assets> = {
  'hero-culinary':'film-production', 'food-reel-cover':'film-production',
  'social-reel-cover':'social-strategy', 'social-marketing':'social-strategy',
  'tharavadu-macro':'commercial-photography', 'tharavadu-case-study':'commercial-photography',
  'interior-dining':'creative-studio', 'work-grid':'brand-design',
  'branding-studio':'brand-design', 'digital-campaign':'digital-campaigns',
  'creative-studio-hero':'film-production',
}
// Only replace bundled template images, including their imported CMS copies.
// Unrelated user uploads retain their original URLs and descriptions.
export function agencyAsset(media: unknown, fallback?: string | null) {
  const item = media && typeof media==='object' ? media as Record<string, unknown> : null
  const source = String(item?.filename || item?.url || fallback || '').split(/[?#]/)[0]
  const filename = source.split('/').pop() || ''
  const stem = filename.replace(/\.(?:png|webp|jpe?g)$/i,'').replace(/-\d+$/,'')
  if (stem in assets && (source.startsWith(root) || item?.caption==='Illustrative agency imagery')) return assets[stem as keyof typeof assets]
  return legacy[stem] ? assets[legacy[stem]] : undefined
}
export function agencyAlt(media: unknown, fallback: string | null | undefined, alt: string) {
  return agencyAsset(media,fallback)?.alt || alt
}
export function legacyTemplateImage(media: unknown, fallback?: string | null) {
  const item=media && typeof media==='object' ? media as Record<string,unknown> : null
  const filename=String(item?.filename || item?.url || fallback || '').split(/[?#]/)[0].split('/').pop() || ''
  return Boolean(legacy[filename.replace(/\.(?:png|webp|jpe?g)$/i,'').replace(/-\d+$/,'')])
}
