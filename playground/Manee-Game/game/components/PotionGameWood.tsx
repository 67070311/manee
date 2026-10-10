'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { BookOpen, ChevronLeft, ChevronRight, Flame, Menu, RotateCcw, RotateCw, Settings, X } from 'lucide-react';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PotionGameWood.module.css';
import CauldronV2 from './CauldronV2';

import poison1 from '../poison/1.png';
import poison2 from '../poison/2.png';
import poison3 from '../poison/3.png';
import poison4 from '../poison/4.png';
import poison5 from '../poison/5.png';
import poison6 from '../poison/6.png';
import poison7 from '../poison/7.png';
import bookImage from '../book/image.png';

type Heat = 'low' | 'medium' | 'high';
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
type IngredientId = 'mooncap' | 'crystal' | 'mandrake' | 'ember' | 'dew' | 'nightshade' | 'sunpetal';

type Ingredient = {
  id: IngredientId;
  name: string;
  short: string;
  color: string;
  image: string;
  traits: string[];
};

type PotionResult = {
  name: string;
  type: string;
  rarity: Rarity;
  effect: string;
  description: string;
  value: number;
  color: string;
};

type Recipe = {
  name: string;
  subtitle: string;
  ingredients: IngredientId[];
  heat: Heat;
  effect: string;
};

const INGREDIENTS: Ingredient[] = [
  { id: 'mooncap', name: 'Mooncap', short: 'Moon', color: '#a891ff', image: poison1.src, traits: ['dream', 'arcane', 'calm'] },
  { id: 'crystal', name: 'Star Crystal', short: 'Star', color: '#77d8ff', image: poison2.src, traits: ['light', 'clarity', 'focus'] },
  { id: 'mandrake', name: 'Mandrake', short: 'Root', color: '#d9a06c', image: poison3.src, traits: ['earth', 'life', 'growth'] },
  { id: 'ember', name: 'Ember Seed', short: 'Ember', color: '#ff8069', image: poison4.src, traits: ['fire', 'power', 'chaos'] },
  { id: 'dew', name: 'Dawn Dew', short: 'Dew', color: '#75e0d0', image: poison5.src, traits: ['water', 'healing', 'purity'] },
  { id: 'nightshade', name: 'Nightshade', short: 'Shade', color: '#c978df', image: poison6.src, traits: ['shadow', 'stealth', 'poison'] },
  { id: 'sunpetal', name: 'Sunpetal', short: 'Sun', color: '#f2c968', image: poison7.src, traits: ['sun', 'warmth', 'luck'] },
];

const RECIPES: Recipe[] = [
  { name: 'Moonveil Elixir', subtitle: 'Silent steps beneath moonlight', ingredients: ['mooncap', 'crystal'], heat: 'medium', effect: 'Night vision + quieter movement.' },
  { name: 'Emberwrath Draught', subtitle: 'A fierce tonic for raw strength', ingredients: ['ember', 'sunpetal'], heat: 'high', effect: 'Short burst of strength and warmth.' },
  { name: 'Verdant Bloom Serum', subtitle: 'Living roots remember how to heal', ingredients: ['mandrake', 'dew'], heat: 'low', effect: 'Gradual recovery and wound mending.' },
  { name: 'Veilstep Tonic', subtitle: 'Walk where shadows refuse to speak', ingredients: ['nightshade', 'mooncap'], heat: 'low', effect: 'Dims the drinker and muffles footsteps.' },
  { name: 'Sunwash Essence', subtitle: 'Dawn gathered into a single bottle', ingredients: ['dew', 'sunpetal'], heat: 'medium', effect: 'Cleanses minor curses and fatigue.' },
  { name: 'Blackflame Philter', subtitle: 'Cold fire that burns without heat', ingredients: ['ember', 'nightshade'], heat: 'high', effect: 'Creates a cold dark magical flame.' },
];

