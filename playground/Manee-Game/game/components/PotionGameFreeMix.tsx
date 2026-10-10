'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import {
  BookOpen,
  Check,
  Flame,
  FlaskConical,
  Menu,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PotionGameFreeMix.module.css';

type IngredientId = 'mooncap' | 'crystal' | 'mandrake' | 'ember' | 'dew' | 'nightshade' | 'sunpetal' | 'ghostroot';
type Heat = 'low' | 'medium' | 'high';
type Result = {
  key: string;
  name: string;
  className: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  effect: string;
  description: string;
  value: number;
  color: string;
  ingredients: IngredientId[];
  heat: Heat;
};

type Ingredient = {
  id: IngredientId;
  name: string;
  color: string;
  soft: string;
  traits: string[];
  shape: 'round' | 'tall' | 'gem' | 'leaf';
};

const INGREDIENTS: Ingredient[] = [
  { id: 'mooncap', name: 'Mooncap', color: '#a68cff', soft: '#eee9ff', traits: ['dream', 'calm', 'arcane'], shape: 'round' },
  { id: 'crystal', name: 'Star Crystal', color: '#65d7ff', soft: '#e7f9ff', traits: ['light', 'clarity', 'focus'], shape: 'gem' },
  { id: 'mandrake', name: 'Mandrake', color: '#d99a68', soft: '#fff0dc', traits: ['earth', 'life', 'growth'], shape: 'leaf' },
  { id: 'ember', name: 'Ember Seed', color: '#ff765d', soft: '#ffe8e1', traits: ['fire', 'power', 'chaos'], shape: 'round' },
  { id: 'dew', name: 'Dawn Dew', color: '#79e4d5', soft: '#e4fbf7', traits: ['water', 'healing', 'purity'], shape: 'tall' },
  { id: 'nightshade', name: 'Nightshade', color: '#cc72df', soft: '#f7e8fb', traits: ['shadow', 'stealth', 'poison'], shape: 'tall' },
  { id: 'sunpetal', name: 'Sunpetal', color: '#f4c86d', soft: '#fff4d9', traits: ['sun', 'warmth', 'luck'], shape: 'leaf' },
  { id: 'ghostroot', name: 'Ghostroot', color: '#b8d2d9', soft: '#eef7f8', traits: ['spirit', 'memory', 'silence'], shape: 'tall' },
];

const RARITY_WEIGHT: Record<Result['rarity'], number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 };

function tone(freq: number, duration = 0.08, volume = 0.045) {
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
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    osc.onended = () => ctx.close();
  } catch {}
}

function ingredientById(id: IngredientId) {
  return INGREDIENTS.find((item) => item.id === id)!;
}

