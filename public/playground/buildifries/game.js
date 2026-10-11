const gameShell = document.getElementById('gameShell');
const street = document.getElementById('street');
const world = document.getElementById('world');
const shopZone = document.getElementById('shopZone');
const coinCount = document.getElementById('coinCount');
const servedCount = document.getElementById('servedCount');
const incomePerCustomer = document.getElementById('incomePerCustomer');
const incomeText = document.getElementById('incomeText');
const shopImage = document.getElementById('shopImage');
const miniShopImage = document.getElementById('miniShopImage');
const shopDecor = document.getElementById('shopDecor');
const shopTitle = document.getElementById('shopTitle');
const shopName = document.getElementById('shopName');
const shopEyebrow = document.getElementById('shopEyebrow');
const tipText = document.getElementById('tipText');
const upgradeBtn = document.getElementById('upgradeBtn');
const upgradePrice = document.getElementById('upgradePrice');
const upgradeLabel = document.getElementById('upgradeLabel');
const upgradeCopySmall = upgradeBtn.querySelector('.upgrade-copy small');
const shopSubtitle = document.getElementById('shopSubtitle');
const playerLevel = document.getElementById('playerLevel');
const xpFill = document.getElementById('xpFill');
const xpText = document.getElementById('xpText');
const incomePopups = document.getElementById('incomePopups');
const toast = document.getElementById('toast');
const splashScreen = document.getElementById('splashScreen');
const startGameBtn = document.getElementById('startGameBtn');
const upgradeModal = document.getElementById('upgradeModal');
const upgradeKicker = document.getElementById('upgradeKicker');
const upgradeModalImage = document.getElementById('upgradeModalImage');
const upgradeModalTitle = document.getElementById('upgradeModalTitle');
const upgradeModalText = document.getElementById('upgradeModalText');
const upgradeModalIncome = document.getElementById('upgradeModalIncome');
const upgradeContinueBtn = document.getElementById('upgradeContinueBtn');
const prevStoreBtn = document.getElementById('prevStoreBtn');
const nextStoreBtn = document.getElementById('nextStoreBtn');
const shopDots = document.getElementById('shopDots');

const npcFolders = [
  'blond_boy_walk_right_6frames',
  'blue_npc_walk_right_6frames',
  'fox_walk_right_6frames',
  'soldier_walk_right_6frames',
  'witch_walk_right_6frames'
];

const stores = [
  {
    id: 'fries',
    name: 'FRIES STAND',
    shortName: 'FRIES',
    eyebrow: 'YOUR FIRST SHOP',
    tip: 'Customers pass by and order different snacks.',
    foods: [
      'asset-game/food/fries/frie.png',
      'asset-game/food/fries/burger.png',
      'asset-game/food/fries/cola.png'
    ],
    stages: [
      { level: 1, title: 'OLD FRIES', image: 'asset-game/restuarant/fries/level1.png', income: 2, price: 30, nextLabel: 'Fix the storefront', subtitle: 'Old, worn out, but still open for business.' },
      { level: 2, title: 'FRIES CORNER', image: 'asset-game/restuarant/fries/level2.png', income: 5, price: 90, nextLabel: 'Add more seating', subtitle: 'Fresh look unlocked — plus a table for customers.' },
      { level: 3, title: 'BEACH FRIES', image: 'asset-game/restuarant/fries/level3.png', income: 10, price: null, nextLabel: 'COMPLETE', subtitle: 'Fully upgraded with more seating and maximum fries income.' }
    ]
  },
  {
    id: 'pizza',
    name: 'PIZZA SHOP',
    shortName: 'PIZZA',
    eyebrow: 'YOUR SECOND SHOP',
    tip: 'Customers stop by and randomly pick from the pizza menu.',
    foods: [
      'asset-game/food/pizza/1.png',
      'asset-game/food/pizza/2.png',
      'asset-game/food/pizza/3.png'
    ],
    stages: [
      { level: 1, title: 'OLD PIZZA', image: 'asset-game/restuarant/pizza/level1.png', income: 14, price: 150, nextLabel: 'Improve the pizza shop', subtitle: 'A new pizza spot opens on Beach Street.' },
      { level: 2, title: 'PIZZA CORNER', image: 'asset-game/restuarant/pizza/level2.png', income: 22, price: 260, nextLabel: 'Make it famous', subtitle: 'The pizza shop is busier, brighter, and earns more.' },
      { level: 3, title: 'BEACH PIZZA', image: 'asset-game/restuarant/pizza/level3.png', income: 35, price: null, nextLabel: 'MAX LEVEL', subtitle: 'Your pizza shop is fully upgraded and packed with flavor.' }
    ]
  }
];

