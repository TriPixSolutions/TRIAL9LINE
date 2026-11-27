import { expect, it } from 'vitest'
import { getPayloadClient } from '../src/lib/payload'

it('publishes a draft, persists edits, and removes deleted posts from public reads', async () => {
  const payload = await getPayloadClient()
  const slug = 'qa-blog-' + Date.now()
  const post = await payload.create({ collection: 'blogs', data: { slug, title: 'Test article', summary: 'Summary', body: 'First paragraph' } })
  const publicCount = () => payload.count({ collection: 'blogs', where: { slug: { equals: slug } }, overrideAccess: false })
  try {
    expect((await publicCount()).totalDocs).toBe(0)
    await payload.update({ collection: 'blogs', id: post.id, data: { published: true, title: 'Revised article' } })
    expect((await publicCount()).totalDocs).toBe(1)
    expect((await payload.findByID({ collection: 'blogs', id: post.id })).title).toBe('Revised article')
  } finally {
    await payload.delete({ collection: 'blogs', id: post.id })
  }
  expect((await publicCount()).totalDocs).toBe(0)
}, 90000)
