"use client";
import {useEffect,useRef} from "react";

type Language="en"|"th";

const VIDEO_URL="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const copy={
 en:{
  overline:"MANEE / WORK & LITTLE EXPERIMENTS",
  mobileOverline:"MANEE / SELECTED WORK",
  footLeft:"UX/UI · FRONTEND · GAME DESIGN · 3D",
  mobileFootLeft:"MADE WITH CURIOSITY ✳",
  footRight:"SCROLL TO EXPLORE"
 },
 th:{
  overline:"MANEE / ผลงานและไอเดียทดลอง",
  mobileOverline:"MANEE / พื้นที่รวมผลงาน",
  footLeft:"UX/UI · FRONTEND · เกม · 3D",
  mobileFootLeft:"สร้างด้วยความตั้งใจ ✳",
  footRight:"เลื่อนลงเพื่อชมผลงาน"
 }
} as const;

export default function WorkArchiveHero({language="en"}:{language?:Language}){
 const videoRef=useRef<HTMLVideoElement>(null);
 const t=copy[language];

 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  let frame=0;
  let restartTimer:ReturnType<typeof setTimeout>|undefined;
  let disposed=false;

  // Honor reduced-motion preferences. The first frame remains visible
  // without running a continuous opacity animation.
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick=()=>{
   if(disposed)return;
   if(!reduced&&Number.isFinite(video.duration)&&video.duration>0){
    const fadeIn=Math.min(1,video.currentTime/0.5);
    const fadeOut=Math.min(1,Math.max(0,(video.duration-video.currentTime)/0.5));
    video.style.opacity=String(Math.max(0,Math.min(fadeIn,fadeOut)));
   }
   frame=window.requestAnimationFrame(tick);
  };
  const restart=()=>{
   video.style.opacity=reduced?"1":"0";
   restartTimer=window.setTimeout(()=>{
    if(disposed)return;
    video.currentTime=0;
    void video.play().catch(()=>{});
   },100);
  };

  video.style.opacity=reduced?"1":"0";
  video.addEventListener("ended",restart);
  if(!reduced)frame=window.requestAnimationFrame(tick);
  if(video.paused)void video.play().catch(()=>{});

  return()=>{
   disposed=true;
   video.removeEventListener("ended",restart);
   window.cancelAnimationFrame(frame);
   if(restartTimer!==undefined)window.clearTimeout(restartTimer);
  };
 },[]);

 return <section className="work-cinematic" lang={language} aria-labelledby="work-cinematic-title">
  <div className="work-cinematic-media" aria-hidden="true">
   <video ref={videoRef} className="work-cinematic-video" autoPlay muted playsInline preload="metadata" tabIndex={-1}>
    <source src={VIDEO_URL} type="video/mp4"/>
   </video>
  </div>
  <div className="work-cinematic-video-gradient" aria-hidden="true"/>
  <div className="work-cinematic-bottom-fade" aria-hidden="true"/>

  <div className="work-cinematic-copy">
   <span className="work-cinematic-eyebrow"><span className="work-cinematic-eyebrow-line"/><span className="work-cinematic-eyebrow-desktop">{t.overline}</span><span className="work-cinematic-eyebrow-mobile">{t.mobileOverline}</span><span className="work-cinematic-eyebrow-line"/></span>
   <h1 id="work-cinematic-title" className="work-cinematic-heading work-fade-rise">
    {language==="en"?<>
     <span className="work-cinematic-line">Things I’ve <em>made.</em></span><br className="work-cinematic-break"/><span className="work-cinematic-line">Ideas I’ve <em>explored.</em></span>
    </>:<>
     <span className="work-cinematic-line">งานที่<em>เราสร้าง</em></span><br className="work-cinematic-break"/><span className="work-cinematic-line">ไอเดียที่<em>ได้ลอง</em></span>
    </>}
   </h1>
   <div className="work-cinematic-mobile-rule" aria-hidden="true"><span/><span>✳</span></div>
  </div>
  <div className="work-cinematic-bottom">
   <span className="work-cinematic-foot-desktop">{t.footLeft}</span><span className="work-cinematic-foot-mobile">{t.mobileFootLeft}</span>
   <a href="#work-projects">{t.footRight}</a>
  </div>
 </section>;
}