const state = {
  coins: 700,
  activeStore: 0,
  unlockedStores: 1,
  storeLevels: [1, 1],
  servedByStore: [0, 0],
  xp: 0,
  playerLevel: 1,
  npcs: [],
  lastSpawn: 0,
  nextSpawnDelay: randomSpawnDelay(),
  running: false,
  modalOpen: false,
  modalMode: 'upgrade',
  started: false
};

function randomSpawnDelay() {
  return 3000 + Math.random() * 1200;
}

function padFrame(n) {
  return String(n).padStart(2, '0');
}

function npcFrame(folder, frame) {
  return `asset-game/npc/${folder}/frame_${padFrame(frame)}.png`;
}

function currentStore() {
  return stores[state.activeStore];
}
function currentLevel() {
  return state.storeLevels[state.activeStore];
}

function currentUpgrade() {
  return currentStore().stages[currentLevel() - 1];
}

function clearNPCs() {
  state.npcs.forEach(npc => {
    if (npc.el && npc.el.remove) npc.el.remove();
  });
  state.npcs = [];
}

function randomFoodForStore(store) {
  return store.foods[Math.floor(Math.random() * store.foods.length)];
}
function renderShopDecor() {
  shopDecor.innerHTML = '';
  const store = currentStore();
  const level = currentLevel();

  // Lv.1 = no table, Lv.2 = 1 table, Lv.3 = 3 tables for every shop.
  const tableCount = level === 2 ? 1 : level >= 3 ? 3 : 0;
  if (!tableCount) return;

  const positions = tableCount === 1
    ? ['table-center']
    : ['table-left', 'table-center', 'table-right'];
  const tableSrc = `asset-game/table/${store.id}/table.png`;

  positions.forEach((position, index) => {
    const table = document.createElement('img');
    table.src = tableSrc;
    table.alt = `${store.name} table`;
    table.className = `shop-table shop-table-${store.id} ${position}`;
    table.style.setProperty('--table-delay', `${index * 80}ms`);
    shopDecor.appendChild(table);
  });
}

function renderShopNavigation() {
  const multiple = state.unlockedStores > 1;

  prevStoreBtn.classList.toggle('is-visible', multiple);
  nextStoreBtn.classList.toggle('is-visible', multiple);
  prevStoreBtn.disabled = !multiple || state.activeStore === 0;
  nextStoreBtn.disabled = !multiple || state.activeStore >= state.unlockedStores - 1;

  shopDots.innerHTML = '';
  for (let i = 0; i < state.unlockedStores; i += 1) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `shop-dot${i === state.activeStore ? ' active' : ''}`;
    tab.textContent = stores[i].shortName;
    tab.setAttribute('aria-label', `View ${stores[i].name}`);
    tab.addEventListener('click', event => {
      event.stopPropagation();
      if (i !== state.activeStore) switchStore(i, i > state.activeStore ? 1 : -1);
    });
    shopDots.appendChild(tab);
  }
  shopDots.classList.toggle('is-visible', multiple);
}

function isNextStoreAvailableToUnlock() {
  return currentLevel() === 3 && state.activeStore === state.unlockedStores - 1 && state.unlockedStores < stores.length;
}

