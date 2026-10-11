'use client';

import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import styles from './PotionGameMobile.module.css';
import UiIcon,{type UiIconName} from '../../../../app/UiIcon';

const INGREDIENTS = [
  { id: 'mooncap', name: 'Mooncap', icon: 'mushroom', color: '#9a80ff', soft: '#e3d9ff' },
  { id: 'crystal', name: 'Star Crystal', icon: 'gem', color: '#61d7ff', soft: '#d9f8ff' },
  { id: 'mandrake', name: 'Mandrake', icon: 'leaf', color: '#dda56d', soft: '#ffe8ca' },
  { id: 'ember', name: 'Ember Seed', icon: 'flame', color: '#ff795f', soft: '#ffe0d6' },
  { id: 'frog', name: 'Frog Eye', icon: 'bubble', color: '#8ee06e', soft: '#e2ffd8' },
  { id: 'shade', name: 'Nightshade', icon: 'moon', color: '#d36ce8', soft: '#f7dcff' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];
type Heat = 'low' | 'medium' | 'high';
type Result = 'idle' | 'success' | 'fail';
type BrewItem = { id: IngredientId; name: string; color: string; icon: UiIconName };

const RECIPE = {
  name: 'Moonveil Elixir',
  ingredients: ['mooncap', 'crystal', 'mandrake'] as IngredientId[],
  heat: 'medium' as Heat,
  stir: 62,
  clue: 'Mooncap first, then a star shard, then the whispering root.',
};

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
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration + 0.02);
    osc.onended = () => ctx.close();
  } catch {}
}

function IngredientCharm({ id, position, onPick }: { id: IngredientId; position: [number, number, number]; onPick: (id: IngredientId) => void }) {
  const data = INGREDIENTS.find((i) => i.id === id)!;
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.45 + position[0];
  });

  return (
    <Float speed={1.8} floatIntensity={0.32} rotationIntensity={0.18}>
      <group
        ref={group}
        position={position}
        scale={hover ? 1.16 : 1}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); onPick(id); }}
      >
        <mesh castShadow>
          {id === 'crystal' ? <octahedronGeometry args={[0.18, 0]} /> : id === 'mooncap' ? <sphereGeometry args={[0.18, 18, 12]} /> : <dodecahedronGeometry args={[0.17, 0]} />}
          <meshToonMaterial color={data.color} emissive={data.color} emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.08, 0.22, 10]} />
          <meshToonMaterial color={id === 'mooncap' ? '#f2dfc9' : '#9d7f6e'} />
        </mesh>
        <pointLight intensity={hover ? 1.8 : 0.7} distance={1.1} color={data.color} />
      </group>
    </Float>
  );
}

function MagicRing({ color }: { color: THREE.Color }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.z = state.clock.elapsedTime * 0.16;
  });
  return (
    <group position={[0, 0.85, -0.48]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.23, 0.015, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      <Sparkles count={28} scale={[2.6, 1.6, 0.3]} size={2.5} speed={0.28} color={color} />
    </group>
  );
}

