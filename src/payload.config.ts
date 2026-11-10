import {randomBytes} from 'node:crypto'
import {deploymentErrors} from '../scripts/deployment-env.mjs'
import { buildConfig } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'
import { Services } from './collections/Services'
import { WorkPage } from './globals/WorkPage'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Inquiries } from './collections/Inquiries'
import { NotificationOutbox } from './collections/NotificationOutbox'

import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function createConfig(){
if(process.env.HOSTING_TARGET==='hostinger'){
  const errors=deploymentErrors(process.env)
  if(errors.length)throw new Error(errors.join(' '))
}
if(process.env.NODE_ENV==='production'&&!process.env.PAYLOAD_SECRET)throw new Error('PAYLOAD_SECRET is required in production')
const uri=process.env.DATABASE_URI||'file:./local-dev.db'
const db=/^mongodb(\+srv)?:/.test(uri)
  ? (await import('@payloadcms/db-mongodb')).mongooseAdapter({url:uri,connectOptions:{maxPoolSize:5,minPoolSize:0,maxIdleTimeMS:60000,serverSelectionTimeoutMS:10000,connectTimeoutMS:10000,socketTimeoutMS:20000}})
  : /^postgres/.test(uri)
    ? (await import('@payloadcms/db-postgres')).postgresAdapter({pool:{connectionString:uri,max:5,idleTimeoutMillis:60000,connectionTimeoutMillis:10000}})
    : (await import('@payloadcms/db-sqlite')).sqliteAdapter({client:{url:uri},push:process.env.PAYLOAD_SCHEMA_PUSH==='true'})
const plugins=[]
if(!process.env.CLOUDINARY_CLOUD_NAME&&process.env.S3_BUCKET&&process.env.S3_ACCESS_KEY_ID&&process.env.S3_SECRET_ACCESS_KEY){
 const {s3Storage}=await import('@payloadcms/storage-s3')
 plugins.push(s3Storage({collections:{media:true},bucket:process.env.S3_BUCKET,config:{credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY},region:process.env.S3_REGION||'auto',endpoint:process.env.S3_ENDPOINT,forcePathStyle:true}}))
}
return buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname, '..') },
    components: { beforeDashboard: ['/src/components/admin/Overview#Overview'], graphics: { Logo: '/src/components/admin/Brand#Brand', Icon: '/src/components/admin/Brand#Icon' } },
    meta: {
      titleSuffix: '— TRAIL9INE MEDIA Staff',
    },
  },
  collections: [Projects, Media, Categories, Services, Inquiries, Users, NotificationOutbox],
  globals: [HomePage, AboutPage, WorkPage, SiteSettings],
  defaultDepth: 1,
  maxDepth: 3,
  upload: { limits: { fileSize: 20 * 1024 * 1024 }, abortOnLimit: true },
  ...(process.env.RESEND_API_KEY ? { email: resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'inquiries@trail9ine.com', defaultFromName: 'Trail9ine Media' }) } : {}),
  secret: process.env.PAYLOAD_SECRET || randomBytes(32).toString('hex'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  plugins,
})

}
export default createConfig()
