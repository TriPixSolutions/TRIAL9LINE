'use client'
import dynamic from 'next/dynamic'
import {useEffect,useRef,useState} from 'react'
const Lottie=dynamic(()=>import('lottie-react').then(m=>m.default),{ssr:false})
// Original vector animation: a quiet studio spark, no remote animation dependency.
const animation={v:'5.7.4',fr:30,ip:0,op:120,w:96,h:96,nm:'Studio spark',ddd:0,assets:[],layers:[{ddd:0,ind:1,ty:4,nm:'Spark',sr:1,ks:{o:{a:0,k:100},r:{a:1,k:[{t:0,s:[0],e:[90],i:{x:[.6],y:[1]},o:{x:[.4],y:[0]}},{t:120,s:[90]}]},p:{a:0,k:[48,48,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},shapes:[{ty:'gr',it:[{ty:'sh',ks:{a:0,k:{i:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],v:[[0,-31],[7,-7],[31,0],[7,7],[0,31],[-7,7],[-31,0],[-7,-7]],c:true}}},{ty:'fl',c:{a:0,k:[.35,.15,.39,1]},o:{a:0,k:100},r:1},{ty:'tr',p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},s:{a:0,k:[100,100]},r:{a:0,k:0},o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}]}],ip:0,op:120,st:0,bm:0}]}
export function StudioAccent(){
 const ref=useRef<HTMLSpanElement>(null),[playing,setPlaying]=useState(false)
 useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;const update=()=>setPlaying(visible&&!preference.matches);const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;update()});if(ref.current)observer.observe(ref.current);preference.addEventListener('change',update);return()=>{observer.disconnect();preference.removeEventListener('change',update)}},[])
 return <span ref={ref} className="studio-accent" aria-hidden="true">{playing?<Lottie animationData={animation} loop autoplay/>:<span>✦</span>}</span>
}
