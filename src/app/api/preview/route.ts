import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug || !/^[a-z0-9][a-z0-9_-]*$/i.test(slug)) return new Response('Invalid project slug', { status: 400 })
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || !['owner', 'editor'].includes(String(user.role))) return new Response('Unauthorized preview request', { status: 401 })
  const response = NextResponse.redirect(new URL('/work/' + encodeURIComponent(slug) + '?preview=true', req.url))
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
