"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import UiIcon from "./UiIcon";
import DesignSystemModal from "./DesignSystemModal";
import type {Language} from "./Home";

const script={
 en:{
  micro:"A NOTE FROM MY DESIGN DESK",sEyebrow:"01 / THE SYSTEM",sTitle:"Design is in the",sItalic:"details.",sText:"The little decisions add up: color, type, spacing and components that feel like they belong together. Here is a living slice of the system behind this portfolio.",sCta:"Open the full design system",sCorner:"A FEW BUILDING BLOCKS",sSample:"hello, curious human!",sBody:"Good design should feel easy.",sButton:"Take a look",sTag:"DESIGNED TO FEEL HUMAN",
  cEyebrow:"02 / BEHIND THE SCENES",cTitle:"From a rough idea to",cItalic:"the real thing.",cText:"A closer look at how an interface takes shape. Explore a simplified concept, the visual direction, and the finished ACBA website presentation.",cNote:"The structure sketch is illustrative, not an original project wireframe.",cName:"ACBA / ASSOCIATION WEBSITE",c1:"Structure",c2:"Visual design",c3:"Built interface",cSub1:"Start with clarity.",cSub2:"Shape the feeling.",cSub3:"Bring it to life.",cDesc1:"Organize navigation, content and the actions people need before styling anything.",cDesc2:"Give the structure a voice through hierarchy, photography and a consistent visual language.",cDesc3:"Translate the approved direction into responsive screens that work across devices.",cScreen:"CONTENT STRUCTURE / EXPLANATORY SKETCH",cNav:"ABOUT   MEMBERS   TRAINING   NEWS",cMock:"Moving cargo. Connecting possibilities.",cMockSmall:"A clear entry point for the association.",cDesktop:"DESKTOP EXPERIENCE",cMobile:"RESPONSIVE THINKING",
  pEyebrow:"03 / THE WAY I WORK",pTitle:"Curious first.",pItalic:"Thoughtful always.",pText:"A simple rhythm that keeps the work clear, from the very first question to the final details.",pLabel:"THE PROCESS",pSteps:[["Discover","Understand people, context and what matters."],["Design","Build hierarchy, explore ideas and make a system."],["Develop","Turn designs into a working experience."],["Refine","Test the small things and keep improving."]],pBottom:"More than just pretty pixels.",pBottomText:"I also make tiny games, experiments and curious little things.",pExplore:"Visit the playground",pTip:"Select a step to see what happens."
 },
 th:{
  micro:"บันทึกเล็ก ๆ จากโต๊ะออกแบบ",sEyebrow:"01 / ระบบดีไซน์",sTitle:"ความสวยอยู่ใน",sItalic:"รายละเอียด",sText:"ตั้งแต่สี ฟอนต์ ระยะห่าง ไปจนถึงคอมโพเนนต์เล็ก ๆ ทุกอย่างควรเป็นภาษาเดียวกัน ลองสำรวจระบบดีไซน์ที่ใช้กับพอร์ตโฟลิโอนี้ได้เลย",sCta:"เปิดดู Design System ฉบับเต็ม",sCorner:"ส่วนประกอบเล็ก ๆ",sSample:"สวัสดี คนชอบลอง!",sBody:"ดีไซน์ที่ดีควรใช้ง่ายและเป็นมิตร",sButton:"ลองดู",sTag:"ดีไซน์ที่รู้สึกเป็นมนุษย์",
  cEyebrow:"02 / เบื้องหลังงานออกแบบ",cTitle:"จากไอเดียเล็ก ๆ",cItalic:"สู่เว็บจริง",cText:"ลองดูการทำงานตั้งแต่โครงสร้างแนวคิด การกำหนดทิศทางภาพ จนถึงผลงานเว็บไซต์ ACBA",cNote:"ภาพโครงสร้างเป็นภาพอธิบายแนวคิด ไม่ใช่ Wireframe ต้นฉบับของโครงการ",cName:"ACBA / เว็บไซต์สมาคม",c1:"วางโครงสร้าง",c2:"ออกแบบ UI",c3:"พัฒนาใช้งาน",cSub1:"เริ่มจากความชัดเจน",cSub2:"สร้างบุคลิกให้ดีไซน์",cSub3:"เปลี่ยนเป็นเว็บที่ใช้ได้",cDesc1:"จัดเนื้อหา เมนู และสิ่งที่ผู้ใช้ต้องทำให้เข้าใจก่อนลงรายละเอียดหน้าตา",cDesc2:"เติมลำดับความสำคัญ ภาพประกอบ สี และเอกลักษณ์ของงานให้เข้ากัน",cDesc3:"เปลี่ยนงานออกแบบเป็นหน้าเว็บ Responsive ที่ใช้งานได้จริง",cScreen:"โครงสร้างเนื้อหา / ภาพแนวคิด",cNav:"เกี่ยวกับ   สมาชิก   อบรม   ข่าวสาร",cMock:"Moving cargo. Connecting possibilities.",cMockSmall:"เริ่มต้นจากข้อมูลที่ผู้ใช้ต้องการ",cDesktop:"มุมมองเดสก์ท็อป",cMobile:"คิดเผื่อหน้าจอเล็ก",
  pEyebrow:"03 / วิธีการทำงาน",pTitle:"เริ่มจากความสงสัย",pItalic:"จบด้วยความใส่ใจ",pText:"กระบวนการเรียบง่ายที่ช่วยให้งานชัดเจน ตั้งแต่คำถามแรกไปจนถึงการเก็บรายละเอียดท้ายสุด",pLabel:"ขั้นตอนทำงาน",pSteps:[["Discover","เข้าใจผู้ใช้ บริบท และปัญหาจริง"],["Design","วางลำดับข้อมูล สำรวจไอเดีย และสร้างระบบดีไซน์"],["Develop","เปลี่ยนหน้าตาให้กลายเป็นประสบการณ์ที่ใช้ได้จริง"],["Refine","ลองใช้ ทดสอบ และค่อย ๆ ปรับให้ดีขึ้น"]],pBottom:"มากกว่าแค่พิกเซลสวย ๆ",pBottomText:"ยังมีเกมเล็ก ๆ งานทดลอง และไอเดียสนุก ๆ ให้ลองเล่น",pExplore:"ไปหน้า Playground",pTip:"ลองกดแต่ละขั้นตอนดู"
 }
};
const palette=[{c:"#203E52",name:"Ink"},{c:"#3468A3",name:"Blue"},{c:"#538A70",name:"Sage"},{c:"#F3D57A",name:"Sunshine"},{c:"#FBFAF4",name:"Paper"}];
const icons=["search","brush","grid","cloud"] as const;

