import fs from "node:fs";
import path from "node:path";

/**
 * Publish local interactive playground projects as self-contained static demos.
 * This is invoked by Next's config at dev/build startup because the desktop
 * agent does not have permission to copy binary assets by shell command.
 * We intentionally exclude dependencies, hidden files and source builds.
 */
export function syncPlaygroundAssets() {
  const root = process.cwd();
  const publicRoot = path.join(root, "public", "playground");
  const demos = [
    ["Manee-Game/animal-hunter", "animal-hunter"],
    ["Manee-Game/fries-game", "buildifries"],
    ["Manee-Game/passpartout", "forest-atelier"],
    ["play-web/doctor", "human-anatomy"],
    ["play-web/paint", "paint-reveal"],
    ["Manee-Game/game/out", "potion-lab"],
  ];
  const ignored = new Set([
    "node_modules", ".next", ".git", ".DS_Store", "ios", "out", "book",
    ".env", ".env.local", "package-lock.json", "package.json",
    "tsconfig.json", "capacitor.config.ts", "README.md",
  ]);

  function patch(file, name) {
    if (!/\.(?:html|css|js|json|webmanifest|txt)$/.test(file)) return;
    const original = fs.readFileSync(file, "utf8");
    let content = original;
    const prefix = "/playground/" + name;
    if (name === "animal-hunter") {
      content = content.replace(/\/asset-game\//g, prefix + "/asset-game/");
      content = content.replace(/(["'])\/style\.css/g, "$1" + prefix + "/style.css");
      content = content.replace(/(["'])\/main\.js/g, "$1" + prefix + "/main.js");
      content = content.replace(/(["'])\/asset-game(?=["'])/g, "$1" + prefix + "/asset-game");
    } else if (name === "potion-lab") {
      content = content
        .replace(/\/_next\//g, prefix + "/_next/")
        .replace(/\/img\//g, prefix + "/img/")
        .replace(/\/manifest\.webmanifest/g, prefix + "/manifest.webmanifest")
        .replace(/\/icon\.svg/g, prefix + "/icon.svg");
      if (file.endsWith("/index.html")) {
        const deviceCSS = `<style id="portfolio-potion-device">
@media (min-width:600px){
 main:has(>section){display:grid!important;place-items:center!important;min-height:100dvh!important;height:100dvh!important;padding:0!important;background:radial-gradient(circle at 50% 30%,#39465d 0%,#202838 52%,#111721 100%)!important;overflow:hidden!important}
 main>section:first-child{box-sizing:border-box!important;width:446px!important;height:948px!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;margin:0!important;border:8px solid #080a0d!important;border-radius:54px!important;outline:2px solid #555c67!important;box-shadow:0 26px 80px rgba(0,0,0,.58)!important;transform:scale(var(--phone-scale,1))!important;transform-origin:center center!important;overflow:hidden!important}
 main>section:first-child::before{top:9px!important;width:96px!important;height:28px!important}
}
@media(max-width:599px){
 main:has(>section){height:100dvh!important;min-height:0!important;padding:0!important}
 main>section:first-child{width:100vw!important;height:100dvh!important;max-height:none!important;min-height:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important}
}
</style>`;
        const deviceJS = `<script id="portfolio-potion-fit">
(function(){
 const fit=()=>{const phone=document.querySelector('main>section:first-child');if(!phone)return false;
 if(window.innerWidth<600){phone.style.removeProperty('--phone-scale');return true}
 const x=Math.max(320,window.innerWidth-48)/446;
 const y=Math.max(300,window.innerHeight-32)/948;
 phone.style.setProperty('--phone-scale',Math.min(1,x,y).toFixed(4));return true};
 window.addEventListener('resize',fit,{passive:true});
 if(!fit()){
  const observer=new MutationObserver(()=>{if(fit())observer.disconnect()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
</script>`;
        content = content.replace("</head>",deviceCSS+"</head>").replace("</body>",deviceJS+"</body>");
      }
    }
    if (content !== original) fs.writeFileSync(file, content);
  }

  try {
    fs.mkdirSync(publicRoot, { recursive: true });
    // Publish the six actual PNG covers uploaded by the portfolio owner.
    // Unlike SVG concepts, these are the real project artwork.
    const coverDirectory = path.join(root, "playground", "cover");
    const destinationDirectory = path.join(root, "public", "images", "work");
    const realCovers = [
      "anatomy-cover.png",
      "buildifrie-cover.png",
      "buildimal-cover.png",
      "forest-atelier-cover.png",
      "paint.png",
      "potion-cover.png",
    ];
    fs.mkdirSync(destinationDirectory, { recursive: true });
    for (const fileName of realCovers) {
      const source = path.join(coverDirectory, fileName);
      const destination = path.join(destinationDirectory, fileName);
      try {
        if (!fs.existsSync(source)) {
          console.warn("[playground] Missing uploaded cover:", fileName);
          continue;
        }
        fs.copyFileSync(source, destination);
      } catch (error) {
        console.warn("[playground] Could not copy cover:", fileName, error);
      }
    }
    const status = {};
    for (const [source, name] of demos) {
      const from = path.join(root, "playground", source);
      const to = path.join(publicRoot, name);
      if (!fs.existsSync(from)) {
        status[name] = "missing source";
        continue;
      }
      try {
        fs.cpSync(from, to, {
          recursive: true,
          force: true,
          filter: (src) => src === from || (!ignored.has(path.basename(src)) && !path.basename(src).startsWith(".")),
        });
        if (name === "animal-hunter" || name === "potion-lab") {
          const pending = [to];
          while (pending.length) {
            const current = pending.pop();
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
              const file = path.join(current, entry.name);
              if (entry.isDirectory()) pending.push(file);
              else if (entry.isFile()) patch(file, name);
            }
          }
        }
        status[name] = fs.existsSync(path.join(to, "index.html")) ? "ready" : "index.html missing";
      } catch (error) {
        status[name] = "error: " + (error?.message || String(error));
        console.warn("[playground] Unable to prepare " + name + ":", error);
      }
    }
    const unavailable = Object.entries(status).filter(([, value]) => value !== "ready");
    if (unavailable.length) console.warn("[playground] Unavailable previews:", unavailable.map(([name]) => name));
    fs.rmSync(path.join(publicRoot, "_sync-status.json"), { force: true });
  } catch (error) {
    // Never take down the portfolio if a local preview cannot be published.
    console.warn("[playground] Unable to sync playable demos:", error);
  }
}
