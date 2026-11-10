import {describe,it,expect} from 'vitest'
import {deploymentErrors} from '../scripts/deployment-env.mjs'
const valid={DATABASE_URI:'mongodb+srv://user:password@cluster.example.mongodb.net/trail9ine',PAYLOAD_SECRET:'a'.repeat(40),WORKER_AUTH_SECRET:'b'.repeat(40),NEXT_PUBLIC_SERVER_URL:'https://studio.example.com',CLOUDINARY_CLOUD_NAME:'example',CLOUDINARY_API_KEY:'example',CLOUDINARY_API_SECRET:'example',EMAIL_SIMULATION:'false',PAYLOAD_SCHEMA_PUSH:'false'}
describe('Hostinger production configuration',()=>{
 it('accepts external database/media configuration',()=>expect(deploymentErrors(valid)).toEqual([]))
 it('rejects a local database that would be lost on redeployment',()=>expect(deploymentErrors({...valid,DATABASE_URI:'file:./local-dev.db'}).some(e=>e.startsWith('DATABASE_URI'))).toBe(true))
 it('rejects missing secrets without echoing values',()=>{const e=deploymentErrors({...valid,PAYLOAD_SECRET:'short',CLOUDINARY_API_SECRET:''});expect(e).toHaveLength(2);expect(e.join()).not.toContain('short')})
 it('rejects simulation and schema push in production',()=>expect(deploymentErrors({...valid,EMAIL_SIMULATION:'true',PAYLOAD_SCHEMA_PUSH:'true'})).toHaveLength(2))
 it('rejects credential-bearing, local and insecure public origins',()=>{for(const url of ['http://studio.example.com','https://localhost','https://user:secret@example.com','https://example.com/path'])expect(deploymentErrors({...valid,NEXT_PUBLIC_SERVER_URL:url}).some(e=>e.startsWith('NEXT_PUBLIC_SERVER_URL'))).toBe(true)})
})
