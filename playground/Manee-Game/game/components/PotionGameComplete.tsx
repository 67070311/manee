'use client';

import { Canvas } from '@react-three/fiber';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  HelpCircle,
  Home,
  Menu,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './PotionGameComplete.module.css';
import CauldronFinal from './CauldronFinal';

import poison1 from '../poison/1.png';
import poison2 from '../poison/2.png';
import poison3 from '../poison/3.png';
import poison4 from '../poison/4.png';
import poison5 from '../poison/5.png';
import poison6 from '../poison/6.png';
import poison7 from '../poison/7.png';
import bookImage from '../book/new-book.png';

type Heat = 'low' | 'medium' | 'high';
type IngredientId = 'mooncap' | 'crystal' | 'mandrake' | 'ember' | 'dew' | 'nightshade' | 'sunpetal';
type Screen = 'title' | 'game';

type Ingredient = {
  id: IngredientId;
  name: string;
  short: string;
  color: string;
  image: string;
};

type Recipe = {
  name: string;
  subtitle: string;
  ingredients: IngredientId[];
  heat: Heat;
  effect: string;
};

type Result = {
  key: string;
  name: string;
  rarity: string;
  effect: string;
  description: string;
  color: string;
  value: number;
};

type SaveData = {
  coins: number;
  discoveries: Result[];
  tutorialSeen: boolean;
  sound: boolean;
};

const INGREDIENTS: Ingredient[] = [
  { id: 'mooncap', name: 'Mooncap', short: 'Moon', color: '#a891ff', image: poison1.src },
  { id: 'crystal', name: 'Star Crystal', short: 'Star', color: '#78dcff', image: poison2.src },
  { id: 'mandrake', name: 'Mandrake Root', short: 'Root', color: '#d9a06c', image: poison3.src },
  { id: 'ember', name: 'Ember Seed', short: 'Ember', color: '#ff8069', image: poison4.src },
  { id: 'dew', name: 'Dawn Dew', short: 'Dew', color: '#75e0d0', image: poison5.src },
  { id: 'nightshade', name: 'Nightshade', short: 'Shade', color: '#ca78df', image: poison6.src },
  { id: 'sunpetal', name: 'Sunpetal', short: 'Sun', color: '#f2c968', image: poison7.src },
];

const RECIPES: Recipe[] = [
  { name: 'Moonveil Elixir', subtitle: 'Quiet as moonlight on still water', ingredients: ['mooncap', 'crystal'], heat: 'medium', effect: 'Sharper night vision and softer footsteps.' },
  { name: 'Emberwrath Draught', subtitle: 'A furnace sealed inside glass', ingredients: ['ember', 'sunpetal'], heat: 'high', effect: 'A brief burst of warmth and physical strength.' },
  { name: 'Verdant Bloom Serum', subtitle: 'Roots remember how to mend', ingredients: ['mandrake', 'dew'], heat: 'low', effect: 'Supports recovery and closes small wounds.' },
  { name: 'Veilstep Tonic', subtitle: 'The shadow follows without a sound', ingredients: ['nightshade', 'mooncap'], heat: 'low', effect: 'Dims the drinker and muffles movement.' },
  { name: 'Sunwash Essence', subtitle: 'Morning light caught in a bottle', ingredients: ['dew', 'sunpetal'], heat: 'medium', effect: 'Restores energy and cleanses minor curses.' },
  { name: 'Blackflame Philter', subtitle: 'Cold fire, bright only in darkness', ingredients: ['ember', 'nightshade'], heat: 'high', effect: 'Creates a magical flame that gives no heat.' },
];

const DEFAULT_SAVE: SaveData = { coins: 120, discoveries: [], tutorialSeen: false, sound: true };
const SAVE_KEY = 'moonveil-complete-save-v1';

function item(id: IngredientId) {
  return INGREDIENTS.find((entry) => entry.id === id)!;
}

