import type { Payload } from 'payload'

type Parent = 'video-production' | 'content-creation' | 'performance-marketing' | 'food-photography' | 'creative-designs'

const categoryDefinitions: Array<{ name: string; slug: string; parents: Parent[] }> = [
  { name: 'Cinematic Films', slug: 'cinematic-films', parents: ['video-production'] },
  { name: 'Food Content', slug: 'food-content', parents: ['video-production'] },
  { name: 'Scripted Stories', slug: 'scripted-stories', parents: ['content-creation'] },
  { name: 'Trending & Funny', slug: 'trending-funny', parents: ['content-creation'] },
  { name: 'Viral Videos', slug: 'viral-videos', parents: ['content-creation'] },
  { name: 'Restaurant Food', slug: 'restaurant-food', parents: ['food-photography'] },
  { name: 'Beverages', slug: 'beverages', parents: ['food-photography'] },
  { name: 'Desserts', slug: 'desserts', parents: ['food-photography'] },
  { name: '90s Lounge Social Posters', slug: '90s-lounge-posters', parents: ['creative-designs'] },
  { name: 'Tharavadu Social Posters', slug: 'tharavadu-posters', parents: ['creative-designs'] },
  { name: 'Awareness Campaigns', slug: 'awareness-campaigns', parents: ['performance-marketing'] },
  { name: 'Lead Generation', slug: 'lead-generation', parents: ['performance-marketing'] },
]

const cinematic = [
  ['Biryani N BBQ · Cinematic Film', 'https://www.instagram.com/reel/DfFkSKgRY6h/'],
  ['Tharavadu · Cinematic Film', 'https://www.instagram.com/reel/DcmY2ZkCaQW/'],
  ['90s Lounge · Cinematic Film', 'https://www.instagram.com/reel/DbwUQyJgkW6/'],
  ['Dosa King · Cinematic Film', 'https://www.instagram.com/reel/DNg84_oqAWL/'],
  ['Fricasse · Cinematic Film', 'https://www.instagram.com/reel/DWSMAZXiTe9/'],
  ['Zafoon · Cinematic Film', 'https://www.instagram.com/reel/DfGHy7FRR5e/'],
]

const foodContent = [
  ['Tharavadu · Seafood Feast', 'https://www.instagram.com/reel/DekkAypADg2/'],
  ['Piravi · Tea & Snacks', 'https://www.instagram.com/reel/DXkx6mIDXWl/'],
  ['Dosa King · Chilli Chicken', 'https://www.instagram.com/reel/DNEoJjeB-w_/'],
  ['Zaitoun · Combine', 'https://www.instagram.com/reel/DQfZIj5EVjs/'],
  ['90s Lounge · Crunchy Bites', 'https://www.instagram.com/reel/DeSiV7okun2/'],
  ['Lulu Shawarma · Shawarma Plate', 'https://www.instagram.com/reel/DRda_jgDf8D/'],
]

const scripted = [
  ['Zaitoun · Scripted Story', 'https://www.instagram.com/reel/DUb_rCUEdbs/'],
  ['Tharavadu · Scripted Story', 'https://www.instagram.com/reel/DaWSrnDJZHR/'],
  ['Zaitoun · Brand Story', 'https://www.instagram.com/reel/DRDPY-OET05/'],
  ['90s Lounge · Scripted Story', 'https://www.instagram.com/reel/DUb8ejGDP5g/'],
  ['Piravi · Scripted Story', 'https://www.instagram.com/reel/DeSiD8LNcXv/'],
  ['Lulu Shawarma · Scripted Story', 'https://www.instagram.com/reel/DTl4kfYChKk/'],
]

const funny = [
  ['90s Lounge · Trending Reel', 'https://www.instagram.com/reel/DcCVfzGhMlw/'],
  ['Piravi · Funny Reel', 'https://www.instagram.com/reel/DY8EZQRT_AP/'],
  ['Tharavadu · Trending Reel', 'https://www.instagram.com/reel/DbwUJ4nCRI5/'],
  ['90s Lounge · Social Trend', 'https://www.instagram.com/reel/DdKb1lNhtY0/'],
  ['90s Lounge · Funny Content', 'https://www.instagram.com/reel/DdufFrACACQ/'],
  ['Piravi · Social Trend', 'https://www.instagram.com/reel/Dekjp1qNZyc/'],
]

const viral = [
  ['Viral Campaign · Feature 01', 'https://www.instagram.com/reel/DSqiPyzAFq7/'],
  ['Viral Campaign · Feature 02', 'https://www.instagram.com/reel/Da6PhYek_Vk/'],
  ['Viral Campaign · Feature 03', 'https://www.instagram.com/reel/DY8Em0IFA7_/'],
  ['Viral Campaign · Feature 04', 'https://www.instagram.com/reel/DQfntLpACPx/'],
  ['Viral Campaign · Feature 05', 'https://www.instagram.com/reel/DaWMWWBDEvQ/'],
  ['Viral Campaign · Feature 06', 'https://www.instagram.com/reel/DXh8uDegVjr/'],
]

async function ensureCategories(payload: Payload) {
  const ids: Record<string, number | string> = {}
  for (const [index, item] of categoryDefinitions.entries()) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })
    const doc = existing.docs[0] || await payload.create({ collection: 'categories', overrideAccess: true, data: { name: item.name, slug: item.slug, portfolioParents: item.parents, displayOrder: index + 1, active: true } as any })
    ids[item.slug] = doc.id
  }
  return ids
}

