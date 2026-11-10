import {cloudinaryImageUrl} from '@/lib/responsive-media'
import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={'arrow-icon ' + className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
  </svg>
}
export function Action({ href, children, light = false, secondary = false }: { href: string; children: ReactNode; light?: boolean; secondary?: boolean }) {
  return <Link href={href} className={'studio-action' + (light ? ' is-light' : '') + (secondary ? ' is-secondary' : '')}><span>{children}</span><Arrow diagonal /></Link>
}
export function Label({ children, number }: { children: ReactNode; number?: string }) {
  return <div className="section-label">{number && <span className="label-number">{number}</span>}<span>{children}</span></div>
}
export function StudioImage({ src, alt, className = '', priority = false, sizes = '100vw', position }: { src: string; alt: string; className?: string; priority?: boolean; sizes?: string; position?:string }) {
  if(src.startsWith('/images/editorial/')&&src.endsWith('.webp'))return <img src={src} srcSet={[480,960].map(width=>src.replace('.webp',`-${width}.webp`)+` ${width}w`).concat(src+' 1536w').join(', ')} sizes={sizes} alt={alt} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectPosition:position}} className={'studio-image '+className}/>
  if(src.startsWith('https://res.cloudinary.com/')&&src.includes('/image/upload/'))return <img src={cloudinaryImageUrl(src,1600)} srcSet={[320,640,960,1280,1600,1920].map(w=>cloudinaryImageUrl(src,w)+' '+w+'w').join(', ')} alt={alt} sizes={sizes} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectPosition:position}} className={'studio-image '+className}/>
  return <Image style={{objectPosition:position}} src={src} alt={alt} fill priority={priority} sizes={sizes} unoptimized={src.endsWith('.webp') || src.startsWith('http') || src.startsWith('/api/')} className={'studio-image ' + className} />
}
export function InquiryCTA({ heading = 'Have a good story?', text = 'Let’s make something people remember.', href = '/contact', label = 'Start a project' }: { heading?: string; text?: string; href?: string; label?: string }) {
  return <section className="inquiry-band"><div className="studio-container inquiry-inner">
    <div><h2>{heading}</h2><p>{text}</p></div>
    <Action href={href} light>{label}</Action>
  </div></section>
}
