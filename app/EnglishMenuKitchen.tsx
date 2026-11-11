"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import UiIcon from "./UiIcon";
import {vocabulary,vocabImage,illustration,type EnglishMenuDish} from "./EnglishMenuData";
import {getCookingSteps,type CookingPhase} from "./EnglishMenuCooking";
import type {Language} from "./Home";

type Props={dish:EnglishMenuDish;language:Language;initialSpoken?:boolean;onBack:()=>void;onFinish:()=>void};
type EffectKind="pour"|"drop"|"tool";
const liquids=new Set(["fishsauce","water","oil","broth","dashi","sauce"]);
const sauces=new Set([...liquids,"tamarind","miso","gochujang"]);
const gestureVerbs=/slice|chop|cut|dice|stir|mix|whisk|toss|sauté|scramble|dissolve|drain|dip|shake/i;
const text={
 th:{back:"กลับไปดูสูตร",step:"STEP",of:"/",listen:"ฟังคำอ่าน",ingredient:"วัตถุดิบ",tools:"เครื่องครัว",progress:"ความคืบหน้า",prep:"เตรียมของ",cook:"ทำอาหาร",plate:"จัดจาน",wrong:"ยังไม่ใช่อันนี้ ลองอีกทีนะ",right:"เยี่ยมเลย!",pick:"เลือกตามคำสั่งด้านบน",tap:"แตะเพื่อ",used:"ใช้แล้ว",audio:"เบราว์เซอร์นี้ไม่รองรับเสียงอ่าน",tip:"เลือกภาพให้ถูก แล้วเกมจะไปต่อเอง",done:"กำลังทำ...",hot:"เตาปรุงอาหาร",home:"MY LITTLE KITCHEN",move:"ลากนิ้วหรือเมาส์บนอาหาร",touch:"แตะที่พื้นที่ครัวเพื่อทำต่อ",cookHint:"ทำสำเร็จแล้วเปลี่ยนขั้นตอนเอง",hintAction:"ทำอาหารด้วยการสัมผัส"},
 en:{back:"Back to recipe",step:"STEP",of:"/",listen:"Listen to pronunciation",ingredient:"Ingredients",tools:"Kitchenware",progress:"Progress",prep:"Prepare",cook:"Cook",plate:"Plate up",wrong:"Not this one. Try another!",right:"Well done!",pick:"Follow the instruction above",tap:"Tap to",used:"Used",audio:"Speech is not supported in this browser",tip:"Pick the correct picture to move on automatically",done:"Cooking...",hot:"Cooking station",home:"MY LITTLE KITCHEN",move:"Move your finger or mouse over the food",touch:"Tap the cooking area to continue",cookHint:"Automatically continues after each action",hintAction:"Cook by interacting"}
} as const;

