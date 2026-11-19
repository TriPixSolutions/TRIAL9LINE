'use client'
import React, {useEffect,useRef,useState} from 'react'
import {useDocumentInfo, useField, useForm, useFormFields} from '@payloadcms/ui'
import {projectLayouts, projectTemplateSections} from '../../lib/project-presentation'

const categoryOptions = [
 {value:'video-production',label:'Video Production',description:'Films, commercials and cinematic reels',icon:'▶'},
 {value:'content-creation',label:'Content Creation',description:'Social-first reels and feed content',icon:'▦'},
 {value:'performance-marketing',label:'Performance Marketing',description:'Campaign reports and Meta Ads results',icon:'↗'},
 {value:'food-photography',label:'Food Photography',description:'Restaurant and dish photography',icon:'◉'},
 {value:'creative-designs',label:'Creative Designs',description:'Posters and social-media designs',icon:'◇'},
]

export function CategorySelector({path}:{path:string}) {
 const {value,setValue,showError,errorMessage}=useField<string>({path})
 const requestedApplied=useRef(false)
 useEffect(()=>{
   const requested=new URLSearchParams(window.location.search).get('category')
   if(!requestedApplied.current&&!value&&categoryOptions.some(option=>option.value===requested)){
    requestedApplied.current=true
    const timer=window.setTimeout(()=>setValue(requested as string),100)
    return ()=>window.clearTimeout(timer)
   }
 },[value,setValue])
 return <fieldset className="studio-category-picker" aria-describedby="portfolio-category-help">
  <legend>What kind of work are you adding?</legend>
  <p id="portfolio-category-help">Choose one category. The upload fields will update immediately.</p>
  <div>{categoryOptions.map(option=><label className={value===option.value?'selected':''} key={option.value}>
   <input type="radio" name={path} value={option.value} checked={value===option.value} onChange={()=>setValue(option.value)}/>
   <span aria-hidden="true">{option.icon}</span><strong>{option.label}</strong><small>{option.description}</small>
  </label>)}</div>
  {showError&&<p className="studio-field-error" role="alert">{String(errorMessage)}</p>}
 </fieldset>
}

export function SectionTemplate() {
 const {addFieldRow, disabled} = useForm()
 const {setValue} = useField<string>({path: 'layout'})
 const hasSections = useFormFields(([fields]) => Boolean(fields.gallery?.rows?.length))
 const [selected, setSelected] = useState('social')

 if (hasSections) return null

 function addSections() {
   setValue(selected)
   projectTemplateSections[selected].sections.forEach((value, rowIndex) => {
     addFieldRow({path: 'gallery', schemaPath: 'gallery', rowIndex, subFieldState: {
       blockType: {value, initialValue: value, valid: true},
     }})
   })
 }

 return <fieldset className="studio-template-start" disabled={disabled}>
   <legend>Start with a template</legend>
   <label htmlFor="project-section-template">Project template</label>
   <div>
     <select id="project-section-template" value={selected} onChange={event => setSelected(event.target.value)}>
       {projectLayouts.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
     </select>
     <button type="button" onClick={addSections}>Add starter sections</button>
   </div>
   <p>{projectTemplateSections[selected].summary}</p>
 </fieldset>
}
export function LayoutPicker({path}:{path:string}) {
 const {value,setValue}=useField<string>({path})
 return <fieldset className="studio-layout-picker"><legend>Page template</legend><p>Choose how this project looks.</p><div>{projectLayouts.map(option=><label className={'studio-layout-option'+((value||'editorial')===option.value?' selected':'')} key={option.value}><input type="radio" name={path} value={option.value} checked={(value||'editorial')===option.value} onChange={()=>setValue(option.value)}/><span className={'studio-layout-sketch sketch-'+option.value} aria-hidden="true"><i/><i/><i/></span><strong>{option.label}</strong></label>)}</div></fieldset>
}
export function PlacementToggle({path,field}:{path:string;field:{label?:string;admin?:{description?:string}}}){
 const {value,setValue}=useField<boolean>({path})
 return <label className="studio-placement"><span><strong>{field.label}</strong><small>{field.admin?.description}</small></span><input role="switch" type="checkbox" checked={!!value} onChange={e=>setValue(e.target.checked)}/></label>
}
export function EditorIntro(){
 const title=useFormFields(([fields])=>fields.title?.value as string)
 return <div className="studio-editor-intro"><span className="studio-admin-eyebrow">PORTFOLIO UPLOAD</span><h2>{title||'Add new work.'}</h2><p>Choose the portfolio category first. The upload tab will adapt to the kind of work you are adding.</p></div>
}

export function SlugField({path}:{path:string}){
 const {value,setValue,showError,errorMessage}=useField<string>({path}),{id}=useDocumentInfo()
 const title=useFormFields(([fields])=>fields.title?.value as string),[manual,setManual]=useState(false)
 useEffect(()=>{if(!id&&!manual&&title)setValue(title.replace(/ /g,'-').replace(/[^\w-]+/g,'').toLowerCase().replace(/^-+|-+$/g,''))},[title,id,manual,setValue])
 return <div className="studio-slug-field"><label htmlFor="field-slug">Page address</label><div><span>/work/</span><input id="field-slug" value={value||''} onChange={e=>{setManual(true);setValue(e.target.value)}} aria-invalid={!!showError}/></div><small>Created automatically from the project name. You can edit it if needed.</small>{showError&&<p role="alert">{String(errorMessage)}</p>}</div>
}
