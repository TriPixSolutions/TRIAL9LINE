import Link from 'next/link'
import { portfolioSections } from '@/lib/portfolio-sections'
import { Arrow, StudioImage } from './Studio'

export function PortfolioSections({ className = "work-grid" }: { className?: string }) {
  return <div className={className}>
    {portfolioSections.map(section => <Link className={`project-card portfolio-section-card portfolio-section-${section.slug}`} key={section.slug} href={'/work/sections/' + section.slug}>
      <div className="project-cover">
        <StudioImage src={section.image} alt={section.title + ' creative work'} sizes="(max-width:540px) 100vw, (max-width:1100px) 50vw, 33vw" />
        {section.slug === 'performance-marketing' && <div className="performance-card-preview" aria-hidden="true">
          <span>Sample campaign snapshot</span>
          <div><strong>151</strong><small>Leads</small></div>
          <div><strong>$14.77</strong><small>Cost / lead</small></div>
        </div>}
      </div>
      <div className="project-card-meta"><h3>{section.title}</h3><Arrow diagonal /></div>
      <p>{section.description}</p>
    </Link>)}
  </div>
}
