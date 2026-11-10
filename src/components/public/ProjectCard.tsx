import Link from 'next/link'
import { Arrow, StudioImage } from './Studio'
export interface ProjectCardData {
  coverPosition?:string; coverAlt?: string; title: string; slug: string; clientName?: string | null; editorialHeadline?: string | null; servicesSummary?: string | null; coverImageUrl?: string | null; categories?: Array<{ name: string; slug: string }>
}
export function ProjectCard({ project }: { project: ProjectCardData }) {
  return <Link href={'/work/' + encodeURIComponent(project.slug)} className="project-card" aria-label={'View project: ' + project.title}>
    <div className="project-cover">{project.coverImageUrl ? <StudioImage position={project.coverPosition} src={project.coverImageUrl} alt={project.coverAlt || project.editorialHeadline || project.title} sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 40vw" /> : <div className="project-placeholder"><span>TRAIL9INE</span><span>{project.title}</span></div>}</div>
    <div className="project-card-meta"><h3>{project.title}</h3><span className="project-view">View project <Arrow diagonal /></span></div>
    <p>{project.servicesSummary || project.categories?.map(c => c.name).join(' · ') || project.editorialHeadline}</p>
  </Link>
}