function Cauldron({ brew, heat, stir, result, setStir }: { brew: BrewItem[]; heat: Heat; stir: number; result: Result; setStir: React.Dispatch<React.SetStateAction<number>> }) {
  const liquid = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);
  const [stirring, setStirring] = useState(false);
  const last = useRef<THREE.Vector2 | null>(null);

  const potionColor = useMemo(() => {
    if (!brew.length) return new THREE.Color('#8e7bd7');
    const c = new THREE.Color('#000000');
    brew.forEach((i) => c.add(new THREE.Color(i.color)));
    return c.multiplyScalar(1 / brew.length);
  }, [brew]);

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (0.25 + stir / 55);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2.6) * 0.1 + stir / 220;
    }
    if (body.current && result === 'fail') body.current.rotation.z = Math.sin(state.clock.elapsedTime * 34) * 0.025;
    else if (body.current) body.current.rotation.z *= 0.86;
  });

  const start = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setStirring(true);
    last.current = e.pointer.clone();
  };
  const move = (e: ThreeEvent<PointerEvent>) => {
    if (!stirring || !last.current) return;
    e.stopPropagation();
    const d = e.pointer.distanceTo(last.current);
    if (d > 0.002) setStir((v) => Math.min(100, v + d * 135));
    last.current.copy(e.pointer);
  };
  const stop = () => { setStirring(false); last.current = null; };

  const flameColor = heat === 'low' ? '#ffbf67' : heat === 'medium' ? '#ff8e62' : '#ffd66e';

  return (
    <group ref={body} position={[0, -0.35, 0]}>
      <MagicRing color={potionColor} />

      <mesh castShadow scale={[1.08, 0.82, 1.08]} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.82, 40, 26, 0, Math.PI * 2, Math.PI * 0.22, Math.PI * 0.67]} />
        <meshStandardMaterial color="#3f3158" roughness={0.28} metalness={0.22} />
      </mesh>
      <mesh castShadow position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.075, 14, 64]} />
        <meshStandardMaterial color="#745d92" roughness={0.24} metalness={0.35} />
      </mesh>
      <mesh
        ref={liquid}
        position={[0, 1.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerLeave={stop}
      >
        <circleGeometry args={[0.79, 64]} />
        <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.72} roughness={0.12} transparent opacity={0.94} />
      </mesh>

      {[-0.55, 0.55].map((x) => (
        <mesh key={x} castShadow position={[x, 0.02, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.08, 0.13, 0.64, 10]} />
          <meshStandardMaterial color="#49365f" roughness={0.38} />
        </mesh>
      ))}

      <group position={[0, -0.02, 0]}>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 7) * Math.PI * 2) * 0.34, 0.05 + (i % 2) * 0.06, Math.sin((i / 7) * Math.PI * 2) * 0.27]}>
            <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.025 : 0), 0]} />
            <meshBasicMaterial color={flameColor} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 1.8 : heat === 'medium' ? 3.2 : 4.8} distance={4.5} color={flameColor} />
      </group>

      {brew.length > 0 && (
        <>
          <Sparkles count={42} scale={[2.2, 1.8, 2.2]} position={[0, 1.35, 0]} size={3} speed={0.8 + stir / 90} color={potionColor} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Float key={i} speed={1.8 + i * 0.1} floatIntensity={0.45} rotationIntensity={0.15}>
              <mesh position={[-0.52 + (i % 3) * 0.52, 1.18 + (i % 2) * 0.22, -0.16 + (i % 2) * 0.3]}>
                <sphereGeometry args={[0.05 + (i % 2) * 0.018, 12, 10]} />
                <meshBasicMaterial color={potionColor} transparent opacity={0.78} />
              </mesh>
            </Float>
          ))}
        </>
      )}

      {result === 'success' && (
        <group position={[0, 1.35, 0]}>
          <Sparkles count={130} scale={[3.2, 3, 3.2]} size={5} speed={2.3} color="#fff3b3" />
          <pointLight intensity={9} distance={6} color="#fff1a6" />
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, i * 0.72, i * 0.25]} scale={0.8 + i * 0.48}>
              <torusGeometry args={[0.75, 0.02, 8, 80]} />
              <meshBasicMaterial color={i === 1 ? '#88e8ff' : '#d6b7ff'} transparent opacity={0.7 - i * 0.16} />
            </mesh>
          ))}
        </group>
      )}

      {result === 'fail' && (
        <group position={[0, 1.32, 0]}>
          <Sparkles count={72} scale={[2.4, 2.2, 2.4]} size={4.8} speed={2.6} color="#6d5d78" />
          <pointLight intensity={4} distance={4} color="#ff806e" />
        </group>
      )}
    </group>
  );
}

