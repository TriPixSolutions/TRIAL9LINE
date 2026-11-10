import { getPayloadClient } from '../src/lib/payload'

async function run() {
  console.log('--- Starting End-to-End Project Workflow Verification ---')
  const payload = await getPayloadClient()

  // 1. Get a category ID
  const categories = await payload.find({ collection: 'categories', limit: 1 })
  if (categories.docs.length === 0) {
    throw new Error('No categories found to link project')
  }
  const categoryId = categories.docs[0].id

  const testTitle = 'E2E Automated Bakery Test'
  const expectedSlug = 'e2e-automated-bakery-test'

  // Clean up any existing test project with this slug
  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: expectedSlug } },
  })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'projects', id: doc.id })
  }

  // STEP 1: Admin creates a project in DRAFT status
  console.log('\n1. Creating DRAFT project...')
  const createdProject = await payload.create({
    collection: 'projects',
    data: {
      title: testTitle,
      // note: test auto-slug or provide slug
      slug: expectedSlug,
      editorialHeadline: 'Handcrafted sourdough under morning light.',
      industry: 'Hospitality & Bakery',
      servicesSummary: 'Social Strategy • Food Photography',
      overview: 'Our production team documented the early morning baking ritual at this artisanal bakery.',
      coverImageUrl: '/images/agency/film-production.webp',
      categories: [categoryId],
      _status: 'draft',
      gallery: [
        {
          blockType: 'wideImage',
          imageUrl: '/images/agency/commercial-photography.webp',
          caption: 'Freshly baked sourdough boules cooling on cedar racks.',
        },
      ],
    },
    draft: true,
  })
  console.log(`✓ Draft project created with ID: ${createdProject.id}, slug: ${createdProject.slug}, status: ${createdProject._status}`)

  // Verify anonymous visitor cannot access draft
  const draftDetailRes = await fetch(`http://localhost:3000/work/${expectedSlug}`, { cache: 'no-store' })
  console.log(`✓ Anonymous GET /work/${expectedSlug} status: ${draftDetailRes.status} (Expected: 404)`)
  if (draftDetailRes.status !== 404) {
    throw new Error(`Expected 404 for draft project, got ${draftDetailRes.status}`)
  }

  const workPageDraftRes = await fetch('http://localhost:3000/work', { cache: 'no-store' })
  const workPageDraftHtml = await workPageDraftRes.text()
  if (workPageDraftHtml.includes(testTitle)) {
    throw new Error('Draft project should NOT appear in public /work grid')
  }
  console.log('✓ Verified: Draft project does NOT appear in public /work grid.')

  // STEP 2: Admin publishes the project
  console.log('\n2. Publishing project...')
  const publishedProject = await payload.update({
    collection: 'projects',
    id: createdProject.id,
    data: {
      _status: 'published',
    },
  })
  console.log(`✓ Project updated to status: ${publishedProject._status}`)

  // Verify project appears in Work grid
  const workPagePubRes = await fetch('http://localhost:3000/work', { cache: 'no-store' })
  const workPagePubHtml = await workPagePubRes.text()
  if (!workPagePubHtml.includes(testTitle)) {
    throw new Error('Published project did not appear in /work grid!')
  }
  if (!workPagePubHtml.includes(`/work/${expectedSlug}`)) {
    throw new Error(`Link /work/${expectedSlug} not found on /work page!`)
  }
  console.log(`✓ Verified: Published project appears in /work grid with link /work/${expectedSlug}`)

  // Verify project detail page loads correctly
  const detailRes = await fetch(`http://localhost:3000/work/${expectedSlug}`, { cache: 'no-store' })
  console.log(`✓ GET /work/${expectedSlug} status: ${detailRes.status} (Expected: 200)`)
  if (detailRes.status !== 200) {
    throw new Error(`Expected 200 for published project, got ${detailRes.status}`)
  }
  const detailHtml = await detailRes.text()
  if (!detailHtml.includes(testTitle)) {
    throw new Error('Detail page does not include project title!')
  }
  if (!detailHtml.includes('Handcrafted sourdough under morning light.')) {
    throw new Error('Detail page does not include editorial headline!')
  }
  if (!detailHtml.includes('Freshly baked sourdough boules')) {
    throw new Error('Detail page does not render gallery block!')
  }
  console.log('✓ Verified: Detail page correctly renders saved title, editorial headline, and gallery block!')

  // STEP 3: Admin edits the published project
  console.log('\n3. Editing published project...')
  await payload.update({
    collection: 'projects',
    id: createdProject.id,
    data: {
      editorialHeadline: 'REVISED: Award-winning sourdough and viennoiserie.',
    },
  })

  const updatedDetailRes = await fetch(`http://localhost:3000/work/${expectedSlug}`, { cache: 'no-store' })
  const updatedDetailHtml = await updatedDetailRes.text()
  if (!updatedDetailHtml.includes('REVISED: Award-winning sourdough and viennoiserie.')) {
    throw new Error('Updated headline not reflected on detail page!')
  }
  console.log('✓ Verified: Published edits immediately update the public content.')

  // STEP 4: Admin unpublishes the project
  console.log('\n4. Unpublishing project...')
  await payload.update({
    collection: 'projects',
    id: createdProject.id,
    data: {
      _status: 'draft',
    },
    draft: false,
  })

  const unpubDetailRes = await fetch(`http://localhost:3000/work/${expectedSlug}`, { cache: 'no-store' })
  console.log(`✓ Anonymous GET /work/${expectedSlug} after unpublish: ${unpubDetailRes.status} (Expected: 404)`)
  if (unpubDetailRes.status !== 404) {
    throw new Error(`Expected 404 after unpublishing, got ${unpubDetailRes.status}`)
  }

  const unpubWorkRes = await fetch('http://localhost:3000/work', { cache: 'no-store' })
  const unpubWorkHtml = await unpubWorkRes.text()
  if (unpubWorkHtml.includes(testTitle)) {
    throw new Error('Unpublished project still appears on /work!')
  }
  console.log('✓ Verified: Unpublishing removes project from /work and prevents anonymous detail access.')

  // STEP 5: Clean up test record
  console.log('\n5. Cleaning up test record...')
  await payload.delete({
    collection: 'projects',
    id: createdProject.id,
  })
  console.log('✓ Test record deleted.')

  console.log('\n=== ALL PROJECT WORKFLOW VERIFICATION TESTS PASSED SUCCESSFULLY! ===\n')
  process.exit(0)
}

run().catch((err) => {
  console.error('\n❌ Verification Failed:', err)
  process.exit(1)
})
