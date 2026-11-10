import assert from 'node:assert/strict'
import { getPayloadClient } from '../src/lib/payload'
async function verify() {
  if (!process.env.DATABASE_URI?.includes('/tmp/')) throw new Error('Use an isolated /tmp database for this check.')
  const base = process.env.QA_BASE_URL || 'http://localhost:3001'
  const payload = await getPayloadClient()
  const categories = await payload.find({ collection: 'categories', limit: 1 })
  const slug = 'rebuild-verification-' + Date.now()
  let id: number | string | undefined
  const checks: string[] = []
  try {
    const doc = await payload.create({ collection: 'projects', draft: true, data: {
      title: 'Rebuild Verification Project', slug, overview: 'Unique project overview for checking the rebuilt public template.',
      categories: [categories.docs[0].id], coverImageUrl: '/images/agency/film-production.webp',
      gallery: [{ blockType: 'textBlock', heading: 'Saved gallery content', body: 'This text was entered into the CMS record.' }, { blockType: 'video', heading: 'YouTube project film', videoUrl: 'https://youtu.be/M7lc1UVf-VE' }, { blockType: 'video', heading: 'Instagram project reel', videoUrl: 'https://www.instagram.com/reel/ExampleCode_1/' }],
      _status: 'draft',
    } })
    id = doc.id
    const hidden = await fetch(base + '/work/' + slug)
    assert.equal(hidden.status, 404)
    assert.ok(!(await (await fetch(base + '/work')).text()).includes('/work/' + slug))
    checks.push('Draft excluded from public detail and grid')
    await payload.update({ collection: 'projects', id, data: { _status: 'published' } })
    const work = await (await fetch(base + '/work')).text()
    assert.ok(work.includes('/work/' + slug))
    const detail = await fetch(base + '/work/' + slug)
    assert.equal(detail.status, 200)
    const html = await detail.text()
    for (const expected of ['Rebuild Verification Project', 'Unique project overview', 'Saved gallery content', '/images/agency/film-production.webp']) assert.ok(html.includes(expected), expected)
    for (const expected of ['Play YouTube project film on YouTube', 'Play Instagram project reel on Instagram', 'https://www.youtube.com/watch?v=M7lc1UVf-VE', 'https://www.instagram.com/reel/ExampleCode_1/']) assert.ok(html.includes(expected), expected)
    checks.push('Published detail renders saved text, media, gallery, YouTube and Instagram video controls')
    await payload.update({ collection: 'projects', id, data: { editorialHeadline: 'Updated headline from the CMS' } })
    assert.ok((await (await fetch(base + '/work/' + slug)).text()).includes('Updated headline from the CMS'))
    checks.push('Published updates appear without a rebuild')
    assert.equal((await fetch(base + '/work/' + slug + '?preview=true')).status, 404)
    assert.equal((await fetch(base + '/api/preview?slug=' + slug)).status, 401)
    checks.push('Unauthenticated preview rejected')
    await payload.update({ collection: 'projects', id, draft: false, data: { _status: 'draft' } })
    assert.equal((await fetch(base + '/work/' + slug)).status, 404)
    assert.ok(!(await (await fetch(base + '/work')).text()).includes('/work/' + slug))
    checks.push('Unpublished record removed from detail and grid')
    console.log(JSON.stringify({ passed: checks }, null, 2))
  } finally {
    if (id) await payload.delete({ collection: 'projects', id })
  }
}
verify().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) })
