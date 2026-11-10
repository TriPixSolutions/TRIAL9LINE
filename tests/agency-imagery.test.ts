import { describe, it, expect } from 'vitest'
import { agencyAsset, agencyAlt, legacyTemplateImage } from '../src/lib/agency-imagery'

describe('agency imagery compatibility',()=>{
  it('replaces imported template images even when Cloudinary changed their URL',()=>{
    expect(agencyAsset({filename:'tharavadu-macro-2.webp',cloudinaryUrl:'https://res.cloudinary.com/demo/image/upload/opaque.webp'})?.src).toBe('/images/agency/commercial-photography.webp')
  })
  it('replaces local legacy fallbacks and their stale descriptions',()=>{
    expect(agencyAsset(null,'/images/food-reel-cover.png')?.src).toBe('/images/agency/film-production.webp')
    expect(agencyAlt(null,'/images/food-reel-cover.png','Chef plating')).toContain('cinema camera')
  })
  it('preserves unrelated custom uploads and descriptions',()=>{
    expect(agencyAsset({filename:'client-launch.webp',url:'https://example.com/photo.jpg'})).toBeUndefined()
    expect(agencyAlt({filename:'client-launch.webp'},null,'Client launch')).toBe('Client launch')
  })
  it('recognises refreshed library records without replacing arbitrary same-name uploads',()=>{
    expect(agencyAsset({filename:'film-production.webp',caption:'Illustrative agency imagery'})).toBeDefined()
    expect(agencyAsset({filename:'film-production.webp'})).toBeUndefined()
    expect(legacyTemplateImage({filename:'film-production.webp',caption:'Illustrative agency imagery'})).toBe(false)
    expect(legacyTemplateImage({filename:'food-reel-cover.webp'})).toBe(true)
  })
})