function renderHUD() {
  const store = currentStore();
  const up = currentUpgrade();

  coinCount.textContent = state.coins;
  servedCount.textContent = state.servedByStore[state.activeStore];
  incomePerCustomer.textContent = `+${up.income}`;
  incomeText.textContent = `1 customer = ${up.income} coins`;
  shopImage.src = up.image;
  miniShopImage.src = up.image;
  shopTitle.textContent = up.title;
  shopSubtitle.textContent = up.subtitle;
  shopName.textContent = store.name;
  shopEyebrow.textContent = store.eyebrow;
  tipText.textContent = store.tip;
  playerLevel.textContent = state.playerLevel;
  renderShopDecor();
  renderShopNavigation();

  const needed = 10 + (state.playerLevel - 1) * 5;
  xpText.textContent = `${state.xp}/${needed}`;
  xpFill.style.width = `${Math.min(100, (state.xp / needed) * 100)}%`;

  upgradeBtn.classList.remove('unlock-new-shop');

  if (up.price != null) {
    upgradeCopySmall.textContent = 'UPGRADE SHOP';
    upgradePrice.textContent = up.price;
    upgradeLabel.textContent = up.nextLabel;
    upgradeBtn.disabled = state.coins < up.price;
    return;
  }

  if (isNextStoreAvailableToUnlock()) {
    const nextStore = stores[state.unlockedStores];
    upgradeCopySmall.textContent = 'NEW SHOP READY';
    upgradePrice.textContent = 'NEW';
    upgradeLabel.textContent = `Open ${nextStore.name}`;
    upgradeBtn.disabled = false;
    upgradeBtn.classList.add('unlock-new-shop');
    return;
  }

  upgradeCopySmall.textContent = 'MAX LEVEL';
  upgradePrice.textContent = 'MAX';
  upgradeLabel.textContent = 'Shop fully upgraded';
  upgradeBtn.disabled = true;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1500);
}

function addXP(amount = 1) {
  state.xp += amount;
  const needed = 10 + (state.playerLevel - 1) * 5;
  if (state.xp >= needed) {
    state.xp -= needed;
    state.playerLevel += 1;
    showToast(`LEVEL UP!  Lv.${state.playerLevel}`);
  }
}

function floatCoin(amount) {
  const pop = document.createElement('div');
  pop.className = 'coin-float';
  pop.innerHTML = `<img src="asset-game/coin/coin.png" alt=""><span>+${amount}</span>`;
  pop.style.left = `${46 + Math.random() * 9}%`;
  pop.style.bottom = `${27 + Math.random() * 9}%`;
  incomePopups.appendChild(pop);
  setTimeout(() => pop.remove(), 1200);
}

function completePurchase(npc) {
  const income = currentUpgrade().income;
  state.coins += income;
  state.servedByStore[state.activeStore] += 1;
  addXP(1);
  floatCoin(income);
  npc.bought = true;
  renderHUD();
}

function makeOrderBubble(npc) {
  const bubble = document.createElement('div');
  bubble.className = 'order-bubble food-order-bubble';

  const img = document.createElement('img');
  img.src = randomFoodForStore(currentStore());
  img.alt = 'order';
  bubble.appendChild(img);

  npc.el.appendChild(bubble);
  npc.bubble = bubble;
}

function spawnNPC() {
  if (!street.clientWidth || !state.running || state.modalOpen) return;
  if (state.npcs.length >= 4) return;

  const folder = npcFolders[Math.floor(Math.random() * npcFolders.length)];
  const el = document.createElement('div');
  el.className = 'npc';
  const img = document.createElement('img');
  img.src = npcFrame(folder, 1);
  img.alt = '';
  el.appendChild(img);
  street.appendChild(el);

  const width = street.clientWidth;
  const npc = {
    folder,
    el,
    img,
    x: -72 - Math.random() * 45,
    speed: 41 + Math.random() * 15,
    frame: 1,
    lastFrame: 0,
    buyX: width * (0.43 + Math.random() * 0.10),
    willBuy: Math.random() < 0.78,
    state: 'walking',
    pauseUntil: 0,
    bubble: null,
    bought: false
  };

  el.style.bottom = `${2 + Math.random() * 9}px`;
  if (folder.includes('fox')) el.style.width = '60px';
  if (folder.includes('soldier')) el.style.width = '58px';
  state.npcs.push(npc);
}

