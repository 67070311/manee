'use client';

import { Canvas } from '@react-three/fiber';
import { BookOpen, ChevronLeft, ChevronRight, Flame, Menu, RotateCcw, RotateCw, Settings, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import styles from './PotionGamePourFocus.module.css';
import CauldronV2 from './CauldronV2';

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
  name: string;
  rarity: string;
  effect: string;
  color: string;
  value: number;
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

function item(id: IngredientId) {
  return INGREDIENTS.find((entry) => entry.id === id)!;
}

function averageColor(ids: IngredientId[]) {
  if (!ids.length) return '#a989c0';
  const values = ids.map((id) => item(id).color.replace('#', '')).map((hex) => [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]);
  const rgb = [0, 1, 2].map((index) => Math.round(values.reduce((sum, value) => sum + value[index], 0) / values.length));
  return `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function resultFor(ids: IngredientId[], heat: Heat): Result {
  const key = [...ids].sort().join('-');
  if (key.includes('crystal') && key.includes('mooncap')) return { name: 'Moonveil Elixir', rarity: 'RARE ELIXIR', effect: 'Night vision + quieter movement', color: '#ad92ff', value: 84 };
  if (key.includes('ember') && key.includes('sunpetal')) return { name: heat === 'high' ? 'Emberwrath Draught' : 'Cinderheart Tonic', rarity: heat === 'high' ? 'EPIC DRAUGHT' : 'RARE TONIC', effect: 'Strength + warmth', color: '#ff836a', value: heat === 'high' ? 132 : 92 };
  if (key.includes('dew') && key.includes('mandrake')) return { name: 'Verdant Bloom Serum', rarity: 'EPIC SERUM', effect: 'Recovery + regeneration', color: '#79d999', value: 144 };
  if (key.includes('mooncap') && key.includes('nightshade')) return { name: 'Veilstep Tonic', rarity: 'RARE TONIC', effect: 'Stealth + silent movement', color: '#8665b9', value: 102 };
  if (key.includes('dew') && key.includes('sunpetal')) return { name: 'Sunwash Essence', rarity: 'EPIC ESSENCE', effect: 'Cleansing + energy', color: '#f0d06f', value: 148 };
  if (key.includes('ember') && key.includes('nightshade')) return { name: 'Blackflame Philter', rarity: heat === 'high' ? 'LEGENDARY PHILTER' : 'EPIC PHILTER', effect: 'Cold magical flame', color: '#72488f', value: heat === 'high' ? 228 : 164 };
  return { name: 'Mystery Brew', rarity: ids.length >= 4 ? 'EPIC ESSENCE' : ids.length >= 3 ? 'RARE ESSENCE' : 'COMMON ESSENCE', effect: 'An unknown magical reaction', color: averageColor(ids), value: 28 + ids.length * 18 };
}

function WoodButton({ children, active = false, className = '', onClick, disabled = false }: { children: React.ReactNode; active?: boolean; className?: string; onClick?: () => void; disabled?: boolean }) {
  return <button className={`${styles.woodButton} ${active ? styles.woodActive : ''} ${className}`} onClick={onClick} disabled={disabled}><span>{children}</span></button>;
}

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
              <div key={id}>
                <b>{index + 1}</b>
                <img src={item(id).image} alt="" />
                <strong>{item(id).name}</strong>
              </div>
            ))}
          </div>
          <div className={styles.recipeHeat}><Flame size={15} /> {recipe.heat.toUpperCase()} FLAME</div>
          <p className={styles.bookHint}>These pages are suggestions. You can still mix anything you want.</p>
        </section>
        <button className={`${styles.bookArrow} ${styles.bookPrev}`} onClick={() => onPage((page - 1 + RECIPES.length) % RECIPES.length)}><ChevronLeft size={23} /></button>
        <button className={`${styles.bookArrow} ${styles.bookNext}`} onClick={() => onPage((page + 1) % RECIPES.length)}><ChevronRight size={23} /></button>
      </div>
    </div>
  );
}

export default function PotionGamePourFocus() {
  const [mix, setMix] = useState<IngredientId[]>([]);
  const [heat, setHeat] = useState<Heat>('medium');
  const [pouring, setPouring] = useState<Ingredient | null>(null);
  const [splash, setSplash] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [stir, setStir] = useState(0);
  const [coins, setCoins] = useState(120);
  const [result, setResult] = useState<Result | null>(null);
  const [showBook, setShowBook] = useState(false);
  const [bookPage, setBookPage] = useState(0);

  const potionColor = useMemo(() => averageColor(mix), [mix]);

  useEffect(() => {
    if (!stirring) return;
    const timer = window.setInterval(() => setStir((value) => {
      const next = Math.min(100, value + 3.6);
      if (next >= 100) setStirring(false);
      return next;
    }), 46);
    return () => window.clearInterval(timer);
  }, [stirring]);

  const choose = (ingredient: Ingredient) => {
    if (pouring || mix.length >= 4) return;
    setPouring(ingredient);
    window.setTimeout(() => {
      setMix((current) => [...current, ingredient.id]);
      setSplash((current) => current + 1);
      if (navigator.vibrate) navigator.vibrate(18);
    }, 3250);
    window.setTimeout(() => setPouring(null), 5250);
  };

  const clear = () => {
    setMix([]);
    setStir(0);
    setStirring(false);
    setPouring(null);
    setResult(null);
  };

  const brew = () => {
    if (mix.length < 2 || pouring) return;
    const next = resultFor(mix, heat);
    setResult(next);
    setCoins((value) => value + next.value);
  };

  return (
    <main className={styles.page}>
      <section className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.wash} />

        <header className={styles.topbar}>
          <WoodButton className={styles.squareWood}><Menu size={18} /></WoodButton>
          <div className={styles.brand}><small>MOONVEIL</small><strong>ALCHEMY ATELIER</strong></div>
          <div className={styles.topActions}>
            <div className={styles.coin}>{coins}</div>
            <WoodButton className={styles.squareWood} onClick={() => setShowBook(true)}><BookOpen size={18} /></WoodButton>
            <WoodButton className={styles.squareWood}><Settings size={17} /></WoodButton>
          </div>
        </header>

        <div className={`${styles.scene} ${pouring ? styles.scenePouring : ''}`}>
          <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 2.45, 7.2], fov: 39, near: 0.1, far: 30 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
            <ambientLight intensity={1.55} color="#fff3e3" />
            <hemisphereLight args={['#fff9eb', '#806894', 1.3]} />
            <directionalLight castShadow position={[4, 7, 5]} intensity={2.4} color="#ffe9cb" shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-2.5, 2.8, 2.5]} intensity={2.5} distance={8} color="#ffc488" />
            <pointLight position={[2.5, 3, 2.2]} intensity={2.1} distance={8} color="#c4b0ff" />
            <CauldronV2 color={potionColor} heat={heat} stirring={stirring} splash={splash} />
          </Canvas>

          {pouring && (
            <div className={styles.pourStage}>
              <span className={styles.pourFocus} />
              <span className={styles.pourHalo} style={{ ['--stream-color' as string]: pouring.color }} />
              <img src={pouring.image} alt="" className={styles.pourBottle} />
              <span className={styles.pourStream} style={{ ['--stream-color' as string]: pouring.color }} />
              <span className={styles.pourStreamCore} />
              <span className={styles.pourImpact} style={{ ['--stream-color' as string]: pouring.color }} />
              <span className={styles.pourRingA} style={{ ['--stream-color' as string]: pouring.color }} />
              <span className={styles.pourRingB} style={{ ['--stream-color' as string]: pouring.color }} />
              {Array.from({ length: 8 }).map((_, index) => <i key={index} className={styles.pourDroplet} style={{ ['--i' as string]: index, ['--stream-color' as string]: pouring.color }} />)}
            </div>
          )}

          <div className={styles.caption}>{pouring ? `POURING ${pouring.name.toUpperCase()}...` : mix.length ? `${mix.length}/4 INGREDIENTS MIXED` : 'CHOOSE A BOTTLE TO BEGIN'}</div>
        </div>

        <section className={styles.controls}>
          <div className={styles.controlHead}>
            <div><small>ALCHEMY SHELF</small><strong>Choose up to 4 ingredients</strong></div>
            <WoodButton className={styles.clearWood} onClick={clear}><RotateCcw size={13} /> CLEAR</WoodButton>
          </div>

          <div className={styles.ingredients}>
            {INGREDIENTS.map((ingredient) => (
              <button key={ingredient.id} className={`${styles.ingredientCard} ${mix.includes(ingredient.id) ? styles.selected : ''}`} onClick={() => choose(ingredient)} disabled={!!pouring || mix.length >= 4}>
                <span><img src={ingredient.image} alt={ingredient.name} /></span>
                <b>{ingredient.short}</b>
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <div className={styles.heatControl}>
              {(['low', 'medium', 'high'] as Heat[]).map((value) => <WoodButton key={value} active={heat === value} className={styles.heatWood} onClick={() => setHeat(value)}><Flame size={12} /><em>{value}</em></WoodButton>)}
            </div>
            <WoodButton className={styles.stirWood} disabled={mix.length < 2 || !!pouring} onClick={() => { setStir(0); setStirring(true); }}><RotateCw size={15} className={stirring ? styles.spin : ''} />{stirring ? `${Math.round(stir)}%` : 'STIR'}</WoodButton>
            <WoodButton className={styles.brewWood} disabled={mix.length < 2 || !!pouring} onClick={brew}>BREW</WoodButton>
          </div>
        </section>

        {result && (
          <div className={styles.resultOverlay}>
            <article className={styles.resultCard}>
              <button className={styles.closeResult} onClick={() => setResult(null)}><X size={18} /></button>
              <img src={mix.length ? item(mix[0]).image : poison1.src} alt="" />
              <small>{result.rarity}</small>
              <h2>{result.name}</h2>
              <p>{result.effect}</p>
              <div><span>{result.value} COINS</span><span>{heat.toUpperCase()} HEAT</span></div>
              <WoodButton className={styles.resultWood} onClick={() => { setResult(null); clear(); }}>KEEP MIXING</WoodButton>
            </article>
          </div>
        )}

        {showBook && <RecipeBook page={bookPage} onPage={setBookPage} onClose={() => setShowBook(false)} />}
      </section>
    </main>
  );
}
