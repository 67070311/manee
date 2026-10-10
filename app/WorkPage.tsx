"use client";
import type {Language} from "./Home";
import PortfolioFooter from "./PortfolioFooter";
import usePortfolioLanguage from "./usePortfolioLanguage";
import Navbar from "./Navbar";
import WorkGallery from "./WorkGallery";
export default function WorkPage({initialLanguage="en"}:{initialLanguage?:Language}){
 const {language,setLanguage}=usePortfolioLanguage(initialLanguage);
 return <div className="work-page" id="top" lang={language}>
  <Navbar language={language} onLanguageChange={setLanguage} mode="work"/>
  <main><WorkGallery mode="full" language={language}/></main>
  <PortfolioFooter mode="work" language={language}/>
 </div>;
}