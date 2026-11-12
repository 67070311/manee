"use client";

import {useEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import UiIcon from "./UiIcon";
import EnglishMenuFoodArt,{hasCookingFoodArt} from "./EnglishMenuFoodArt";
import {vocabulary,vocabImage,illustration,type EnglishMenuDish} from "./EnglishMenuData";
import {getCookingSteps,type CookingPhase} from "./EnglishMenuCooking";
import type {Language} from "./Home";

type Props={dish:EnglishMenuDish;language:Language;initialSpoken?:boolean;onBack:()=>void;onFinish:()=>void};
type EffectKind="pour"|"drop"|"tool"|"scoop";
type GestureKind="slice"|"stir"|"toss"|"drain"|"dip"|"serve"|"heat"|"tap";
const gestureFor=(verb:string):GestureKind=>{
 if(/slice|chop|cut|dice/i.test(verb))return "slice";
 if(/drain/i.test(verb))return "drain";
 if(/dip/i.test(verb))return "dip";
 if(/toss|sauté|stir-fry/i.test(verb))return "toss";
 if(/stir|mix|whisk|scramble|dissolve/i.test(verb))return "stir";
 if(/ladle|serve|arrange/i.test(verb))return "serve";
 if(/boil|heat|warm|simmer|fry/i.test(verb))return "heat";
 return "tap";
};
const gestureTips={
 th:{slice:"ลากลงเพื่อหั่นทีละจังหวะ",stir:"ลากวนเป็นวงในภาชนะ",toss:"เขย่ากระทะซ้ายและขวา",drain:"เอียงกระชอนสลับซ้ายขวา",dip:"จุ่มลงในชามแป้ง",serve:"ลากเครื่องครัวเพื่อตักหรือจัดจาน",heat:"กดค้างที่เตาเพื่อเพิ่มความร้อน",tap:"แตะบริเวณอาหาร"},
 en:{slice:"Swipe down to make each cut",stir:"Draw circles to stir the food",toss:"Shake the pan left and right",drain:"Tilt the strainer side to side",dip:"Dip the food into the batter",serve:"Drag to scoop or arrange the food",heat:"Press and hold to heat the stove",tap:"Touch the food"}
} as const;
const pasteIngredients=new Set(["tamarind","miso","gochujang"]);
const liquids=new Set(["fishsauce","water","oil","broth","dashi","sauce"]);
const sauces=new Set([...liquids,"tamarind","miso","gochujang"]);
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
 const [wrongId,setWrongId]=useState<string|null>(null);
 const [taps,setTaps]=useState(0);
 const [soundError,setSoundError]=useState(false);
 const [autoVoice,setAutoVoice]=useState(true);
 const [motion,setMotion]=useState<{id:string;kind:EffectKind}|null>(null);
 const [cursor,setCursor]=useState<{x:number;y:number}|null>(null);
 const [dragging,setDragging]=useState(false);
 const [trail,setTrail]=useState<{x:number;y:number}[]>([]);
 const [heatProgress,setHeatProgress]=useState(0);
 const pointer=useRef({active:false,lastX:0,lastY:0,travel:0,count:0,heatTime:0,lastAngle:null as number|null,strokeDirection:0,strokeArmed:true});
 const heatTimer=useRef<number|null>(null);
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
 const gestureKind:GestureKind=action?gestureFor(step.verb):"tap";
 const gesture=action&&gestureKind!=="heat"&&gestureKind!=="tap";
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
 const cutIngredient=prepFood.slice(-1)[0]??"default";
 const actionPercent=action?(gestureKind==="heat"?heatProgress:Math.round(100*taps/Math.max(1,step.taps))):0;
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
 const foodHeated=cookedActions.some(s=>/stir-fry|sauté|fry|boil|simmer|warm|toss|scramble/i.test(s.verb));
 const foodIsCooking=action&&phase==="cook"&&(isStir||isBubble)&&(taps>0||dragging);
 const mixedIntoPan=cookedActions.some(s=>/toss/i.test(s.verb));
 const simmeredPrep=cookedActions.some(s=>/simmer|boil|sauté/i.test(s.verb));
 const deepFriedPrep=dish.id==="tempura"&&cookedActions.some(s=>/fry/i.test(s.verb));
 const cookFoodIds=ingredientSteps.filter(s=>s.phase==="cook"&&!sauces.has(s.id!)).map(s=>s.id!);
 // Prepared items move into the pan when their cooking step STARTS, not after it ends.
 const activeCookVerb=phase==="cook"&&action?step.verb:"";
 const fryingNow=/fry/i.test(activeCookVerb);
 const tossingNow=/toss/i.test(activeCookVerb);
 const simmeringNow=/boil|simmer|sauté|warm/i.test(activeCookVerb);
 const fromPrep=dish.id==="tempura"&&(deepFriedPrep||fryingNow)?["shrimp","sweetpotato"]:
  (mixedIntoPan||tossingNow)?["noodles","pasta"]:
  dish.id==="tom-yum"&&(simmeredPrep||simmeringNow)?["lemongrass","galangal","mushroom"]:
  dish.id==="kimchi-jjigae"&&(simmeredPrep||simmeringNow)?["tofu","mushroom"]:
  dish.id==="bibimbap"&&(simmeredPrep||simmeringNow)?["carrot","spinach"]:[];
 const cookFood=Array.from(new Set([...cookFoodIds,...fromPrep.filter(id=>ingredientSteps.some(s=>s.id===id))])).slice(-5);
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
  const ms=motion?.kind==="pour"||motion?.kind==="scoop"?2000:motion?.kind==="drop"?1180:motion?.kind==="tool"?930:action?1200:850;
  const handle=window.setTimeout(()=>{
   if(index===steps.length-1){onFinish();return;}
   if(heatTimer.current){window.clearInterval(heatTimer.current);heatTimer.current=null;}
   setIndex(v=>v+1);setSolved(false);setWrong(false);setWrongId(null);setMotion(null);setTaps(0);setCursor(null);setTrail([]);setDragging(false);setHeatProgress(0);
   pointer.current={active:false,lastX:0,lastY:0,travel:0,count:0,heatTime:0,lastAngle:null,strokeDirection:0,strokeArmed:true};
  },ms);
  return ()=>window.clearTimeout(handle);
 },[solved,index,steps.length,motion,step,action,onFinish]);
 useEffect(()=>()=>{if(heatTimer.current)window.clearInterval(heatTimer.current);},[]);
 useEffect(()=>{if(!wrongId)return;const timer=window.setTimeout(()=>setWrongId(null),650);return()=>window.clearTimeout(timer);},[wrongId]);

 const speak=()=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)){setSoundError(true);return;}
  try{setSoundError(false);window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(step.en);voice.lang="en-US";voice.rate=.85;window.speechSynthesis.speak(voice);}catch{setSoundError(true);}
 };
 const choose=(id:string,kind:"ingredient"|"tool")=>{
  if(solved||!step||step.type!==kind)return;
  if(id!==step.id){setWrong(true);setWrongId(id);return;}
  setWrong(false);setWrongId(null);
  setMotion({id,kind:kind==="tool"?"tool":liquids.has(id)?"pour":pasteIngredients.has(id)?"scoop":"drop"});
  setSolved(true);
 };
 const registerAction=()=>{
  if(!action||solved||!step)return;
  if(pointer.current.count>=step.taps)return;
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
  if(gestureKind==="tap"){registerAction();return;}
  const rect=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-rect.left)/rect.width*100,y=(e.clientY-rect.top)/rect.height*100;
  pointer.current.active=true;
  pointer.current.lastX=e.clientX;pointer.current.lastY=e.clientY;pointer.current.travel=0;
  pointer.current.lastAngle=null;pointer.current.strokeArmed=true;pointer.current.strokeDirection=0;
  setCursor({x,y});setTrail([{x,y}]);setDragging(true);
  e.currentTarget.setPointerCapture(e.pointerId);
  if(gestureKind==="heat"){
   if(heatTimer.current)window.clearInterval(heatTimer.current);
   heatTimer.current=window.setInterval(()=>{
    if(!pointer.current.active||pointer.current.count>=step.taps){
     if(heatTimer.current)window.clearInterval(heatTimer.current);
     heatTimer.current=null;return;
    }
    pointer.current.heatTime+=50;
    const goal=Math.max(1,step.taps)*550;
    const pct=Math.min(100,Math.round(pointer.current.heatTime/goal*100));
    setHeatProgress(pct);
    setTaps(Math.min(step.taps,Math.floor(step.taps*pct/100)));
    if(pct>=100){
     pointer.current.count=step.taps-1;registerAction();
     if(heatTimer.current)window.clearInterval(heatTimer.current);
     heatTimer.current=null;
    }
   },50);
  }
 };
 const onStagePointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!pointer.current.active||solved||!action)return;
  if(!inActionZone(e)){
   if(heatTimer.current){window.clearInterval(heatTimer.current);heatTimer.current=null;}
   pointer.current.active=false;setDragging(false);setCursor(null);setTrail([]);
   return;
  }
  const rect=e.currentTarget.getBoundingClientRect();
  const x=Math.max(2,Math.min(98,(e.clientX-rect.left)/rect.width*100));
  const y=Math.max(2,Math.min(98,(e.clientY-rect.top)/rect.height*100));
  const dx=e.clientX-pointer.current.lastX,dy=e.clientY-pointer.current.lastY;
  const dist=Math.hypot(dx,dy);
  setCursor({x,y});
  if(gestureKind!=="heat"&&dist>2)setTrail(prev=>[...prev.slice(-9),{x,y}]);
  if(gestureKind==="stir"){
   const cx=rect.left+rect.width*(phase==="prep"?(hasBowl&&hasBoard?.57:.5):phase==="cook"?(previousVessel?.58:.5):.66);
   const cy=rect.top+rect.height*.5;
   const radius=Math.hypot(e.clientX-cx,e.clientY-cy);
   const angle=Math.atan2(e.clientY-cy,e.clientX-cx);
   if(pointer.current.lastAngle!==null&&radius>18&&radius<Math.min(rect.width,rect.height)*.45){
    let turn=angle-pointer.current.lastAngle;
    while(turn>Math.PI)turn-=Math.PI*2;
    while(turn< -Math.PI)turn+=Math.PI*2;
    if(Math.abs(turn)<.85)pointer.current.travel+=Math.abs(turn);
    if(pointer.current.travel>=Math.PI*.78){pointer.current.travel-=Math.PI*.78;registerAction();}
   }
   pointer.current.lastAngle=angle;
  }else if(gestureKind==="slice"||gestureKind==="dip"){
   if(dy>3&&Math.abs(dy)>Math.abs(dx)*.85&&pointer.current.strokeArmed){
    pointer.current.travel+=dy;
    if(pointer.current.travel>=(gestureKind==="slice"?32:38)){
     pointer.current.travel=0;pointer.current.strokeArmed=false;registerAction();
    }
   }else if(dy< -9){pointer.current.strokeArmed=true;pointer.current.travel=0;}
  }else if(gestureKind==="toss"||gestureKind==="drain"){
   if(Math.abs(dx)>Math.abs(dy)*1.1&&Math.abs(dx)>3){
    const direction=Math.sign(dx);
    if(direction!==pointer.current.strokeDirection){
     pointer.current.strokeDirection=direction;pointer.current.travel=0;pointer.current.strokeArmed=true;
    }
    if(pointer.current.strokeArmed){
     pointer.current.travel+=Math.abs(dx);
     if(pointer.current.travel>=52){
      pointer.current.strokeArmed=false;pointer.current.travel=0;registerAction();
     }
    }
   }
  }else if(gestureKind==="serve"){
   if(dist>3){pointer.current.travel+=dist;if(pointer.current.travel>=75){pointer.current.travel=0;registerAction();}}
  }
  pointer.current.lastX=e.clientX;pointer.current.lastY=e.clientY;
 };
 const onStagePointerEnd=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(heatTimer.current){window.clearInterval(heatTimer.current);heatTimer.current=null;}
  pointer.current.active=false;pointer.current.travel=0;pointer.current.lastAngle=null;setDragging(false);setCursor(null);setTrail([]);
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 };
 if(!step)return <div className="ck-shell"><button onClick={onBack}>{t.back}</button></div>;

 const stageCounts={prep:steps.filter(s=>s.phase==="prep").length,cook:steps.filter(s=>s.phase==="cook").length,plate:steps.filter(s=>s.phase==="plate").length};


 const actionArt=isDip?"shrimp":isServing?servingTool:isCut&&hasKnife?"knife":
  /whisk/i.test(step.verb)&&usedTools.has("whisk")?"whisk":
  isDrain?(usedTools.has("strainer")?"strainer":usedTools.has("skimmer")?"skimmer":null):
  /ladle/i.test(step.verb)&&usedTools.has("ladle")?"ladle":stirringTool;
 const stageNames:{[key in CookingPhase]:string}={prep:t.prep,cook:t.cook,plate:t.plate};
 const nextName=step.id?vocabulary[step.id]:null;
 const nextHint=solved?
  (language==="th"?"เสร็จแล้ว กำลังไปขั้นต่อไป":"Done! Moving to the next step"):
  step.type==="ingredient"?(language==="th"?"แตะรูปวัตถุดิบด้านล่าง":"Tap the ingredient in the bottom tray"):
  step.type==="tool"?(language==="th"?"แตะรูปอุปกรณ์ด้านล่าง":"Tap the kitchenware in the bottom tray"):
  gestureTips[language][gestureKind];
 const nextTitle=solved?(language==="th"?"ทำสำเร็จ":"Well done"):
  nextName?nextName.en:(step.verb+" · "+step.verbTh);
 const guideIcon=solved?"check":step.type==="ingredient"?"leaf":step.type==="tool"?"grid":gestureKind==="heat"?"flame":gestureKind==="slice"?"brush":"cloud";
 return <div className="ck-shell">
  <header className="ck-top">
   <button type="button" className="ck-back" onClick={onBack}><UiIcon name="arrow-left" size={16}/>{t.back}</button>
   <div className="ck-top-name"><span className="ck-top-kicker">ENGLISH MENU • {t.home}</span><strong>{dish.name}</strong></div>
   <div className="ck-top-progress"><span><b>{index+1}</b> / {steps.length}</span><div className="ck-progress-track" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={index+(solved?1:0)}><i style={{width:progress+"%"}}/></div></div>
  </header>

  <section className="ck-command" aria-label={t.pick}>
   <div className="ck-command-number">{String(index+1).padStart(2,"0")}</div>
   <div className="ck-command-copy"><span className="ck-command-kicker">{stageNames[phase]} <span><UiIcon name="star" size={12}/></span> {t.step} {index+1} {t.of} {steps.length}</span><h1 lang="en">{step.en}</h1><p lang="th">{step.th}</p></div>
   <div className="ck-audio-controls">
    <span className="ck-auto-audio-label">{language==="th"?"ฟังคำสั่งอัตโนมัติ":"Listen to each step"}</span>
    <button type="button" className="ck-speak" onClick={speak} aria-label={t.listen} title={t.listen}><UiIcon name="volume-2" size={21}/></button>
    <button type="button" className={"ck-auto-voice-toggle"+(autoVoice?" is-on":"")} onClick={()=>setAutoVoice(v=>!v)} aria-pressed={autoVoice} title={language==="th"?"เปิดหรือปิดการอ่านอัตโนมัติ":"Toggle automatic narration"}>{autoVoice?"ON":"OFF"}</button>
   </div>
  </section>

  <section className="ck-stage" aria-label={t.hot}>
   <div className="ck-stage-topline"><span><UiIcon name="flower" size={13}/> {t.home}</span><div className="ck-stage-milestones">{(["prep","cook","plate"] as CookingPhase[]).map(p=><span key={p} className={(phase===p?"is-active ":"")+(completed.filter(s=>s.phase===p).length>=stageCounts[p]?"is-done":"")}>{stageNames[p]} <small>{completed.filter(s=>s.phase===p).length}/{stageCounts[p]}</small></span>)}</div></div>
   <div className={"ck-stage-world ck-stage-"+phase+(solved?" ck-stage-success":"")+(action?" ck-interactive ck-action-"+gestureKind:"")+(dragging?" ck-gesture-active":"")+(dragging&&gestureKind==="heat"?" ck-holding-heat":"")}
     style={{"--ck-pointer-x":(cursor?.x??50)+"%","--ck-pointer-y":(cursor?.y??50)+"%"} as CSSProperties}
     tabIndex={action&&!solved?0:undefined} role={action?"button":undefined}
     aria-label={action?step.verb+" · "+gestureTips[language][gestureKind]:undefined}
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
        {solved&&motion&&(motion.kind==="pour"||motion.kind==="scoop")&&<div className={"ck-vessel-pour ck-pour-"+motion.id+(motion.kind==="scoop"?" ck-paste-pour":"")} key={index} aria-hidden="true">
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-pour-droplets"><i/><i/><i/><i/><i/></span><span className="ck-vessel-rings"><i/><i/><i/></span>
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
         {isCut&&Array.from({length:Math.min(taps*2,6)},(_,i)=><span className={"ck-cut-chunk ck-cut-chunk-"+i+" ck-chunk-"+cutIngredient} key={i} />)}
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
          {cookFood.map((id,i)=>hasCookingFoodArt(id)
             ?<EnglishMenuFoodArt key={id+i} id={id} cooked={foodHeated||foodIsCooking} fried={dish.id==="tempura"&&(deepFriedPrep||(fryingNow&&taps>0))} className={"ck-food-in-pot ck-food-"+i+" ck-food-"+id}/>
             :<img key={id+i} className={"ck-food-in-pot ck-food-"+i} src={vocabImage(id)} alt=""/>)}
          {isStir||isMix?<span className={"ck-stir-track"+(dragging?" ck-rotate-stir":"")}><i/><i/><i/></span>:null}
          {isBubble&&(taps>0||solved||heatProgress>10||dragging)&&<span className="ck-cook-bubbles"><i/><i/><i/><i/><i/></span>}
          {(isStir||isBubble)&&(dragging||foodIsCooking)&&<span className="ck-pan-sizzle" aria-hidden="true"><i/><i/><i/><i/><i/><i/></span>}
         </div>
         {solved&&motion&&(motion.kind==="pour"||motion.kind==="scoop")&&<div className={"ck-vessel-pour ck-pour-"+motion.id+(motion.kind==="scoop"?" ck-paste-pour":"")} key={index} aria-hidden="true">
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-pour-droplets"><i/><i/><i/><i/><i/></span><span className="ck-vessel-rings"><i/><i/><i/></span>
         </div>}
         {stirringTool&&!isStir&&!isMix&&!isDrain&&<img src={vocabImage(stirringTool)} className="ck-cooking-tool-parked" alt=""/>}
        {(isStir||isMix||isDrain)&&((isDrain&&hasStrainer)||(!isDrain&&stirringTool))&&<img src={vocabImage(isDrain?(usedTools.has("strainer")?"strainer":"skimmer"):stirringTool!)} key={index+"-"+taps}
          className={"ck-cooking-utensil"+(dragging?" ck-is-stirring":taps>0?" ck-stir-once":"")+(isDrain?" ck-is-drainer":"")} alt=""/>}
         {isBubble&&(taps>0||solved||heatProgress>10||dragging)&&<div className={"ck-cooking-steam"+(dragging?" ck-steam-active":"")}><i/><i/><i/></div>}
        </div>
        <div className={"ck-burner-knob"+(dragging&&gestureKind==="heat"?" ck-knob-active":"")}/>
        <span className="ck-vessel-tag">{vocabulary[placedCookVessel].en}</span>
       </div>}
      </div>
    :(solved&&index===steps.length-1
     ?<div className="ck-serving-stage"><span className="ck-ready-label"><UiIcon name="star" size={15}/> READY TO SERVE <UiIcon name="star" size={15}/></span><img src={illustration(dish.id)} alt={dish.name}/></div>
     :<div className={"ck-serve-workspace"+(plateVesselReady?" ck-has-serving-plate":"")}>
       {servingTool&&placedCookVessel&&!isServing&&!isDrain&&!isMix&&<img className="ck-plate-tool-parked" src={vocabImage(servingTool)} alt="" aria-hidden="true"/>}
       {placedCookVessel&&placedCookVessel!=="stonebowl"&&<div className="ck-plate-cook-source" aria-hidden="true">
         <img src={vocabImage(placedCookVessel)} alt=""/>
         {solved&&motion&&(motion.kind==="pour"||motion.kind==="scoop")&&<div className={"ck-vessel-pour ck-pour-"+motion.id+(motion.kind==="scoop"?" ck-paste-pour":"")} key={index}>
          <img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-pour-droplets"><i/><i/><i/><i/><i/></span><span className="ck-vessel-rings"><i/><i/><i/></span>
         </div>}
       </div>}
       {(plateVesselReady||isServing||isDrain)&&<div className="ck-plating-area" aria-hidden="true">
         <div className={"ck-plating-dish"+(usedTools.has("stonebowl")?" ck-stone-serving":dish.id==="miso-soup"&&usedTools.has("bowl")?" ck-bowl-serving":"")+((isServing||isMix)&&dragging?" ck-plate-moving":"")}>
           {usedTools.has("stonebowl")&&<img src={vocabImage("stonebowl")} className="ck-serving-vessel-image" alt=""/>}
           {dish.id==="miso-soup"&&usedTools.has("bowl")&&<img src={vocabImage("bowl")} className="ck-serving-vessel-image" alt=""/>}
           {platedBase&&<img src={vocabImage(platedBase)} alt="" className="ck-plate-base-food"/>}
            {solved&&motion&&(motion.kind==="pour"||motion.kind==="scoop")&&<div className={"ck-vessel-pour ck-pour-"+motion.id+(motion.kind==="scoop"?" ck-paste-pour":"")} key={index} aria-hidden="true"><img src={vocabImage(motion.id)} alt=""/><span className="ck-vessel-stream"/><span className="ck-pour-droplets"><i/><i/><i/><i/><i/></span><span className="ck-vessel-rings"><i/><i/><i/></span></div>}
           {platedSolids.slice(-4).map((id,i)=>hasCookingFoodArt(id)
             ?<EnglishMenuFoodArt id={id} cooked={true} fried={dish.id==="tempura"&&id==="shrimp"&&deepFriedPrep} className={"ck-plating-item ck-plating-item-"+i} key={id+"-"+i}/>
             :<img src={vocabImage(id)} className={"ck-plating-item ck-plating-item-"+i} key={id+"-"+i} alt=""/>)}
           {platedItems.some(id=>sauces.has(id))&&<span className={"ck-plate-condiment ck-sauce-"+sauceColor}/>}
           {(isServing||isMix||isDrain)&&servingTool&&<img className={"ck-serving-utensil"+(dragging?" ck-serving-motion":taps>0?" ck-serving-once":"")} src={vocabImage(servingTool)} alt="" key={index+"-"+taps}/>}
           {isDrain&&dragging&&<span className="ck-serving-drips" aria-hidden="true"><i/><i/><i/><i/></span>}
            {isMix&&dragging&&<span className="ck-plating-mix-rings" aria-hidden="true"><i/><i/></span>}
            {isServing&&(taps>0||solved)&&["tom-yum","kimchi-jjigae","miso-soup"].includes(dish.id)&&<span className="ck-serving-soup-fill" style={{transform:"scale("+Math.min(1,(taps+(solved?1:0))/Math.max(1,step.taps)) +")"}}/>}
         </div>
       </div>}
      </div>)
    }
    {solved&&motion&&motion.kind==="drop"&&<div className={"ck-ingredient-entry ck-ingredient-entry-"+phase+(phase==="prep"?" ck-entry-"+prepFocus:phase==="plate"&&placedCookVessel?" ck-entry-plated":"")} key={index+"-"+motion.id} aria-hidden="true">
      {hasCookingFoodArt(motion.id)?<EnglishMenuFoodArt id={motion.id} fried={dish.id==="tempura"&&deepFriedPrep}/>:<img src={vocabImage(motion.id)} alt=""/>}
     </div>}
    <div className={"ck-step-visual-guide"+(solved?" is-done":"")} aria-live="polite">
       <span className="ck-step-visual-icon">
        {nextName&&!solved?<img className="ck-step-visual-thumb" src={vocabImage(nextName.id)} alt=""/>:<UiIcon name={guideIcon} size={18}/>}
       </span>
       <span className="ck-step-visual-copy"><strong>{nextTitle}</strong><small>{nextHint}</small></span>
       {!solved&&step.type!=="action"&&<UiIcon name="arrow-down" size={17}/>}
      </div>
    {wrong&&!solved&&<div className="ck-wrong-pop" role="status">{t.wrong}</div>}
    {dragging&&trail.length>1&&gesture&&<svg className="ck-gesture-trail" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={trail.map(p=>p.x+","+p.y).join(" ")}/></svg>}
     {dragging&&cursor&&gesture&&actionArt&&<img className={"ck-gesture-cursor ck-cursor-"+gestureKind} src={vocabImage(actionArt)} alt="" aria-hidden="true" style={{left:cursor.x+"%",top:cursor.y+"%"}}/>}
    {action&&solved&&<div className="ck-action-done" aria-hidden="true"><UiIcon name="check" size={18}/>{step.verb}</div>}
   </div>
   <div className="ck-stage-foot">
    <span>{action?<><UiIcon name={gestureKind==="heat"?"flame":gestureKind==="slice"?"brush":"cloud"} size={17}/><strong>{step.verb} · {step.verbTh}</strong><span className="ck-action-progress-track" aria-hidden="true"><i style={{width:actionPercent+"%"}}/></span><b>{gestureKind==="heat"?actionPercent+"%":taps+"/"+step.taps}</b></>:<><UiIcon name="star" size={13}/> {t.tip}</>}</span>
    <span>{usedIngredients.size}/{dish.ingredients.length} {t.ingredient} · {usedTools.size}/{dish.tools.length} {t.tools}</span>
   </div>
  </section>

  <div className="ck-bottom-trays">
   <section className={"ck-bottom-tray ck-tray-food"+(step.type==="ingredient"?" ck-tray-active":"")}>
    <div className="ck-tray-title"><strong>01 · {t.ingredient}</strong><span>{usedIngredients.size}/{dish.ingredients.length}</span></div>
    <div className="ck-tray-list">{dish.ingredients.map(id=>{
     const item=vocabulary[id];const used=usedIngredients.has(id);const active=solved&&step.id===id;const next=!solved&&step.type==="ingredient"&&step.id===id;
     return <button key={id} type="button" className={"ck-tray-card"+(used?" is-used":"")+(active?" is-picked":"")+(wrongId===id?" is-wrong":"")+(next?" is-next":"")} onClick={()=>choose(id,"ingredient")} draggable={!used&&step.type==="ingredient"&&!solved} onDragStart={e=>e.dataTransfer.setData("text/plain",id)} disabled={used||solved||step.type!=="ingredient"} aria-label={item.en+" · "+item.th}>
      <img src={vocabImage(id)} alt="" draggable={false}/><span lang="en">{item.en}</span><small>{item.th}</small>{used&&<i><UiIcon name="check" size={10}/></i>}
     </button>
    })}</div>
   </section>
   <section className={"ck-bottom-tray ck-tray-tools"+(step.type==="tool"?" ck-tray-active":"")}>
    <div className="ck-tray-title"><strong>02 · {t.tools}</strong><span>{usedTools.size}/{dish.tools.length}</span></div>
    <div className="ck-tray-list">{dish.tools.map(id=>{
     const item=vocabulary[id];const used=usedTools.has(id);const active=solved&&step.id===id;const next=!solved&&step.type==="tool"&&step.id===id;
     return <button key={id} type="button" className={"ck-tray-card"+(used?" is-used":"")+(active?" is-picked":"")+(wrongId===id?" is-wrong":"")+(next?" is-next":"")} onClick={()=>choose(id,"tool")} draggable={!used&&step.type==="tool"&&!solved} onDragStart={e=>e.dataTransfer.setData("text/plain",id)} disabled={used||solved||step.type!=="tool"} aria-label={item.en+" · "+item.th}>
      <img src={vocabImage(id)} alt="" draggable={false}/><span lang="en">{item.en}</span><small>{item.th}</small>{used&&<i><UiIcon name="check" size={10}/></i>}
     </button>
    })}</div>
   </section>
  </div>
  {soundError&&<p className="ck-speech-error" role="status">{t.audio}</p>}
 </div>;
}