export default function EnglishMenuKitchen({dish,language,initialSpoken=false,onBack,onFinish}:Props){
 const t=text[language];
 const steps=useMemo(()=>getCookingSteps(dish),[dish]);
 const [index,setIndex]=useState(0);
 const [solved,setSolved]=useState(false);
 const [wrong,setWrong]=useState(false);
 const [taps,setTaps]=useState(0);
 const [soundError,setSoundError]=useState(false);
 const [autoVoice,setAutoVoice]=useState(true);
 const [motion,setMotion]=useState<{id:string;kind:EffectKind}|null>(null);
 const [cursor,setCursor]=useState<{x:number;y:number}|null>(null);
 const [dragging,setDragging]=useState(false);
 const pointer=useRef({active:false,lastX:0,lastY:0,travel:0,count:0});
 const step=steps[index];
 const completed=steps.slice(0,index+(solved?1:0));
 const usedIngredients=new Set(completed.filter(s=>s.type==="ingredient").map(s=>s.id));
 const usedTools=new Set(completed.filter(s=>s.type==="tool").map(s=>s.id));
 const ingredientSteps=completed.filter(s=>s.type==="ingredient"&&s.id);
 const latestFood=ingredientSteps.filter(s=>!sauces.has(s.id!)).map(s=>s.id!).slice(-4);
 const sauceUsed=ingredientSteps.some(s=>s.id&&sauces.has(s.id));
 // Tool placement is persistent: adding a board parks an existing mixing bowl rather than replacing it.
 const hasBowl=usedTools.has("bowl");
 const hasBoard=usedTools.has("board");
 const hasStrainer=usedTools.has("strainer")||usedTools.has("skimmer");
 const hasKnife=usedTools.has("knife");
 const lastPrepTool=completed.filter(s=>s.type==="tool"&&s.phase==="prep").map(s=>s.id!).slice(-1)[0];
 const placedCookVessel=completed.filter(s=>s.type==="tool"&&["wok","pot","pan","stonebowl"].includes(s.id||"")).map(s=>s.id!).slice(-1)[0]||null;
 const platedItems=completed.filter(s=>s.phase==="plate"&&s.type==="ingredient"&&s.id).map(s=>s.id!);
 const platedSolids=platedItems.filter(id=>!sauces.has(id));
 const plateVesselReady=usedTools.has("bowl")||usedTools.has("stonebowl")||platedSolids.length>0;
 const platedBase=ingredientSteps.some(s=>s.id==="rice")&&dish.id==="bibimbap"?"rice":
  ingredientSteps.some(s=>s.id==="pasta")&&["spaghetti","margherita"].includes(dish.id)?"pasta":null;


 const phase=step?.phase??"prep";
 const progress=Math.round((index+(solved?1:0))/Math.max(steps.length,1)*100);
 const action=step?.type==="action";
 const chopping=action&&/slice|chop|cut|dice/i.test(step.verb);
 const heating=action&&/boil|warm|simmer|heat|fry/i.test(step.verb);
 const stirring=action&&/toss|whisk|mix|stir|sauté|scramble|dissolve/i.test(step.verb);
 const gesture=action&&gestureVerbs.test(step.verb);
 const verb=action?step.verb.toLowerCase():"";
 const isCut=action&&/slice|chop|cut|dice/.test(verb);
 const isMix=action&&/mix|whisk|dissolve/.test(verb);
 const isDip=action&&/dip/.test(verb);
 const isDrain=action&&/drain/.test(verb);
 const isStir=action&&/stir|toss|sauté|scramble/.test(verb);
 const isBubble=action&&/boil|warm|simmer|heat|fry/.test(verb);
 const isServing=action&&/serve|ladle|arrange/.test(verb);
 const prepFocus=isCut?"board":isMix||isDip?"bowl":isDrain?"strainer":
  step?.type==="ingredient"&&hasBoard&&["carrot","mushroom","sweetpotato","tofu","lemongrass","galangal","scallion"].includes(step.id||"")?"board":
  lastPrepTool==="board"||lastPrepTool==="knife"?"board":
  lastPrepTool==="strainer"||lastPrepTool==="skimmer"?"strainer":"bowl";
 const prepFood=ingredientSteps.filter(s=>s.phase==="prep"&&!sauces.has(s.id!)).map(s=>s.id!).slice(-3);
 const sauceColor=ingredientSteps.some(s=>["gochujang","sauce","tamarind"].includes(s.id!))?"dark":
  ingredientSteps.some(s=>s.id==="miso")?"gold":"light";
 const prepSauce=ingredientSteps.some(s=>s.phase==="prep"&&s.id&&sauces.has(s.id));
 const cookSauce=ingredientSteps.some(s=>s.phase==="cook"&&s.id&&sauces.has(s.id));
 const cookVessels=completed.filter(s=>s.phase==="cook"&&s.type==="tool"&&["wok","pot","pan","stonebowl"].includes(s.id||"")).map(s=>s.id!);
 const previousVessel=cookVessels.length>1?cookVessels[cookVessels.length-2]:null;
 const prepActions=completed.filter(s=>s.phase==="prep"&&s.type==="action");
 const dippedPrep=prepActions.some(s=>/dip/i.test(s.verb));
 const prepBowlFood=prepFood.filter(id=>dish.id==="tempura"?(id==="flour"||(dippedPrep&&["shrimp","sweetpotato"].includes(id))):!["noodles","pasta"].includes(id));
 const prepBoardFood=prepFood.filter(id=>!(dish.id==="tempura"&&dippedPrep));
 const cookedActions=completed.filter(s=>s.phase==="cook"&&s.type==="action");
 const mixedIntoPan=cookedActions.some(s=>/toss/i.test(s.verb));
 const simmeredPrep=cookedActions.some(s=>/simmer|boil|sauté/i.test(s.verb));
 const deepFriedPrep=dish.id==="tempura"&&cookedActions.some(s=>/fry/i.test(s.verb));
 const cookFoodIds=ingredientSteps.filter(s=>s.phase==="cook"&&!sauces.has(s.id!)).map(s=>s.id!);
 const fromPrep=deepFriedPrep?["shrimp","sweetpotato"]:mixedIntoPan?["noodles","pasta"]:simmeredPrep&&dish.id==="tom-yum"?["lemongrass","galangal","mushroom"]:simmeredPrep&&dish.id==="kimchi-jjigae"?["tofu","mushroom"]:[];
 const cookFood=[...cookFoodIds,...fromPrep.filter(id=>ingredientSteps.some(s=>s.id===id))].slice(-5);
 const isSoupDish=["tom-yum","kimchi-jjigae","miso-soup"].includes(dish.id);
 const cookLiquids=ingredientSteps.filter(s=>s.phase==="cook"&&s.id&&sauces.has(s.id));
 const filledCookSurface=cookFoodIds.length>0||cookLiquids.length>0||cookedActions.some(s=>/boil|warm|fry|simmer/i.test(s.verb));
 const stirringTool=usedTools.has("spatula")?"spatula":usedTools.has("spoon")?"spoon":usedTools.has("whisk")?"whisk":usedTools.has("ladle")?"ladle":null;
 const servingTool=usedTools.has("ladle")?"ladle":usedTools.has("skimmer")?"skimmer":usedTools.has("spoon")?"spoon":usedTools.has("spatula")?"spatula":null;
 const prepMixTool=usedTools.has("whisk")?"whisk":usedTools.has("spoon")?"spoon":usedTools.has("spatula")?"spatula":null;


 // Speak each new English instruction automatically after the user starts playing.
 // A click on Start Cooking supplies the initial user interaction required by browsers.
 useEffect(()=>{
  if(!step||!autoVoice||(index===0&&initialSpoken)||typeof window==="undefined"||!("speechSynthesis" in window))return;
  const voice=new SpeechSynthesisUtterance(step.en);
  voice.lang="en-US";voice.rate=.85;voice.pitch=1.07;
  const timer=window.setTimeout(()=>{
   try{window.speechSynthesis.cancel();window.speechSynthesis.speak(voice);}catch{setSoundError(true);}
  },90);
  return ()=>{window.clearTimeout(timer);window.speechSynthesis.cancel();};
 },[index,step?.en,autoVoice,initialSpoken]);


 useEffect(()=>{
  if(!solved||!step)return;
  const ms=motion?.kind==="pour"?1800:motion?.kind==="drop"?1080:motion?.kind==="tool"?920:action?1220:850;
  const handle=window.setTimeout(()=>{
   if(index===steps.length-1){onFinish();return;}
   setIndex(v=>v+1);setSolved(false);setWrong(false);setMotion(null);setTaps(0);setCursor(null);setDragging(false);pointer.current={active:false,lastX:0,lastY:0,travel:0,count:0};
  },ms);
  return ()=>window.clearTimeout(handle);
 },[solved,index,steps.length,motion,step,action,onFinish]);

 const speak=()=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)){setSoundError(true);return;}
  try{setSoundError(false);window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(step.en);voice.lang="en-US";voice.rate=.85;window.speechSynthesis.speak(voice);}catch{setSoundError(true);}
 };
 const choose=(id:string,kind:"ingredient"|"tool")=>{
  if(solved||!step||step.type!==kind)return;
  if(id!==step.id){setWrong(true);return;}
  setWrong(false);
  setMotion({id,kind:kind==="tool"?"tool":liquids.has(id)?"pour":"drop"});
  setSolved(true);
 };
 const registerAction=()=>{
  if(!action||solved||!step)return;
  const next=Math.min(step.taps,pointer.current.count+1);
  pointer.current.count=next;setTaps(next);
  if(next>=step.taps){setWrong(false);setSolved(true);pointer.current.active=false;setDragging(false);}
 };
 // Only actions performed over the current vessel or cutting surface should count.
 const inActionZone=(e:React.PointerEvent<HTMLDivElement>)=>{
  const rect=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-rect.left)/Math.max(1,rect.width);
  const y=(e.clientY-rect.top)/Math.max(1,rect.height);
  const center=phase==="prep"?
   prepFocus==="board"?(hasBowl?0.59:0.5):
   prepFocus==="strainer"?(hasBowl?0.57:0.5):
   hasBowl&&hasBoard?0.57:0.5:
   phase==="cook"?(previousVessel?0.58:0.5):
   (plateVesselReady||isServing||isDrain)&&placedCookVessel?0.66:0.5;
  return Math.abs(x-center)<0.29&&Math.abs(y-0.5)<0.46;
 };
 const onStagePointerDown=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!action||solved||!inActionZone(e))return;
  if(!gesture){registerAction();return;}
  pointer.current.active=true;
  pointer.current.lastX=e.clientX;pointer.current.lastY=e.clientY;pointer.current.travel=0;
  const r=e.currentTarget.getBoundingClientRect();
  setCursor({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100});
  setDragging(true);
  e.currentTarget.setPointerCapture(e.pointerId);
 };
 const onStagePointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!pointer.current.active||solved||!action||!gesture||!inActionZone(e))return;
  const r=e.currentTarget.getBoundingClientRect();
  setCursor({x:Math.max(9,Math.min(91,(e.clientX-r.left)/r.width*100)),y:Math.max(9,Math.min(91,(e.clientY-r.top)/r.height*100))});
  const dist=Math.hypot(e.clientX-pointer.current.lastX,e.clientY-pointer.current.lastY);
  pointer.current.travel+=dist;
  pointer.current.lastX=e.clientX;pointer.current.lastY=e.clientY;
  if(pointer.current.travel>=52){pointer.current.travel-=52;registerAction();}
 };
 const onStagePointerEnd=(e:React.PointerEvent<HTMLDivElement>)=>{
  pointer.current.active=false;pointer.current.travel=0;setDragging(false);setCursor(null);
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 };
 if(!step)return <div className="ck-shell"><button onClick={onBack}>{t.back}</button></div>;

 const stageCounts={prep:steps.filter(s=>s.phase==="prep").length,cook:steps.filter(s=>s.phase==="cook").length,plate:steps.filter(s=>s.phase==="plate").length};


 const actionArt=isCut&&hasKnife?"knife":
  /whisk/i.test(step.verb)&&usedTools.has("whisk")?"whisk":
  isDrain?(usedTools.has("strainer")?"strainer":usedTools.has("skimmer")?"skimmer":null):
  /ladle/i.test(step.verb)&&usedTools.has("ladle")?"ladle":stirringTool;
 const stageNames:{[key in CookingPhase]:string}={prep:t.prep,cook:t.cook,plate:t.plate};
 return <div className="ck-shell">
  <header className="ck-top">
   <button type="button" className="ck-back" onClick={onBack}><UiIcon name="arrow-left" size={16}/>{t.back}</button>
   <div className="ck-top-name"><span className="ck-top-kicker">ENGLISH MENU • {t.home}</span><strong>{dish.name}</strong></div>
   <div className="ck-top-progress"><span><b>{index+1}</b> / {steps.length}</span><div className="ck-progress-track" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={index+(solved?1:0)}><i style={{width:progress+"%"}}/></div></div>
  </header>

  <section className="ck-command" aria-label={t.pick}>
   <div className="ck-command-number">{String(index+1).padStart(2,"0")}</div>
   <div className="ck-command-copy"><span className="ck-command-kicker">{stageNames[phase]} <span>✦</span> {t.step} {index+1} {t.of} {steps.length}</span><h1 lang="en">{step.en}</h1><p lang="th">{step.th}</p></div>
   <div className="ck-audio-controls">
    <span className="ck-auto-audio-label">{language==="th"?"ฟังคำสั่งอัตโนมัติ":"Listen to each step"}</span>
    <button type="button" className="ck-speak" onClick={speak} aria-label={t.listen} title={t.listen}><UiIcon name="volume-2" size={21}/></button>
    <button type="button" className={"ck-auto-voice-toggle"+(autoVoice?" is-on":"")} onClick={()=>setAutoVoice(v=>!v)} aria-pressed={autoVoice} title={language==="th"?"เปิดหรือปิดการอ่านอัตโนมัติ":"Toggle automatic narration"}>{autoVoice?"ON":"OFF"}</button>
   </div>
  </section>

  <section className="ck-stage" aria-label={t.hot}>
   <div className="ck-stage-topline"><span>✿ {t.home}</span><div className="ck-stage-milestones">{(["prep","cook","plate"] as CookingPhase[]).map(p=><span key={p} className={(phase===p?"is-active ":"")+(completed.filter(s=>s.phase===p).length>=stageCounts[p]?"is-done":"")}>{stageNames[p]} <small>{completed.filter(s=>s.phase===p).length}/{stageCounts[p]}</small></span>)}</div></div>
   <div className={"ck-stage-world ck-stage-"+phase+(solved?" ck-stage-success":"")+(action?" ck-interactive":"")+(dragging?" ck-gesture-active":"")}
     tabIndex={action&&!solved?0:undefined} role={action?"button":undefined}
     aria-label={action?step.verb+" · "+(gesture?t.move:t.touch):undefined}
     onKeyDown={e=>{if(action&&!solved&&(e.key==="Enter"||e.key===" ")){e.preventDefault();registerAction();}}}
     onPointerDown={onStagePointerDown} onPointerMove={onStagePointerMove}
     onPointerUp={onStagePointerEnd} onPointerCancel={onStagePointerEnd}
     onDragOver={e=>{if(!solved&&(step.type==="ingredient"||step.type==="tool")){e.preventDefault();e.dataTransfer.dropEffect="move";}}}
     onDrop={e=>{e.preventDefault();if(step.type==="ingredient"||step.type==="tool")choose(e.dataTransfer.getData("text/plain"),step.type);}}>
    {phase==="prep"?
      <div className={"ck-prep-workspace ck-focus-"+prepFocus+(hasBowl&&(hasBoard||hasStrainer)?" ck-has-two":"")}>
       {hasBowl&&<div className={"ck-prop-bowl"+(isMix&&dragging?" ck-bowl-shaking":"")} aria-hidden="true">
        <img className="ck-prop-image" src={vocabImage("bowl")} alt=""/>
        {prepSauce&&<span className={"ck-bowl-sauce-surface ck-sauce-"+sauceColor}><i/><i/></span>}
        {prepFocus==="bowl"&&prepBowlFood.slice(-2).map((id,i)=><img className={"ck-inside-bowl ck-inside-bowl-"+i} src={vocabImage(id)} key={id+i} alt=""/>)}
        {solved&&motion?.kind==="pour"&&<div className={"ck-vessel-pour ck-pour-"+motion.id} key={index} aria-hidden="true">
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-vessel-rings"/>
         </div>}
        {prepMixTool&&!isMix&&!isDip&&<img className="ck-bowl-tool-parked" src={vocabImage(prepMixTool)} alt=""/>}
        {(isMix||isDip)&&<div className={"ck-bowl-active-action"+(dragging?" ck-is-moving":taps>0?" ck-mix-once":"")} key={index+"-"+taps}>
         {(isDip||prepMixTool)&&<img src={vocabImage(isDip?"shrimp":prepMixTool!)} alt=""/>}
         <span className="ck-mix-swirls"><i/><i/><i/></span>
        </div>}
       </div>}
       {hasBoard&&<div className="ck-prop-board" aria-hidden="true">
         <img className="ck-prop-image" src={vocabImage("board")} alt=""/>
         {prepBoardFood.slice(-2).map((id,i)=><img className={"ck-board-ingredient ck-board-ingredient-"+i} key={id+i} src={vocabImage(id)} alt=""/>)}
         {hasKnife&&(!isCut?<img src={vocabImage("knife")} alt="" className="ck-board-knife-parked"/>:
         <img key={index+"-"+taps} src={vocabImage("knife")} alt="" className={"ck-board-knife"+(dragging?" ck-is-cutting":taps>0?" ck-chop-once":"")}/>) }
         {isCut&&Array.from({length:Math.min(taps,5)},(_,i)=><span className={"ck-cut-chunk ck-cut-chunk-"+i} key={i} />)}
       </div>}
       {dish.id==="tempura"&&prepFood.includes("shrimp")&&!hasBoard&&<img className="ck-prep-ingredient-waiting" src={vocabImage("shrimp")} alt="" aria-hidden="true"/>}
       {hasStrainer&&<div className="ck-prop-strainer" aria-hidden="true">
        <img className="ck-prop-image" src={vocabImage(usedTools.has("strainer")?"strainer":"skimmer")} alt=""/>
        {prepFood.filter(id=>id==="noodles"||id==="pasta").map(id=><img className="ck-strainer-food" key={id} src={vocabImage(id)} alt=""/>)}
        {isDrain&&<span className={"ck-drain-droplets"+(dragging?" ck-draining":"")}><i/><i/><i/></span>}
       </div>}
      </div>
    :phase==="cook"?
      <div className={"ck-cook-workspace"+(previousVessel?" ck-multi-cook":"")}>
       {hasBowl&&<div className="ck-prepped-bowl" aria-hidden="true">
        <img src={vocabImage("bowl")} alt=""/>
        {prepSauce&&<span className={"ck-prepped-sauce ck-sauce-"+sauceColor}/>}
       </div>}
       {previousVessel&&<img className="ck-previous-vessel" src={vocabImage(previousVessel)} alt="" aria-hidden="true"/>}
       {placedCookVessel&&<div className={"ck-burner"+(heating||isBubble?" ck-heating":"")}>
        <div className="ck-burner-cross"/>
        <div className={"ck-pot"+((isStir||isMix)&&dragging?" ck-stirring":"")}>
         <div className={"ck-pot-liquid"+(!filledCookSurface?" ck-pot-empty":"")+(isSoupDish&&filledCookSurface?" ck-soup-surface":"")+(cookLiquids.some(s=>s.id==="oil")?" ck-oil-surface":"")+(cookSauce?" ck-seasoned":"")+(isBubble?" ck-liquid-hot":"")}>
          {cookFood.map((id,i)=><img key={id+i} className={"ck-food-in-pot ck-food-"+i} src={vocabImage(id)} alt=""/>)}
          {isStir||isMix?<span className={"ck-stir-track"+(dragging?" ck-rotate-stir":"")}><i/><i/><i/></span>:null}
          {isBubble&&(taps>0||solved)&&<span className="ck-cook-bubbles"><i/><i/><i/><i/><i/></span>}
         </div>
         {solved&&motion?.kind==="pour"&&<div className={"ck-vessel-pour ck-pour-"+motion.id} key={index} aria-hidden="true">
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-vessel-rings"/>
         </div>}
         {stirringTool&&!isStir&&!isMix&&!isDrain&&<img src={vocabImage(stirringTool)} className="ck-cooking-tool-parked" alt=""/>}
        {(isStir||isMix||isDrain)&&((isDrain&&hasStrainer)||(!isDrain&&stirringTool))&&<img src={vocabImage(isDrain?(usedTools.has("strainer")?"strainer":"skimmer"):stirringTool!)} key={index+"-"+taps}
          className={"ck-cooking-utensil"+(dragging?" ck-is-stirring":taps>0?" ck-stir-once":"")+(isDrain?" ck-is-drainer":"")} alt=""/>}
         {isBubble&&(taps>0||solved)&&<div className={"ck-cooking-steam"+(dragging?" ck-steam-active":"")}><i/><i/><i/></div>}
        </div>
        <div className="ck-burner-knob"/>
        <span className="ck-vessel-tag">{vocabulary[placedCookVessel].en}</span>
       </div>}
      </div>
    :(solved&&index===steps.length-1
     ?<div className="ck-serving-stage"><span>✦ READY TO SERVE ✦</span><img src={illustration(dish.id)} alt={dish.name}/></div>
     :<div className={"ck-serve-workspace"+(plateVesselReady?" ck-has-serving-plate":"")}>
       {servingTool&&placedCookVessel&&!isServing&&!isDrain&&!isMix&&<img className="ck-plate-tool-parked" src={vocabImage(servingTool)} alt="" aria-hidden="true"/>}
       {placedCookVessel&&placedCookVessel!=="stonebowl"&&<div className="ck-plate-cook-source" aria-hidden="true">
         <img src={vocabImage(placedCookVessel)} alt=""/>
         {solved&&motion?.kind==="pour"&&<div className={"ck-vessel-pour ck-pour-"+motion.id} key={index}>
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-vessel-rings"/>
         </div>}
       </div>}
       {(plateVesselReady||isServing||isDrain)&&<div className="ck-plating-area" aria-hidden="true">
         <div className={"ck-plating-dish"+(usedTools.has("stonebowl")?" ck-stone-serving":dish.id==="miso-soup"&&usedTools.has("bowl")?" ck-bowl-serving":"")+((isServing||isMix)&&dragging?" ck-plate-moving":"")}>
           {usedTools.has("stonebowl")&&<img src={vocabImage("stonebowl")} className="ck-serving-vessel-image" alt=""/>}
           {dish.id==="miso-soup"&&usedTools.has("bowl")&&<img src={vocabImage("bowl")} className="ck-serving-vessel-image" alt=""/>}
           {platedBase&&<img src={vocabImage(platedBase)} alt="" className="ck-plate-base-food"/>}
           {platedSolids.slice(-4).map((id,i)=><img src={vocabImage(id)} className={"ck-plating-item ck-plating-item-"+i} key={id+"-"+i} alt=""/>)}
           {platedItems.some(id=>sauces.has(id))&&<span className={"ck-plate-condiment ck-sauce-"+sauceColor}/>}
           {(isServing||isMix||isDrain)&&servingTool&&<img className={"ck-serving-utensil"+(dragging?" ck-serving-motion":taps>0?" ck-serving-once":"")} src={vocabImage(servingTool)} alt="" key={index+"-"+taps}/>}
           {isServing&&(taps>0||solved)&&["tom-yum","kimchi-jjigae","miso-soup"].includes(dish.id)&&<span className="ck-serving-soup-fill" style={{transform:"scale("+Math.min(1,(taps+(solved?1:0))/Math.max(1,step.taps)) +")"}}/>}
         </div>
       </div>}
      </div>)
    }
    {solved&&motion&&motion.kind==="drop"&&<div className={"ck-ingredient-entry ck-ingredient-entry-"+phase+(phase==="prep"?" ck-entry-"+prepFocus:phase==="plate"&&placedCookVessel?" ck-entry-plated":"")} key={index+"-"+motion.id} aria-hidden="true">
      <img src={vocabImage(motion.id)} alt=""/>
     </div>}
    {solved&&<div className="ck-success-pop" role="status"><UiIcon name="check" size={17}/>{t.right}</div>}
    {wrong&&!solved&&<div className="ck-wrong-pop" role="status">{t.wrong}</div>}
    {dragging&&cursor&&gesture&&actionArt&&<img className="ck-gesture-cursor" src={vocabImage(actionArt)} alt="" aria-hidden="true" style={{left:cursor.x+"%",top:cursor.y+"%"}}/>}
    {action&&solved&&<div className="ck-action-done" aria-hidden="true"><UiIcon name="check" size={18}/>{step.verb}</div>}
   </div>
   <div className="ck-stage-foot">
    <span>{action?<><UiIcon name="cloud" size={17}/><strong>{step.verb} · {step.verbTh}</strong> {gesture?t.move:t.touch} <b>{taps}/{step.taps}</b></>:<>✧ {t.tip}</>}</span>
    <span>{usedIngredients.size}/{dish.ingredients.length} {t.ingredient} · {usedTools.size}/{dish.tools.length} {t.tools}</span>
   </div>
  </section>

  <div className="ck-bottom-trays">
   <section className={"ck-bottom-tray ck-tray-food"+(step.type==="ingredient"?" ck-tray-active":"")}>
    <div className="ck-tray-title"><strong>01 · {t.ingredient}</strong><span>{usedIngredients.size}/{dish.ingredients.length}</span></div>
    <div className="ck-tray-list">{dish.ingredients.map(id=>{
     const item=vocabulary[id];const used=usedIngredients.has(id);const active=solved&&step.id===id;
     return <button key={id} type="button" className={"ck-tray-card"+(used?" is-used":"")+(active?" is-picked":"")} onClick={()=>choose(id,"ingredient")} draggable={!used&&step.type==="ingredient"&&!solved} onDragStart={e=>e.dataTransfer.setData("text/plain",id)} disabled={used||solved||step.type!=="ingredient"} aria-label={item.en+" · "+item.th}>
      <img src={vocabImage(id)} alt="" draggable={false}/><span lang="en">{item.en}</span><small>{item.th}</small>{used&&<i><UiIcon name="check" size={10}/></i>}
     </button>
    })}</div>
   </section>
   <section className={"ck-bottom-tray ck-tray-tools"+(step.type==="tool"?" ck-tray-active":"")}>
    <div className="ck-tray-title"><strong>02 · {t.tools}</strong><span>{usedTools.size}/{dish.tools.length}</span></div>
    <div className="ck-tray-list">{dish.tools.map(id=>{
     const item=vocabulary[id];const used=usedTools.has(id);const active=solved&&step.id===id;
     return <button key={id} type="button" className={"ck-tray-card"+(used?" is-used":"")+(active?" is-picked":"")} onClick={()=>choose(id,"tool")} draggable={!used&&step.type==="tool"&&!solved} onDragStart={e=>e.dataTransfer.setData("text/plain",id)} disabled={used||solved||step.type!=="tool"} aria-label={item.en+" · "+item.th}>
      <img src={vocabImage(id)} alt="" draggable={false}/><span lang="en">{item.en}</span><small>{item.th}</small>{used&&<i><UiIcon name="check" size={10}/></i>}
     </button>
    })}</div>
   </section>
  </div>
  {soundError&&<p className="ck-speech-error" role="status">{t.audio}</p>}
 </div>;
}