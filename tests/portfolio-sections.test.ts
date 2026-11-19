import { describe, expect, it } from 'vitest'
import { belongsToSection, normalizePortfolioSections, sectionGallery } from '../src/lib/portfolio-sections'
import { inquirySchema } from '../src/lib/inquiries'

describe('Service portfolios', () => {
  it('uses legacy services and populated categories without relying on client names', () => {
    expect(belongsToSection({ title: 'A restaurant', categories: [{ name: 'Photography' }] }, 'food-photography')).toBe(true)
    expect(belongsToSection({ title: 'Video restaurant' }, 'video-production')).toBe(false)
  })
  it('honours explicit assignments and handles normalized legacy selections', () => {
    expect(belongsToSection({ portfolioSections: [], servicesSummary: 'Video' }, 'video-production')).toBe(true)
    expect(normalizePortfolioSections(['content-production', 'content-creation'])).toEqual(['video-production', 'content-creation'])
    expect(belongsToSection({ portfolioCategory: 'content-production' }, 'video-production')).toBe(true)
    expect(belongsToSection({ portfolioSections: ['creative-designs'] }, 'creative-designs')).toBe(true)
  })
  it('groups legacy results and campaign visuals from their content blocks', () => {
    const project = { servicesSummary: 'Restaurant content', gallery: [
      { blockType: 'videoResults' },
      { blockType: 'mediaGrid', gridItems: [{ kind: 'photo', title: 'Seasonal campaign visual' }] },
    ] }
    expect(belongsToSection(project, 'performance-marketing')).toBe(true)
    expect(belongsToSection(project, 'food-photography')).toBe(true)
    expect(belongsToSection(project, 'creative-designs')).toBe(true)
  })
  it('keeps images and videos in their corresponding sections', () => {
    const blocks = [{ blockType: 'mediaGrid', gridItems: [{ kind: 'video' }, { kind: 'image' }] }, { blockType: 'videoResults' }]
    expect(sectionGallery(blocks, 'food-photography')[0].gridItems).toEqual([{ kind: 'image' }])
    expect(sectionGallery(blocks, 'video-production')[0].gridItems).toEqual([{ kind: 'video' }])
    expect(sectionGallery(blocks, 'content-creation')[0].gridItems).toEqual([{ kind: 'video' }])
    expect(sectionGallery(blocks, 'performance-marketing')).toEqual([blocks[1]])
  })
  it('accepts website design inquiries', () => {
    expect(inquirySchema.shape.serviceInterest.safeParse('website-designing').success).toBe(true)
  })
})
