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
        if (entry.target.getAttribute('data-reveal') === 'capability') {
          entry.target.classList.add('capability-visible')
          observer.unobserve(entry.target)
          return
        }
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

  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    let activeCover: HTMLElement | null = null
    const reset = () => {
      activeCover?.style.removeProperty('--spotlight-x')
      activeCover?.style.removeProperty('--spotlight-y')
      activeCover = null
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return
      const cover = event.target.closest<HTMLElement>('.project-cover')
      if (cover !== activeCover) reset()
      if (!cover) return

      const bounds = cover.getBoundingClientRect()
      activeCover = cover
      cover.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
      cover.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
    }
    main.addEventListener('pointermove', move, { passive: true })
    main.addEventListener('pointerleave', reset)
    return () => {
      main.removeEventListener('pointermove', move)
      main.removeEventListener('pointerleave', reset)
      reset()
    }
  }, [])
  return null
}
