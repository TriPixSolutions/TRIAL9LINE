import {generateImportMap} from 'payload'
import config from '../payload.config'
async function run(){await generateImportMap(await config,{force:true,log:true});process.exit(0)}
run().catch(e=>{console.error(e);process.exit(1)})
