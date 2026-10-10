'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import {
  BookOpen,
  Check,
  ChevronRight,
  Droplets,
  Flame,
  FlaskConical,
  Gem,
  Leaf,
  RotateCcw,
  RotateCw,
  Sprout,
  X,
} from 'lucide-react';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PotionGameMobileV3.module.css';

const INGREDIENTS = [
  { id: 'mooncap', name: 'Mooncap', color: '#9d87ff', soft: '#eee9ff' },
  { id: 'crystal', name: 'Star Crystal', color: '#59d4ff', soft: '#e7f9ff' },
  { id: 'mandrake', name: 'Mandrake', color: '#d99b68', soft: '#fff0de' },
  { id: 'ember', name: 'Ember Seed', color: '#ff775c', soft: '#ffe9e3' },
  { id: 'frog', name: 'Frog Eye', color: '#7fd768', soft: '#ebffe3' },
  { id: 'shade', name: 'Nightshade', color: '#c96de8', soft: '#f9e8ff' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];
type Heat = 'low' | 'medium' | 'high';
type Result = 'idle' | 'success' | 'fail';
type BrewItem = { id: IngredientId; name: string; color: string };

const RECIPE = {
  name: 'Moonveil Elixir',
  ingredients: ['mooncap', 'crystal', 'mandrake'] as IngredientId[],
  heat: 'medium' as Heat,
};

function IngredientIcon({ id, size = 18 }: { id: IngredientId; size?: number }) {
  if (id === 'crystal') return <Gem size={size} strokeWidth={1.9} />;
  if (id === 'mandrake') return <Sprout size={size} strokeWidth={1.9} />;
  if (id === 'ember') return <Flame size={size} strokeWidth={1.9} />;
  if (id === 'shade') return <Leaf size={size} strokeWidth={1.9} />;
  if (id === 'frog') return <Droplets size={size} strokeWidth={1.9} />;
  return <FlaskConical size={size} strokeWidth={1.9} />;
}

function tone(freq: number, duration = 0.09) {
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
    gain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    osc.onended = () => ctx.close();
  } catch {}
}

function GlassBottle({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 0.54, 18]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.32} transmission={0.48} roughness={0.08} thickness={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.145, 0.205, 0.27, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.92} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 14]} />
        <meshPhysicalMaterial color="#f8f4ff" transparent opacity={0.4} transmission={0.35} roughness={0.08} />
      </mesh>
      <mesh castShadow position={[0, 0.57, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 14]} />
        <meshStandardMaterial color="#b99a72" roughness={0.8} />
      </mesh>
      <pointLight intensity={1.25} distance={1.5} color={color} />
    </group>
  );
}

