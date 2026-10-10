'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import {
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Eye,
  Flame,
  FlaskConical,
  Gem,
  Leaf,
  Moon,
  RotateCcw,
  RotateCw,
  Sparkles as SparklesIcon,
  Sprout,
  Star,
  XCircle,
} from 'lucide-react';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PotionGameMobileV2.module.css';

const INGREDIENTS = [
  { id: 'mooncap', name: 'Mooncap', color: '#9b83ff', soft: '#eee9ff' },
  { id: 'crystal', name: 'Star Crystal', color: '#55cffe', soft: '#e3f8ff' },
  { id: 'mandrake', name: 'Mandrake', color: '#d99763', soft: '#fff0dc' },
  { id: 'ember', name: 'Ember Seed', color: '#ff7558', soft: '#ffe8e2' },
  { id: 'frog', name: 'Frog Eye', color: '#7bd45d', soft: '#eaffdf' },
  { id: 'shade', name: 'Nightshade', color: '#c96be8', soft: '#f8e7ff' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];
type Heat = 'low' | 'medium' | 'high';
type Result = 'idle' | 'success' | 'fail';
type BrewItem = { id: IngredientId; name: string; color: string };
type PourState = {
  id: IngredientId;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
};

const RECIPE = {
  name: 'Moonveil Elixir',
  ingredients: ['mooncap', 'crystal', 'mandrake'] as IngredientId[],
  heat: 'medium' as Heat,
  stir: 62,
};

function IngredientGlyph({ id, size = 18 }: { id: IngredientId; size?: number }) {
  if (id === 'mooncap') return <Moon size={size} strokeWidth={1.9} />;
  if (id === 'crystal') return <Gem size={size} strokeWidth={1.9} />;
  if (id === 'mandrake') return <Sprout size={size} strokeWidth={1.9} />;
  if (id === 'ember') return <Flame size={size} strokeWidth={1.9} />;
  if (id === 'frog') return <Eye size={size} strokeWidth={1.9} />;
  return <Leaf size={size} strokeWidth={1.9} />;
}

function tone(freq: number, duration = 0.1) {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    osc.onended = () => ctx.close();
  } catch {}
}

function MagicRing({ color, stir }: { color: THREE.Color; stir: number }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (outer.current) outer.current.rotation.z = state.clock.elapsedTime * (0.18 + stir / 600);
    if (inner.current) inner.current.rotation.z = -state.clock.elapsedTime * (0.24 + stir / 520);
  });
  return (
    <group position={[0, 0.48, -0.42]}>
      <mesh ref={outer} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.28, 0.014, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.98, 0.009, 8, 88]} />
        <meshBasicMaterial color="#fff7dd" transparent opacity={0.38} />
      </mesh>
      <Sparkles count={24} scale={[2.8, 1.5, 0.3]} size={2.6} speed={0.32 + stir / 260} color={color} />
    </group>
  );
}

function SplashBurst({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const started = useRef(0);

  useFrame((state) => {
    if (!started.current) started.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - started.current) / 0.7);
    if (group.current) group.current.scale.setScalar(0.45 + t * 1.45);
    if (ring.current) {
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.75 * (1 - t);
    }
  });

  return (
    <group ref={group} position={[0, 0.93, 0]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.035, 10, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <Sparkles count={36} scale={[1.8, 1.8, 1.8]} size={4} speed={2.2} color={color} />
      <pointLight intensity={5} distance={4} color={color} />
    </group>
  );
}

function DecorativeBottle({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.22}>
      <group position={position} scale={scale}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.2, 0.46, 16]} />
          <meshPhysicalMaterial color="#e9e5f2" transparent opacity={0.42} roughness={0.08} transmission={0.35} thickness={0.5} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.115, 0.165, 0.22, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.48} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
          <meshStandardMaterial color="#c9b38d" roughness={0.82} />
        </mesh>
        <pointLight intensity={0.7} distance={1.2} color={color} />
      </group>
    </Float>
  );
}