function makePotion(ids: IngredientId[], heat: Heat): Result {
  const ingredients = ids.map(ingredientById);
  const traits = ingredients.flatMap((item) => item.traits);
  const has = (...values: string[]) => values.every((value) => traits.includes(value));
  let name = 'Muddled Essence';
  let className = 'Essence';
  let effect = 'A strange but harmless magical sensation.';
  let description = 'The brew hums softly. Its purpose is not obvious yet.';
  let rarity: Result['rarity'] = ids.length >= 4 ? 'Uncommon' : 'Common';
  let color = ingredients.reduce((acc, item) => acc.lerp(new THREE.Color(item.color), 0.42), new THREE.Color('#8e78b5')).getStyle();

  if (has('dream', 'light')) {
    name = heat === 'high' ? 'Astral Flare' : 'Moonveil Elixir';
    className = heat === 'high' ? 'Draught' : 'Elixir';
    effect = heat === 'high' ? 'Reveals hidden magic in a bright pulse.' : 'Softens footsteps and sharpens night vision.';
    description = 'A silver-violet surface folds like moonlight on quiet water.';
    rarity = heat === 'medium' ? 'Rare' : 'Uncommon';
    color = '#a68cff';
  }
  if (has('fire', 'power')) {
    name = heat === 'high' ? 'Emberwrath Draught' : 'Cinderheart Tonic';
    className = heat === 'high' ? 'Draught' : 'Tonic';
    effect = heat === 'high' ? 'Greatly increases strength for a brief moment.' : 'Warms the body and restores stamina.';
    description = 'Orange sparks orbit the neck of the bottle before fading.';
    rarity = heat === 'high' ? 'Epic' : 'Rare';
    color = '#ff795e';
  }
  if (has('life', 'healing')) {
    name = 'Verdant Bloom Serum';
    className = 'Serum';
    effect = 'Accelerates natural recovery and closes minor wounds.';
    description = 'Tiny green motes blossom and vanish inside the liquid.';
    rarity = heat === 'low' ? 'Epic' : 'Rare';
    color = '#79d98e';
  }
  if (has('shadow', 'stealth')) {
    name = 'Veilstep Tonic';
    className = 'Tonic';
    effect = 'Muffles movement and dims the drinker’s silhouette.';
    description = 'The glass looks empty until held against direct light.';
    rarity = heat === 'low' ? 'Rare' : 'Uncommon';
    color = '#8f67bf';
  }
  if (has('purity', 'sun')) {
    name = 'Sunwash Essence';
    className = 'Essence';
    effect = 'Cleanses minor curses and lifts fatigue.';
    description = 'Warm gold gathers at the surface like sunrise through honey.';
    rarity = 'Epic';
    color = '#f5d07b';
  }
  if (has('spirit', 'memory')) {
    name = 'Whisperglass Infusion';
    className = 'Infusion';
    effect = 'Recalls a forgotten sound or short memory.';
    description = 'The potion rings once when uncorked, though no bell is nearby.';
    rarity = 'Rare';
    color = '#bdd5dc';
  }
  if (has('dream', 'spirit', 'light')) {
    name = 'Astral Reverie';
    className = 'Elixir';
    effect = 'Allows vivid, lucid dreams that sometimes reveal distant places.';
    description = 'A tiny constellation drifts beneath the surface, never in the same shape twice.';
    rarity = 'Legendary';
    color = '#b7a4ff';
  }
  if (has('fire', 'shadow')) {
    name = 'Blackflame Philter';
    className = 'Philter';
    effect = 'Produces cold dark fire that gives light without heat.';
    description = 'Its flame burns inward, casting a shadow brighter than the room.';
    rarity = heat === 'high' ? 'Legendary' : 'Epic';
    color = '#7d4f99';
  }

  const uniqueTraits = new Set(traits).size;
  if (uniqueTraits >= 10 && RARITY_WEIGHT[rarity] < RARITY_WEIGHT.Epic) rarity = 'Epic';
  const value = 24 + ids.length * 13 + RARITY_WEIGHT[rarity] * 38 + (heat === 'high' ? 8 : heat === 'medium' ? 4 : 0);
  const key = [...ids].sort().join('-') + ':' + heat;
  return { key, name, className, rarity, effect, description, value, color, ingredients: ids, heat };
}

function BottleModel({ color, shape = 'round', scale = 1 }: { color: string; shape?: Ingredient['shape']; scale?: number }) {
  const bodyHeight = shape === 'tall' ? 0.72 : 0.56;
  const bodyRadius = shape === 'gem' ? 0.27 : shape === 'round' ? 0.3 : 0.24;
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.08, 0]}>
        {shape === 'gem' ? <octahedronGeometry args={[0.38, 0]} /> : <cylinderGeometry args={[bodyRadius * .72, bodyRadius, bodyHeight, 24]} />}
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.38} transmission={0.55} roughness={0.06} thickness={0.65} />
      </mesh>
      <mesh position={[0, shape === 'gem' ? -0.05 : -0.05, 0]}>
        {shape === 'gem' ? <octahedronGeometry args={[0.29, 0]} /> : <cylinderGeometry args={[bodyRadius * .58, bodyRadius * .82, bodyHeight * .46, 24]} />}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.58} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.25, 16]} />
        <meshPhysicalMaterial color="#f7f3f4" transparent opacity={0.42} transmission={0.42} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.63, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.1, 14]} />
        <meshStandardMaterial color="#b79468" roughness={0.8} />
      </mesh>
      <pointLight intensity={1.2} distance={1.6} color={color} />
    </group>
  );
}

