"use client";
import type {Language} from "./Home";
import usePortfolioLanguage from "./usePortfolioLanguage";
import Navbar from "./Navbar";
import HomeBanner from "./HomeBanner";
import ScrapbookAbout from "./ScrapbookAbout";
import EpochSection from "./EpochSection";
import WorkGallery from "./WorkGallery";
import PortfolioFooter from "./PortfolioFooter";
const words={
 en:{label:"(03) / CONTACT",note:"HAVE AN IDEA?",title:"LET'S MAKE",italic:"IT REAL.",button:"LET'S CONNECT"},
 th:{label:"(03) / ติดต่อ",note:"มีไอเดียอะไรอยู่ไหม?",title:"มาทำไอเดีย",italic:"ให้เป็นจริงกัน",button:"คุยกันได้เลย"}
};
export default function HomePageContent({initialLanguage="en"}:{initialLanguage?:Language}){
 const {language,setLanguage}=usePortfolioLanguage(initialLanguage);
 const t=words[language];
 return <main id="top" lang={language}>
  <Navbar language={language} onLanguageChange={setLanguage}/>
  <HomeBanner language={language}/>
  <ScrapbookAbout language={language}/>
  <EpochSection language={language}/>
  <WorkGallery mode="home" language={language}/>
  <section className="contact wrap" id="contact"><div className="sectionmeta"><span>{t.label}</span><span>{t.note}</span></div>
  <h2>{t.title}<br/><em>{t.italic}</em></h2>
  <a href="/contact">{t.button} <span aria-hidden="true">↗</span></a></section>
  <PortfolioFooter mode="home" language={language}/>
 </main>;
}
