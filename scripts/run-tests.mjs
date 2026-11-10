import {mkdtemp} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {spawn} from 'node:child_process'
const directory=await mkdtemp(join(tmpdir(),'trail9ine-tests-'))
// Tests never load the user's live database/provider credentials.
const env={...process.env,HOSTING_TARGET:'',DATABASE_URI:'file:'+join(directory,'qa.db'),PAYLOAD_SCHEMA_PUSH:'true',CLOUDINARY_CLOUD_NAME:'',CLOUDINARY_API_KEY:'',CLOUDINARY_API_SECRET:'',RESEND_API_KEY:'',EMAIL_SIMULATION:'false',INITIAL_OWNER_EMAIL:'',INITIAL_OWNER_PASSWORD:''}
const run=args=>new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{env,stdio:'inherit'});child.once('error',reject);child.once('exit',code=>resolve(code??1))})
const seed=await run(['--import','tsx',resolve('src/scripts/seed.ts')]);if(seed!==0)process.exit(seed)
// Schema is initialized once. Disabling push avoids parallel schema synchronization.
env.PAYLOAD_SCHEMA_PUSH='false'
process.exit(await run([resolve('node_modules/vitest/vitest.mjs'),'run','--fileParallelism=false',...process.argv.slice(2)]))
