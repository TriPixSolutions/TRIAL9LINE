import configPromise from '../payload.config'
import { getPayload } from 'payload'

async function seed() {
  console.log('🌱 Starting TRAIL9INE MEDIA database seed...')
  const payload = await getPayload({ config: configPromise })

  // 1. Seed Categories
  const categoriesData = [
    { name: 'Video production', slug: 'video', displayOrder: 1, active: true },
    { name: 'Social media', slug: 'social', displayOrder: 2, active: true },
    { name: 'Photography', slug: 'photo', displayOrder: 3, active: true },
    { name: 'Creative campaigns', slug: 'campaigns', displayOrder: 4, active: true },
  ]

  const categoryMap: Record<string, string | number> = {}

  for (const cat of categoriesData) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap[cat.slug] = existing.docs[0].id
      console.log(`  ✓ Category exists: ${cat.name}`)
    } else {
      const created = await payload.create({
        collection: 'categories',
        data: cat,
      })
      categoryMap[cat.slug] = created.id
      console.log(`  + Created category: ${cat.name}`)
    }
  }

  // 2. Seed Projects
  const projectsData = [
    {
      title: 'Tharavadu',
      slug: 'tharavadu',
      clientName: 'Tharavadu Restaurant',
      editorialHeadline: 'South Indian flavours, brought into focus.',
      industry: 'Restaurant & Hospitality',
      servicesSummary: 'Social Strategy • Food Videography • Macro Photography • Creative Campaigns',
      categories: [categoryMap.social, categoryMap.video, categoryMap.photo].filter(Boolean),
      coverImageUrl: '/images/tharavadu-case-study.png',
      overview:
        'Our work for Tharavadu brings South Indian cuisine, restaurant experiences and promotional campaigns into engaging social content across its locations. By balancing dish-led imagery with content that introduces the atmosphere and promotional moments, the brand maintains a vibrant, authentic presence in Toronto’s competitive dining landscape.',
      approach:
        'Build a visual story around the food and the experience of the restaurant, balancing dish-led imagery with content that introduces the atmosphere and promotional moments.',
      featured: true,
      showOnHome: true,
      showOnWorks: true,
      displayOrder: 1,
      gallery: [
        {
          blockType: 'imagePair',
          imageLeftUrl: '/images/tharavadu-macro.png',
          imageRightUrl: '/images/interior-dining.png',
          caption: 'Culinary details and ambient room lighting captured on location.',
        },
        {
          blockType: 'portraitStrip',
          stripImages: [
            { url: '/images/food-reel-cover.png', caption: 'Chef plating reel' },
            { url: '/images/social-reel-cover.png', caption: 'Cocktail feature' },
            { url: '/images/tharavadu-macro.png', caption: 'Texture & flavor' },
          ],
        },
        {
          blockType: 'textBlock',
          heading: 'Craft in every frame.',
          body: 'From steaming South Indian thalis to the rhythm of high-volume kitchen prep, our lens focused on the authentic culinary craftsmanship that defines the Tharavadu heritage.',
        },
        {
          blockType: 'wideImage',
          imageUrl: '/images/hero-culinary.png',
          caption: 'A closer look at the dining experience.',
        },
      ],
      _status: 'published',
    },
    {
      title: '90’s Lounge',
      slug: '90s-lounge',
      clientName: '90’s Lounge',
      editorialHeadline: 'Food, drinks and the feeling of a night out.',
      industry: 'Restaurant & Hospitality',
      servicesSummary: 'Social Media Marketing • Video Production • Creative Content',
      categories: [categoryMap.social, categoryMap.video].filter(Boolean),
      coverImageUrl: '/images/social-reel-cover.png',
      overview:
        'For 90’s Lounge, our work includes food and beverage content, promotional reels and social campaigns that highlight the menu and atmosphere. We gave the food and drinks room to stand out while capturing the feeling of the space, developing short-form sequences that connect menu details with the wider nightlife experience.',
      featured: true,
      showOnHome: true,
      showOnWorks: true,
      displayOrder: 2,
      gallery: [
        {
          blockType: 'wideImage',
          imageUrl: '/images/interior-dining.png',
          caption: 'Atmospheric dining lounge and craft mixology bar under low warm lighting.',
        },
        {
          blockType: 'imagePair',
          imageLeftUrl: '/images/social-reel-cover.png',
          imageRightUrl: '/images/food-reel-cover.png',
          caption: 'Cocktail craftsmanship and late-night culinary bites.',
        },
      ],
      _status: 'published',
    },
    {
      title: 'Piravi',
      slug: 'piravi',
      clientName: 'Piravi',
      editorialHeadline: 'A closer look at the dining experience.',
      industry: 'Restaurant & Hospitality',
      servicesSummary: 'Content · Social media · Video',
      categories: [categoryMap.social, categoryMap.video].filter(Boolean),
      coverImageUrl: '/images/food-reel-cover.png',
      overview:
        'Our social content for Piravi showcases the restaurant’s food, identity and dining experience through content creation and video production. Connecting dishes with the wider character of the restaurant, we used focused food visuals and short-form storytelling to introduce the dining experience to both new and regular patrons.',
      featured: true,
      showOnHome: true,
      showOnWorks: true,
      displayOrder: 3,
      gallery: [
        {
          blockType: 'wideImage',
          imageUrl: '/images/food-reel-cover.png',
          caption: 'Intimate culinary plating and tableside service captures.',
        },
        {
          blockType: 'captionedImage',
          imageUrl: '/images/tharavadu-macro.png',
          caption: 'Food at the centre of the narrative.',
        },
      ],
      _status: 'published',
    },
    {
      title: 'Biryani & Barbeque',
      slug: 'biryani-and-barbeque',
      clientName: 'Biryani & Barbeque',
      editorialHeadline: 'Food, framed for the screen.',
      industry: 'Restaurant & Hospitality',
      servicesSummary: 'Film · Creative direction · Commercial content',
      categories: [categoryMap.video, categoryMap.campaigns, categoryMap.photo].filter(Boolean),
      coverImageUrl: '/images/hero-culinary.png',
      overview:
        'A cinematic food production presenting Biryani & Barbeque’s dishes through detailed visuals, creative lighting and engaging storytelling. Letting close-up detail and lighting carry the visual direction, we built a film around the dishes and their on-screen presence.',
      featured: true,
      showOnHome: true,
      showOnWorks: true,
      displayOrder: 4,
      gallery: [
        {
          blockType: 'video',
          videoPosterUrl: '/images/hero-culinary.png',
          heading: 'Watch the Production Reel',
          caption: 'Cinematic commercial film grading for Biryani & Barbeque.',
        },
      ],
      _status: 'published',
    },
  ]

  for (const proj of projectsData) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: proj.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Project exists: ${proj.title}`)
    } else {
      await payload.create({
        collection: 'projects',
        data: proj as any,
        draft: false,
      })
      console.log(`  + Created project: ${proj.title}`)
    }
  }

  // 3. Optional initial Owner creation if credentials provided via env
  if (process.env.INITIAL_OWNER_EMAIL && process.env.INITIAL_OWNER_PASSWORD) {
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: process.env.INITIAL_OWNER_EMAIL } },
      limit: 1,
    })

    if (existingUser.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          name: 'First Studio Owner',
          email: process.env.INITIAL_OWNER_EMAIL,
          password: process.env.INITIAL_OWNER_PASSWORD,
          role: 'owner',
        },
      })
      console.log(`  + Created initial owner account for ${process.env.INITIAL_OWNER_EMAIL}`)
    } else {
      console.log(`  ✓ Owner user already exists`)
    }
  }

  const {seedServices}=await import('../lib/seed-services')
  await seedServices(payload)
  console.log('✅ Seed completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
