import {readFile} from 'node:fs/promises'
import {getPayloadClient} from '../lib/payload'
import {seedServices} from '../lib/seed-services'
// Idempotent import into a new destination. The source snapshot is read-only.
// Provider credentials come from the local environment, never command arguments.
async function run(){
 const filename=process.env.LEGACY_EXPORT_PATH
 if(!filename)throw new Error('Set LEGACY_EXPORT_PATH to the protected JSON snapshot.')
 const snapshot=JSON.parse(await readFile(filename,'utf8'))
 const payload=await getPayloadClient(),ids:Record<string,Record<string,string|number>>={}
 const clean=(row:any)=>{const {id,createdAt,updatedAt,sessions,collection,...data}=row;return data}
 for(const collection of ['categories','media','users','projects','inquiries','notification-outbox']){
  ids[collection]={}
  for(const row of snapshot.collections[collection]||[]){
   let key:any=collection==='categories'||collection==='projects'?{slug:{equals:row.slug}}:collection==='users'?{email:{equals:row.email}}:collection==='inquiries'?{reference:{equals:row.reference}}:collection==='media'?{filename:{equals:row.filename}}:null
   const data:any=clean(row)
   if(collection==='users'){
    const exists=(await payload.find({collection:'users',where:key,limit:1,depth:0})).docs[0]
    if(exists){ids[collection][row.id]=exists.id;continue}
    if(!row.hash||!row.salt)throw new Error('User snapshot lacks password hashes. Export them securely before migration; no account has been reset.')
    const user=await payload.db.create({collection:'users',data:{...data,hash:row.hash,salt:row.salt,createdAt:row.createdAt,updatedAt:row.updatedAt}})
    ids[collection][row.id]=user.id;continue
   }
   if(collection==='projects'){
    data.categories=(row.categories||[]).map((v:any)=>ids.categories[String(typeof v==='object'?v.id:v)])
    data.legacyId=String(row.id);data.showOnHome=row.showOnHome??row.featured??false;data.showOnWorks=row.showOnWorks??true
    delete data.nextProject
    if(row.coverImage)data.coverImage=ids.media[String(row.coverImage)]
    data.gallery=(row.gallery||[]).map((g:any)=>{const {id,...v}=g;for(const f of ['mediaItem','mediaLeft','mediaRight','videoPoster'])if(v[f])v[f]=ids.media[String(v[f])];v.stripImages=v.stripImages?.map(({id,...image}:any)=>({...image,media:image.media?ids.media[String(image.media)]:undefined}));return v})
   }
   if(collection==='notification-outbox'){
    data.inquiry=ids.inquiries[String(row.inquiry)];key={inquiry:{equals:data.inquiry}}
    // Never automatically replay source delivery jobs during migration.
    if(['pending','processing'].includes(data.status)){data.status='failed';data.lastError='Paused during migration. Review in the inbox before retrying.'}
    data.leaseToken=null;data.leaseExpiresAt=null
   }
   if(collection==='inquiries'&&!data.idempotencyKey)delete data.idempotencyKey
   const exists=key?(await payload.find({collection:collection as any,where:key,limit:1,depth:0})).docs[0]:null
   if(exists){ids[collection][row.id]=exists.id;continue}
   const created=collection==='media'?await payload.db.create({collection:'media',data:{...data,createdAt:row.createdAt,updatedAt:row.updatedAt}}):await payload.create({collection:collection as any,data,context:{mediaImport:true},draft:false})
   ids[collection][row.id]=created.id
  }
 }
 for(const row of snapshot.collections.projects||[]){if(row.nextProject&&ids.projects[String(row.nextProject)])await payload.update({collection:'projects',id:ids.projects[row.id],data:{nextProject:ids.projects[String(row.nextProject)]}})}
 // Import globals only into an uninitialized destination; never overwrite subsequent staff edits.
 const settings=await payload.findGlobal({slug:'site-settings',depth:0})
 if(!settings.migrationCompletedAt){
  for(const slug of ['home-page','about-page','site-settings'])if(snapshot.globals[slug]?.createdAt)await payload.updateGlobal({slug:slug as any,data:clean(snapshot.globals[slug])})
  await payload.updateGlobal({slug:'site-settings',data:{migrationCompletedAt:new Date().toISOString()}})
 }
 await seedServices(payload)
 for(const version of snapshot.versions?.projects||[]){
  const parent=ids.projects[String(version.parent)];if(!parent)continue
  const exists=await payload.findVersions({collection:'projects',where:{'version.legacyVersionId':{equals:String(version.id)}},limit:1,depth:0})
  if(exists.totalDocs)continue
  const data:any=clean(version.version);data.legacyVersionId=String(version.id);data.categories=(data.categories||[]).map((id:any)=>ids.categories[String(id)]);data.coverImage=data.coverImage?ids.media[String(data.coverImage)]:undefined;data.nextProject=data.nextProject?ids.projects[String(data.nextProject)]:undefined
  data.showOnHome=data.showOnHome??data.featured??false;data.showOnWorks=data.showOnWorks??true
  data.gallery=(data.gallery||[]).map(({id,...g}:any)=>{for(const f of ['mediaItem','mediaLeft','mediaRight','videoPoster'])if(g[f])g[f]=ids.media[String(g[f])];g.stripImages=g.stripImages?.map(({id,...i}:any)=>({...i,media:i.media?ids.media[String(i.media)]:undefined}));return g})
  const imported=await payload.db.createVersion({collectionSlug:'projects',parent,versionData:data,createdAt:version.createdAt,updatedAt:version.updatedAt,autosave:false})
  await payload.db.updateVersion({collection:'projects',id:imported.id,versionData:{version:data,latest:false,createdAt:version.createdAt,updatedAt:version.updatedAt,parent}})
 }
 console.log('Import completed. Mapped records:',Object.fromEntries(Object.entries(ids).map(([k,v])=>[k,Object.keys(v).length])))
 console.log('Historical project versions imported; the protected source snapshot is retained.')
 process.exit(0)
}
run().catch(error=>{console.error(error.message?.startsWith('User snapshot')?error.message:'Migration stopped. Source data is unchanged. Check destination configuration and the protected snapshot.');process.exit(1)})
