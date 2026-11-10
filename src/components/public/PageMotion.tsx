'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
export function PageMotion() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.animate(
          [{ opacity: 0.5, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'none' }
        )
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.06 })
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(e => observer.observe(e))
    return () => observer.disconnect()
  }, [pathname])
  return null
}