function Cauldron({
  brew,
  heat,
  stir,
  result,
  splashTick,
  splashColor,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  result: Result;
  splashTick: number;
  splashColor: string;
}) {
  const liquid = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);

  const potionColor = useMemo(() => {
    if (!brew.length) return new THREE.Color('#9a82db');
    const c = new THREE.Color('#000000');
    brew.forEach((item) => c.add(new THREE.Color(item.color)));
    return c.multiplyScalar(1 / brew.length);
  }, [brew]);

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (0.28 + stir / 48);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.68 + Math.sin(state.clock.elapsedTime * 3.2) * 0.08 + stir / 260;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.012;
      liquid.current.scale.setScalar(pulse);
    }
    if (body.current && result === 'fail') body.current.rotation.z = Math.sin(state.clock.elapsedTime * 34) * 0.025;
    else if (body.current) body.current.rotation.z *= 0.84;
  });

  const flameColor = heat === 'low' ? '#ffca73' : heat === 'medium' ? '#ff8a5b' : '#ffe36f';

  return (
    <group ref={body} position={[0, -0.32, 0]}>
      <MagicRing color={potionColor} stir={stir} />

      <mesh castShadow scale={[1.14, 0.84, 1.14]} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.84, 44, 28, 0, Math.PI * 2, Math.PI * 0.21, Math.PI * 0.68]} />
        <meshStandardMaterial color="#55446f" roughness={0.23} metalness={0.26} />
      </mesh>
      <mesh castShadow position={[0, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.078, 16, 72]} />
        <meshStandardMaterial color="#8a6eaa" roughness={0.2} metalness={0.38} />
      </mesh>
      <mesh ref={liquid} position={[0, 1.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.83, 72]} />
        <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.75} roughness={0.1} transparent opacity={0.95} />
      </mesh>

      <mesh position={[0, 1.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.79, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.055} />
      </mesh>

      {[-0.57, 0.57].map((x) => (
        <mesh key={x} castShadow position={[x, 0.02, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.08, 0.13, 0.66, 12]} />
          <meshStandardMaterial color="#4b3b61" roughness={0.35} />
        </mesh>
      ))}

      <group position={[0, -0.02, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2) * 0.35, 0.06 + (i % 2) * 0.06, Math.sin((i / 8) * Math.PI * 2) * 0.28]}>
            <dodecahedronGeometry args={[0.085 + (heat === 'high' ? 0.035 : heat === 'medium' ? 0.02 : 0), 0]} />
            <meshBasicMaterial color={flameColor} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 2 : heat === 'medium' ? 3.8 : 5.5} distance={4.8} color={flameColor} />
      </group>

      {brew.length > 0 && (
        <>
          <Sparkles count={44 + brew.length * 10} scale={[2.2, 1.9, 2.2]} position={[0, 1.4, 0]} size={3.2} speed={0.75 + stir / 78} color={potionColor} />
          {Array.from({ length: 7 }).map((_, i) => (
            <Float key={i} speed={1.7 + i * 0.08} floatIntensity={0.42} rotationIntensity={0.12}>
              <mesh position={[-0.55 + (i % 4) * 0.36, 1.18 + (i % 3) * 0.19, -0.12 + (i % 2) * 0.27]}>
                <sphereGeometry args={[0.045 + (i % 2) * 0.02, 12, 10]} />
                <meshBasicMaterial color={potionColor} transparent opacity={0.82} />
              </mesh>
            </Float>
          ))}
        </>
      )}

      {splashTick > 0 && <SplashBurst key={splashTick} color={splashColor} />}

      {result === 'success' && (
        <group position={[0, 1.42, 0]}>
          <Sparkles count={150} scale={[3.5, 3.2, 3.5]} size={5.6} speed={2.5} color="#fff0a7" />
          <pointLight intensity={10} distance={7} color="#fff1ac" />
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, i * 0.72, i * 0.25]} scale={0.82 + i * 0.5}>
              <torusGeometry args={[0.78, 0.022, 8, 84]} />
              <meshBasicMaterial color={i === 1 ? '#7ee7ff' : '#d6b7ff'} transparent opacity={0.72 - i * 0.16} />
            </mesh>
          ))}
        </group>
      )}

      {result === 'fail' && (
        <group position={[0, 1.34, 0]}>
          <Sparkles count={76} scale={[2.5, 2.3, 2.5]} size={5} speed={2.7} color="#6d5d78" />
          <pointLight intensity={4.2} distance={4} color="#ff806e" />
        </group>
      )}
    </group>
  );
}

