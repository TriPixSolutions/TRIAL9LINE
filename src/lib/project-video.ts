export type ProjectVideoSource = {
  kind: 'youtube' | 'instagram' | 'vimeo' | 'file'
  src: string
  originalUrl: string
  portrait: boolean
}
export function resolveProjectVideo(value?: string | null): ProjectVideoSource | null {
  if (!value?.trim()) return null
  const source = value.trim()
  if (source.startsWith('//')) return null
  try {
    const local = source.startsWith('/')
    const url = new URL(source, 'https://local.invalid')
    if (url.username || url.password) return null
    if (!local && url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) return null
    if (['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(url.hostname)) {
      const parts = url.pathname.split('/').filter(Boolean)
      const id = url.hostname === 'youtu.be' ? parts[0] : url.pathname === '/watch' ? url.searchParams.get('v') : ['embed','shorts'].includes(parts[0]) ? parts[1] : null
      if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null
      return { kind: 'youtube', src: 'https://www.youtube-nocookie.com/embed/' + id + '?playsinline=1&rel=0', originalUrl: 'https://www.youtube.com/watch?v=' + id, portrait: parts[0] === 'shorts' }
    }
    if (['instagram.com','www.instagram.com'].includes(url.hostname)) {
      const match = url.pathname.match(/^\/(reel|p|tv)\/([a-zA-Z0-9_-]+)(?:\/embed)?\/?$/)
      if (!match) return null
      const canonical = 'https://www.instagram.com/' + match[1] + '/' + match[2] + '/'
      return { kind: 'instagram', src: canonical + 'embed/', originalUrl: canonical, portrait: true }
    }
    if (['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) {
      const match = url.pathname.match(/^\/(?:video\/)?(\d+)\/?$/)
      if (!match) return null
      return { kind: 'vimeo', src: 'https://player.vimeo.com/video/' + match[1], originalUrl: 'https://vimeo.com/' + match[1], portrait: false }
    }
    if (/\.(mp4|webm)$/i.test(url.pathname)) return { kind: 'file', src: source, originalUrl: source, portrait: false }
  } catch {}
  return null
}
