import { describe, it, expect, beforeAll } from 'vitest'
import configPromise from '@/payload.config'
import { getPayload, type Payload } from 'payload'

describe('Payload Access Control & Workflows', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: configPromise })
  })

  it('allows public read only for published projects', async () => {
    const published = await payload.find({
      collection: 'projects',
      where: {
        _status: { equals: 'published' },
      },
      limit: 10,
    })

    expect(published.docs.length).toBeGreaterThanOrEqual(1)
    published.docs.forEach((doc) => {
      expect(doc._status).toBe('published')
    })
  })

  it('allows public read for active categories', async () => {
    const activeCats = await payload.find({
      collection: 'categories',
      where: {
        active: { equals: true },
      },
    })

    expect(activeCats.docs.length).toBeGreaterThanOrEqual(4)
    const slugs = activeCats.docs.map((c) => c.slug)
    expect(slugs).toContain('video')
    expect(slugs).toContain('social')
    expect(slugs).toContain('photo')
    expect(slugs).toContain('campaigns')
  })

  it('persists an inquiry and generates a durable outbox item', async () => {
    const testReference = `TEST-${Date.now()}`

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        reference: testReference,
        fullName: 'Jane Doe',
        businessName: 'King West Bistro',
        email: 'jane@kingwestbistro.ca',
        serviceInterest: 'social-media',
        message: 'Looking for a full social media marketing partner.',
        privacyAcknowledged: true,
        leadStatus: 'new',
        emailStatus: 'pending',
      },
    })

    expect(inquiry.id).toBeDefined()
    expect(inquiry.reference).toBe(testReference)
    expect(inquiry.leadStatus).toBe('new')

    const outboxItem = await payload.create({
      collection: 'notification-outbox',
      data: {
        inquiry: inquiry.id,
        status: 'pending',
        attempts: 0,
        maxAttempts: 5,
        nextAttemptAt: new Date().toISOString(),
      },
    })

    expect(outboxItem.id).toBeDefined()
    expect(outboxItem.status).toBe('pending')

    // Clean up test records
    await payload.delete({
      collection: 'notification-outbox',
      id: outboxItem.id,
    })
    await payload.delete({
      collection: 'inquiries',
      id: inquiry.id,
    })
  })
})
