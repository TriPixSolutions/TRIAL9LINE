export const portfolioSections = [
  { slug: 'video-production', title: 'Video Production', description: 'Films and reels shaped around the atmosphere, people and details behind a brand.', image: '/images/editorial/polish-film-compact.webp', match: /video|film|reel|cinema/i },
  { slug: 'content-creation', title: 'Content Creation', description: 'Social content that brings a consistent voice and visual character to every channel.', image: '/images/editorial/polish-social-planning.webp', match: /social|content/i },
  { slug: 'performance-marketing', title: 'Performance Marketing', description: 'Campaign creative and performance insights, presented together.', image: '/images/editorial/polish-ads-dashboard.webp', match: /paid|performance|advertis|digital marketing|campaign/i },
  { slug: 'food-photography', title: 'Food Photography', description: 'Food, ingredients and hospitality, captured with care and a distinctive point of view.', image: '/images/editorial/polish-food-still.webp', match: /photo/i },
  { slug: 'creative-designs', title: 'Creative Designs', description: 'Identities, posters, menus and social graphics made to feel like one brand.', image: '/images/editorial/polish-branding-workstation.webp', match: /design|brand identity|graphic|poster/i },
]
export function belongsToSection(project: any, slug: string) {
  // Payload normalizes older missing selections to an empty array.
  if (Array.isArray(project.portfolioSections) && project.portfolioSections.length) return project.portfolioSections.includes(slug)
  const section = portfolioSections.find(item => item.slug === slug)
  const categories = (project.categories || []).map((item: any) => typeof item === 'object' ? item.name : '').join(' ')
  return Boolean(section?.match.test([project.servicesSummary, categories].filter(Boolean).join(' ')))
}

export function sectionGallery(blocks: any[], slug: string) {
  if (slug === 'content-creation') return blocks
  return blocks.flatMap(block => {
    if (block.blockType === 'mediaGrid') {
      const video = slug === 'video-production'
      if (slug === 'performance-marketing') return []
      const gridItems = (block.gridItems || []).filter((item: any) => video ? item.kind === 'video' : item.kind !== 'video')
      return gridItems.length ? [{ ...block, gridItems }] : []
    }
    if (slug === 'performance-marketing') return block.blockType === 'videoResults' ? [block] : []
    if (slug === 'video-production') return ['video', 'videoResults'].includes(block.blockType) ? [block] : []
    return ['wideImage', 'imagePair', 'portraitStrip', 'captionedImage'].includes(block.blockType) ? [block] : []
  })
}