function ingredient(id: IngredientId) {
  return INGREDIENTS.find((item) => item.id === id)!;
}

function mixColor(ids: IngredientId[]) {
  if (!ids.length) return '#eadff2';
  const out = new THREE.Color('#000000');
  ids.forEach((id) => out.add(new THREE.Color(ingredient(id).color)));
  return `#${out.multiplyScalar(1 / ids.length).getHexString()}`;
}

function generatePotion(ids: IngredientId[], heat: Heat): PotionResult {
  const traits = ids.flatMap((id) => ingredient(id).traits);
  const has = (...wanted: string[]) => wanted.every((trait) => traits.includes(trait));
  let result: PotionResult = {
    name: 'Mystery Brew',
    type: 'Essence',
    rarity: ids.length >= 4 ? 'Epic' : ids.length >= 3 ? 'Rare' : 'Common',
    effect: 'Creates an unpredictable magical effect.',
    description: 'The liquid refuses to settle into a single color. Something new may be hiding inside.',
    value: 30 + ids.length * 12,
    color: mixColor(ids),
  };
  if (has('dream', 'light')) result = { ...result, name: 'Moonveil Elixir', type: 'Elixir', rarity: 'Rare', effect: 'Improves night vision and makes footsteps almost silent.', description: 'Silver light folds across the surface like moonlight on still water.', value: 78, color: '#aa91ff' };
  if (has('fire', 'power') || has('fire', 'sun')) result = { ...result, name: heat === 'high' ? 'Emberwrath Draught' : 'Cinderheart Tonic', type: heat === 'high' ? 'Draught' : 'Tonic', rarity: heat === 'high' ? 'Epic' : 'Rare', effect: 'Warms the body and briefly boosts physical strength.', description: 'Tiny orange sparks circle the bottle before fading into the glass.', value: heat === 'high' ? 124 : 86, color: '#ff7d61' };
  if (has('life', 'healing')) result = { ...result, name: 'Verdant Bloom Serum', type: 'Serum', rarity: 'Epic', effect: 'Accelerates natural recovery and mends minor wounds.', description: 'Green motes bloom and disappear inside the potion like tiny leaves.', value: 136, color: '#78d993' };
  if (has('shadow', 'stealth')) result = { ...result, name: 'Veilstep Tonic', type: 'Tonic', rarity: 'Rare', effect: 'Dims the drinker’s silhouette and muffles movement.', description: 'The bottle appears nearly empty until held against a bright light.', value: 94, color: '#8863b3' };
  if (has('purity', 'sun')) result = { ...result, name: 'Sunwash Essence', type: 'Essence', rarity: 'Epic', effect: 'Cleanses minor curses and restores energy.', description: 'Warm gold gathers at the surface like sunrise caught in honey.', value: 142, color: '#f4d176' };
  if (has('fire', 'shadow')) result = { ...result, name: 'Blackflame Philter', type: 'Philter', rarity: heat === 'high' ? 'Legendary' : 'Epic', effect: 'Produces cold dark fire that glows without giving off heat.', description: 'Its flame seems to burn inward, brighter in shadow than in daylight.', value: heat === 'high' ? 236 : 158, color: '#744a91' };
  return result;
}

function WoodButton({ children, active = false, className = '', onClick, disabled = false, title }: { children: React.ReactNode; active?: boolean; className?: string; onClick?: () => void; disabled?: boolean; title?: string }) {
  return (
    <button title={title} className={`${styles.woodButton} ${active ? styles.woodActive : ''} ${className}`} onClick={onClick} disabled={disabled}>
      <span className={styles.woodInner}>{children}</span>
    </button>
  );
}

