"use client";
import {useEffect,useRef,useState} from "react";
import type {Language} from "./Home";
const words={
 en:{eyebrow:"a little about me",left:"CREATIVE",left2:"MIND",leftCaption:"always curious · 2026",right:"WHAT'S",right2:"NEXT?",rightCaption:"ideas in progress ♡",stamp:"hello, there!",before:"Hey, I'm",name:"Manee!",start:"I’m a ",strong:"design-minded Full-Stack Developer.",end:" ✦ I build ideas into real products, from UX/UI and frontend to the backend behind it all. I also love games and 3D — because great technology should be ",italic:"beautiful, intuitive, and fun to use.",labels:["Full-Stack Dev","UX/UI Design","Game Design","3D Modeling"]},
 th:{eyebrow:"เรื่องเล็ก ๆ เกี่ยวกับเรา",left:"คิด · วาด",left2:"สร้าง",leftCaption:"ชอบลองอะไรใหม่ ๆ · 2026",right:"มุมของ",right2:"ไอเดีย",rightCaption:"กำลังสร้างอะไรใหม่ ๆ ♡",stamp:"ยินดีที่รู้จัก!",before:"สวัสดี เรา",name:"Manee!",start:"เราเป็น ",strong:"Full-Stack Developer ที่คิดแบบ Designer",end:" ✦ ชอบเปลี่ยนไอเดียให้เป็นโปรดักต์จริง ตั้งแต่ UX/UI และ Frontend ไปจนถึง Backend แถมยังสนุกกับการทำเกมและงาน 3D เพราะเราเชื่อว่า ",italic:"โค้ดที่ดีควรมาพร้อมประสบการณ์ที่ดี",labels:["Full-Stack Dev","ออกแบบ UX/UI","ออกแบบเกม","โมเดล 3D"]}
};
const colors=["yellow","green","sage","blue"];const marks=["✦","✳","✿","◉"];
export default function ScrapbookAbout({language="en"}:{language?:Language}){
 const t=words[language];
 const ref=useRef<HTMLElement>(null);const [seen,setSeen]=useState(false);
 useEffect(()=>{const obs=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);obs.disconnect()}},{threshold:.15});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect()},[]);
 return <section id="about" ref={ref} className={"scrapbook-about"+(seen?" scrapbook-visible":"")} aria-label={language==="th"?"เกี่ยวกับ Manee":"About Manee"}>
  <div className="scrapbook-inner">
   <div className="scrapbook-tiny">{t.eyebrow}</div>
   <div className="scrapbook-polaroid scrapbook-left"><div className="scrapbook-photo scrapbook-photo-one"><span className="scrapbook-photo-sun" aria-hidden="true">☼</span></div><small>{t.leftCaption}</small><i className="scrapbook-tape scrapbook-tape-blue"/><i className="scrapbook-tape scrapbook-tape-yellow"/></div>
   <div className="scrapbook-polaroid scrapbook-right"><div className="scrapbook-photo scrapbook-photo-two" aria-hidden="true"></div><small>{t.rightCaption}</small><i className="scrapbook-tape scrapbook-tape-blue"/><i className="scrapbook-tape scrapbook-tape-yellow"/></div>
   <div className="scrapbook-center"><span className="scrapbook-stamp">{t.stamp}</span>
    <h2>{t.before} <span>{t.name}</span> <span className="scrapbook-wave">✳</span></h2>
    <p>{t.start}<strong>{t.strong}</strong>{t.end}<em>{t.italic}</em> <span className="scrapbook-ending-mark" aria-hidden="true">✳</span></p>
    <div className="scrapbook-stickers">{t.labels.map((name,i)=><span className={"scrapbook-sticker "+colors[i]} key={name}>{name}<b>{marks[i]}</b></span>)}</div>
   </div>
   <div className="scrapbook-doodle scrapbook-doodle-a">✳</div><div className="scrapbook-doodle scrapbook-doodle-b">✧</div>
  </div>
 </section>;
}
