'use client'
import { useState } from 'react'
import type { ProjectVideoSource } from '@/lib/project-video'
import { StudioImage } from './Studio'

export function ProjectVideo({ source, title, poster, sizes }: { source: ProjectVideoSource; title: string; poster?: string | null; sizes?: string }) {
  const [active, setActive] = useState(false)
  const [failed, setFailed] = useState(false)
  const provider = { youtube: 'YouTube', instagram: 'Instagram', vimeo: 'Vimeo', file: 'Video' }[source.kind]
  const showPlayer = active || (source.kind === 'file' && !poster)
  return <div className="project-video-player">
    <div className={'project-video-stage' + (source.portrait ? ' is-portrait' : '') + (source.kind === 'instagram' ? ' is-instagram' : '')}>
      {showPlayer && source.kind === 'file' ? <video className="project-video-frame" src={source.src} controls playsInline autoPlay={active} preload="none" poster={poster || undefined} aria-label={title} onError={() => setFailed(true)}>Your browser cannot play this video. <a href={source.originalUrl}>Open the video</a>.</video> : showPlayer ? <iframe className="project-video-frame" src={source.src + (source.kind === 'youtube' ? '&autoplay=1' : '')} title={title + ' — ' + provider} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="video-launch" type="button" onClick={() => setActive(true)} aria-label={source.kind === 'file' ? 'Play ' + title : 'Play ' + title + ' on ' + provider}>
        {poster && <StudioImage src={poster} alt="" sizes={sizes || (source.portrait ? '(max-width:767px) 100vw, 480px' : '100vw')} />}
        <span className="video-launch-content"><span className="video-play-icon" aria-hidden="true">▶</span><span>{title}</span>{source.kind !== 'file' && <span className="video-provider">Watch on {provider}</span>}</span>
      </button>}
    </div>
    {source.kind !== 'file' && <p className="video-external-note">Player unavailable? <a href={source.originalUrl} target="_blank" rel="noopener noreferrer">Open on {provider} ↗</a></p>}
    {failed && <p className="video-external-note" role="status">Video could not play. <a href={source.originalUrl} target="_blank" rel="noopener noreferrer">Open video ↗</a></p>}
  </div>
}