function Scene({
  brew,
  heat,
  stir,
  result,
  splashTick,
  splashColor,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  result: Result;
  splashTick: number;
  splashColor: string;
}) {
  return (
    <>
      <ambientLight intensity={1.75} color="#fff6e8" />
      <hemisphereLight args={['#fffbe9', '#88729e', 1.65]} />
      <directionalLight castShadow position={[3.5, 7, 5]} intensity={2.35} color="#fff2d0" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2.4, 2.7, 3]} intensity={3.1} distance={8} color="#ffc994" />
      <pointLight position={[2.2, 2.8, 2]} intensity={2.5} distance={8} color="#c5b0ff" />

      <group position={[0, 0.1, 0]} scale={1.08}>
        <Cauldron brew={brew} heat={heat} stir={stir} result={result} splashTick={splashTick} splashColor={splashColor} />
        <DecorativeBottle position={[-1.48, 1.18, 0.12]} color="#a584ff" scale={0.9} />
        <DecorativeBottle position={[1.5, 1.1, 0.18]} color="#72d7ff" scale={0.82} />
        <DecorativeBottle position={[-1.72, 0.35, -0.15]} color="#f19f6e" scale={0.68} />
        <DecorativeBottle position={[1.72, 0.34, -0.1]} color="#d571ee" scale={0.66} />
      </group>

      <Sparkles count={68} scale={[5.8, 5.2, 3]} position={[0, 1.55, -0.3]} size={2.6} speed={0.22} color="#ffe8b7" />
      <ContactShadows position={[0, -0.55, 0]} opacity={0.24} scale={6.4} blur={3.8} far={4.8} color="#654f73" />
    </>
  );
}

function BottleGraphic({ color }: { color: string }) {
  return (
    <span className={styles.bottleGraphic} aria-hidden="true">
      <span className={styles.bottleNeck} />
      <span className={styles.bottleBody}>
        <span className={styles.bottleLiquid} style={{ background: color }} />
        <span className={styles.bottleShine} />
      </span>
    </span>
  );
}

