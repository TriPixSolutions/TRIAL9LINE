export const portfolioSections = [
  {
    slug: 'video-production',
    title: 'Video Production',
    description: 'Cinematic films, campaign videos and reels presented in their original format.',
    image: '/images/editorial/polish-film-compact.webp',
    match: /video|film|cinema|videography|production/i,
  },
  {
    slug: 'content-creation',
    title: 'Content Creation',
    description: 'Social-first reels and everyday brand stories made for fast-moving feeds.',
    image: '/images/editorial/service-social-detail.webp',
    match: /social|content|reel|short.form/i,
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
    image: '/images/editorial/creative-designs-collage-v2.jpg',
    match: /design|brand identity|graphic|poster/i,
  },
] as const

export type PortfolioSectionSlug = (typeof portfolioSections)[number]['slug']

export function normalizePortfolioCategory(value: unknown): PortfolioSectionSlug | undefined {
  const category = String(value || '')
  const normalized = category === 'content-production' ? 'video-production' : category
  return portfolioSections.some(section => section.slug === normalized)
    ? normalized as PortfolioSectionSlug
    : undefined
}

export function normalizePortfolioSections(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  return [...new Set(values.map(normalizePortfolioCategory).filter(Boolean))] as string[]
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
  if (slug === 'video-production') return blocks.some((block: any) => ['video', 'videoResults'].includes(block.blockType)) || blocks.length > 0
  return false
}

export function sectionGallery(blocks: any[], slug: string) {
  return blocks.flatMap(block => {
    if (block.blockType === 'mediaGrid') {
      if (slug === 'performance-marketing') return []
      const gridItems = (block.gridItems || []).filter((item: any) => {
        if (slug === 'video-production' || slug === 'content-creation') return item.kind === 'video'
        if (item.kind === 'video') return false
        if (slug === 'creative-designs') return /campaign|poster|design|graphic|creative/i.test([item.title, item.caption].filter(Boolean).join(' '))
        return true
      })
      return gridItems.length ? [{ ...block, gridItems }] : []
    }
    if (slug === 'performance-marketing') return block.blockType === 'videoResults' ? [block] : []
    if (slug === 'video-production' || slug === 'content-creation') return ['video', 'videoResults'].includes(block.blockType) ? [block] : []
    return ['wideImage', 'imagePair', 'portraitStrip', 'captionedImage'].includes(block.blockType) ? [block] : []
  })
}