function Cauldron({ ids, heat, stirring, splash }: { ids: IngredientId[]; heat: Heat; stirring: boolean; splash: number }) {
  const liquid = useRef<THREE.Mesh>(null);
  const spoon = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(mixColor(ids)), [ids]);
  const flame = heat === 'low' ? '#ffc074' : heat === 'medium' ? '#ff8b61' : '#ffd85f';

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (stirring ? 4.8 : 0.22);
      const material = liquid.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.72 + Math.sin(state.clock.elapsedTime * 3) * 0.08 + (stirring ? 0.2 : 0);
    }
    if (spoon.current) spoon.current.rotation.z = stirring ? Math.sin(state.clock.elapsedTime * 5.2) * 0.5 : -0.12;
  });

  return (
    <group position={[0, -2.32, 0]}>
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <cylinderGeometry args={[1.26, 1.48, 0.58, 12]} />
        <meshStandardMaterial color="#6d4938" roughness={0.92} />
      </mesh>
      <mesh castShadow scale={[1.2, 0.88, 1.2]} position={[0, 0.64, 0]}>
        <sphereGeometry args={[1.02, 56, 36, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.7]} />
        <meshStandardMaterial color="#351441" roughness={0.18} metalness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.14, 0.11, 18, 96]} />
        <meshStandardMaterial color="#9f69b2" roughness={0.15} metalness={0.48} />
      </mesh>
      <mesh ref={liquid} position={[0, 1.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.08} transparent opacity={0.97} />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.64, 0.94, 90]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.08} />
      </mesh>
      {[-0.76, 0.76].map((x) => (
        <mesh key={x} castShadow position={[x, 0.04, 0]} rotation={[0, 0, x > 0 ? -0.18 : 0.18]}>
          <cylinderGeometry args={[0.09, 0.15, 0.76, 14]} />
          <meshStandardMaterial color="#33253e" roughness={0.36} />
        </mesh>
      ))}
      <group position={[0, -0.12, 0]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 10) * Math.PI * 2) * 0.44, 0.08 + (i % 2) * 0.06, Math.sin((i / 10) * Math.PI * 2) * 0.32]}>
            <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.04 : heat === 'medium' ? 0.02 : 0), 0]} />
            <meshBasicMaterial color={flame} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 2.1 : heat === 'medium' ? 4.2 : 6} distance={5.6} color={flame} />
      </group>
      <group ref={spoon} position={[0.18, 1.8, 0.05]} rotation={[0.12, 0, -0.12]}>
        <mesh position={[0, -0.45, 0]}><cylinderGeometry args={[0.038, 0.048, 1.3, 12]} /><meshStandardMaterial color="#a5683e" roughness={0.7} /></mesh>
        <mesh position={[0, -1.04, 0]} scale={[0.2, 0.3, 0.09]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#bb7a48" roughness={0.66} /></mesh>
      </group>
      {ids.length > 0 && Array.from({ length: 16 }).map((_, i) => (
        <Float key={i} speed={1.2 + i * 0.05} floatIntensity={0.55} rotationIntensity={0.03}>
          <mesh position={[-0.8 + (i % 6) * 0.32, 1.32 + (i % 4) * 0.2, -0.18 + (i % 2) * 0.3]}>
            <sphereGeometry args={[0.025 + (i % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.72} />
          </mesh>
        </Float>
      ))}
      {splash > 0 && <group key={splash} position={[0, 1.17, 0]}>{[0, 1, 2].map((i) => <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={1 + i * 0.28}><torusGeometry args={[0.5, 0.02, 8, 72]} /><meshBasicMaterial color={color} transparent opacity={0.42 - i * 0.09} /></mesh>)}</group>}
    </group>
  );
}

function Scene({ ids, heat, stirring, splash }: { ids: IngredientId[]; heat: Heat; stirring: boolean; splash: number }) {
  return (
    <>
      <ambientLight intensity={1.6} color="#fff3e3" />
      <hemisphereLight args={['#fff9eb', '#806894', 1.35]} />
      <directionalLight castShadow position={[4, 7, 5]} intensity={2.4} color="#ffe9cb" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2.5, 2.8, 2.5]} intensity={2.6} distance={8} color="#ffc488" />
      <pointLight position={[2.5, 3, 2.2]} intensity={2.2} distance={8} color="#c4b0ff" />
      <CauldronV2 color={mixColor(ids)} heat={heat} stirring={stirring} splash={splash} />
    </>
  );
}

