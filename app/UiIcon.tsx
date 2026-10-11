import type {SVGProps,ReactNode} from "react";

/** Hand-drawn line icons. Never rendered as platform-dependent emoji glyphs. */
export type UiIconName="sparkle"|"asterisk"|"flower"|"sun"|"heart"|"arrow-up-right"|"arrow-right"|"arrow-left"|"arrow-up"|"chevron-up"|"chevron-down"|"expand"|"refresh"|"book"|"wind"|"check"|"menu"|"brush"|"moon"|"leaf"|"gem"|"flame"|"mushroom"|"bubble"|"paw"|"star"|"close"|"grid"|"settings"|"clock";
export default function UiIcon({name,size=18,...props}:SVGProps<SVGSVGElement>&{name:UiIconName;size?:number}){
 const common={stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,fill:"none"};
 const paths:Record<UiIconName,ReactNode>={
  sparkle:<><path d="M12 2 14.2 9.8 22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2Z"/></>,
  asterisk:<><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/></>,
  flower:<><circle cx="12" cy="12" r="2"/><path d="M12 10c-5-7 5-10 5-3m-3 5c8-5 10 5 3 5m-5-3c5 8-5 10-5 3m3-5c-8 5-10-5-3-5"/></>,
  sun:<><circle cx="12" cy="12" r="4"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8m11.2 11.2 1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"/></>,
  heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  "arrow-up-right":<><path d="M6 18 18 6M8 6h10v10"/></>,
  "arrow-right":<><path d="M4 12h16m-7-7 7 7-7 7"/></>,
  "arrow-left":<><path d="M20 12H4m7-7-7 7 7 7"/></>,
  "arrow-up":<><path d="M12 20V4m-7 7 7-7 7 7"/></>,
  "chevron-up":<path d="m6 15 6-6 6 6"/>,
  "chevron-down":<path d="m6 9 6 6 6-6"/>,
  expand:<><path d="M9 3H3v6m12-6h6v6M9 21H3v-6m12 6h6v-6"/></>,
  refresh:<><path d="M20 11a8 8 0 0 0-14.7-4.4L3 9m0-6v6h6m-5 4a8 8 0 0 0 14.7 4.4L21 15m0 6v-6h-6"/></>,
  book:<><path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/></>,
  wind:<><path d="M3 8h11a3 3 0 1 0-3-3M2 12h17a2 2 0 1 1-2 2M4 17h8a3 3 0 1 1-3 3"/></>,
  check:<path d="m4 12 5 5L20 6"/>,
  menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
  brush:<><path d="m14 5 5-3 3 3-4 6-7 7m-1-3c-3-2-5 0-5 3 0 2-1 3-3 4 5 1 10 0 10-5 0-1-.3-2-2-2Z"/></>,
  moon:<path d="M20 16.7A8 8 0 0 1 7.3 4 8 8 0 1 0 20 16.7Z"/>,
  leaf:<><path d="M21 3c-9 0-18 3-18 13 0 3 2 5 5 5C18 21 21 12 21 3ZM4 20c2-5 6-8 11-11"/></>,
  gem:<><path d="M6 3h12l5 6-11 13L1 9 6 3Zm-5 6h22M8 3l4 19 4-19"/></>,
  flame:<path d="M13 22c5-1 7-4 7-9 0-4-3-7-5-9 0 4-1 5-3 7-1-3-2-5-4-7C8 9 4 11 4 16c0 4 3 6 8 6 2-1 3-3 3-5 0-2-2-4-3-5 0 3-2 3-2 6 0 2 1 4 3 4Z"/>,
  mushroom:<><path d="M3 12a9 9 0 0 1 18 0c-1 2-3 3-5 2v5c0 2-8 2-8 0v-5c-2 1-4 0-5-2Zm9 2v5M8 9h.01M16 10h.01"/></>,
  bubble:<><circle cx="10" cy="10" r="7"/><circle cx="18" cy="17" r="4"/><circle cx="16" cy="3" r="2"/></>,
  paw:<><path d="M5 14c2-3 3-3 5-2 1 1 3 1 4 0 2-1 4-1 5 2 2 4-1 6-4 5-2-1-4-1-6 0-3 1-6-1-4-5Z"/><circle cx="5" cy="8" r="1.5"/><circle cx="10" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="20" cy="8" r="1.5"/></>,
  star:<path d="m12 2 3 6.5 7 1-5 5 1.2 7.5L12 18.5 5.8 22l1.2-7.5-5-5 7-1Z"/>,
  close:<><path d="M5 5 19 19M19 5 5 19"/></>,
  grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="m10 2 4 0 .5 3 2 1 2.5-1.5 2 3.5-2.5 2v3l2.5 2-2 3.5-2.5-1.5-2 1-.5 3h-4l-.5-3-2-1-2.5 1.5-2-3.5 2.5-2v-3l-2.5-2 2-3.5L7.5 6l2-1Z"/></>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>
 };
 return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...common} {...props}>{paths[name]}</svg>;
}
