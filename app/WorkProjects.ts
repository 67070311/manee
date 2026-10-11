export type WorkCategory="client"|"product"|"playground";
export type WorkRole="full-cycle"|"design-graphics"|"uxui"|"uxui-frontend"|"uxui-frontend-backend";
export type WorkProject={
 id:string;
 title:string;
 category:WorkCategory;
 experienceType?:"internship";
 role:WorkRole;
 cover?:string;
 website?:string;
 demoPath?:string;
 subtitle:string;
 description:string;
 focus:string;
 skills:string[];
 featured?:boolean;
 artwork?: "garden"|"interactive";
};
export const workProjects:WorkProject[]=[
 {id:"01",title:"Nice Dive",category:"client",role:"full-cycle",cover:"/images/work/Nice-Dive.png",website:"https://www.nicediveclub.com/",subtitle:"An underwater-inspired web experience.",description:"A website project featured in Manee's client portfolio.",focus:"UX/UI · Frontend · Website",skills:["UX/UI","Frontend","Web Design"],featured:true},
 {id:"02",title:"BuildifyX",category:"product",role:"full-cycle",cover:"/images/work/Buildifyx.png",website:"https://buildifyx.com/",subtitle:"Building digital products with a creative team.",description:"A digital product and studio website from BuildifyX.",focus:"Product · UX/UI · Frontend",skills:["Product","Web Development","UX/UI"],featured:true},
 {id:"03",title:"BDXA",category:"product",role:"uxui-frontend",cover:"/images/work/Bdxa.png",website:"https://bdxa.buildifyx.com/",subtitle:"An AI assistant for your real workspace.",description:"UX/UI design and frontend development for BDXA’s AI workspace experience. My contribution focused on interface design and frontend implementation.",focus:"UX/UI · Frontend",skills:["UX/UI Design","Frontend"],featured:true},
 {id:"04",experienceType:"internship",title:"Friday Online",category:"client",role:"design-graphics",cover:"/images/work/Friday-Online.png",website:"https://www.friday.co.th/",subtitle:"UX/UI and graphics for a consumer shopping brand.",description:"Designed the Friday Online user experience and supporting graphics, with attention to brand consistency, clear layouts and visual communication. My role covered UX/UI and graphic design only.",focus:"UX/UI Design · Graphic Design",skills:["UX/UI Design","Graphic Design","Visual Design"],featured:true},
 {id:"05",experienceType:"internship",title:"Better Way",category:"client",role:"design-graphics",cover:"/images/work/Better-way.png",website:"https://www.betterway.co.th/",subtitle:"Corporate website design and brand-focused graphics.",description:"Created UX/UI designs and supporting graphic assets for Better Way, focusing on content hierarchy and brand presentation. My contribution was design and graphics, not development or deployment.",focus:"UX/UI Design · Graphic Design",skills:["UX/UI Design","Graphic Design","Visual Design"],featured:true},
 {id:"06",title:"Fusecorp",category:"client",role:"uxui",cover:"/images/work/Fusecorp.png",website:"https://www.fusecorp.global/en",subtitle:"Digital presence with a global perspective.",description:"UX/UI design for Fusecorp's corporate website, focusing on visual hierarchy, navigation and a clear, professional user experience.",focus:"UX/UI Design",skills:["UX/UI Design"],featured:true},
 {id:"08",title:"R&K GPS Tracking",category:"client",role:"full-cycle",cover:"/images/work/r-k-cover.png",website:"https://r-ktechnologygps.com/",subtitle:"A clear digital home for smarter GPS vehicle tracking.",description:"A website showcasing R&K Technology’s GPS tracking platform and vehicle monitoring solutions, with an approachable layout for exploring features and services.",focus:"UX/UI · Frontend · Corporate Website",skills:["UX/UI","Frontend","Responsive Web","Website Design"]},
 {id:"10",title:"POS",category:"product",role:"uxui-frontend-backend",cover:"/images/work/Pos.png",website:"https://www.scansung.app/",subtitle:"A simpler way to run everyday store operations.",description:"Designed and developed the point-of-sale product across UX/UI, frontend and backend for managing orders, tables and everyday store operations.",focus:"UX/UI · Frontend · Backend",skills:["UX/UI Design","Frontend","Backend"]},
 {id:"07",title:"Wisdom Topup",category:"client",role:"uxui",cover:"/images/work/Wisdom-Topup.png",website:"https://wisdomtopup.com/",subtitle:"A customer-facing digital experience.",description:"UX/UI design for Wisdom Topup, focused on a clear, intuitive and approachable experience for customers.",focus:"UX/UI Design",skills:["UX/UI Design"]},

 {id:"11",title:"Animal Hunter",category:"playground",role:"full-cycle",demoPath:"/playground/animal-hunter/index.html",cover:"/images/work/buildimal-cover.png",subtitle:"A tiny survival game with a whole lot of character.",description:"A browser game prototype built around a character, enemies, a joystick, upgrades and survival levels.",focus:"Game Design · Frontend · Interaction",skills:["Game Design","Canvas","Game Mechanics"]},
 {id:"12",title:"BuildiFries",category:"playground",role:"full-cycle",demoPath:"/playground/buildifries/index.html",cover:"/images/work/buildifrie-cover.png",subtitle:"Start with fries. Build your own little food empire.",description:"A cheerful pixel-style idle restaurant game with store upgrades, customer orders, levels and evolving food shops.",focus:"Game Design · Pixel UI · Frontend",skills:["Idle Games","Game UI","JavaScript"]},
 {id:"13",title:"Potion Lab",category:"playground",role:"full-cycle",demoPath:"/playground/potion-lab/index.html",cover:"/images/work/potion-cover.png",subtitle:"A magical experiment with potions and playful systems.",description:"A wizard potion game prototype built with Next.js and React Three Fiber.",focus:"Game Development · 3D · Interaction",skills:["React Three Fiber","Next.js","Game Design"]},
 {id:"14",title:"Forest Atelier",category:"playground",role:"full-cycle",demoPath:"/playground/forest-atelier/index.html?v=forest6",cover:"/images/work/forest-atelier-cover.png",subtitle:"Paint strange commissions in a cozy forest studio.",description:"A cozy art game in which forest visitors request paintings. Players draw, negotiate prices, earn coins and build their reputation.",focus:"Game Design · Creative Coding · Frontend",skills:["Canvas","Game Design","Creative Coding"]},
 {id:"15",title:"Human Anatomy",category:"playground",role:"full-cycle",demoPath:"/playground/human-anatomy/index.html?v=anatomy7",cover:"/images/work/anatomy-cover.png",subtitle:"Explore a visual anatomy story through interaction.",description:"An interactive, scroll-based anatomy study with layered images and pointer-controlled reveal effects.",focus:"Creative Frontend · Interactive Storytelling",skills:["Interactive Web","Scroll Effects","Art Direction"]},
 {id:"16",title:"Paint Reveal",category:"playground",role:"full-cycle",demoPath:"/playground/paint-reveal/index.html",cover:"/images/work/paint.png",subtitle:"Paint your way from one visual world to another.",description:"An interactive image experiment with brush reveal, material modes, before/after preview and artwork export.",focus:"Creative Coding · UX/UI · Interaction",skills:["Canvas","Pointer Interaction","Creative Coding"]}
];
export const featuredProjects=workProjects.filter(p=>p.featured);
