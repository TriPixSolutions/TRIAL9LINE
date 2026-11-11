import {cp,access,mkdir,rm} from 'node:fs/promises'
import {resolve,join,sep} from 'node:path'
const root=process.cwd(),directory=process.env.NEXT_BUILD_DIR||'.next',build=resolve(root,directory)
if(!build.startsWith(root+sep))throw new Error('Build output must stay inside the project.')
const standalone=join(build,'standalone')
await access(join(standalone,'server.js'))
// Never retain Next's traced copies of local credentials in a release artifact.
for(const filename of ['.env','.env.local','.env.production','.env.production.local']) await rm(join(standalone,filename),{force:true})
await rm(join(standalone,'public'),{recursive:true,force:true})
await cp(join(root,'public'),join(standalone,'public'),{recursive:true,filter:source=>source!==join(root,'public','media')&&!source.startsWith(join(root,'public','media')+sep)})
await cp(join(build,'static'),join(standalone,directory,'static'),{recursive:true})
await mkdir(join(standalone,'scripts'),{recursive:true})
await cp(join(root,'scripts','cron-notifications.mjs'),join(standalone,'scripts','cron-notifications.mjs'))
console.log('Standalone server and public/static assets prepared; local environment files and uploads excluded.')
