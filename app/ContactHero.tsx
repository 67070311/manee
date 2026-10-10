"use client";
import type {Language} from "./Home";

const videoUrl="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4";
const text={
 en:{
   label:"MANEE / AVAILABLE FOR CREATIVE PROJECTS",
   headingOne:"Great things",
   headingTwo:"begin with ",
   accent:"hello.",
   description:"Have a project, a bold idea, or something wonderfully unexpected? Tell me about it. I bring design and code together to make ideas feel real.",
   action:"Let's create something",
   scroll:"SCROLL TO SAY HELLO",
   footer:"DESIGN • DEVELOPMENT • LITTLE EXPERIMENTS"
 },
 th:{
   label:"MANEE / มาคุยเรื่องโปรเจกต์กัน",
   headingOne:"ไอเดียดี ๆ",
   headingTwo:"เริ่มต้นที่คำว่า ",
   accent:"สวัสดี",
   description:"มีโปรเจกต์ในใจ หรือไอเดียอะไรสนุก ๆ ไหม? มาเล่าให้เราฟัง เราอยากช่วยเปลี่ยนไอเดียให้กลายเป็นผลงานจริงด้วยดีไซน์และโค้ด",
   action:"มาเริ่มคุยกัน",
   scroll:"เลื่อนลงเพื่อติดต่อ",
   footer:"ออกแบบ • พัฒนา • ทดลองสิ่งใหม่"
 }
} as const;

export default function ContactHero({language}:{language:Language}){
 const t=text[language];
 return <section className="contact-cinematic" aria-labelledby="contact-hero-title">
   <div className="contact-cinematic-video-wrap" aria-hidden="true">
    <video className="contact-cinematic-video" autoPlay muted loop playsInline preload="metadata" disablePictureInPicture>
     <source src={videoUrl} type="video/mp4"/>
    </video>
   </div>
   <div className="contact-cinematic-veil" aria-hidden="true"/>
   <div className="contact-cinematic-grain" aria-hidden="true"/>
   <div className="contact-cinematic-content">
    <h1 id="contact-hero-title"><span>{t.headingOne}</span><span>{t.headingTwo}<em>{t.accent}</em></span></h1>
    <p>{t.description}</p>
    <a href="#contact-form" className="contact-cinematic-cta">{t.action}<span aria-hidden="true">✳</span></a>
   </div>
   <div className="contact-cinematic-foot">
    <span>{t.footer}</span>
    <a href="#contact-form">{t.scroll}<span aria-hidden="true">↓</span></a>
   </div>
 </section>;
}
