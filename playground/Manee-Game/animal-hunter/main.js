const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const W = canvas.width;
const H = canvas.height;
const ASSET = '/asset-game';

const src = {
  bg: `${ASSET}/backgroud/bg.png`,
  playerUp1: `${ASSET}/character/down1.png`, playerUp2: `${ASSET}/character/down2.png`,
  playerDown1: `${ASSET}/character/front1.png`, playerDown2: `${ASSET}/character/front2.png`,
  playerLeft1: `${ASSET}/character/left1.png`, playerLeft2: `${ASSET}/character/left2.png`,
  playerRight1: `${ASSET}/character/right1.png`, playerRight2: `${ASSET}/character/right2.png`,
  rabbit1: `${ASSET}/enemy/rabit/1.png`, rabbit2: `${ASSET}/enemy/rabit/2.png`,
  wolf1: `${ASSET}/enemy/wolf/1.png`, wolf2: `${ASSET}/enemy/wolf/2.png`,
  boss1: `${ASSET}/enemy/boss/1.png`, boss2: `${ASSET}/enemy/boss/2.png`,
  playerBullet: `${ASSET}/bullet/player/player-bullet.png`,
  enemyBullet: `${ASSET}/bullet/enemy/enemy-bullet.png`,
  exp: `${ASSET}/other-asset/exp.png`, coin: `${ASSET}/other-asset/coin.png`, heart: `${ASSET}/other-asset/heart.png`,
  bubble: `${ASSET}/weapon/1/Bubble.png`, carrot: `${ASSET}/weapon/1/Carrot.png`, star: `${ASSET}/weapon/1/Star.png`,
  orbitBlades: `${ASSET}/weapon/2/weapon-around.png`, blastBomb: `${ASSET}/weapon/2/bomb.png`, barrier: `${ASSET}/weapon/2/rocket.png`,
  moonScythe: `${ASSET}/weapon/3/1.png`, twinSlash: `${ASSET}/weapon/3/2.png`, starBow: `${ASSET}/weapon/3/3.png`,
};

const images = {};
function loadImage(key, url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { images[key] = img; resolve(); };
    img.onerror = () => { images[key] = null; resolve(); };
    img.src = url;
  });
}

const hpFill = document.getElementById('hpFill');
const expFill = document.getElementById('expFill');
const coinText = document.getElementById('coinText');
const levelText = document.getElementById('levelText');
const timeText = document.getElementById('timeText');
const upgradeModal = document.getElementById('upgradeModal');
const upgradeGrid = document.getElementById('upgradeGrid');
const gameoverModal = document.getElementById('gameoverModal');
const gameoverStats = document.getElementById('gameoverStats');
const restartBtn = document.getElementById('restartBtn');
const joystick = document.getElementById('joystick');
const joystickStick = document.getElementById('joystickStick');
const splashScreen = document.getElementById('splashScreen');
const startBtn = document.getElementById('startBtn');

const WEAPONS = {
  bubble: { name: 'Bubble Wand', icon: src.bubble, desc: 'Bursts into bright bubbles that pop on impact.' },
  carrot: { name: 'Carrot Boomerang', icon: src.carrot, desc: 'Spins forward, hits enemies, then curves back.' },
  star: { name: 'Star Wand', icon: src.star, desc: 'Fires piercing stars with a sparkling trail.' },

  orbitBlades: { name: 'Orbit Blades', icon: src.orbitBlades, desc: 'Magic blades spin around you and slice nearby enemies.' },
  blastBomb: { name: 'Blast Bomb', icon: src.blastBomb, desc: 'Explodes around you at intervals with a huge shockwave.' },
  barrier: { name: 'Magic Barrier', icon: src.barrier, desc: 'A glowing shield reduces damage and blocks projectiles.' },

  moonScythe: { name: 'Moon Scythe', icon: src.moonScythe, desc: 'Sweeps a giant crescent slash across the battlefield.' },
  twinSlash: { name: 'Twin Slash', icon: src.twinSlash, desc: 'Two blades fire a massive crossing slash toward enemies.' },
  starBow: { name: 'Star Bow', icon: src.starBow, desc: 'Shoots a fan of glowing arrows toward the nearest target.' },
};

const SETS = [
  ['bubble', 'carrot', 'star'],
  ['orbitBlades', 'blastBomb', 'barrier'],
  ['moonScythe', 'twinSlash', 'starBow'],
];

const keys = new Set();
let joy = { x: 0, y: 0 };
let joyId = null;
let lastTime = 0;
let state;
let bgPattern = null;
let bgW = 0;
let bgH = 0;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const formatTime = (sec) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;

window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d','W','A','S','D'].includes(e.key)) e.preventDefault();
  keys.add(e.key.toLowerCase());
});
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

function joyMove(e) {
  const r = joystick.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const max = r.width * 0.31;
  let dx = e.clientX - cx;
  let dy = e.clientY - cy;
  const len = Math.hypot(dx, dy) || 1;
  if (len > max) { dx = dx / len * max; dy = dy / len * max; }
  joy = { x: dx / max, y: dy / max };
  joystickStick.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
}
joystick.addEventListener('pointerdown', (e) => { joyId = e.pointerId; joystick.setPointerCapture(e.pointerId); joyMove(e); });
joystick.addEventListener('pointermove', (e) => { if (e.pointerId === joyId) joyMove(e); });
function joyUp(e) {
  if (joyId !== null && (!e || e.pointerId === joyId)) {
    joyId = null;
    joy = { x: 0, y: 0 };
    joystickStick.style.transform = 'translate(-50%,-50%)';
  }
}
joystick.addEventListener('pointerup', joyUp);
joystick.addEventListener('pointercancel', joyUp);

