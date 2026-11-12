"use client";
import {useEffect,useState,useRef} from "react";
import Link from "next/link";
import UiIcon from "./UiIcon";
import EnglishMenuKitchen from "./EnglishMenuKitchen";
import {getCookingSteps} from "./EnglishMenuCooking";
import usePortfolioLanguage from "./usePortfolioLanguage";
import type {Language} from "./Home";
import {countries,dishes,vocabulary,illustration,vocabImage,type EnglishMenuDish,type CountryId} from "./EnglishMenuData";

type Screen="catalog"|"vocabulary"|"recipe"|"cook"|"complete";
const countryCodes:Record<CountryId,string>={thailand:"TH",korea:"KR",japan:"JP",italy:"IT"};
const tx={
 th:{
  return:"กลับ Playground",welcome:"WELCOME TO OUR KITCHEN",daily:"เมนูพิเศษประจำวัน",view:"ดูสูตรอาหาร",allMenu:"เมนูอาหารทั้งหมด",ingredients:"วัตถุดิบ",kitchenware:"เครื่องครัว",discover:"เลือกเมนูอาหารจากทั่วโลก",hint:"เลือกประเทศและเมนูที่สนใจเพื่อเรียนภาษาอังกฤษผ่านอาหาร",dishCount:"เมนู",wordCount:"คำ",items:"รายการ",tapDish:"ดูสูตรและคำศัพท์",learn:"เรียนศัพท์ผ่านภาพและสูตรอาหาร",stepTitle:"COOKING STEPS",listen:"ฟังเสียง",recipeBack:"เลือกเมนูอาหาร",english:"คำศัพท์ภาษาอังกฤษ",meaning:"คำแปลไทย",clickListen:"แตะภาพหรือชื่อศัพท์เพื่อฟังการออกเสียง",goCook:"ลองทำอาหารกัน!",miniDesc:"อ่านคำสั่งภาษาอังกฤษ เลือกวัตถุดิบ และใช้เครื่องครัวให้ครบทุกขั้นตอน",ingredientsIn:"INGREDIENTS",toolsIn:"KITCHENWARE",wordHint:"คำศัพท์ที่ควรรู้",step:"ขั้นที่",of:"จาก",choose:"ลากหรือแตะวัตถุดิบให้ตรงกับคำสั่ง",act:"แตะเพื่อทำขั้นตอนนี้",wrong:"ยังไม่ถูกนะ ลองอีกครั้ง",right:"ถูกต้องแล้ว เก่งมาก!",showThai:"ดูคำแปลภาษาไทย",hideThai:"ซ่อนคำแปล",next:"ขั้นตอนต่อไป",serve:"เสิร์ฟอาหาร",completed:"ทำอาหารสำเร็จ!",completeDesc:"ทำตามคำสั่งภาษาอังกฤษครบแล้ว เยี่ยมเลย!",again:"เล่นอีกครั้ง",chooseOther:"เลือกเมนูอื่น",finishWords:"คำศัพท์ที่ได้ใช้",backToRecipe:"กลับไปดูสูตร",photoNote:"illustrated recipe",audioUnsupported:"เบราว์เซอร์นี้ไม่รองรับเสียงอ่าน",total:"เรียนรู้ได้ทุกเมนู",min:"นาที"
 },
 en:{
  return:"Back to Playground",welcome:"WELCOME TO OUR KITCHEN",daily:"TODAY'S SPECIAL",view:"Explore the recipe",allMenu:"Food Menu",ingredients:"Ingredients",kitchenware:"Kitchenware",discover:"Discover dishes from around the world",hint:"Choose a country and a dish to learn English through cooking",dishCount:"dishes",wordCount:"words",items:"items",tapDish:"Explore recipe & words",learn:"Learn English through food",stepTitle:"COOKING STEPS",listen:"Listen",recipeBack:"All recipes",english:"English vocabulary",meaning:"Thai translation",clickListen:"Tap a picture or word to hear its pronunciation",goCook:"Let's try cooking!",miniDesc:"Read the English instructions, choose every ingredient, and use the right kitchen tools",ingredientsIn:"INGREDIENTS",toolsIn:"KITCHENWARE",wordHint:"WORDS TO KNOW",step:"Step",of:"of",choose:"Drag or tap the ingredient mentioned above",act:"Tap to perform this action",wrong:"Not quite. Give it another try!",right:"Great job! That's correct.",showThai:"Show Thai translation",hideThai:"Hide translation",next:"Next step",serve:"Serve the dish",completed:"You did it!",completeDesc:"You finished your recipe in English. Delicious work!",again:"Play again",chooseOther:"Choose another dish",finishWords:"Words you used",backToRecipe:"Back to recipe",photoNote:"illustrated recipe",audioUnsupported:"Speech playback is not supported in your browser",total:"New things to learn",min:"min"
 }
} as const;
const countryName=(id:CountryId,language:Language)=>countries.find(c=>c.id===id)?.[language]??id;

