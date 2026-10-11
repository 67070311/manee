"use client";
import UiIcon from "./UiIcon";
import {useEffect,useRef,useState} from "react";
import type {Language} from "./Home";
import LogoMarquee from "./LogoMarquee";
const VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";
const words={
 en:{eyebrow:"A LITTLE BIT OF EVERYTHING",lead:"I make ideas ",accent:"come alive!",second:"One pixel at a time.",description:"From playful interfaces to little 3D worlds, I love turning big ideas into things you can see, click, and explore. UX/UI, frontend, game design & a sprinkle of backend magic!",action:"See what I make",work:"My work",about:"Say hi",connect:"Let's create"},
 th:{eyebrow:"ออกแบบ เขียนโค้ด และสร้างโลกใบเล็ก",lead:"เปลี่ยนไอเดีย",accent:"ให้มีชีวิต",second:"ด้วยดีไซน์และโค้ด",description:"เราชอบสร้างทุกอย่าง ตั้งแต่เว็บที่ใช้ง่ายและน่าเล่น ไปจนถึงเกมกับโลก 3D เล็ก ๆ ถนัด UX/UI และ Frontend พร้อมเติม Game Design กับ Backend อีกนิดหน่อย",action:"ไปดูผลงานกัน",work:"ผลงาน",about:"รู้จักเรา",connect:"มาสร้างด้วยกัน"}
};
export default function EpochSection({language="en"}:{language?:Language}){
 const t=words[language];const ref=useRef<HTMLElement>(null);const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.12});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[]);
 // This video is well below the first screen. Keep its large MP4 paused and
 // unloaded until the section approaches the viewport.
 useEffect(()=>{
  const section=ref.current;
  const video=section?.querySelector("video");
  if(!section||!video)return;
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting&&!document.hidden)void video.play().catch(()=>{});
   else video.pause();
  },{rootMargin:"300px 0px 300px 0px",threshold:0});
  observer.observe(section);
  const visibility=()=>{if(document.hidden)video.pause();else if(section.getBoundingClientRect().top<innerHeight+300&&section.getBoundingClientRect().bottom>-300)void video.play().catch(()=>{})};
  document.addEventListener("visibilitychange",visibility);
  return()=>{observer.disconnect();document.removeEventListener("visibilitychange",visibility);video.pause()};
 },[]);
 return <section ref={ref} id="digital-epoch" className={"epoch-section"+(visible?" epoch-visible":"")}>
  <div className="epoch-shell"><div className="epoch-video-layer" aria-hidden="true"><video loop muted playsInline preload="none" className="epoch-background-video"><source src={VIDEO} type="video/mp4"/></video></div>
  <div className="epoch-content"><div className="epoch-enter">
   <span className="epoch-eyebrow">{t.eyebrow}</span>
   <h2>{t.lead}<span>{t.accent}</span><br/>{t.second}</h2>
   <p>{t.description}</p>
   <a className="epoch-contact" href="#work">{t.action} <UiIcon name="arrow-up-right" size={16}/></a>
  </div></div>
  <div className="epoch-floating-nav"><nav className="epoch-pill-nav" aria-label={language==="th"?"เมนูส่วนผลงาน":"My creative disciplines"}>
   <a className="epoch-mark" href="#top" aria-label={language==="th"?"กลับด้านบน":"Return to top"}><UiIcon name="sparkle" size={18}/></a>
   <a className="epoch-link" href="#work">{t.work}</a>
   <a className="epoch-link" href="#about">{t.about}</a>
   <a className="epoch-getintouch" href="#contact">{t.connect} <UiIcon name="arrow-right" size={14}/></a>
  </nav></div></div>
  <LogoMarquee language={language}/>
 </section>;
}