function resetGame() {
  state = {
    running: true, paused: false, elapsed: 0, mapX: 0, mapY: 0,
    spawnT: 0, shotT: 0, carrotT: 0, starT: 0,
    bombT: 0, scytheT: 0, twinT: 0, bowT: 0,
    swordAngle: 0, auraAngle: 0,
    bossSpawned: false, shake: 0, flash: 0,
    player: {
      x: W / 2, y: H * .72, radius: 34, speed: 235,
      hp: 100, maxHp: 100, exp: 0, nextExp: 7, level: 1, coins: 0,
      dir: 'down', frame: 0, anim: 0, hurt: 0, damage: 20, fireRate: .42,
    },
    weaponLevels: {
      bubble:0, carrot:0, star:0,
      orbitBlades:0, blastBomb:0, barrier:0,
      moonScythe:0, twinSlash:0, starBow:0,
    },
    enemies: [], bullets: [], enemyBullets: [], carrots: [], stars: [],
    bombs: [], bossBombs: [], arrows: [], drops: [], effects: [],
  };
  upgradeModal.classList.add('hidden');
  gameoverModal.classList.add('hidden');
  updateHUD();
}

function moveInput() {
  let x = joy.x, y = joy.y;
  if (keys.has('a') || keys.has('arrowleft')) x -= 1;
  if (keys.has('d') || keys.has('arrowright')) x += 1;
  if (keys.has('w') || keys.has('arrowup')) y -= 1;
  if (keys.has('s') || keys.has('arrowdown')) y += 1;
  const len = Math.hypot(x, y);
  return len > 1 ? { x: x / len, y: y / len } : { x, y };
}

function nearestEnemy(x, y) {
  let best = null, bestD = Infinity;
  for (const e of state.enemies) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function spawnEnemy() {
  const lv = state.player.level;
  const wolf = state.elapsed > 14 && Math.random() < Math.min(.18 + lv * .045, .58);
  const side = lv >= 4 && Math.random() < .22;
  let x = rand(30, W - 30), y = -55;
  if (side) { x = Math.random() < .5 ? -45 : W + 45; y = rand(90, H * .55); }
  const k = 1 + lv * .08;
  state.enemies.push({
    type: wolf ? 'wolf' : 'rabbit', x, y,
    radius: wolf ? 25 : 23,
    hp: (wolf ? 62 : 40) * k, maxHp: (wolf ? 62 : 40) * k,
    speed: (wolf ? 80 : 96) * Math.min(1.45, k),
    frame: 0, anim: rand(0,.2), shoot: rand(1.8,3), hit: 0,
  });
}

function spawnBoss() {
  if (state.bossSpawned) return;
  state.bossSpawned = true;
  state.enemies.push({ type:'boss', x:W/2, y:-105, radius:50, hp:620, maxHp:620, speed:46, frame:0, anim:0, bombT:1.5, hit:0 });
  burst(W/2, 115, '#ffcf5b', 24, 150, 'spark');
  pushEffect('shockwave', W/2, 115, .7, 180, '#ffcf5b');
  state.shake = .4;
}

function pushEffect(type, x, y, life=.35, size=20, color='#fff', extra={}) {
  state.effects.push({ type, x, y, age:0, life, size, color, ...extra });
}
function burst(x, y, color, count=8, speed=80, type='spark') {
  for (let i=0;i<count;i++) {
    const a = Math.PI * 2 * i / count + rand(-.25,.25);
    pushEffect(type, x, y, rand(.25,.55), rand(4,10), color, {
      vx: Math.cos(a) * rand(speed*.55,speed),
      vy: Math.sin(a) * rand(speed*.55,speed),
    });
  }
}

function fireBase() {
  const p = state.player;
  const t = nearestEnemy(p.x,p.y);
  if (!t) return;
  const a = Math.atan2(t.y-p.y,t.x-p.x);
  state.bullets.push({ x:p.x, y:p.y, vx:Math.cos(a)*520, vy:Math.sin(a)*520, r:11, d:p.damage, life:1.6, kind:'base', pierce:0 });
  pushEffect('muzzle', p.x+Math.cos(a)*28, p.y+Math.sin(a)*28, .16, 22, '#ffe98b', { angle:a });

  const lv = state.weaponLevels.bubble;
  if (lv) {
    const count = lv===1 ? 1 : lv===2 ? 2 : 3;
    for (let i=0;i<count;i++) {
      const aa=a+(i-(count-1)/2)*.2;
      state.bullets.push({ x:p.x,y:p.y,vx:Math.cos(aa)*(395+lv*30),vy:Math.sin(aa)*(395+lv*30),r:15+lv*2,d:13+lv*7,life:1.9,kind:'bubble',pierce:lv>=3?1:0 });
    }
  }
}

function fireCarrot() {
  const lv=state.weaponLevels.carrot;
  const t=nearestEnemy(state.player.x,state.player.y);
  if(!lv||!t)return;
  const base=Math.atan2(t.y-state.player.y,t.x-state.player.x);
  const count=lv>=2?2:1;
  for(let i=0;i<count;i++){
    const a=base+(i-(count-1)/2)*.28;
    state.carrots.push({x:state.player.x,y:state.player.y,vx:Math.cos(a)*340,vy:Math.sin(a)*340,age:0,life:1.6,r:23,d:27+lv*8,rot:a,ret:false});
  }
}

function fireStar() {
  const lv=state.weaponLevels.star;
  const t=nearestEnemy(state.player.x,state.player.y);
  if(!lv||!t)return;
  const count=lv>=3?2:1;
  const base=Math.atan2(t.y-state.player.y,t.x-state.player.x);
  for(let i=0;i<count;i++){
    const a=base+(i-(count-1)/2)*.16;
    state.stars.push({x:state.player.x,y:state.player.y,vx:Math.cos(a)*460,vy:Math.sin(a)*460,life:1.85,r:23,d:35+lv*10,pierce:1+lv,rot:0});
  }
}

function triggerBombPulse() {
  const lv=state.weaponLevels.blastBomb;
  if(!lv)return;
  const p=state.player;
  state.bombs.push({x:p.x,y:p.y,age:0,fuse:.34,r:105+lv*28,d:55+lv*24,boom:false});
  pushEffect('target',p.x,p.y,.34,72+lv*10,'#ffd256');
}

function castMoonScythe() {
  const lv=state.weaponLevels.moonScythe;
  if(!lv)return;
  const radius=145+lv*28;
  pushEffect('scytheWave',state.player.x,state.player.y,.56,radius,'#d8b7ff',{angle:state.auraAngle});
  pushEffect('scytheWave',state.player.x,state.player.y,.56,radius*.82,'#8eeeff',{angle:state.auraAngle+Math.PI});
  pushEffect('shockwave',state.player.x,state.player.y,.46,radius*.95,'#a6ebff');
  for(const e of [...state.enemies]) if(dist(e.x,e.y,state.player.x,state.player.y)<radius+e.radius) hurtEnemy(e,46+lv*24);
  burst(state.player.x,state.player.y,'#dcb8ff',14,120,'spark');
  state.shake=.2;
}

function castTwinSlash() {
  const lv=state.weaponLevels.twinSlash;
  if(!lv)return;
  const p=state.player;
  const target=nearestEnemy(p.x,p.y);
  if(!target)return;
  const a=Math.atan2(target.y-p.y,target.x-p.x);
  const range=210+lv*24;
  pushEffect('bladeWave',p.x,p.y,.38,range,'#8eeaff',{angle:a-.17});
  pushEffect('bladeWave',p.x,p.y,.38,range,'#ffd76c',{angle:a+.17});
  for(const e of [...state.enemies]){
    const dx=e.x-p.x,dy=e.y-p.y;
    const forward=dx*Math.cos(a)+dy*Math.sin(a);
    const side=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));
    if(forward>0&&forward<range&&side<52+lv*8)hurtEnemy(e,48+lv*24);
  }
  burst(p.x+Math.cos(a)*80,p.y+Math.sin(a)*80,'#a9f0ff',12,130,'spark');
  state.shake=.14;
}