function RecipeBook({ page, setPage, onClose }: { page: number; setPage: (value: number) => void; onClose: () => void }) {
  const recipe = RECIPES[page];
  return (
    <div className={styles.bookOverlay} onClick={onClose}>
      <div className={styles.bookWrap} onClick={(event) => event.stopPropagation()}>
        <img src={bookImage.src} className={styles.bookImage} alt="Recipe book" />
        <button className={styles.bookClose} onClick={onClose}><X size={18} /></button>
        <section className={`${styles.bookPageContent} ${styles.bookLeft}`}>
          <span className={styles.bookKicker}>POTION RECIPE</span>
          <h2>{recipe.name}</h2>
          <p className={styles.bookSubtitle}>{recipe.subtitle}</p>
          <div className={styles.bookRule} />
          <p className={styles.bookEffect}>{recipe.effect}</p>
          <span className={styles.pageNumber}>{page + 1}</span>
        </section>
        <section className={`${styles.bookPageContent} ${styles.bookRight}`}>
          <span className={styles.bookKicker}>INGREDIENTS</span>
          <div className={styles.recipeIngredientList}>
            {recipe.ingredients.map((id, index) => {
              const item = ingredient(id);
              return (
                <div className={styles.recipeIngredient} key={id}>
                  <span>{index + 1}</span>
                  <img src={item.image} alt="" />
                  <strong>{item.name}</strong>
                </div>
              );
            })}
          </div>
          <div className={styles.heatNote}><Flame size={15} /> {recipe.heat.toUpperCase()} FLAME</div>
          <p className={styles.bookTip}>Mix freely too — these pages are only trusted discoveries from other alchemists.</p>
          <span className={styles.pageNumber}>{page + 1}</span>
        </section>
        <button className={`${styles.bookArrow} ${styles.bookPrev}`} onClick={() => setPage((page - 1 + RECIPES.length) % RECIPES.length)}><ChevronLeft size={22} /></button>
        <button className={`${styles.bookArrow} ${styles.bookNext}`} onClick={() => setPage((page + 1) % RECIPES.length)}><ChevronRight size={22} /></button>
      </div>
    </div>
  );
}

