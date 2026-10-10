# Moonveil Alchemy — Release Notes

## Current playable loop
1. Open the apothecary.
2. Read the customer order and recipe sequence.
3. Tap three ingredient bottles in order.
4. Each bottle moves above the cauldron, pauses, tips, visibly pours, and creates a splash.
5. Select low / medium / high flame.
6. Tap Stir once and watch the spoon complete the mixture.
7. Brew and serve.
8. Earn coins and reputation, build streaks, unlock harder recipes, and advance through 5-order days.

## Release-facing systems included
- Mobile-first portrait layout with safe-area support.
- Title screen and first-time tutorial.
- 5 recipes with progression and unlock thresholds.
- Customer requests and order rewards.
- Day / order progression.
- Coins, reputation, streak, and best-streak progression.
- Recipe book with locked/unlocked formulas.
- Success/failure feedback and retry loop.
- Persistent local save via `localStorage`.
- Sound toggle and reduced-motion accessibility setting.
- Haptic feedback when supported.
- PWA manifest and standalone portrait metadata.
- In-game credits plus `ASSET_CREDITS.md`.
- External models are isolated behind a render error boundary so gameplay still works if the CDN is unavailable.

## Art direction
- Uses the supplied `bg.png` as the key illustration.
- 3D cauldron, liquid, flame, spoon, particles, magical rings, splash and bottle-pour sequence are rendered with React Three Fiber.
- Additional Poly Pizza 3D props add depth to the workshop.
- Visual direction is brighter and softer than the earlier dark prototype, with warm window light, violet potion glow, glass UI and foreground depth.

## Before public deployment
- Run `npm run build` locally and resolve any machine-specific build warnings.
- Test at 390x844, 393x852, 430x932 and at least one Android Chrome viewport.
- Verify external Poly Pizza assets load on the production domain. If you want zero external runtime dependencies, download those GLBs into `public/models` and update the URLs.
- Keep `ASSET_CREDITS.md` and the in-game Credits section when publishing.

## Deploy
```bash
npm install
npm run build
npm run start
```

For Vercel, import the repository as a standard Next.js app. No database or environment variables are required for this release build.