function fireStarBow() {
  const lv=state.weaponLevels.starBow;
  if(!lv)return;
  const p=state.player;
  const target=nearestEnemy(p.x,p.y);
  if(!target)return;
  const base=Math.atan2(target.y-p.y,target.x-p.x);
  const count=3+lv*2;
  for(let i=0;i<count;i++){
    const spread=.13;
    const a=base+(i-(count-1)/2)*spread;
    const speed=430+lv*45;
    state.arrows.push({x:p.x,y:p.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,rot:a,life:2.1,d:30+lv*14,r:18});
  }
  pushEffect('bowBurst',p.x,p.y,.32,80,'#ffe778',{angle:base});
  burst(p.x,p.y,'#8eeaff',10,100,'spark');
}

function hurtEnemy(e,damage){
  e.hp-=damage;
  e.hit=.11;
  burst(e.x,e.y,'#fff5c9',3,55,'spark');
  pushEffect('hitRing',e.x,e.y,.18,24,'#ffffff');
  if(e.hp<=0)killEnemy(e);
}

function killEnemy(e){
  const i=state.enemies.indexOf(e);
  if(i<0)return;
  state.enemies.splice(i,1);
  burst(e.x,e.y,e.type==='boss'?'#ffd25e':'#fff4bd',e.type==='boss'?30:10,e.type==='boss'?190:95,'spark');
  pushEffect('deathRing',e.x,e.y,e.type==='boss'?.75:.35,e.type==='boss'?165:58,e.type==='boss'?'#ffcf5a':'#ffffff');
  state.drops.push({type:'exp',x:e.x,y:e.y,vx:rand(-22,22),vy:-26,size:24});
  if(Math.random()<.35)state.drops.push({type:'coin',x:e.x+rand(-8,8),y:e.y,vx:0,vy:-22,size:23});
  if(Math.random()<.06)state.drops.push({type:'heart',x:e.x,y:e.y,vx:0,vy:-22,size:24});
  if(e.type==='boss'){state.flash=.24;state.shake=.48;}
}

function addExp(v){
  const p=state.player;
  p.exp+=v;
  if(p.exp>=p.nextExp){
    p.exp-=p.nextExp;
    p.level++;
    p.nextExp=Math.floor(7+p.level*4.5);
    pushEffect('levelAura',p.x,p.y,.85,180,'#ffe66c');
    burst(p.x,p.y,'#fff1a0',20,160,'spark');
    state.flash=.15;
    if(p.level===3)spawnBoss();
    openUpgrade();
  }
}

function upgradePool(){
  return SETS[Math.min(2,Math.max(0,state.player.level-2))];
}

