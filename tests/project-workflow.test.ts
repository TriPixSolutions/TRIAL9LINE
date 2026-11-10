import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayloadClient } from '@/lib/payload'

describe('Project Workflow & Publication Lifecycle', () => {
  let payload: any
  let categoryId: number
  let testProjectId: number
  const testSlug = 'vitest-automated-case-study'

  beforeAll(async () => {
    payload = await getPayloadClient()
    const categories = await payload.find({ collection: 'categories', limit: 1 })
    categoryId = categories.docs[0]?.id || 1
  })

  afterAll(async () => {
    if (testProjectId) {
      try {
        await payload.delete({ collection: 'projects', id: testProjectId })
      } catch (e) {
        // cleanup
      }
    }
  })

  it('creates a draft project that is excluded from published queries', async () => {
    const created = await payload.create({
      collection: 'projects',
      data: {
        title: 'Vitest Automated Case Study',
        slug: testSlug,
        editorialHeadline: 'Testing automated project publication flow.',
        overview: 'Comprehensive verification test for Payload project workflow.',
        categories: [categoryId],
        _status: 'draft',
      },
      draft: true,
    })

    testProjectId = created.id
    expect(created.id).toBeDefined()
    expect(created._status).toBe('draft')

    // Verify published query does NOT find the draft
    const publishedQuery = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: testSlug },
        _status: { equals: 'published' },
      },
    })
    expect(publishedQuery.docs.length).toBe(0)
  })

  it('publishes the project and makes it visible in published queries', async () => {
    const updated = await payload.update({
      collection: 'projects',
      id: testProjectId,
      data: {
        _status: 'published',
      },
    })

    expect(updated._status).toBe('published')

    const publishedQuery = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: testSlug },
        _status: { equals: 'published' },
      },
      depth: 2,
    })

    expect(publishedQuery.docs.length).toBe(1)
    expect(publishedQuery.docs[0].title).toBe('Vitest Automated Case Study')
    expect(publishedQuery.docs[0].editorialHeadline).toBe('Testing automated project publication flow.')
  })

  it('unpublishes the project so it is removed from public queries', async () => {
    const unpublished = await payload.update({
      collection: 'projects',
      id: testProjectId,
      data: {
        _status: 'draft',
      },
      draft: false,
    })

    expect(unpublished._status).toBe('draft')

    const publishedQuery = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: testSlug },
        _status: { equals: 'published' },
      },
    })
    expect(publishedQuery.docs.length).toBe(0)
  })
})
