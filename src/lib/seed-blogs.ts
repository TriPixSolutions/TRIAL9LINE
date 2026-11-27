import type { Payload } from 'payload'
import articles from './blog-launch.json'

export async function seedBlogs(payload: Payload) {
  const home = await payload.findGlobal({ slug: 'home-page', depth: 0, select: { blogLaunchSeeded: true } })
  if (home.blogLaunchSeeded) return
  for (const article of articles) {
    const match = { collection: 'blogs' as const, where: { slug: { equals: article.slug } } }
    if ((await payload.count(match)).totalDocs) continue
    try {
      await payload.create({ collection: 'blogs', data: { ...article, published: true } })
    } catch (error) {
      if (!(await payload.count(match)).totalDocs) throw error
    }
  }
  await payload.updateGlobal({ slug: 'home-page', data: { blogLaunchSeeded: true } })
}
