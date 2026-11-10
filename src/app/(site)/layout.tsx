import {siteServices} from '@/lib/site-content'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { PageMotion } from '@/components/public/PageMotion'

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
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: { default: 'TRAIL9INE MEDIA — Creative & Marketing Studio, Toronto', template: '%s | TRAIL9INE MEDIA' },
  description: 'Film, photography, social media and design for restaurants and ambitious brands. A Toronto creative studio.',
  icons: { icon: '/images/logo.png' },
  openGraph: { siteName: 'TRAIL9INE MEDIA', locale: 'en_CA', type: 'website', images: ['/images/agency/creative-studio.webp'] },
}
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services=await siteServices()
  return <html lang="en" className={display.variable + ' ' + body.variable}><body className="studio-site">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header services={services.map(({slug,title})=>({slug,title}))} /><main id="main-content">{children}</main><Footer /><PageMotion />
  </body></html>
}
