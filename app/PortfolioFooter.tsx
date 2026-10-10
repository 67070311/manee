import Link from "next/link";
import type {Language} from "./Home";
type Props={mode?:"home"|"work";language?:Language};
const content={
 en:{intro:"MADE WITH CURIOSITY ✳",thanks:"THANKS FOR STOPPING BY",copy:"BUILT WITH IMAGINATION",back:"BACK TO TOP ↑",home:"BACK TO HOME",alt:"Manee portfolio footer illustration"},
 th:{intro:"สร้างด้วยความอยากรู้อยากลอง ✳",thanks:"ขอบคุณที่แวะมานะ",copy:"สร้างด้วยจินตนาการ",back:"กลับขึ้นด้านบน ↑",home:"กลับหน้าแรก",alt:"ภาพประกอบส่วนท้ายเว็บไซต์ของ Manee"}
};
export default function PortfolioFooter({mode="home",language="en"}:Props){
 const t=content[language];
 return <footer className="portfolio-footer" id="footer">
  <div className="portfolio-footer-inner">
   <div className="portfolio-footer-intro"><span>{t.intro}</span><span>{t.thanks}</span></div>
   <div className="portfolio-footer-art"><img src="/images/footer/footer.png" alt={t.alt} loading="lazy" decoding="async"/></div>
   <div className="portfolio-footer-bottom">
    <Link href="/" className="portfolio-footer-wordmark" aria-label="Manee portfolio home">manee<span>.</span></Link>
    <span>© 2026 MANEE · {t.copy}</span>
    <Link href={mode==="home"?"/#top":"/"} className="portfolio-footer-back">{mode==="home"?t.back:t.home}</Link>
   </div>
  </div>
 </footer>;
}
