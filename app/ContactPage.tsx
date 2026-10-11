"use client";
import UiIcon from "./UiIcon";
import type {Language} from "./Home";
import {useState,type FormEvent} from "react";
import Navbar from "./Navbar";
import ContactHero from "./ContactHero";
import PortfolioFooter from "./PortfolioFooter";
import usePortfolioLanguage from "./usePortfolioLanguage";
import {sendContactMessage} from "./contactAction";

type Fields={name:string;email:string;subject:string;message:string;website:string};
const initial:Fields={name:"",email:"",subject:"",message:"",website:""};
const content={
 en:{
  eyebrow:"MANEE / LET'S CONNECT",
  titleFirst:"Let’s make",
  titleLast:"it happen.",
  intro:"Whether it's a website, a digital product, a playful game, or an idea that hasn't found its shape yet — I'd love to hear about it.",
  tiny:"GOOD IDEAS START WITH A CONVERSATION",
  infoTitle:"Find me here",
  infoHint:"Reach out whichever way feels easiest.",
  email:"EMAIL",phone:"PHONE",
  formTitle:"Tell me about your idea.",
  formNote:"Leave a little note and I'll get back to you.",
  name:"Your name",namePlaceholder:"What should I call you?",
  emailField:"Email address",emailPlaceholder:"you@example.com",
  subject:"Subject",subjectPlaceholder:"What are we creating?",
  message:"Your message",messagePlaceholder:"Tell me a little about your project, timeline, or whatever is on your mind...",
  send:"Send message",sending:"Sending...",
  success:"Message sent! Thanks for reaching out — I'll reply by email.",
  notConfigured:"The email service hasn't been connected yet. Please email me directly for now.",
  fail:"Couldn't send right now. Please try again, or email me directly.",
  privacy:"Your message goes directly to my inbox. No newsletter, no spam.",
  back:"BACK TO THE WORK"
 },
 th:{
  eyebrow:"MANEE / มาคุยกัน",
  titleFirst:"มาทำให้",
  titleLast:"เป็นจริงกัน",
  intro:"ไม่ว่าจะเป็นเว็บไซต์ โปรดักต์ เกม หรือไอเดียที่ยังไม่รู้จะเริ่มตรงไหน เล่าให้เราฟังได้เลย เราอยากช่วยทำให้มันเป็นจริง",
  tiny:"ไอเดียดี ๆ เริ่มต้นจากการพูดคุย",
  infoTitle:"ช่องทางติดต่อ",
  infoHint:"สะดวกช่องทางไหน ทักมาได้เลย",
  email:"อีเมล",phone:"โทรศัพท์",
  formTitle:"เล่าไอเดียให้เราฟังหน่อย",
  formNote:"ฝากข้อความไว้ แล้วเราจะตอบกลับทางอีเมล",
  name:"ชื่อของเทอ",namePlaceholder:"อยากให้เราเรียกว่าอะไร?",
  emailField:"อีเมล",emailPlaceholder:"you@example.com",
  subject:"หัวข้อ",subjectPlaceholder:"อยากให้เราช่วยทำอะไร?",
  message:"ข้อความ",messagePlaceholder:"ลองเล่ารายละเอียดโปรเจกต์ สิ่งที่อยากทำ หรือข้อสงสัยมาได้เลย...",
  send:"ส่งข้อความ",sending:"กำลังส่ง...",
  success:"ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับทางอีเมลนะ",
  notConfigured:"ระบบส่งอีเมลยังไม่ได้ตั้งค่า ตอนนี้ติดต่อเราทางอีเมลโดยตรงก่อนได้เลย",
  fail:"ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง หรือส่งอีเมลหาเราโดยตรงได้เลย",
  privacy:"ข้อความจะส่งตรงมาที่อีเมลของเรา ไม่มีสแปมหรือการส่งข่าวสารอื่น ๆ",
  back:"กลับไปดูผลงาน"
 }
} as const;
export default function ContactPage({initialLanguage="en"}:{initialLanguage?:Language}){
 const {language,setLanguage}=usePortfolioLanguage(initialLanguage);
 const t=content[language];
 const [values,setValues]=useState<Fields>(initial);
 const [status,setStatus]=useState<"idle"|"sending"|"sent"|"error"|"unconfigured">("idle");
 const [errorText,setErrorText]=useState("");
 const update=(key:keyof Fields,value:string)=>{
  setValues(old=>({...old,[key]:value}));
  if(status!=="sending")setStatus("idle");
 };
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(status==="sending")return;
  setStatus("sending");setErrorText("");
  try{
   const result=await sendContactMessage(values);
   if(result.status==="sent"){setValues(initial);setStatus("sent");return}
   if(result.status==="unconfigured"){setStatus("unconfigured");return}
   setStatus("error");
   if(result.status==="rate-limited")setErrorText(language==="th"?"ส่งข้อความบ่อยเกินไป ลองใหม่อีกสักครู่นะ":"Too many requests. Please try again later.");
   if(result.status==="invalid")setErrorText(language==="th"?"ตรวจสอบข้อมูลในฟอร์มอีกครั้งนะ":"Please check the information in the form.");
  }catch{setStatus("error")}
 }
 return <div className="contact-page" id="top" lang={language}>
  <Navbar language={language} onLanguageChange={setLanguage} mode="contact"/>
  <ContactHero language={language}/>
  <main className="contact-page-main">
   <section className="contact-page-intro" id="contact-form" aria-label={t.infoTitle}>
    <div className="contact-page-columns">
     <div className="contact-page-copy">
      <div className="contact-page-links">
       <div className="contact-page-link-intro"><h2>{t.infoTitle}</h2><p>{t.infoHint}</p></div>
       <a href="mailto:pimmaneenimitraporn@gmail.com" className="contact-page-link"><span>{t.email}</span><strong>pimmaneenimitraporn@gmail.com</strong></a>
       <a href="tel:+66816133337" className="contact-page-link"><span>{t.phone}</span><strong>081-613-3337</strong></a>
      </div>
     </div>
     <div className="contact-page-form-card">
      <div className="contact-page-form-top"><UiIcon name="asterisk" size={18}/><span>01 / SAY HELLO</span></div>
      <h2>{t.formTitle}</h2>
      <p className="contact-page-form-note">{t.formNote}</p>
      <form onSubmit={submit} className="contact-page-form">
       <div className="contact-page-two-cols">
        <label>{t.name}<input name="name" type="text" autoComplete="name" placeholder={t.namePlaceholder} required maxLength={120} value={values.name} onChange={e=>update("name",e.target.value)} disabled={status==="sending"}/></label>
        <label>{t.emailField}<input name="email" type="email" autoComplete="email" placeholder={t.emailPlaceholder} required maxLength={254} value={values.email} onChange={e=>update("email",e.target.value)} disabled={status==="sending"}/></label>
       </div>
       <label>{t.subject}<input name="subject" type="text" placeholder={t.subjectPlaceholder} required maxLength={180} value={values.subject} onChange={e=>update("subject",e.target.value)} disabled={status==="sending"}/></label>
       <label>{t.message}<textarea name="message" rows={6} placeholder={t.messagePlaceholder} required minLength={10} maxLength={6000} value={values.message} onChange={e=>update("message",e.target.value)} disabled={status==="sending"}/></label>
       <div className="contact-page-honeypot" aria-hidden="true"><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={e=>update("website",e.target.value)}/></label></div>
       <button type="submit" className="contact-page-submit" disabled={status==="sending"}>{status==="sending"?t.sending:t.send}</button>
       <p className="contact-page-privacy">{t.privacy}</p>
       <div role="status" aria-live="polite" className={"contact-page-status"+(status==="sent"?" is-success":"")}>
        {status==="sent"?t.success:status==="unconfigured"?<>{t.notConfigured} <a href="mailto:pimmaneenimitraporn@gmail.com">Email</a></>:status==="error"?errorText||t.fail:""}
       </div>
      </form>
     </div>
    </div>
    <div className="contact-page-bottom"><span>MANEE / PORTFOLIO / 2026</span><a href="/work">{t.back} </a></div>
   </section>
  </main>
  <PortfolioFooter mode="work" language={language}/>
 </div>;
}
