import React from 'react'
import type {DefaultServerCellComponentProps} from 'payload'
import {mediaUrl} from '../../lib/public-projects'
export async function CoverCell({rowData,payload}:DefaultServerCellComponentProps){
 let media=rowData.coverImage
 if(media&&typeof media!=='object') {try{media=await payload.findByID({collection:'media',id:media,overrideAccess:false})}catch{media=null}}
 const src=mediaUrl(media,rowData.coverImageUrl)
 return <div className="studio-admin-project-cell">{src?<img src={src} alt=""/>:<span className="studio-admin-no-cover">↗</span>}<div><a href={'/admin/collections/projects/'+rowData.id}><strong>{rowData.title}</strong></a><small>{rowData.clientName||'Project'} · {rowData._status==='published'?'Published':'Draft'}</small></div></div>
}