export default function PotionGameWood() {
  const [mix, setMix] = useState<IngredientId[]>([]);
  const [heat, setHeat] = useState<Heat>('medium');
  const [stirring, setStirring] = useState(false);
  const [stir, setStir] = useState(0);
  const [pouring, setPouring] = useState<Ingredient | null>(null);
  const [splash, setSplash] = useState(0);
  const [result, setResult] = useState<PotionResult | null>(null);
  const [showBook, setShowBook] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [coins, setCoins] = useState(120);

  useEffect(() => {
    if (!stirring) return;
    const timer = window.setInterval(() => {
      setStir((value) => {
        const next = Math.min(100, value + 3.2);
        if (next >= 100) setStirring(false);
        return next;
      });
    }, 45);
    return () => window.clearInterval(timer);
  }, [stirring]);

  const chooseIngredient = (item: Ingredient) => {
    if (pouring || mix.length >= 4) return;
    setPouring(item);
    window.setTimeout(() => {
      setMix((current) => [...current, item.id]);
      setSplash((current) => current + 1);
    }, 2850);
    window.setTimeout(() => setPouring(null), 4450);
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
    const potion = generatePotion(mix, heat);
    setResult(potion);
    setCoins((current) => current + potion.value);
  };

  return (
    <main className={styles.page}>
      <section className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.wash} />

        <header className={styles.topbar}>
          <WoodButton className={styles.squareWood} title="Menu"><Menu size={18} /></WoodButton>
          <div className={styles.brand}><small>MOONVEIL</small><strong>ALCHEMY ATELIER</strong></div>
          <div className={styles.topActions}>
            <div className={styles.coinWood}><span>{coins}</span></div>
            <WoodButton className={styles.squareWood} onClick={() => setShowBook(true)} title="Recipe book"><BookOpen size={18} /></WoodButton>
            <WoodButton className={styles.squareWood} title="Settings"><Settings size={17} /></WoodButton>
          </div>
        </header>

        <div className={styles.scene}>
          <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 2.4, 7.15], fov: 39, near: 0.1, far: 30 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
            <Scene ids={mix} heat={heat} stirring={stirring} splash={splash} />
          </Canvas>

          {pouring && (
            <div className={styles.pourStage}>
              <img src={pouring.image} alt="" className={styles.pourBottle} />
              <span className={styles.pourStream} style={{ ['--stream-color' as string]: pouring.color }} />
              <span className={styles.pourSplash} style={{ ['--stream-color' as string]: pouring.color }} />
            </div>
          )}

          <div className={styles.caption}>{pouring ? `Pouring ${pouring.name}...` : mix.length ? `${mix.length}/4 ingredients mixed` : 'Pick any bottle and discover a potion'}</div>
        </div>

        <section className={styles.controls}>
          <div className={styles.controlHead}>
            <div><small>ALCHEMY SHELF</small><strong>Choose up to 4 ingredients</strong></div>
            <WoodButton className={styles.clearWood} onClick={clear}><RotateCcw size={13} /> CLEAR</WoodButton>
          </div>

          <div className={styles.ingredients}>
            {INGREDIENTS.map((item) => (
              <button key={item.id} className={`${styles.ingredientCard} ${mix.includes(item.id) ? styles.selected : ''}`} onClick={() => chooseIngredient(item)} disabled={!!pouring || mix.length >= 4}>
                <span className={styles.ingredientFrame}><img src={item.image} alt={item.name} /></span>
                <span>{item.short}</span>
              </button>
            ))}
          </div>

          <div className={styles.actionRow}>
            <div className={styles.heatControl}>
              {(['low', 'medium', 'high'] as Heat[]).map((value) => (
                <WoodButton key={value} active={heat === value} className={styles.heatWood} onClick={() => setHeat(value)}>
                  <Flame size={12} /><span>{value.toUpperCase()}</span>
                </WoodButton>
              ))}
            </div>
            <WoodButton className={styles.stirWood} disabled={mix.length < 2 || !!pouring} onClick={() => { setStir(0); setStirring(true); }}>
              <RotateCw size={15} className={stirring ? styles.spin : ''} />
              <span>{stirring ? `${stir}%` : 'STIR'}</span>
            </WoodButton>
            <WoodButton className={styles.brewWood} disabled={mix.length < 2 || !!pouring} onClick={brew}>
              <span>BREW</span>
            </WoodButton>
          </div>
        </section>

        {result && (
          <div className={styles.resultOverlay}>
            <article className={styles.resultCard}>
              <button className={styles.closeResult} onClick={() => setResult(null)}><X size={18} /></button>
              <img src={mix.length ? ingredient(mix[0]).image : poison1.src} alt="" className={styles.resultBottle} />
              <small>{result.rarity.toUpperCase()} · {result.type.toUpperCase()}</small>
              <h2>{result.name}</h2>
              <p>{result.effect}</p>
              <em>{result.description}</em>
              <div className={styles.resultMeta}><span>{result.value} COINS</span><span>{heat.toUpperCase()} HEAT</span></div>
              <WoodButton className={styles.resultWood} onClick={() => { setResult(null); clear(); }}>KEEP MIXING</WoodButton>
            </article>
          </div>
        )}

        {showBook && <RecipeBook page={bookPage} setPage={setBookPage} onClose={() => setShowBook(false)} />}
      </section>
    </main>
  );
}
