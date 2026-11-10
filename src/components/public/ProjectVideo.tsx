'use client'
import { useState } from 'react'
import type { ProjectVideoSource } from '@/lib/project-video'
import { StudioImage } from './Studio'

export function ProjectVideo({ source, title, poster }: { source: ProjectVideoSource; title: string; poster?: string | null }) {
  const [active, setActive] = useState(false)
  const provider = { youtube: 'YouTube', instagram: 'Instagram', vimeo: 'Vimeo', file: 'Video' }[source.kind]
  return <div className="project-video-player">
    <div className={'project-video-stage' + (source.portrait ? ' is-portrait' : '') + (source.kind === 'instagram' ? ' is-instagram' : '')}>
      {source.kind === 'file' ? <video className="project-video-frame" controls playsInline preload="none" poster={poster || undefined} aria-label={title}><source src={source.src} />Your browser cannot play this video. <a href={source.originalUrl}>Open the video</a>.</video> : active ? <iframe className="project-video-frame" src={source.src + (source.kind === 'youtube' ? '&autoplay=1' : '')} title={title + ' — ' + provider} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="video-launch" type="button" onClick={() => setActive(true)} aria-label={'Play ' + title + ' on ' + provider}>
        {poster && <StudioImage src={poster} alt="" sizes={source.portrait ? '(max-width:767px) 100vw, 480px' : '100vw'} />}
        <span className="video-launch-content"><span className="video-play-icon" aria-hidden="true">▶</span><span>{title}</span><span className="video-provider">Watch on {provider}</span></span>
      </button>}
    </div>
    {source.kind !== 'file' && <p className="video-external-note">Player unavailable? <a href={source.originalUrl} target="_blank" rel="noopener noreferrer">Open on {provider} ↗</a></p>}
  </div>
}
