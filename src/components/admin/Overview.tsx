import React from 'react'
import Link from 'next/link'
import type { Payload, PayloadRequest } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { normalizePortfolioCategory, portfolioSections } from '@/lib/portfolio-sections'

type Project = Record<string, any>

function categoryManageHref(slug: string) {
  if (slug === 'video-production') return '/admin/collections/projects?where[or][0][portfolioCategory][equals]=video-production&where[or][1][portfolioCategory][equals]=content-production'
  return `/admin/collections/projects?where[portfolioCategory][equals]=${slug}`
}

function CategoryWorkspace({ projects }: { projects: Project[] }) {
  return <section className="studio-category-workspace" aria-labelledby="portfolio-workspace-title">
    <div className="studio-category-workspace-heading"><div><p className="studio-admin-eyebrow">FIVE PORTFOLIO CATEGORIES</p><h2 id="portfolio-workspace-title">Choose where the work belongs.</h2></div><p>Each category opens the right upload fields and updates its public page automatically.</p></div>
    <div className="studio-category-cards">{portfolioSections.map((section,index) => {
      const categoryProjects=projects.filter(project=>normalizePortfolioCategory(project.portfolioCategory)===section.slug)
      const published=categoryProjects.filter(project=>project._status==='published').length
      const drafts=categoryProjects.length-published
      return <article key={section.slug}>
        <div className="studio-category-card-top"><span>0{index+1}</span><i aria-hidden="true">{['▶','▦','↗','◉','◇'][index]}</i></div>
        <h3>{section.title}</h3><p>{section.description}</p>
        <dl><div><dt>Published</dt><dd>{published}</dd></div><div><dt>Drafts</dt><dd>{drafts}</dd></div></dl>
        <div className="studio-category-actions"><Link href={categoryManageHref(section.slug)}>Manage</Link><Link href={`/admin/collections/projects/create?category=${section.slug}`}>＋ Add new</Link></div>
      </article>
    })}</div>
  </section>
}

async function portfolioProjects(payload: Payload) {
  const result=await payload.find({collection:'projects',depth:0,pagination:false,draft:true,overrideAccess:true})
  return result.docs as Project[]
}

export async function Overview({payload,user}:{payload:Payload;user:PayloadRequest['user']}) {
  const role=String(user?.role)
  const content=['owner','editor'].includes(role)
  const leads=['owner','inquiry_manager'].includes(role)
  const [projects,newInquiries]=await Promise.all([
    content?portfolioProjects(payload):Promise.resolve([]),
    leads?payload.count({collection:'inquiries',where:{leadStatus:{equals:'new'}},overrideAccess:false,user}):null,
  ])
  const published=projects.filter(project=>project._status==='published').length
  const drafts=projects.length-published
  return <section className="studio-admin-overview">
    <div className="studio-admin-welcome"><div><p className="studio-admin-eyebrow">PORTFOLIO STUDIO</p><h1>Upload the work.<br/>The grid builds itself.</h1><p>Choose a category, add its media and decide where the work appears.</p></div>{content&&<Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add portfolio work</Link>}</div>
    {content&&<CategoryWorkspace projects={projects}/>}
    <div className="studio-admin-stats">
      {content&&<Link href="/admin/collections/projects"><span>Published portfolio items</span><strong>{String(published).padStart(2,'0')}</strong><span>Open portfolio ↗</span></Link>}
      {content&&<Link href="/admin/collections/projects?where[_status][equals]=draft"><span>Drafts in progress</span><strong>{String(drafts).padStart(2,'0')}</strong><span>Review drafts ↗</span></Link>}
      {leads&&<Link href="/admin/collections/inquiries"><span>New inquiries</span><strong>{String(newInquiries?.totalDocs||0).padStart(2,'0')}</strong><span>Open inbox ↗</span></Link>}
    </div>
    <div className="studio-admin-links">{content&&<><Link href="/admin/collections/media">Media library ↗</Link><Link href="/admin/globals/work-page">Works appearance ↗</Link></>}<Link href="/" target="_blank">Visit website ↗</Link></div>
  </section>
}

export async function ProjectGuide(){
  const payload=await getPayloadClient()
  const projects=await portfolioProjects(payload)
  return <><div className="studio-admin-guide"><div><p className="studio-admin-eyebrow">PORTFOLIO</p><h2>Category-based media workspace</h2><p>Manage published work and drafts by category, or start a new upload with the correct fields already selected.</p></div><Link className="studio-admin-primary" href="/admin/collections/projects/create">＋ Add portfolio work</Link></div><CategoryWorkspace projects={projects}/></>
}
