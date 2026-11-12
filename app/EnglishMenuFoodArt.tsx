import {memo,type ReactNode} from "react";

/**
 * Small hand-drawn food pieces, not whole ingredient packaging.
 * Shared by the pan, serving dish and the drop animation.
 * All illustrations are original vector shapes and stay crisp at phone sizes.
 */
type Props={id:string;cooked?:boolean;fried?:boolean;className?:string};
const line={stroke:"#764735",strokeWidth:2.7,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
const shrimp=<>
 <g transform="translate(2 2) rotate(-12 33 40)">
  <path d="M43 18 53 8 56 21 67 15 63 31 51 33" fill="#e65b40" {...line}/>
  <path d="M55 29C49 12 29 10 19 21 7 34 14 52 27 57 39 62 51 55 55 43L42 38C39 46 30 47 25 41 19 32 28 24 38 33Z" fill="#f8764b" {...line}/>
  <path d="M21 21C28 17 37 22 42 29M16 31C20 27 29 31 34 36M18 44C24 39 30 42 31 48" stroke="#ffe0af" strokeWidth="5" strokeLinecap="round" fill="none"/>
  <path d="M21 20C30 14 38 19 42 25" stroke="#ffbf9b" strokeWidth="2" fill="none" strokeLinecap="round"/>
  <circle cx="45" cy="37" r="2.3" fill="#a33d2d"/>
 </g>
 <g transform="translate(98 67) rotate(161) scale(.77)">
  <path d="M43 18 53 8 56 21 67 15 63 31 51 33" fill="#e85f41" {...line}/>
  <path d="M55 29C49 12 29 10 19 21 7 34 14 52 27 57 39 62 51 55 55 43L42 38C39 46 30 47 25 41 19 32 28 24 38 33Z" fill="#ff8756" {...line}/>
  <path d="M21 21C28 17 37 22 42 29M16 31C20 27 29 31 34 36M18 44C24 39 30 42 31 48" stroke="#ffe3bb" strokeWidth="5" strokeLinecap="round" fill="none"/>
 </g>
 <path d="M78 24l4-7m3 25 8 4M13 66l-6 3" stroke="#ffdfaa" strokeWidth="3" strokeLinecap="round"/>
</>;
const tempura=<>
 <path d="M18 42 24 23 42 19 55 11 61 24 76 22 80 41 72 51 77 64 57 67 44 59 25 61 20 51Z" fill="#e9a747" {...line}/>
 <path d="M23 38 29 27 44 26 53 18 60 29 73 30 73 42 63 50 66 60 51 59 42 52 28 56Z" fill="#ffd57b"/>
 <path d="M64 27 83 13 87 27 101 19 93 38 79 41" fill="#f5784d" {...line}/>
 <path d="M29 33l10-7m-7 21 13 7m11-26 13 5" stroke="#fff1bd" strokeWidth="5" strokeLinecap="round"/>
 <circle cx="21" cy="48" r="4" fill="#d78939"/><circle cx="66" cy="56" r="3" fill="#d78939"/>
</>;
const egg=<>
 <path d="M12 44C7 24 27 24 32 19 44 7 58 22 67 22 84 14 105 24 103 42 108 57 91 72 77 67 64 76 47 68 35 72 14 71 13 57 12 44Z" fill="#fff4dc" {...line}/>
 <path d="M30 27C44 19 52 25 60 26" stroke="#fffefa" strokeWidth="5" strokeLinecap="round" fill="none"/>
 <ellipse cx="59" cy="45" rx="23" ry="19" fill="#f6a82a" {...line}/>
 <path d="M46 35C50 31 59 30 64 34" stroke="#ffe18c" strokeWidth="5" strokeLinecap="round" fill="none"/>
 <ellipse cx="54" cy="40" rx="7" ry="4" fill="#fff0ba" opacity=".8"/>
</>;
const tofu=<>
 {[[16,22],[50,16],[34,49],[68,45]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${i%2===0?-7:7})`}>
  <path d="M0 6 20 0 36 7 16 14Z" fill="#fffbed" {...line}/>
  <path d="M0 6 16 14 16 31 0 23Z" fill="#ead6ae" {...line}/>
  <path d="M16 14 36 7 36 23 16 31Z" fill="#f4e5c8" {...line}/>
  <path d="M5 9 16 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
 </g>)}
</>;
const meat=(pork=false)=><>
 {[[16,16,-12],[54,15,18],[33,43,-8],[66,42,11]].map(([x,y,a],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
   <path d="M1 10Q8 -1 19 4L32 2Q43 11 34 24L19 30Q4 27 1 18Z" fill={pork?"#d77e70":"#995a42"} {...line}/>
   <path d="M8 11q8-8 15-3m-11 13q11 1 19-7" fill="none" stroke={pork?"#f8c1a5":"#d7a17d"} strokeWidth="3.2" strokeLinecap="round"/>
   <path d="m9 14 5 4m11-11 4 5" fill="none" stroke="#704332" strokeWidth="2" opacity=".5"/>
  </g>)}
</>;
const noodles=(pasta=false)=><>
 <path d="M18 57Q8 21 27 20 45 19 25 46 12 66 43 68 64 68 38 27 27 9 54 14 75 18 55 45 36 72 65 72 91 71 73 32 64 10 84 19 102 29 92 51 83 69 95 67" fill="none" stroke="#9d623e" strokeWidth="11" strokeLinecap="round"/>
 <path d="M18 57Q8 21 27 20 45 19 25 46 12 66 43 68 64 68 38 27 27 9 54 14 75 18 55 45 36 72 65 72 91 71 73 32 64 10 84 19 102 29 92 51 83 69 95 67" fill="none" stroke={pasta?"#f3b86a":"#f7d09b"} strokeWidth="7" strokeLinecap="round"/>
 <path d="m30 29 7 4m39 21 9-4m-39 12 6-6" fill="none" stroke="#fff1ca" strokeWidth="3" strokeLinecap="round"/>
</>;
const tomato=<>
 {[[29,36],[61,31],[44,52],[75,51]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${i*19})`}>
  <ellipse rx="20" ry="16" fill="#eb6549" {...line}/>
  <ellipse rx="15" ry="12" fill="#f88e65"/>
  <path d="M-9-5Q0-11 9-5" fill="none" stroke="#ffbea0" strokeWidth="4" strokeLinecap="round"/>
  <circle cx="-7" cy="4" r="2" fill="#f8d78e"/><circle cx="6" cy="5" r="2" fill="#f8d78e"/>
 </g>)}