function SlowPour({ id, onDone }: { id: IngredientId; onDone: (id: IngredientId) => void }) {
  const item = ingredientById(id);
  const bottle = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const committed = useRef(false);
  const side = ['mooncap', 'mandrake', 'dew', 'sunpetal'].includes(id) ? -1 : 1;
  const start = useMemo(() => new THREE.Vector3(side * 2.1, 0.55, 0.25), [side]);
  const above = useMemo(() => new THREE.Vector3(side * 0.38, 2.3, 0.15), [side]);

  useFrame((_, delta) => {
    t.current += delta;
    const sec = t.current;
    if (!bottle.current) return;
    if (sec < 1.45) {
      const p = THREE.MathUtils.smoothstep(sec / 1.45, 0, 1);
      const arc = Math.sin(p * Math.PI) * 0.42;
      bottle.current.position.lerpVectors(start, above, p);
      bottle.current.position.y += arc;
      bottle.current.rotation.z = THREE.MathUtils.lerp(0, side * -0.08, p);
    } else if (sec < 2.05) {
      bottle.current.position.copy(above);
      const p = THREE.MathUtils.smoothstep((sec - 1.45) / 0.6, 0, 1);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -0.08, side * -1.72, p);
    } else if (sec < 3.45) {
      bottle.current.position.copy(above);
      bottle.current.rotation.z = side * -1.72;
      bottle.current.position.y += Math.sin(sec * 8) * 0.018;
    } else if (sec < 4.1) {
      const p = THREE.MathUtils.smoothstep((sec - 3.45) / 0.65, 0, 1);
      bottle.current.position.lerpVectors(above, new THREE.Vector3(side * 2.0, 2.8, -0.2), p);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -1.72, 0, p);
    }

    if (stream.current) {
      stream.current.visible = sec >= 2.0 && sec <= 3.42;
      if (stream.current.visible) {
        stream.current.scale.y = 0.95 + Math.sin(sec * 18) * 0.05;
      }
    }
    if (sec >= 3.05 && !committed.current) {
      committed.current = true;
      onDone(id);
    }
  });

  return (
    <group>
      <group ref={bottle} position={start.toArray()}>
        <BottleModel color={item.color} shape={item.shape} scale={1.18} />
      </group>
      <mesh ref={stream} visible={false} position={[0, 1.55, 0.12]}>
        <cylinderGeometry args={[0.045, 0.075, 1.0, 16]} />
        <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.9} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function DecorativeShelf({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 2.58, 0.65, -1.1]} rotation={[0, side * -0.08, 0]}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[1.25, 2.35, 0.18]} />
        <meshStandardMaterial color="#5d382c" roughness={0.72} />
      </mesh>
      {[0.25, 0.9, 1.55, 2.15].map((y) => (
        <mesh key={y} castShadow position={[0, y, 0.18]}>
          <boxGeometry args={[1.45, 0.11, 0.48]} />
          <meshStandardMaterial color="#875543" roughness={0.62} />
        </mesh>
      ))}
      {['#a484ff','#62d9ff','#f0b06d','#76d985','#ca78df','#f1c868'].map((color, i) => (
        <group key={color} position={[-0.42 + (i%3)*0.42, 0.5 + Math.floor(i/3)*0.66, 0.42]} scale={0.52 + (i%2)*0.08}>
          <BottleModel color={color} shape={i%3===1?'tall':i%3===2?'gem':'round'} />
        </group>
      ))}
    </group>
  );
}