function startBuying(npc, now) {
  npc.state = 'buying';
  npc.pauseUntil = now + 1200 + Math.random() * 550;
  npc.el.classList.add('is-buying');
  makeOrderBubble(npc);
}

function finishBuying(npc) {
  if (!npc.bought) completePurchase(npc);
  npc.state = 'leaving';
  npc.el.classList.remove('is-buying');
  if (npc.bubble) {
    npc.bubble.remove();
    npc.bubble = null;
  }
}

function updateNPC(npc, now, dt) {
  if (npc.state === 'walking' || npc.state === 'leaving') {
    npc.x += npc.speed * dt;
    if (now - npc.lastFrame > 115) {
      npc.frame = npc.frame >= 6 ? 1 : npc.frame + 1;
      npc.img.src = npcFrame(npc.folder, npc.frame);
      npc.lastFrame = now;
    }
  }

  if (npc.state === 'walking' && npc.willBuy && npc.x >= npc.buyX) startBuying(npc, now);
  if (npc.state === 'buying' && now >= npc.pauseUntil) finishBuying(npc);

  npc.el.style.transform = `translate3d(${npc.x}px,0,0)`;
}

function cleanNPCs() {
  const endX = street.clientWidth + 95;
  state.npcs = state.npcs.filter(npc => {
    if (npc.x > endX) {
      npc.el.remove();
      return false;
    }
    return true;
  });
}

function animateStoreSwitch(direction) {
  shopZone.classList.remove('switch-from-left', 'switch-from-right');
  void shopZone.offsetWidth;
  shopZone.classList.add(direction > 0 ? 'switch-from-right' : 'switch-from-left');
}

function switchStore(targetIndex, direction = 1) {
  if (targetIndex < 0 || targetIndex >= state.unlockedStores || targetIndex === state.activeStore) return;
  clearNPCs();
  state.activeStore = targetIndex;
  animateStoreSwitch(direction);
  renderHUD();
  previous = performance.now();
  state.lastSpawn = previous;
  state.nextSpawnDelay = 650;
}

function openUpgradeModal() {
  const store = currentStore();
  const up = currentUpgrade();

  state.modalOpen = true;
  state.modalMode = 'upgrade';
  upgradeModalImage.src = up.image;
  upgradeModalTitle.textContent = `${store.name} LV.${up.level}`;
  upgradeModalIncome.textContent = `+${up.income}`;
  upgradeKicker.textContent = up.level === 3 ? 'LEVEL 3 COMPLETE!' : 'SHOP UPGRADED!';

  if (store.id === 'fries' && up.level === 2) {
    upgradeModalText.textContent = 'A customer table has been added. Your fries stand now feels more complete!';
  } else if (up.level === 3) {
    upgradeModalText.textContent = `${store.name} reached Level 3! Take a look at your finished shop before opening the next one.`;
  } else {
    upgradeModalText.textContent = `${store.name} is better now, and every customer pays more.`;
  }

  upgradeContinueBtn.textContent = 'NICE!';
  upgradeModal.classList.add('show');
  upgradeModal.setAttribute('aria-hidden', 'false');
}

function openNewShopModal() {
  if (!isNextStoreAvailableToUnlock()) return;
  const nextStore = stores[state.unlockedStores];
  const firstStage = nextStore.stages[0];

  state.modalOpen = true;
  state.modalMode = 'unlock';
  upgradeKicker.textContent = 'NEW SHOP UNLOCKED!';
  upgradeModalImage.src = firstStage.image;
  upgradeModalTitle.textContent = nextStore.name;
  upgradeModalText.textContent = `${nextStore.name} is ready to open on Beach Street. Your old shops will stay available anytime.`;
  upgradeModalIncome.textContent = `+${firstStage.income}`;
  upgradeContinueBtn.textContent = 'OPEN SHOP';
  upgradeModal.classList.add('show');
  upgradeModal.setAttribute('aria-hidden', 'false');
}

