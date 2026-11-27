import type { Metadata } from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://trail9ine.ca').replace(/\/$/, '')
export const socialImagePath = '/images/trail9ine-social-share.jpg'

const defaultKeywords = [
  'Trail9ine Media', 'Trail Nine', 'Trail Nine Line',
  'creative marketing agency Toronto',
  'video production Toronto',
  'content creation Toronto',
  'food photography Toronto',
  'social media marketing Toronto',
  'digital marketing agency Canada',
]

function brandedTitle(title: string) {
  return /trail9ine/i.test(title) ? title : `${title} | Trail9ine Media`
}

export function seoMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const socialTitle = brandedTitle(title)
  return {
    title: /trail9ine/i.test(title) ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...defaultKeywords])],
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: 'Trail9ine Media',
      locale: 'en_CA',
      type: 'website',
      images: [{ url: socialImagePath, width: 1200, height: 630, alt: 'Trail9ine Media logo' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [socialImagePath],
    },
  }
}
