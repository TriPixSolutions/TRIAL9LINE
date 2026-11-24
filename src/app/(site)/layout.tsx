import {siteServices} from '@/lib/site-content'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { PageMotion } from '@/components/public/PageMotion'
import { seoMetadata, siteUrl, socialImagePath } from '@/lib/seo'

const display = localFont({
  src: [
    { path: '../../assets/fonts/manrope-500.ttf', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/manrope-600.ttf', weight: '600', style: 'normal' },
    { path: '../../assets/fonts/manrope-700.ttf', weight: '700', style: 'normal' },
    { path: '../../assets/fonts/manrope-800.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-display', display: 'swap',
})
const body = localFont({
  src: [
    { path: '../../assets/fonts/inter-400.ttf', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/inter-500.ttf', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/inter-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-body', display: 'swap',
})
export const dynamic = 'force-dynamic'
const homeDescription = 'Trail9ine Media is a Toronto creative marketing agency specializing in video production, content creation, food photography, design and paid advertising.'
export const metadata: Metadata = {
  ...seoMetadata({ title: 'Creative Marketing Agency Toronto', description: homeDescription, path: '/' }),
  metadataBase: new URL(siteUrl),
  title: { default: 'Creative Marketing Agency Toronto | Trail9ine Media', template: '%s | Trail9ine Media' },
  applicationName: 'Trail9ine Media',
  authors: [{ name: 'Trail9ine Media', url: siteUrl }],
  creator: 'Trail9ine Media',
  publisher: 'Trail9ine Media',
  category: 'Creative Marketing Agency',
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
}
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services=await siteServices()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: 'Trail9ine Media',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}${socialImagePath}`,
    email: 'info@trail9ine.ca',
    description: homeDescription,
    address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'Ontario', addressCountry: 'CA' },
    areaServed: [{ '@type': 'City', name: 'Toronto' }, { '@type': 'Country', name: 'Canada' }],
    sameAs: ['https://instagram.com/trail9ine'],
    knowsAbout: ['Video production', 'Content creation', 'Food photography', 'Social media marketing', 'Branding and graphic design', 'Paid advertising'],
  }
  return <html lang="en" className={display.variable + ' ' + body.variable}><body className="studio-site">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header services={services.map(({slug,title})=>({slug,title}))} /><main id="main-content">{children}</main><Footer /><PageMotion />
  </body></html>
}
