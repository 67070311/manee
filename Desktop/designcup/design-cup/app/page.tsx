import Hero from "./home/hero";
import Rank from "./home/rank";
import Challenge from "./home/challenge/page";
import Search from "./home/search/page";
import Designer from "./home/designer/page";
import ChallengeCategories from "./home/challenge-categories/page";
import ChallengeUpcoming from "./home/challenge-upcoming/page";
import CommentSection from "./home/comment/page";
import Join from "./home/join/page";

export default function Home() {
  return (
    <main>
      <Hero />
      <Rank />
      <Challenge />
      <Search />
      <Designer />
      <ChallengeCategories />
      <ChallengeUpcoming />
      <CommentSection />
      <Join />
    </main>
  );
}
