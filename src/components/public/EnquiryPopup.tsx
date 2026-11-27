'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ContactForm } from './ContactForm'

const seenKey = 'trail9ine-enquiry-shown'

export function EnquiryPopup() {
  const path = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const shown = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (shown.current || path === '/contact' || path === '/privacy') return
    try { if (sessionStorage.getItem(seenKey)) return } catch { /* Storage may be disabled. */ }
    const timer = window.setTimeout(() => {
      if (document.visibilityState !== 'visible' || document.querySelector('dialog[open]')) return
      setVisible(true)
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [path])

  useEffect(() => {
    const element = dialog.current
    if (!visible || !element) return
    element.showModal()
    shown.current = true
    try { sessionStorage.setItem(seenKey, '1') } catch { /* The layout still remembers this visit. */ }
    return () => element.close()
  }, [visible])

  if (!visible) return null
  return <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="enquiry-title"
    onClose={() => setVisible(false)} onClick={event => {
      if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close()
      }
    }}>
    <header><h2 id="enquiry-title">Project enquiry</h2>
      <button autoFocus type="button" className="enquiry-close" aria-label="Close enquiry" onClick={() => dialog.current?.close()}>×</button>
    </header>
    <ContactForm compact />
  </dialog>
}
