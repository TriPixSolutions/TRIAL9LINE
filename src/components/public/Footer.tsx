import Link from 'next/link'
import { Arrow } from './Studio'
import { siteServices, siteGlobal } from '@/lib/site-content'
export async function Footer() {
  const [studioServices,settings]=await Promise.all([siteServices(),siteGlobal('site-settings')])
  return <footer className="site-footer"><div className="studio-container">
    <div className="footer-expanded">
      <div className="footer-description"><h2>A good place<br />to start.</h2><p>{settings.tagline}</p><Link href="/contact" className="footer-inquiry">Tell us about your project <Arrow diagonal /></Link></div>
      <div className="footer-column"><h3>Explore</h3><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/work">Works</Link><Link href="/about">About Us</Link><Link href="/services">Services</Link><Link href="/contact">Contact Us</Link></nav></div>
      <div className="footer-column"><h3>What we do</h3><nav aria-label="Services">{studioServices.map(service => <Link key={service.slug} href={'/services/' + service.slug}>{service.title}</Link>)}</nav></div>
      <div className="footer-column footer-studio"><h3>Contact</h3><p>{settings.location}</p><p><a href={"mailto:"+settings.contactEmail}>{settings.contactEmail}</a></p></div>
    </div>
    <Link href="/" className="footer-wordmark" aria-label="Trail9ine Media home">TRAIL9INE</Link>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Trail9ine Media</span><span>Creative production & marketing</span><Link href="/privacy">Privacy policy</Link></div>
  </div></footer>
}
