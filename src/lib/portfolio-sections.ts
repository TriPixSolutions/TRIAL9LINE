export const portfolioSections = [
  {
    slug: 'content-production',
    title: 'Content Production',
    description: 'Films, reels and social-first stories made for screens of every shape.',
    image: '/images/editorial/polish-film-compact.webp',
    match: /video|film|reel|cinema|social|content/i,
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    description: 'Campaign creative and clear performance reporting, presented together.',
    image: '/images/editorial/polish-ads-dashboard.webp',
    match: /paid|performance|advertis|digital marketing|campaign/i,
  },
  {
    slug: 'food-photography',
    title: 'Food Photography',
    description: 'Food, ingredients and hospitality captured with a distinctive point of view.',
    image: '/images/editorial/polish-food-still.webp',
    match: /photo/i,
  },
  {
    slug: 'creative-designs',
    title: 'Creative Designs',
    description: 'Posters, menus and social graphics shaped around each brand.',
    image: '/images/editorial/polish-branding-workstation.webp',
    match: /design|brand identity|graphic|poster/i,
  },
] as const

const legacyContentSections = ['video-production', 'content-creation']

export function normalizePortfolioSections(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  const normalized = values.map(String).map(value => legacyContentSections.includes(value) ? 'content-production' : value)
  return [...new Set(normalized)].filter(value => portfolioSections.some(section => section.slug === value))
}

export function belongsToSection(project: any, slug: string) {
  if (project.portfolioCategory) return normalizePortfolioSections([project.portfolioCategory]).includes(slug)
  const selected = normalizePortfolioSections(project.portfolioSections)
  if (selected.length) return selected.includes(slug)

  const section = portfolioSections.find(item => item.slug === slug)
  const categories = (project.categories || []).map((item: any) => typeof item === 'object' ? item.name : '').join(' ')
  const summary = [project.servicesSummary, categories].filter(Boolean).join(' ')
  const blocks = project.gallery || []
  const gridItems = blocks.flatMap((block: any) => block.blockType === 'mediaGrid' ? block.gridItems || [] : [])

  if (section?.match.test(summary)) return true
  if (slug === 'performance-marketing') return blocks.some((block: any) => block.blockType === 'videoResults')
  if (slug === 'food-photography') return /food|restaurant|culinary|menu/i.test(summary) && gridItems.some((item: any) => item.kind !== 'video')
  if (slug === 'creative-designs') return gridItems.some((item: any) => /campaign|poster|design|graphic|creative/i.test([item.title, item.caption].filter(Boolean).join(' ')))
  if (slug === 'content-production') return blocks.some((block: any) => ['video', 'videoResults'].includes(block.blockType)) || blocks.length > 0
  return false
}

export function sectionGallery(blocks: any[], slug: string) {
  return blocks.flatMap(block => {
    if (block.blockType === 'mediaGrid') {
      if (slug === 'performance-marketing') return []
      const gridItems = (block.gridItems || []).filter((item: any) => {
        if (slug === 'content-production') return item.kind === 'video'
        if (item.kind === 'video') return false
        if (slug === 'creative-designs') return /campaign|poster|design|graphic|creative/i.test([item.title, item.caption].filter(Boolean).join(' '))
        return true
      })
      return gridItems.length ? [{ ...block, gridItems }] : []
    }
    if (slug === 'performance-marketing') return block.blockType === 'videoResults' ? [block] : []
    if (slug === 'content-production') return ['video', 'videoResults'].includes(block.blockType) ? [block] : []
    return ['wideImage', 'imagePair', 'portraitStrip', 'captionedImage'].includes(block.blockType) ? [block] : []
  })
}
