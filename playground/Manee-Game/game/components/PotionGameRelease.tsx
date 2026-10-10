'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import {
  BookOpen,
  Check,
  ChevronRight,
  Coins,
  Flame,
  FlaskConical,
  Gem,
  Leaf,
  Menu,
  RotateCcw,
  RotateCw,
  Settings,
  ShieldCheck,
  Sprout,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import * as THREE from 'three';
import {
  Component,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './PotionGameRelease.module.css';

const POTION_MODEL_URL = 'https://static.poly.pizza/b2a6e47f-0e90-4a34-9213-e01f26ee9b19.glb';
const CHEST_MODEL_URL = 'https://static.poly.pizza/b4373a5a-463e-43e1-aece-7dda31788c0d.glb';

const INGREDIENTS = [
  { id: 'mooncap', name: 'Mooncap', short: 'Moon', color: '#9f8dff', soft: '#eeeaff' },
  { id: 'crystal', name: 'Star Crystal', short: 'Crystal', color: '#5bd5ff', soft: '#e6f9ff' },
  { id: 'mandrake', name: 'Mandrake Root', short: 'Root', color: '#d99b68', soft: '#fff0dc' },
  { id: 'ember', name: 'Ember Seed', short: 'Ember', color: '#ff7b5c', soft: '#ffe9e2' },
  { id: 'frog', name: 'Frog Dew', short: 'Dew', color: '#7fd46d', soft: '#ecffe5' },
  { id: 'shade', name: 'Nightshade', short: 'Shade', color: '#c86fe8', soft: '#f8e7ff' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];
type Heat = 'low' | 'medium' | 'high';
type Result = 'idle' | 'success' | 'fail';
type Modal = 'none' | 'book' | 'settings' | 'tutorial' | 'day';
type BrewItem = { id: IngredientId; name: string; color: string };

type Recipe = {
  id: string;
  name: string;
  subtitle: string;
  customer: string;
  request: string;
  ingredients: IngredientId[];
  heat: Heat;
  reward: number;
  color: string;
  unlockAt: number;
};

type SaveData = {
  coins: number;
  reputation: number;
  completed: number;
  streak: number;
  bestStreak: number;
  sound: boolean;
  reduceMotion: boolean;
  tutorialSeen: boolean;
};

const RECIPES: Recipe[] = [
  {
    id: 'moonveil',
    name: 'Moonveil Elixir',
    subtitle: 'A calm silver draught for sleepless nights.',
    customer: 'The Night Courier',
    request: '“I need something quiet enough to cross the old bridge unseen.”',
    ingredients: ['mooncap', 'crystal', 'mandrake'],
    heat: 'medium',
    reward: 42,
    color: '#9c8cff',
    unlockAt: 0,
  },
  {
    id: 'emberguard',
    name: 'Emberguard Tonic',
    subtitle: 'A warming tonic that keeps winter from the bones.',
    customer: 'The Mountain Scout',
    request: '“The pass is frozen. Give me heat that lasts until sunrise.”',
    ingredients: ['ember', 'mandrake', 'crystal'],
    heat: 'high',
    reward: 58,
    color: '#ff845f',
    unlockAt: 2,
  },
  {
    id: 'verdant-sight',
    name: 'Verdant Sight',
    subtitle: 'Sharpens sight where the forest keeps secrets.',
    customer: 'The Moss Cartographer',
    request: '“I lost a path that only appears beneath green moonlight.”',
    ingredients: ['frog', 'shade', 'mooncap'],
    heat: 'low',
    reward: 64,
    color: '#77cf7a',
    unlockAt: 4,
  },
  {
    id: 'nightbloom',
    name: 'Nightbloom Serum',
    subtitle: 'A luminous serum used by midnight gardeners.',
    customer: 'The Glasshouse Keeper',
    request: '“My flowers refuse to open. They only trust the dark.”',
    ingredients: ['shade', 'crystal', 'mooncap'],
    heat: 'medium',
    reward: 76,
    color: '#cf79e5',
    unlockAt: 6,
  },
  {
    id: 'sunroot',
    name: 'Sunroot Remedy',
    subtitle: 'Restores warmth after a long magical fever.',
    customer: 'The Traveling Healer',
    request: '“One patient has gone cold after touching a cursed mirror.”',
    ingredients: ['mandrake', 'ember', 'frog'],
    heat: 'high',
    reward: 88,
    color: '#efad62',
    unlockAt: 8,
  },
];

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  reputation: 0,
  completed: 0,
  streak: 0,
  bestStreak: 0,
  sound: true,
  reduceMotion: false,
  tutorialSeen: false,
};

function ingredient(id: IngredientId) {
  return INGREDIENTS.find((item) => item.id === id)!;
}

function IngredientIcon({ id, size = 18 }: { id: IngredientId; size?: number }) {
  if (id === 'crystal') return <Gem size={size} strokeWidth={1.9} />;
  if (id === 'mandrake') return <Sprout size={size} strokeWidth={1.9} />;
  if (id === 'ember') return <Flame size={size} strokeWidth={1.9} />;
  if (id === 'shade') return <Leaf size={size} strokeWidth={1.9} />;
  if (id === 'frog') return <FlaskConical size={size} strokeWidth={1.9} />;
  return <Leaf size={size} strokeWidth={1.9} />;
}

function haptic(ms = 12) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
}

