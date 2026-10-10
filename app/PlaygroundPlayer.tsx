"use client";
import {useEffect,useLayoutEffect,useRef,useState} from "react";
import type {CSSProperties} from "react";

type Props={src:string;title:string;language:"en"|"th"};
const DEVICE_WIDTH=446; // including an 8px bezel on each side
const DEVICE_HEIGHT=948;
const MOBILE_DEMOS=new Set(["animal-hunter","potion-lab"]);

export default function PlaygroundPlayer({src,title,language}:Props){
 const stage=useRef<HTMLDivElement>(null);
 const [revision,setRevision]=useState(0);
 const [loading,setLoading]=useState(true);
 const [fullscreen,setFullscreen]=useState(false);
 const [deviceScale,setDeviceScale]=useState(0.6);
 const th=language==="th";
 const demoName=src.split("/")[2]??"";
 const showPhone=MOBILE_DEMOS.has(demoName);

 // The iframe is ALWAYS 430×932 CSS pixels for these two games.
 // Only its OUTER frame scales; never scale a phone inside the iframe.
 // Resizing the stage (including entering fullscreen) recalculates fitting.
 useLayoutEffect(()=>{
  if(!showPhone)return;
  const element=stage.current;
  if(!element)return;
  const fit=()=>{
   const {width,height}=element.getBoundingClientRect();
   const availableWidth=Math.max(0,width-32);
   const availableHeight=Math.max(0,height-28);
   const next=Math.max(0.15,Math.min(1,availableWidth/DEVICE_WIDTH,availableHeight/DEVICE_HEIGHT));
   setDeviceScale(previous=>Math.abs(previous-next)<0.001?previous:next);
  };
  fit();
  const observer=new ResizeObserver(fit);
  observer.observe(element);
  window.addEventListener("resize",fit,{passive:true});
  return()=>{observer.disconnect();window.removeEventListener("resize",fit)};
 },[showPhone]);

 useEffect(()=>{
  const update=()=>setFullscreen(document.fullscreenElement===stage.current);
  document.addEventListener("fullscreenchange",update);
  return()=>document.removeEventListener("fullscreenchange",update);
 },[]);

 const reload=()=>{setLoading(true);setRevision(value=>value+1)};
 const exitFullscreen=()=>{
  if(document.fullscreenElement){
   document.exitFullscreen().catch(()=>{});
  }
 };
 const toggleFullscreen=()=>{
  if(fullscreen){exitFullscreen();return}
  stage.current?.requestFullscreen?.().catch(()=>{});
 };

 const playableFrame=(
  <iframe
   key={src+":"+revision}
   src={src}
   title={(th?"ลองเล่น ":"Play ")+title}
   className={showPhone?"playground-phone-screen":"playground-player-frame"}
   loading="eager"
   allow="autoplay; fullscreen; gamepad"
   allowFullScreen
   onLoad={()=>setLoading(false)}
  />
 );

 return <div className="playground-player">
  <div className="playground-player-toolbar">
   <div className="playground-player-indicator">
    <span className="playground-player-light"/>
    <span>{th?"ลองเล่นได้เลย":"INTERACTIVE PLAYGROUND"}</span>
    <strong>{title}</strong>
   </div>
   <div className="playground-player-controls">
    <button type="button" onClick={reload} aria-label={th?"เริ่มเล่นใหม่":"Restart demo"}><span className="playground-control-label">{th?"เริ่มใหม่":"Restart"}</span> <span aria-hidden="true">↻</span></button>
    <button type="button" onClick={toggleFullscreen} aria-label={th?"ขยายเกมเต็มจอ":"Fullscreen demo"}><span className="playground-control-label">{th?"เต็มจอ":"Fullscreen"}</span> <span aria-hidden="true">⛶</span></button>
   </div>
  </div>
  <div className={"playground-player-stage"+(showPhone?" has-phone":"")} ref={stage}>
   {loading&&<div className="playground-player-loading" role="status">{th?"กำลังเปิดโปรเจกต์…":"Loading interactive project…"}<span>✳</span></div>}
   {showPhone?
    <div className="playground-device-shell" style={{"--device-scale":deviceScale} as CSSProperties}>
     {playableFrame}
     <div className="playground-device-island" aria-hidden="true"><span/></div>
     <div className="playground-device-home" aria-hidden="true"/>
    </div>
    :playableFrame}
   {fullscreen&&<div className="playground-fullscreen-controls">
    <button type="button" className="playground-exit-button" onClick={exitFullscreen} aria-label={th?"ออกจากโหมดเต็มจอ":"Exit fullscreen"}>
     <span aria-hidden="true">×</span>{th?"Exit · ออกเต็มจอ":"Exit fullscreen"}
    </button>
   </div>}
  </div>
  <div className="playground-player-foot">
   <span>{th?"แตะหรือคลิกในหน้าจอเพื่อเล่น · ใช้ปุ่มเริ่มใหม่เพื่อรีเซ็ต":"Click or tap inside to play · Restart to reset"}</span>
   <span>{th?"เล่นจากไฟล์โปรเจกต์จริง":"ORIGINAL PROJECT DEMO"}</span>
  </div>
 </div>;
}