async function ensureProject(payload: Payload, data: Record<string, unknown>) {
  const slug = String(data.slug)
  const existing = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
  if (existing.totalDocs) return
  await payload.create({ collection: 'projects', overrideAccess: true, data: data as any })
}

function videos(entries: string[][], subcategory: string | number, start = 1) {
  return entries.map(([title, videoUrl], index) => ({ title, videoUrl, subcategory, format: 'portrait', displayOrder: start + index }))
}

export async function seedPortfolioContent(payload: Payload) {
  const category = await ensureCategories(payload)

  await ensureProject(payload, {
    title: 'Video Production Portfolio', slug: 'video-production-portfolio', portfolioCategory: 'video-production',
    editorialHeadline: 'Cinematic films and food stories built to be watched.', servicesSummary: 'Cinematic Films · Food Content',
    contentVideos: [...videos(cinematic, category['cinematic-films']), ...videos(foodContent, category['food-content'], cinematic.length + 1)],
    showOnWorks: true, displayOrder: 20, _status: 'published',
  })

  await ensureProject(payload, {
    title: 'Content Creation Portfolio', slug: 'content-creation-portfolio', portfolioCategory: 'content-creation',
    editorialHeadline: 'Scripted, trending and viral stories made for the feed.', servicesSummary: 'Scripted Stories · Trending & Funny · Viral Videos',
    contentVideos: [...videos(scripted, category['scripted-stories']), ...videos(funny, category['trending-funny'], scripted.length + 1), ...videos(viral, category['viral-videos'], scripted.length + funny.length + 1)],
    showOnWorks: true, displayOrder: 21, _status: 'published',
  })

  await ensureProject(payload, {
    title: 'Food Photography Portfolio', slug: 'food-photography-portfolio', portfolioCategory: 'food-photography',
    editorialHeadline: 'Food, colour and texture captured with appetite.', servicesSummary: 'Restaurant Food · Beverages · Desserts',
    foodPhotos: [
      { photoUrl: '/images/portfolio/food/grilled-chicken-rice.webp', title: 'Grilled Chicken & Rice', subcategory: category['restaurant-food'], displayOrder: 1 },
      { photoUrl: '/images/portfolio/food/beverages.webp', title: 'Signature Beverages', subcategory: category.beverages, displayOrder: 2 },
      { photoUrl: '/images/portfolio/food/mango-dessert.webp', title: 'Mango Dessert Moment', subcategory: category.desserts, displayOrder: 3 },
      { photoUrl: '/images/portfolio/food/berry-dessert.webp', title: 'Berry & Cream Dessert', subcategory: category.desserts, displayOrder: 4 },
      { photoUrl: '/images/portfolio/food/flatbread-chocolate.webp', title: 'Chocolate Berry Flatbread', subcategory: category.desserts, displayOrder: 5 },
      { photoUrl: '/images/portfolio/food/chocolate-shake.webp', title: 'Chocolate Shake', subcategory: category.beverages, displayOrder: 6 },
    ],
    showOnWorks: true, displayOrder: 22, _status: 'published',
  })

  const loungePosters = ['DfFuDZ2y5rN', 'DekG-nByvqH', 'Dd4RwbgSAjD', 'Dd2BIeUS1sl', 'DbldWW3S-jY', 'DaLzOhdyfTm', 'DZnk7cwCIAU']
  const tharavaduPosters = ['DfFm5QsS89l', 'DfILTrSyAkw', 'Dc9SeNQSwwO', 'Dd4ROtxS5C-']
  await ensureProject(payload, {
    title: 'Creative Design Portfolio', slug: 'creative-design-portfolio', portfolioCategory: 'creative-designs',
    editorialHeadline: 'Restaurant campaigns designed to stop the scroll.', servicesSummary: 'Social Posters · Promotional Design',
    designPosters: [
      ...loungePosters.map((code, index) => ({ posterUrl: `/images/portfolio/designs/${code}.webp`, title: `90s Lounge Campaign ${String(index + 1).padStart(2, '0')}`, subcategory: category['90s-lounge-posters'], displayOrder: index + 1 })),
      ...tharavaduPosters.map((code, index) => ({ posterUrl: `/images/portfolio/designs/${code}.webp`, title: `Tharavadu Campaign ${String(index + 1).padStart(2, '0')}`, subcategory: category['tharavadu-posters'], displayOrder: loungePosters.length + index + 1 })),
    ],
    showOnWorks: true, displayOrder: 23, _status: 'published',
  })

  await ensureProject(payload, {
    title: 'Performance Marketing Demo Reports', slug: 'performance-marketing-demo-reports', portfolioCategory: 'performance-marketing',
    editorialHeadline: 'Clear campaign reporting, ready for confirmed client results.', servicesSummary: 'Awareness · Lead Generation',
    marketingReports: [
      { campaignName: 'Restaurant Awareness · Demo', subcategory: category['awareness-campaigns'], isIllustrative: true, period: 'Illustrative 30-day period', spend: 'CAD 1,250', results: { reach: 186400, impressions: 438900, clicks: 7620, leads: 318, ctr: 1.74 }, summary: 'Illustrative portfolio layout—replace with confirmed Meta Ads data.', displayOrder: 1 },
      { campaignName: 'Local Lead Generation · Demo', subcategory: category['lead-generation'], isIllustrative: true, period: 'Illustrative 30-day period', spend: 'CAD 980', results: { reach: 92400, impressions: 217600, clicks: 4890, leads: 246, ctr: 2.25 }, summary: 'Illustrative portfolio layout—replace with confirmed Meta Ads data.', displayOrder: 2 },
    ],
    showOnWorks: true, displayOrder: 24, _status: 'published',
  })
}
