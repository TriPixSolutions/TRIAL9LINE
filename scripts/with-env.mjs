import {config} from 'dotenv'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
config({path:'.env.local',quiet:true})
await import(pathToFileURL(resolve(process.argv[2])).href)