function CandleCluster({ position }: { position: [number,number,number] }) {
  return (
    <group position={position}>
      {[0,1,2].map((i) => (
        <group key={i} position={[(i-1)*0.18, i*0.05, i%2?0.04:-0.03]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055,0.065,0.28+i*0.05,10]} />
            <meshStandardMaterial color="#f2dfbd" roughness={0.9}/>
          </mesh>
          <Float speed={2.2} floatIntensity={0.08} rotationIntensity={0.05}>
            <mesh position={[0,0.19+i*0.025,0]}>
              <sphereGeometry args={[0.038,10,8]}/>
              <meshBasicMaterial color="#ffd07d"/>
            </mesh>
          </Float>
        </group>
      ))}
      <pointLight position={[0,0.35,0]} intensity={1.8} distance={2.3} color="#ffb45c" />
    </group>
  );
}

function Cauldron({ mix, heat, stirring, pulse }: { mix: IngredientId[]; heat: Heat; stirring: boolean; pulse: number }) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const spoonRef = useRef<THREE.Group>(null);
  const color = useMemo(() => {
    if (!mix.length) return new THREE.Color('#8e78b6');
    const out = new THREE.Color('#000');
    mix.forEach((id) => out.add(new THREE.Color(ingredientById(id).color)));
    return out.multiplyScalar(1 / mix.length);
  }, [mix]);
  useFrame((state, delta) => {
    if (liquidRef.current) {
      liquidRef.current.rotation.z += delta * (stirring ? 4.8 : 0.22);
      const mat = liquidRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.72 + Math.sin(state.clock.elapsedTime*2.4)*0.08 + (stirring?0.2:0);
    }
    if (spoonRef.current) {
      const target = stirring ? Math.sin(state.clock.elapsedTime*5.2)*0.58 : 0.16;
      spoonRef.current.rotation.z = THREE.MathUtils.lerp(spoonRef.current.rotation.z, target, 0.09);
    }
  });
  const flame = heat==='low' ? '#ffb66b' : heat==='medium' ? '#ff7e57' : '#ffd764';
  return (
    <group position={[0,-0.82,0]}>
      <mesh castShadow scale={[1.22,.88,1.22]} position={[0,.64,0]}>
        <sphereGeometry args={[0.95,56,36,0,Math.PI*2,Math.PI*.19,Math.PI*.7]} />
        <meshStandardMaterial color="#4a355d" roughness={0.18} metalness={0.38} />
      </mesh>
      <mesh castShadow position={[0,1.14,0]} rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[1.08,.095,18,96]} />
        <meshStandardMaterial color="#8f69ad" roughness={0.14} metalness={0.5}/>
      </mesh>
      <mesh ref={liquidRef} position={[0,1.125,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.95,96]}/>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.08} transparent opacity={0.97}/>
      </mesh>
      <mesh position={[0,1.135,0]} rotation={[-Math.PI/2,0,0]}>
        <ringGeometry args={[.62,.91,84]}/><meshBasicMaterial color="#fff" transparent opacity={0.07}/>
      </mesh>
      {[-.72,.72].map((x) => <mesh key={x} castShadow position={[x,.04,0]} rotation={[0,0,x>0?-0.18:0.18]}><cylinderGeometry args={[.09,.15,.72,14]}/><meshStandardMaterial color="#3a2d48" roughness={0.38}/></mesh>)}
      <group position={[0,-.08,0]}>
        {Array.from({length:10}).map((_,i)=><mesh key={i} position={[Math.cos(i/10*Math.PI*2)*.4,.08+(i%2)*.06,Math.sin(i/10*Math.PI*2)*.3]}><dodecahedronGeometry args={[.09+(heat==='high'?.04:heat==='medium'?.02:0),0]}/><meshBasicMaterial color={flame}/></mesh>)}
        <pointLight intensity={heat==='low'?2.2:heat==='medium'?4.2:6} distance={5.5} color={flame}/>
      </group>
      <group ref={spoonRef} position={[0.15,1.78,0.05]} rotation={[0.15,0,0.16]}>
        <mesh position={[0,-.45,0]}><cylinderGeometry args={[.035,.045,1.25,10]}/><meshStandardMaterial color="#9a6039" roughness={0.72}/></mesh>
        <mesh position={[0,-1.02,0]} scale={[.18,.28,.08]}><sphereGeometry args={[1,18,12]}/><meshStandardMaterial color="#b57949" roughness={0.68}/></mesh>
      </group>
      {mix.length>0 && Array.from({length:14}).map((_,i)=><Float key={i} speed={1.3+i*.04} floatIntensity={.62} rotationIntensity={.06}><mesh position={[-.78+(i%6)*.31,1.3+(i%4)*.2,-.16+(i%2)*.3]}><sphereGeometry args={[.026+(i%3)*.012,10,8]}/><meshBasicMaterial color={color} transparent opacity={.75}/></mesh></Float>)}
      {pulse>0 && <group key={pulse} position={[0,1.17,0]}>{[0,1,2].map(i=><mesh key={i} rotation={[Math.PI/2,0,0]} scale={1+i*.28}><torusGeometry args={[.5,.02,8,72]}/><meshBasicMaterial color={color} transparent opacity={.36-i*.08}/></mesh>)}</group>}
    </group>
  );
}

