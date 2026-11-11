import {agencyAsset} from './agency-imagery'
import {editorialImages} from './editorial-images'

export function isTemplateImage(media:unknown,fallback?:string|null) {
 return Boolean(agencyAsset(media,fallback))
}
export function projectEditorialImage(doc:any,placement:'home'|'work'|'detail') {
 const filename=doc.coverImage?.filename || doc.coverImageUrl?.split('/').pop()
 const bundledCover=filename===doc.slug+'-work.webp'
 return isTemplateImage(doc.coverImage,doc.coverImageUrl)||bundledCover?editorialImages[doc.slug+'-'+placement]:undefined
}
export function galleryEditorialImage(slug:string,media:unknown,fallback:string|null|undefined,index:number) {
 return isTemplateImage(media,fallback)?editorialImages[slug+'-gallery-'+index]:undefined
}
export function editorialGallery(doc:any,resolveMedia:(media:unknown,fallback?:string|null)=>string) {
 let index=0
 const pick=(media:any,url:string|null|undefined)=>{
  if(!media&&!url)return {src:'',alt:''}
  const image=galleryEditorialImage(doc.slug,media,url,++index)
  return {src:image?.src || resolveMedia(media,url),alt:image?.alt || media?.alt || '',illustrative:Boolean(image)}
 }
 return (doc.gallery || []).map((item:any)=>{
  const image=pick(item.mediaItem,item.imageUrl),left=pick(item.mediaLeft,item.imageLeftUrl),right=pick(item.mediaRight,item.imageRightUrl),poster=pick(item.videoPoster,item.videoPosterUrl)
  const strip=(item.stripImages || []).map((row:any)=>{const value=pick(row.media,row.url);return {url:value.src,alt:value.alt,caption:value.illustrative?null:row.caption}})
  return {...item,imageUrl:image.src,imageAlt:image.alt,imageLeftUrl:left.src,imageLeftAlt:left.alt,imageRightUrl:right.src,imageRightAlt:right.alt,videoPosterUrl:poster.src,videoPosterAlt:poster.alt,
   stripImages:strip,
   gridItems:(item.gridItems || []).map((row:any)=>({ ...row, url:resolveMedia(row.media,row.url), alt:row.media?.alt })),
   caption:[image,left,right,poster].some(value=>value.illustrative)?null:item.caption}
 })
}
