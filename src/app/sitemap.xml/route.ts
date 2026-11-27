import { siteUrl } from '@/lib/seo'
import { groups } from '@/lib/sitemap-content'
import { sitemapXml } from '@/lib/sitemap-xml'

export function GET() {
  return sitemapXml(groups.map(group => ({ url: siteUrl + '/' + group.file })), true)
}
