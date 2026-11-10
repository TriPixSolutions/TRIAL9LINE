import type { GlobalConfig } from 'payload'
import { manageContent } from '../lib/access'
export const WorkPage: GlobalConfig = {
  slug: 'work-page', label: 'Works page', admin: { group: 'Website Content' },
  access: { read: () => true, update: manageContent },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'The work.', required: true },
    { name: 'intro', type: 'textarea', defaultValue: 'Food, atmosphere and the character behind a brand. A selection of stories we’ve helped bring into focus.' },
    { name: 'gridLayout', type: 'select', defaultValue: 'uniform', options: [{label:'Classic grid',value:'uniform'},{label:'Editorial grid',value:'editorial'}] },
    {name:'columns',type:'select',label:'Desktop columns',defaultValue:'3',options:[{label:'Two columns',value:'2'},{label:'Three columns',value:'3'}],admin:{condition:data=>data.gridLayout!=='editorial'}},
    { name: 'imageRatio', type: 'select', defaultValue: 'landscape', options: [{label:'Landscape · 4:3',value:'landscape'},{label:'Square · 1:1',value:'square'},{label:'Portrait · 4:5',value:'portrait'}] },
    { name: 'pageSize', type: 'number', min: 3, max: 24, defaultValue: 12, required: true },
    { name: 'showFilters', type: 'checkbox', defaultValue: true, label: 'Show category filters' },
  ],
}
