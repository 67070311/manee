import SearchHero from "./hero";
import LandingPage from "./landing-page";
import MobileApp from "./mobile-app";
import Ecommerce from "./ecommerce";
import Poster from "./poster";
import Branding from "./branding";

export default function SearchSection() {
  return (
    <section className="w-full bg-white py-[90px]">
      <div className="mx-auto w-full max-w-[1400px] px-[40px]">
        <SearchHero />

        <LandingPage />

        <MobileApp />

        <Ecommerce />

        <Poster />

        <Branding />
      </div>
    </section>
  );
}
