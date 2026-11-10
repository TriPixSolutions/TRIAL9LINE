import type {Where} from 'payload'
export const projectLayouts = [
  { label: 'Editorial — a balanced project story', value: 'editorial' },
  { label: 'Film — cinematic, wide-screen presentation', value: 'film' },
  { label: 'Photography — an image-led gallery', value: 'photography' },
]
export const galleryLayouts = [
  { label: 'Wide photograph', value: 'wideImage' },
  { label: 'Two photographs', value: 'imagePair' },
  { label: 'Portrait collection', value: 'portraitStrip' },
  { label: 'Film / social video', value: 'video' },
  { label: 'Photograph with caption', value: 'captionedImage' },
  { label: 'Story section', value: 'textBlock' },
]
export function placementWhere(placement: 'home' | 'work' | 'discovery'):Where {
  const home:Where = { or: [{ showOnHome: { equals: true } }, { and: [{ showOnHome: { exists: false } }, { featured: { equals: true } }] }] }
  // Legacy records stay listed until an editor explicitly changes placement.
  const work:Where = { showOnWorks: { not_equals: false } }
  return placement === 'home' ? home : placement === 'work' ? work : { or: [home, work] }
}