function Scene({ mix, heat, stirring, pouring, onPourDone, pulse }: { mix:IngredientId[]; heat:Heat; stirring:boolean; pouring:IngredientId|null; onPourDone:(id:IngredientId)=>void; pulse:number }) {
  return <>
    <ambientLight intensity={1.45} color="#fff1df"/>
    <hemisphereLight args={['#fff9e6','#7a648f',1.35]}/>
    <directionalLight castShadow position={[4,7,5]} intensity={2.35} color="#fff1d2" shadow-mapSize={[1024,1024]}/>
    <pointLight position={[-2.6,2.4,2.6]} intensity={2.7} distance={8} color="#ffc785"/>
    <pointLight position={[2.6,2.8,2.2]} intensity={2.3} distance={8} color="#bba5ff"/>
    <group position={[0,0.02,0]} scale={1.05}>
      <DecorativeShelf side={-1}/><DecorativeShelf side={1}/>
      <CandleCluster position={[-1.65,-.08,.2]}/><CandleCluster position={[1.75,-.12,.1]}/>
      <Cauldron mix={mix} heat={heat} stirring={stirring} pulse={pulse}/>
      {pouring && <SlowPour key={pouring} id={pouring} onDone={onPourDone}/>} 
    </group>
    {Array.from({length:26}).map((_,i)=><Float key={i} speed={.45+(i%5)*.12} floatIntensity={.42} rotationIntensity={0}><mesh position={[-2.8+(i%8)*.78,.1+(i%7)*.62,-1.2-(i%3)*.2]}><sphereGeometry args={[.012+(i%3)*.006,8,8]}/><meshBasicMaterial color={i%4===0?'#ffe9aa':'#e8d8ff'} transparent opacity={.3}/></mesh></Float>)}
    <ContactShadows position={[0,-.94,0]} opacity={.24} scale={7} blur={4.2} far={5.5} color="#5d4868"/>
  </>;
}

function BottleCard({ item, selected }: { item:Ingredient; selected:boolean }) {
  return <>
    <span className={styles.bottleArt} aria-hidden="true">
      <span className={styles.bottleCork}/><span className={styles.bottleNeck}/><span className={styles.bottleBody} style={{['--liquid' as string]:item.color}}><span className={styles.bottleLiquid}/><span className={styles.bottleShine}/></span>
    </span>
    <span className={styles.ingredientName}>{item.name}</span>
    {selected && <span className={styles.selectedMark}><Check size={11}/></span>}
  </>;
}

