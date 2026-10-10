import type { Metadata } from "next";
import {cookies} from "next/headers";
import {PORTFOLIO_LANGUAGE_KEY,normalizePortfolioLanguage} from "./portfolioLanguage";
import "./globals.css";
import "./Navbar.css";
import "./HomeBanner.css";
import "./EpochSection.css";
import "./ScrapbookAbout.css";
import "./WorkGallery.css";
import "./PlaygroundPlayer.css";
import "./PortfolioFooter.css";
import "./WorkDarkResponsive.css";
import "./ThaiTypography.css";
import "./WorkCinematicFonts.css";
import "./WorkCinematicTheme.css";
import "./WorkArchiveHero.css";
import "./MobilePortfolio.css";
import "./ContactPage.css";
import "./MobileProjectModal.css";
import "./ContactHero.css";

export const metadata: Metadata = {
  title: "Manee — Creative Developer Portfolio",
  description:
    "Pimmanee's portfolio — AI/ML, full-stack development, product engineering, developer tools and creative development.",
};

// Migrates the language picked before we supported server-readable cookies.
// Prevents the old English -> Thai flash on the first visit after this update.
const LANGUAGE_MIGRATION_SCRIPT = `(function(){
 try{
  var key="manee-portfolio-language";
  var cookie=document.cookie.split(";").some(function(part){return part.trim().indexOf(key+"=")===0});
  if(cookie)return;
  var saved=window.localStorage.getItem(key);
  if(saved!=="th"&&saved!=="en")return;
  if(saved==="th"){
   document.documentElement.setAttribute("data-portfolio-language-migrating","1");
   document.documentElement.setAttribute("data-portfolio-language-preference","th");
  }
  document.cookie=key+"="+saved+"; Path=/; Max-Age=31536000; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");
 }catch(e){}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store=await cookies();
  const initialLanguage=normalizePortfolioLanguage(store.get(PORTFOLIO_LANGUAGE_KEY)?.value);
  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <head>
        <style>{'html[data-portfolio-language-migrating="1"] body{visibility:hidden!important}'}</style>
        <script dangerouslySetInnerHTML={{__html:LANGUAGE_MIGRATION_SCRIPT}}/>
      </head>
      <body>{children}</body>
    </html>
  );
}
