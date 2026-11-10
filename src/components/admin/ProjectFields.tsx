'use client'
import React, {useEffect,useState} from 'react'
import {useDocumentInfo, useField, useFormFields} from '@payloadcms/ui'
import {projectLayouts} from '../../lib/project-presentation'
export function LayoutPicker({path}:{path:string}) {
 const {value,setValue}=useField<string>({path})
 return <fieldset className="studio-layout-picker"><legend>Project presentation</legend><p>Choose a starting point. Your images and story stay saved when you change layouts.</p><div>{projectLayouts.map((o,i)=><label className={'studio-layout-option'+((value||'editorial')===o.value?' selected':'')} key={o.value}><input type="radio" name={path} value={o.value} checked={(value||'editorial')===o.value} onChange={()=>setValue(o.value)}/><span className={'studio-layout-sketch sketch-'+o.value}><i/><i/><i/></span><strong>{o.label.split(' — ')[0]}</strong><small>{['A balanced story with generous space.','Wide frames and a cinematic rhythm.','A closer look, with images leading.'][i]}</small></label>)}</div></fieldset>
}
export function PlacementToggle({path,field}:{path:string;field:{label?:string;admin?:{description?:string}}}){
 const {value,setValue}=useField<boolean>({path})
 return <label className="studio-placement"><span><strong>{field.label}</strong><small>{field.admin?.description}</small></span><input role="switch" type="checkbox" checked={!!value} onChange={e=>setValue(e.target.checked)}/></label>
}
export function EditorIntro(){
 const title=useFormFields(([fields])=>fields.title?.value as string)
 return <div className="studio-editor-intro"><span className="studio-admin-eyebrow">PROJECT STUDIO</span><h2>{title||'Something worth sharing.'}</h2><p>Start with the story. Add your images. Preview before you publish.</p></div>
}

export function SlugField({path}:{path:string}){
 const {value,setValue,showError,errorMessage}=useField<string>({path}),{id}=useDocumentInfo()
 const title=useFormFields(([fields])=>fields.title?.value as string),[manual,setManual]=useState(false)
 useEffect(()=>{if(!id&&!manual&&title)setValue(title.replace(/ /g,'-').replace(/[^\w-]+/g,'').toLowerCase().replace(/^-+|-+$/g,''))},[title,id,manual,setValue])
 return <div className="studio-slug-field"><label htmlFor="field-slug">Page address</label><div><span>/work/</span><input id="field-slug" value={value||''} onChange={e=>{setManual(true);setValue(e.target.value)}} aria-invalid={!!showError}/></div><small>Created automatically from the project name. You can edit it if needed.</small>{showError&&<p role="alert">{String(errorMessage)}</p>}</div>
}
