"use client";
import {useCallback,useEffect,useLayoutEffect,useState} from "react";
import type {Language} from "./Home";
import {PORTFOLIO_LANGUAGE_KEY,normalizePortfolioLanguage} from "./portfolioLanguage";

/**
 * The server renders the saved cookie language on the very first paint.
 * For visitors who chose Thai before cookie support was added, migrate the
 * old localStorage preference once while the pre-hydration guard is active.
 */
export default function usePortfolioLanguage(initialLanguage:Language="en"){
 const [language,setLanguageState]=useState<Language>(initialLanguage);

 useLayoutEffect(()=>{
  try{
   const saved=window.localStorage.getItem(PORTFOLIO_LANGUAGE_KEY);
   const cookie=document.cookie.split("; ").find(entry=>entry.startsWith(PORTFOLIO_LANGUAGE_KEY+"="))?.split("=")[1];
   const preferred:Language =
    cookie==="th"||cookie==="en"?cookie:
    saved==="th"||saved==="en"?saved:
    initialLanguage;
   if(cookie!==preferred){
    document.cookie=`${PORTFOLIO_LANGUAGE_KEY}=${preferred}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`;
   }
   if(preferred!==initialLanguage)setLanguageState(preferred);
  }catch{
   // Browsers that disable storage still retain in-page language selection.
  }
 },[initialLanguage]);

 useEffect(()=>{
  // Never expose the English server fallback when migrating an old Thai
  // localStorage setting. Reveal the page after the correct render commits.
  const root=document.documentElement;
  if(root.dataset.portfolioLanguageMigrating==="1"&&
     root.dataset.portfolioLanguagePreference===language){
   root.removeAttribute("data-portfolio-language-migrating");
   root.removeAttribute("data-portfolio-language-preference");
  }
 },[language]);

 const setLanguage=useCallback((next:Language)=>{
  if(next!=="en"&&next!=="th")return;
  setLanguageState(next);
  document.documentElement.lang=next;
  try{window.localStorage.setItem(PORTFOLIO_LANGUAGE_KEY,next)}catch{}
  try{
   document.cookie=`${PORTFOLIO_LANGUAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`;
  }catch{}
 },[]);

 return {language,setLanguage};
}
