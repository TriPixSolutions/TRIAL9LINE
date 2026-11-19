import React from 'react'
import Link from 'next/link'
import type { Payload, PayloadRequest } from 'payload'
export async function Overview({payload,user}:{payload:Payload;user:PayloadRequest['user']}) {
  const role=String(user?.role)
  const content=['owner','editor'].includes(role)
  const leads=['owner','inquiry_manager'].includes(role)
  const counts=await Promise.all([
    content?payload.count({collection:'projects',where:{_status:{equals:'published'}},overrideAccess:false,user}):null,
    content?payload.count({collection:'projects',where:{_status:{equals:'draft'}},overrideAccess:false,user}):null,
    leads?payload.count({collection:'inquiries',where:{leadStatus:{equals:'new'}},overrideAccess:false,user}):null,
  ])
  return <section className="studio-admin-overview">
    <div className="studio-admin-welcome"><div><p className="studio-admin-eyebrow">PORTFOLIO STUDIO</p><h1>Upload the work.<br/>The grid builds itself.</h1><p>Choose a portfolio category, add the matching media and decide where the work appears.</p></div>{content&&<Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add portfolio work</Link>}</div>
    <div className="studio-admin-stats">{counts.map((c,i)=>c&&<Link key={i} href={i===2?'/admin/collections/inquiries':'/admin/collections/projects'}><span>{['Published projects','Drafts in progress','New inquiries'][i]}</span><strong>{String(c.totalDocs).padStart(2,'0')}</strong><span>Open {i===2?'inbox':'projects'} ↗</span></Link>)}</div>
    {content&&<div className="studio-admin-start"><div><span>01</span><h3>Choose a category</h3><p>Content, performance marketing, food photography or creative design.</p></div><div><span>02</span><h3>Upload the work</h3><p>The editor shows only the fields needed for the category you selected.</p></div><div><span>03</span><h3>Choose visibility</h3><p>Publish to the homepage, work page and category portfolio from one place.</p></div></div>}
    <div className="studio-admin-links">{content&&<><Link href="/admin/collections/media">Media library ↗</Link><Link href="/admin/globals/work-page">Works appearance ↗</Link></>}<Link href="/" target="_blank">Visit website ↗</Link></div>
  </section>
}
export function ProjectGuide(){return <div className="studio-admin-guide"><div><p className="studio-admin-eyebrow">PORTFOLIO</p><h2>One simple upload flow.</h2><p>Choose the category first. The dashboard then shows the right video, report, photography or poster fields and builds the public grid automatically.</p></div><Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add portfolio work</Link></div>}
