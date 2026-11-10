import {afterAll,beforeAll,describe,expect,it} from 'vitest'
import {getPayloadClient} from '@/lib/payload'
import {publicProjects,publicProject} from '@/lib/public-projects'
import type {Payload} from 'payload'
describe('Agency portfolio placement and permissions',()=>{
 let p:Payload,id:string|number;const slug='qa-placement-'+Date.now()
 beforeAll(async()=>{p=await getPayloadClient();const category=(await p.find({collection:'categories',limit:1})).docs[0];const doc=await p.create({collection:'projects',data:{title:'Placement QA',slug,overview:'A project created to verify independent website placements.',categories:[category.id],showOnHome:false,showOnWorks:true,approach:'Private staff production notes',_status:'published'}});id=doc.id})
 afterAll(async()=>{if(id)await p.delete({collection:'projects',id})})
 it('supports Works-only placement and keeps private fields out of public reads',async()=>{
  expect((await publicProjects({slugs:[slug],placement:'home'})).totalDocs).toBe(0)
  expect((await publicProjects({slugs:[slug],placement:'work'})).totalDocs).toBe(1)
  const result=await p.findByID({collection:'projects',id,overrideAccess:false})
  expect(result.approach).toBeUndefined()
 })
 it('supports Home-only placement while retaining the public detail URL',async()=>{
  await p.update({collection:'projects',id,data:{showOnHome:true,showOnWorks:false}})
  expect((await publicProjects({slugs:[slug],placement:'home'})).totalDocs).toBe(1)
  expect((await publicProjects({slugs:[slug],placement:'work'})).totalDocs).toBe(0)
  expect((await publicProject(slug))?.slug).toBe(slug)
 })
 it('excludes a draft from both placements and public detail even with both switches enabled',async()=>{
  await p.update({collection:'projects',id,data:{_status:'draft',showOnHome:true,showOnWorks:true},draft:false})
  expect((await publicProjects({slugs:[slug],placement:'home'})).totalDocs).toBe(0)
  expect((await publicProjects({slugs:[slug],placement:'work'})).totalDocs).toBe(0)
  expect(await publicProject(slug)).toBeNull()
 })
 it('denies anonymous operational writes and draft access',async()=>{
  await expect(p.create({collection:'notification-outbox',overrideAccess:false,data:{inquiry:1}})).rejects.toThrow()
  await expect(p.create({collection:'inquiries',overrideAccess:false,data:{reference:'UNAUTHORIZED'}})).rejects.toThrow()
  await expect(p.findByID({collection:'projects',id,overrideAccess:false})).rejects.toThrow()
 })
})
