export function cloudinaryImageUrl(source:string,width:number){
 try{const url=new URL(source);if(url.hostname!=='res.cloudinary.com'||!url.pathname.includes('/image/upload/'))return source
 url.pathname=url.pathname.replace('/image/upload/',`/image/upload/f_auto,q_auto,c_limit,w_${Math.max(160,Math.min(2400,Math.round(width)))}/`);return url.toString()
 }catch{return source}
}