function playTone(enabled: boolean, frequency: number, duration = 0.09, type: OscillatorType = 'sine') {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.025);
    osc.onended = () => ctx.close();
  } catch {
    // Sound is optional and can be blocked by browser gesture policies.
  }
}

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function RemoteProp({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const gltf = useGLTF(url);
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z) || 1;
    clone.scale.setScalar(1 / largest);
    const normalizedBox = new THREE.Box3().setFromObject(clone);
    const center = normalizedBox.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    return clone;
  }, [gltf.scene]);

  return <primitive object={model} position={position} rotation={rotation} scale={scale} />;
}

function GlassBottle({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.56, 20]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.36}
          transmission={0.42}
          roughness={0.05}
          thickness={0.6}
          clearcoat={0.65}
        />
      </mesh>
      <mesh position={[0, -0.045, 0]}>
        <cylinderGeometry args={[0.145, 0.21, 0.29, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.52} transparent opacity={0.93} />
      </mesh>
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.082, 0.082, 0.25, 14]} />
        <meshPhysicalMaterial color="#faf7ff" transparent opacity={0.42} transmission={0.32} roughness={0.06} />
      </mesh>
      <mesh castShadow position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.1, 14]} />
        <meshStandardMaterial color="#b9966c" roughness={0.86} />
      </mesh>
      <pointLight intensity={1.2} distance={1.6} color={color} />
    </group>
  );
}

function PouringBottle({
  id,
  reduceMotion,
  onImpact,
  onComplete,
}: {
  id: IngredientId;
  reduceMotion: boolean;
  onImpact: (id: IngredientId) => void;
  onComplete: (id: IngredientId) => void;
}) {
  const item = ingredient(id);
  const bottle = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const streamGlow = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const impacted = useRef(false);
  const completed = useRef(false);
  const side = ['mooncap', 'mandrake', 'frog'].includes(id) ? -1 : 1;
  const start = useMemo(() => new THREE.Vector3(side * 2.2, 0.35, 0.36), [side]);
  const hover = useMemo(() => new THREE.Vector3(side * 0.34, 2.72, 0.12), [side]);
  const exit = useMemo(() => new THREE.Vector3(side * 1.75, 3.25, -0.15), [side]);
  const total = reduceMotion ? 2.25 : 4.25;

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (!bottle.current) return;
    const t = Math.min(1, elapsed.current / total);

    // 0–28%: slow arc from shelf to a clear position directly over the cauldron.
    if (t < 0.28) {
      const p = THREE.MathUtils.smoothstep(t / 0.28, 0, 1);
      bottle.current.position.lerpVectors(start, hover, p);
      bottle.current.position.y += Math.sin(p * Math.PI) * 0.42;
      bottle.current.rotation.z = THREE.MathUtils.lerp(0, side * -0.08, p);
      bottle.current.rotation.y = THREE.MathUtils.lerp(side * 0.15, 0, p);
    }
    // 28–40%: deliberately pause above the cauldron so the player sees the setup.
    else if (t < 0.4) {
      bottle.current.position.copy(hover);
      bottle.current.position.y += Math.sin(elapsed.current * 4) * 0.018;
      bottle.current.rotation.z = side * -0.08;
    }
    // 40–56%: slowly tip the bottle mouth toward the middle of the cauldron.
    else if (t < 0.56) {
      const p = THREE.MathUtils.smoothstep((t - 0.4) / 0.16, 0, 1);
      bottle.current.position.copy(hover);
      bottle.current.position.x = THREE.MathUtils.lerp(hover.x, side * 0.18, p);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -0.08, side * -1.88, p);
    }
    // 56–80%: hold the pour long enough to read visually.
    else if (t < 0.8) {
      bottle.current.position.set(side * 0.18, hover.y, hover.z);
      bottle.current.rotation.z = side * -1.88;
      bottle.current.rotation.x = Math.sin(elapsed.current * 7) * 0.018;
    }
    // 80–100%: return upright and leave only after the splash has happened.
    else {
      const p = THREE.MathUtils.smoothstep((t - 0.8) / 0.2, 0, 1);
      bottle.current.position.lerpVectors(new THREE.Vector3(side * 0.18, hover.y, hover.z), exit, p);
      bottle.current.rotation.z = THREE.MathUtils.lerp(side * -1.88, 0, p);
    }

    const pouring = t > 0.545 && t < 0.805;
    for (const ref of [stream, streamGlow]) {
      if (!ref.current) continue;
      ref.current.visible = pouring;
      if (pouring) {
        const pulse = 0.88 + Math.sin(elapsed.current * 24) * 0.11;
        ref.current.scale.x = pulse;
        ref.current.scale.z = pulse;
      }
    }

    if (t > 0.7 && !impacted.current) {
      impacted.current = true;
      onImpact(id);
    }
    if (t >= 0.985 && !completed.current) {
      completed.current = true;
      onComplete(id);
    }
  });

  return (
    <group>
      <group ref={bottle} position={start.toArray()}>
        <GlassBottle color={item.color} scale={1.18} />
      </group>
      <mesh ref={streamGlow} visible={false} position={[0, 1.76, 0.08]}>
        <cylinderGeometry args={[0.085, 0.12, 1.7, 14]} />
        <meshBasicMaterial color={item.color} transparent opacity={0.16} />
      </mesh>
      <mesh ref={stream} visible={false} position={[0, 1.76, 0.08]}>
        <cylinderGeometry args={[0.035, 0.055, 1.7, 12]} />
        <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={1.1} transparent opacity={0.96} />
      </mesh>
    </group>
  );
}