function openUpgrade(){
  state.paused=true;
  upgradeGrid.innerHTML='';
  for(const key of upgradePool()){
    const w=WEAPONS[key];
    const btn=document.createElement('button');
    btn.className='upgrade-card';
    btn.innerHTML=`<div class="icon-wrap"><img src="${w.icon}" alt=""></div><strong>${w.name}</strong><small>${w.desc}</small><span class="rank">LV ${state.weaponLevels[key]+1}</span>`;
    btn.onclick=()=>{
      state.weaponLevels[key]=Math.min(3,state.weaponLevels[key]+1);
      upgradeModal.classList.add('hidden');
      state.paused=false;
      pushEffect('levelAura',state.player.x,state.player.y,.7,155,'#fff09a');
      burst(state.player.x,state.player.y,'#ffe57d',16,130,'spark');
    };
    upgradeGrid.appendChild(btn);
  }
  upgradeModal.classList.remove('hidden');
}

function hurtPlayer(d){
  const p=state.player;
  if(p.hurt>0||state.paused)return;
  const shieldLv=state.weaponLevels.barrier;
  if(shieldLv){
    const reduction=[0,.4,.55,.7][shieldLv];
    d*=1-reduction;
    pushEffect('shieldHit',p.x,p.y,.38,95+shieldLv*12,'#79e8ff');
    burst(p.x,p.y,'#a9f5ff',8,85,'spark');
  }
  p.hp-=d;
  p.hurt=.72;
  state.flash=.13;
  state.shake=.2;
  burst(p.x,p.y,'#ff7777',8,110,'spark');
  if(p.hp<=0){
    state.running=false;
    state.paused=true;
    gameoverStats.innerHTML=`<span class="stat-line"><b>Survival Time</b><strong>${formatTime(state.elapsed)}</strong></span><span class="stat-line"><b>Coins</b><strong>${p.coins}</strong></span><span class="stat-line"><b>Level Reached</b><strong>${p.level}</strong></span>`;
    gameoverModal.classList.remove('hidden');
  }
}

function updateHUD(){
  const p=state.player;
  hpFill.style.width=`${clamp(p.hp/p.maxHp*100,0,100)}%`;
  expFill.style.width=`${clamp(p.exp/p.nextExp*100,0,100)}%`;
  coinText.textContent=p.coins;
  levelText.textContent=`LV ${p.level}`;
  timeText.textContent=formatTime(state.elapsed);
}

function update(dt){
  if(!state.running||state.paused)return;
  const p=state.player;
  state.elapsed+=dt;
  state.auraAngle+=dt*1.1;
  if(p.hurt>0)p.hurt-=dt;
  if(state.shake>0)state.shake-=dt;
  if(state.flash>0)state.flash-=dt;

  const m=moveInput();
  const moving=Math.abs(m.x)+Math.abs(m.y)>.05;
  if(moving){
    p.x=clamp(p.x+m.x*p.speed*dt,34,W-34);
    p.y=clamp(p.y+m.y*p.speed*dt,88,H-46);
    state.mapX-=m.x*p.speed*dt*.55;
    state.mapY-=m.y*p.speed*dt*.55;
    p.dir=Math.abs(m.x)>Math.abs(m.y)?(m.x>0?'right':'left'):(m.y>0?'down':'up');
    p.anim+=dt;
    if(p.anim>.15){p.anim=0;p.frame=1-p.frame}
  }

  const bossAlive=state.enemies.some(e=>e.type==='boss');
  const lv=p.level;
  const interval=lv<=2?.95:lv===3?.76:lv<=5?.56:.42;
  state.spawnT+=dt;
  if(state.spawnT>=interval){
    state.spawnT=0;
    let count=lv<=2?1:lv===3?(Math.random()<.55?2:1):lv<=5?2+(Math.random()<.6?1:0):3+(Math.random()<.65?1:0);
    if(bossAlive)count=Math.max(1,Math.floor(count*.62));
    for(let i=0;i<count;i++)spawnEnemy();
  }

  state.shotT+=dt;
  if(state.shotT>=p.fireRate){state.shotT=0;fireBase()}
  if(state.weaponLevels.carrot&&(state.carrotT+=dt)>=2.1-state.weaponLevels.carrot*.28){state.carrotT=0;fireCarrot()}
  if(state.weaponLevels.star&&(state.starT+=dt)>=1.75-state.weaponLevels.star*.2){state.starT=0;fireStar()}
  if(state.weaponLevels.blastBomb&&(state.bombT+=dt)>=3.6-state.weaponLevels.blastBomb*.55){state.bombT=0;triggerBombPulse()}
  if(state.weaponLevels.moonScythe&&(state.scytheT+=dt)>=2.15-state.weaponLevels.moonScythe*.25){state.scytheT=0;castMoonScythe()}
  if(state.weaponLevels.twinSlash&&(state.twinT+=dt)>=1.8-state.weaponLevels.twinSlash*.2){state.twinT=0;castTwinSlash()}
  if(state.weaponLevels.starBow&&(state.bowT+=dt)>=2.2-state.weaponLevels.starBow*.25){state.bowT=0;fireStarBow()}
  state.swordAngle+=dt*(1.05+state.weaponLevels.orbitBlades*.25);

  for(let i=state.enemies.length-1;i>=0;i--){
    const e=state.enemies[i];
    e.anim+=dt;
    if(e.anim>.19){e.anim=0;e.frame=1-e.frame}
    if(e.hit>0)e.hit-=dt;
    const dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1;
    e.x+=dx/len*e.speed*(e.type==='boss'?.8:.42)*dt;
    e.y+=dy/len*e.speed*dt;

    if(e.type==='boss'){
      e.bombT-=dt;
      if(e.bombT<=0&&e.y>80){
        e.bombT=rand(2.1,2.8);
        const bx=clamp(p.x+rand(-75,75),65,W-65);
        const by=clamp(p.y+rand(-50,75),130,H-90);
        state.bossBombs.push({x:bx,y:by,age:0,fuse:.95,r:76,boom:false});
        pushEffect('target',bx,by,.95,76,'#ff725e');
      }
    } else if(e.type==='wolf'){
      e.shoot-=dt;
      if(e.shoot<=0&&e.y>40&&e.y<H*.68){
        e.shoot=rand(2.1,3.1);
        const a=Math.atan2(p.y-e.y,p.x-e.x);
        state.enemyBullets.push({x:e.x,y:e.y,vx:Math.cos(a)*195,vy:Math.sin(a)*195,r:13,life:4});
      }
    }

    if(dist(e.x,e.y,p.x,p.y)<e.radius+p.radius-5){
      hurtPlayer(e.type==='boss'?24:e.type==='wolf'?13:10);
      e.y-=24;
    }
    if(e.type!=='boss'&&(e.y>H+100||e.x<-140||e.x>W+140))state.enemies.splice(i,1);
  }

  const orbitLv=state.weaponLevels.orbitBlades;
  if(orbitLv){
    const range=90+orbitLv*14;
    for(const e of [...state.enemies])if(dist(e.x,e.y,p.x,p.y)<range+e.radius)hurtEnemy(e,(27+orbitLv*17)*dt);
  }

  updateProjectiles(dt);
  updateDrops(dt);
  updateEffects(dt);
  updateHUD();
}

