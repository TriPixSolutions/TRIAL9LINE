import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { seoMetadata, socialImagePath } from '../src/lib/seo'

describe('SEO metadata', () => {
  it('builds a canonical page with branded social cards', () => {
    const metadata = seoMetadata({
      title: 'Food Photography Portfolio Toronto',
      description: 'Professional food photography in Toronto, Ontario, Canada.',
      path: '/work/sections/food-photography',
    })

    expect(metadata.alternates?.canonical).toBe('/work/sections/food-photography')
    expect(metadata.openGraph).toMatchObject({
      title: 'Food Photography Portfolio Toronto | Trail9ine Media',
      locale: 'en_CA',
      images: [{ url: socialImagePath, width: 1200, height: 630 }],
    })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: [socialImagePath] })
  })

  it('uses a WhatsApp-friendly 1200 by 630 logo image', async () => {
    const image = await sharp('public/images/trail9ine-social-share.jpg').metadata()
    expect(image.width).toBe(1200)
    expect(image.height).toBe(630)
    expect(image.format).toBe('jpeg')
  })
})
