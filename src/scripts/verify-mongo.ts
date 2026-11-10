import {MongoClient} from 'mongodb'
import {readFile,writeFile} from 'node:fs/promises'
import {parse} from 'dotenv'
async function run(){
 const candidate=parse(await readFile('.local/mongo-candidate.env','utf8')).DATABASE_URI
 const client=new MongoClient(candidate,{serverSelectionTimeoutMS:12000,connectTimeoutMS:10000,family:4})
 try{
  await client.connect();await client.db().command({ping:1})
  const file=await readFile('.env.local','utf8'),lines=file.split('\n').filter(l=>!/^\s*DATABASE_URI\s*=/.test(l));lines.push('DATABASE_URI='+JSON.stringify(candidate));await writeFile('.env.local',lines.join('\n')+'\n',{mode:0o600})
  console.log('MongoDB connection verified and saved to the project environment.')
 }catch(error:any){
  const nested=error?.cause?.code||error?.reason?.error?.code
  console.log(JSON.stringify({message:String(error.message||'').replace(/mongodb(\+srv)?:\/\/[^\s]+/g,'[redacted]'),connected:false,name:error.name,code:error.code||nested||null,authenticationFailure:error.code===18||/authentication failed|bad auth/i.test(String(error.message)),dnsFailure:/ENOTFOUND|DNS|querySrv|ECONNREFUSED/.test(String(error.message)),serverSelection:error.name==='MongoServerSelectionError'}))
  process.exitCode=1
 }finally{await client.close()}
}
run().catch(()=>{console.error('Diagnostic check could not run; no credentials logged.');process.exitCode=1})