export default function EnglishMenuExperience({initialLanguage="th"}:{initialLanguage?:Language}){
 const {language,setLanguage}=usePortfolioLanguage(initialLanguage);
 const t=tx[language];
 const [screen,setScreen]=useState<Screen>("catalog");
 const [featured,setFeatured]=useState(0);
 const [dishId,setDishId]=useState("pad-thai");
 const [lastWord,setLastWord]=useState<string|null>(null);
 const [vocabKind,setVocabKind]=useState<"ingredient"|"tool">("ingredient");
 const [vocabQuery,setVocabQuery]=useState("");
 const [completed,setCompleted]=useState<string[]>([]);
 const [audioError,setAudioError]=useState(false);
 const [initialSpeechPrimed,setInitialSpeechPrimed]=useState(false);
 const catalogRef=useRef<HTMLElement>(null);
 const featuredDishes=[dishes[0],dishes[2],dishes[4],dishes[6]];
 const selected=dishes.find(d=>d.id===dishId)??dishes[0];
 const visibleWords=Object.values(vocabulary).filter(word=>word.kind===vocabKind&&(word.en.toLocaleLowerCase().includes(vocabQuery.trim().toLocaleLowerCase())||word.th.includes(vocabQuery.trim())));

 useEffect(()=>{
  try{const saved=JSON.parse(localStorage.getItem("english-menu-completed")||"[]");if(Array.isArray(saved))setCompleted(saved.filter(v=>typeof v==="string"))}catch{}
 },[]);
 const toTop=()=>window.scrollTo({top:0,behavior:"smooth"});
 const openRecipe=(dish:EnglishMenuDish)=>{setDishId(dish.id);setScreen("recipe");setLastWord(null);toTop()};
 const startCooking=()=>{
  const canSpeak=typeof window!=="undefined"&&"speechSynthesis" in window;
  setInitialSpeechPrimed(canSpeak);
  if(canSpeak)speak(getCookingSteps(selected)[0]?.en??selected.name);
  setScreen("cook");toTop();
 };
 const playFeatured=()=>{
  const chosen=featuredDishes[featured];
  const canSpeak=typeof window!=="undefined"&&"speechSynthesis" in window;
  setInitialSpeechPrimed(canSpeak);
  if(canSpeak)speak(getCookingSteps(chosen)[0]?.en??chosen.name);
  setDishId(chosen.id);setScreen("cook");toTop();
 };
 const speak=(text:string)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)){setAudioError(true);return}
  try{setAudioError(false);window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.85;window.speechSynthesis.speak(u)}catch{setAudioError(true)}
 };
 const backCatalog=()=>{setScreen("catalog");setLastWord(null);toTop()};
 const openVocabulary=(kind:"ingredient"|"tool")=>{setVocabKind(kind);setVocabQuery("");setLastWord(null);setScreen("vocabulary");toTop()};
 const jump=(hash:string)=>document.querySelector(hash)?.scrollIntoView({behavior:"smooth",block:"start"});
 const showWord=(id:string)=>{setLastWord(id);speak(vocabulary[id].en)};
 const renderWord=(id:string)=>{const word=vocabulary[id];return <button type="button" className={"menu-word-card"+(lastWord===id?" selected":"")} key={id} onClick={()=>showWord(id)} aria-label={word.en+", "+word.th}>
   <img src={vocabImage(id)} alt="" loading="lazy" decoding="async"/>
   <strong lang="en">{word.en}</strong><small>{word.th}</small><span className="menu-sound"><UiIcon name="volume-2" size={14}/></span>
  </button>};
 const recipeCountry=selected.country;
 return <div className="menu-game" lang={language}>
  <header className="menu-greenbar"><div className="menu-greenbar-inner">
   <Link href="/playground" className="menu-green-back" aria-label={t.return}><UiIcon name="arrow-left" size={23}/></Link>
   <div className="menu-brand"><span className="menu-brand-symbol"><UiIcon name="flower" size={31}/></span><span><b>English</b><small>Menu</small></span></div>
   <span className="menu-green-subtitle">{t.welcome}</span>
   <div className="menu-language" role="group" aria-label="Language"><button type="button" className={language==="th"?"active":""} onClick={()=>setLanguage("th")}>TH</button><button type="button" className={language==="en"?"active":""} onClick={()=>setLanguage("en")}>EN</button></div>
  </div></header>
  <main className="menu-frame">
   {screen==="catalog"&&<div className="menu-paper menu-fresh-home">
    <section className="menu-fresh-hero" aria-label={language==="th"?"เริ่มเล่นเกม English Menu":"Start English Menu"}>
      <div className="menu-fresh-copy">
        <div className="menu-fresh-mark"><span className="menu-fresh-logo"><UiIcon name="flower" size={28}/></span><span>ENGLISH MENU <small>THE LITTLE COOKBOOK GAME</small></span></div>
        <span className="menu-fresh-kicker">PICK A DISH · LEARN WORDS · COOK!</span>
        <h1>{language==="th"?<>เล่นทำอาหาร<br/><em>ฝึกภาษาอังกฤษ</em></>:<>Cook something.<br/><em>Learn English!</em></>}</h1>
        <p>{language==="th"?"เลือกเมนูที่ชอบ ฟังคำสั่งภาษาอังกฤษ แล้วแตะวัตถุดิบหรือขยับเครื่องครัวเพื่อทำอาหารทีละขั้น ทำถูกแล้วเกมจะไปต่อเอง":"Choose your favorite dish, listen to English instructions and prepare the food by tapping ingredients or moving kitchen tools. Each step advances automatically."}</p>
        <div className="menu-fresh-actions">
          <button type="button" className="menu-fresh-play" onClick={playFeatured}><UiIcon name="cloud" size={19}/>{language==="th"?"เริ่มทำอาหารเลย":"Let's start cooking"}<UiIcon name="arrow-right" size={19}/></button>
          <button type="button" className="menu-fresh-browse" onClick={()=>jump("#menu-country-list")}>{language==="th"?"เลือกเมนูอื่น":"Browse recipes"}<UiIcon name="arrow-down" size={17}/></button>
        </div>
        <div className="menu-fresh-guide" aria-label={language==="th"?"วิธีเล่น":"How to play"}>
          <div><b>01</b><span>{language==="th"?"เลือกอาหาร":"Pick a dish"}</span></div>
          <div><b>02</b><span>{language==="th"?"ฟังศัพท์อังกฤษ":"Listen & learn"}</span></div>
          <div><b>03</b><span>{language==="th"?"ลงมือทำอาหาร":"Cook by touching"}</span></div>
        </div>
      </div>
      <div className="menu-fresh-showcase">
        <span className="menu-fresh-sticker">TODAY'S PICK <b>{String(featured+1).padStart(2,"0")} / {String(featuredDishes.length).padStart(2,"0")}</b></span>
        <div className="menu-fresh-plate"><img src={illustration(featuredDishes[featured].id)} alt={featuredDishes[featured].name}/></div>
        <div className="menu-fresh-foodinfo"><span><b>{featuredDishes[featured].name}</b><small>{featuredDishes[featured].thaiName}</small></span>
          <div className="menu-fresh-arrows">
            <button type="button" onClick={()=>setFeatured(i=>(i+featuredDishes.length-1)%featuredDishes.length)} aria-label={language==="th"?"เมนูก่อนหน้า":"Previous dish"}><UiIcon name="arrow-left" size={18}/></button>
            <button type="button" onClick={()=>setFeatured(i=>(i+1)%featuredDishes.length)} aria-label={language==="th"?"เมนูถัดไป":"Next dish"}><UiIcon name="arrow-right" size={18}/></button>
          </div>
        </div>
      </div>
    </section>
    <section className="menu-fresh-paths" aria-label={language==="th"?"เลือกสิ่งที่อยากเรียน":"Choose how to learn"}>
      <button type="button" className="menu-fresh-path menu-fresh-path-dishes" onClick={()=>jump("#menu-country-list")}>
       <span><small>01 / RECIPES</small><strong>{t.allMenu}</strong><em>{language==="th"?"เลือกอาหาร 8 เมนู":"Explore 8 recipes"}</em></span>
       <img src="/playground/PG-EngMenu/first-page/menu.webp" alt=""/>
       <i><UiIcon name="arrow-up-right" size={18}/></i>
      </button>
      <button type="button" className="menu-fresh-path menu-fresh-path-ingredients" onClick={()=>openVocabulary("ingredient")}>
       <span><small>02 / WORDS</small><strong>{t.ingredients}</strong><em>{language==="th"?"ดูรูป ฟังเสียง ฝึกคำศัพท์":"See, hear & learn"}</em></span>
       <img src="/playground/PG-EngMenu/INGREDIENTS/img/ingredients-preview.webp" alt=""/>
       <i><UiIcon name="arrow-up-right" size={18}/></i>
      </button>
      <button type="button" className="menu-fresh-path menu-fresh-path-tools" onClick={()=>openVocabulary("tool")}>
       <span><small>03 / TOOLS</small><strong>{t.kitchenware}</strong><em>{language==="th"?"รู้จักเครื่องครัวภาษาอังกฤษ":"Learn kitchen vocabulary"}</em></span>
       <img src={vocabImage("pot")} alt=""/>
       <i><UiIcon name="arrow-up-right" size={18}/></i>
      </button>
    </section>
    <section className="menu-countries" id="menu-country-list" ref={catalogRef}>
     <div className="menu-section-intro"><span>OUR FOOD JOURNEY</span><h1>{t.discover}</h1><p>{t.hint}</p></div>
     {countries.map((country,index)=><div className="menu-country-block" key={country.id}>
      <h2><span className="menu-country-code" aria-hidden="true">{countryCodes[country.id]}</span>{countryName(country.id,language)}</h2>
      <div className="menu-dishes">{dishes.filter(d=>d.country===country.id).map(dish=><button type="button" className="menu-dish-card" key={dish.id} onClick={()=>openRecipe(dish)} aria-label={(language==="th"?dish.thaiName:dish.name)+": "+t.tapDish}>
       <span className="menu-dish-card-art"><img src={illustration(dish.id)} alt="" loading="lazy" decoding="async"/></span>
       <span className="menu-dish-card-label">{language==="th"?dish.thaiName:dish.name}</span>
       {completed.includes(dish.id)&&<span className="menu-dish-complete"><UiIcon name="check" size={17}/></span>}
      </button>)}</div>
     </div>)}
    </section>
   </div>}
   {screen==="vocabulary"&&<div className="menu-paper menu-standalone-vocab">
     <div className="menu-vocab-top"><button type="button" className="menu-vocab-back" onClick={backCatalog}><UiIcon name="arrow-left" size={18}/>{language==="th"?"กลับหน้าแรก":"Back to English Menu"}</button><span className="menu-vocab-title-icon"><UiIcon name="flower" size={14}/> ENGLISH MENU · LITTLE DICTIONARY</span></div>
     <div className="menu-vocab-hero">
      <div className="menu-vocab-hero-text"><span className="menu-vocab-eyebrow">LOOK · LISTEN · LEARN</span>
       <h1>{vocabKind==="ingredient"?t.ingredients:t.kitchenware}<span>!</span></h1>
       <p>{vocabKind==="ingredient"?(language==="th"?"เรียนรู้ชื่อวัตถุดิบจากภาพจริง พร้อมคำศัพท์ภาษาอังกฤษ คำแปลไทย และเสียงอ่าน":"Explore ingredients with English names, Thai translations, and pronunciations."):(language==="th"?"รู้จักชื่อเครื่องครัวจากภาพ กดฟังคำศัพท์ภาษาอังกฤษได้ทุกชิ้น":"Learn the names of kitchen tools with pictures, Thai meanings, and audio.")}</p>
      </div>
      <img src={vocabKind==="ingredient"?"/playground/PG-EngMenu/INGREDIENTS/img/ingredients-preview.webp":vocabImage("pot")} alt="" className="menu-vocab-hero-img" />
     </div>
     <div className="menu-vocab-controls">
      <div className="menu-vocab-tabs" role="group" aria-label={language==="th"?"เลือกหมวดคำศัพท์":"Vocabulary category"}>
       <button type="button" className={vocabKind==="ingredient"?"active":""} aria-pressed={vocabKind==="ingredient"} onClick={()=>{setVocabKind("ingredient");setVocabQuery("");setLastWord(null)}}>{t.ingredients} <span>{Object.values(vocabulary).filter(v=>v.kind==="ingredient").length}</span></button>
       <button type="button" className={vocabKind==="tool"?"active":""} aria-pressed={vocabKind==="tool"} onClick={()=>{setVocabKind("tool");setVocabQuery("");setLastWord(null)}}>{t.kitchenware} <span>{Object.values(vocabulary).filter(v=>v.kind==="tool").length}</span></button>
      </div>
      <label className="menu-vocab-search"><UiIcon name="search" size={17}/><span className="menu-vocab-visually-hidden">{language==="th"?"ค้นหาคำศัพท์":"Search vocabulary"}</span><input value={vocabQuery} onChange={e=>setVocabQuery(e.target.value)} placeholder={language==="th"?"ค้นหาภาษาอังกฤษหรือไทย":"Search English or Thai"} type="search"/></label>
     </div>
     <p className="menu-vocab-help"><UiIcon name="volume-2" size={18}/>{t.clickListen} <span>{visibleWords.length} {t.wordCount}</span></p>
     <div className="menu-word-grid menu-vocab-all-grid">{visibleWords.map(word=>renderWord(word.id))}</div>
     {visibleWords.length===0&&<p className="menu-vocab-empty">{language==="th"?"ไม่พบคำศัพท์ ลองค้นหาคำอื่นดูนะ":"No matching words. Try another search!"}</p>}
     {lastWord&&vocabulary[lastWord].kind===vocabKind&&<div className="menu-vocab-selected" role="status"><span>{language==="th"?"กำลังฝึกคำว่า":"Practicing"}</span><strong lang="en">{vocabulary[lastWord].en}</strong><span>{vocabulary[lastWord].th}</span><button type="button" onClick={()=>speak(vocabulary[lastWord].en)} aria-label={t.listen}><UiIcon name="volume-2" size={18}/></button></div>}
     {audioError&&<p className="menu-audio-error" role="status">{t.audioUnsupported}</p>}
     <div className="menu-vocab-bottom"><span>{language==="th"?"จำคำศัพท์ได้แล้ว ลองนำไปใช้ทำอาหารกัน!":"Now use your new words to cook a dish!"}</span><button type="button" onClick={backCatalog}>{language==="th"?"ไปเลือกเมนูอาหาร":"Choose a dish"} <UiIcon name="arrow-right" size={17}/></button></div>
    </div>}
   {screen==="recipe"&&<div className="menu-paper menu-recipe-paper">
     <div className="menu-recipe-nav"><button type="button" onClick={backCatalog}><UiIcon name="arrow-left" size={16}/>{t.recipeBack}</button><span><b className="menu-country-inline-code">{countryCodes[recipeCountry]}</b> {countryName(recipeCountry,language)}</span></div>
     <section className="menu-recipe-poster">
       <div className="menu-card-upper"><span>RECIPE COLLECTION</span><span className="menu-recipe-count"><UiIcon name="star" size={12}/> {String(dishes.indexOf(selected)+1).padStart(2,"0")} / 08 <UiIcon name="star" size={12}/></span></div>
       <div className="menu-poster-number">{String(dishes.indexOf(selected)+1).padStart(2,"0")}</div>
       <div className="menu-poster-plate"><img src={illustration(selected.id)} alt={selected.name}/></div>
       <div className="menu-poster-title"><h1 lang="en">{selected.name}</h1><h2>{selected.thaiName}</h2><p>{language==="th"?selected.subtitleTh:selected.subtitle} · {selected.minutes} {t.min}</p></div>
       <div className="menu-card-stats"><span><b>{getCookingSteps(selected).length}</b> {t.stepTitle}</span><span><b>{selected.ingredients.length}</b> {t.ingredients}</span><span><b>{selected.tools.length}</b> {t.kitchenware}</span></div>
       <button type="button" className="menu-card-play" onClick={startCooking}>{t.goCook}<UiIcon name="arrow-right" size={18}/></button>
       <div className="menu-card-motto">LEARN THE WORDS · COOK THE DISH · COLLECT THE RECIPE</div>
     </section>
     <nav className="menu-recipe-index" aria-label={t.learn}>
      <button type="button" onClick={()=>jump("#menu-cooking-steps")}>01 · {t.stepTitle}</button>
      <button type="button" onClick={()=>jump("#menu-ingredient-list")}>02 · {t.ingredientsIn}</button>
      <button type="button" onClick={()=>jump("#menu-tool-list")}>03 · {t.toolsIn}</button>
     </nav>
     <section className="menu-recipe-gingham" id="menu-cooking-steps">
      <div className="menu-step-banner">{t.stepTitle}</div>
      <div className="menu-steps-paper">
       {selected.instructions.map((line,i)=><div className="menu-steps-line" key={i}>
        <span className="menu-step-number">{i+1}</span>
        <div><p lang="en">{line.en}</p><small>{line.th}</small></div>
        <button type="button" onClick={()=>speak(line.en)} aria-label={t.listen+": "+line.en}><UiIcon name="volume-2" size={19}/></button>
       </div>)}
      </div>
     </section>
     <div className="menu-vocabulary-page">
      <section className="menu-learning-section menu-ingredient-section" id="menu-ingredient-list">
       <div className="menu-ribbon-heading pink"><h2>{t.ingredientsIn}</h2><span>{t.ingredients} · {selected.ingredients.length} {t.items}</span></div>
       <p className="menu-vocab-explainer">{t.clickListen}</p>
       <div className="menu-word-grid">{selected.ingredients.map(renderWord)}</div>
      </section>
      <section className="menu-learning-section menu-tool-section" id="menu-tool-list">
       <div className="menu-ribbon-heading green"><h2>{t.toolsIn}</h2><span>{t.kitchenware} · {selected.tools.length} {t.items}</span></div>
       <p className="menu-vocab-explainer">{t.clickListen}</p>
       <div className="menu-word-grid">{selected.tools.map(renderWord)}</div>
      </section>
      {lastWord&&<div className="menu-last-word" aria-live="polite"><span>{t.wordHint}</span><b lang="en">{vocabulary[lastWord].en}</b><span>{vocabulary[lastWord].th}</span><button type="button" onClick={()=>speak(vocabulary[lastWord].en)} aria-label={t.listen}><UiIcon name="volume-2" size={19}/></button></div>}
      {audioError&&<p className="menu-audio-error" role="status">{t.audioUnsupported}</p>}
      <div className="menu-cook-invite"><div><span>READY, STEADY, COOK!</span><h2>{t.goCook}</h2><p>{t.miniDesc}</p></div><button type="button" onClick={startCooking}>{t.goCook}<UiIcon name="arrow-right" size={20}/></button></div>
     </div>
   </div>}
   {screen==="cook"&&<EnglishMenuKitchen key={selected.id} dish={selected} language={language} initialSpoken={initialSpeechPrimed}
    onBack={()=>{setScreen("recipe");toTop()}}
    onFinish={()=>{setScreen("complete");setCompleted(prev=>{const next=prev.includes(selected.id)?prev:[...prev,selected.id];try{localStorage.setItem("english-menu-completed",JSON.stringify(next))}catch{}return next});toTop()}}/>}
   {screen==="complete"&&<div className="menu-paper menu-complete-paper">
    <span className="menu-complete-star" aria-hidden="true"><UiIcon name="asterisk" size={25}/><UiIcon name="star" size={32}/><UiIcon name="asterisk" size={25}/></span><div className="menu-complete-illustration"><img src={illustration(selected.id)} alt={selected.name}/></div>
    <h1>{t.completed}</h1><h2>{selected.thaiName}</h2><p>{t.completeDesc}</p>
    <div className="menu-learned-title">{t.finishWords}</div><div className="menu-finished-words">{[...selected.ingredients,...selected.tools].map(id=><button key={id} type="button" onClick={()=>speak(vocabulary[id].en)}><img src={vocabImage(id)} alt="" loading="lazy"/><span>{vocabulary[id].en}<small>{vocabulary[id].th}</small></span><UiIcon name="volume-2" size={16}/></button>)}</div>
    <div className="menu-finish-actions"><button type="button" onClick={startCooking}>{t.again}</button><button type="button" onClick={backCatalog}>{t.chooseOther}<UiIcon name="arrow-right" size={17}/></button></div>
   </div>}
  </main>
  <footer className="menu-game-footer"><Link href="/playground"><UiIcon name="arrow-left" size={15}/>{t.return}</Link><span>ENGLISH MENU • MADE TO LEARN & PLAY</span></footer>
 </div>;
}
