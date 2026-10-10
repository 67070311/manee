"use client";
import {useState} from "react";
import Navbar from "./Navbar";
import HomeBanner from "./HomeBanner";
export type Language="en"|"th";
export default function Home(){
 const [language,setLanguage]=useState<Language>("en");
 return <><Navbar language={language} onLanguageChange={setLanguage}/><HomeBanner language={language}/></>;
}