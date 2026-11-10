import {createHmac,timingSafeEqual} from 'node:crypto'
export function verifyWebhook(body:string,headers:Headers,secret:string,now=Date.now()):boolean{
 const id=headers.get('svix-id'),timestamp=headers.get('svix-timestamp'),signature=headers.get('svix-signature')
 if(!id||!timestamp||!signature||!/^\d+$/.test(timestamp)||Math.abs(now/1000-Number(timestamp))>300)return false
 try{
  const key=Buffer.from(secret.replace(/^whsec_/,''),'base64')
  const expected=createHmac('sha256',key).update(`${id}.${timestamp}.${body}`).digest()
  return signature.split(' ').some(part=>{const [version,value]=part.split(',');if(version!=='v1'||!value)return false;const bytes=Buffer.from(value,'base64');return bytes.length===expected.length&&timingSafeEqual(bytes,expected)})
 }catch{return false}
}