function updateProjectiles(dt){
  const p=state.player;

  for(let i=state.bullets.length-1;i>=0;i--){
    const b=state.bullets[i];
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    if(b.kind==='bubble'&&Math.random()<.55)pushEffect('bubbleTrail',b.x,b.y,.3,rand(5,10),'#bcefff');
    let remove=b.life<=0;
    for(const e of [...state.enemies]){
      if(dist(b.x,b.y,e.x,e.y)<b.r+e.radius){
        hurtEnemy(e,b.d);
        pushEffect(b.kind==='bubble'?'bubblePop':'hitRing',b.x,b.y,b.kind==='bubble'?.34:.18,b.kind==='bubble'?b.r*4.2:28,b.kind==='bubble'?'#8fe7ff':'#ffe77b');
        burst(b.x,b.y,b.kind==='bubble'?'#bcefff':'#ffe88d',b.kind==='bubble'?9:4,80,'spark');
        if(b.pierce>0)b.pierce--;else{remove=true;break}
      }
    }
    if(remove||b.x<-80||b.x>W+80||b.y<-80||b.y>H+80)state.bullets.splice(i,1);
  }

  for(let i=state.enemyBullets.length-1;i>=0;i--){
    const b=state.enemyBullets[i];
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    pushEffect('enemyTrail',b.x,b.y,.2,8,'#ff5c68');
    const shieldLv=state.weaponLevels.barrier;
    const shieldRadius=82+shieldLv*10;
    if(shieldLv&&dist(b.x,b.y,p.x,p.y)<shieldRadius){
      pushEffect('shieldHit',b.x,b.y,.35,48,'#7feaff');
      burst(b.x,b.y,'#b8f7ff',6,75,'spark');
      state.enemyBullets.splice(i,1);
      continue;
    }
    if(dist(b.x,b.y,p.x,p.y)<b.r+p.radius){hurtPlayer(12);state.enemyBullets.splice(i,1);continue}
    if(b.life<=0)state.enemyBullets.splice(i,1);
  }

  for(let i=state.carrots.length-1;i>=0;i--){
    const c=state.carrots[i];
    c.age+=dt;c.life-=dt;c.rot+=dt*9;
    if(c.age>.55)c.ret=true;
    if(c.ret){const a=Math.atan2(p.y-c.y,p.x-c.x);c.vx+=Math.cos(a)*900*dt;c.vy+=Math.sin(a)*900*dt}
    c.x+=c.vx*dt;c.y+=c.vy*dt;
    if(Math.random()<.75)pushEffect('carrotTrail',c.x,c.y,.24,11,'#ff9d34',{rot:c.rot});
    for(const e of [...state.enemies])if(dist(c.x,c.y,e.x,e.y)<c.r+e.radius){hurtEnemy(e,c.d*dt*5);if(Math.random()<.3)burst(c.x,c.y,'#96dc4d',4,55,'leaf')}
    if(c.life<=0)state.carrots.splice(i,1);
  }

  for(let i=state.stars.length-1;i>=0;i--){
    const s=state.stars[i];
    s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;s.rot+=dt*7;
    if(Math.random()<.9)pushEffect('starTrail',s.x,s.y,.32,rand(5,11),'#ffe66d');
    for(const e of [...state.enemies]){
      if(dist(s.x,s.y,e.x,e.y)<s.r+e.radius){
        hurtEnemy(e,s.d);
        pushEffect('starFlash',s.x,s.y,.34,48,'#fff072');
        burst(s.x,s.y,'#fff2a6',9,95,'spark');
        s.pierce--;
        if(s.pierce<0){s.life=0;break}
      }
    }
    if(s.life<=0||s.y>H+100||s.x<-100||s.x>W+100)state.stars.splice(i,1);
  }

  for(let i=state.bombs.length-1;i>=0;i--){
    const b=state.bombs[i];
    b.age+=dt;
    if(!b.boom&&b.age>=b.fuse){
      b.boom=true;b.age=0;
      for(const e of [...state.enemies])if(dist(b.x,b.y,e.x,e.y)<b.r+e.radius)hurtEnemy(e,b.d);
      pushEffect('boom',b.x,b.y,.6,b.r*2.7,'#ffd25e');
      pushEffect('shockwave',b.x,b.y,.68,b.r*1.7,'#fff1a0');
      burst(b.x,b.y,'#ffb43f',26,180,'spark');
      state.shake=.24;
    }
    if(b.boom&&b.age>.6)state.bombs.splice(i,1);
  }

  for(let i=state.arrows.length-1;i>=0;i--){
    const a=state.arrows[i];
    a.x+=a.vx*dt;a.y+=a.vy*dt;a.life-=dt;
    pushEffect('arrowTrail',a.x,a.y,.24,10,'#82ebff',{angle:a.rot});
    let hit=false;
    for(const e of [...state.enemies]){
      if(dist(a.x,a.y,e.x,e.y)<a.r+e.radius){
        hurtEnemy(e,a.d);
        pushEffect('starFlash',a.x,a.y,.38,58,'#ffe875');
        pushEffect('shockwave',a.x,a.y,.34,38,'#85e9ff');
        burst(a.x,a.y,'#fff0a6',10,100,'spark');
        hit=true;break;
      }
    }
    if(hit||a.life<=0||a.x<-80||a.x>W+80||a.y<-80||a.y>H+80)state.arrows.splice(i,1);
  }

  for(let i=state.bossBombs.length-1;i>=0;i--){
    const b=state.bossBombs[i];
    b.age+=dt;
    if(!b.boom&&b.age>=b.fuse){
      b.boom=true;b.age=0;
      if(dist(b.x,b.y,p.x,p.y)<b.r+p.radius)hurtPlayer(28);
      pushEffect('boom',b.x,b.y,.66,b.r*2.7,'#ffb64b');
      pushEffect('shockwave',b.x,b.y,.75,b.r*1.9,'#ff695c');
      burst(b.x,b.y,'#ffd568',30,195,'spark');
      state.shake=.32;
    }
    if(b.boom&&b.age>.66)state.bossBombs.splice(i,1);
  }
}

