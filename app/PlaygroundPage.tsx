"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import PortfolioFooter from "./PortfolioFooter";
import PlaygroundPlayer from "./PlaygroundPlayer";
import UiIcon from "./UiIcon";
import usePortfolioLanguage from "./usePortfolioLanguage";
import type {Language} from "./Home";
import {workProjects,type WorkProject} from "./WorkProjects";
import {localizeProject} from "./WorkTranslations";

const words={
 en:{
  eyebrow:"a little corner of the internet",hello:"Pick something that makes you curious.",
  intro:"Tiny games, odd ideas & things I made just for fun. Flip through the little collection, choose a cover, and come play!",
  shelf:"pick a game to play",new:"JUST ADDED!",englishName:"English Menu",
  englishDesc:"A pinch of cooking, a spoonful of English.",other:"LITTLE EXPERIMENTS",
  play:"let's play",close:"Close game",back:"back to home",
  foot:"Made with curiosity, a little chaos, and lots of love.",
  headingTop:"my little",headingEnd:"playground!",
  note:"made for curious fingers",counter:"little adventures",tab1:"GAMES",tab2:"DOODLES & IDEAS",
  step:"open a card · play a while · smile"
 },
 th:{
  eyebrow:"มุมเล็ก ๆ ของคนชอบลอง",hello:"ลองเลือกอะไรสนุก ๆ เล่นกัน",
  intro:"รวมเกมเล็ก ๆ และไอเดียทดลองที่ตั้งใจทำให้เล่นได้จริง เปิดดูปกที่ชอบ แล้วกดเข้าไปสนุกกันเลย!",
  shelf:"เลือกเกมที่อยากเล่น",new:"เพิ่งเพิ่ม!",englishName:"English Menu",
  englishDesc:"เรียนภาษาอังกฤษผ่านการทำอาหารแสนสนุก",other:"เกมและไอเดียทดลอง",
  play:"เข้าไปเล่น",close:"ปิดเกม",back:"กลับหน้าแรก",
  foot:"พื้นที่เล็ก ๆ ที่เต็มไปด้วยไอเดียและความสนุก",
  headingTop:"มุมเล็ก ๆ",headingEnd:"ของการเล่น!",
  note:"ทำไว้ให้คนชอบลอง",counter:"เกมเล็ก ๆ ให้ลอง",tab1:"เกมที่เล่นได้",tab2:"ทดลอง & ไอเดีย",
  step:"เลือกการ์ด · ลองเล่น · สนุกให้เต็มที่"
 }
} as const;
const games=workProjects.filter(project=>project.category==="playground"&&project.demoPath);

export default function PlaygroundPage({initialLanguage="en"}:{initialLanguage?:Language}){
 const {language,setLanguage}=usePortfolioLanguage(initialLanguage);
 const t=words[language];
 const [selected,setSelected]=useState<WorkProject|null>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!selected)return;
  const last=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const previous=document.body.style.overflow;document.body.style.overflow="hidden";
  const handleKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setSelected(null)};
  window.addEventListener("keydown",handleKey);closeRef.current?.focus();
  return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",handleKey);last?.focus()};
 },[selected]);
 return <div className="pg2 portfolio-playful" id="top" lang={language}>
  <Navbar language={language} onLanguageChange={setLanguage} mode="playground"/>
  <main className="pg2-main">
   <div className="pg2-wrap">
    <header className="pg2-header">
     <div className="pg2-doodle pg2-doodle-left" aria-hidden="true"><UiIcon name="send" size={104} className="pg2-outline-plane"/></div>
     <div className="pg2-doodle pg2-doodle-right" aria-hidden="true"><UiIcon name="star" size={33}/><UiIcon name="cloud" size={22}/></div>
     <div className="pg2-eyebrow"><UiIcon name="asterisk" size={15}/>{t.eyebrow}</div>
     <div className="pg2-hello-stamp">{t.hello}<span aria-hidden="true"><UiIcon name="heart" size={18}/></span></div>
     <h1><span>{t.headingTop}</span><em>{t.headingEnd}</em></h1>
     <div className="pg2-intro"><p>{t.intro}</p></div>
     <div className="pg2-stickers" aria-label={t.note}>
      <span className="pg2-sticker pg2-sticker-yellow">{t.tab1}<UiIcon name="star" size={18}/></span>
      <span className="pg2-sticker pg2-sticker-green">{t.tab2}<UiIcon name="cloud" size={18}/></span>
      <span className="pg2-sticker pg2-sticker-blue">{t.note}<UiIcon name="flower" size={18}/></span>
     </div>
     <div className="pg2-margin-scribble" aria-hidden="true"><UiIcon name="arrow-down" size={25}/></div>
    </header>
    <section className="pg2-gallery" aria-label={t.shelf}>
     <div className="pg2-section-top">
      <h2><span className="pg2-section-star" aria-hidden="true"><UiIcon name="asterisk" size={24}/></span>{t.shelf}<span className="pg2-section-underline" aria-hidden="true"/></h2>
      <span className="pg2-count"><UiIcon name="book" size={18}/>{String(games.length+1).padStart(2,"0")} {t.counter}</span>
     </div>
     <p className="pg2-instruction"><UiIcon name="arrow-right" size={20}/>{t.step}</p>
     <div className="pg2-grid">
      <Link href="/playground/english-menu" className="pg2-card pg2-main-card">
       <div className="pg2-tape" aria-hidden="true"/>
       <div className="pg2-cover">
        <img src="/playground/PG-EngMenu/cover/english-menu-cover.webp" width="1086" height="1448" alt="English Menu game cover" loading="eager"/>
        <span className="pg2-new">{t.new}</span>
        <span className="pg2-play-icon"><UiIcon name="arrow-up-right" size={22}/></span>
       </div>
       <div className="pg2-card-text"><h2>{t.englishName}</h2><p>{t.englishDesc}</p><span>{t.play}<UiIcon name="arrow-right" size={16}/></span></div>
      </Link>
      {games.map((game)=>{
       const project=localizeProject(game,language);
       return <button type="button" className="pg2-card" key={game.id} onClick={()=>setSelected(project)} aria-label={t.play+": "+project.title}>
        <div className="pg2-tape" aria-hidden="true"/>
        <div className="pg2-cover pg2-cover-game">
         {project.cover?<img src={project.cover} alt="" loading="lazy"/>:<div className="pg2-fallback">{project.title}</div>}
         
         <span className="pg2-play-icon"><UiIcon name="arrow-up-right" size={22}/></span>
        </div>
        <div className="pg2-card-text"><h2>{project.title}</h2><p>{project.subtitle}</p><span>{t.play}<UiIcon name="arrow-right" size={16}/></span></div>
       </button>;
      })}
     </div>
     <div className="pg2-tail"><span><UiIcon name="heart" size={18}/>{t.foot}</span><Link href="/">{t.back}<UiIcon name="arrow-up-right" size={17}/></Link></div>
    </section>
   </div>
  </main>
  <PortfolioFooter mode="work" language={language}/>
  {selected&&<div className="pg2-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
   <div className="pg2-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
    <div className="pg2-modal-head"><strong>{selected.title}</strong><button type="button" aria-label={t.close} ref={closeRef} onClick={()=>setSelected(null)}><UiIcon name="close" size={20}/></button></div>
    <PlaygroundPlayer src={selected.demoPath!} title={selected.title} language={language}/>
   </div>
  </div>}
 </div>;
}