export default function PotionGameFreeMix(){
  const [mix,setMix]=useState<IngredientId[]>([]);
  const [heat,setHeat]=useState<Heat>('medium');
  const [pouring,setPouring]=useState<IngredientId|null>(null);
  const [stirring,setStirring]=useState(false);
  const [stir,setStir]=useState(0);
  const [pulse,setPulse]=useState(0);
  const [result,setResult]=useState<Result|null>(null);
  const [journal,setJournal]=useState<Result[]>([]);
  const [showJournal,setShowJournal]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [sound,setSound]=useState(true);
  const [coins,setCoins]=useState(120);

  useEffect(()=>{
    try{const saved=localStorage.getItem('moonveil-free-mix');if(saved){const data=JSON.parse(saved);setJournal(data.journal||[]);setCoins(data.coins||120);}}catch{}
  },[]);
  useEffect(()=>{try{localStorage.setItem('moonveil-free-mix',JSON.stringify({journal,coins}));}catch{}},[journal,coins]);
  useEffect(()=>{
    if(!stirring)return;
    const id=window.setInterval(()=>setStir(v=>{const n=Math.min(100,v+2.6);if(n>=100)setStirring(false);return n;}),42);
    return()=>window.clearInterval(id);
  },[stirring]);

  const startPour=(id:IngredientId)=>{
    if(pouring||mix.length>=4)return;
    setPouring(id); if(sound)tone(285,.09);
  };
  const finishPour=(id:IngredientId)=>{
    setMix(v=>[...v,id]);setPouring(null);setPulse(v=>v+1);if(sound){tone(410+mix.length*55,.12);setTimeout(()=>tone(520,.08),120);} if(navigator.vibrate) navigator.vibrate(18);
  };
  const reset=()=>{setMix([]);setHeat('medium');setStir(0);setStirring(false);setPouring(null);setResult(null);};
  const brew=()=>{
    if(mix.length<2)return;
    const r=makePotion(mix,heat);setResult(r);setPulse(v=>v+1);setCoins(v=>v+r.value);
    setJournal(items=>{const exists=items.some(x=>x.key===r.key);return exists?items:[r,...items].slice(0,60)});
    if(sound){tone(560,.15,.06);setTimeout(()=>tone(720,.18,.05),120);setTimeout(()=>tone(890,.2,.04),230);} if(navigator.vibrate)navigator.vibrate([30,30,55]);
  };
  const canBrew=mix.length>=2&&!pouring;

  return <main className={styles.page}>
    <section className={styles.phone}>
      <div className={styles.background}/><div className={styles.wash}/><div className={styles.depthFade}/>
      <header className={styles.topbar}>
        <button className={styles.iconBtn} aria-label="Menu"><Menu size={19}/></button>
        <div className={styles.brand}><small>MOONVEIL</small><strong>Alchemy Atelier</strong></div>
        <div className={styles.topActions}>
          <button className={styles.coin}>{coins}</button>
          <button className={styles.iconBtn} onClick={()=>setShowJournal(true)} aria-label="Potion journal"><BookOpen size={19}/></button>
          <button className={styles.iconBtn} onClick={()=>setShowSettings(true)} aria-label="Settings"><Settings size={18}/></button>
        </div>
      </header>

      <div className={styles.scene}>
        <Canvas shadows dpr={[1,1.65]} camera={{position:[0,2.55,6.85],fov:40,near:.1,far:30}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>gl.setClearColor(0x000000,0)}>
          <Scene mix={mix} heat={heat} stirring={stirring} pouring={pouring} onPourDone={finishPour} pulse={pulse}/>
        </Canvas>
        <div className={styles.cauldronCaption}>{pouring?'Pouring slowly…':mix.length?`${mix.length} ingredient${mix.length>1?'s':''} in the cauldron`:'Choose anything. Discover what it becomes.'}</div>
      </div>

      <section className={styles.controlDock}>
        <div className={styles.dockHead}>
          <span>Ingredients</span>
          <button onClick={reset} disabled={!mix.length&&!stir}><RotateCcw size={14}/> Clear</button>
        </div>
        <div className={styles.shelf}>
          {INGREDIENTS.map(item=>{
            const selected=mix.includes(item.id);
            return <button key={item.id} className={`${styles.ingredientCard} ${selected?styles.ingredientSelected:''}`} onClick={()=>startPour(item.id)} disabled={!!pouring||mix.length>=4} style={{['--accent' as string]:item.color,['--soft' as string]:item.soft}}><BottleCard item={item} selected={selected}/></button>
          })}
        </div>
        <div className={styles.actions}>
          <div className={styles.heatControl}>
            {(['low','medium','high'] as Heat[]).map(h=><button key={h} onClick={()=>setHeat(h)} className={heat===h?styles.heatActive:''}><Flame size={13}/><span>{h}</span></button>)}
          </div>
          <button className={`${styles.stirBtn} ${stirring?styles.stirring:''}`} disabled={mix.length<2||!!pouring} onClick={()=>{if(!stirring){setStir(0);setStirring(true);if(sound)tone(320,.08);}}}><RotateCw size={16}/><span>{stirring?'Stirring…':stir>=100?'Stir again':'Stir'}</span>{stir>0&&<em>{Math.round(stir)}%</em>}</button>
          <button className={`${styles.brewBtn} ${canBrew?styles.brewReady:''}`} onClick={brew} disabled={!canBrew}><FlaskConical size={17}/><span>Brew</span></button>
        </div>
      </section>

      {result&&<div className={styles.resultOverlay}>
        <div className={styles.resultAura} style={{['--result' as string]:result.color}}/>
        <article className={styles.resultCard}>
          <button className={styles.closeResult} onClick={()=>setResult(null)}><X size={18}/></button>
          <div className={styles.resultBottle} style={{['--result' as string]:result.color}}><span/><i/></div>
          <small>{result.rarity.toUpperCase()} · {result.className.toUpperCase()}</small>
          <h2>{result.name}</h2>
          <p className={styles.effect}>{result.effect}</p>
          <p className={styles.flavor}>{result.description}</p>
          <div className={styles.resultMeta}><span>Value <strong>{result.value}</strong></span><span>{result.heat} heat</span><span>{result.ingredients.length} ingredients</span></div>
          <button className={styles.resultContinue} onClick={()=>{setResult(null);reset();}}>Keep experimenting</button>
        </article>
      </div>}

      {showJournal&&<div className={styles.sheetOverlay} onClick={()=>setShowJournal(false)}><section className={styles.sheet} onClick={e=>e.stopPropagation()}><div className={styles.sheetTop}><div><BookOpen size={18}/><strong>Potion Journal</strong></div><button onClick={()=>setShowJournal(false)}><X size={18}/></button></div>{journal.length===0?<div className={styles.emptyJournal}>Your discoveries will appear here.</div>:<div className={styles.journalGrid}>{journal.map(item=><article key={item.key}><span className={styles.miniBottle} style={{['--result' as string]:item.color}}/><div><small>{item.rarity}</small><strong>{item.name}</strong><p>{item.effect}</p></div></article>)}</div>}</section></div>}

      {showSettings&&<div className={styles.sheetOverlay} onClick={()=>setShowSettings(false)}><section className={styles.settingsSheet} onClick={e=>e.stopPropagation()}><div className={styles.sheetTop}><div><Settings size={18}/><strong>Settings</strong></div><button onClick={()=>setShowSettings(false)}><X size={18}/></button></div><button className={styles.settingRow} onClick={()=>setSound(v=>!v)}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}<span>Sound</span><b>{sound?'On':'Off'}</b></button><p>Progress is saved on this device automatically.</p></section></div>}
    </section>
  </main>;
}
