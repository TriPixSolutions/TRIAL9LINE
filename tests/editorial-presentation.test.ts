import {describe,it,expect} from 'vitest'
import {editorialImages} from '../src/lib/editorial-images'
import {projectEditorialImage,editorialGallery} from '../src/lib/editorial-presentation'

const stock={filename:'film-production.webp',caption:'Illustrative agency imagery',url:'https://example.com/old.webp'}
describe('distinct contextual photography',()=>{
 it('provides forty unique source images',()=>{
  const images=Object.values(editorialImages)
  expect(images).toHaveLength(40)
  expect(new Set(images.map(image=>image.src)).size).toBe(40)
 })
 it('uses distinct hospitality covers for each project and placement',()=>{
  const covers=['tharavadu','90s-lounge','piravi','biryani-and-barbeque'].flatMap(slug=>['home','work','detail'].map(placement=>projectEditorialImage({slug,coverImage:stock},placement as 'home'|'work'|'detail')?.src))
  expect(covers.every(Boolean)).toBe(true)
  expect(new Set(covers).size).toBe(12)
 })
 it('uses unique gallery scenes without replacing custom media or text',()=>{
  const gallery=editorialGallery({slug:'tharavadu',gallery:[{blockType:'imagePair',mediaLeft:stock,mediaRight:stock},{blockType:'wideImage',mediaItem:{filename:'client-photo.webp',url:'https://example.com/client.webp'},caption:'Original photograph'},{blockType:'textBlock',body:'Client story'}]},(media:any)=>media?.url || '')
  expect(gallery[0].imageLeftUrl).not.toBe(gallery[0].imageRightUrl)
  expect(gallery[1].imageUrl).toBe('https://example.com/client.webp')
  expect(gallery[1].caption).toBe('Original photograph')
  expect(gallery[2].body).toBe('Client story')
 })
 it('preserves custom covers and unknown projects',()=>{
  expect(projectEditorialImage({slug:'tharavadu',coverImage:{filename:'real-client.webp'}},'home')).toBeUndefined()
  expect(projectEditorialImage({slug:'new-client',coverImage:stock},'work')).toBeUndefined()
 })
})
