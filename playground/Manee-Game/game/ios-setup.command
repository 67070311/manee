#!/bin/zsh
set -e
cd "$(dirname "$0")"
echo "[Moonveil] Building static Next.js export..."
npm run build
if [ ! -d "ios" ]; then
  echo "[Moonveil] Creating iOS project..."
  npm run ios:add
fi
echo "[Moonveil] Syncing web build to iOS..."
npm run ios:sync
echo "[Moonveil] Opening Xcode..."
npm run ios:open