function updateDrops(dt){
  const p=state.player;
  for(let i=state.drops.length-1;i>=0;i--){
    const d=state.drops[i];
    d.vy+=30*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;
    const dd=dist(d.x,d.y,p.x,p.y);
    if(dd<110){const a=Math.atan2(p.y-d.y,p.x-d.x);d.x+=Math.cos(a)*360*dt;d.y+=Math.sin(a)*360*dt}
    if(dd<p.radius+18){
      if(d.type==='exp'){addExp(1);burst(d.x,d.y,'#68dfff',5,65,'spark')}
      else if(d.type==='coin'){p.coins++;burst(d.x,d.y,'#ffd54c',6,70,'spark')}
      else{p.hp=Math.min(p.maxHp,p.hp+24);burst(d.x,d.y,'#ff7888',7,70,'spark')}
      state.drops.splice(i,1);
    }
  }
}

function updateEffects(dt){
  for(let i=state.effects.length-1;i>=0;i--){
    const e=state.effects[i];
    e.age+=dt;
    if(e.vx!==undefined){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx*=.96;e.vy*=.96}
    if(e.age>=e.life)state.effects.splice(i,1);
  }
}

function drawImage(img,x,y,w,h,rot=0,alpha=1){
  if(!img)return;
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore();
}

function drawBackground(){
  if(!bgPattern&&images.bg){
    const t=document.createElement('canvas');
    bgW=Math.round(images.bg.naturalWidth*.3);bgH=Math.round(images.bg.naturalHeight*.3);
    t.width=bgW;t.height=bgH;
    const c=t.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(images.bg,0,0,bgW,bgH);
    bgPattern=ctx.createPattern(t,'repeat');
  }
  if(!bgPattern){ctx.fillStyle='#8ccc55';ctx.fillRect(0,0,W,H);return}
  ctx.save();ctx.translate(((state.mapX%bgW)+bgW)%bgW-bgW,((state.mapY%bgH)+bgH)%bgH-bgH);ctx.fillStyle=bgPattern;ctx.fillRect(0,0,W+bgW*2,H+bgH*2);ctx.restore();
}

function shadow(x,y,w){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle='#24311e';ctx.beginPath();ctx.ellipse(x,y+26,w*.42,w*.14,0,0,Math.PI*2);ctx.fill();ctx.restore()}

function drawEnemies(){
  for(const e of state.enemies){
    const im=images[`${e.type}${e.frame+1}`];
    const size=e.type==='boss'?142:e.type==='wolf'?70:64;
    shadow(e.x,e.y,size);
    if(e.hit>0){ctx.save();ctx.globalAlpha=.72;ctx.fillStyle='#fff';ctx.shadowBlur=18;ctx.shadowColor='#fff';ctx.beginPath();ctx.arc(e.x,e.y,e.radius+11,0,Math.PI*2);ctx.fill();ctx.restore()}
    drawImage(im,e.x,e.y,size,size);
    if(e.hp<e.maxHp&&e.type!=='boss'){
      ctx.fillStyle='#2a1b2e';ctx.fillRect(e.x-22,e.y-size*.46,44,6);
      ctx.fillStyle='#ff5c68';ctx.fillRect(e.x-22,e.y-size*.46,44*clamp(e.hp/e.maxHp,0,1),6);
    }
  }
}