function PouringBottle({ id, onComplete }: { id: IngredientId; onComplete: (id: IngredientId) => void }) {
  const item = INGREDIENTS.find((entry) => entry.id === id)!;
  const bottle = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const finished = useRef(false);
  const side = ['mooncap', 'mandrake', 'frog'].includes(id) ? -1 : 1;
  const start = useMemo(() => new THREE.Vector3(side * 2.15, 1.25, 0.35), [side]);
  const above = useMemo(() => new THREE.Vector3(0, 2.42, 0.12), []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current / 1.28;
    if (!bottle.current) return;

    if (t < 0.43) {
      const p = THREE.MathUtils.smoothstep(t / 0.43, 0, 1);
      bottle.current.position.lerpVectors(start, above, p);
      bottle.current.rotation.z = THREE.MathUtils.lerp(0, side * -0.12, p);
    } else if (t < 0.67) {
      bottle.current.position.copy(above);
      const p = THREE.MathUtils.smoothstep((t - 0.43) / 0.24, 0, 1);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -0.12, side * -1.72, p);
    } else if (t < 0.88) {
      bottle.current.position.copy(above);
      bottle.current.rotation.z = side * -1.72;
      bottle.current.position.y += Math.sin((t - 0.67) * 32) * 0.025;
    } else {
      const p = Math.min(1, (t - 0.88) / 0.12);
      bottle.current.position.lerpVectors(above, new THREE.Vector3(side * 1.4, 3.2, 0), p);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -1.72, 0, p);
    }

    if (stream.current) {
      const visible = t > 0.62 && t < 0.88;
      stream.current.visible = visible;
      if (visible) {
        const pulse = 0.92 + Math.sin(elapsed.current * 30) * 0.08;
        stream.current.scale.x = pulse;
        stream.current.scale.z = pulse;
      }
    }

    if (t >= 0.78 && !finished.current) {
      finished.current = true;
      onComplete(id);
    }
  });

  return (
    <group>
      <group ref={bottle} position={start.toArray()}>
        <GlassBottle color={item.color} scale={1.12} />
      </group>
      <mesh ref={stream} visible={false} position={[0, 1.58, 0.08]}>
        <cylinderGeometry args={[0.045, 0.07, 0.92, 12]} />
        <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.85} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Ripple({ color, tick }: { color: string; tick: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const start = useRef<number | null>(null);
  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - start.current) / 0.75);
    if (ring.current) {
      ring.current.scale.setScalar(0.35 + t * 1.7);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 * (1 - t);
    }
  });
  return (
    <group key={tick} position={[0, 0.98, 0]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.032, 10, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <Float key={i} speed={2.4 + i * 0.08} floatIntensity={0.7} rotationIntensity={0.08}>
          <mesh position={[Math.cos(i * 0.7) * 0.58, 0.18 + (i % 3) * 0.08, Math.sin(i * 0.7) * 0.42]}>
            <sphereGeometry args={[0.035 + (i % 2) * 0.02, 10, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ArcaneRing({ color, speed }: { color: THREE.Color; speed: number }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (outer.current) outer.current.rotation.z = state.clock.elapsedTime * (0.18 + speed * 0.015);
    if (inner.current) inner.current.rotation.z = -state.clock.elapsedTime * (0.26 + speed * 0.02);
  });
  return (
    <group position={[0, 0.28, -0.5]}>
      <mesh ref={outer} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.34, 0.014, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.38} />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.009, 8, 88]} />
        <meshBasicMaterial color="#fff4dc" transparent opacity={0.26} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 12) * Math.PI * 2) * 1.34, 0, Math.sin((i / 12) * Math.PI * 2) * 1.34]}>
          <sphereGeometry args={[0.027, 8, 8]} />
          <meshBasicMaterial color={i % 2 ? color : '#fff7df'} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Cauldron({ brew, heat, stir, stirring, result, splashTick, splashColor }: { brew: BrewItem[]; heat: Heat; stir: number; stirring: boolean; result: Result; splashTick: number; splashColor: string }) {
  const liquid = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);

  const potionColor = useMemo(() => {
    if (!brew.length) return new THREE.Color('#9f8ad8');
    const mixed = new THREE.Color('#000000');
    brew.forEach((item) => mixed.add(new THREE.Color(item.color)));
    return mixed.multiplyScalar(1 / brew.length);
  }, [brew]);

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (stirring ? 5.4 : 0.38 + stir / 90);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.72 + Math.sin(state.clock.elapsedTime * 3.3) * 0.08 + (stirring ? 0.25 : 0);
    }
    if (body.current) {
      if (result === 'fail') body.current.rotation.z = Math.sin(state.clock.elapsedTime * 34) * 0.026;
      else body.current.rotation.z *= 0.84;
    }
  });

  const flame = heat === 'low' ? '#ffc56f' : heat === 'medium' ? '#ff8559' : '#ffe36e';

  return (
    <group ref={body} position={[0, -0.34, 0]}>
      <ArcaneRing color={potionColor} speed={stir} />

      <mesh castShadow scale={[1.18, 0.86, 1.18]} position={[0, 0.61, 0]}>
        <sphereGeometry args={[0.86, 48, 30, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.69]} />
        <meshStandardMaterial color="#51406a" roughness={0.2} metalness={0.32} />
      </mesh>
      <mesh castShadow position={[0, 1.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.98, 0.085, 18, 82]} />
        <meshStandardMaterial color="#9576b3" roughness={0.18} metalness={0.4} />
      </mesh>
      <mesh ref={liquid} position={[0, 1.047, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.86, 80]} />
        <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.8} roughness={0.08} transparent opacity={0.96} />
      </mesh>
      <mesh position={[0, 1.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.82, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.07} />
      </mesh>

      <mesh castShadow position={[-1.0, 0.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.045, 10, 36, Math.PI]} />
        <meshStandardMaterial color="#6a537e" metalness={0.35} roughness={0.24} />
      </mesh>
      <mesh castShadow position={[1.0, 0.73, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.33, 0.045, 10, 36, Math.PI]} />
        <meshStandardMaterial color="#6a537e" metalness={0.35} roughness={0.24} />
      </mesh>

      {[-0.6, 0.6].map((x) => (
        <mesh key={x} castShadow position={[x, 0.03, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.08, 0.14, 0.68, 12]} />
          <meshStandardMaterial color="#443653" roughness={0.34} />
        </mesh>
      ))}

      <group position={[0, -0.02, 0]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 9) * Math.PI * 2) * 0.37, 0.06 + (i % 2) * 0.05, Math.sin((i / 9) * Math.PI * 2) * 0.29]}>
            <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.035 : heat === 'medium' ? 0.02 : 0), 0]} />
            <meshBasicMaterial color={flame} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 2.1 : heat === 'medium' ? 4.2 : 5.8} distance={5} color={flame} />
      </group>

      {brew.length > 0 && Array.from({ length: 10 }).map((_, i) => (
        <Float key={i} speed={1.5 + i * 0.06} floatIntensity={0.48} rotationIntensity={0.06}>
          <mesh position={[-0.62 + (i % 5) * 0.31, 1.22 + (i % 3) * 0.2, -0.14 + (i % 2) * 0.26]}>
            <sphereGeometry args={[0.035 + (i % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={potionColor} transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}

      {splashTick > 0 && <Ripple key={splashTick} color={splashColor} tick={splashTick} />}

      {result === 'success' && (
        <group position={[0, 1.45, 0]}>
          {Array.from({ length: 18 }).map((_, i) => (
            <Float key={i} speed={2 + i * 0.05} floatIntensity={1.1} rotationIntensity={0.08}>
              <mesh position={[Math.cos(i * 1.4) * (0.35 + (i % 4) * 0.23), (i % 6) * 0.25, Math.sin(i * 1.4) * (0.3 + (i % 3) * 0.25)]}>
                <sphereGeometry args={[0.035 + (i % 3) * 0.012, 10, 8]} />
                <meshBasicMaterial color={i % 2 ? '#fff0ae' : '#d6b8ff'} transparent opacity={0.88} />
              </mesh>
            </Float>
          ))}
          <pointLight intensity={10} distance={7} color="#fff0ad" />
        </group>
      )}
    </group>
  );
}

function Scene({ brew, heat, stir, stirring, result, pouringId, onPourComplete, splashTick, splashColor }: { brew: BrewItem[]; heat: Heat; stir: number; stirring: boolean; result: Result; pouringId: IngredientId | null; onPourComplete: (id: IngredientId) => void; splashTick: number; splashColor: string }) {
  return (
    <>
      <ambientLight intensity={1.85} color="#fff6e8" />
      <hemisphereLight args={['#fffceb', '#8b76a0', 1.75]} />
      <directionalLight castShadow position={[3.6, 7, 5]} intensity={2.6} color="#fff1d2" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2.7, 2.6, 3]} intensity={3.5} distance={8} color="#ffc995" />
      <pointLight position={[2.4, 2.8, 2]} intensity={2.8} distance={8} color="#cab6ff" />

      <group position={[0, 0.14, 0]} scale={1.12}>
        <Cauldron brew={brew} heat={heat} stir={stir} stirring={stirring} result={result} splashTick={splashTick} splashColor={splashColor} />
        <Float speed={1.25} floatIntensity={0.22} rotationIntensity={0.05}><group position={[-1.72, 0.6, -0.2]}><GlassBottle color="#a58aff" scale={0.72} /></group></Float>
        <Float speed={1.35} floatIntensity={0.2} rotationIntensity={0.05}><group position={[1.73, 0.52, -0.16]}><GlassBottle color="#6cd9ff" scale={0.68} /></group></Float>
        {pouringId && <PouringBottle key={pouringId} id={pouringId} onComplete={onPourComplete} />}
      </group>

      {Array.from({ length: 22 }).map((_, i) => (
        <Float key={i} speed={0.7 + (i % 5) * 0.12} floatIntensity={0.35} rotationIntensity={0}>
          <mesh position={[-2.7 + (i % 7) * 0.9, 0.5 + (i % 6) * 0.65, -0.7 - (i % 3) * 0.25]}>
            <sphereGeometry args={[0.018 + (i % 3) * 0.008, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#fff0c0' : '#eadcff'} transparent opacity={0.45} />
          </mesh>
        </Float>
      ))}
      <ContactShadows position={[0, -0.58, 0]} opacity={0.22} scale={6.8} blur={4} far={5} color="#675274" />
    </>
  );
}

function BottleCard({ item }: { item: (typeof INGREDIENTS)[number] }) {
  return (
    <span className={styles.bottleCardGraphic} aria-hidden="true">
      <span className={styles.cardBottleNeck} />
      <span className={styles.cardBottleBody}>
        <span className={styles.cardBottleLiquid} style={{ background: item.color }} />
        <span className={styles.cardBottleHighlight} />
      </span>
    </span>
  );
}

export default function PotionGameMobileV3() {
  const [brew, setBrew] = useState<BrewItem[]>([]);
  const [heat, setHeat] = useState<Heat>('low');
  const [stir, setStir] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [result, setResult] = useState<Result>('idle');
  const [pouringId, setPouringId] = useState<IngredientId | null>(null);
  const [splashTick, setSplashTick] = useState(0);
  const [splashColor, setSplashColor] = useState('#9d87ff');
  const [message, setMessage] = useState('Choose a bottle and tap it to pour.');
  const [showRecipe, setShowRecipe] = useState(false);

  useEffect(() => {
    if (!stirring) return;
    const timer = window.setInterval(() => {
      setStir((value) => {
        const next = Math.min(100, value + 4);
        if (next >= 100) setStirring(false);
        return next;
      });
    }, 44);
    return () => window.clearInterval(timer);
  }, [stirring]);

  const addIngredient = (id: IngredientId) => {
    const item = INGREDIENTS.find((entry) => entry.id === id)!;
    setBrew((current) => [...current, { id, name: item.name, color: item.color }].slice(0, 3));
    setSplashColor(item.color);
    setSplashTick((value) => value + 1);
    setPouringId(null);
    tone(390 + brew.length * 65, 0.12);
    setMessage(brew.length + 1 >= 3 ? 'Mixture ready. Set the flame.' : 'Nice pour. Add the next essence.');
  };

  const startPour = (id: IngredientId) => {
    if (pouringId || result !== 'idle') return;
    if (brew.length >= 3) {
      setMessage('The cauldron already has three essences.');
      return;
    }
    setPouringId(id);
    setMessage('Bottle moving above the cauldron…');
    tone(270, 0.08);
  };

  const startStir = () => {
    if (brew.length < 3 || result !== 'idle' || stirring) return;
    setStir(0);
    setStirring(true);
    setMessage('Stirring the potion…');
    tone(315, 0.1);
  };

  useEffect(() => {
    if (!stirring && stir >= 100) {
      setMessage('Perfect swirl. The potion is ready to brew.');
      tone(520, 0.1);
    }
  }, [stirring, stir]);

  const reset = () => {
    setBrew([]);
    setHeat('low');
    setStir(0);
    setStirring(false);
    setResult('idle');
    setPouringId(null);
    setMessage('Choose a bottle and tap it to pour.');
  };

  const brewPotion = () => {
    if (brew.length < 3) {
      setMessage('Add three essences first.');
      return;
    }
    if (stir < 100) {
      setMessage('Stir the potion before brewing.');
      return;
    }
    const exact = RECIPE.ingredients.every((id, index) => brew[index]?.id === id);
    const success = exact && heat === RECIPE.heat;
    setResult(success ? 'success' : 'fail');
    if (success) {
      setMessage('Moonveil Elixir completed.');
      tone(650, 0.16);
      window.setTimeout(() => tone(830, 0.18), 130);
    } else {
      setMessage(exact ? 'The flame level was wrong.' : 'The ingredient order was unstable.');
      tone(145, 0.22);
    }
  };

  const activeStep = brew.length < 3 ? 1 : heat !== 'medium' ? 2 : stir < 100 ? 3 : 4;
  const ready = brew.length === 3 && heat === 'medium' && stir >= 100 && result === 'idle';

  return (
    <main className={styles.page}>
      <section className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.lightWash} />
        <div className={styles.sceneGlow} />

        <header className={styles.topbar}>
          <div className={styles.titleBlock}>
            <span className={styles.kicker}>LUNAR ALCHEMY</span>
            <h1>Moonveil Lab</h1>
          </div>
          <button className={styles.bookButton} onClick={() => setShowRecipe(true)} aria-label="Open recipe">
            <BookOpen size={20} />
          </button>
        </header>

        <div className={styles.recipeRibbon}>
          <div>
            <small>TODAY&apos;S ORDER</small>
            <strong>{RECIPE.name}</strong>
          </div>
          <div className={styles.recipeDots}>
            {RECIPE.ingredients.map((id, index) => {
              const item = INGREDIENTS.find((entry) => entry.id === id)!;
              const done = brew[index]?.id === id;
              const wrong = !!brew[index] && brew[index]?.id !== id;
              return (
                <span key={id} className={`${styles.recipeDot} ${done ? styles.recipeDotDone : ''} ${wrong ? styles.recipeDotWrong : ''}`} style={{ ['--dot' as string]: item.color }}>
                  <IngredientIcon id={id} size={15} />
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.canvasWrap}>
          <Canvas
            shadows
            dpr={[1, 1.7]}
            camera={{ position: [0, 2.5, 6.55], fov: 41, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Scene
              brew={brew}
              heat={heat}
              stir={stir}
              stirring={stirring}
              result={result}
              pouringId={pouringId}
              onPourComplete={addIngredient}
              splashTick={splashTick}
              splashColor={splashColor}
            />
          </Canvas>
          <div className={styles.cauldronStatus}>
            <Droplets size={14} />
            <span>{brew.length === 0 ? 'Cauldron empty' : `${brew.length}/3 essences`}</span>
          </div>
        </div>

        <div className={`${styles.message} ${ready ? styles.messageReady : ''}`}>
          <span>{message}</span>
        </div>

        <section className={styles.bottomPanel}>
          <div className={styles.panelHandle} />

          <div className={styles.stepLine}>
            {['Pour', 'Flame', 'Stir', 'Brew'].map((label, index) => {
              const step = index + 1;
              return (
                <div key={label} className={`${styles.step} ${activeStep === step ? styles.stepActive : ''} ${activeStep > step ? styles.stepDone : ''}`}>
                  <span>{activeStep > step ? <Check size={12} /> : step}</span>
                  <small>{label}</small>
                </div>
              );
            })}
          </div>

          <div className={styles.shelfHeader}>
            <div><FlaskConical size={15} /><strong>Ingredient shelf</strong></div>
            <button onClick={reset}><RotateCcw size={14} /> Reset</button>
          </div>

          <div className={styles.bottleShelf}>
            {INGREDIENTS.map((item) => {
              const selected = brew.some((entry) => entry.id === item.id);
              return (
                <button
                  key={item.id}
                  className={`${styles.bottleCard} ${selected ? styles.bottleSelected : ''}`}
                  onClick={() => startPour(item.id)}
                  disabled={!!pouringId || result !== 'idle' || brew.length >= 3}
                  style={{ ['--accent' as string]: item.color, ['--soft' as string]: item.soft }}
                >
                  <BottleCard item={item} />
                  <span className={styles.bottleIcon}><IngredientIcon id={item.id} size={14} /></span>
                  <strong>{item.name}</strong>
                </button>
              );
            })}
          </div>

          <div className={styles.actionGrid}>
            <div className={`${styles.actionCard} ${activeStep === 2 ? styles.actionFocus : ''}`}>
              <div className={styles.actionTitle}><Flame size={15} /><span>Flame</span></div>
              <div className={styles.heatButtons}>
                {(['low', 'medium', 'high'] as Heat[]).map((value) => (
                  <button
                    key={value}
                    className={heat === value ? styles.heatActive : ''}
                    onClick={() => {
                      setHeat(value);
                      setMessage(`${value[0].toUpperCase() + value.slice(1)} flame selected.`);
                      tone(value === 'low' ? 190 : value === 'medium' ? 250 : 320, 0.08);
                    }}
                  >
                    <Flame size={13 + (value === 'high' ? 2 : 0)} />
                    <span>{value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.actionCard} ${activeStep === 3 ? styles.actionFocus : ''}`}>
              <div className={styles.stirHeader}>
                <div className={styles.actionTitle}><RotateCw size={15} /><span>Stir</span></div>
                <strong>{Math.round(stir)}%</strong>
              </div>
              <div className={styles.progressTrack}><div style={{ width: `${stir}%` }} /></div>
              <button className={styles.stirButton} onClick={startStir} disabled={brew.length < 3 || stirring || result !== 'idle'}>
                <RotateCw size={16} className={stirring ? styles.spin : ''} />
                <span>{stirring ? 'Stirring…' : stir >= 100 ? 'Stirred' : 'Stir potion'}</span>
              </button>
            </div>
          </div>

          <button className={`${styles.brewButton} ${ready ? styles.brewReady : ''}`} onClick={brewPotion} disabled={result !== 'idle'}>
            <FlaskConical size={18} />
            <span>{ready ? 'Brew Moonveil Elixir' : 'Brew potion'}</span>
            <ChevronRight size={18} />
          </button>
        </section>

        {showRecipe && (
          <div className={styles.recipeOverlay} onClick={() => setShowRecipe(false)}>
            <div className={styles.recipeSheet} onClick={(event) => event.stopPropagation()}>
              <div className={styles.recipeSheetTop}>
                <div><BookOpen size={18} /><span>Recipe book</span></div>
                <button onClick={() => setShowRecipe(false)}><X size={18} /></button>
              </div>
              <small>MOONVEIL ELIXIR</small>
              <h2>Three essences, one steady flame.</h2>
              <div className={styles.recipeList}>
                {RECIPE.ingredients.map((id, index) => {
                  const item = INGREDIENTS.find((entry) => entry.id === id)!;
                  return (
                    <div key={id}>
                      <span className={styles.recipeIndex}>{index + 1}</span>
                      <span className={styles.recipeListIcon} style={{ color: item.color }}><IngredientIcon id={id} size={18} /></span>
                      <strong>{item.name}</strong>
                    </div>
                  );
                })}
              </div>
              <div className={styles.recipeNote}><Flame size={16} /> Medium flame</div>
              <div className={styles.recipeNote}><RotateCw size={16} /> Stir once until the meter is full</div>
            </div>
          </div>
        )}

        {result !== 'idle' && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultCard}>
              <div className={`${styles.resultSeal} ${result === 'success' ? styles.resultSealSuccess : styles.resultSealFail}`}>
                {result === 'success' ? <Check size={30} /> : <X size={30} />}
              </div>
              <small>{result === 'success' ? 'POTION COMPLETE' : 'BREW FAILED'}</small>
              <h2>{result === 'success' ? RECIPE.name : 'Try the recipe again'}</h2>
              <p>{message}</p>
              <button onClick={reset}>{result === 'success' ? 'Brew another potion' : 'Restart'}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
