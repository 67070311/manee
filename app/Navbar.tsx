"use client";
import UiIcon from "./UiIcon";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import type {Language} from "./Home";

type Props={language:Language;onLanguageChange:(language:Language)=>void;mode?:"home"|"work"|"contact"};
const labels={
 en:{home:"Home",work:"Work",about:"About",contact:"Contact",talk:"Let's talk",emailMe:"Email me",menu:"MENU",close:"Close",navigation:"Navigation",language:"Language",backdrop:"Close navigation",caption:"EXPLORE MANEE'S WORLD"},
 th:{home:"หน้าแรก",work:"ผลงาน",about:"รู้จักเรา",contact:"ติดต่อ",talk:"คุยกัน",emailMe:"ส่งอีเมล",menu:"เมนู",close:"ปิด",navigation:"เมนูนำทาง",language:"ภาษา",backdrop:"ปิดเมนู",caption:"มาสำรวจโลกของ MANEE"}
};
export default function Navbar({language,onLanguageChange,mode="home"}:Props){
 const [scrolled,setScrolled]=useState(false);
 const [open,setOpen]=useState(false);
 const [mounted,setMounted]=useState(false);
 const triggerRef=useRef<HTMLButtonElement>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setMounted(true)},[]);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update)},[]);
 useEffect(()=>{document.documentElement.lang=language},[language]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const onKeyDown=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){setOpen(false);triggerRef.current?.focus({preventScroll:true});return}
   if(e.key!=="Tab")return;
   const root=closeRef.current?.closest(".mobile-nav-drawer");
   if(!root)return;
   const focusable=Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
   if(focusable.length===0)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  };
  const onResize=()=>{if(window.innerWidth>840)setOpen(false)};
  document.addEventListener("keydown",onKeyDown);
  window.addEventListener("resize",onResize);
  // Focusing an offscreen animated drawer can scroll the mobile viewport.
  // preventScroll keeps the document fixed while the panel enters.
  const frame=window.requestAnimationFrame(()=>closeRef.current?.focus({preventScroll:true}));
  return()=>{
   document.body.style.overflow=previous;
   document.removeEventListener("keydown",onKeyDown);
   window.removeEventListener("resize",onResize);
   window.cancelAnimationFrame(frame);
  };
 },[open]);
 const t=labels[language];
 const closeMenu=()=>{setOpen(false);triggerRef.current?.focus({preventScroll:true})};
 const homeHref=mode==="home"?"#top":"/";
 const aboutHref=mode==="home"?"#about":"/#about";
 const contactHref="/contact";
 const navigation=<>
  <a onClick={()=>setOpen(false)} href={homeHref}>{t.home}</a>
  <a onClick={()=>setOpen(false)} href="/work" aria-current={mode==="work"?"page":undefined}>{t.work}</a>
  <a onClick={()=>setOpen(false)} href={aboutHref}>{t.about}</a>
  <a onClick={()=>setOpen(false)} href={contactHref} aria-current={mode==="contact"?"page":undefined}>{t.contact}</a>
 </>;
 return <>
  <header className={"site-nav"+(scrolled?" is-scrolled":"")+(mode==="work"?" is-work":"")}>
   <a href={homeHref} className="site-logo" aria-label="Manee home">PORTFOLIO</a>
   <nav className="site-menu" aria-label={t.navigation}>{navigation}</nav>
   <div className="site-actions">
    <div className="lang-switch" aria-label={t.language} role="group">
     <button type="button" className={language==="th"?"active":""} aria-pressed={language==="th"} onClick={()=>onLanguageChange("th")}>TH</button>
     <span className="lang-divider">/</span>
     <button type="button" className={language==="en"?"active":""} aria-pressed={language==="en"} onClick={()=>onLanguageChange("en")}>EN</button>
    </div>
    <a className="site-contact" href={mode==="contact"?"mailto:pimmaneenimitraporn@gmail.com":contactHref}>{mode==="contact"?t.emailMe:t.talk}<UiIcon name="arrow-up-right" size={16}/></a>
    <button ref={triggerRef} className="site-mobile-toggle" type="button" aria-expanded={open} aria-controls="manee-mobile-menu" aria-label={t.navigation} onClick={()=>setOpen(true)}>{t.menu} <span aria-hidden="true">+</span></button>
   </div>
  </header>
  {mounted&&createPortal(
   <div className={"mobile-nav-overlay"+(open?" is-open":"")} aria-hidden={!open}>
    <button className="mobile-nav-backdrop" type="button" tabIndex={open?0:-1} aria-label={t.backdrop} onClick={closeMenu}/>
    <aside id="manee-mobile-menu" className="mobile-nav-drawer" role="dialog" aria-modal={open} aria-label={t.navigation} inert={!open}>
     <div className="mobile-nav-top">
      <span className="mobile-nav-brand">MANEE<span>.</span></span>
      <button ref={closeRef} type="button" className="mobile-nav-close" aria-label={t.close} onClick={closeMenu}><span aria-hidden="true">×</span></button>
     </div>
     <span className="mobile-nav-caption">{t.caption}</span>
     <nav className="mobile-nav-links" aria-label={t.navigation}>
      <a href={homeHref} onClick={closeMenu}><span>01</span>{t.home}</a>
      <a href="/work" aria-current={mode==="work"?"page":undefined} onClick={closeMenu}><span>02</span>{t.work}</a>
      <a href={aboutHref} onClick={closeMenu}><span>03</span>{t.about}</a>
      <a href={contactHref} aria-current={mode==="contact"?"page":undefined} onClick={closeMenu}><span>04</span>{t.contact}</a>
     </nav>
     <div className="mobile-nav-bottom">
      <span className="mobile-nav-language-label">{t.language}</span>
      <div className="mobile-nav-language" role="group" aria-label={t.language}>
       <button type="button" onClick={()=>onLanguageChange("th")} aria-pressed={language==="th"} className={language==="th"?"active":""}>TH</button>
       <button type="button" onClick={()=>onLanguageChange("en")} aria-pressed={language==="en"} className={language==="en"?"active":""}>EN</button>
      </div>
      <small>MANEE 2026 <UiIcon name="asterisk" size={14}/></small>
     </div>
    </aside>
   </div>,document.body)}
 </>;
}