function Scene({ brew, heat, stir, result, addIngredient, setStir }: { brew: BrewItem[]; heat: Heat; stir: number; result: Result; addIngredient: (id: IngredientId) => void; setStir: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <>
      <ambientLight intensity={1.65} color="#fff2e6" />
      <hemisphereLight args={['#fff7de', '#8d78a7', 1.55]} />
      <directionalLight castShadow position={[3.5, 7, 5]} intensity={2.2} color="#fff4d8" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2, 2.5, 3]} intensity={2.8} distance={8} color="#ffc990" />
      <pointLight position={[2.2, 2.5, 2]} intensity={2.2} distance={8} color="#c9b2ff" />

      <group position={[0, 0.08, 0]} scale={1.06}>
        <Cauldron brew={brew} heat={heat} stir={stir} result={result} setStir={setStir} />
        <IngredientCharm id="mooncap" position={[-1.42, 1.75, 0]} onPick={addIngredient} />
        <IngredientCharm id="crystal" position={[1.42, 1.72, 0]} onPick={addIngredient} />
        <IngredientCharm id="mandrake" position={[-1.55, 0.72, 0.25]} onPick={addIngredient} />
        <IngredientCharm id="shade" position={[1.55, 0.72, 0.25]} onPick={addIngredient} />
      </group>

      <Sparkles count={54} scale={[5.5, 5, 3]} position={[0, 1.5, -0.3]} size={2.4} speed={0.2} color="#ffe6b7" />
      <ContactShadows position={[0, -0.55, 0]} opacity={0.28} scale={6} blur={3.6} far={4.5} color="#5d4770" />
    </>
  );
}