function closeUpgradeModal() {
  const mode = state.modalMode;
  upgradeModal.classList.remove('show');
  upgradeModal.setAttribute('aria-hidden', 'true');
  state.modalOpen = false;

  if (mode === 'unlock') {
    const newStoreIndex = state.unlockedStores;
    state.unlockedStores += 1;
    renderHUD();
    switchStore(newStoreIndex, 1);
    showToast(`${stores[newStoreIndex].name} OPENED!`);
  }

  state.modalMode = 'upgrade';
  previous = performance.now();
  state.lastSpawn = previous;
  state.nextSpawnDelay = 900;
  renderHUD();
}

function startGame() {
  if (state.started) return;
  state.started = true;
  splashScreen.classList.add('is-hidden');
  state.running = true;
  previous = performance.now();
  state.lastSpawn = previous;
  state.nextSpawnDelay = 650;
}

let previous = performance.now();
function gameLoop(now) {
  const dt = Math.min(0.035, (now - previous) / 1000);
  previous = now;

  if (state.running && !state.modalOpen) {
    if (!state.lastSpawn || now - state.lastSpawn >= state.nextSpawnDelay) {
      spawnNPC();
      state.lastSpawn = now;
      state.nextSpawnDelay = randomSpawnDelay();
    }

    state.npcs.forEach(npc => updateNPC(npc, now, dt));
    cleanNPCs();
  }

  if(state.running&&!state.modalOpen&&!document.hidden)requestAnimationFrame(gameLoop);
  else window.setTimeout(()=>requestAnimationFrame(gameLoop),150);
}

startGameBtn.addEventListener('click', startGame);
splashScreen.addEventListener('click', event => {
  if (event.target !== startGameBtn && !startGameBtn.contains(event.target)) startGame();
});

upgradeBtn.addEventListener('click', () => {
  if (isNextStoreAvailableToUnlock()) {
    openNewShopModal();
    return;
  }

  const up = currentUpgrade();
  if (up.price == null) return;
  if (state.coins < up.price) {
    showToast(`You need ${up.price} coins first.`);
    return;
  }

  state.coins -= up.price;
  state.storeLevels[state.activeStore] += 1;
  renderHUD();
  shopImage.classList.remove('upgrade-pop');
  void shopImage.offsetWidth;
  shopImage.classList.add('upgrade-pop');
  openUpgradeModal();
});

upgradeContinueBtn.addEventListener('click', closeUpgradeModal);
prevStoreBtn.addEventListener('click', event => {
  event.stopPropagation();
  switchStore(state.activeStore - 1, -1);
});
nextStoreBtn.addEventListener('click', event => {
  event.stopPropagation();
  switchStore(state.activeStore + 1, 1);
});

let touchStartX = 0;
let touchStartY = 0;
gameShell.addEventListener('touchstart', event => {
  if (state.unlockedStores < 2 || state.modalOpen) return;
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

gameShell.addEventListener('touchend', event => {
  if (state.unlockedStores < 2 || state.modalOpen) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
  if (dx > 0) switchStore(state.activeStore - 1, -1);
  else switchStore(state.activeStore + 1, 1);
}, { passive: true });
function fitDesktopPhone() {
  if (window.innerWidth < 600) {
    gameShell.style.removeProperty('--phone-scale');
    return;
  }

  const outerWidth = 446;  // 430px canvas + 8px border each side
  const outerHeight = 948; // 932px canvas + 8px border top/bottom
  const availableWidth = Math.max(320, window.innerWidth - 64);
  const availableHeight = Math.max(520, window.innerHeight - 48);
  const scale = Math.min(1, availableWidth / outerWidth, availableHeight / outerHeight);
  gameShell.style.setProperty('--phone-scale', scale.toFixed(4));
}

window.addEventListener('resize', () => {
  fitDesktopPhone();
  state.npcs.forEach(npc => {
    if (npc.state === 'walking' && !npc.bought) npc.buyX = street.clientWidth * (0.43 + Math.random() * 0.10);
  });
});

fitDesktopPhone();
renderHUD();
requestAnimationFrame(gameLoop);