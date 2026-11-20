'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export type PortfolioFilterCategory = { slug: string; name: string }

export function PortfolioCategoryFilter({ categories, children }: { categories: PortfolioFilterCategory[]; children: ReactNode }) {
  const [active, setActive] = useState('all')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.querySelectorAll<HTMLElement>('[data-portfolio-category]').forEach(item => {
      item.hidden = active !== 'all' && item.dataset.portfolioCategory !== active
    })
  }, [active])

  if (categories.length < 2) return <>{children}</>

  return <div className="portfolio-category-browser">
    <div className="portfolio-category-filter" role="group" aria-label="Filter portfolio by category">
      <button type="button" className={active === 'all' ? 'is-active' : ''} aria-pressed={active === 'all'} onClick={() => setActive('all')}>All</button>
      {categories.map(category => <button type="button" key={category.slug} className={active === category.slug ? 'is-active' : ''} aria-pressed={active === category.slug} onClick={() => setActive(category.slug)}>{category.name}</button>)}
    </div>
    <div ref={contentRef}>{children}</div>
  </div>
}
