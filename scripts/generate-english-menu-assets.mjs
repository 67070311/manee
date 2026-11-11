// Original, self-drawn vector food illustrations rendered to lightweight WebP.
// Re-run: node scripts/generate-english-menu-assets.mjs
import sharp from "sharp";
import {readFile,mkdir,stat} from "node:fs/promises";
import {join} from "node:path";
const base="public/playground/english-menu";
const dishIds=["pad-thai","tom-yum","bibimbap","kimchi-jjigae","tempura","miso-soup","spaghetti","margherita"];
const vocabIds=["rice","egg","carrot","spinach","beef","gochujang","kimchi","tofu","broth","scallion","mushroom","pork","noodles","shrimp","sprouts","lime","fishsauce","tamarind","lemongrass","galangal","kaffir","chili","flour","water","oil","sweetpotato","dashi","miso","wakame","pasta","tomato","garlic","basil","parmesan","dough","mozzarella","sauce","bowl","stonebowl","pan","pot","wok","spoon","knife","board","ladle","spatula","strainer","whisk","oven","bakingtray","salt"];
const palettes={
 "pad-thai":["#f8e0bf","#ecb88e","#b87938"],"tom-yum":["#d8e8de","#e5a385","#ae493d"],
 "bibimbap":["#e4eac9","#a0b7a1","#c97039"],"kimchi-jjigae":["#fae2c8","#d17a59","#a83d2a"],
 "tempura":["#e3def3","#f0d19c","#b97c36"],"miso-soup":["#dfefe0","#b8d5cc","#6e8762"],
 "spaghetti":["#f5e3bd","#e7bb8c","#d26748"],"margherita":["#f1dbc9","#d9b890","#ae4d40"]
};
function seedFor(s){let n=0;for(let i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;return n}
function random(seed){let n=seed;return()=>{n=(1664525*n+1013904223)>>>0;return n/4294967296}}
function leaf(x,y,s=1,rot=0,c="#3f8651"){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-18 13Q-21-16 28-25Q28 14-18 13Z" fill="${c}" stroke="#296e45" stroke-width="2"/><path d="M-15 10Q8-2 24-18" stroke="#a8d17c" stroke-width="2.4" fill="none"/></g>`}
function noodle(x,y,rot=0,scale=1,c="#e7b951"){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})"><path d="M-64-12C-26-43-18 18 14 1S62-17 60 22M-55 7C-4 38 2-31 45-3S70 21 35 37" fill="none" stroke="#ae7c36" stroke-width="13" stroke-linecap="round"/><path d="M-64-12C-26-43-18 18 14 1S62-17 60 22M-55 7C-4 38 2-31 45-3S70 21 35 37" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/></g>`}
function shrimp(x,y,rot=0,s=1){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-35-28C13-48 39-10 20 27C14 39-11 42-25 26C-4 14 1-3-18-9Z" fill="#f19e7e" stroke="#cb735a" stroke-width="4"/><path d="M-30-8C-9-19 8-7 14 8M-26 10C-3 5 3 22 9 30" fill="none" stroke="#ffe2bc" stroke-width="8" stroke-linecap="round"/><path d="M18 26L47 10L36 40Z" fill="#ed856a"/></g>`}
function tofu(x,y,rot=0,s=1){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-24-13L1-24L26-10L1 1Z" fill="#fff8df" stroke="#d4bf9e" stroke-width="2"/><path d="M-24-13L1 1V30L-24 15Z" fill="#e9d9b6"/><path d="M1 1L26-10V16L1 30Z" fill="#f5e8cb"/></g>`}
function tomato(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="25" fill="#df594a" stroke="#ae3f35" stroke-width="3"/><circle cx="-8" cy="-7" r="7" fill="#ef8672" opacity=".7"/>${leaf(0,-20,.5,25,"#408050")}</g>`}
function egg(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-54-8C-61-39-15-52 8-35C34-54 63-19 48 7C70 45 30 57-7 47C-42 64-66 32-54-8Z" fill="#fffdf0" stroke="#e9e2ca" stroke-width="4"/><circle r="27" fill="#f4ae37" stroke="#ee9729" stroke-width="4"/><circle cx="-7" cy="-8" r="9" fill="#ffdf75" opacity=".7"/></g>`}
function mushroom(x,y,s=1,rot=0){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-16 1V25Q0 34 17 25V1" fill="#f8ebcf" stroke="#aa8467" stroke-width="3"/><path d="M-30 2Q-26-32 0-30Q27-27 30 2Z" fill="#d4b396" stroke="#977761" stroke-width="3"/><path d="M-15-10Q0-23 17-9" fill="none" stroke="#eed7bd" stroke-width="5"/></g>`}
function stripe(x,y,rot=0,c="#78a455"){return `<path d="M${x-25} ${y-8} Q${x} ${y+10} ${x+25} ${y-10}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" transform="rotate(${rot} ${x} ${y})"/>`}
function baseScene(id){const [bg,second,accent]=palettes[id],rand=random(seedFor(id));let flecks="";for(let i=0;i<32;i++){const x=Math.round(rand()*800),y=Math.round(rand()*800),size=rand()*4+1;flecks+=`<circle cx="${x}" cy="${y}" r="${size}" fill="#ffffff" opacity=".24"/>`}
return `<defs><radialGradient id="back"><stop stop-color="${bg}"/><stop offset="1" stop-color="${second}"/></radialGradient><radialGradient id="food"><stop stop-color="#fbf0c6"/><stop offset="1" stop-color="${accent}"/></radialGradient><filter id="shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="23" stdDeviation="22" flood-color="#624932" flood-opacity=".25"/></filter></defs><rect width="800" height="800" fill="url(#back)"/><circle cx="108" cy="137" r="126" fill="#ffffff" opacity=".14"/><circle cx="754" cy="688" r="180" fill="#ffffff" opacity=".12"/>${flecks}<ellipse cx="405" cy="680" rx="270" ry="35" fill="#735848" opacity=".12"/>`;}
function plate(id){const dark=["kimchi-jjigae","miso-soup"].includes(id);const pizza=id==="margherita";const color=pizza?"#d4a367":dark?"#353d38":"#f7f7ed", rim=pizza?"#eabe80":dark?"#f7f4e9":"#d2e7db";return `<g filter="url(#shadow)"><circle cx="400" cy="414" r="285" fill="${color}" stroke="${rim}" stroke-width="22"/><circle cx="400" cy="414" r="255" fill="${pizza?"#e6bd81":dark?"#414944":"#fffdf6"}" stroke="${pizza?"#d6a66d":dark?"#88948b":"#ebeee4"}" stroke-width="9"/><circle cx="400" cy="414" r="224" fill="${pizza?"#d95b42":id==="miso-soup"?"#b8a071":id==="tom-yum"?"#f0c48b":id==="kimchi-jjigae"?"#c94830":id==="bibimbap"?"#faf2d7":id==="tempura"?"#e5dbe9":id==="pad-thai"?"#d7a759":"#f5d4a4"}"/></g>`;}
function dishMarkup(id){let out="";const rand=random(seedFor(id));
 if(id==="bibimbap"){for(let i=0;i<55;i++){const a=rand()*Math.PI*2,r=rand()*210;out+=`<ellipse cx="${400+Math.cos(a)*r}" cy="${414+Math.sin(a)*r}" rx="13" ry="6" fill="#fffef2" transform="rotate(${rand()*160} ${400+Math.cos(a)*r} ${414+Math.sin(a)*r})"/>`}
 for(let i=0;i<17;i++){let a=(-155+i*12)*Math.PI/180;out+=stripe(400+125*Math.cos(a),414+125*Math.sin(a),i*20,"#ef8b3e")}
 for(let i=0;i<11;i++){let a=(30+i*9)*Math.PI/180;out+=leaf(400+145*Math.cos(a),414+145*Math.sin(a),.55,i*28,"#43824c")}
 for(let i=0;i<10;i++){let a=(175+i*8)*Math.PI/180;out+=stripe(400+150*Math.cos(a),414+150*Math.sin(a),30,"#805538")}
 out+=egg(403,419,1.3);out+=`<path d="M315 520Q397 571 470 525" stroke="#b84d34" stroke-width="12" stroke-linecap="round" fill="none"/>`;
 }else if(id==="kimchi-jjigae"){for(let i=0;i<17;i++){let x=245+rand()*295,y=247+rand()*311;out+=`<path d="M${x-30} ${y}Q${x-14} ${y-25} ${x+16} ${y-11}Q${x+42} ${y+4} ${x+20} ${y+23}Q${x-11} ${y+36} ${x-30} ${y}Z" fill="#e88356" stroke="#f8bb74" stroke-width="6"/>`}
 for(let i=0;i<6;i++)out+=tofu(275+rand()*260,260+rand()*290,rand()*100,.8);
 for(let i=0;i<6;i++)out+=leaf(260+rand()*290,260+rand()*260,.52,rand()*360);
 for(let i=0;i<18;i++)out+=`<circle cx="${240+rand()*320}" cy="${220+rand()*355}" r="${2+rand()*4}" fill="#ffd8a6" opacity=".7"/>`;
 }else if(id==="pad-thai"||id==="spaghetti"){for(let i=0;i<10;i++)out+=noodle(320+rand()*190,330+rand()*170,rand()*330,.7,id==="pad-thai"?"#f9ce70":"#f7d777");
 for(let i=0;i<6;i++)out+=id==="pad-thai"?shrimp(300+rand()*205,320+rand()*180,rand()*360,.73):tomato(310+rand()*180,310+rand()*180,.68);
 for(let i=0;i<9;i++)out+=leaf(275+rand()*250,270+rand()*265,.48,rand()*360,id==="pad-thai"?"#4a9860":"#3a8552");
 if(id==="pad-thai"){out+=`<path d="M200 500Q210 450 260 488L228 545Z" fill="#b9ce4c" stroke="#658f41" stroke-width="6"/>`;for(let i=0;i<14;i++)out+=stripe(260+rand()*290,250+rand()*310,rand()*180,"#f8f4d9")}
 }else if(id==="tom-yum"){for(let i=0;i<7;i++)out+=shrimp(290+rand()*240,275+rand()*260,rand()*360,.8);for(let i=0;i<7;i++)out+=mushroom(300+rand()*195,287+rand()*230,.75,rand()*360);for(let i=0;i<8;i++)out+=leaf(290+rand()*230,280+rand()*260,.7,rand()*360,"#398851");for(let i=0;i<5;i++)out+=stripe(300+rand()*200,290+rand()*240,rand()*330,"#a1be6e");
 }else if(id==="tempura"){for(let i=0;i<7;i++){let a=(i*50-170)*Math.PI/180,x=405+Math.cos(a)*105,y=419+Math.sin(a)*105;out+=`<g transform="translate(${x} ${y}) rotate(${i*50})"><path d="M-38 40Q-58-35 2-70Q52-40 32 40Z" fill="#f4c56b" stroke="#cb9651" stroke-width="8"/><path d="M-23 25L-15-35M0 30L6-48M17 22L23-23" stroke="#fff0be" stroke-width="12" stroke-linecap="round"/><path d="M-24 41L0 73L23 40" fill="#f28f70"/></g>`}
 out+=leaf(460,536,1.35,21,"#4e8a5b");
 }else if(id==="miso-soup"){for(let i=0;i<9;i++)out+=tofu(285+rand()*230,288+rand()*220,rand()*180,.8);
 for(let i=0;i<8;i++)out+=leaf(320+rand()*160,290+rand()*230,.66,rand()*360,"#315a46");
 for(let i=0;i<20;i++){let x=280+rand()*225,y=280+rand()*230;out+=`<circle cx="${x}" cy="${y}" r="7" fill="#88a14b" stroke="#426e47" stroke-width="3"/>`}
 }else if(id==="margherita"){for(let i=0;i<11;i++){let a=i*Math.PI*2/11,x=400+Math.cos(a)*145,y=414+Math.sin(a)*145;out+=`<path d="M${x-32} ${y-20}Q${x+25} ${y-44} ${x+43} ${y+10}Q${x+10} ${y+41} ${x-32} ${y-20}" fill="#f9f1d5" stroke="#f5e0a7" stroke-width="6"/>`}
 for(let i=0;i<8;i++)out+=leaf(310+rand()*200,320+rand()*196,.9,rand()*360,"#3c8a4e");
 for(let i=0;i<23;i++){let a=rand()*Math.PI*2,r=rand()*200;out+=`<circle cx="${400+Math.cos(a)*r}" cy="${414+Math.sin(a)*r}" r="${2+rand()*4}" fill="#e7aa5f"/>`}
 }
 if(id==="bibimbap"){
 for(let i=0;i<13;i++)out+=stripe(475+rand()*55,285+rand()*105,rand()*180,"#f39b48");
 for(let i=0;i<13;i++)out+=leaf(255+rand()*86,290+rand()*110,.8,rand()*360,"#43885d");
 for(let i=0;i<11;i++)out+=stripe(250+rand()*85,425+rand()*97,rand()*170,"#986042");
 for(let i=0;i<7;i++)out+=mushroom(463+rand()*71,455+rand()*82,.52,rand()*360);
 }
 if(id==="pad-thai"){
 for(let i=0;i<15;i++)out+=noodle(280+rand()*220,280+rand()*245,rand()*340,.78, i%4===0?"#f6df97":"#e8b652");
 for(let i=0;i<4;i++)out+=shrimp(295+rand()*220,305+rand()*200,rand()*360,.73);
 for(let i=0;i<10;i++)out+=stripe(255+rand()*280,285+rand()*235,rand()*150,"#64a26b");
 }
 if(id==="margherita"){
 for(let i=0;i<9;i++)out+=leaf(267+rand()*256,290+rand()*248,.65,rand()*360,"#458a4b");
 for(let i=0;i<10;i++){let a=rand()*Math.PI*2,r=55+rand()*135,x=400+Math.cos(a)*r,y=414+Math.sin(a)*r;out+=`<ellipse cx="${x}" cy="${y}" rx="21" ry="13" fill="#f9edca" stroke="#f2dbac" stroke-width="5" transform="rotate(${rand()*180} ${x} ${y})"/>`; }
 }
 return out;
}
function dishSvg(id){const [bg,second]=palettes[id];return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${baseScene(id)}${plate(id)}${dishMarkup(id)}<g opacity=".5"><path d="M93 640q54 0 72-37m510-400q-9-47-47-63" stroke="#ffffff" stroke-width="10" stroke-linecap="round" fill="none"/></g></svg>`}
const paletteFor=id=>{
 if(["kimchi","gochujang","tomato","sauce","chili","tamarind"].includes(id))return ["#f2c8b4","#cc5548","#a44839"];
 if(["spinach","scallion","sprouts","lemongrass","kaffir","wakame","basil"].includes(id))return ["#dcebd8","#5b9863","#366b48"];
 if(["carrot","sweetpotato","shrimp","egg","miso","galangal"].includes(id))return ["#f4dfbf","#ecaa65","#c47b45"];
 if(["beef","pork","dashi","broth","fishsauce"].includes(id))return ["#ece0d0","#af7e69","#81584a"];
 return ["#e2ece1","#a7bdb2","#528277"];
};
function ingredientDrawing(id){
 const [bg,primary,secondary]=paletteFor(id);
 let art="";
 const st=(p,c=primary,w=14)=>`<path d="${p}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
 if(id==="egg")art=egg(240,248,1.5);
 else if(id==="shrimp")art=shrimp(240,245,12,2.1);
 else if(["tomato","chili"].includes(id))art= id==="tomato"?tomato(242,248,2.2):`<path d="M157 190Q292 167 299 279Q250 365 180 316Q269 301 275 260Q281 218 157 190Z" fill="#d55244" stroke="#a6423e" stroke-width="8"/>${leaf(174,186,.95,45)}`;
 else if(id==="mushroom")art=mushroom(240,246,2.6);
 else if(["spinach","basil","kaffir","wakame"].includes(id))art=[leaf(216,228,2.3,-19,"#468d58"),leaf(272,252,2,55,"#6ba96c"),leaf(180,298,1.2,-55,"#327d55")].join("");
 else if(["scallion","lemongrass","sprouts"].includes(id))art=Array.from({length:5},(_,i)=>st(`M${154+i*20} 335Q${190+i*21} 230 ${205+i*16} 160`,i%2?"#a6c888":"#6aa268",11)).join("");
 else if(["rice","flour","parmesan"].includes(id))art=`<path d="M133 285Q151 190 240 186Q328 177 355 285Q290 355 133 285Z" fill="#fff9e7" stroke="#dbd6c0" stroke-width="10"/>`+Array.from({length:15},(_,i)=>`<ellipse cx="${158+(i*43)%170}" cy="${229+(i*27)%78}" rx="13" ry="6" fill="#e8e4ca" transform="rotate(${i*21} ${158+(i*43)%170} ${229+(i*27)%78})"/>`).join("");
 else if(["pasta","noodles"].includes(id))art=[noodle(240,220,12,1.4),noodle(242,258,132,1.2,"#f7cf75")].join("");
 else if(id==="tofu"||id==="mozzarella")art=[tofu(210,217,5,1.7),tofu(272,274,-22,1.7)].join("");
 else if(id==="carrot")art=`<path d="M159 188L318 280L200 345Z" fill="#ec9749" stroke="#bd7137" stroke-width="9"/>`+leaf(170,190,1.3,-65);
 else if(["beef","pork"].includes(id))art=`<path d="M162 204Q194 145 274 172Q355 199 332 274Q304 348 211 330Q151 296 162 204Z" fill="#b46c61" stroke="#8b4946" stroke-width="10"/><path d="M205 198Q266 187 286 233T220 295" stroke="#f4b3a8" stroke-width="15" fill="none" stroke-linecap="round"/>`;
 else if(["kimchi","gochujang","miso","tamarind","sauce"].includes(id))art=`<path d="M164 183H315V315Q242 367 164 315Z" fill="#fff7e9" stroke="#d3aa84" stroke-width="10"/><path d="M175 230Q241 191 305 230V309Q244 340 175 306Z" fill="${primary}"/><ellipse cx="240" cy="186" rx="81" ry="23" fill="#f7e8d4" stroke="#d9b991" stroke-width="9"/>`;
 else if(["broth","dashi","water","fishsauce","oil"].includes(id))art=`<path d="M205 161H273V218Q328 289 287 331Q239 372 187 326Q148 277 205 218Z" fill="#cae7dd" stroke="#77a4a0" stroke-width="11"/><path d="M193 289Q240 265 296 291Q285 353 211 335Z" fill="${primary}" opacity=".83"/><rect x="213" y="140" width="53" height="34" rx="7" fill="#447c73"/>`;
 else if(id==="lime")art=`<path d="M122 265Q235 102 358 263Q248 391 122 265Z" fill="#6fa75d" stroke="#47844c" stroke-width="11"/><path d="M149 262Q239 152 332 263Q239 352 149 262Z" fill="#e8eaa4"/>${Array.from({length:7},(_,i)=>st(`M240 262 L${240+Math.cos(i*2*Math.PI/7)*83} ${262+Math.sin(i*2*Math.PI/7)*78}`,"#fff8d8",5)).join("")}`;
 else if(["salt","flour"].includes(id))art=`<path d="M176 185H299L329 326H148Z" fill="#f9f0df" stroke="#9aaead" stroke-width="10"/><rect x="175" y="225" width="125" height="76" rx="11" fill="${primary}" opacity=".55"/>`;
 else if(id==="dough")art=`<ellipse cx="245" cy="259" rx="126" ry="88" fill="#f3d59a" stroke="#c69b6b" stroke-width="9"/><path d="M178 219Q249 180 306 237" fill="none" stroke="#ffeab9" stroke-width="12" stroke-linecap="round"/>`;
 else if(id==="garlic")art=`<path d="M176 247Q151 204 185 175L221 153L248 181L279 147L312 194Q333 238 295 301Q241 343 193 308Z" fill="#f5e4cd" stroke="#ccbaa7" stroke-width="9"/><path d="M234 172Q253 220 242 317" fill="none" stroke="#d0b99e" stroke-width="9"/>`;
 else if(["pot","stonebowl","wok","pan","bowl"].includes(id)){
 const isPan=["pan","wok"].includes(id);
 art=`<ellipse cx="241" cy="270" rx="${isPan?121:112}" ry="79" fill="#3d5260" stroke="#819b9b" stroke-width="11"/><ellipse cx="240" cy="259" rx="101" ry="61" fill="#d2aa76" stroke="#e9d6b6" stroke-width="9"/>`+(isPan?st("M350 263L416 225","#697e83",25):`<path d="M127 260Q88 216 105 301L129 315M354 260Q399 215 379 302L357 318" fill="none" stroke="#657c83" stroke-width="19" stroke-linecap="round"/>`);
 }else if(id==="knife")art=`<path d="M165 153Q268 176 322 270L249 303Z" fill="#dbe5e1" stroke="#879f9d" stroke-width="9"/><path d="M247 304L333 366" stroke="#447062" stroke-width="28" stroke-linecap="round"/>`;
 else if(id==="board")art=`<rect x="130" y="170" width="218" height="167" rx="28" fill="#d6a56d" stroke="#a7794d" stroke-width="11"/><path d="M167 208H310M166 297H298" stroke="#e5bb86" stroke-width="9" stroke-linecap="round"/><circle cx="311" cy="197" r="9" fill="#fff0d1"/>`;
 else if(["spoon","ladle","strainer","spatula","whisk"].includes(id))art=`<path d="M238 251L302 355" stroke="#698b80" stroke-width="23" stroke-linecap="round"/><ellipse cx="208" cy="202" rx="57" ry="70" fill="${id==="strainer"?"#dbe5de":"#d6dfdc"}" stroke="#73958f" stroke-width="13"/>`+(id==="strainer"?Array.from({length:5},(_,i)=>st(`M${166+i*20} 174L${166+i*20} 235`,"#73958f",3)).join(""):"");
 else if(id==="oven")art=`<rect x="130" y="160" width="222" height="225" rx="23" fill="#96a9a5" stroke="#597d77" stroke-width="10"/><rect x="153" y="220" width="177" height="131" rx="8" fill="#e7ca94"/><circle cx="173" cy="193" r="11" fill="#49786d"/><circle cx="220" cy="193" r="11" fill="#49786d"/><path d="M177 273H306" stroke="#a87846" stroke-width="13"/>`;
 else if(id==="bakingtray")art=`<rect x="129" y="171" width="226" height="175" rx="24" fill="#b5c9c3" stroke="#648b82" stroke-width="16"/><rect x="148" y="190" width="188" height="137" rx="12" fill="#e9d3ae"/>`;
 else art=`<circle cx="240" cy="244" r="95" fill="${primary}" opacity=".95"/><circle cx="211" cy="210" r="32" fill="#ffffff" opacity=".4"/>`;
 return art;
}
function vocabSvg(id){const [bg,primary]=paletteFor(id);return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480"><defs><radialGradient id="g"><stop stop-color="#ffffff"/><stop offset="1" stop-color="${bg}"/></radialGradient><filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#425d48" flood-opacity=".13"/></filter></defs><rect width="480" height="480" rx="68" fill="url(#g)"/><circle cx="240" cy="248" r="155" fill="#ffffff" opacity=".65"/><g filter="url(#s)">${ingredientDrawing(id)}</g><circle cx="383" cy="96" r="18" fill="${primary}" opacity=".5"/><path d="M88 360L113 376M378 341L394 320" stroke="${primary}" stroke-width="8" stroke-linecap="round" opacity=".36"/></svg>`}
async function render(){
 await mkdir(join(base,"dishes"),{recursive:true});await mkdir(join(base,"vocab"),{recursive:true});
 const all=[];
 for(const id of dishIds){const file=join(base,"dishes",id+".webp");await sharp(Buffer.from(dishSvg(id))).webp({quality:83,effort:6}).toFile(file);all.push(file)}
 for(const id of vocabIds){const file=join(base,"vocab",id+".webp");await sharp(Buffer.from(vocabSvg(id))).resize(260,260).webp({quality:78,effort:5}).toFile(file);all.push(file)}
 const coverIn="public/playground/food-learn.png",coverOut="public/playground/food-learn.webp";
 await sharp(coverIn).resize({width:780,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(coverOut);
 let size=0;for(const f of all)size+=(await stat(f)).size;
 console.log("Generated",all.length,"original food WebP assets:",(size/1024).toFixed(1),"KB total; cover:",((await stat(coverOut)).size/1024).toFixed(1),"KB");
}
render().catch(e=>{console.error(e);process.exitCode=1});