export default function PotionGameMobile() {
  const [brew, setBrew] = useState<BrewItem[]>([]);
  const [heat, setHeat] = useState<Heat>('low');
  const [stir, setStir] = useState(0);
  const [result, setResult] = useState<Result>('idle');
  const [message, setMessage] = useState('Tap an ingredient to begin your potion.');
  const [showRecipe, setShowRecipe] = useState(false);

  const addIngredient = (id: IngredientId) => {
    if (result !== 'idle') return;
    if (brew.length >= 5) { setMessage('Your cauldron is full — brew or reset first.'); return; }
    const item = INGREDIENTS.find((x) => x.id === id)!;
    setBrew((old) => [...old, { id, name: item.name, color: item.color, icon: item.icon }]);
    setMessage(`${item.name} melts into the potion`);
    tone(300 + brew.length * 55);
  };

  const reset = () => {
    setBrew([]); setHeat('low'); setStir(0); setResult('idle'); setMessage('Fresh cauldron. Try another spell!');
  };

  const brewPotion = () => {
    if (!brew.length) { setMessage('Add at least one ingredient first.'); return; }
    const exact = brew.length === RECIPE.ingredients.length && RECIPE.ingredients.every((id, i) => brew[i]?.id === id);
    const ok = exact && heat === RECIPE.heat && stir >= RECIPE.stir;
    setResult(ok ? 'success' : 'fail');
    if (ok) {
      setMessage('Moonveil Elixir complete!');
      tone(640, 0.16); setTimeout(() => tone(820, 0.2), 130);
    } else {
      const hints = [];
      if (!exact) hints.push('ingredient order');
      if (heat !== RECIPE.heat) hints.push('heat');
      if (stir < RECIPE.stir) hints.push('stirring');
      setMessage(`Almost! Check ${hints.join(', ')}.`);
      tone(145, 0.24);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.sunwash} />

        <header className={styles.topbar}>
          <div>
            <div className={styles.eyebrow}>MAGICAL BREWERY</div>
            <h1>Lunar Alchemy</h1>
          </div>
          <button className={styles.recipeButton} onClick={() => setShowRecipe((v) => !v)} aria-label="Open recipe"><UiIcon name="book" size={20}/></button>
        </header>

        {showRecipe && (
          <div className={styles.recipeCard}>
            <div className={styles.recipeHeader}><span>Today&apos;s spell</span><button onClick={() => setShowRecipe(false)}>×</button></div>
            <strong>{RECIPE.name}</strong>
            <p>{RECIPE.clue}</p>
            <div className={styles.recipeHints}><span>3 ingredients</span><span>Medium flame</span><span>Stir 62%+</span></div>
          </div>
        )}

        <div className={styles.questPill}>
          <span className={styles.questIcon}><UiIcon name="sparkle" size={17}/></span>
          <div><small>Current order</small><strong>{RECIPE.name}</strong></div>
          <span className={styles.progress}>{brew.length}/3</span>
        </div>

        <div className={styles.canvasWrap}>
          <Canvas
            shadows
            dpr={[1, 1.6]}
            camera={{ position: [0, 2.45, 6.5], fov: 43, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Scene brew={brew} heat={heat} stir={stir} result={result} addIngredient={addIngredient} setStir={setStir} />
          </Canvas>
          <div className={styles.stirHint}><UiIcon name="refresh" size={14}/> drag the potion to stir</div>
        </div>

        <div className={`${styles.message} ${result === 'success' ? styles.success : result === 'fail' ? styles.fail : ''}`}>
          {message}
        </div>

        <section className={styles.bottomSheet}>
          <div className={styles.sheetHandle} />
          <div className={styles.brewRow}>
            <div>
              <small>IN YOUR CAULDRON</small>
              <div className={styles.brewSlots}>
                {[0,1,2,3,4].map((i) => <div key={i} className={`${styles.slot} ${brew[i] ? styles.filled : ''}`}>{brew[i] ? <UiIcon name={brew[i].icon} size={20}/> : null}</div>)}
              </div>
            </div>
            <button className={styles.reset} onClick={reset}>Reset</button>
          </div>

          <div className={styles.ingredientScroller}>
            {INGREDIENTS.map((item) => (
              <button key={item.id} className={styles.ingredientCard} onClick={() => addIngredient(item.id)} style={{ ['--accent' as string]: item.color, ['--soft' as string]: item.soft }}>
                <span className={styles.ingredientEmoji}><UiIcon name={item.icon} size={23}/></span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.controlRow}>
            <div className={styles.heatWrap}>
              <small>FLAME</small>
              <div className={styles.heatSwitch}>
                {(['low','medium','high'] as Heat[]).map((value) => (
                  <button key={value} className={heat === value ? styles.activeHeat : ''} onClick={() => { setHeat(value); tone(value === 'low' ? 190 : value === 'medium' ? 250 : 320); }}>{value === 'low' ? 'Ⅰ' : value === 'medium' ? 'Ⅱ' : 'Ⅲ'}</button>
                ))}
              </div>
            </div>
            <div className={styles.stirWrap}>
              <div className={styles.stirLabel}><small>STIR MAGIC</small><strong>{Math.round(stir)}%</strong></div>
              <div className={styles.track}><div style={{ width: `${stir}%` }} /></div>
            </div>
          </div>

          <button className={styles.brewButton} onClick={brewPotion} disabled={result !== 'idle'}>
            <span><UiIcon name="sparkle" size={17}/></span> Brew Potion <span><UiIcon name="sparkle" size={17}/></span>
          </button>
        </section>

        {result !== 'idle' && (
          <div className={styles.resultOverlay} onClick={reset}>
            <div className={styles.resultCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.resultOrb}>{result === 'success' ? <UiIcon name="sparkle" size={34}/> : <UiIcon name="wind" size={34}/>}</div>
              <small>{result === 'success' ? 'PERFECT BREW' : 'SPELL FIZZLED'}</small>
              <h2>{result === 'success' ? RECIPE.name : 'Try Again'}</h2>
              <p>{result === 'success' ? 'Moonlight dances inside the bottle.' : message}</p>
              <button onClick={reset}>{result === 'success' ? 'Brew another' : 'Try again'}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