function Ripple({ color, tick }: { color: string; tick: number }) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const start = useRef<number | null>(null);
  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - start.current) / 1.05);
    [ringA, ringB].forEach((ref, index) => {
      if (!ref.current) return;
      ref.current.scale.setScalar(0.25 + t * (1.6 + index * 0.35));
      const material = ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = (0.62 - index * 0.13) * (1 - t);
    });
  });

  return (
    <group key={tick} position={[0, 0.93, 0]}>
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.032, 10, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.62} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.018, 10, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
      </mesh>
      {Array.from({ length: 12 }).map((_, index) => (
        <Float key={index} speed={2 + index * 0.05} floatIntensity={0.8} rotationIntensity={0.08}>
          <mesh position={[Math.cos(index * 1.37) * 0.58, 0.12 + (index % 4) * 0.08, Math.sin(index * 1.37) * 0.4]}>
            <sphereGeometry args={[0.032 + (index % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={index % 3 === 0 ? '#fff8e8' : color} transparent opacity={0.86} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ArcaneDisc({ color, stir }: { color: THREE.Color; stir: number }) {
  const outer = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (outer.current) outer.current.rotation.z = state.clock.elapsedTime * (0.12 + stir / 1400);
    if (middle.current) middle.current.rotation.z = -state.clock.elapsedTime * (0.19 + stir / 1200);
    if (inner.current) inner.current.rotation.z = state.clock.elapsedTime * (0.28 + stir / 900);
  });
  return (
    <group position={[0, 0.22, -0.42]}>
      <mesh ref={outer} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.012, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <mesh ref={middle} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.17, 0.009, 8, 90]} />
        <meshBasicMaterial color="#fff3d7" transparent opacity={0.2} />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.83, 0.86, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 16 }).map((_, index) => (
        <mesh key={index} position={[Math.cos((index / 16) * Math.PI * 2) * 1.41, 0, Math.sin((index / 16) * Math.PI * 2) * 1.41]}>
          <sphereGeometry args={[index % 4 === 0 ? 0.035 : 0.018, 8, 8]} />
          <meshBasicMaterial color={index % 3 ? color : '#fff6df'} transparent opacity={0.62} />
        </mesh>
      ))}
    </group>
  );
}

function StirringSpoon({ active }: { active: boolean }) {
  const pivot = useRef<THREE.Group>(null);
  const spoon = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!pivot.current || !spoon.current) return;
    if (active) {
      pivot.current.rotation.y += delta * 5.2;
      spoon.current.rotation.z = THREE.MathUtils.lerp(spoon.current.rotation.z, -0.25, 0.08);
      spoon.current.position.y = THREE.MathUtils.lerp(spoon.current.position.y, 0.98, 0.08);
    } else {
      pivot.current.rotation.y += delta * 0.2;
      spoon.current.rotation.z = THREE.MathUtils.lerp(spoon.current.rotation.z, -0.08, 0.05);
      spoon.current.position.y = THREE.MathUtils.lerp(spoon.current.position.y, 1.45, 0.05);
    }
  });
  return (
    <group ref={pivot} position={[0, 0, 0]}>
      <group ref={spoon} position={[0.48, 1.45, 0]} rotation={[0.2, 0, -0.08]}>
        <mesh castShadow position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 1.2, 10]} />
          <meshStandardMaterial color="#7b5434" roughness={0.72} />
        </mesh>
        <mesh castShadow position={[0, -0.08, 0]} scale={[0.17, 0.25, 0.09]}>
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color="#976b45" roughness={0.68} />
        </mesh>
      </group>
    </group>
  );
}

