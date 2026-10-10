/** @type {import("next").NextConfig} */
import { syncPlaygroundAssets } from "./playgroundAssets.mjs";

// Original static demos live outside public; publish their actual assets
// whenever Next starts (dev or production build).\n// Includes real HTML games and the exported Potion Lab build.\n// Root export folder is included; dependencies are excluded.\n// The demos are served locally from public/playground.
// Preview fit: BuildiFries, Animal Hunter and Potion Lab use a consistent 430×932 phone canvas.
// Paint Reveal uses the same landscape player viewport as Forest Atelier.
// Real project cover PNGs are synced from playground/cover at startup.
syncPlaygroundAssets();

const nextConfig = {
  async rewrites() {
    return [
      { source: "/work", destination: "/?view=work" },
      { source: "/contact", destination: "/?view=contact" },
    ];
  },
};
export default nextConfig;