</>;
const mushrooms=<>
 {[[15,22],[54,16],[36,48],[74,46]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${i%2?17:-12})`}>
   <path d="M7 21Q-2 9 13 4 26-1 36 12L34 21Z" fill="#c79c78" {...line}/>
   <path d="M7 21 34 21 28 28 12 29Z" fill="#f6ddbb" {...line}/>
   <path d="M12 9q8-5 16 4" stroke="#f6cba6" strokeWidth="3" strokeLinecap="round" fill="none"/>
 </g>)}
</>;
const greens=(red=false)=><>
 {[[24,35,-25],[49,27,7],[65,48,30],[39,54,85]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
   <path d="M0 10Q6-19 23 0 38 23 12 32 0 23 0 10Z" fill={red?(i%2?"#e66c44":"#f39c58"):(i%2?"#75a66f":"#9ec486")} {...line}/>
   <path d="M10 26Q18 12 20 3" fill="none" stroke={red?"#f8d6a4":"#d0e4a0"} strokeWidth="3" strokeLinecap="round"/>
 </g>)}
</>;
const rice=<>
 {Array.from({length:19},(_,i)=>{const x=18+i%5*17+(i%3)*2,y=15+Math.floor(i/5)*14;return <ellipse key={i} cx={x} cy={y} rx="11" ry="6.5" transform={`rotate(${(i%4)*18-24} ${x} ${y})`} fill={i%3===0?"#f1ddac":"#fff1d1"} stroke="#c6ac83" strokeWidth="2"/>;})}
</>;
const garlic=<>
 {[[27,35],[48,25],[68,39],[45,55]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${i*22})`}><path d="M-10 6Q-9-9 0-15 10-8 12 4 8 13-6 12Z" fill="#ffedbb" {...line}/><path d="M-4 1Q-3-7 0-9" fill="none" stroke="#fffbea" strokeWidth="3" strokeLinecap="round"/></g>)}
</>;
function artwork(id:string, fried:boolean):ReactNode{
 switch(id){
  case "shrimp":return fried?tempura:shrimp;
  case "egg":return egg;
  case "tofu":return tofu;
  case "beef":return meat();
  case "pork":return meat(true);
  case "noodles":case "pasta":return noodles(id==="pasta");
  case "tomato":return tomato;
  case "mushroom":return mushrooms;
  case "carrot":case "scallion":case "spinach":case "sprouts":case "basil":case "kimchi":case "wakame":case "lemongrass":return greens(id==="kimchi");
  case "rice":return rice;
  case "garlic":return garlic;
  case "sweetpotato":return tempura;
  default:return null;
 }
}
const illustratedIds=new Set(["shrimp","egg","tofu","beef","pork","noodles","pasta","tomato","mushroom","carrot","scallion","spinach","sprouts","basil","kimchi","wakame","lemongrass","rice","garlic","sweetpotato"]);
export const hasCookingFoodArt=(id:string)=>illustratedIds.has(id);
function EnglishMenuFoodArt({id,cooked=false,fried=false,className=""}:Props){
 const piece=artwork(id,fried);
 if(!piece)return null;
 return <svg className={className+" ck-illustrated-food"+(cooked?" ck-food-cooked":"")+(fried?" ck-food-fried":"")} viewBox="0 0 112 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <ellipse cx="58" cy="75" rx="40" ry="7" fill="#765037" opacity=".13"/>
  {piece}
  <path d="m9 17 3-5M99 17l4 3" stroke="#fff3cb" strokeWidth="2.6" strokeLinecap="round" opacity=".75"/>
 </svg>;
}
export default memo(EnglishMenuFoodArt);
