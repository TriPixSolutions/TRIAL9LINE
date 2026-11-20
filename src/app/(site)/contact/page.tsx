import type { Metadata } from 'next'
import { ContactForm } from '@/components/public/ContactForm'
import { seoMetadata } from '@/lib/seo'
export const metadata: Metadata = seoMetadata({ title: 'Contact a Creative Agency in Toronto', description: 'Contact Trail9ine Media in Toronto for video production, content creation, food photography, branding, social media and digital marketing projects.', path: '/contact' })
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  return <section className="studio-container contact-grid">
    <div className="contact-intro"><h1>It starts<br />with a hello.</h1><p>A new launch. A story worth telling. A brand ready for its next chapter. Tell us what you’re thinking.</p></div>
    <ContactForm key={service || 'default'} initialService={service} />
    <div className="contact-note"><h2>No perfect brief needed.</h2><p>A little about your business and where you need support is a good place to start. We’ll review your inquiry, then get in touch to explore the next steps.</p><small>Based in Toronto, Ontario, Canada.</small></div>
  </section>
}
