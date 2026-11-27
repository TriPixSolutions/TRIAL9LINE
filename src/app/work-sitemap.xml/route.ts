import { workEntries } from '@/lib/sitemap-content'
import { sitemapXml } from '@/lib/sitemap-xml'

export async function GET() {
  return sitemapXml(await workEntries())
}
