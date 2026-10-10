"use client";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import Link from "next/link";
import WorkArchiveHero from "./WorkArchiveHero";
import PlaygroundPlayer from "./PlaygroundPlayer";
import {localizeProject} from "./WorkTranslations";
import {featuredProjects,workProjects,type WorkProject,type WorkCategory} from "./WorkProjects";

type Language="en"|"th";
type Filter="all"|WorkCategory;
const copy={
 en:{homeLabel:"A FEW THINGS I MADE",homeTitle:"Made with",homeItalic:"intention.",homeIntro:"From full-cycle builds to thoughtful design and graphic work — a collection of things I’ve brought to life.",viewMore:"Explore all projects",all:"All work",client:"Client work",product:"My products",playground:"Web playground",browse:"FIND SOMETHING INTERESTING",focus:"MY FOCUS",roleLabel:"MY CONTRIBUTION",fullRole:"FULLSTACK",designRole:"UX/UI & Graphic Design only",fullRoleShort:"FULLSTACK",designRoleShort:"DESIGN + GRAPHICS",close:"Close",open:"View project",visit:"Visit Website",more:"KEEP EXPLORING",footer:"MORE IDEAS ARE ALWAYS IN THE MAKING",footerLink:"LET'S MAKE SOMETHING",clientTag:"CLIENT WORK",productTag:"MY PRODUCT",playgroundTag:"PLAYGROUND"},
 th:{homeLabel:"จากไอเดียสู่ผลงานจริง",homeTitle:"จากไอเดีย",homeItalic:"สู่ของจริง",homeIntro:"รวมงานที่ออกแบบและพัฒนาเองครบทุกขั้นตอน ไปจนถึงงาน UX/UI และกราฟิกที่ตั้งใจทำให้แต่ละแบรนด์",viewMore:"ดูผลงานเพิ่มเติม",all:"ทั้งหมด",client:"งานลูกค้า",product:"โปรดักต์ของเรา",playground:"งานทดลองสนุก ๆ",browse:"เลือกหมวดที่สนใจ",focus:"เราทำอะไรบ้าง",roleLabel:"บทบาทของเรา",fullRole:"FULLSTACK",designRole:"ออกแบบ UX/UI และทำกราฟิกเท่านั้น",fullRoleShort:"FULLSTACK",designRoleShort:"UX/UI + กราฟิก",close:"ปิดหน้าต่าง",open:"ดูผลงาน",visit:"เข้าเว็บไซต์",more:"ยังมีผลงานอีกนะ",footer:"ไอเดียใหม่ ๆ ยังรอให้เราได้ลอง",footerLink:"มาสร้างอะไรสนุก ๆ กัน",clientTag:"งานลูกค้า",productTag:"โปรดักต์ของเรา",playgroundTag:"งานทดลอง"}
} as const;
const categoryFilters:Filter[]=["all","client","product","playground"];
// Show actual contributions, not an assumed Design-to-Deploy role.
const roleText:Record<WorkProject["role"],{en:string;th:string}>={
 "full-cycle":{en:"FULLSTACK",th:"FULLSTACK"},
 "design-graphics":{en:"UX/UI + GRAPHICS",th:"UX/UI + กราฟิก"},
 "uxui":{en:"UX/UI",th:"UX/UI"},
 "uxui-frontend":{en:"UX/UI + FRONTEND",th:"UX/UI + FRONTEND"},
 "uxui-frontend-backend":{en:"UX/UI + FRONTEND + BACKEND",th:"UX/UI + FRONTEND + BACKEND"}
};

