'use client'
import {useEffect,useRef,useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {Arrow} from './Studio'
const navigation=[{href:'/',label:'Home'},{href:'/work',label:'Works'},{href:'/about',label:'About Us'},{href:'/services',label:'Services'},{href:'/contact',label:'Contact Us'}]
export function Header({services=[]}:{services?:Array<{slug:string;title:string}>}){
 const [open,setOpen]=useState(false),[servicesOpen,setServicesOpen]=useState(false)
 const pathname=usePathname(),button=useRef<HTMLButtonElement>(null),servicesButton=useRef<HTMLButtonElement>(null),header=useRef<HTMLElement>(null)
 useEffect(()=>{setOpen(false);setServicesOpen(false)},[pathname])
 useEffect(()=>{
  function handle(e:KeyboardEvent){if(e.key==='Escape'){if(servicesOpen){setServicesOpen(false);servicesButton.current?.focus()}else{setOpen(false);button.current?.focus()}}}
  function outside(e:PointerEvent){if(!header.current?.contains(e.target as Node))setServicesOpen(false)}
  document.addEventListener('keydown',handle);document.addEventListener('pointerdown',outside)
  return()=>{document.removeEventListener('keydown',handle);document.removeEventListener('pointerdown',outside)}
 },[servicesOpen])
 const current=(href:string)=>href==='/'?pathname==='/':pathname===href||pathname.startsWith(href+'/')
 const serviceList=(mobile=false)=><div id={mobile?'mobile-services':'desktop-services'} className={mobile?'mobile-service-links':'service-dropdown'}><Link href="/services">All services <Arrow diagonal/></Link>{services.map(s=><Link key={s.slug} href={'/services/'+s.slug} aria-current={pathname==='/services/'+s.slug?'page':undefined}>{s.title}<Arrow diagonal/></Link>)}</div>
 return <header ref={header} className={'site-header'+(pathname==='/'?' home-header':'')+(open?' menu-open':'')}>
  <div className="studio-container header-inner"><Link className="brand" href="/" aria-label="Trail9ine Media home"><Image src="/images/brand-mark.svg" className="brand-mark" alt="" width={42} height={42} priority/><span>TRAIL9INE<span className="brand-sub">MEDIA STUDIO</span></span></Link>
   <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item=>item.href==='/services'?<div className="nav-services" key={item.href} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setServicesOpen(false)}}><Link href={item.href} aria-current={current(item.href)?'page':undefined}>{item.label}</Link><button ref={servicesButton} type="button" className="services-toggle" aria-label="Show services" aria-expanded={servicesOpen} aria-controls="desktop-services" onClick={()=>setServicesOpen(!servicesOpen)}>⌄</button>{servicesOpen&&serviceList()}</div>:<Link key={item.href} href={item.href} aria-current={current(item.href)?'page':undefined}>{item.label}</Link>)}</nav>
   <Link className="header-contact" href="/contact">Let’s build your brand <Arrow diagonal/></Link><button ref={button} className="menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>{setOpen(!open);setServicesOpen(false)}}><span/><span/></button>
  </div>
  {open&&<nav id="mobile-navigation" className="mobile-navigation studio-container" aria-label="Mobile navigation">{navigation.map((item,i)=><div key={item.href} className="mobile-nav-group"><div className="mobile-nav-row"><Link href={item.href} aria-current={current(item.href)?'page':undefined}><span className="mobile-nav-number">0{i+1}</span>{item.label}<Arrow diagonal/></Link>{item.href==='/services'&&<button type="button" className="mobile-service-toggle" aria-label="Show service pages" aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={()=>setServicesOpen(!servicesOpen)}>{servicesOpen?'−':'＋'}</button>}</div>{item.href==='/services'&&servicesOpen&&serviceList(true)}</div>)}<p>Toronto, Canada · Creative & marketing studio</p></nav>}
 </header>
}
