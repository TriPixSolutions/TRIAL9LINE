import { describe, expect, it } from 'vitest'
import { resolveProjectVideo } from '../src/lib/project-video'
describe('Project video sources', () => {
  it.each([
    ['https://www.youtube.com/watch?v=M7lc1UVf-VE&feature=share','youtube'],
    ['https://youtu.be/M7lc1UVf-VE?si=tracking','youtube'],
    ['https://www.youtube.com/shorts/M7lc1UVf-VE','youtube'],
    ['https://www.instagram.com/reel/ExampleCode_1/?igsh=tracking','instagram'],
    ['https://instagram.com/p/ExampleCode_1/','instagram'],
    ['https://vimeo.com/123456789','vimeo'],
    ['/api/media/file/project.mp4','file'],
    ['https://media.example.com/project.webm?signature=test','file'],
  ])('normalises supported links: %s', (link, kind) => {
    expect(resolveProjectVideo(link)?.kind).toBe(kind)
  })
  it.each(['javascript:alert(1)','//evil.example/video.mp4','https://youtube.com.evil.example/watch?v=M7lc1UVf-VE','https://www.youtube.com/watch?v=invalid','https://instagram.com/username/','https://instagram.com/reel/code/extra/','https://user:secret@vimeo.com/123','https://example.com/embed/123'])('rejects unsafe or unsupported URLs: %s', link => {
    expect(resolveProjectVideo(link)).toBeNull()
  })
  it('strips Instagram tracking and constructs a canonical embed', () => {
    expect(resolveProjectVideo('https://instagram.com/reel/ExampleCode_1/?igsh=tracking')?.src).toBe('https://www.instagram.com/reel/ExampleCode_1/embed/')
  })
})
