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
    <div className="studio-admin-welcome"><div><p className="studio-admin-eyebrow">YOUR STUDIO, IN ONE PLACE</p><h1>Make room for<br/>your next great project.</h1><p>Keep your work fresh, your stories considered and your website up to date.</p></div>{content&&<Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add a project</Link>}</div>
    <div className="studio-admin-stats">{counts.map((c,i)=>c&&<Link key={i} href={i===2?'/admin/collections/inquiries':'/admin/collections/projects'}><span>{['Published projects','Drafts in progress','New inquiries'][i]}</span><strong>{String(c.totalDocs).padStart(2,'0')}</strong><span>Open {i===2?'inbox':'projects'} ↗</span></Link>)}</div>
    {content&&<div className="studio-admin-start"><div><span>01</span><h3>Tell the story</h3><p>Add the client, project introduction and services.</p></div><div><span>02</span><h3>Bring the work</h3><p>Upload photographs, add a film and arrange your gallery.</p></div><div><span>03</span><h3>Choose where it lives</h3><p>Preview, select Home or Works, then publish when ready.</p></div></div>}
    <div className="studio-admin-links">{content&&<><Link href="/admin/collections/media">Media library ↗</Link><Link href="/admin/globals/work-page">Works appearance ↗</Link></>}<Link href="/" target="_blank">Visit website ↗</Link></div>
  </section>
}
export function ProjectGuide(){return <div className="studio-admin-guide"><div><p className="studio-admin-eyebrow">PORTFOLIO</p><h2>Your work deserves a good story.</h2><p>Create a draft, arrange your images and choose where it appears. Only published projects are public.</p></div><Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add a project</Link></div>}
