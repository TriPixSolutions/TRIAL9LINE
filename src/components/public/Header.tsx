'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Arrow } from './Studio'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Works' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact Us' },
]

export function Header({ services = [] }: { services?: Array<{ slug: string; title: string }> }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const pathname = usePathname()
  const menuButton = useRef<HTMLButtonElement>(null)
  const servicesButton = useRef<HTMLButtonElement>(null)
  const servicesGroup = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setMobileServicesOpen(false)
    setDesktopServicesOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleOutside(event: PointerEvent) {
      if (!servicesGroup.current?.contains(event.target as Node)) setDesktopServicesOpen(false)
      if (!header.current?.contains(event.target as Node)) {
        setMobileOpen(false)
        setMobileServicesOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [])

  const current = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
  const serviceList = (mobile = false) => (
    <div id={mobile ? 'mobile-services' : 'desktop-services'} className={mobile ? 'mobile-service-links' : 'service-dropdown'}>
      <Link href="/services" aria-current={pathname === '/services' ? 'page' : undefined}>All services <Arrow diagonal /></Link>
      {services.map(({ slug, title }) => (
        <Link key={slug} href={'/services/' + slug} aria-current={pathname === '/services/' + slug ? 'page' : undefined}>
          {title}<Arrow diagonal />
        </Link>
      ))}
    </div>
  )

  return (
    <header
      ref={header}
      className={'site-header' + (pathname === '/' ? ' home-header' : '') + (mobileOpen ? ' menu-open' : '')}
      onClick={(event) => {
        if ((event.target as Element).closest('a')) {
          setMobileOpen(false)
          setMobileServicesOpen(false)
          setDesktopServicesOpen(false)
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        if (desktopServicesOpen) {
          setDesktopServicesOpen(false)
          servicesButton.current?.focus()
        } else if (mobileOpen) {
          setMobileOpen(false)
          setMobileServicesOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="studio-container header-inner">
        <Link className="brand" href="/" aria-label="Trail9ine Media home">
          <Image src="/images/brand-mark.svg" className="brand-mark" alt="" width={42} height={42} priority />
          <span>TRAIL9INE<span className="brand-sub">MEDIA</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ href, label }) => href === '/services' ? (
            <div
              ref={servicesGroup}
              className="nav-services"
              key={href}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') setDesktopServicesOpen(true) }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse' && !event.currentTarget.querySelector('.service-dropdown :focus')) {
                  setDesktopServicesOpen(false)
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setDesktopServicesOpen(false)
              }}
            >
              <Link href={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>
              <button ref={servicesButton} type="button" className="services-toggle" aria-label="Service pages"
                aria-expanded={desktopServicesOpen} aria-controls={desktopServicesOpen ? 'desktop-services' : undefined}
                onClick={() => setDesktopServicesOpen(value => !value)}
              >⌄</button>
              {desktopServicesOpen && serviceList()}
            </div>
          ) : <Link key={href} href={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="header-contact" href="/contact">Let’s build your brand <Arrow diagonal /></Link>
        <button ref={menuButton} type="button" className="menu-button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen} aria-controls={mobileOpen ? 'mobile-navigation' : undefined}
          onClick={() => { setMobileOpen(value => !value); setMobileServicesOpen(false) }}
        ><span /><span /></button>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="mobile-navigation studio-container" aria-label="Mobile navigation">
          {navigation.map(({ href, label }) => (
            <div key={href} className="mobile-nav-group">
              <div className="mobile-nav-row">
                <Link href={href} aria-current={current(href) ? 'page' : undefined}>
                  {label}{href !== '/services' && <Arrow diagonal />}
                </Link>
                {href === '/services' && <button type="button" className="mobile-service-toggle"
                  aria-label={mobileServicesOpen ? 'Hide service pages' : 'Show service pages'}
                  aria-expanded={mobileServicesOpen} aria-controls={mobileServicesOpen ? 'mobile-services' : undefined}
                  onClick={() => setMobileServicesOpen(value => !value)}
                >{mobileServicesOpen ? '−' : '+'}</button>}
              </div>
              {href === '/services' && mobileServicesOpen && serviceList(true)}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
