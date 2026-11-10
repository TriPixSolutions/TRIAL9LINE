import type { CollectionConfig } from 'payload'
import { manageContent } from '../lib/access'
export const Services: CollectionConfig = {
  slug: 'services', admin: { useAsTitle: 'title', group: 'Website Content', defaultColumns: ['title','active','displayOrder'] },
  access: { read: ({req}) => req.user && ['owner','editor'].includes(String(req.user.role)) ? true : {active:{equals:true}}, create:manageContent,update:manageContent,delete:manageContent },
  fields: [
    { name:'title',type:'text',required:true }, {name:'shortTitle',type:'text',required:true,label:'Short navigation title'},
    {name:'slug',type:'text',required:true,unique:true,admin:{description:'Keep existing service URLs unless a redirect is arranged.'}},
    {name:'headline',type:'text',required:true}, {name:'description',type:'textarea',required:true},
    {name:'image',type:'upload',relationTo:'media',label:'Service image'},
    {name:'imageUrl',type:'text',label:'Existing image path (optional)',admin:{description:'Use the media library for new images.'}},
    {name:'imageAlt',type:'text',label:'Image description'},
    {name:'scope',type:'array',label:'What is included',fields:[{name:'text',type:'text',required:true}]},
    {name:'relatedProjects',type:'relationship',relationTo:'projects',hasMany:true,label:'Related projects'},
    {name:'contactValue',type:'select',required:true,label:'Inquiry service',options:['social-media','video-production','photography','branding-design','digital-marketing','not-sure']},
    {name:'displayOrder',type:'number',defaultValue:0}, {name:'active',type:'checkbox',defaultValue:true},
  ],
}
