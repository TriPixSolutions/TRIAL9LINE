import type { Metadata } from 'next'
import { ContactForm } from '@/components/public/ContactForm'
export const metadata: Metadata = { title: 'Let’s Talk', description: 'Tell Trail9ine Media about your next creative project. Social media, film, photography, branding and digital marketing in Toronto.' }
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  return <section className="studio-container contact-grid">
    <div className="contact-intro"><h1>It starts<br />with a hello.</h1><p>A new launch. A story worth telling. A brand ready for its next chapter. Tell us what you’re thinking.</p></div>
    <ContactForm key={service || 'default'} initialService={service} />
    <div className="contact-note"><h2>No perfect brief needed.</h2><p>A little about your business and where you need support is a good place to start. We’ll review your inquiry, then get in touch to explore the next steps.</p><small>Based in Toronto, Ontario, Canada.</small></div>
  </section>
}
