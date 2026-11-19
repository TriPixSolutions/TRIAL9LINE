import { describe, expect, it } from 'vitest'
import { belongsToSection, sectionGallery } from '../src/lib/portfolio-sections'
import { inquirySchema } from '../src/lib/inquiries'

describe('Service portfolios', () => {
  it('uses legacy services and populated categories without relying on client names', () => {
    expect(belongsToSection({ title: 'A restaurant', categories: [{ name: 'Photography' }] }, 'food-photography')).toBe(true)
    expect(belongsToSection({ title: 'Video restaurant' }, 'video-production')).toBe(false)
  })
  it('honours explicit assignments and handles normalized legacy selections', () => {
    expect(belongsToSection({ portfolioSections: [], servicesSummary: 'Video' }, 'video-production')).toBe(true)
    expect(belongsToSection({ portfolioSections: ['creative-designs'] }, 'creative-designs')).toBe(true)
  })
  it('keeps images and videos in their corresponding sections', () => {
    const blocks = [{ blockType: 'mediaGrid', gridItems: [{ kind: 'video' }, { kind: 'image' }] }, { blockType: 'videoResults' }]
    expect(sectionGallery(blocks, 'food-photography')[0].gridItems).toEqual([{ kind: 'image' }])
    expect(sectionGallery(blocks, 'performance-marketing')).toEqual([blocks[1]])
  })
  it('accepts website design inquiries', () => {
    expect(inquirySchema.shape.serviceInterest.safeParse('website-designing').success).toBe(true)
  })
})
