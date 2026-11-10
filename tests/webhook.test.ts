import {createHmac} from 'node:crypto'
import {describe,expect,it} from 'vitest'
import {verifyWebhook} from '@/lib/webhook-signature'
describe('Signed delivery events',()=>{
 const secret='whsec_'+Buffer.from('a-test-signing-key').toString('base64'),body='{"type":"email.delivered"}',timestamp=String(Math.floor(Date.now()/1000)),id='event-test'
 const signature=createHmac('sha256',Buffer.from('a-test-signing-key')).update(`${id}.${timestamp}.${body}`).digest('base64')
 const headers=new Headers({'svix-id':id,'svix-timestamp':timestamp,'svix-signature':'v1,'+signature})
 it('accepts a correctly signed recent payload',()=>expect(verifyWebhook(body,headers,secret)).toBe(true))
 it('rejects a modified body',()=>expect(verifyWebhook(body+' ',headers,secret)).toBe(false))
 it('rejects a replay outside the timestamp window',()=>expect(verifyWebhook(body,headers,secret,Date.now()+600000)).toBe(false))
 it('rejects missing signatures',()=>expect(verifyWebhook(body,new Headers(),secret)).toBe(false))
})