function drawPlayer(){
  const p=state.player;
  const k=p.dir==='up'?`playerUp${p.frame+1}`:p.dir==='down'?`playerDown${p.frame+1}`:p.dir==='left'?`playerLeft${p.frame+1}`:`playerRight${p.frame+1}`;
  shadow(p.x,p.y,100);
  if(!(p.hurt>0&&Math.floor(p.hurt*18)%2===0))drawImage(images[k],p.x,p.y,102,102);
}

function drawBarrier(){
  const lv=state.weaponLevels.barrier;
  if(!lv)return;
  const p=state.player;
  const radius=78+lv*11;
  const pulse=1+Math.sin(state.elapsed*5)*.035;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=.2+.05*lv;
  ctx.fillStyle='#5edcff';
  ctx.shadowBlur=25;ctx.shadowColor='#84f2ff';
  ctx.beginPath();ctx.arc(p.x,p.y,radius*pulse,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=.72;ctx.strokeStyle='#b7f9ff';ctx.lineWidth=3+lv;
  ctx.beginPath();ctx.arc(p.x,p.y,radius*pulse,0,Math.PI*2);ctx.stroke();
  ctx.globalAlpha=.5;ctx.strokeStyle='#7ce8ff';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(p.x,p.y,radius*(.77+.05*Math.sin(state.elapsed*7)),0,Math.PI*2);ctx.stroke();
  ctx.restore();
}

function drawEffects(){
  for(const e of state.effects){
    const t=e.age/e.life,fade=1-t;
    ctx.save();ctx.globalAlpha=fade;ctx.globalCompositeOperation='lighter';
    if(e.type==='spark'){
      ctx.fillStyle=e.color;ctx.translate(e.x,e.y);ctx.rotate(Math.PI/4);ctx.fillRect(-e.size/2,-e.size/2,e.size,e.size);
    } else if(e.type==='leaf'){
      ctx.fillStyle=e.color;ctx.translate(e.x,e.y);ctx.rotate(t*5);ctx.fillRect(-e.size/2,-e.size/4,e.size,e.size/2);
    } else if(e.type==='bubbleTrail'){
      ctx.strokeStyle=e.color;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.5+t),0,Math.PI*2);ctx.stroke();
    } else if(e.type==='bubblePop'){
      ctx.strokeStyle=e.color;ctx.lineWidth=6*fade+1;ctx.shadowBlur=16;ctx.shadowColor=e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.18+.75*t),0,Math.PI*2);ctx.stroke();
      for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ctx.beginPath();ctx.arc(e.x+Math.cos(a)*e.size*.72*t,e.y+Math.sin(a)*e.size*.72*t,3+6*fade,0,Math.PI*2);ctx.stroke()}
    } else if(e.type==='carrotTrail'){
      ctx.strokeStyle=e.color;ctx.lineWidth=7*fade;ctx.shadowBlur=10;ctx.shadowColor=e.color;ctx.beginPath();ctx.arc(e.x,e.y,10+18*t,e.rot||0,(e.rot||0)+1.5);ctx.stroke();
    } else if(e.type==='starTrail'||e.type==='enemyTrail'||e.type==='arrowTrail'){
      ctx.fillStyle=e.color;ctx.shadowBlur=12;ctx.shadowColor=e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.size*fade,0,Math.PI*2);ctx.fill();
    } else if(e.type==='muzzle'){
      ctx.fillStyle=e.color;ctx.translate(e.x,e.y);ctx.rotate(e.angle||0);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-9,-13*fade);ctx.lineTo(30*fade,0);ctx.lineTo(-9,13*fade);ctx.closePath();ctx.fill();
    } else if(['hitRing','deathRing','shockwave','levelAura','shieldHit'].includes(e.type)){
      ctx.strokeStyle=e.color;ctx.shadowBlur=18;ctx.shadowColor=e.color;ctx.lineWidth=(e.type==='levelAura'?9:7)*fade+2;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.2+.8*t),0,Math.PI*2);ctx.stroke();
    } else if(e.type==='starFlash'){
      ctx.fillStyle=e.color;ctx.translate(e.x,e.y);ctx.rotate(Math.PI/4);const s=e.size*(.25+.75*fade);ctx.shadowBlur=18;ctx.shadowColor=e.color;ctx.fillRect(-s/2,-4,s,8);ctx.fillRect(-4,-s/2,8,s);
    } else if(e.type==='boom'){
      const r=e.size*(.12+.42*t);ctx.fillStyle=e.color;ctx.globalAlpha=fade*.5;ctx.shadowBlur=28;ctx.shadowColor=e.color;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff4b0';ctx.globalAlpha=fade;ctx.lineWidth=16*fade+4;ctx.beginPath();ctx.arc(e.x,e.y,r*.82,0,Math.PI*2);ctx.stroke();
    } else if(e.type==='target'){
      ctx.globalCompositeOperation='source-over';ctx.strokeStyle=e.color;ctx.lineWidth=6*fade+2;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.75-.18*t),0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(e.x-e.size*.5,e.y);ctx.lineTo(e.x+e.size*.5,e.y);ctx.moveTo(e.x,e.y-e.size*.5);ctx.lineTo(e.x,e.y+e.size*.5);ctx.stroke();
    } else if(e.type==='scytheWave'){
      ctx.strokeStyle=e.color;ctx.shadowBlur=24;ctx.shadowColor=e.color;ctx.lineWidth=24*fade+6;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.55+.35*t),e.angle||0,(e.angle||0)+Math.PI*1.55);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=6*fade+2;ctx.beginPath();ctx.arc(e.x,e.y,e.size*(.58+.35*t),(e.angle||0)+.1,(e.angle||0)+Math.PI*1.45);ctx.stroke();
    } else if(e.type==='bladeWave'){
      ctx.translate(e.x,e.y);ctx.rotate(e.angle||0);const len=e.size*(.45+.55*t);ctx.shadowBlur=24;ctx.shadowColor=e.color;ctx.strokeStyle=e.color;ctx.lineWidth=18*fade+5;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len,0);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=4*fade+1;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(len*.92,0);ctx.stroke();
    } else if(e.type==='bowBurst'){
      ctx.translate(e.x,e.y);ctx.rotate(e.angle||0);ctx.strokeStyle=e.color;ctx.shadowBlur=18;ctx.shadowColor=e.color;for(let i=-2;i<=2;i++){ctx.lineWidth=4*fade;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(e.size*(.35+.6*t),i*10*t);ctx.stroke()}
    }
    ctx.restore();
  }
}

