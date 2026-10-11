import UiIcon from "./UiIcon";
import type {Language} from "./Home";
const content={
 en:{portfolio:"PORTFOLIO — 2026",role:"CREATIVE DEVELOPER / AI ENGINEER",intro:"HELLO, I'M",lead:"Design meets",italic:"possibility.",description:"I craft expressive digital experiences where thoughtful design, immersive motion, and intelligent technology come together.",mobileDescription:"I design, build and launch digital experiences — from thoughtful websites to playful little worlds.",explore:"EXPLORE MY WORK",location:"BASED IN THAILAND · WORKING EVERYWHERE",scroll:"SCROLL TO EXPLORE",signature:"Turning imagination into interaction.",category:"01 / CREATIVE TECHNOLOGY"},
 th:{portfolio:"แฟ้มผลงาน — 2026",role:"นักออกแบบประสบการณ์ / CREATIVE DEVELOPER",intro:"สวัสดี เราชื่อ",lead:"ดีไซน์ที่ใช่",italic:"ทำให้ทุกอย่างเป็นไปได้",description:"เราออกแบบและสร้างประสบการณ์ดิจิทัลที่ทั้งสวย ใช้ง่าย และน่าเล่น ผ่าน UX/UI, โค้ด และไอเดียสร้างสรรค์",mobileDescription:"เราออกแบบ พัฒนา และ Deploy ผลงานจริง ตั้งแต่เว็บไซต์ไปจนถึงเกมและโลก 3D",explore:"ไปดูผลงานกัน",location:"อยู่ในไทย · พร้อมทำงานจากทุกที่",scroll:"เลื่อนลงไปดู",signature:"สนุกกับทุกไอเดียที่ได้ลงมือสร้าง",category:"01 / งานสร้างสรรค์ดิจิทัล"}
};
export default function HomeBanner({language}:{language:Language}){
 const t=content[language];
 return <section className="home-banner" aria-label="Manee portfolio introduction">
  <video className="home-banner-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src="/videos/video_1791529164830.MP4" type="video/mp4"/></video>
  <div className="home-banner-shade" aria-hidden="true"/><div className="banner-grain" aria-hidden="true"/>
  <div className="home-banner-content">
   <div className="home-banner-overline"><span className="home-banner-spark"/><span>{t.portfolio}</span><span className="home-banner-overline-right">{t.role}</span></div>
   <div className="home-banner-headline">
    <span className="home-banner-intro">{t.intro}</span>
    <h1><span className="home-banner-name">Manee<span className="home-banner-period">.</span></span></h1>
    <div className="home-banner-subline"><span>{t.lead}</span> <em>{t.italic}</em></div>
   </div>
   <div className="home-banner-bottom">
    <div className="home-banner-description"><span className="banner-label">{t.category}</span><p className="home-banner-desktop-description">{t.description}</p><p className="home-banner-mobile-description">{t.mobileDescription}</p></div>
    <a className="home-banner-explore" href="#work"><span>{t.explore}</span><span className="home-banner-explore-icon"><UiIcon name="arrow-up-right" size={22}/></span></a>
   </div>
  </div>
  <div className="home-banner-bottomline"><span>{t.location}</span><span className="banner-signature">{t.signature}</span><a href="#work">{t.scroll}<b><UiIcon name="arrow-right" size={16}/></b></a></div>
 </section>;
}