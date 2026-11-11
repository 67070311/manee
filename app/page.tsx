import {cookies} from "next/headers";
import {PORTFOLIO_LANGUAGE_KEY,normalizePortfolioLanguage} from "./portfolioLanguage";
import HomePageContent from "./HomePageContent";
import WorkPage from "./WorkPage";
import ContactPage from "./ContactPage";
import PlaygroundPage from "./PlaygroundPage";
import EnglishMenuExperience from "./EnglishMenuExperience";
export default async function Page({searchParams}:{searchParams:Promise<{view?:string}>}){
 const [params,cookieStore]=await Promise.all([searchParams,cookies()]);
 const initialLanguage=normalizePortfolioLanguage(cookieStore.get(PORTFOLIO_LANGUAGE_KEY)?.value);
 if(params?.view==="work")return <WorkPage initialLanguage={initialLanguage}/>;
 if(params?.view==="contact")return <ContactPage initialLanguage={initialLanguage}/>;
 if(params?.view==="playground")return <PlaygroundPage initialLanguage={initialLanguage}/>;
 if(params?.view==="cooking-english")return <EnglishMenuExperience initialLanguage={initialLanguage}/>;
 return <HomePageContent initialLanguage={initialLanguage}/>;
}