function Cauldron({
  brew,
  heat,
  stir,
  stirring,
  result,
  splashTick,
  splashColor,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  stirring: boolean;
  result: Result;
  splashTick: number;
  splashColor: string;
}) {
  const liquid = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);

  const potionColor = useMemo(() => {
    if (!brew.length) return new THREE.Color('#9e8cda');
    const mixed = new THREE.Color('#000000');
    brew.forEach((item) => mixed.add(new THREE.Color(item.color)));
    return mixed.multiplyScalar(1 / brew.length);
  }, [brew]);

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (stirring ? 5.7 : 0.26 + stir / 120);
      const material = liquid.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.74 + Math.sin(state.clock.elapsedTime * 3.1) * 0.07 + (stirring ? 0.28 : 0);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.1) * 0.008;
      liquid.current.scale.setScalar(pulse);
    }
    if (body.current) {
      if (result === 'fail') body.current.rotation.z = Math.sin(state.clock.elapsedTime * 34) * 0.022;
      else body.current.rotation.z *= 0.84;
    }
  });

  const flame = heat === 'low' ? '#ffc873' : heat === 'medium' ? '#ff885c' : '#ffe36e';

  return (
    <group ref={body} position={[0, -0.77, 0]}>
      <ArcaneDisc color={potionColor} stir={stir} />

      <mesh castShadow scale={[1.22, 0.89, 1.22]} position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.88, 52, 34, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.69]} />
        <meshStandardMaterial color="#4d3a63" roughness={0.18} metalness={0.38} />
      </mesh>
      <mesh castShadow position={[0, 1.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.09, 20, 88]} />
        <meshStandardMaterial color="#a080bd" roughness={0.16} metalness={0.45} />
      </mesh>
      <mesh ref={liquid} position={[0, 1.064, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.885, 88]} />
        <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.82} roughness={0.07} transparent opacity={0.96} />
      </mesh>
      <mesh position={[0, 1.073, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.84, 80]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.075} />
      </mesh>

      <mesh castShadow position={[-1.04, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.048, 10, 40, Math.PI]} />
        <meshStandardMaterial color="#6e557f" metalness={0.38} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[1.04, 0.74, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.34, 0.048, 10, 40, Math.PI]} />
        <meshStandardMaterial color="#6e557f" metalness={0.38} roughness={0.2} />
      </mesh>

      {[-0.62, 0.62].map((x) => (
        <mesh key={x} castShadow position={[x, 0.02, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.08, 0.145, 0.7, 12]} />
          <meshStandardMaterial color="#3d304b" roughness={0.3} />
        </mesh>
      ))}

      <group position={[0, -0.03, 0]}>
        {Array.from({ length: 10 }).map((_, index) => (
          <mesh key={index} position={[Math.cos((index / 10) * Math.PI * 2) * 0.39, 0.06 + (index % 2) * 0.05, Math.sin((index / 10) * Math.PI * 2) * 0.3]}>
            <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.036 : heat === 'medium' ? 0.022 : 0), 0]} />
            <meshBasicMaterial color={flame} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 2.2 : heat === 'medium' ? 4.4 : 6.1} distance={5.4} color={flame} />
      </group>

      <StirringSpoon active={stirring} />

      {brew.length > 0 && Array.from({ length: 14 }).map((_, index) => (
        <Float key={index} speed={1.45 + index * 0.04} floatIntensity={0.52} rotationIntensity={0.04}>
          <mesh position={[-0.68 + (index % 6) * 0.27, 1.18 + (index % 4) * 0.18, -0.13 + (index % 2) * 0.25]}>
            <sphereGeometry args={[0.03 + (index % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={index % 5 === 0 ? '#fff5d8' : potionColor} transparent opacity={0.78} />
          </mesh>
        </Float>
      ))}

      {splashTick > 0 && <Ripple key={splashTick} color={splashColor} tick={splashTick} />}

      {result === 'success' && (
        <group position={[0, 1.45, 0]}>
          {Array.from({ length: 24 }).map((_, index) => (
            <Float key={index} speed={1.8 + index * 0.04} floatIntensity={1.2} rotationIntensity={0.06}>
              <mesh position={[Math.cos(index * 1.33) * (0.4 + (index % 5) * 0.2), (index % 7) * 0.2, Math.sin(index * 1.33) * (0.35 + (index % 4) * 0.18)]}>
                <sphereGeometry args={[0.03 + (index % 3) * 0.012, 10, 8]} />
                <meshBasicMaterial color={index % 3 === 0 ? '#fff2af' : '#d9c1ff'} transparent opacity={0.9} />
              </mesh>
            </Float>
          ))}
          <pointLight intensity={10} distance={7} color="#fff0ad" />
        </group>
      )}
    </group>
  );
}

function Scene({
  brew,
  heat,
  stir,
  stirring,
  result,
  pouringId,
  reduceMotion,
  onPourImpact,
  onPourComplete,
  splashTick,
  splashColor,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  stirring: boolean;
  result: Result;
  pouringId: IngredientId | null;
  reduceMotion: boolean;
  onPourImpact: (id: IngredientId) => void;
  onPourComplete: (id: IngredientId) => void;
  splashTick: number;
  splashColor: string;
}) {
  return (
    <>
      <ambientLight intensity={1.9} color="#fff6e9" />
      <hemisphereLight args={['#fffceb', '#8a729d', 1.82]} />
      <directionalLight castShadow position={[3.6, 7, 5]} intensity={2.65} color="#fff0cd" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2.7, 2.2, 3]} intensity={3.8} distance={8} color="#ffca94" />
      <pointLight position={[2.5, 2.4, 2]} intensity={3} distance={8} color="#cab7ff" />

      <group position={[0, 0.04, 0]} scale={1.08}>
        <Cauldron
          brew={brew}
          heat={heat}
          stir={stir}
          stirring={stirring}
          result={result}
          splashTick={splashTick}
          splashColor={splashColor}
        />
        {pouringId && (
          <PouringBottle
            key={pouringId}
            id={pouringId}
            reduceMotion={reduceMotion}
            onImpact={onPourImpact}
            onComplete={onPourComplete}
          />
        )}

        <ModelBoundary>
          <Suspense fallback={null}>
            <RemoteProp url={CHEST_MODEL_URL} position={[-2.15, -1.05, -0.95]} rotation={[0, 0.55, 0]} scale={0.92} />
            <RemoteProp url={POTION_MODEL_URL} position={[2.06, 0.18, -0.78]} rotation={[0, -0.45, 0]} scale={0.75} />
          </Suspense>
        </ModelBoundary>
      </group>

      {Array.from({ length: 26 }).map((_, index) => (
        <Float key={index} speed={0.65 + (index % 5) * 0.1} floatIntensity={0.35} rotationIntensity={0}>
          <mesh position={[-2.8 + (index % 8) * 0.8, -0.2 + (index % 7) * 0.62, -0.8 - (index % 3) * 0.2]}>
            <sphereGeometry args={[0.012 + (index % 4) * 0.006, 8, 8]} />
            <meshBasicMaterial color={index % 4 === 0 ? '#fff0bd' : '#eadcff'} transparent opacity={0.38} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function BottleCard({ item }: { item: (typeof INGREDIENTS)[number] }) {
  return (
    <span className={styles.bottleGraphic} aria-hidden="true">
      <span className={styles.bottleNeck} />
      <span className={styles.bottleBody}>
        <span className={styles.bottleLiquid} style={{ background: item.color }} />
        <span className={styles.bottleHighlight} />
      </span>
    </span>
  );
}

function Tutorial({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.tutorialCard}>
        <div className={styles.modalTop}>
          <div>
            <small>FIRST SHIFT</small>
            <h2>Brewing is only four steps.</h2>
          </div>
          <button onClick={onClose} aria-label="Close tutorial"><X size={18} /></button>
        </div>
        <div className={styles.tutorialSteps}>
          <div><span>1</span><div><strong>Tap a bottle</strong><p>Watch it move above the cauldron and pour. Order matters.</p></div></div>
          <div><span>2</span><div><strong>Set the flame</strong><p>Each recipe needs low, medium, or high heat.</p></div></div>
          <div><span>3</span><div><strong>Stir once</strong><p>A single tap starts a complete, readable stirring animation.</p></div></div>
          <div><span>4</span><div><strong>Brew and serve</strong><p>Correct potions earn coins, reputation, and unlock new orders.</p></div></div>
        </div>
        <button className={styles.primaryModalButton} onClick={onClose}>Begin shift <ChevronRight size={17} /></button>
      </div>
    </div>
  );
}

export default function PotionGameRelease() {
  const [save, setSave] = useState<SaveData>(DEFAULT_SAVE);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [modal, setModal] = useState<Modal>('none');
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [brew, setBrew] = useState<BrewItem[]>([]);
  const [heat, setHeat] = useState<Heat>('low');
  const [stir, setStir] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [result, setResult] = useState<Result>('idle');
  const [pouringId, setPouringId] = useState<IngredientId | null>(null);
  const [impactCommitted, setImpactCommitted] = useState(false);
  const [splashTick, setSplashTick] = useState(0);
  const [splashColor, setSplashColor] = useState('#9f8dff');
  const [message, setMessage] = useState('Choose the first bottle from the shelf.');
  const [rewardEarned, setRewardEarned] = useState(0);

  const recipe = RECIPES[recipeIndex] ?? RECIPES[0];
  const day = Math.floor(save.completed / 5) + 1;
  const orderInDay = (save.completed % 5) + 1;
  const unlockedRecipes = RECIPES.filter((entry) => save.completed >= entry.unlockAt);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('moonveil-lab-save-v1');
      if (raw) setSave({ ...DEFAULT_SAVE, ...JSON.parse(raw) });
    } catch {
      // Fresh save if localStorage is unavailable or corrupted.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem('moonveil-lab-save-v1', JSON.stringify(save));
  }, [save, hydrated]);

  useEffect(() => {
    const available = RECIPES.filter((entry) => save.completed >= entry.unlockAt);
    const next = available.length ? save.completed % available.length : 0;
    setRecipeIndex(next);
  }, [save.completed]);

  const resetBrew = useCallback(() => {
    setBrew([]);
    setHeat('low');
    setStir(0);
    setStirring(false);
    setResult('idle');
    setPouringId(null);
    setImpactCommitted(false);
    setRewardEarned(0);
    setMessage('Choose the first bottle from the shelf.');
  }, []);

  const startGame = () => {
    setStarted(true);
    if (!save.tutorialSeen) setModal('tutorial');
    playTone(save.sound, 420, 0.12);
  };

  const startPour = (id: IngredientId) => {
    if (pouringId || result !== 'idle' || stirring) return;
    if (brew.length >= 3) {
      setMessage('Three essences are already in the cauldron. Set the flame next.');
      return;
    }
    setPouringId(id);
    setImpactCommitted(false);
    setMessage(`${ingredient(id).name} is moving into position…`);
    playTone(save.sound, 275, 0.08);
    haptic(9);
  };

  const pourImpact = (id: IngredientId) => {
    if (impactCommitted) return;
    setImpactCommitted(true);
    const item = ingredient(id);
    setBrew((current) => [...current, { id, name: item.name, color: item.color }].slice(0, 3));
    setSplashColor(item.color);
    setSplashTick((value) => value + 1);
    setMessage(`${item.name} lands in the potion.`);
    playTone(save.sound, 395 + brew.length * 64, 0.13);
    haptic(18);
  };

  const pourComplete = (id: IngredientId) => {
    setPouringId(null);
    setImpactCommitted(false);
    const nextCount = Math.min(3, brew.length + (impactCommitted ? 0 : 1));
    if (nextCount >= 3 || brew.length >= 3) setMessage('Ingredients complete. Match the flame to the recipe.');
    else setMessage('Good pour. Choose the next bottle.');
    playTone(save.sound, 470, 0.07);
  };

  const startStir = () => {
    if (brew.length < 3 || result !== 'idle' || stirring || pouringId) return;
    setStir(0);
    setStirring(true);
    setMessage('The wooden spoon is drawing the mixture together…');
    playTone(save.sound, 315, 0.11);
    haptic(10);
  };

  useEffect(() => {
    if (!stirring) return;
    const duration = save.reduceMotion ? 900 : 2100;
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(100, ((performance.now() - startedAt) / duration) * 100);
      setStir(progress);
      if (progress >= 100) {
        window.clearInterval(timer);
        setStirring(false);
      }
    }, 32);
    return () => window.clearInterval(timer);
  }, [stirring, save.reduceMotion]);

  useEffect(() => {
    if (!stirring && stir >= 100 && brew.length >= 3) {
      setMessage('The swirl is stable. Brew when you are ready.');
      playTone(save.sound, 545, 0.11);
      haptic(12);
    }
  }, [stirring, stir, brew.length, save.sound]);

  const brewPotion = () => {
    if (brew.length < 3) {
      setMessage('Add all three essences first.');
      return;
    }
    if (stir < 100) {
      setMessage('Stir the mixture before brewing.');
      return;
    }
    const exact = recipe.ingredients.every((id, index) => brew[index]?.id === id);
    const correctHeat = heat === recipe.heat;
    const success = exact && correctHeat;
    setResult(success ? 'success' : 'fail');

    if (success) {
      const streak = save.streak + 1;
      const bonus = Math.min(20, Math.max(0, streak - 1) * 3);
      const reward = recipe.reward + bonus;
      const completed = save.completed + 1;
      setRewardEarned(reward);
      setSave((current) => ({
        ...current,
        coins: current.coins + reward,
        reputation: current.reputation + 1,
        completed,
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
      }));
      setMessage(`${recipe.name} is stable and ready to serve.`);
      playTone(save.sound, 650, 0.16);
      window.setTimeout(() => playTone(save.sound, 830, 0.18), 140);
      window.setTimeout(() => playTone(save.sound, 990, 0.2), 290);
      haptic(32);
    } else {
      const reason = !exact ? 'The ingredient order is wrong.' : `This recipe needs ${recipe.heat} heat.`;
      setSave((current) => ({ ...current, streak: 0, reputation: Math.max(0, current.reputation - 1) }));
      setMessage(reason);
      playTone(save.sound, 145, 0.24, 'triangle');
      haptic(26);
    }
  };

  const continueAfterResult = () => {
    const justCompletedDay = result === 'success' && save.completed > 0 && save.completed % 5 === 0;
    resetBrew();
    if (justCompletedDay) setModal('day');
  };

  const activeStep = brew.length < 3 ? 1 : heat !== recipe.heat ? 2 : stir < 100 ? 3 : 4;
  const ready = brew.length === 3 && heat === recipe.heat && stir >= 100 && result === 'idle';
  const interactionLocked = !!pouringId || stirring || result !== 'idle';

  if (!hydrated) return <main className={styles.loading}><div className={styles.loadingOrb} /></main>;

  return (
    <main className={styles.page}>
      <section className={styles.phone}>
        <div className={styles.background} />
        <div className={styles.lightWash} />
        <div className={styles.depthHaze} />
        <div className={styles.foregroundShelfLeft} />
        <div className={styles.foregroundShelfRight} />

        {!started && (
          <div className={styles.titleScreen}>
            <div className={styles.titleFog} />
            <div className={styles.titleContent}>
              <div className={styles.titleSeal}><FlaskConical size={28} /></div>
              <small>THE NIGHT SHIFT BEGINS</small>
              <h1>Moonveil<br />Alchemy</h1>
              <p>Brew strange remedies for travelers who only arrive after sunset.</p>
              <div className={styles.titleStats}>
                <span><Coins size={15} /> {save.coins}</span>
                <span><ShieldCheck size={15} /> Rep {save.reputation}</span>
              </div>
              <button className={styles.startButton} onClick={startGame}>
                <span>{save.completed > 0 ? 'Continue shift' : 'Open the apothecary'}</span>
                <ChevronRight size={19} />
              </button>
              <button className={styles.titleSettings} onClick={() => setModal('settings')}><Settings size={16} /> Settings & credits</button>
            </div>
          </div>
        )}

        {started && (
          <>
            <header className={styles.topbar}>
              <button className={styles.menuButton} onClick={() => setStarted(false)} aria-label="Menu"><Menu size={19} /></button>
              <div className={styles.shiftInfo}>
                <small>DAY {day} · ORDER {orderInDay}/5</small>
                <strong>Moonveil Lab</strong>
              </div>
              <div className={styles.currency}><Coins size={14} /><strong>{save.coins}</strong></div>
              <button className={styles.topIconButton} onClick={() => setModal('book')} aria-label="Recipe book"><BookOpen size={19} /></button>
            </header>

            <section className={styles.orderCard}>
              <div className={styles.customerPortrait} aria-hidden="true"><span>{recipe.customer.charAt(4) || 'M'}</span></div>
              <div className={styles.orderCopy}>
                <div className={styles.orderMeta}><span>{recipe.customer}</span><small>+{recipe.reward} base coins</small></div>
                <strong>{recipe.name}</strong>
                <p>{recipe.request}</p>
              </div>
            </section>

            <div className={styles.recipeStrip}>
              <div className={styles.recipeIdentity}>
                <span className={styles.recipeColor} style={{ background: recipe.color }} />
                <div><small>RECIPE</small><strong>{recipe.name}</strong></div>
              </div>
              <div className={styles.recipeSequence}>
                {recipe.ingredients.map((id, index) => {
                  const item = ingredient(id);
                  const done = brew[index]?.id === id;
                  const wrong = !!brew[index] && brew[index]?.id !== id;
                  return (
                    <span key={`${id}-${index}`} className={`${styles.recipeSlot} ${done ? styles.recipeSlotDone : ''} ${wrong ? styles.recipeSlotWrong : ''}`} style={{ ['--slot-color' as string]: item.color }}>
                      <IngredientIcon id={id} size={14} />
                    </span>
                  );
                })}
                <span className={styles.heatRecipe}><Flame size={14} />{recipe.heat}</span>
              </div>
            </div>

            <div className={`${styles.canvasWrap} ${pouringId ? styles.canvasPouring : ''}`}>
              <Canvas
                shadows
                dpr={[1, 1.65]}
                camera={{ position: [0, 2.68, 6.8], fov: 40, near: 0.1, far: 30 }}
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
                  reduceMotion={save.reduceMotion}
                  onPourImpact={pourImpact}
                  onPourComplete={pourComplete}
                  splashTick={splashTick}
                  splashColor={splashColor}
                />
              </Canvas>
              {pouringId && (
                <div className={styles.pourCaption}>
                  <small>POURING</small>
                  <strong>{ingredient(pouringId).name}</strong>
                </div>
              )}
            </div>

            <div className={`${styles.gameMessage} ${ready ? styles.messageReady : ''}`}><span>{message}</span></div>

            <section className={styles.controlDeck}>
              <div className={styles.deckHandle} />
              <div className={styles.stepRail}>
                {['Pour', 'Flame', 'Stir', 'Brew'].map((label, index) => {
                  const step = index + 1;
                  return (
                    <div key={label} className={`${styles.step} ${activeStep === step ? styles.stepActive : ''} ${activeStep > step ? styles.stepDone : ''}`}>
                      <span>{activeStep > step ? <Check size={11} /> : step}</span><small>{label}</small>
                    </div>
                  );
                })}
              </div>

              <div className={styles.shelfHeader}>
                <div><FlaskConical size={14} /><strong>Essence shelf</strong></div>
                <button onClick={resetBrew} disabled={interactionLocked}><RotateCcw size={13} /> Reset</button>
              </div>

              <div className={styles.bottleShelf}>
                {INGREDIENTS.map((item) => {
                  const selected = brew.some((entry) => entry.id === item.id);
                  const expected = recipe.ingredients[brew.length] === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`${styles.bottleCard} ${selected ? styles.bottleSelected : ''} ${expected && brew.length < 3 ? styles.bottleSuggested : ''}`}
                      onClick={() => startPour(item.id)}
                      disabled={interactionLocked || brew.length >= 3}
                      style={{ ['--accent' as string]: item.color, ['--soft' as string]: item.soft }}
                    >
                      <BottleCard item={item} />
                      <span className={styles.bottleType}><IngredientIcon id={item.id} size={12} /></span>
                      <strong>{item.short}</strong>
                      {expected && brew.length < 3 && <small>next</small>}
                    </button>
                  );
                })}
              </div>

              <div className={styles.actionGrid}>
                <div className={`${styles.actionCard} ${activeStep === 2 ? styles.actionFocus : ''}`}>
                  <div className={styles.actionTitle}><Flame size={14} /><span>Flame</span></div>
                  <div className={styles.heatButtons}>
                    {(['low', 'medium', 'high'] as Heat[]).map((value) => (
                      <button
                        key={value}
                        className={heat === value ? styles.heatActive : ''}
                        disabled={interactionLocked}
                        onClick={() => {
                          setHeat(value);
                          setMessage(value === recipe.heat ? 'Correct flame. Stir the potion next.' : `${value[0].toUpperCase() + value.slice(1)} flame selected.`);
                          playTone(save.sound, value === 'low' ? 190 : value === 'medium' ? 250 : 320, 0.08);
                          haptic(8);
                        }}
                      >
                        <Flame size={12 + (value === 'high' ? 2 : 0)} /><span>{value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${styles.actionCard} ${activeStep === 3 ? styles.actionFocus : ''}`}>
                  <div className={styles.stirTop}>
                    <div className={styles.actionTitle}><RotateCw size={14} /><span>Stir</span></div><strong>{Math.round(stir)}%</strong>
                  </div>
                  <div className={styles.stirTrack}><div style={{ width: `${stir}%` }} /></div>
                  <button className={styles.stirButton} onClick={startStir} disabled={brew.length < 3 || interactionLocked || stir >= 100}>
                    <RotateCw size={15} className={stirring ? styles.spinning : ''} />
                    <span>{stirring ? 'Stirring…' : stir >= 100 ? 'Ready' : 'Stir once'}</span>
                  </button>
                </div>
              </div>

              <button className={`${styles.brewButton} ${ready ? styles.brewReady : ''}`} onClick={brewPotion} disabled={interactionLocked && result === 'idle'}>
                <FlaskConical size={17} /><span>{ready ? `Brew ${recipe.name}` : 'Brew potion'}</span><ChevronRight size={17} />
              </button>
            </section>
          </>
        )}

        {modal === 'tutorial' && <Tutorial onClose={() => { setModal('none'); setSave((current) => ({ ...current, tutorialSeen: true })); }} />}

        {modal === 'book' && (
          <div className={styles.modalBackdrop} onClick={() => setModal('none')}>
            <div className={styles.bookSheet} onClick={(event) => event.stopPropagation()}>
              <div className={styles.modalTop}>
                <div><small>RECIPE BOOK</small><h2>{unlockedRecipes.length}/{RECIPES.length} discovered</h2></div>
                <button onClick={() => setModal('none')}><X size={18} /></button>
              </div>
              <div className={styles.bookList}>
                {RECIPES.map((entry) => {
                  const unlocked = save.completed >= entry.unlockAt;
                  return (
                    <div key={entry.id} className={`${styles.bookRecipe} ${!unlocked ? styles.bookLocked : ''}`}>
                      <span className={styles.bookSwatch} style={{ background: unlocked ? entry.color : '#cfc7d2' }} />
                      <div className={styles.bookRecipeText}><strong>{unlocked ? entry.name : 'Undiscovered formula'}</strong><small>{unlocked ? entry.subtitle : `Complete ${entry.unlockAt} orders to unlock`}</small></div>
                      {unlocked && <div className={styles.bookIngredients}>{entry.ingredients.map((id) => <span key={id} style={{ color: ingredient(id).color }}><IngredientIcon id={id} size={13} /></span>)}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {modal === 'settings' && (
          <div className={styles.modalBackdrop} onClick={() => setModal('none')}>
            <div className={styles.settingsSheet} onClick={(event) => event.stopPropagation()}>
              <div className={styles.modalTop}>
                <div><small>OPTIONS</small><h2>Settings & credits</h2></div>
                <button onClick={() => setModal('none')}><X size={18} /></button>
              </div>
              <button className={styles.settingRow} onClick={() => setSave((current) => ({ ...current, sound: !current.sound }))}>
                <span>{save.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}<div><strong>Sound effects</strong><small>Procedural potion and UI tones</small></div></span><b>{save.sound ? 'ON' : 'OFF'}</b>
              </button>
              <button className={styles.settingRow} onClick={() => setSave((current) => ({ ...current, reduceMotion: !current.reduceMotion }))}>
                <span><RotateCw size={18} /><div><strong>Reduced motion</strong><small>Shorter bottle and stirring animations</small></div></span><b>{save.reduceMotion ? 'ON' : 'OFF'}</b>
              </button>
              <div className={styles.creditBlock}>
                <small>ASSET CREDITS</small>
                <p>Background artwork: user-provided <code>bg.png</code>.</p>
                <p>Potion Bottle model by Don Carson, CC BY, served via Poly Pizza.</p>
                <p>Chest model by Quaternius, CC0, served via Poly Pizza.</p>
                <p>Design research referenced tactile brewing from Potion Craft and free asset libraries from Quaternius/Kenney.</p>
              </div>
              <button className={styles.dangerButton} onClick={() => { setSave(DEFAULT_SAVE); setRecipeIndex(0); resetBrew(); setStarted(false); setModal('none'); window.localStorage.removeItem('moonveil-lab-save-v1'); }}>Reset all progress</button>
            </div>
          </div>
        )}

        {modal === 'day' && (
          <div className={styles.modalBackdrop}>
            <div className={styles.dayCard}>
              <small>SHOP CLOSED</small>
              <h2>Day {Math.max(1, day - 1)} complete</h2>
              <div className={styles.dayStats}><span><Coins size={18} /><b>{save.coins}</b><small>Total coins</small></span><span><ShieldCheck size={18} /><b>{save.reputation}</b><small>Reputation</small></span><span><FlaskConical size={18} /><b>{save.completed}</b><small>Orders served</small></span></div>
              <p>New customers arrive with harder formulas as your reputation grows.</p>
              <button className={styles.primaryModalButton} onClick={() => setModal('none')}>Open for Day {day} <ChevronRight size={17} /></button>
            </div>
          </div>
        )}

        {result !== 'idle' && (
          <div className={styles.resultOverlay}>
            <div className={`${styles.resultCard} ${result === 'success' ? styles.resultSuccess : styles.resultFail}`}>
              <div className={styles.resultSeal}>{result === 'success' ? <Check size={31} /> : <X size={31} />}</div>
              <small>{result === 'success' ? 'ORDER COMPLETE' : 'BREW FAILED'}</small>
              <h2>{result === 'success' ? recipe.name : 'The mixture collapsed'}</h2>
              <p>{message}</p>
              {result === 'success' && <div className={styles.rewardLine}><Coins size={17} /><strong>+{rewardEarned}</strong><span>{save.streak > 1 ? `${save.streak}× streak` : 'First clean brew'}</span></div>}
              <button onClick={continueAfterResult}>{result === 'success' ? 'Serve & next order' : 'Retry recipe'} <ChevronRight size={17} /></button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
