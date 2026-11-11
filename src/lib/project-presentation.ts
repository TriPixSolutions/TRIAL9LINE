import type {Where} from 'payload'
export const projectLayouts = [
  { label: 'Social Media Campaign', value: 'social' },
  { label: 'Film Production', value: 'film' },
  { label: 'Photography / Design', value: 'photography' },
  { label: 'Project Story', value: 'editorial' },
]
export const galleryLayouts = [
  { label: 'Video + Results', value: 'videoResults' },
  { label: 'Photo & Reel Grid', value: 'mediaGrid' },
  { label: 'Video', value: 'video' },
  { label: 'Story', value: 'textBlock' },
  { label: 'Wide Photo', value: 'wideImage' },
  { label: 'Two Photos', value: 'imagePair' },
  { label: 'Tall Photos', value: 'portraitStrip' },
  { label: 'Photo with Caption', value: 'captionedImage' },
]

export const projectTemplateSections: Record<string, { summary: string; sections: string[] }> = {
  social: { summary: 'Lead with a reel, show its results, then add more work.', sections: ['videoResults', 'mediaGrid'] },
  film: { summary: 'Show the main film, then tell the story behind it.', sections: ['video', 'textBlock', 'mediaGrid'] },
  photography: { summary: 'Lead with images, then add a short story.', sections: ['mediaGrid', 'textBlock'] },
  editorial: { summary: 'Introduce the work, then show a wide photo and a gallery.', sections: ['textBlock', 'wideImage', 'mediaGrid'] },
}
export function placementWhere(placement: 'home' | 'work' | 'discovery'):Where {
  const home:Where = { or: [{ showOnHome: { equals: true } }, { and: [{ showOnHome: { exists: false } }, { featured: { equals: true } }] }] }
  // Legacy records stay listed until an editor explicitly changes placement.
  const work:Where = { showOnWorks: { not_equals: false } }
  return placement === 'home' ? home : placement === 'work' ? work : { or: [home, work] }
}