export default function HomeCreativeSections({language}:{language:Language}){
 const t=script[language];
 const rootRef=useRef<HTMLDivElement>(null);
 const [showSystem,setShowSystem]=useState(false);
 const closeSystem=useCallback(()=>setShowSystem(false),[]);
 const [stage,setStage]=useState(0);
 const [process,setProcess]=useState(0);
 useEffect(()=>{
  const root=rootRef.current;
  if(!root)return;
  const elements=Array.from(root.querySelectorAll<HTMLElement>(".studio-reveal"));
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){
   elements.forEach(node=>node.classList.add("is-visible"));return;
  }
  const observer=new IntersectionObserver((entries)=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}});
  },{threshold:.12,rootMargin:"0px 0px -24px 0px"});
  elements.forEach(node=>observer.observe(node));
  return()=>observer.disconnect();
 },[]);
 const stages=[t.c1,t.c2,t.c3];
 return <div ref={rootRef} className="studio-story" lang={language}>
  <section className="studio-design" id="design-system" aria-labelledby="studio-system-title">
   <div className="studio-shell studio-design-grid">
    <div className="studio-design-copy studio-reveal">
     <span className="studio-eyebrow"><UiIcon name="asterisk" size={17}/>{t.sEyebrow}</span>
     <h2 id="studio-system-title">{t.sTitle}<br/><em>{t.sItalic}</em></h2>
     <p>{t.sText}</p>
     <button type="button" className="studio-primary-link" onClick={()=>setShowSystem(true)}>{t.sCta}<UiIcon name="expand" size={21}/></button>
     <span className="studio-hand-note"><UiIcon name="arrow-up-right" size={25}/>{t.micro}</span>
    </div>
    <button type="button" className="studio-system-board studio-reveal" onClick={()=>setShowSystem(true)} aria-label={t.sCta}>
      <span className="studio-board-top"><span className="studio-board-dots"><i/><i/><i/></span> VISUAL FOUNDATIONS / COMPONENTS <UiIcon name="arrow-up-right" size={17}/></span>
      <div className="studio-board-inside">
       <div className="studio-board-left"><span className="studio-board-small">COLOR STORY <UiIcon name="asterisk" size={13}/></span>
        <div className="studio-swatches">{palette.map(p=><span key={p.c} className="studio-swatch" style={{background:p.c}} title={p.name}/>)}</div>
        <div className="studio-board-type">Aa<span>abc</span></div>
        <div className="studio-type-caption">Patrick Hand <span>＋</span> Caveat</div>
       </div>
       <div className="studio-board-right">
        <div className="studio-board-note">{t.sCorner}<span aria-hidden="true"><UiIcon name="asterisk" size={19}/></span></div>
        <div className="studio-board-ui">
         <span className="studio-ui-pill"><UiIcon name="flower" size={15}/>{t.sTag}</span>
         <strong>{t.sSample}</strong><p>{t.sBody}</p>
         <span className="studio-board-button">{t.sButton}<UiIcon name="arrow-right" size={16}/></span>
         <span className="studio-ui-ornament" aria-hidden="true"><UiIcon name="cloud" size={29}/></span>
        </div>
       </div>
      </div>
      <span className="studio-board-bottom"><span>COLOR / TYPE / COMPONENTS</span><span>THE LITTLE DETAILS MATTER.</span></span>
     </button>
   </div>
  </section>

  <section className="studio-case" id="behind-the-design" aria-labelledby="studio-case-title">
   <div className="studio-shell">
    <div className="studio-case-heading studio-reveal">
     <div>
      <span className="studio-eyebrow"><UiIcon name="asterisk" size={16}/>{t.cEyebrow}</span>
      <h2 id="studio-case-title">{t.cTitle}<br/><em>{t.cItalic}</em></h2>
     </div>
     <p>{t.cText}</p>
    </div>
    <div className="studio-case-card studio-reveal">
     <div className="studio-case-control">
      <div className="studio-case-id"><span className="studio-case-symbol"><UiIcon name="grid" size={18}/></span><span>{t.cName}</span></div>
      <div className="studio-stage-tabs" role="group" aria-label={language==="th"?"ขั้นตอนของผลงาน":"Project stages"}>
       {stages.map((s,i)=><button type="button" key={s} className={stage===i?"is-active":""} aria-pressed={stage===i} onClick={()=>setStage(i)}><span>{String(i+1).padStart(2,"0")}</span>{s}</button>)}
      </div>
     </div>
     <div className="studio-case-body">
      <div className="studio-case-art" key={stage}>
       {stage===0?
        <div className="studio-wireframe" aria-label={t.cScreen}>
         <div className="studio-wire-head"><b>ACBA</b><span>{t.cNav}</span><i/></div>
         <div className="studio-wire-hero"><div><span className="wire-line wide"/><span className="wire-line"/><span className="wire-line short"/><span className="wire-button"/></div><div className="wire-photo"><UiIcon name="expand" size={28}/></div></div>
         <div className="studio-wire-columns"><div><span/><span/><span/></div><div><span/><span/><span/></div><div><span/><span/><span/></div></div>
         <span className="studio-wire-badge">{t.cScreen}</span>
        </div>:
        <div className={"studio-case-image "+(stage===2?"is-built":"is-design")}>
         <div className="studio-browser-bar"><span><i/><i/><i/></span><small>ACBA / RESPONSIVE WEB</small></div>
         <img src="/images/work/acba.png" alt={stage===1?(language==="th"?"ภาพพรีเซนต์งานออกแบบเว็บไซต์ ACBA":"ACBA website visual presentation"):(language==="th"?"ผลงานเว็บไซต์ ACBA แสดงบนคอมพิวเตอร์และหลายหน้าจอ":"ACBA responsive website presentation")} loading="lazy" decoding="async"/>
         {stage===2&&<span className="studio-built-badge"><UiIcon name="check" size={15}/>{language==="th"?"หน้าจอ Responsive":"Responsive experience"}</span>}
        </div>
       }
      </div>
      <div className="studio-case-caption" aria-live="polite"><div><span>0{stage+1} / 03</span><h3>{[t.cSub1,t.cSub2,t.cSub3][stage]}</h3><p>{[t.cDesc1,t.cDesc2,t.cDesc3][stage]}</p></div><div className="studio-case-next"><button type="button" onClick={()=>setStage((stage+2)%3)} aria-label={language==="th"?"ขั้นก่อนหน้า":"Previous stage"}><UiIcon name="arrow-left" size={21}/></button><button type="button" onClick={()=>setStage((stage+1)%3)} aria-label={language==="th"?"ขั้นถัดไป":"Next stage"}><UiIcon name="arrow-right" size={21}/></button></div></div>
     </div>
    </div>
    <p className="studio-case-disclaimer">{t.cNote}</p>
   </div>
  </section>

  <section className="studio-process" id="my-process" aria-labelledby="studio-process-title">
   <div className="studio-shell">
    <div className="studio-process-top studio-reveal">
     <div><span className="studio-eyebrow"><UiIcon name="asterisk" size={17}/>{t.pEyebrow}</span><h2 id="studio-process-title">{t.pTitle}<br/><em>{t.pItalic}</em></h2></div>
     <p>{t.pText}</p>
    </div>
    <div className="studio-process-track studio-reveal" role="group" aria-label={t.pLabel}>
     {t.pSteps.map((item,i)=><button type="button" key={i} onClick={()=>setProcess(i)} aria-pressed={process===i} className={"studio-process-step"+(process===i?" is-active":"")}>
       <span className="studio-process-number">{String(i+1).padStart(2,"0")}</span>
       <span className="studio-process-icon"><UiIcon name={icons[i]} size={32}/></span>
       <strong>{item[0]}</strong>
       <span className="studio-process-arrow" aria-hidden="true"><UiIcon name="arrow-right" size={21}/></span>
      </button>)}
    </div>
    <div className="studio-process-description studio-reveal"><span className="studio-process-progress"><span style={{width:`${(process+1)*25}%`}}/></span><div aria-live="polite"><span>0{process+1} / 04</span><strong>{t.pSteps[process][0]}</strong><p>{t.pSteps[process][1]}</p></div><small>{t.pTip}</small></div>
    <div className="studio-end-note studio-reveal">
     <span className="studio-end-icon"><UiIcon name="cloud" size={33}/></span>
     <div><strong>{t.pBottom}</strong><p>{t.pBottomText}</p></div>
     <Link href="/playground">{t.pExplore}<UiIcon name="arrow-up-right" size={19}/></Link>
    </div>
   </div>
  </section>
  <DesignSystemModal open={showSystem} onClose={closeSystem} language={language}/>
 </div>;
}