function Artwork({type,language="en"}:{type:"garden"|"interactive";language?:Language}){
 return <div className={"work-art work-art-"+type} aria-label="Concept illustration">
 {type==="garden"?<><span className="work-art-sun">☼</span><div className="work-art-forest">✿ <span>✿</span> ✿</div><div className="work-art-garden-title">{language==="th"?"โลกเล็ก ๆ": "a tiny"}<br/><em>{language==="th"?"ที่น่าเล่น":"world to play."}</em></div><div className="work-art-garden-card">🦝 <small>{language==="th"?"เข้าพัก":"CHECK IN"}</small></div></>:<><span className="work-art-asterisk">✳</span><div className="work-art-browser"><div className="work-art-browser-nav"><span>● ● ●</span><span>{language==="th"?"ลองสร้างเว็บ":"creative experiments"}</span></div><div className="work-art-browser-content">{language==="th"?"ลองเล่นดู":"play a little."}<em>{language==="th"?"แล้วจะสนุก":"explore a lot."}</em><span>{language==="th"?"ลองขยับเมาส์":"MOVE YOUR CURSOR"}</span></div></div></>}
 </div>;
}
function ProjectCover({project,language}:{project:WorkProject;language:Language}){
 return project.cover?<img src={project.cover} alt={project.title+" project cover"} loading="lazy" decoding="async"/>:<Artwork type={project.artwork??"interactive"} language={language}/>;
}
function ProjectCard({project,onOpen,language}:{project:WorkProject;onOpen:(project:WorkProject)=>void;language:Language}){
 const t=copy[language];const categoryText=project.experienceType==="internship"?(language==="th"?"ฝึกงาน":"INTERNSHIP"):project.category==="client"?t.clientTag:project.category==="product"?t.productTag:t.playgroundTag;
 return <article className="work-gallery-card" data-category={project.category} data-experience={project.experienceType??undefined}>
  <button type="button" className="work-gallery-cover" aria-label={(project.demoPath?(language==="th"?"ลองเล่น ":"Play "):t.open+": ")+project.title} onClick={()=>onOpen(project)}>
   <div className="work-gallery-image-frame"><ProjectCover project={project} language={language}/></div>
   <span className="work-gallery-cover-caption">{project.demoPath?(language==="th"?"ลองเล่นเลย":"Play demo"):t.open} <span aria-hidden="true">+</span></span>
  </button>
  <div className="work-gallery-meta">
   <span className="work-gallery-category">{categoryText}</span>
   <h3>{project.title}</h3>
   <p>{project.subtitle}</p>
   <span className={"work-gallery-role"+(project.role==="design-graphics"?" is-design-only":project.role!=="full-cycle"?" is-specialist":"")}>{roleText[project.role][language]}</span>
  </div>
 </article>;
}
export default function WorkGallery({mode="home",language="en"}:{mode?:"home"|"full";language?:Language}){
 const full=mode==="full";const t=copy[language];
 const [filter,setFilter]=useState<Filter>("all");
 const [selected,setSelected]=useState<WorkProject|null>(null);
 const [showProjectInfo,setShowProjectInfo]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 const triggerRef=useRef<HTMLElement|null>(null);
 const projects=(full?workProjects.filter(p=>filter==="all"||p.category===filter):featuredProjects).map(p=>localizeProject(p,language));
 const openProject=(project:WorkProject)=>{triggerRef.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setShowProjectInfo(false);setSelected(project)};
 const closeProject=()=>{setShowProjectInfo(false);setSelected(null)};
 useEffect(()=>{
  if(!selected)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")closeProject()};
  window.addEventListener("keydown",onKey);
  closeRef.current?.focus();
  return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",onKey);triggerRef.current?.focus()};
 },[selected]);
 const localizedSelected=selected?localizeProject(selected,language):null;
 const selectedCategory=localizedSelected?(localizedSelected.experienceType==="internship"?(language==="th"?"ฝึกงาน":"INTERNSHIP"):localizedSelected.category==="client"?t.clientTag:localizedSelected.category==="product"?t.productTag:t.playgroundTag):"";
 return <section className={"work-gallery-section"+(full?" is-archive":" is-featured")} id={full?"work-archive":"work"}>
  <div className="work-gallery-container">
   {full?<WorkArchiveHero language={language}/>:
    <div className="work-featured-header"><div><span className="work-header-note">✳ {t.homeLabel}</span><h2>{t.homeTitle}<br/><em>{t.homeItalic}</em></h2></div><p className="work-featured-intro">{t.homeIntro}</p></div>}
   {full&&<div className="work-filter-bar" id="work-projects">
    <span className="work-filter-label">{t.browse}</span>
    <div className="work-filter-items" role="group" aria-label={language==="th"?"หมวดผลงาน":"Project type"}>
     {categoryFilters.map(category=><button key={category} type="button" className={"work-filter-pill"+(filter===category?" is-active":"")} aria-pressed={filter===category} onClick={()=>setFilter(category)}>{t[category]}</button>)}
    </div>
   </div>}
   <div className="work-gallery-grid" key={filter}>
    {projects.map(project=><ProjectCard key={project.id} project={project} onOpen={openProject} language={language}/>)}
   </div>
   {!full&&<div className="work-viewmore"><span>{t.more} ✳</span><Link href="/work">{t.viewMore} <span aria-hidden="true">+</span></Link></div>}
   {full&&<div className="work-archive-footer"><span>{t.footer} ✳</span><Link href="/contact">{t.footerLink}</Link></div>}
  </div>
  {selected&&typeof document!=="undefined"&&createPortal(
   <div className="work-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeProject()}}>
    <div className={"work-modal"+(selected.demoPath?" is-playable":"")+(showProjectInfo?" is-info-open":"")} role="dialog" aria-modal="true" aria-labelledby="work-modal-heading">
     <button type="button" className="work-modal-floating-close" ref={closeRef} onClick={closeProject} aria-label={t.close}>×</button>
     {localizedSelected!.demoPath?<PlaygroundPlayer src={localizedSelected!.demoPath} title={localizedSelected!.title} language={language}/>:<div className="work-modal-cover">{localizedSelected!.cover?<img src={localizedSelected!.cover} alt={localizedSelected!.title+" project cover"}/>:<Artwork type={selected.artwork??"interactive"} language={language}/>}</div>}
     {localizedSelected!.demoPath&&<button type="button" className="work-modal-mobile-info-toggle" aria-expanded={showProjectInfo} onClick={()=>setShowProjectInfo(value=>!value)}>{showProjectInfo?(language==="th"?"กลับไปเล่นเกม":"Back to game"):(language==="th"?"รายละเอียดโปรเจกต์":"About this project")} <span aria-hidden="true">{showProjectInfo?"−":"+"}</span></button>}
     <div className="work-modal-details">
      <span className="work-modal-category">{selectedCategory}</span>
      <h2 id="work-modal-heading">{localizedSelected!.title}</h2>
      <h3>{localizedSelected!.subtitle}</h3>
      <p>{localizedSelected!.description}</p>
      {localizedSelected!.website&&<a className="work-modal-visit" href={localizedSelected!.website} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◉</span>{t.visit}</a>}
      <div className={"work-modal-contribution"+(localizedSelected!.role==="design-graphics"?" is-design-only":localizedSelected!.role!=="full-cycle"?" is-specialist":"")}><span>{t.roleLabel}</span><strong>{roleText[localizedSelected!.role][language]}</strong></div>
     </div>
    </div>
   </div>,document.body
  )}
 </section>;
}