export default function PotionGameMobileV2() {
  const phoneRef = useRef<HTMLElement>(null);
  const [brew, setBrew] = useState<BrewItem[]>([]);
  const [heat, setHeat] = useState<Heat>('low');
  const [stir, setStir] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [result, setResult] = useState<Result>('idle');
  const [message, setMessage] = useState('Tap a potion bottle to pour it into the cauldron.');
  const [showRecipe, setShowRecipe] = useState(false);
  const [pouring, setPouring] = useState<PourState | null>(null);
  const [splashTick, setSplashTick] = useState(0);
  const [splashColor, setSplashColor] = useState('#9b83ff');

  useEffect(() => {
    if (!stirring || result !== 'idle' || brew.length < 3) return;
    const timer = window.setInterval(() => {
      setStir((value) => Math.min(100, value + 2.1));
      tone(330 + Math.round(stir) * 1.4, 0.035);
    }, 55);
    return () => window.clearInterval(timer);
  }, [stirring, result, brew.length, stir]);

  useEffect(() => {
    if (stir >= RECIPE.stir && brew.length === 3 && heat === 'medium' && result === 'idle') {
      setMessage('Everything is aligned. Your potion is ready to brew.');
    }
  }, [stir, brew.length, heat, result]);

  const commitIngredient = (id: IngredientId) => {
    const item = INGREDIENTS.find((x) => x.id === id)!;
    setBrew((current) => {
      if (current.length >= 3) return current;
      return [...current, { id, name: item.name, color: item.color }];
    });
    setSplashColor(item.color);
    setSplashTick((value) => value + 1);
    tone(360 + brew.length * 70, 0.13);
  };

  const pourIngredient = (id: IngredientId, button: HTMLButtonElement) => {
    if (result !== 'idle' || pouring) return;
    if (brew.length >= 3) {
      setMessage('Three essences are already in the cauldron. Set the flame and stir.');
      return;
    }
    const phone = phoneRef.current?.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    if (!phone) return;
    const startX = rect.left + rect.width / 2 - phone.left;
    const startY = rect.top + rect.height / 2 - phone.top;
    const targetX = phone.width * 0.5;
    const targetY = phone.height * 0.43;
    setPouring({ id, startX, startY, dx: targetX - startX, dy: targetY - startY });
    const item = INGREDIENTS.find((x) => x.id === id)!;
    setMessage(`Pouring ${item.name} into the cauldron.`);
    tone(280, 0.08);
    window.setTimeout(() => {
      commitIngredient(id);
      setMessage(brew.length + 1 >= 3 ? 'Essences complete. Choose the right flame.' : 'Good. Choose the next essence.');
    }, 590);
    window.setTimeout(() => setPouring(null), 980);
  };

  const reset = () => {
    setBrew([]);
    setHeat('low');
    setStir(0);
    setStirring(false);
    setResult('idle');
    setPouring(null);
    setMessage('Tap a potion bottle to pour it into the cauldron.');
  };

  const brewPotion = () => {
    if (brew.length < 3) {
      setMessage('Add all three essences first.');
      return;
    }
    const exact = RECIPE.ingredients.every((id, i) => brew[i]?.id === id);
    const ok = exact && heat === RECIPE.heat && stir >= RECIPE.stir;
    setResult(ok ? 'success' : 'fail');
    setStirring(false);
    if (ok) {
      setMessage('Moonveil Elixir complete.');
      tone(620, 0.16);
      window.setTimeout(() => tone(810, 0.2), 130);
      window.setTimeout(() => tone(980, 0.22), 260);
    } else {
      const hints: string[] = [];
      if (!exact) hints.push('ingredient order');
      if (heat !== RECIPE.heat) hints.push('flame level');
      if (stir < RECIPE.stir) hints.push('stirring energy');
      setMessage(`The spell is unstable. Check ${hints.join(', ')}.`);
      tone(145, 0.24);
    }
  };

  const nextStep = brew.length < 3 ? 1 : heat !== 'medium' ? 2 : stir < RECIPE.stir ? 3 : 4;
  const ready = brew.length === 3 && heat === 'medium' && stir >= RECIPE.stir && result === 'idle';
  const pourData = pouring ? INGREDIENTS.find((x) => x.id === pouring.id)! : null;

  return (
    <main className={styles.page}>
      <section className={styles.phone} ref={phoneRef}>
        <div className={styles.background} />
        <div className={styles.sunwash} />
        <div className={styles.ambientOrbOne} />
        <div className={styles.ambientOrbTwo} />
        <SparklesIcon className={`${styles.floatingIcon} ${styles.iconOne}`} size={20} />
        <Star className={`${styles.floatingIcon} ${styles.iconTwo}`} size={17} />
        <Moon className={`${styles.floatingIcon} ${styles.iconThree}`} size={19} />

        <header className={styles.topbar}>
          <div className={styles.brandBlock}>
            <div className={styles.brandIcon}><FlaskConical size={18} /></div>
            <div>
              <div className={styles.eyebrow}>LUNAR ALCHEMY</div>
              <h1>Moonveil Lab</h1>
            </div>
          </div>
          <button className={styles.iconButton} onClick={() => setShowRecipe((v) => !v)} aria-label="Open recipe">
            <BookOpen size={20} />
          </button>
        </header>

        <div className={styles.orderCard}>
          <div className={styles.orderTitle}>
            <div className={styles.orderIcon}><SparklesIcon size={16} /></div>
            <div><small>TODAY&apos;S POTION</small><strong>{RECIPE.name}</strong></div>
          </div>
          <div className={styles.recipeSequence}>
            {RECIPE.ingredients.map((id, index) => {
              const ingredient = INGREDIENTS.find((x) => x.id === id)!;
              const done = brew[index]?.id === id;
              const wrong = !!brew[index] && brew[index]?.id !== id;
              return (
                <div key={id} className={`${styles.sequenceStep} ${done ? styles.sequenceDone : ''} ${wrong ? styles.sequenceWrong : ''}`}>
                  <span className={styles.sequenceNumber}>{index + 1}</span>
                  <span className={styles.sequenceIcon} style={{ color: ingredient.color }}><IngredientGlyph id={id} size={17} /></span>
                </div>
              );
            })}
          </div>
        </div>

        {showRecipe && (
          <div className={styles.recipeCard}>
            <div className={styles.recipeHeader}>
              <div><CircleHelp size={16} /><span>Recipe guide</span></div>
              <button onClick={() => setShowRecipe(false)} aria-label="Close recipe"><XCircle size={18} /></button>
            </div>
            <h2>{RECIPE.name}</h2>
            <div className={styles.recipeDetailRow}>
              <span><FlaskConical size={15} /> Mooncap → Star Crystal → Mandrake</span>
              <span><Flame size={15} /> Medium flame</span>
              <span><RotateCw size={15} /> Stir to 62% or more</span>
            </div>
          </div>
        )}

        <div className={styles.canvasWrap}>
          <Canvas
            shadows
            dpr={[1, 1.65]}
            camera={{ position: [0, 2.35, 6.45], fov: 42, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Scene brew={brew} heat={heat} stir={stir} result={result} splashTick={splashTick} splashColor={splashColor} />
          </Canvas>
          <div className={styles.cauldronBadge}>
            <FlaskConical size={14} />
            <span>{brew.length === 0 ? 'Empty cauldron' : `${brew.length} essence${brew.length > 1 ? 's' : ''}`}</span>
          </div>
        </div>

        <div className={`${styles.message} ${ready ? styles.messageReady : ''}`}>
          {ready ? <CheckCircle2 size={16} /> : <SparklesIcon size={16} />}
          <span>{message}</span>
        </div>

        <section className={styles.bottomSheet}>
          <div className={styles.sheetHandle} />

          <div className={styles.stepRail}>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`${styles.stepItem} ${nextStep === step ? styles.stepActive : ''} ${nextStep > step ? styles.stepDone : ''}`}>
                <span>{nextStep > step ? <CheckCircle2 size={14} /> : step}</span>
                <small>{step === 1 ? 'Pour' : step === 2 ? 'Flame' : step === 3 ? 'Stir' : 'Brew'}</small>
              </div>
            ))}
          </div>

          <div className={styles.sectionLabel}>
            <div><FlaskConical size={15} /><span>Tap a bottle to pour</span></div>
            <button className={styles.resetButton} onClick={reset}><RotateCcw size={15} /><span>Reset</span></button>
          </div>

          <div className={styles.ingredientScroller}>
            {INGREDIENTS.map((item) => {
              const usedCount = brew.filter((b) => b.id === item.id).length;
              return (
                <button
                  key={item.id}
                  className={styles.ingredientCard}
                  onClick={(event) => pourIngredient(item.id, event.currentTarget)}
                  disabled={!!pouring || result !== 'idle' || brew.length >= 3}
                  style={{ ['--accent' as string]: item.color, ['--soft' as string]: item.soft }}
                >
                  <span className={styles.cardGlow} />
                  <BottleGraphic color={item.color} />
                  <span className={styles.ingredientGlyph}><IngredientGlyph id={item.id} size={15} /></span>
                  <strong>{item.name}</strong>
                  {usedCount > 0 && <span className={styles.usedBadge}>{usedCount}</span>}
                </button>
              );
            })}
          </div>

          <div className={styles.controlsGrid}>
            <div className={`${styles.controlCard} ${nextStep === 2 ? styles.controlFocus : ''}`}>
              <div className={styles.controlTitle}><Flame size={16} /><span>Flame</span></div>
              <div className={styles.heatSwitch}>
                {(['low', 'medium', 'high'] as Heat[]).map((value) => (
                  <button
                    key={value}
                    className={heat === value ? styles.activeHeat : ''}
                    onClick={() => {
                      setHeat(value);
                      setMessage(value === 'medium' ? 'Medium flame selected. Hold the stir control.' : `${value[0].toUpperCase() + value.slice(1)} flame selected.`);
                      tone(value === 'low' ? 190 : value === 'medium' ? 250 : 320, 0.08);
                    }}
                  >
                    <Flame size={14 + (value === 'high' ? 2 : 0)} />
                    <span>{value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.controlCard} ${nextStep === 3 ? styles.controlFocus : ''}`}>
              <div className={styles.stirTop}>
                <div className={styles.controlTitle}><RotateCw size={16} /><span>Stir magic</span></div>
                <strong>{Math.round(stir)}%</strong>
              </div>
              <div className={styles.track}><div style={{ width: `${stir}%` }} /></div>
              <button
                className={`${styles.stirButton} ${stirring ? styles.stirring : ''}`}
                onPointerDown={() => brew.length >= 3 && setStirring(true)}
                onPointerUp={() => setStirring(false)}
                onPointerCancel={() => setStirring(false)}
                onPointerLeave={() => setStirring(false)}
                disabled={brew.length < 3 || result !== 'idle'}
              >
                <RotateCw size={17} />
                <span>{brew.length < 3 ? 'Add 3 essences first' : 'Hold to stir'}</span>
              </button>
            </div>
          </div>

          <button className={`${styles.brewButton} ${ready ? styles.brewReady : ''}`} onClick={brewPotion} disabled={result !== 'idle'}>
            <SparklesIcon size={18} />
            <span>{ready ? 'Brew Moonveil Elixir' : 'Brew Potion'}</span>
            <SparklesIcon size={18} />
          </button>
        </section>

        {pouring && pourData && (
          <div
            className={styles.pourFx}
            style={{
              left: pouring.startX,
              top: pouring.startY,
              ['--dx' as string]: `${pouring.dx}px`,
              ['--dy' as string]: `${pouring.dy}px`,
              ['--accent' as string]: pourData.color,
            }}
          >
            <div className={styles.pourBottle}>
              <BottleGraphic color={pourData.color} />
              <span className={styles.pourStream} style={{ background: pourData.color }} />
            </div>
          </div>
        )}

        {result !== 'idle' && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultGlow} />
            <div className={styles.resultCard}>
              <div className={`${styles.resultIcon} ${result === 'success' ? styles.resultSuccessIcon : styles.resultFailIcon}`}>
                {result === 'success' ? <CheckCircle2 size={34} /> : <XCircle size={34} />}
              </div>
              <small>{result === 'success' ? 'PERFECT BREW' : 'SPELL UNSTABLE'}</small>
              <h2>{result === 'success' ? RECIPE.name : 'Try Again'}</h2>
              <p>{result === 'success' ? 'The potion is stable and ready to bottle.' : message}</p>
              <button onClick={reset}>{result === 'success' ? 'Brew another potion' : 'Restart recipe'}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
