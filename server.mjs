import {resolve,join} from 'node:path'
import {pathToFileURL} from 'node:url'
import {deploymentErrors} from './scripts/deployment-env.mjs'
if(process.env.HOSTING_TARGET==='hostinger') {
  const errors=deploymentErrors(process.env)
  if(errors.length)throw new Error('Hostinger configuration is incomplete: '+errors.join(' '))
}
const portIndex=process.argv.findIndex(arg=>arg==='-p'||arg==='--port')
const port=portIndex>=0?process.argv[portIndex+1]:process.argv.find(arg=>arg.startsWith('--port='))?.split('=')[1]
if(port!==undefined){if(!/^\d+$/.test(port)||Number(port)<1||Number(port)>65535)throw new Error('Invalid server port.');process.env.PORT=port}
process.env.NODE_ENV='production'
process.env.HOSTNAME='0.0.0.0'
const directory=resolve(process.cwd(),process.env.NEXT_BUILD_DIR||'.next','standalone')
// Import into this process: no PM2, child server or always-running worker.
await import(pathToFileURL(join(directory,'server.js')).href)