function drawArrow(a){
  ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot);ctx.globalCompositeOperation='lighter';ctx.shadowBlur=14;ctx.shadowColor='#89efff';ctx.strokeStyle='#8cecff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(15,0);ctx.stroke();ctx.fillStyle='#ffe56a';ctx.beginPath();ctx.moveTo(24,0);ctx.lineTo(10,-8);ctx.lineTo(10,8);ctx.closePath();ctx.fill();ctx.restore();
}

function render(){
  ctx.save();
  if(state.shake>0)ctx.translate(rand(-6,6),rand(-6,6));
  drawBackground();
  for(const d of state.drops)drawImage(images[d.type],d.x,d.y,d.size,d.size);
  drawEnemies();

  for(const b of state.bullets){
    if(b.kind==='bubble'){
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(110,220,255,.58)';ctx.strokeStyle='#effcff';ctx.lineWidth=4;ctx.shadowBlur=18;ctx.shadowColor='#8de8ff';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(b.x-b.r*.3,b.y-b.r*.35,b.r*.23,0,Math.PI*2);ctx.fill();ctx.restore();
    } else {
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowBlur=16;ctx.shadowColor='#ffe875';drawImage(images.playerBullet,b.x,b.y,30,30);ctx.restore();
    }
  }

  for(const b of state.enemyBullets){ctx.save();ctx.shadowBlur=16;ctx.shadowColor='#ff5366';drawImage(images.enemyBullet,b.x,b.y,31,31);ctx.restore()}

  for(const b of state.bossBombs)if(!b.boom){
    const t=b.age/b.fuse,pulse=1+Math.sin(b.age*24)*.12;
    ctx.save();ctx.strokeStyle=t>.68?'#ff5d50':'#ffd15f';ctx.lineWidth=6;ctx.shadowBlur=20;ctx.shadowColor=ctx.strokeStyle;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(.72+.12*t),0,Math.PI*2);ctx.stroke();ctx.restore();drawImage(images.blastBomb,b.x,b.y,58*pulse,58*pulse);
  }

  const orbitLv=state.weaponLevels.orbitBlades;
  if(orbitLv){
    const size=158+orbitLv*16;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,220,104,.6)';ctx.lineWidth=5;ctx.shadowBlur=20;ctx.shadowColor='#ffe26c';ctx.beginPath();ctx.arc(state.player.x,state.player.y,size*.38,state.swordAngle,state.swordAngle+Math.PI*1.5);ctx.stroke();ctx.restore();
    drawImage(images.orbitBlades,state.player.x,state.player.y,size,size,state.swordAngle,.98);
  }

  drawBarrier();

  for(const c of state.carrots)drawImage(images.carrot,c.x,c.y,50,50,c.rot);
  for(const s of state.stars){ctx.save();ctx.shadowBlur=18;ctx.shadowColor='#ffe66c';drawImage(images.star,s.x,s.y,56,56,s.rot);ctx.restore()}
  for(const b of state.bombs)if(!b.boom){const pulse=1+Math.sin(b.age*26)*.12;drawImage(images.blastBomb,b.x,b.y,60*pulse,60*pulse)}
  for(const a of state.arrows)drawArrow(a);

  drawEffects();
  drawPlayer();
  ctx.restore();

  const boss=state.enemies.find(e=>e.type==='boss');
  if(boss){const bw=W*.76,bh=16,bx=(W-bw)/2,by=72;ctx.fillStyle='rgba(36,24,37,.92)';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#e84f5e';ctx.fillRect(bx+2,by+2,(bw-4)*clamp(boss.hp/boss.maxHp,0,1),bh-4);ctx.strokeStyle='#fff2c9';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh)}
  if(state.flash>0){ctx.fillStyle=`rgba(255,255,255,${state.flash*2.6})`;ctx.fillRect(0,0,W,H)}
}

function frame(ts){
  const now=ts/1000;
  const dt=Math.min(.033,lastTime?now-lastTime:.016);
  lastTime=now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

restartBtn.onclick=()=>{resetGame();lastTime=0};
startBtn.onclick=()=>{splashScreen.classList.add('hidden');resetGame();lastTime=0};
Promise.all(Object.entries(src).map(([k,v])=>loadImage(k,v))).then(()=>{resetGame();state.paused=true;requestAnimationFrame(frame)});
