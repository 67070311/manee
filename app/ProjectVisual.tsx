import type {ReactNode} from "react";
export type VisualKind="bdxa"|"pos"|"client"|"interactive"|"modeling";
export default function ProjectVisual({kind}:{kind:VisualKind}):ReactNode{
 if(kind==="bdxa")return <div className="sw-visual sw-visual-bdxa" aria-hidden="true">
  <div className="sw-bdxa-orb"/><div className="sw-bdxa-note">your ideas,<br/><em>in motion.</em></div>
  <div className="sw-desktop">
   <div className="sw-desktop-top"><span className="sw-dots"><i/><i/><i/></span><span>manee / workspace</span><span>⌘</span></div>
   <div className="sw-desktop-inside"><aside><b>EXPLORER</b><span>▾ portfolio</span><span>　▸ app</span><span>　▸ public</span><span>　◈ package.json</span><small>CONNECTED <i/></small></aside>
    <div className="sw-desktop-chat"><div className="sw-desktop-heading">bdxa<span>↗</span></div><div className="sw-desktop-prompt">Let's make something amazing <b>↗</b></div><div className="sw-desktop-answer"><span>✳</span><div><strong>On it!</strong><small>Exploring your workspace and bringing your ideas to life.</small></div></div><div className="sw-desktop-progress"><i/><i/><i/></div></div>
   </div>
  </div><div className="sw-bdxa-tag">AI × YOUR WORKSPACE <span>✳</span></div>
 </div>;
 if(kind==="pos")return <div className="sw-visual sw-visual-pos" aria-hidden="true">
  <div className="sw-pos-sun"/><div className="sw-pos-window">
   <div className="sw-pos-top"><strong>buildify<span>x</span></strong><span>Store overview</span><span>● Open</span></div>
   <div className="sw-pos-layout"><div className="sw-pos-sidebar"><span>▣</span><span>▤</span><span>◷</span><span>⚙</span></div><div className="sw-pos-main"><div className="sw-pos-greeting"><div><small>GOOD MORNING, MANEE ✳</small><strong>Let's get to work.</strong></div><span>↗</span></div><div className="sw-pos-stats"><div><small>Today's sales</small><b>฿12,450</b><span>↗ 12.8%</span></div><div><small>Orders</small><b>84</b><span>In progress</span></div></div><div className="sw-pos-table-title">Your tables <span>View all →</span></div><div className="sw-pos-tables">{["01","02","03","04"].map((n,i)=><div key={n} className={i===2?"is-reserved":""}>T{n}<small>{i===2?"Occupied":"Available"}</small></div>)}</div></div></div>
  </div><div className="sw-pos-sticker">made for<br/>real people! <span>✦</span></div>
 </div>;
 if(kind==="client")return <div className="sw-visual sw-visual-client" aria-hidden="true">
  <div className="sw-client-orbit"/><div className="sw-client-caption">THOUGHTFUL DESIGN <span>↗</span></div>
  <div className="sw-client-browser">
   <div className="sw-client-toolbar"><span className="sw-dots"><i/><i/><i/></span><span>client-project / concept preview</span><span>↗</span></div>
   <div className="sw-client-website">
    <div className="sw-client-nav"><strong>atelier<span>✳</span></strong><span>STUDIO &nbsp; COLLECTION &nbsp; ABOUT</span><span>☰</span></div>
    <div className="sw-client-hero"><div className="sw-client-text"><small>DESIGNED WITH INTENTION</small><strong>Form meets<br/><em>feeling.</em></strong><span>EXPLORE THE EXPERIENCE ↗</span></div><div className="sw-client-art"><div className="sw-client-art-disc"/><div className="sw-client-art-bowl"/><div className="sw-client-art-leaf"/></div></div>
    <div className="sw-client-footer"><span>01 / 03</span><span>SCROLL TO EXPLORE ↓</span></div>
   </div>
  </div>
  <div className="sw-client-phone"><div className="sw-client-phone-notch"/><small>atelier✳</small><div className="sw-client-phone-hero"><span>Design<br/>for living.</span><i/></div><div className="sw-client-phone-line"/><div className="sw-client-phone-line short"/></div>
  <div className="sw-client-seal">UX/UI<br/>+ WEB</div>
 </div>;
 if(kind==="interactive")return <div className="sw-visual sw-visual-interactive" aria-hidden="true">
  <div className="sw-interactive-backdrop"><span>PLAY MORE.</span><span>SCROLL LESS.</span></div>
  <div className="sw-interactive-browser"><div className="sw-interactive-bar"><span>◌ ◌ ◌</span><span>creative-lab / experiment 04</span><span>↗</span></div><div className="sw-interactive-screen"><span>curious<br/><em>by nature.</em></span><div className="sw-interactive-flower"><i/><i/><i/><i/><i/><b>✳</b></div><small>DRAG TO EXPLORE →</small></div></div>
  <div className="sw-interactive-side">interactive<br/>everything ↗</div>
 </div>;
 return <div className="sw-visual sw-visual-modeling" aria-hidden="true">
  <div className="sw-model-grid"/><div className="sw-model-label">OBJECT / 001<br/><strong>FORM STUDIES</strong></div>
  <div className="sw-model-shadow"/><div className="sw-model-sculpture"><div className="sw-model-sculpture-inner"/><div className="sw-model-ring sw-model-ring-one"/><div className="sw-model-ring sw-model-ring-two"/></div>
  <div className="sw-model-cross">+</div><div className="sw-model-tool">✦ MADE IN 3D</div>
 </div>;
}