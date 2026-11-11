type ResultKind = 'views' | 'saves' | 'shares' | 'reach' | 'growth'
type Results = Partial<Record<ResultKind, number | null>> & {
  reportingPeriod?: string | null
  extraMetrics?: { label?: string | null; value?: string | null }[]
}

const resultFields: { key: ResultKind; label: string; icon: string }[] = [
  { key: 'views', label: 'Views', icon: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
  { key: 'saves', label: 'Saves', icon: 'M6 4h12v16l-6-4-6 4Z' },
  { key: 'shares', label: 'Shares', icon: 'M4 12 20 4l-5 16-3-7-8-1Z M12 13l8-9' },
  { key: 'reach', label: 'Reach', icon: 'M9 20H4v-4m11 4h5v-4M4 8V4h5m11 4V4h-5 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
  { key: 'growth', label: 'Growth', icon: 'm3 17 6-6 4 4 7-8m-6 0h6v6' },
]
const numbers = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 2 })
const percentage = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 2, signDisplay: 'exceptZero' })

export function ProjectResults({ results }: { results: Results }) {
  const metrics = resultFields.flatMap(({ key, label, icon }) => {
    const value = results[key]
    if (typeof value !== 'number' || !Number.isFinite(value)) return []
    return [{ label, icon, value: key === 'growth' ? percentage.format(value) + '%' : numbers.format(value) }]
  })
  const extras = (results.extraMetrics || []).flatMap(({ label, value }) =>
    label?.trim() && value?.trim() ? [{ label: label.trim(), value: value.trim(), icon: '' }] : [])
  if (!metrics.length && !extras.length) return null

  return <div className="project-results">
    {results.reportingPeriod && <p className="project-results-period">{results.reportingPeriod}</p>}
    <dl className="project-results-grid" aria-label="Campaign results">
      {[...metrics, ...extras].map(({ label, value, icon }, index) => <div key={label + index} className="project-result">
        <dt>{icon && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={icon} /></svg>}{label}</dt>
        <dd>{value}</dd>
      </div>)}
    </dl>
  </div>
}