function averageColor(ids: IngredientId[]) {
  if (!ids.length) return '#b8dff0';
  const values = ids.map((id) => item(id).color.replace('#', '')).map((hex) => [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]);
  const rgb = [0, 1, 2].map((index) => Math.round(values.reduce((sum, value) => sum + value[index], 0) / values.length));
  return `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function resultFor(ids: IngredientId[], heat: Heat): Result {
  const key = [...ids].sort().join('-') + ':' + heat;
  const has = (a: IngredientId, b: IngredientId) => ids.includes(a) && ids.includes(b);
  if (has('crystal', 'mooncap')) return { key, name: 'Moonveil Elixir', rarity: 'RARE ELIXIR', effect: 'Night vision + quieter movement', description: 'Silver light folds across the liquid like moonlight on still water.', color: '#ad92ff', value: 84 };
  if (has('ember', 'sunpetal')) return { key, name: heat === 'high' ? 'Emberwrath Draught' : 'Cinderheart Tonic', rarity: heat === 'high' ? 'EPIC DRAUGHT' : 'RARE TONIC', effect: 'Strength + warmth', description: 'Orange sparks orbit the bottle, then vanish into the glass.', color: '#ff836a', value: heat === 'high' ? 132 : 92 };
  if (has('dew', 'mandrake')) return { key, name: 'Verdant Bloom Serum', rarity: 'EPIC SERUM', effect: 'Recovery + regeneration', description: 'Tiny green motes bloom and disappear beneath the surface.', color: '#79d999', value: 144 };
  if (has('mooncap', 'nightshade')) return { key, name: 'Veilstep Tonic', rarity: 'RARE TONIC', effect: 'Stealth + silent movement', description: 'The brew looks almost empty until held against direct light.', color: '#8665b9', value: 102 };
  if (has('dew', 'sunpetal')) return { key, name: 'Sunwash Essence', rarity: 'EPIC ESSENCE', effect: 'Cleansing + energy', description: 'Warm gold gathers at the surface like sunrise caught in honey.', color: '#f0d06f', value: 148 };
  if (has('ember', 'nightshade')) return { key, name: 'Blackflame Philter', rarity: heat === 'high' ? 'LEGENDARY PHILTER' : 'EPIC PHILTER', effect: 'Cold magical flame', description: 'Its flame burns inward and shines brighter in shadow.', color: '#72488f', value: heat === 'high' ? 228 : 164 };
  return { key, name: 'Mystery Brew', rarity: ids.length >= 4 ? 'EPIC ESSENCE' : ids.length >= 3 ? 'RARE ESSENCE' : 'COMMON ESSENCE', effect: 'An unknown magical reaction', description: 'No alchemist has catalogued this combination yet.', color: averageColor(ids), value: 28 + ids.length * 18 + (heat === 'high' ? 12 : heat === 'medium' ? 6 : 0) };
}

function tone(enabled: boolean, frequency: number, duration = 0.09, volume = 0.035) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.03);
    osc.onended = () => ctx.close();
  } catch {}
}

type WoodButtonProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const WoodButton = forwardRef<HTMLButtonElement, WoodButtonProps>(function WoodButton(
  { children, active = false, className = '', onClick, disabled = false },
  ref,
 ) {
  return (
    <button ref={ref} className={`${styles.woodButton} ${active ? styles.woodActive : ''} ${className}`} onClick={onClick} disabled={disabled}>
      <span>{children}</span>
    </button>
  );
});

function RecipeBook({ page, onPage, onClose }: { page: number; onPage: (page: number) => void; onClose: () => void }) {
  const recipe = RECIPES[page];
  return (
    <div className={styles.bookOverlay} onClick={onClose}>
      <div className={styles.bookWrap} onClick={(event) => event.stopPropagation()}>
        <img className={styles.bookImage} src={bookImage.src} alt="Potion recipe book" />
        <button className={styles.bookClose} onClick={onClose}><X size={18} /></button>
        <section className={`${styles.bookContent} ${styles.bookLeft}`}>
          <small>ALCHEMIST NOTES</small>
          <h2>{recipe.name}</h2>
          <p className={styles.bookSubtitle}>{recipe.subtitle}</p>
          <div className={styles.inkLine} />
          <p className={styles.bookEffect}>{recipe.effect}</p>
        </section>
        <section className={`${styles.bookContent} ${styles.bookRight}`}>
          <small>INGREDIENTS</small>
          <div className={styles.recipeList}>
            {recipe.ingredients.map((id, index) => (
              <div key={id}><b>{index + 1}</b><img src={item(id).image} alt="" /><strong>{item(id).name}</strong></div>
            ))}
          </div>
          <div className={styles.recipeHeat}><Flame size={15} /> {recipe.heat.toUpperCase()} FLAME</div>
          <p className={styles.bookHint}>Recipes are clues, not rules. Experiment with anything you find.</p>
        </section>
        <button className={`${styles.bookArrow} ${styles.bookPrev}`} onClick={() => onPage((page - 1 + RECIPES.length) % RECIPES.length)}><ChevronLeft size={23} /></button>
        <button className={`${styles.bookArrow} ${styles.bookNext}`} onClick={() => onPage((page + 1) % RECIPES.length)}><ChevronRight size={23} /></button>
      </div>
    </div>
  );
}

function TitleScreen({ hasSave, discoveries, onStart, onContinue, onSettings }: { hasSave: boolean; discoveries: number; onStart: () => void; onContinue: () => void; onSettings: () => void }) {
  return (
    <div className={styles.titleScreen}>
      <div className={styles.titleMist} />
      <div className={styles.titleMotes}>{Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>
      <div className={styles.titleCrest}><span>M</span></div>
      <div className={styles.titleCopy}>
        <small>THE MOONVEIL WORKSHOP</small>
        <h1>ALCHEMY<br />ATELIER</h1>
        <p>Mix freely. Watch the cauldron react. Discover potions no one has named before.</p>
      </div>
      <div className={styles.titleMenu}>
        <WoodButton className={styles.titleButton} onClick={onStart}>START GAME</WoodButton>
        <WoodButton className={styles.titleButton} onClick={onSettings}><Settings size={16} /> OPTIONS</WoodButton>
      </div>
      <div className={styles.titleFooter}>{discoveries > 0 ? `${discoveries} potions discovered` : 'Your grimoire is waiting'}</div>
    </div>
  );
}

export default function PotionGameComplete() {
  const [screen, setScreen] = useState<Screen>('title');
  const [mix, setMix] = useState<IngredientId[]>([]);
  const [heat, setHeat] = useState<Heat>('medium');
  const [pouring, setPouring] = useState<Ingredient | null>(null);
  const [splash, setSplash] = useState(0);
  const [reaction, setReaction] = useState(false);
  const [stirring, setStirring] = useState(false);
  const [stir, setStir] = useState(0);
  const [coins, setCoins] = useState(120);
  const [result, setResult] = useState<Result | null>(null);
  const [discoveries, setDiscoveries] = useState<Result[]>([]);
  const [showBook, setShowBook] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [showPause, setShowPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [sound, setSound] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const phoneRef = useRef<HTMLElement | null>(null);
  const ingredientsRef = useRef<HTMLDivElement | null>(null);
  const heatRef = useRef<HTMLDivElement | null>(null);
  const stirRef = useRef<HTMLButtonElement | null>(null);
  const brewRef = useRef<HTMLButtonElement | null>(null);
  const bookRef = useRef<HTMLButtonElement | null>(null);
  const tutorialCardRef = useRef<HTMLDivElement | null>(null);
  const [tutorialGeometry, setTutorialGeometry] = useState<{
    focusLeft: number;
    focusTop: number;
    focusWidth: number;
    focusHeight: number;
    cardLeft: number;
    cardTop: number;
    arrowLeft: number;
    placement: 'above' | 'below';
  } | null>(null);

  const potionColor = useMemo(() => averageColor(mix), [mix]);
  const hasSave = discoveries.length > 0 || coins !== 120 || tutorialSeen;

  // Match BuildiFries' 430×932 desktop phone preview, scaling down to the
  // iframe/viewport without distorting the gameplay or responsive controls.
  useEffect(() => {
    const fit = () => {
      const phone = phoneRef.current;
      if (!phone) return;
      if (window.innerWidth < 600) {
        phone.style.removeProperty('--phone-scale');
        return;
      }
      const scale = Math.min(
        1,
        Math.max(320, window.innerWidth - 48) / 446,
        Math.max(300, window.innerHeight - 32) / 948
      );
      phone.style.setProperty('--phone-scale', scale.toFixed(4));
    };
    fit();
    window.addEventListener('resize', fit, { passive: true });
    return () => window.removeEventListener('resize', fit);
  }, []);

  useLayoutEffect(() => {
    if (tutorialStep < 0 || screen !== 'game') {
      setTutorialGeometry(null);
      return;
    }

    let frame = 0;
    let observer: ResizeObserver | null = null;

    const update = () => {
      const phone = phoneRef.current;
      const card = tutorialCardRef.current;
      const targets = [ingredientsRef.current, heatRef.current, stirRef.current, brewRef.current, bookRef.current];
      const target = targets[tutorialStep] ?? null;
      if (!phone || !card || !target) return;

      const phoneRect = phone.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const scaleX = phone.offsetWidth ? phoneRect.width / phone.offsetWidth : 1;
      const scaleY = phone.offsetHeight ? phoneRect.height / phone.offsetHeight : 1;
      const contentLeft = phoneRect.left + phone.clientLeft * scaleX;
      const contentTop = phoneRect.top + phone.clientTop * scaleY;
      const containerWidth = phone.clientWidth;
      const containerHeight = phone.clientHeight;
      const pad = tutorialStep === 4 ? 5 : 4;
      const gap = 12;
      const focusLeft = (targetRect.left - contentLeft) / scaleX - pad;
      const focusTop = (targetRect.top - contentTop) / scaleY - pad;
      const focusWidth = targetRect.width / scaleX + pad * 2;
      const focusHeight = targetRect.height / scaleY + pad * 2;
      const cardWidth = cardRect.width / scaleX;
      const cardHeight = cardRect.height / scaleY;
      const targetCenter = (targetRect.left - contentLeft + targetRect.width / 2) / scaleX;
      const cardLeft = Math.min(Math.max(targetCenter - cardWidth / 2, 10), Math.max(10, containerWidth - cardWidth - 10));
      const targetTop = (targetRect.top - contentTop) / scaleY;
      const targetBottom = (targetRect.bottom - contentTop) / scaleY;
      const shouldPlaceBelow = tutorialStep === 4 || targetTop - cardHeight - gap < 12;
      const cardTop = shouldPlaceBelow
        ? Math.min(targetBottom + gap, containerHeight - cardHeight - 12)
        : Math.max(12, targetTop - cardHeight - gap);
      const arrowLeft = Math.min(Math.max(targetCenter - cardLeft, 18), cardWidth - 18);

      setTutorialGeometry({
        focusLeft,
        focusTop,
        focusWidth,
        focusHeight,
        cardLeft,
        cardTop,
        arrowLeft,
        placement: shouldPlaceBelow ? 'below' : 'above',
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    const phone = phoneRef.current;
    const card = tutorialCardRef.current;
    const targets = [ingredientsRef.current, heatRef.current, stirRef.current, brewRef.current, bookRef.current];
    const target = targets[tutorialStep] ?? null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleUpdate);
      if (phone) observer.observe(phone);
      if (card) observer.observe(card);
      if (target) observer.observe(target);
    }
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [tutorialStep, screen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const data = { ...DEFAULT_SAVE, ...JSON.parse(saved) } as SaveData;
        setCoins(data.coins);
        setDiscoveries(data.discoveries || []);
        setTutorialSeen(!!data.tutorialSeen);
        setSound(data.sound !== false);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const data: SaveData = { coins, discoveries, tutorialSeen, sound };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
  }, [coins, discoveries, tutorialSeen, sound, loaded]);

  useEffect(() => {
    if (!stirring) return;
    const timer = window.setInterval(() => setStir((value) => {
      const next = Math.min(100, value + 3.4);
      if (next >= 100) {
        setStirring(false);
        tone(sound, 520, 0.12);
      }
      return next;
    }), 44);
    return () => window.clearInterval(timer);
  }, [stirring, sound]);

  const newGame = () => {
    setScreen('game');
    setMix([]);
    setHeat('medium');
    setStir(0);
    setResult(null);
    setShowPause(false);
    tone(sound, 420, 0.11);
    setTutorialStep(0);
  };

  const choose = (ingredient: Ingredient) => {
    if (pouring || mix.length >= 4) return;
    setPouring(ingredient);
    setReaction(true);
    tone(sound, 300, 0.1);
    window.setTimeout(() => tone(sound, 420, 0.11), 1500);
    window.setTimeout(() => tone(sound, 650, 0.13), 2900);
    window.setTimeout(() => {
      setMix((current) => [...current, ingredient.id]);
      setSplash((current) => current + 1);
      if (navigator.vibrate) navigator.vibrate([18, 30, 24]);
    }, 3150);
    window.setTimeout(() => setReaction(false), 4550);
    window.setTimeout(() => setPouring(null), 5050);
  };

  const clear = () => {
    setMix([]);
    setHeat('medium');
    setStir(0);
    setStirring(false);
    setPouring(null);
    setReaction(false);
    setResult(null);
  };

  const brew = () => {
    if (mix.length < 2 || pouring || stir < 100) return;
    const next = resultFor(mix, heat);
    setResult(next);
    setCoins((value) => value + next.value);
    setDiscoveries((current) => current.some((entry) => entry.key === next.key) ? current : [next, ...current]);
    setReaction(true);
    tone(sound, 610, 0.14, 0.045);
    window.setTimeout(() => tone(sound, 790, 0.16, 0.04), 120);
    window.setTimeout(() => tone(sound, 980, 0.18, 0.03), 260);
    if (navigator.vibrate) navigator.vibrate([25, 35, 55]);
    window.setTimeout(() => setReaction(false), 1200);
  };

  const finishTutorial = () => {
    setTutorialStep(-1);
    setTutorialSeen(true);
  };

  return (
    <main className={styles.page}>
      <section ref={phoneRef} className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.wash} />

        {screen === 'title' ? (
          <TitleScreen hasSave={hasSave} discoveries={discoveries.length} onStart={newGame} onContinue={() => { setScreen('game'); tone(sound, 430, 0.1); }} onSettings={() => setShowSettings(true)} />
        ) : (
          <>
            <header className={`${styles.topbar} ${pouring ? styles.topbarDim : ''}`}>
              <WoodButton className={styles.squareWood} onClick={() => setShowPause(true)}><Menu size={18} /></WoodButton>
              <div className={styles.brand}><small>MOONVEIL</small><strong>ALCHEMY ATELIER</strong></div>
              <div className={styles.topActions}>
                <div className={styles.coin}>{coins}</div>
                <WoodButton ref={bookRef} className={styles.squareWood} onClick={() => setShowBook(true)}><BookOpen size={18} /></WoodButton>
                <WoodButton className={styles.squareWood} onClick={() => setShowSettings(true)}><Settings size={17} /></WoodButton>
              </div>
            </header>

            <div className={`${styles.scene} ${pouring ? styles.scenePouring : ''}`}>
              <Canvas shadows dpr={[1, 1.7]} camera={{ position: [0, 2.34, 7.15], fov: 39, near: 0.1, far: 30 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
                <ambientLight intensity={pouring ? 1.2 : 1.55} color="#fff3e3" />
                <hemisphereLight args={['#fff9eb', '#806894', pouring ? 1.05 : 1.3]} />
                <directionalLight castShadow position={[4, 7, 5]} intensity={pouring ? 1.9 : 2.4} color="#ffe9cb" shadow-mapSize={[1024, 1024]} />
                <pointLight position={[-2.5, 2.8, 2.5]} intensity={2.5} distance={8} color="#ffc488" />
                <pointLight position={[2.5, 3, 2.2]} intensity={2.1} distance={8} color="#c4b0ff" />
                <CauldronFinal color={potionColor} heat={heat} stirring={stirring} splash={splash} reacting={reaction || !!pouring} />
              </Canvas>

              {pouring && (
                <div className={styles.pourStage} style={{ ['--stream-color' as string]: pouring.color }}>
                  <div className={styles.cinematicShade} />
                  <span className={styles.magicSpotlight} />
                  <span className={styles.cauldronAura} />
                  <span className={styles.sigilOuter}><i /><i /><i /><i /></span>
                  <span className={styles.sigilInner}><i /><i /><i /><i /><i /><i /></span>
                  <div className={styles.pourRig}>
                    <span className={styles.bottleGlow} />
                    <img src={pouring.image} alt="" className={styles.pourBottle} />
                    <span className={styles.nozzleGlow} />
                  </div>
                  <span className={styles.streamGlow} />
                  <span className={styles.pourStream} />
                  <span className={styles.pourStreamCore} />
                  <span className={styles.impactFlash} />
                  <span className={styles.impactPool} />
                  <span className={styles.rippleOne} />
                  <span className={styles.rippleTwo} />
                  <span className={styles.rippleThree} />
                  <span className={styles.magicMist} />
                  {Array.from({ length: 12 }).map((_, index) => <i key={`drop-${index}`} className={styles.droplet} style={{ ['--i' as string]: index }} />)}
                  {Array.from({ length: 14 }).map((_, index) => <i key={`spark-${index}`} className={styles.spark} style={{ ['--i' as string]: index }} />)}
                  <div className={styles.pourLabel}><small>INFUSING</small><strong>{pouring.name}</strong></div>
                </div>
              )}

              {!pouring && <div className={styles.caption}>{mix.length ? `${mix.length}/4 INGREDIENTS · ${stir >= 100 ? 'READY TO BREW' : 'STIR BEFORE BREWING'}` : 'CHOOSE A BOTTLE TO BEGIN'}</div>}
            </div>

            <section className={`${styles.controls} ${pouring ? styles.controlsDuringPour : ''}`}>
              <div className={styles.controlHead}>
                <div><small>ALCHEMY SHELF</small><strong>Choose up to 4 ingredients</strong></div>
                <WoodButton className={styles.clearWood} onClick={clear}><RotateCcw size={13} /> CLEAR</WoodButton>
              </div>
              <div ref={ingredientsRef} className={styles.ingredients}>
                {INGREDIENTS.map((ingredient) => (
                  <button key={ingredient.id} className={`${styles.ingredientCard} ${mix.includes(ingredient.id) ? styles.selected : ''}`} onClick={() => choose(ingredient)} disabled={!!pouring || mix.length >= 4}>
                    <span><img src={ingredient.image} alt={ingredient.name} /></span>
                    <b>{ingredient.short}</b>
                  </button>
                ))}
              </div>
              <div className={styles.actions}>
                <div ref={heatRef} className={styles.heatControl}>
                  {(['low', 'medium', 'high'] as Heat[]).map((value) => <WoodButton key={value} active={heat === value} className={styles.heatWood} onClick={() => setHeat(value)}><Flame size={12} /><em>{value}</em></WoodButton>)}
                </div>
                <WoodButton ref={stirRef} className={styles.stirWood} disabled={mix.length < 2 || !!pouring || stirring} onClick={() => { setStir(0); setStirring(true); tone(sound, 340, 0.09); }}><RotateCw size={15} className={stirring ? styles.spin : ''} />{stirring ? `${Math.round(stir)}%` : stir >= 100 ? 'STIRRED' : 'STIR'}</WoodButton>
                <WoodButton ref={brewRef} className={`${styles.brewWood} ${stir >= 100 && mix.length >= 2 ? styles.brewReady : ''}`} disabled={mix.length < 2 || !!pouring || stir < 100} onClick={brew}>BREW</WoodButton>
              </div>
            </section>
          </>
        )}

        {result && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultMagic} style={{ ['--result' as string]: result.color }} />
            <article className={styles.resultCard}>
              <button className={styles.closeResult} onClick={() => setResult(null)}><X size={18} /></button>
              <img src={mix.length ? item(mix[0]).image : poison1.src} alt="" />
              <small>{result.rarity}</small>
              <h2>{result.name}</h2>
              <p>{result.effect}</p>
              <em>{result.description}</em>
              <div><span>{result.value} COINS</span><span>{heat.toUpperCase()} HEAT</span><span>{discoveries.length} FOUND</span></div>
              <WoodButton className={styles.resultWood} onClick={() => { setResult(null); clear(); }}>KEEP MIXING</WoodButton>
            </article>
          </div>
        )}

        {showPause && (
          <div className={styles.modalOverlay}>
            <div className={styles.pausePanel}>
              <h2>PAUSED</h2>
              <WoodButton className={styles.pauseButton} onClick={() => setShowPause(false)}>RESUME</WoodButton>
              <WoodButton className={styles.pauseButton} onClick={() => { setShowPause(false); setShowBook(true); }}>RECIPE BOOK</WoodButton>
              <WoodButton className={styles.pauseButton} onClick={() => { setShowPause(false); setShowSettings(true); }}>OPTIONS</WoodButton>
              <WoodButton className={styles.pauseButton} onClick={() => { clear(); setShowPause(false); setScreen('title'); }}>EXIT</WoodButton>
            </div>
          </div>
        )}

        {showSettings && (
          <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
            <div className={styles.settingsPanel} onClick={(event) => event.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setShowSettings(false)}><X size={18} /></button>
              <h2>OPTIONS</h2>
              <button className={styles.settingRow} onClick={() => setSound((value) => !value)}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}<span>Magic sounds</span><b>{sound ? 'ON' : 'OFF'}</b></button>
              <button className={styles.settingRow} onClick={() => setTutorialStep(0)}><HelpCircle size={18} /><span>Show tutorial</span><b>OPEN</b></button>
              {screen === 'game' && <button className={styles.settingRow} onClick={() => { clear(); setShowSettings(false); setScreen('title'); }}><Home size={18} /><span>Return to main menu</span><b>HOME</b></button>}
              <p>Progress and discoveries save automatically on this device.</p>
            </div>
          </div>
        )}

        {tutorialStep >= 0 && (
          <div
            className={`${styles.tutorialOverlay} ${styles[`tutorialStep${tutorialStep}`]} ${tutorialGeometry ? styles.tutorialMeasured : ''}`}
            data-card-placement={tutorialGeometry?.placement}
            style={tutorialGeometry ? ({
              '--tutorial-focus-left': `${tutorialGeometry.focusLeft}px`,
              '--tutorial-focus-top': `${tutorialGeometry.focusTop}px`,
              '--tutorial-focus-width': `${tutorialGeometry.focusWidth}px`,
              '--tutorial-focus-height': `${tutorialGeometry.focusHeight}px`,
              '--tutorial-card-left': `${tutorialGeometry.cardLeft}px`,
              '--tutorial-card-top': `${tutorialGeometry.cardTop}px`,
              '--tutorial-arrow-left': `${tutorialGeometry.arrowLeft}px`,
            } as CSSProperties) : undefined}
          >
            <div className={styles.tutorialSpotlight} />
            <div ref={tutorialCardRef} className={styles.tutorialCard}>
              <div className={styles.tutorialBadge}>TUTORIAL {tutorialStep + 1}/5</div>
              {tutorialStep === 0 && <><h2>Choose an ingredient</h2><p>Tap any bottle on the shelf. It will fly to the cauldron and pour itself in.</p></>}
              {tutorialStep === 1 && <><h2>Set the flame</h2><p>Choose low, medium or high heat. Heat can change the potion you discover.</p></>}
              {tutorialStep === 2 && <><h2>Stir the mixture</h2><p>After adding at least two ingredients, stir until the mixture reaches 100%.</p></>}
              {tutorialStep === 3 && <><h2>Brew your potion</h2><p>When the mixture is fully stirred, press BREW to reveal what you created.</p></>}
              {tutorialStep === 4 && <><h2>Check the grimoire</h2><p>Open the book anytime to see known recipes, ingredients and the heat they use.</p></>}
              <div className={styles.tutorialFooter}>
                <div className={styles.tutorialProgress}>
                  {Array.from({ length: 5 }).map((_, index) => <i key={index} className={index === tutorialStep ? styles.tutorialDotActive : ''} />)}
                </div>
                <div className={styles.tutorialActions}>
                  {tutorialStep > 0 && <button className={styles.tutorialBack} onClick={() => setTutorialStep((step) => step - 1)}>BACK</button>}
                  <WoodButton className={styles.tutorialNext} onClick={() => tutorialStep === 4 ? finishTutorial() : setTutorialStep((step) => step + 1)}>
                    {tutorialStep === 4 ? <>GOT IT</> : <>NEXT <ChevronRight size={15} /></>}
                  </WoodButton>
                </div>
              </div>
            </div>
          </div>
        )}
        {showBook && <RecipeBook page={bookPage} onPage={setBookPage} onClose={() => setShowBook(false)} />}
      </section>
    </main>
  );
}
