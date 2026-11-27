import type { Entry } from './sitemap-content'

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function sitemapXml(entries: Entry[], index = false) {
  const root = index ? 'sitemapindex' : 'urlset'
  const tag = index ? 'sitemap' : 'url'
  const rows = entries.map(({ url, updated }) =>
    `  <${tag}><loc>${escapeXml(url)}</loc>${updated ? '<lastmod>' + escapeXml(updated) + '</lastmod>' : ''}</${tag}>`)
  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    `<${root} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...rows, `</${root}>`,
  ].join('\n'), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=60, stale-if-error=3600' } })
}
