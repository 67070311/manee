"use client";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import UiIcon from "./UiIcon";
import type {Language} from "./Home";

/**
 * The Portfolio design system is a document, not a separate route.
 * All scrolling, section navigation and specimen interactions stay inside the dialog.
 */
type Props={open:boolean;onClose:()=>void;language:Language};

const colors=[
 {name:"Deep ink",hex:"#203E52",role:"Primary text & structure",th:"ข้อความหลักและโครงสร้าง",contrast:"Light surfaces"},
 {name:"Studio blue",hex:"#3468A3",role:"Links, emphasis & actions",th:"ลิงก์ จุดเน้น และปุ่ม",contrast:"Light surfaces"},
 {name:"Soft sage",hex:"#538A70",role:"Supporting accents",th:"สีสนับสนุนและองค์ประกอบรอง",contrast:"Large accents"},
 {name:"Mint",hex:"#ABD5C1",role:"Soft surfaces & decoration",th:"พื้นหลังและรายละเอียดอ่อน",contrast:"Dark text"},
 {name:"Warm yellow",hex:"#F3D57A",role:"Highlights & labels",th:"ป้ายและจุดดึงสายตา",contrast:"Dark text"},
 {name:"Paper",hex:"#FBFAF4",role:"Reading surfaces",th:"พื้นผิวสำหรับอ่านเนื้อหา",contrast:"Dark text"}
];
const shadeStops=[50,100,200,300,400,500,600,700,800,900,950] as const;
const tonalPalettes=[
 {name:"Studio blue",role:"PRIMARY",base:"#3468A3",usage:"Main actions · links"},
 {name:"Soft sage",role:"SECONDARY",base:"#538A70",usage:"Supporting actions · selection"},
 {name:"Deep ink",role:"TEXT / SURFACE",base:"#203E52",usage:"Text · dark backgrounds"},
 {name:"Warm gold",role:"ACCENT",base:"#F3D57A",usage:"Highlights · micro-interactions"},
 {name:"Soft mint",role:"SUPPORT",base:"#ABD5C1",usage:"Soft surfaces"},
 {name:"Warm neutral",role:"NEUTRAL",base:"#FBFAF4",usage:"Paper · cards · dividers"},
] as const;
const neutralShades=["#FFFFFF","#FBFAF4","#F3F5F1","#E8EEEC","#D5DFDC","#B7C7C6","#8FA3A3","#667E85","#455E6A","#294355","#172E40"];
function blend(a:string,b:string,w:number){return "#"+[0,1,2].map(i=>Math.round(parseInt(a.slice(1+i*2,3+i*2),16)*(1-w)+parseInt(b.slice(1+i*2,3+i*2),16)*w).toString(16).padStart(2,"0")).join("").toUpperCase()}
function shadeHex(base:string,step:number,neutral=false){
 if(neutral)return neutralShades[shadeStops.indexOf(step as (typeof shadeStops)[number])];
 const light:Record<number,number>={50:.93,100:.84,200:.69,300:.53,400:.29};
 const dark:Record<number,number>={600:.12,700:.26,800:.42,900:.59,950:.74};
 return step<500?blend(base,"#FFFFFF",light[step]):step>500?blend(base,"#101F2B",dark[step]):base;
}
function inkForShade(hex:string){
 const channels=[0,1,2].map(i=>parseInt(hex.slice(1+i*2,3+i*2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
 const luminosity=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
 const ink=0.045; // approximate luminance of the site's deep-ink label
 return 1.05/(luminosity+.05)>(luminosity+.05)/(ink+.05)?"#FFFFFF":"#203E52";
}
const roleMap=[
 {semantic:"action.primary",reference:"blue.500",value:"#3468A3",purpose:"Main CTA / links",thai:"ปุ่มหลัก / ลิงก์"},
 {semantic:"action.secondary",reference:"sage.500",value:"#538A70",purpose:"Supporting CTA",thai:"ปุ่มรอง"},
 {semantic:"text.primary",reference:"ink.500",value:"#203E52",purpose:"Reading hierarchy",thai:"ข้อความหลัก"},
 {semantic:"surface.canvas",reference:"neutral.100",value:"#FBFAF4",purpose:"Warm page backdrop",thai:"พื้นหลังครีม"},
 {semantic:"surface.soft",reference:"mint.500",value:"#ABD5C1",purpose:"Soft panels",thai:"การ์ดพื้นอ่อน"},
 {semantic:"accent.highlight",reference:"gold.500",value:"#F3D57A",purpose:"Highlights / stickers",thai:"จุดเน้น"}
] as const;
const semanticColors=[
 {name:"Success",tone:"#258B68",soft:"#E3F4EA",th:"ดำเนินการสำเร็จ",description:"Confirmation"},
 {name:"Warning",tone:"#B37D20",soft:"#FFF4DA",th:"สิ่งที่ต้องระวัง",description:"Needs attention"},
 {name:"Danger",tone:"#BD4B59",soft:"#FCE8EA",th:"ข้อผิดพลาด",description:"Destructive / errors"},
 {name:"Info",tone:"#347FAD",soft:"#E8F3FB",th:"ข้อมูลเพิ่มเติม",description:"Context / guidance"}
] as const;
const contrastPairs=[
 {name:"Ink / Paper",purpose:"Body text",th:"ข้อความเนื้อหา",fg:"#203E52",bg:"#FBFAF4"},
 {name:"White / Blue",purpose:"Primary CTA",th:"ปุ่มหลัก",fg:"#FFFFFF",bg:"#3468A3"},
 {name:"White / Sage",purpose:"Large button labels",th:"ปุ่มข้อความใหญ่",fg:"#FFFFFF",bg:"#538A70"},
 {name:"Ink / Mint",purpose:"Tinted card text",th:"ข้อความบนการ์ดมิ้นต์",fg:"#203E52",bg:"#ABD5C1"},
 {name:"White / Mint",purpose:"Avoid for text",th:"ไม่ควรใช้กับตัวอักษร",fg:"#FFFFFF",bg:"#ABD5C1"},
] as const;
function relativeLuminance(hex:string){
 const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(value=>value<=.04045?value/12.92:Math.pow((value+.055)/1.055,2.4));
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
function contrastRatio(foreground:string,background:string){
 const a=relativeLuminance(foreground),b=relativeLuminance(background);
 return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
const variants=["Primary","Secondary","Outline","Ghost","Text","Danger"] as const;
const variantStates=["Default","Hover","Pressed","Focus","Disabled","Loading"] as const;

const spacing=[4,8,12,16,24,32,48,64];
const tabs=[
 ["overview","Overview","ภาพรวม"],
 ["principles","Principles","หลักการ"],
 ["color","Color","ชุดสี"],
 ["typography","Typography","ตัวอักษร"],
 ["layout","Layout & spacing","ระยะและกริด"],
 ["components","Components","คอมโพเนนต์"],
 ["patterns","UI patterns","รูปแบบ UI"],
 ["motion","Motion & access","โมชั่นและการเข้าถึง"],
 ["guidelines","Guidelines","แนวทางการใช้งาน"]
] as const;

const textSet={
 en:{
 title:"The design system",strap:"VISUAL LANGUAGE · PORTFOLIO",close:"Close design system",browse:"JUMP TO",sub:"An evolving visual system shaped by the portfolio you are exploring. Every sample below is drawn from its colors, typography, layouts and interaction patterns.",overview:"A system with personality.",overviewText:"Expressive details on the outside. Consistency, clarity and care underneath.",stat1:"Core colors",stat2:"Type families",stat3:"Spacing values",stat4:"Core principles",preview:"FOUNDATIONS / AT A GLANCE",
 principles:"Design principles",principlesIntro:"The visual style has room to play. The interface itself stays purposeful.",principlesCards:[["Clear first","Information hierarchy and readable text should never be sacrificed for decoration."],["Expressive with restraint","Handwritten headings, a little asymmetry, and color used to establish character, not noise."],["Built for interaction","Controls make sense at a glance. Motion explains what changed and where to look."]],
 colors:"Color system",scaleTitle:"TONAL PALETTES / 50–950",scaleIntro:"A proposed tonal extension of the live portfolio colors. Shade 500 preserves each existing color except paper at 100; other steps are proposed reusable tones.",roleTitle:"COLOR ROLES / SEMANTIC MAPPING",roleIntro:"Primitive tokens flow into semantic roles, then individual components.",semanticTitle:"FEEDBACK / SEMANTIC COLORS",semanticIntro:"Suggested status colors, not all currently deployed.",tokenLabel:"TOKEN",roleLabel:"ROLE / PURPOSE",valueLabel:"VALUE",colorsIntro:"The existing site's navy, blue, sage, mint, warm yellow and paper tones. Select any swatch to copy its hex value.",copy:"Copy color",copied:"Copied",application:"COLOR APPLICATION",appLight:"Light canvas",appDark:"Dark section",appButton:"Primary action",appNote:"Accent, not overload",colorRole:"Usage",colorNote:"Color roles are descriptive of the current visual direction; text readability is checked in context.",
 typography:"Typography",typographyIntro:"The site mixes warm handwritten display text with a clean interface typeface. These samples demonstrate the same families already used in the project.",display:"DISPLAY / PATRICK HAND",accent:"ACCENT / CAVEAT",body:"BODY & UI / DM SANS",thaiHead:"THAI DISPLAY / MALI",thaiBody:"THAI BODY / NOTO SANS THAI",sampleDisplay:"Make it feel human.",sampleAccent:"Small details, big feeling.",sampleBody:"Good design gives people space to understand, explore and act. Every letter, line and pause has a reason.",sampleThai:"ออกแบบให้สนุกและอ่านง่าย",sampleThaiBody:"เนื้อหาภาษาไทยต้องชัดเจน มีระยะห่างเหมาะสม และไม่เสียความหมายเมื่อปรับขนาดหน้าจอ",textScale:"TYPE HIERARCHY",typeDetails:[["Display","64–104px","Hero and section introductions"],["Section title","42–64px","Clear grouping and reading order"],["Body","15–18px","Comfortable descriptions"],["Micro-label","11–13px","Short navigation and metadata"]],
 layout:"Spacing & layout",layoutIntro:"An underlying 4px rhythm with responsive widths. Small parts feel related and larger sections still have breathing room.",scale:"SPACING SCALE / 4PX BASE",container:"CONTENT WIDTH",containerNote:"Main editorial sections typically sit within a centered ~1160px content width.",responsive:"RESPONSIVE THINKING",rDesktop:"Desktop",rTablet:"Tablet",rMobile:"Mobile",rDesktopInfo:"Generous two-column editorial layouts",rTabletInfo:"Reduced gaps and adaptable card grids",rMobileInfo:"Single reading flow and reachable controls",rNote:"Breakpoints are examples of the site's adaptive behavior, not a rigid universal grid.",
 components:"Component library",componentsIntro:"Static state matrices and interactive specimens derived from the portfolio: explore variants, sizes, form feedback and controls.",actions:"BUTTONS / INTERACTION STATES",matrixTitle:"BUTTON VARIANTS × STATES",matrixIntro:"36 examples: six variants and six visual states. Hover, pressed and focus are displayed as fixed specimens for comparison.",buttonUsage:"BUTTON HIERARCHY & ANATOMY",buttonSizes:"SIZE SPECIFICATION",buttonStates:"STATE",liveTest:"LIVE CONTROLS",primary:"Explore more",secondary:"Learn more",ghost:"Text link",disabled:"Unavailable",status:"Button interaction recorded",navigation:"NAVIGATION / STATES",navHome:"Home",navWork:"Work",navPlay:"Playground",navContact:"Contact",tags:"TAGS & LABELS",tag1:"Creative development",tag2:"UI / UX",tag3:"In progress",fields:"FORM FIELDS",formsTitle:"INPUTS / VALIDATION STATES",formsIntro:"Document each state so focus and error feedback stay predictable.",controlsTitle:"SELECTION / CONTROLS",controlsIntro:"Checkbox, radio, switch, tabs and progress share the same visual logic.",feedbackTitle:"FEEDBACK SPECIMENS",fieldLabel:"Your name",fieldPlaceholder:"Type a name...",fieldHelp:"Use clear labels and helpful feedback.",fieldError:"Please enter at least two characters.",success:"Looks good.",toggle:"Show more details",on:"Additional detail is visible.",off:"Click the switch to show a supporting note.",card:"PROJECT CARD",cardTitle:"A thoughtful little project",cardText:"A quiet card with enough structure to scan and explore.",cardButton:"View project",interaction:"INTERACTIVE SPECIMENS",
 patterns:"Interaction patterns",patternsIntro:"Small repeatable arrangements from the existing site, simplified into reusable UI documentation.",iconTitle:"Iconography & surface language",iconText:"Consistent outline icons, gentle corner radii and subtle depth connect the playful sections with the more functional interface.",iconLabel:"OUTLINE ICONS / 1.7PX STROKE",surfaceLabel:"SURFACES / RADIUS / ELEVATION",surfaceNote:"Soft surfaces, a 1–2px border, and small shadows create separation without visual noise.",patternCards:[["Cover & details","Keep visuals unobstructed; place actions where they are easy to find."],["Editorial section","Use a distinct title, short explanation and one primary next step."],["Dialog content","One scrollable reading surface, an obvious close action and keyboard access."]],do:"DO",dont:"AVOID",doList:["Keep buttons outside visual artwork.","Use one clear headline per section.","Treat decorative details as secondary."],dontList:["Place controls on top of important imagery.","Mix unrelated visual styles within a component.","Add animation without a purpose."],
 motion:"Motion & accessibility",motionIntro:"Subtle movement gives feedback and rhythm without competing with the work.",motionCards:[["180–300ms","Hover & press","Fast and familiar feedback."],["700–900ms","Section reveal","A calm fade and short upward transition."],["Reduced motion","User preference","Non-essential movement is removed when requested."]],replay:"Replay interaction",accessTitle:"ACCESSIBILITY CHECKLIST",access:["Visible keyboard focus on interactive controls","Useful labels, real buttons and semantic navigation","Text contrast evaluated against its background","Responsive touch targets and scrollable layouts","Reduced-motion preference respected"],
 guidelines:"Usage guidelines",guidelinesIntro:"A small set of decisions that help the next screen belong to the same family.",guideItems:[["01","Choose a role","Pick color and text styles based on meaning, not decoration."],["02","Build a clear hierarchy","Make the next action easy to identify and follow."],["03","Reuse before reinventing","Prefer established spacing, cards and control patterns."],["04","Test on real screens","Check long text, small screens, focus and motion."]],finish:"Designed to be used.",finishText:"The system is a living reference for the portfolio's current visual direction."
 },
 th:{
 title:"ระบบดีไซน์ของเว็บ",strap:"VISUAL LANGUAGE · PORTFOLIO",close:"ปิด Design System",browse:"เลือกหัวข้อ",sub:"ระบบดีไซน์ที่ถอดจากเว็บไซต์ Portfolio หน้านี้จริง ตั้งแต่สี ฟอนต์ การจัดวาง ไปจนถึงพฤติกรรมขององค์ประกอบต่าง ๆ",overview:"มีบุคลิก แต่ยังเป็นระบบ",overviewText:"ภายนอกดูสร้างสรรค์ ภายในมีความสม่ำเสมอ ชัดเจน และใส่ใจรายละเอียด",stat1:"สีหลัก",stat2:"ตระกูลฟอนต์",stat3:"ค่าระยะห่าง",stat4:"หลักการ",preview:"องค์ประกอบ / ภาพรวม",
 principles:"หลักการออกแบบ",principlesIntro:"ดีไซน์สนุกได้ แต่ทุกส่วนของ UI ต้องมีหน้าที่ชัดเจน",principlesCards:[["ชัดเจนก่อน","ลำดับข้อมูลและข้อความที่อ่านง่ายสำคัญกว่าการตกแต่ง"],["มีเอกลักษณ์อย่างพอดี","ฟอนต์ลายมือ ความไม่สมมาตรนิด ๆ และสีที่ช่วยให้จดจำได้ โดยไม่รก"],["สร้างมาให้โต้ตอบ","ปุ่มต้องเข้าใจได้ทันที และโมชั่นช่วยบอกว่าเกิดอะไรขึ้น"]],
 colors:"ระบบสี",scaleTitle:"ชุดสีแบบไล่เฉด 50–950",scaleIntro:"ชุดเฉดต่อยอดจากสีของ Portfolio ปัจจุบัน สีจริงเป็นจุดอ้างอิงที่ระดับ 500 (ยกเว้น Paper ที่ 100) ส่วนเฉดอื่นเป็นข้อเสนอสำหรับ Component Library",roleTitle:"บทบาทสี / SEMANTIC MAPPING",roleIntro:"จากสีตั้งต้น (Primitive) → บทบาท (Semantic) → การใช้งาน",semanticTitle:"สีสถานะ / FEEDBACK",semanticIntro:"สีสถานะที่เสนอ ไม่ได้หมายความว่าทุกสถานะมีใช้อยู่แล้ว",tokenLabel:"TOKEN",roleLabel:"บทบาท / การใช้งาน",valueLabel:"ค่าสี",colorsIntro:"ถอดสีจากเว็บไซต์ปัจจุบัน ทั้งกรมท่า ฟ้า เขียวเสจ มิ้นต์ เหลืองอ่อน และครีม กดสีเพื่อคัดลอกรหัสได้",copy:"คัดลอกสี",copied:"คัดลอกแล้ว",application:"ตัวอย่างการใช้สี",appLight:"พื้นหลังสว่าง",appDark:"ส่วนพื้นเข้ม",appButton:"ปุ่มหลัก",appNote:"สีเน้นใช้เท่าที่จำเป็น",colorRole:"หน้าที่",colorNote:"บทบาทสีอ้างอิงจากเว็บปัจจุบัน ต้องตรวจความอ่านง่ายของตัวอักษรกับพื้นหลังแต่ละบริบท",
 typography:"ตัวอักษร",typographyIntro:"หัวข้อแบบลายมือสร้างบุคลิก และเนื้อหาใช้ฟอนต์ที่อ่านง่าย ทั้งหมดอิงจากฟอนต์ที่มีอยู่ในโปรเจกต์",display:"หัวข้ออังกฤษ / PATRICK HAND",accent:"คำเน้นอังกฤษ / CAVEAT",body:"เนื้อหาอังกฤษ / DM SANS",thaiHead:"หัวข้อไทย / MALI",thaiBody:"เนื้อหาไทย / NOTO SANS THAI",sampleDisplay:"Make it feel human.",sampleAccent:"Small details, big feeling.",sampleBody:"Good design gives people space to understand, explore and act. Every letter, line and pause has a reason.",sampleThai:"ออกแบบให้สนุกและอ่านง่าย",sampleThaiBody:"เนื้อหาภาษาไทยต้องชัดเจน มีระยะห่างเหมาะสม และไม่เสียความหมายเมื่อปรับขนาดหน้าจอ",textScale:"ลำดับขนาดตัวอักษร",typeDetails:[["หัวข้อใหญ่","64–104px","ส่วนเปิดและส่วนแนะนำ"],["หัวข้อส่วน","42–64px","แบ่งเนื้อหาให้ชัดเจน"],["เนื้อหา","15–18px","คำอธิบายที่อ่านสบาย"],["ป้ายเล็ก","11–13px","เมนูและข้อมูลกำกับ"]],
 layout:"ระยะห่างและการจัดวาง",layoutIntro:"ใช้ฐานระยะ 4px และปรับกริดตามขนาดหน้าจอ เพื่อให้องค์ประกอบเล็กเชื่อมกันและเนื้อหาใหญ่ไม่แน่น",scale:"ชุดระยะ / ฐาน 4PX",container:"ความกว้างเนื้อหา",containerNote:"ส่วนเนื้อหาหลักของเว็บมักใช้พื้นที่กลางกว้างประมาณ 1160px",responsive:"การออกแบบ Responsive",rDesktop:"เดสก์ท็อป",rTablet:"แท็บเล็ต",rMobile:"มือถือ",rDesktopInfo:"เนื้อหาสองคอลัมน์และระยะที่โปร่ง",rTabletInfo:"ลดช่องว่างและปรับกริดของการ์ด",rMobileInfo:"เรียงข้อมูลเป็นลำดับเดียวและปุ่มกดถึงง่าย",rNote:"ขนาดจอเป็นแนวทางของเลย์เอาต์ที่ปรับตามพื้นที่ ไม่ใช่ระบบกริดตายตัวทั้งเว็บ",
 components:"คลังคอมโพเนนต์",componentsIntro:"ตัวอย่างสถานะแบบคงที่และองค์ประกอบที่ทดลองกดได้จริง อ้างอิงสีและโครงสร้างของ Portfolio",actions:"ปุ่ม / สถานะต่าง ๆ",matrixTitle:"BUTTON VARIANTS × STATES",matrixIntro:"ตัวอย่างปุ่ม 6 รูปแบบ × 6 สถานะ รวม 36 แบบ แยก Default, Hover, Pressed, Focus, Disabled และ Loading อย่างชัดเจน",buttonUsage:"ลำดับความสำคัญและโครงสร้างปุ่ม",buttonSizes:"ขนาดปุ่ม",buttonStates:"สถานะ",liveTest:"ทดลองกด",primary:"ดูเพิ่มเติม",secondary:"เรียนรู้เพิ่ม",ghost:"ลิงก์เรียบ",disabled:"ยังใช้ไม่ได้",status:"ตอบสนองต่อการกดปุ่มแล้ว",navigation:"เมนู / สถานะ",navHome:"หน้าแรก",navWork:"ผลงาน",navPlay:"Playground",navContact:"ติดต่อ",tags:"แท็กและป้าย",tag1:"Creative development",tag2:"UI / UX",tag3:"กำลังพัฒนา",fields:"ช่องกรอกข้อมูล",formsTitle:"สถานะของช่องกรอกข้อมูล",formsIntro:"แสดงแต่ละสถานะให้ชัดเจน เพื่อให้ Focus และ Error คาดเดาได้",controlsTitle:"SELECTION / CONTROLS",controlsIntro:"Checkbox, Radio, Switch, Tabs และ Progress ใช้ระบบสีและเส้นขอบเดียวกัน",feedbackTitle:"ตัวอย่างข้อความสถานะ",fieldLabel:"ชื่อของคุณ",fieldPlaceholder:"พิมพ์ชื่อ...",fieldHelp:"ใช้ป้ายกำกับที่เข้าใจง่ายและให้คำแนะนำชัดเจน",fieldError:"กรุณากรอกอย่างน้อย 2 ตัวอักษร",success:"ข้อมูลเรียบร้อย",toggle:"แสดงรายละเอียดเพิ่มเติม",on:"แสดงรายละเอียดแล้ว",off:"กดสวิตช์เพื่อแสดงข้อความเพิ่มเติม",card:"การ์ดผลงาน",cardTitle:"โปรเจกต์เล็ก ๆ ที่ตั้งใจทำ",cardText:"การ์ดที่มีจังหวะและข้อมูลพอให้เลือกอ่านได้ง่าย",cardButton:"ดูโปรเจกต์",interaction:"ตัวอย่างโต้ตอบ",
 patterns:"รูปแบบการใช้งาน",patternsIntro:"รูปแบบเล็ก ๆ ที่ใช้ซ้ำได้ โดยถอดแนวคิดจากหน้าเว็บที่ทำอยู่",iconTitle:"ไอคอนและพื้นผิว",iconText:"ไอคอนเส้น Outline มุมโค้งนุ่ม และเงาที่พอดีช่วยให้ส่วนสนุกและส่วนใช้งานจริงยังเป็นดีไซน์เดียวกัน",iconLabel:"OUTLINE ICONS / เส้น 1.7PX",surfaceLabel:"SURFACES / RADIUS / ELEVATION",surfaceNote:"พื้นผิวสีอ่อน กรอบ 1–2px และเงาเล็กน้อยช่วยให้แต่ละส่วนแยกกันชัดเจนแต่ไม่รก",patternCards:[["ปกกับรายละเอียด","ไม่ให้ปุ่มบังภาพสำคัญ และวางปุ่มในตำแหน่งหาง่าย"],["ส่วนแสดงเนื้อหา","มีหัวข้อที่เด่น คำอธิบายสั้น และทางไปขั้นต่อไปที่ชัดเจน"],["ป๊อปอัป","มีพื้นที่เลื่อนอ่านภายใน ปุ่มปิดชัดเจน และใช้คีย์บอร์ดได้"]],do:"ควรทำ",dont:"หลีกเลี่ยง",doList:["วางปุ่มนอกพื้นที่สำคัญของรูป","กำหนดหัวข้อหลักให้ชัดในแต่ละส่วน","ใช้งานตกแต่งในระดับรอง"],dontList:["วางปุ่มทับภาพที่ต้องการโชว์","ผสมสไตล์ที่ไม่เกี่ยวข้องในคอมโพเนนต์เดียว","ทำโมชั่นโดยไม่มีเหตุผล"],
 motion:"โมชั่นและการเข้าถึง",motionIntro:"การเคลื่อนไหวช่วยบอกสถานะและนำสายตา โดยไม่แย่งความสำคัญจากเนื้อหา",motionCards:[["180–300ms","Hover และการกด","ตอบสนองเร็วและเป็นธรรมชาติ"],["700–900ms","การเปิดส่วนเนื้อหา","ค่อย ๆ แสดงพร้อมเลื่อนขึ้นเล็กน้อย"],["Reduced motion","ตามการตั้งค่าผู้ใช้","ลดการเคลื่อนไหวที่ไม่จำเป็น"]],replay:"ลองโมชั่นอีกครั้ง",accessTitle:"รายการตรวจ Accessibility",access:["มองเห็น Focus เมื่อใช้คีย์บอร์ด","มีป้ายชื่อปุ่มและโครงสร้าง HTML ที่สื่อความหมาย","ตรวจสีข้อความกับพื้นหลังให้อ่านได้","รองรับปุ่มสัมผัสและหน้าจอหลายขนาด","เคารพการตั้งค่า Reduced Motion"],
 guidelines:"แนวทางการใช้งาน",guidelinesIntro:"หลักการสั้น ๆ ที่ช่วยให้หน้าถัดไปอยู่ในภาษาดีไซน์เดียวกัน",guideItems:[["01","เลือกสีตามหน้าที่","ใช้สีและฟอนต์ตามความหมาย ไม่ใช่เพื่อประดับ"],["02","จัดลำดับให้อ่านง่าย","ทำให้ผู้ใช้มองเห็นสิ่งที่ต้องทำต่อทันที"],["03","ใช้ของที่มีให้คุ้ม","เริ่มจากการนำกริด ระยะ และคอมโพเนนต์เดิมมาใช้"],["04","ทดสอบกับจอจริง","ดูข้อความยาว มือถือ Focus และโมชั่น"]],finish:"ระบบดีไซน์ที่ใช้งานได้จริง",finishText:"เอกสารนี้แสดงภาษาภาพและแนวทางของ Portfolio เวอร์ชันปัจจุบัน"
 }
};
const typeFamilies=[
 {id:"01",family:"Patrick Hand",key:"display" as const,sample:"sampleDisplay" as const,css:"ds-spec-hand"},
 {id:"02",family:"Caveat",key:"accent" as const,sample:"sampleAccent" as const,css:"ds-spec-caveat"},
 {id:"03",family:"DM Sans",key:"body" as const,sample:"sampleBody" as const,css:"ds-spec-body"},
 {id:"04",family:"Mali",key:"thaiHead" as const,sample:"sampleThai" as const,css:"ds-spec-mali"},
 {id:"05",family:"Noto Sans Thai",key:"thaiBody" as const,sample:"sampleThaiBody" as const,css:"ds-spec-noto"},
];

const documentation={
 en:{
  contrastTitle:"TEXT CONTRAST / REAL PALETTE PAIRINGS",contrastIntro:"Calculated WCAG relative-luminance ratios for pairs from the actual website palette. AA normal text requires 4.5:1; large text requires 3:1.",contrastNormal:"AA / NORMAL",contrastLarge:"LARGE ONLY",contrastAvoid:"AVOID",contrastStrong:"AAA / NORMAL",
  typeHeading:"TYPE STYLES / A PRACTICAL SCALE",
  typeIntro:"Suggested repeatable type tokens for headings, UI labels and bilingual content. These sizes describe a reference scale, not a claim that every page uses identical CSS.",
  typeRows:[
   ["Display","type.display","Patrick Hand","64–104 / 1.0","Regular","Ideas that become real.","ds-spec-hand"],
   ["Headline","type.h1","Patrick Hand","48–64 / 1.1","Regular","Make something wonderful.","ds-spec-hand"],
   ["Section","type.h2","Patrick Hand","34–44 / 1.15","Regular","Explore the details.","ds-spec-hand"],
   ["Accent","type.accent","Caveat","30–42 / 1.1","Medium","made with care","ds-spec-caveat"],
   ["Body","type.body","DM Sans","16 / 1.65","Regular","Clear information, without distractions.","ds-spec-body"],
   ["UI / label","type.label","DM Sans","13–14 / 1.4","Semibold","Discover more","ds-spec-body"],
   ["Thai UI","type.thai","Noto Sans Thai","15–16 / 1.7","Regular","อ่านง่ายในทุกขนาดหน้าจอ","ds-spec-noto"]
  ],
  typeRules:["Use handwriting for display moments, not every control.","Reserve Caveat for short expressive emphasis.","Keep paragraphs readable at 16px or larger where possible.","Give Thai body copy ample line-height and room to wrap."],
  gridHeading:"RESPONSIVE GRID / STRUCTURE",
  gridIntro:"A documented layout proposal based on the existing editorial site. Sample widths are design review targets, not enforced device boundaries.",
  gridRows:[
   ["Desktop","≈1440px","12 columns","24px gap","Content max ~1160px"],
   ["Tablet","≈768px","8 columns","16px gap","2-up cards when readable"],
   ["Mobile","≈390px","4 columns","12px gap","Single reading column"]
  ],
  surfaceHeading:"RADIUS / BORDER / ELEVATION",
  surfaceIntro:"Surfaces stay quiet. Use progressively more depth only when a layer needs to separate from its surroundings.",
  surfaceRows:[["r.sm","8px","Fields and small tags"],["r.md","12px","Buttons and mini cards"],["r.lg","20px","Feature cards"],["r.pill","999px","Pills and filters"]],
  layerRows:[["Level 00","Page","No shadow"],["Level 01","Card","Soft outline"],["Level 02","Floating","Subtle shadow"],["Level 03","Dialog","Backdrop + elevation"]],
  patternsHeading:"PATTERN ANATOMY / INTERACTION FLOW",
  patternsIntro:"Document behavior alongside the appearance, including loading, empty, keyboard and error states.",
  patterns:[
   ["Navigation","Active tab stays visible and keyboard reachable.","Persistent selection → visible focus → correct destination."],
   ["Project card","Clear image, project name, context and a single action.","Image stays readable → hover explains interactivity → click navigates."],
   ["Modal","One scroll region, close button and background scroll lock.","Open → focus inside → scroll within → Escape restores focus."],
   ["Status & empty","Show useful feedback without hiding underlying context.","Trigger → explicit message → next action or recovery."]
  ],
  motionHeading:"MOTION TOKENS / INTERACTION RECIPES",
  motionIntro:"Suggested handoff timings. Motion confirms a state change; it should never be required to understand the interface.",
  motionRows:[["Hover","160–220ms","ease-out","Color / elevation, small movement"],["Press","100–140ms","ease-in-out","Immediate pressed feedback"],["Panel / modal","220–320ms","ease-out","Fade and slight scale"],["Section reveal","450–700ms","ease-out","Short vertical reveal only"],["Reduced motion","0–80ms","none","Keep state changes, remove travel"]],
  qaHeading:"COMPONENT REVIEW / QUALITY GATES",
  qaIntro:"A compact review list for every new component before it joins the design system.",
  qaRows:[
   ["Visual","Uses assigned tokens, correct type hierarchy and predictable spacing."],
   ["Interaction","Hover, focus, active and disabled states are defined."],
   ["Accessibility","Text contrast, meaningful names and keyboard operation are reviewed."],
   ["Responsive","390 / 768 / 1440 layouts have no clipped labels or unexpected overflow."],
   ["Localization","Thai and English text wrap naturally without overlapping icons."],
   ["Performance","Images are sized sensibly and animations avoid layout thrashing."],
   ["Motion","Transitions serve a purpose and support reduced-motion settings."],
   ["Recovery","Loading, empty and error states provide an understandable next step."]
  ],
  handoffHeading:"TOKEN HANDOFF / NAMING EXAMPLE",
  handoffNote:"Illustrative naming that maps the documented primitives into semantic values and components."
 },
 th:{
  contrastTitle:"ความคมชัดของคู่สี / TEXT CONTRAST",contrastIntro:"วัดอัตราส่วน Contrast ตาม WCAG จากสีจริงของเว็บไซต์ ตัวอักษรทั่วไปควรได้อย่างน้อย 4.5:1 และตัวอักษรขนาดใหญ่ 3:1",contrastNormal:"AA / ปกติ",contrastLarge:"ข้อความใหญ่เท่านั้น",contrastAvoid:"หลีกเลี่ยง",contrastStrong:"AAA / ปกติ",
  typeHeading:"รายละเอียดตัวอักษร / TYPE SCALE",
  typeIntro:"ชุดโทเคนตัวอย่างสำหรับหัวข้อ ข้อความ และการใช้งานสองภาษา เป็นสเปกที่เสนอให้ใช้ซ้ำ ไม่ใช่ค่า CSS ที่เหมือนกันในทุกหน้า",
  typeRows:[
   ["Display","type.display","Patrick Hand","64–104 / 1.0","Regular","Ideas that become real.","ds-spec-hand"],
   ["Headline","type.h1","Patrick Hand","48–64 / 1.1","Regular","Make something wonderful.","ds-spec-hand"],
   ["Section","type.h2","Patrick Hand","34–44 / 1.15","Regular","Explore the details.","ds-spec-hand"],
   ["Accent","type.accent","Caveat","30–42 / 1.1","Medium","made with care","ds-spec-caveat"],
   ["Body","type.body","DM Sans","16 / 1.65","Regular","Clear information, without distractions.","ds-spec-body"],
   ["UI / label","type.label","DM Sans","13–14 / 1.4","Semibold","Discover more","ds-spec-body"],
   ["Thai UI","type.thai","Noto Sans Thai","15–16 / 1.7","Regular","อ่านง่ายในทุกขนาดหน้าจอ","ds-spec-noto"]
  ],
  typeRules:["ใช้ฟอนต์ลายมือกับหัวข้อเด่น ไม่ใช่ทุกปุ่ม","ใช้ Caveat เน้นคำสั้น ๆ ที่ต้องการบุคลิก","เนื้อหาอ่านจริงควรมีขนาดประมาณ 16px ขึ้นไป","ภาษาไทยต้องมีความสูงบรรทัดและพื้นที่ตัดคำพอ"],
  gridHeading:"RESPONSIVE GRID / โครงสร้าง",
  gridIntro:"สเปกกริดที่เสนอจากหน้า Portfolio จริง ขนาดจอเป็นตัวอย่างตรวจงาน ไม่ได้บังคับให้ทุกหน้ามี Breakpoint เดียวกัน",
  gridRows:[
   ["Desktop","≈1440px","12 คอลัมน์","24px gap","เนื้อหากว้างประมาณ 1160px"],
   ["Tablet","≈768px","8 คอลัมน์","16px gap","การ์ด 2 ใบต่อแถวเมื่ออ่านง่าย"],
   ["Mobile","≈390px","4 คอลัมน์","12px gap","อ่านเนื้อหาคอลัมน์เดียว"]
  ],
  surfaceHeading:"RADIUS / BORDER / ELEVATION",
  surfaceIntro:"พื้นผิวควรเรียบและแยกชั้นเท่าที่จำเป็น ไม่ใส่เงาทุกจุด",
  surfaceRows:[["r.sm","8px","ช่องกรอก / ป้ายเล็ก"],["r.md","12px","ปุ่ม / การ์ดขนาดเล็ก"],["r.lg","20px","การ์ดเนื้อหา"],["r.pill","999px","แท็กและตัวกรอง"]],
  layerRows:[["Level 00","พื้นหลัง","ไม่มีเงา"],["Level 01","การ์ด","ขอบบาง"],["Level 02","ลอย","เงาบาง"],["Level 03","ป๊อปอัป","เงาและฉากหลัง"]],
  patternsHeading:"รูปแบบคอมโพเนนต์ / INTERACTION FLOW",
  patternsIntro:"เอกสาร UI ต้องบอกพฤติกรรมด้วย ไม่ใช่มีแต่ภาพสวย ๆ รวมทั้งสถานะ Loading, Empty, Keyboard และ Error",
  patterns:[
   ["Navigation","แท็บปัจจุบันต้องมองเห็นชัดและใช้คีย์บอร์ดได้","เลือกเมนู → Focus ชัด → ไปหน้าที่ถูกต้อง"],
   ["Project card","ภาพ ชื่อผลงาน เนื้อหาและปุ่มหลักต้องเป็นระเบียบ","ภาพไม่โดนบัง → Hover ชัด → เปิดงาน"],
   ["Modal","เลื่อนอ่านด้านในได้ ปิดได้ง่าย และพื้นหลังไม่เลื่อน","เปิด → โฟกัสภายใน → เลื่อนอ่าน → Escape คืนโฟกัส"],
   ["Status & empty","แจ้งผลชัด และยังให้ผู้ใช้ไปต่อได้","เกิดสถานะ → แจ้งข้อความ → ให้แก้หรือดำเนินต่อ"]
  ],
  motionHeading:"MOTION TOKENS / รูปแบบการเคลื่อนไหว",
  motionIntro:"ค่าเวลาที่เสนอเพื่อส่งต่อไปใช้ในการพัฒนา Motion ควรบอกสถานะ ไม่ใช่บังคับให้ดูแอนิเมชัน",
  motionRows:[["Hover","160–220ms","ease-out","เปลี่ยนสี / เงา / ขยับนิดเดียว"],["Press","100–140ms","ease-in-out","ตอบสนองทันทีที่กด"],["Panel / modal","220–320ms","ease-out","เฟดและปรับขนาดเล็กน้อย"],["Section reveal","450–700ms","ease-out","เลื่อนขึ้นสั้น ๆ เท่านั้น"],["Reduced motion","0–80ms","none","คงสถานะไว้ ตัดการเคลื่อนที่"]],
  qaHeading:"CHECKLIST / ตรวจคุณภาพคอมโพเนนต์",
  qaIntro:"รายการตรวจที่ใช้ได้จริงก่อนนำคอมโพเนนต์ใหม่เข้าระบบ",
  qaRows:[
   ["Visual","ใช้สี ฟอนต์ และระยะจากระบบเดียวกัน"],
   ["Interaction","มีสถานะ Hover, Focus, Active และ Disabled"],
   ["Accessibility","ตรวจความต่างสี ป้ายชื่อ และการใช้คีย์บอร์ด"],
   ["Responsive","ทดสอบจอ 390 / 768 / 1440 ไม่มีข้อความโดนตัดหรือหลุด"],
   ["Localization","ข้อความไทยและอังกฤษตัดบรรทัดโดยไม่ชนไอคอน"],
   ["Performance","ภาพขนาดพอดีและแอนิเมชันไม่ทำให้ Layout กระตุก"],
   ["Motion","การเคลื่อนไหวมีเหตุผลและรองรับ Reduced Motion"],
   ["Recovery","Loading, Empty และ Error บอกวิธีไปต่อได้"]
  ],
  handoffHeading:"TOKEN HANDOFF / ตัวอย่างการตั้งชื่อ",
  handoffNote:"ตัวอย่างวิธีเชื่อม Primitive Tokens ไปสู่ Semantic และ Component Tokens"
 }
} as const;

const specExpansion={
 en:{
  snapshotTitle:"One system, many touchpoints",
  snapshotIntro:"An interface composition built from the same visual decisions documented throughout this guide.",
  snapshotName:"A little space to explore",
  snapshotBody:"Expressive display type sits beside readable copy, clear navigation and an unambiguous action.",
  snapshotAction:"View the details",
  snapshotHelp:"Focus visible · Clear action · Structured spacing",
  snapshotDecisions:"DESIGN DECISIONS / QUICK REFERENCE",
  snapshotRows:[
   ["PRIMARY","Studio blue","Action and links · #3468A3"],
   ["SECONDARY","Soft sage","Selection and support · #538A70"],
   ["TYPE PAIR","Patrick Hand + DM Sans","Expressive headings, restrained controls"],
   ["SURFACE","Paper + ink","Warm background and legible text"],
   ["INTERACTION","Focus / hover / active","Feedback without visual clutter"]
  ],
  principleTitle:"PRINCIPLES INTO DECISIONS",
  principleIntro:"The value of a design principle is the decision it changes. Compare each preferred pattern with its common failure.",
  principleColumns:["DECISION","DO / RECOMMENDED","AVOID / ANTI-PATTERN","WHY IT MATTERS"],
  principleRows:[
   ["Hierarchy","One clear heading and primary CTA","Everything styled as a headline","The next step is obvious."],
   ["Decorations","A few accents at section edges","Stickers on top of controls","Content stays usable."],
   ["Type","Handwriting for identity; sans for UI","Decorative lettering for long body copy","Reading stays comfortable."],
   ["Interaction","Visible focus and consistent states","Hover-only or ambiguous actions","Works by mouse, touch and keyboard."],
   ["Motion","Short transitions that confirm change","Large movement without a purpose","Motion helps comprehension."]
  ],
  componentTitle:"STATE CONTRACT / ENGINEERING HANDOFF",
  componentIntro:"A component is not complete at the default state. These are the minimum behaviors and feedback surfaces to specify.",
  componentColumns:["STATE","TRIGGER","VISUAL BEHAVIOR","INTERACTION / ACCESS"],
  componentRows:[
   ["Default","Ready to use","Normal color, 1px border","Accessible name is present."],
   ["Hover","Pointer enters","Contrast / subtle elevation","Not the sole way to reveal content."],
   ["Focus","Keyboard tab","2px+ ring with visible offset","Focus order follows the page."],
   ["Active","Pressed or selected","Brief pressed state / selected fill","Selection also has semantic state."],
   ["Loading","Action in progress","Keep geometry; show progress","Prevent duplicate submission."],
   ["Disabled","Cannot act","Muted surface and clear context","Do not conceal why."],
   ["Error","Invalid action or input","Inline message near the control","Explain how to recover."]
  ],
  stateGallery:"FEEDBACK COMPONENTS / IN CONTEXT",
  stateNotes:[
   ["SUCCESS","Saved to your collection","Confirmation stays close to the action."],
   ["NOTICE","Your preferences are updated","Inform without interrupting the workflow."],
   ["WARNING","Review this field","Explain what needs attention."],
   ["ERROR","Unable to save","Keep the entered data and offer retry."]
  ],
  blueprintTitle:"REUSABLE PAGE BLUEPRINT",
  blueprintIntro:"A documented composition for the portfolio's project-driven pages, with layout rules for responsive content and action placement.",
  blueprintRules:[
   ["01","Navigation","Persistent orientation, one selected route."],
   ["02","Headline","Clear purpose before visuals."],
   ["03","Content card","Image, context and meta in predictable order."],
   ["04","Action","Visible outside essential artwork."],
   ["05","Responsive","Preserve hierarchy as columns collapse."]
  ],
  motionTimeline:"TIMING LADDER / MICRO TO MACRO",
  motionTimelineIntro:"Keep micro-interactions quicker than section changes. The bars express relative duration, not animation playback.",
  motionTimelineRows:[["Press",120],["Hover",200],["Modal",280],["Reveal",600]],
  motionGuidance:"Use opacity and transforms for transitions. Avoid animating layout dimensions where a simple visual transition will do."
 },
 th:{
  snapshotTitle:"ระบบเดียว ใช้งานได้หลายส่วน",
  snapshotIntro:"ตัวอย่างหน้าจอที่รวมการเลือกฟอนต์ สี การจัดลำดับ และปุ่มจากแนวทางเดียวกัน",
  snapshotName:"พื้นที่เล็ก ๆ สำหรับสำรวจ",
  snapshotBody:"หัวข้อมีบุคลิกแบบลายมือ แต่เนื้อหายังอ่านง่าย เมนูชัดเจน และรู้ว่าต้องกดอะไรต่อ",
  snapshotAction:"ดูรายละเอียด",
  snapshotHelp:"Focus ชัด · ปุ่มเข้าใจง่าย · ระยะเป็นระบบ",
  snapshotDecisions:"DESIGN DECISIONS / สรุปข้อกำหนด",
  snapshotRows:[
   ["PRIMARY","Studio blue","ปุ่มหลักและลิงก์ · #3468A3"],
   ["SECONDARY","Soft sage","สถานะเลือกและองค์ประกอบรอง · #538A70"],
   ["TYPE PAIR","Patrick Hand + DM Sans","หัวข้อสร้างบุคลิก UI อ่านง่าย"],
   ["SURFACE","Paper + ink","พื้นหลังอุ่น ข้อความชัดเจน"],
   ["INTERACTION","Focus / hover / active","บอกสถานะโดยไม่ทำให้รก"]
  ],
  principleTitle:"จากหลักการสู่การตัดสินใจ",
  principleIntro:"หลักการออกแบบมีประโยชน์เมื่อช่วยตัดสินใจได้จริง ตารางนี้แสดงสิ่งที่ควรเลือกและสิ่งที่ควรหลีกเลี่ยง",
  principleColumns:["ประเด็น","ควรทำ","ควรหลีกเลี่ยง","เหตุผล"],
  principleRows:[
   ["ลำดับข้อมูล","หัวข้อหนึ่งจุดเด่นและปุ่มหลักหนึ่งจุด","ทำทุกข้อความให้เด่นเท่ากัน","เห็นสิ่งที่ต้องทำต่อ"],
   ["การตกแต่ง","ใช้ลายวาดเฉพาะขอบหรือพื้นที่รอง","วางสติกเกอร์ทับปุ่มหรือเนื้อหา","ยังใช้งานได้จริง"],
   ["ตัวอักษร","ลายมือใช้สร้างตัวตน เนื้อหาใช้ Sans","ใช้ฟอนต์ตกแต่งกับข้อความยาว","อ่านได้สบายตา"],
   ["ปฏิสัมพันธ์","แสดง Focus และ State ชัดเจน","บอกสถานะแค่ตอน Hover","ใช้ได้ทั้งเมาส์ สัมผัส คีย์บอร์ด"],
   ["โมชั่น","เคลื่อนไหวสั้นเพื่อยืนยันการกระทำ","ขยับใหญ่โดยไม่มีหน้าที่","ช่วยให้เข้าใจผลลัพธ์"]
  ],
  componentTitle:"STATE CONTRACT / สเปกส่งต่อการพัฒนา",
  componentIntro:"คอมโพเนนต์ไม่ได้มีแค่หน้าตา Default ต้องระบุพฤติกรรมในแต่ละสถานะด้วย",
  componentColumns:["สถานะ","เกิดเมื่อ","สิ่งที่เห็น","พฤติกรรมและการเข้าถึง"],
  componentRows:[
   ["Default","พร้อมให้ใช้งาน","สีปกติ ขอบ 1px","มีชื่อปุ่มที่เข้าถึงได้"],
   ["Hover","เมาส์ชี้","เปลี่ยน Contrast / เงาเล็กน้อย","ห้ามซ่อนข้อมูลไว้เฉพาะ Hover"],
   ["Focus","ใช้คีย์บอร์ด Tab","เส้น Focus อย่างน้อย 2px","ลำดับ Focus ต้องถูกต้อง"],
   ["Active","กดหรือเลือก","กดยุบสั้น ๆ / สี Selected","มีสถานะเชิงความหมาย"],
   ["Loading","กำลังทำงาน","ขนาดปุ่มไม่กระโดด แสดงความคืบหน้า","กันการส่งซ้ำ"],
   ["Disabled","ยังทำไม่ได้","สีลดน้ำหนัก และมีบริบท","ไม่ปล่อยให้สงสัยว่าทำไมกดไม่ได้"],
   ["Error","ข้อมูลไม่ถูกต้อง","ข้อความแจ้งตรงจุด","อธิบายวิธีแก้"]
  ],
  stateGallery:"FEEDBACK COMPONENTS / ตัวอย่างจริง",
  stateNotes:[
   ["SUCCESS","บันทึกลงรายการเรียบร้อย","ข้อความยืนยันอยู่ใกล้สิ่งที่กด"],
   ["NOTICE","อัปเดตการตั้งค่าแล้ว","แจ้งโดยไม่ขัดจังหวะ"],
   ["WARNING","ตรวจช่องนี้อีกครั้ง","บอกว่าต้องแก้ตรงไหน"],
   ["ERROR","บันทึกไม่สำเร็จ","เก็บข้อมูลเดิมไว้ และให้ลองใหม่"]
  ],
  blueprintTitle:"โครงหน้าใช้งานซ้ำ / PAGE BLUEPRINT",
  blueprintIntro:"ตัวอย่างการจัดหน้าสำหรับผลงานบน Portfolio เน้นลำดับข้อมูลและตำแหน่งปุ่มที่ไม่ทับภาพสำคัญ",
  blueprintRules:[
   ["01","Navigation","รู้ว่าตอนนี้อยู่ส่วนไหน"],
   ["02","Headline","อ่านแล้วเข้าใจหน้าที่ก่อนเห็นภาพ"],
   ["03","Content card","ภาพ บริบท ข้อมูลเรียงเป็นระเบียบ"],
   ["04","Action","เห็นปุ่มชัดโดยไม่ทับส่วนสำคัญของภาพ"],
   ["05","Responsive","พอคอลัมน์ลดลง ลำดับยังถูกต้อง"]
  ],
  motionTimeline:"ลำดับเวลาโมชั่น / TIMING LADDER",
  motionTimelineIntro:"การโต้ตอบเล็กควรเร็วกว่าเปลี่ยนส่วนเนื้อหา แถบแสดงสัดส่วนเวลา ไม่ใช่แอนิเมชันที่เล่นจริง",
  motionTimelineRows:[["Press",120],["Hover",200],["Modal",280],["Reveal",600]],
  motionGuidance:"ควร Animate ด้วย opacity และ transform ก่อน ไม่เปลี่ยนขนาด Layout โดยไม่จำเป็น"
 }
} as const;
export default function DesignSystemModal({open,onClose,language}:Props){
 const t=textSet[language],docs=documentation[language],spec=specExpansion[language],dialog=useRef<HTMLElement>(null),scrollArea=useRef<HTMLDivElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 const lastFocus=useRef<HTMLElement|null>(null);
 const [active,setActive]=useState("overview"),[copied,setCopied]=useState<string|null>(null),[clicked,setClicked]=useState(false),[navChoice,setNavChoice]=useState(0),[input,setInput]=useState(""),[touched,setTouched]=useState(false),[expanded,setExpanded]=useState(false),[replay,setReplay]=useState(0);
 useEffect(()=>{
  if(!open)return;
  lastFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();onClose();return}
   if(e.key!=="Tab"||!dialog.current)return;
   const focusables=Array.from(dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(node=>node.getClientRects().length>0);
   const first=focusables[0],last=focusables[focusables.length-1];
   if(!first||!last)return;
   if(e.shiftKey&&(document.activeElement===first||!dialog.current.contains(document.activeElement))){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&(document.activeElement===last||!dialog.current.contains(document.activeElement))){e.preventDefault();first.focus()}
  };
  document.addEventListener("keydown",onKey);
  const frame=requestAnimationFrame(()=>closeButton.current?.focus({preventScroll:true}));
  return()=>{document.removeEventListener("keydown",onKey);cancelAnimationFrame(frame);document.body.style.overflow=oldOverflow;lastFocus.current?.focus({preventScroll:true})};
 },[open,onClose]);
 // Entrance animations are scoped to the modal scrollport and only enhance
 // already-visible content; no information is hidden if an observer fails.
 useEffect(()=>{
  if(!open||typeof IntersectionObserver==="undefined"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const scroller=scrollArea.current;
  if(!scroller)return;
  const targets=Array.from(scroller.querySelectorAll<HTMLElement>(
   ".dsm-heading,.dsm-section-feature,.dsm-principles>article,.dsm-tonal-family,.dsm-type-item,.dsm-component,.dsm-pattern-recipes>article,.dsm-guide-grid>div,.dsm-motion-grid>article,.dsm-contrast-pair,.dsm-blueprint-system,.dsm-state-contract,.dsm-decision-table,.dsm-input-spec-grid,.dsm-qa-list"
  ));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const element=entry.target as HTMLElement;
    element.classList.add("dsm-entered");
    observer.unobserve(element);
   }
  },{root:scroller,threshold:0.08,rootMargin:"0px 0px -5% 0px"});
  targets.forEach((node,index)=>{
   node.style.setProperty("--dsm-enter-delay",String(index%3*45)+"ms");
   observer.observe(node);
  });
  return ()=>{observer.disconnect();targets.forEach(node=>{node.classList.remove("dsm-entered");node.style.removeProperty("--dsm-enter-delay")})};
 },[open]);
 if(!open||typeof document==="undefined")return null;
 const goTo=(section:string)=>{
  const scroller=scrollArea.current;
  const node=scroller?.querySelector<HTMLElement>('[data-system-section="'+section+'"]');
  if(!scroller||!node)return;
  const stickyNav=scroller.querySelector<HTMLElement>(".dsm-chapter-nav");
  const offset=node.getBoundingClientRect().top-scroller.getBoundingClientRect().top+scroller.scrollTop-(stickyNav?.offsetHeight??0)-14;
  // A long smooth scroll across nine chapters makes navigation feel stuck.
  // Snap for distant chapters; keep the gentle motion for nearby chapters.
  const farAway=Math.abs(offset-scroller.scrollTop)>1500;
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  scroller.scrollTo({top:offset,behavior:farAway||reducedMotion?"instant" as ScrollBehavior:"smooth"});
  setActive(section);
 };
 const detect=()=>{
  const scroller=scrollArea.current;if(!scroller)return;
  const maxScroll=Math.max(1,scroller.scrollHeight-scroller.clientHeight);
  dialog.current?.style.setProperty("--dsm-scroll-progress",String(Math.min(1,Math.max(0,scroller.scrollTop/maxScroll))));
  const stickyNav=scroller.querySelector<HTMLElement>(".dsm-chapter-nav");
  const boundary=scroller.getBoundingClientRect().top+(stickyNav?.offsetHeight??0)+32;
  let current="overview";
  for(const section of tabs){const node=scroller.querySelector<HTMLElement>('[data-system-section="'+section[0]+'"]');if(node&&node.getBoundingClientRect().top<=boundary)current=section[0]}
  setActive(current);
 };
 const copy=async(value:string)=>{try{await navigator.clipboard.writeText(value);setCopied(value)}catch{setCopied(null)}};
 const heading=(n:string,title:string,desc:string)=><div className="dsm-heading"><span className="dsm-number">{n} / 09</span><h2>{title}</h2><p>{desc}</p></div>;
 const out=<div className="dsm-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section ref={dialog} className="dsm-dialog" role="dialog" aria-modal="true" aria-labelledby="dsm-title" aria-describedby="dsm-desc" lang={language}>
   <div className="dsm-header">
    <div className="dsm-ident"><span className="dsm-brand-mark"><UiIcon name="grid" size={18}/></span><div><strong>DESIGN SYSTEM</strong><small>{t.strap}</small></div></div>
    <span className="dsm-version">VISUAL GUIDE <i/> 01—09</span>
    <button ref={closeButton} type="button" className="dsm-close" onClick={onClose} aria-label={t.close}><span className="dsm-close-label">{language==="th"?"ปิด":"CLOSE"}</span><UiIcon name="close" size={19}/></button>
   </div>
   <div className="dsm-layout">
    <div className="dsm-scroll" ref={scrollArea} onScroll={detect}>
     <div className="dsm-inner">
      <section className="dsm-section dsm-overview" data-system-section="overview">
       <div className="dsm-cover-meta"><span>FOUNDATIONS & INTERACTION</span><span>VOL. 01 / 2026</span></div>
       <div className="dsm-overview-grid">
        <div><span className="dsm-kicker">DESIGN / THINK / MAKE</span><h1 id="dsm-title">{t.title}<span>.</span></h1><p id="dsm-desc">{t.sub}</p></div>
        <div className="dsm-cover-art" aria-hidden="true"><span className="dsm-art-caption">VISUAL IDENTITY</span><div className="dsm-art-letter">Aa<em>✳</em></div><div className="dsm-art-chips">{colors.slice(0,5).map(c=><span style={{background:c.hex}} key={c.hex}/>)}</div><span className="dsm-art-bottom">COLORS — TYPOGRAPHY — INTERACTIONS</span></div>
       </div>
      </section>
      <nav className="dsm-chapter-nav" aria-label={t.browse}><span className="dsm-chapter-title">{t.browse}</span>{tabs.map((tab,i)=><button type="button" key={tab[0]} onClick={()=>goTo(tab[0])} className={active===tab[0]?"is-active":""}><small>{String(i+1).padStart(2,"0")}</small>{language==="th"?tab[2]:tab[1]}</button>)}</nav>
      <section className="dsm-section" data-system-section="principles">
       {heading("02",t.principles,t.principlesIntro)}
       <div className="dsm-principles">{t.principlesCards.map((v,i)=><article key={v[0]}><span>0{i+1}</span><UiIcon name={(["search","cloud","check"] as const)[i]} size={24}/><h3>{v[0]}</h3><p>{v[1]}</p></article>)}</div>
       <div className="dsm-section-feature"><span>01 / DECISIONS</span><div><h3>{spec.principleTitle}</h3><p>{spec.principleIntro}</p></div><span className="dsm-feature-badge">05 RULES</span></div>
       <div className="dsm-decision-table"><div className="dsm-decision-head">{spec.principleColumns.map(v=><span key={v}>{v}</span>)}</div>{spec.principleRows.map((v,i)=><div className="dsm-decision-row" key={v[0]}><strong><span>{String(i+1).padStart(2,"0")}</span>{v[0]}</strong><p><UiIcon name="check" size={15}/>{v[1]}</p><p><UiIcon name="close" size={15}/>{v[2]}</p><small>{v[3]}</small></div>)}</div>
      </section>
      <section className="dsm-section" data-system-section="color">
       {heading("03",t.colors,t.colorsIntro)}
       <div className="dsm-section-feature"><span>01 / 04</span><div><h3>{t.scaleTitle}</h3><p>{t.scaleIntro}</p></div><span className="dsm-feature-badge">50 → 950</span></div>
       <div className="dsm-tonal-palettes">
        {tonalPalettes.map(palette=><article className="dsm-tonal-family" key={palette.name}>
         <div className="dsm-tonal-family-heading"><div><span className="dsm-family-category">{palette.role}</span><h4>{palette.name}</h4><small>{palette.usage}</small></div><span className="dsm-swipe-hint">{language==="th"?"เลื่อนแนวนอนเพื่อดูเฉดเข้ม →":"Swipe to explore all shades →"}</span><span className="dsm-family-anchor"><i style={{background:palette.base}}/>{palette.role==="NEUTRAL"?"100":"500"} · {palette.base}</span></div>
         <div className="dsm-tone-strip" role="group" aria-label={palette.name+" tonal palette"}>
          {shadeStops.map(step=>{const hex=shadeHex(palette.base,step,palette.role==="NEUTRAL");const light=inkForShade(hex);return <button type="button" key={step} className={"dsm-tone"+(step===(palette.role==="NEUTRAL"?100:500)?" is-anchor":"")} style={{backgroundColor:hex,color:light}} onClick={()=>copy(hex)} aria-label={palette.name+" "+step+": "+hex} title={t.copy+" "+hex}>
           <span>{step}</span><small>{copied===hex?<UiIcon name="check" size={14}/>:hex}</small>
          </button>})}
         </div>
         <div className="dsm-tone-footer"><span>LIGHT / SURFACE</span><span>BRAND ANCHOR • {palette.role==="NEUTRAL"?"100":"500"}</span><span>DARK / TEXT</span></div>
        </article>)}
       </div>
       <div className="dsm-section-feature"><span>02 / 04</span><div><h3>{t.roleTitle}</h3><p>{t.roleIntro}</p></div></div>
       <div className="dsm-token-reference">
        <div className="dsm-token-reference-head"><span>PRIMITIVE</span><span>SEMANTIC / ALIAS</span><span>{t.roleLabel}</span><span>{t.valueLabel}</span></div>
        {roleMap.map(role=><div className="dsm-token-reference-row" key={role.semantic}>
         <code>{role.reference}</code><strong>{role.semantic}</strong><span>{language==="th"?role.thai:role.purpose}</span><button type="button" onClick={()=>copy(role.value)} title={t.copy+" "+role.value}><i style={{background:role.value}}/><code>{role.value}</code><UiIcon name={copied===role.value?"check":"expand"} size={14}/></button>
        </div>)}
       </div>
       <div className="dsm-token-chain"><div><small>PRIMITIVE</small><strong>blue.500</strong><code>#3468A3</code></div><UiIcon name="arrow-right" size={20}/><div><small>SEMANTIC</small><strong>action.primary</strong><code>main CTA</code></div><UiIcon name="arrow-right" size={20}/><div><small>COMPONENT</small><strong>button.primary.bg</strong><code>var(--action-primary)</code></div></div>
       <div className="dsm-section-feature"><span>03 / 04</span><div><h3>{t.semanticTitle}</h3><p>{t.semanticIntro}</p></div></div>
       <div className="dsm-semantic-grid">{semanticColors.map(c=><div className="dsm-semantic-item" key={c.name} style={{background:c.soft}}><span className="dsm-semantic-dot" style={{background:c.tone}}/><div><strong style={{color:c.tone}}>{c.name}</strong><p>{language==="th"?c.th:c.description}</p><code>{c.tone}</code></div><UiIcon name={c.name==="Danger"?"close":c.name==="Success"?"check":"cloud"} size={21} style={{color:c.tone}}/></div>)}</div>
       <div className="dsm-section-feature"><span>04 / 04</span><div><h3>{docs.contrastTitle}</h3><p>{docs.contrastIntro}</p></div><span className="dsm-feature-badge">WCAG 2.2</span></div>
       <div className="dsm-contrast-matrix">
        {contrastPairs.map(pair=>{const ratio=contrastRatio(pair.fg,pair.bg);const status=ratio>=7?"aaa":ratio>=4.5?"aa":ratio>=3?"large":"fail";const statusLabel=status==="aaa"?docs.contrastStrong:status==="aa"?docs.contrastNormal:status==="large"?docs.contrastLarge:docs.contrastAvoid;
         return <article key={pair.name} className="dsm-contrast-pair">
          <div className="dsm-contrast-preview" style={{backgroundColor:pair.bg,color:pair.fg}}><strong>Aa</strong><small>Example text</small></div>
          <div className="dsm-contrast-meta"><strong>{pair.name}</strong><small>{language==="th"?pair.th:pair.purpose}</small><code>{pair.fg} / {pair.bg}</code></div>
          <div className="dsm-contrast-results"><strong>{ratio.toFixed(2)}:1</strong><span className={"dsm-contrast-status "+status}>{statusLabel}</span></div>
         </article>})}
       </div>
       <div className="dsm-sublabel">{t.application}</div><div className="dsm-application"><div className="dsm-app-light"><span>{t.appLight}</span><strong>Clear & considered.</strong><small>Ink on paper</small></div><div className="dsm-app-dark"><span>{t.appDark}</span><strong>Thoughtfully made.</strong><button type="button" onClick={()=>setClicked(!clicked)}>{clicked&&<UiIcon name="check" size={14}/>} {t.appButton}<UiIcon name="arrow-up-right" size={15}/></button></div><div className="dsm-app-accent"><span>{t.appNote}</span><div><i/><i/><i/></div></div></div><p className="dsm-fine-print">{t.colorNote}</p>
      </section>
      <section className="dsm-section" data-system-section="typography">
       {heading("04",t.typography,t.typographyIntro)}
       <div className="dsm-type-list">{typeFamilies.map(f=><div className="dsm-type-item" key={f.id}><div className="dsm-type-side"><span>{f.id}</span><strong>{f.family}</strong><small>{t[f.key]}</small></div><p className={f.css}>{t[f.sample]}</p></div>)}</div>
       <div className="dsm-sublabel">{t.textScale}</div><div className="dsm-type-table">{t.typeDetails.map((v,i)=><div key={v[0]}><span>0{i+1}</span><strong>{v[0]}</strong><code>{v[1]}</code><small>{v[2]}</small></div>)}</div>
       <div className="dsm-section-feature"><span>01 / 01</span><div><h3>{docs.typeHeading}</h3><p>{docs.typeIntro}</p></div><span className="dsm-feature-badge">07 STYLES</span></div>
       <div className="dsm-font-spec-table">
        <div className="dsm-font-spec-head"><span>ROLE / TOKEN</span><span>SPECIMEN</span><span>FAMILY</span><span>SIZE / LINE</span><span>WEIGHT</span></div>
        {docs.typeRows.map((v,i)=><div className="dsm-font-spec-row" key={v[1]}>
         <div><small>{String(i+1).padStart(2,"0")} · {v[0]}</small><code>{v[1]}</code></div>
         <p className={"dsm-font-sample "+v[6]}>{v[5]}</p>
         <span>{v[2]}</span><code>{v[3]}</code><span>{v[4]}</span>
        </div>)}
       </div>
       <div className="dsm-type-guidance"><span className="dsm-sublabel">TYPE USAGE / RULES</span><div>{docs.typeRules.map((rule,i)=><p key={rule}><b>{String(i+1).padStart(2,"0")}</b>{rule}</p>)}</div></div>
      </section>
      <section className="dsm-section" data-system-section="layout">
       {heading("05",t.layout,t.layoutIntro)}
       <div className="dsm-sublabel">{t.scale}</div><div className="dsm-spacing">{spacing.map(v=><div key={v}><div className="dsm-spacing-bar" style={{height:v*1.15}}/><strong>{v}</strong><small>px</small></div>)}</div>
       <div className="dsm-layout-grid"><article><span className="dsm-sublabel">{t.container}</span><div className="dsm-container-illustration"><span>MAX 1160 PX</span><div/></div><p>{t.containerNote}</p></article><article><span className="dsm-sublabel">{t.responsive}</span><div className="dsm-device-row">{[["01",t.rDesktop],["02",t.rTablet],["03",t.rMobile]].map((v,i)=><div className={"dsm-device dsm-device-"+i} key={v[0]}><i/><small>{v[1]}</small></div>)}</div><p>{t.rDesktopInfo}<br/>{t.rTabletInfo}<br/>{t.rMobileInfo}</p></article></div><p className="dsm-fine-print">{t.rNote}</p>
       <div className="dsm-section-feature"><span>01 / 02</span><div><h3>{docs.gridHeading}</h3><p>{docs.gridIntro}</p></div><span className="dsm-feature-badge">12 / 8 / 4</span></div>
       <div className="dsm-grid-system">
        <div className="dsm-grid-ruler"><span>12-COLUMN LAYOUT</span><strong>CONTENT / 1160PX MAX</strong><span>GUTTER / 24PX</span></div>
        <div className="dsm-grid-track" aria-hidden="true">{Array.from({length:12},(_,i)=><span key={i}>{String(i+1).padStart(2,"0")}</span>)}</div>
        <div className="dsm-grid-mock"><div><span>CONTENT BLOCK / 08 COL</span></div><div><span>SIDEBAR / 04 COL</span></div></div>
       </div>
       <div className="dsm-grid-devices">{docs.gridRows.map((v,i)=><article key={v[0]}><div className="dsm-grid-device-top"><b>{v[0]}</b><code>{v[1]}</code></div><div className={"dsm-grid-device-mini device-"+i} aria-hidden="true">{Array.from({length:i===0?12:i===1?8:4},(_,j)=><i key={j}/>)}</div><div className="dsm-grid-device-data"><span>{v[2]}</span><span>{v[3]}</span></div><p>{v[4]}</p></article>)}</div>
       <div className="dsm-section-feature"><span>02 / 02</span><div><h3>{docs.surfaceHeading}</h3><p>{docs.surfaceIntro}</p></div></div>
       <div className="dsm-foundation-spec">
        <article><span className="dsm-sublabel">CORNER RADIUS / TOKENS</span><div className="dsm-radius-spec">{docs.surfaceRows.map((v,i)=><div key={v[0]}><span style={{borderRadius:i===3?"999px":v[1]}}>{v[1]}</span><strong>{v[0]}</strong><small>{v[2]}</small></div>)}</div></article>
        <article><span className="dsm-sublabel">LAYER / ELEVATION</span><div className="dsm-layer-spec">{docs.layerRows.map((v,i)=><div key={v[0]}><span className={"dsm-level-spec level-"+i}><UiIcon name={i===3?"expand":i===2?"cloud":i===1?"grid":"check"} size={21}/></span><div><strong>{v[0]}</strong><small>{v[1]}</small><span>{v[2]}</span></div></div>)}</div></article>
       </div>
      </section>
      <section className="dsm-section" data-system-section="components">
       {heading("06",t.components,t.componentsIntro)}
       <div className="dsm-section-feature"><span>01 / 05</span><div><h3>{t.matrixTitle}</h3><p>{t.matrixIntro}</p></div><span className="dsm-feature-badge">6 × 6 = 36</span></div>
       <div className="dsm-matrix-scroll">
        <div className="dsm-button-matrix" role="table" aria-label={t.matrixTitle}>
         <div className="dsm-matrix-row dsm-matrix-header" role="row"><div role="columnheader">{t.buttonStates} ↓ / VARIANT →</div>{variants.map(v=><div key={v} role="columnheader">{v}</div>)}</div>
         {variantStates.map(state=><div className="dsm-matrix-row" key={state} role="row"><div role="rowheader"><span className="dsm-state-index">{String(variantStates.indexOf(state)+1).padStart(2,"0")}</span>{state}</div>
          {variants.map(variant=><div className="dsm-matrix-cell" role="cell" key={variant}><span className={"dsm-variant-example variant-"+variant.toLowerCase()+" state-"+state.toLowerCase()} aria-label={variant+" "+state}>{state==="Loading"&&<span className="dsm-inline-spinner"/>}{language==="th"?"ตัวอย่าง":"Button"}{variant==="Text"&&<UiIcon name="arrow-up-right" size={14}/>}</span></div>)}
         </div>)}
        </div>
       </div>
       <div className="dsm-section-feature"><span>02 / 05</span><div><h3>{t.buttonUsage}</h3><p>{language==="th"?"ปุ่มแต่ละประเภทมีลำดับความสำคัญและจุดประสงค์ต่างกัน":"Choose a button by its job and importance, not by color alone."}</p></div></div>
       <div className="dsm-button-spec-grid">
        <div className="dsm-button-usage">{variants.map((variant,i)=><div key={variant}><span className={"dsm-variant-dot variant-"+variant.toLowerCase()}>{String(i+1).padStart(2,"0")}</span><strong>{variant}</strong><p>{([language==="th"?"ปุ่มหลักที่เด่นที่สุดในหน้าหนึ่ง":"One dominant action per section",language==="th"?"ปุ่มช่วยเสริมปุ่มหลัก":"Supporting but visible",language==="th"?"ปุ่มกรอบเส้นสำหรับการกระทำทั่วไป":"Neutral outlined action",language==="th"?"ปุ่มน้ำหนักเบา ใช้ในแถบเครื่องมือ":"Quiet toolbar action",language==="th"?"ใช้กับลิงก์รองภายในเนื้อหา":"Low-emphasis text action",language==="th"?"ใช้กับการลบหรือกระทำที่เสี่ยง":"Irreversible / destructive action"])[i]}</p></div>)}</div>
        <div className="dsm-button-anatomy">
         <div className="dsm-sublabel">{t.buttonSizes}</div>
         <div className="dsm-button-sizes">{[["S","36px","12px"],["M","44px","14px"],["L","54px","16px"]].map(v=><div key={v[0]}><button type="button" onClick={()=>setClicked(v=>!v)} style={{height:v[1],fontSize:v[2]}}>{v[0]} · Button<UiIcon name="arrow-up-right" size={16}/></button><span>{v[0]} / {v[1]}</span></div>)}</div>
         <div className="dsm-anatomy-panel"><div className="dsm-anatomy-button"><UiIcon name="cloud" size={18}/>Button label<UiIcon name="arrow-up-right" size={18}/></div><div className="dsm-anatomy-measures"><span>ICON · 18PX</span><span>LABEL · 600–700</span><span>GAP · 8PX</span><span>RADIUS · 8–12PX</span><span>FOCUS · 2PX+</span></div></div>
        </div>
       </div>
       <div className="dsm-section-feature"><span>03 / 05</span><div><h3>{t.liveTest}</h3><p>{language==="th"?"ตัวอย่างนี้กดได้จริง เพื่อดูปฏิกิริยาของ UI":"Live samples respond to real clicks and text input."}</p></div></div>
       <div className="dsm-component-grid">
        <article className="dsm-component"><span className="dsm-sublabel">{t.actions}</span><div className="dsm-button-stack"><button className="dsm-btn-primary" type="button" onClick={()=>setClicked(!clicked)}>{clicked?<UiIcon name="check" size={16}/>:null}{t.primary}<UiIcon name="arrow-up-right" size={16}/></button><button className="dsm-btn-secondary" type="button" onClick={()=>setClicked(!clicked)}>{t.secondary}</button><button className="dsm-btn-ghost" type="button" onClick={()=>setClicked(!clicked)}>{t.ghost}<UiIcon name="arrow-right" size={16}/></button><button className="dsm-btn-disabled" type="button" disabled>{t.disabled}</button></div><div className="dsm-demo-status" aria-live="polite">{clicked?t.status:"DEFAULT · HOVER · ACTIVE · DISABLED"}</div></article>
        <article className="dsm-component"><span className="dsm-sublabel">{t.navigation}</span><div className="dsm-navigation">{[t.navHome,t.navWork,t.navPlay,t.navContact].map((name,i)=><button type="button" key={name} aria-pressed={navChoice===i} className={navChoice===i?"is-active":""} onClick={()=>setNavChoice(i)}>{name}</button>)}</div><div className="dsm-sublabel">{t.tags}</div><div className="dsm-tags"><span>{t.tag1}</span><span>{t.tag2}</span><span>{t.tag3}</span></div></article>
        <article className="dsm-component"><span className="dsm-sublabel">{t.fields}</span><label className="dsm-field-label" htmlFor="dsm-input">{t.fieldLabel}</label><input id="dsm-input" value={input} onChange={e=>{setInput(e.target.value);setTouched(true)}} onBlur={()=>setTouched(true)} placeholder={t.fieldPlaceholder} aria-invalid={touched&&input.trim().length<2} aria-describedby="dsm-field-feedback"/><small id="dsm-field-feedback" className={touched&&input.trim().length<2?"dsm-error":"dsm-field-help"}>{touched?(input.trim().length<2?t.fieldError:t.success):t.fieldHelp}</small><label className="dsm-toggle-line"><span>{t.toggle}</span><input type="checkbox" checked={expanded} onChange={e=>setExpanded(e.target.checked)}/><i aria-hidden="true"/></label><p className="dsm-toggle-text" aria-live="polite">{expanded?t.on:t.off}</p></article>
        <article className="dsm-component dsm-component-card"><span className="dsm-sublabel">{t.card}</span><div className="dsm-mini-project"><div className="dsm-mini-art"><UiIcon name="grid" size={45}/><span>UI / 01</span></div><div><span className="dsm-mini-tag">CASE STUDY</span><strong>{t.cardTitle}</strong><p>{t.cardText}</p><button type="button" onClick={()=>setClicked(!clicked)}>{t.cardButton}<UiIcon name="arrow-up-right" size={16}/></button></div></div></article>
       </div>
       <div className="dsm-section-feature"><span>04 / 05</span><div><h3>{t.formsTitle}</h3><p>{t.formsIntro}</p></div></div>
       <div className="dsm-input-spec-grid">
        {["Default","Focused","Filled","Error","Success","Disabled"].map((state,i)=><div className="dsm-field-spec" key={state}>
         <div className="dsm-field-spec-top"><span>{String(i+1).padStart(2,"0")} / {state}</span><code>{(state==="Error"?"border.error":state==="Focused"?"focus.ring":state==="Success"?"border.success":"border.default")}</code></div>
         <label>{t.fieldLabel}</label><input type="text" readOnly disabled={state==="Disabled"} className={"dsm-input-"+state.toLowerCase()} value={["","","Manee","","Manee",""][i]} placeholder={t.fieldPlaceholder} aria-label={state+" input specimen"}/>
         <small className={"dsm-field-caption "+(state==="Error"?"is-error":state==="Success"?"is-success":"")}>{state==="Error"?t.fieldError:state==="Success"?t.success:state==="Focused"?"Focus / 2px ring":state==="Disabled"?"Disabled / no interaction":state==="Filled"?"Filled / valid input":t.fieldHelp}</small>
        </div>)}
       </div>
       <div className="dsm-section-feature"><span>05 / 05</span><div><h3>{t.controlsTitle}</h3><p>{t.controlsIntro}</p></div></div>
       <div className="dsm-control-spec-grid">
        <article><span className="dsm-sublabel">CHECKBOX</span><label><input type="checkbox" defaultChecked/> Selected</label><label><input type="checkbox"/> Default</label><label><input type="checkbox" disabled/> Disabled</label></article>
        <article><span className="dsm-sublabel">RADIO</span><label><input type="radio" name="dsm-radio-test" defaultChecked/> Option A</label><label><input type="radio" name="dsm-radio-test"/> Option B</label><label><input type="radio" name="dsm-radio-test" disabled/> Disabled</label></article>
        <article><span className="dsm-sublabel">SWITCH / PROGRESS</span><label className="dsm-control-switch"><input type="checkbox" defaultChecked/> Enabled</label><label className="dsm-control-switch"><input type="checkbox"/> Off</label><div className="dsm-progressbar"><span style={{width:"68%"}}/></div><small>68% / progress</small></article>
       </div>
       <div className="dsm-sublabel dsm-feedback-label">{t.feedbackTitle}</div>
       <div className="dsm-feedback-examples">{semanticColors.map(c=><div key={c.name} style={{background:c.soft,borderLeftColor:c.tone}}><UiIcon name={c.name==="Danger"?"close":c.name==="Success"?"check":"cloud"} size={21} style={{color:c.tone}}/><div><strong style={{color:c.tone}}>{c.name}</strong><span>{language==="th"?c.th:c.description}</span></div></div>)}</div>
       <div className="dsm-section-feature"><span>06 / HANDOFF</span><div><h3>{spec.componentTitle}</h3><p>{spec.componentIntro}</p></div><span className="dsm-feature-badge">07 STATES</span></div>
       <div className="dsm-state-contract"><div className="dsm-state-contract-head">{spec.componentColumns.map(v=><span key={v}>{v}</span>)}</div>{spec.componentRows.map((v,i)=><div className="dsm-state-contract-row" key={v[0]}><strong><span className={"dsm-state-dot state-"+i}/>{v[0]}</strong><span>{v[1]}</span><span>{v[2]}</span><span>{v[3]}</span></div>)}</div>
       <div className="dsm-ref-header dsm-ref-header-small"><div><span>COMPONENT SPECIMENS</span><h3>{spec.stateGallery}</h3></div><span>CONTEXT + CONTENT + STATUS</span></div>
       <div className="dsm-status-showcase">{spec.stateNotes.map((v,i)=><article key={v[0]} className={"dsm-status-example status-"+i}><div className="dsm-status-symbol"><UiIcon name={i===0?"check":i===3?"close":i===2?"clock":"book"} size={20}/></div><div><small>{v[0]}</small><strong>{v[1]}</strong><p>{v[2]}</p></div><UiIcon name="close" size={14}/></article>)}</div>
      </section>
      <section className="dsm-section" data-system-section="patterns">
       {heading("07",t.patterns,t.patternsIntro)}
       <div className="dsm-pattern-grid">{t.patternCards.map((v,i)=><article key={v[0]}><span className="dsm-pattern-diagram"><i/><i/><i/></span><small>0{i+1}</small><strong>{v[0]}</strong><p>{v[1]}</p></article>)}</div>
       <div className="dsm-section-feature"><span>01 / 02</span><div><h3>{docs.patternsHeading}</h3><p>{docs.patternsIntro}</p></div><span className="dsm-feature-badge">04 RECIPES</span></div>
       <div className="dsm-pattern-recipes">{docs.patterns.map((v,i)=><article key={v[0]}>
        <div className="dsm-pattern-recipe-top"><span>{String(i+1).padStart(2,"0")}</span><UiIcon name={(["menu","grid","expand","check"] as const)[i]} size={21}/></div><h4>{v[0]}</h4><p>{v[1]}</p>
        <div className="dsm-pattern-preview" aria-hidden="true">
         {i===0?<><span className="dsm-preview-nav is-current">HOME</span><span className="dsm-preview-nav">WORK</span><span className="dsm-preview-nav">PLAY</span></>:i===1?<><span className="dsm-preview-img"><UiIcon name="grid" size={22}/></span><span className="dsm-preview-project"><i/><i/><i/></span></>:i===2?<><span className="dsm-preview-dialog"><b>DETAILS</b><span>One scroll area</span><i/></span></>:<><span className="dsm-preview-status"><UiIcon name="check" size={16}/> Done</span><span className="dsm-preview-status empty"><UiIcon name="search" size={16}/> Empty</span></>}
        </div><div className="dsm-pattern-flow"><span>BEHAVIOR</span>{v[2]}</div>
       </article>)}</div>
       <div className="dsm-detail-header"><span className="dsm-number">DETAILS / 02</span><h3>{t.iconTitle}</h3><p>{t.iconText}</p></div>
       <div className="dsm-detail-grid">
        <article><span className="dsm-sublabel">{t.iconLabel}</span>
         <div className="dsm-icon-library">{(["arrow-up-right","search","heart","grid","check","book","cloud","close"] as const).map(icon=><span key={icon}><UiIcon name={icon} size={22}/></span>)}</div>
         <div className="dsm-detail-foot"><span>16 PX</span><span>20 PX</span><span>24 PX</span><span>LINE / ROUND CAPS</span></div>
        </article>
        <article><span className="dsm-sublabel">{t.surfaceLabel}</span>
         <div className="dsm-surfaces"><span>08</span><span>12</span><span>16</span><span><UiIcon name="grid" size={24}/></span></div>
         <p>{t.surfaceNote}</p>
        </article>
       </div>
       <div className="dsm-do-dont"><div><h3><UiIcon name="check" size={19}/>{t.do}</h3>{t.doList.map(s=><p key={s}><UiIcon name="check" size={15}/>{s}</p>)}</div><div><h3><UiIcon name="close" size={19}/>{t.dont}</h3>{t.dontList.map(s=><p key={s}><UiIcon name="close" size={15}/>{s}</p>)}</div></div>
       <div className="dsm-section-feature"><span>03 / COMPOSITION</span><div><h3>{spec.blueprintTitle}</h3><p>{spec.blueprintIntro}</p></div><span className="dsm-feature-badge">5 ANATOMY POINTS</span></div>
       <div className="dsm-blueprint-system">
        <div className="dsm-blueprint-canvas" aria-label="Example of a reusable content page layout">
         <div className="dsm-blueprint-ruler"><span>PAGE / EDITORIAL</span><span>LAYOUT 08 + 04</span></div>
         <div className="dsm-blueprint-nav"><span>01 / LOGO</span><div><i/><i/><i/></div><b>ACTIVE</b></div>
         <div className="dsm-blueprint-hero"><div><span>02 / TITLE</span><b>Clear content hierarchy.</b><i/><i/></div><div><span>VISUAL / 01</span><UiIcon name="grid" size={28}/></div></div>
         <div className="dsm-blueprint-content"><div><span>03 / CONTENT</span><div className="dsm-blueprint-lines"><i/><i/><i/></div><div className="dsm-blueprint-button"><span>04 / ACTION</span><UiIcon name="arrow-up-right" size={15}/></div></div><div><span>META / SIDEBAR</span><i/><i/><i/></div></div>
         <div className="dsm-blueprint-foot"><UiIcon name="check" size={14}/>05 / RESPONSIVE RE-FLOW</div>
        </div>
        <div className="dsm-blueprint-notes">{spec.blueprintRules.map(v=><div key={v[0]}><strong>{v[0]}</strong><div><b>{v[1]}</b><p>{v[2]}</p></div></div>)}</div>
       </div>
      </section>
      <section className="dsm-section" data-system-section="motion">
       {heading("08",t.motion,t.motionIntro)}
       <div className="dsm-motion-grid">{t.motionCards.map((v,i)=><article key={v[0]}><span>{String(i+1).padStart(2,"0")}</span><div key={replay+"-"+i} className={"dsm-motion-symbol dsm-motion-symbol-"+i}><UiIcon name={(["arrow-up-right","cloud","check"] as const)[i]} size={30}/></div><strong>{v[0]}</strong><h3>{v[1]}</h3><p>{v[2]}</p></article>)}</div><button type="button" className="dsm-replay-button" onClick={()=>setReplay(v=>v+1)}><UiIcon name="refresh" size={16}/>{t.replay}</button>
       <div className="dsm-section-feature"><span>01 / 01</span><div><h3>{docs.motionHeading}</h3><p>{docs.motionIntro}</p></div></div>
       <div className="dsm-motion-spec-table"><div className="dsm-motion-spec-head"><span>INTERACTION</span><span>DURATION</span><span>EASING</span><span>BEHAVIOR / PURPOSE</span></div>
        {docs.motionRows.map((v,i)=><div className="dsm-motion-spec-row" key={v[0]}><span><b>{String(i+1).padStart(2,"0")}</b>{v[0]}</span><code>{v[1]}</code><code>{v[2]}</code><span>{v[3]}</span></div>)}
       </div>
       <div className="dsm-ref-header dsm-ref-header-small"><div><span>INTERACTION TIMING / TOKENS</span><h3>{spec.motionTimeline}</h3><p>{spec.motionTimelineIntro}</p></div><span>120 / 200 / 280 / 600</span></div>
       <div className="dsm-timing-ruler"><div className="dsm-timing-axis"><span>0 MS</span><span>200 MS</span><span>400 MS</span><span>600 MS</span></div>{spec.motionTimelineRows.map((v,i)=><div className="dsm-timing-row" key={v[0]}><strong>{v[0]}</strong><div><span style={{width:(v[1]/600*100)+"%"}} className={"timing-"+i}/></div><code>{v[1]}ms</code></div>)}</div><p className="dsm-timing-note"><UiIcon name="check" size={16}/>{spec.motionGuidance}</p>
       <div className="dsm-access"><div className="dsm-sublabel">{t.accessTitle}</div>{t.access.map(v=><div key={v}><UiIcon name="check" size={17}/><span>{v}</span></div>)}</div>
      </section>
      <section className="dsm-section dsm-guidelines" data-system-section="guidelines">
       {heading("09",t.guidelines,t.guidelinesIntro)}
       <div className="dsm-guide-grid">{t.guideItems.map(v=><div key={v[0]}><span>{v[0]}</span><h3>{v[1]}</h3><p>{v[2]}</p></div>)}</div>
       <div className="dsm-section-feature"><span>01 / 02</span><div><h3>{docs.qaHeading}</h3><p>{docs.qaIntro}</p></div><span className="dsm-feature-badge">08 CHECKS</span></div>
       <div className="dsm-qa-list">{docs.qaRows.map((v,i)=><div key={v[0]}><span className="dsm-qa-number">{String(i+1).padStart(2,"0")}</span><strong>{v[0]}</strong><p>{v[1]}</p><span className="dsm-qa-pending">REVIEW</span></div>)}</div>
       <div className="dsm-section-feature"><span>02 / 02</span><div><h3>{docs.handoffHeading}</h3><p>{docs.handoffNote}</p></div></div>
       <div className="dsm-handoff">
        <div className="dsm-handoff-title"><span>DESIGN TOKEN ARCHITECTURE / CSS EXAMPLE</span><button type="button" onClick={()=>copy(":root { --blue-500: #3468A3; --action-primary: var(--blue-500); --button-primary-bg: var(--action-primary); }")}><UiIcon name={copied?.startsWith(":root {")?"check":"expand"} size={15}/>{copied?.startsWith(":root {")?t.copied:t.copy}</button></div>
        <pre><code>{[":root {","  /* 01 - Primitive / site anchor */","  --blue-500: #3468A3;","","  /* 02 - Semantic alias */","  --action-primary: var(--blue-500);","","  /* 03 - Component */","  --button-primary-bg: var(--action-primary);","}"].join("\n")}</code></pre>
       </div>
       <div className="dsm-ending"><UiIcon name="asterisk" size={24}/><strong>{t.finish}</strong><p>{t.finishText}</p></div>
      </section>
     </div>
    </div>
   </div>
   <div className="dsm-bottom"><span>DESIGN SYSTEM / PORTFOLIO</span><span>{String(tabs.findIndex(s=>s[0]===active)+1).padStart(2,"0")} / 09</span><button type="button" onClick={onClose}>{t.close}<UiIcon name="close" size={14}/></button></div>
  </section>
 </div>;
 return createPortal(out,document.body);
}
