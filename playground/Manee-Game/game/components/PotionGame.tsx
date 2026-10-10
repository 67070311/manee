'use client';

import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';

const INGREDIENTS = [
  { id: 'mooncap', name: 'Mooncap', color: '#8f7dff', icon: '#a896ff' },
  { id: 'crystal', name: 'Star Crystal', color: '#60dfff', icon: '#71e7ff' },
  { id: 'mandrake', name: 'Mandrake', color: '#d99b53', icon: '#cf9a5f' },
  { id: 'ember', name: 'Ember Seed', color: '#ff6b40', icon: '#ff7651' },
  { id: 'frog', name: 'Frog Eye', color: '#81d95b', icon: '#87ed67' },
  { id: 'shade', name: 'Nightshade', color: '#c457e8', icon: '#ce68f1' },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]['id'];
type Heat = 'low' | 'medium' | 'high';
type BrewResult = 'idle' | 'success' | 'fail';

type BrewItem = {
  id: IngredientId;
  name: string;
  color: string;
};

const recipe = {
  name: 'Moonveil Elixir',
  clue: 'A cap born beneath moonlight, a shard that remembers the stars, and a root that still whispers to the earth.',
  ingredients: ['mooncap', 'crystal', 'mandrake'] as IngredientId[],
  heat: 'medium' as Heat,
  stir: 62,
};

function playTone(frequency: number, duration = 0.12, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    osc.onended = () => ctx.close();
  } catch {
    // Audio is optional; browser gesture policies may block it.
  }
}

function CameraBreath() {
  const { camera, pointer } = useThree();
  const base = useRef(new THREE.Vector3(0, 3.8, 8.8));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetX = pointer.x * 0.24;
    const targetY = 3.8 + pointer.y * 0.12 + Math.sin(t * 0.3) * 0.025;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.025);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, base.current.z, 0.025);
    camera.lookAt(0, 1.25, 0);
  });
  return null;
}

function StoneFloor() {
  const tiles = useMemo(() => {
    const data: Array<{ x: number; z: number; r: number }> = [];
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 3; z++) {
        data.push({ x: x * 0.95 + ((z % 2) * 0.08), z: z * 0.9, r: ((x * 17 + z * 13) % 7) * 0.006 });
      }
    }
    return data;
  }, []);

  return (
    <group position={[0, -0.04, 0]}>
      {tiles.map((tile, i) => (
        <mesh key={i} position={[tile.x, 0, tile.z]} rotation={[-Math.PI / 2, 0, tile.r]} receiveShadow>
          <planeGeometry args={[0.9, 0.84]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#211c25' : '#19151d'} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function WoodenShelf({ position, side = 1 }: { position: [number, number, number]; side?: number }) {
  return (
    <group position={position} rotation={[0, side > 0 ? -0.08 : 0.08, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.7, 0]}>
        <boxGeometry args={[2.65, 3.7, 0.3]} />
        <meshStandardMaterial color="#26170f" roughness={0.82} />
      </mesh>
      {[0.45, 1.55, 2.65, 3.35].map((y) => (
        <mesh key={y} castShadow position={[0, y, 0.25]}>
          <boxGeometry args={[2.9, 0.16, 0.72]} />
          <meshStandardMaterial color="#4a2b18" roughness={0.72} />
        </mesh>
      ))}
      {Array.from({ length: 11 }).map((_, i) => {
        const row = i % 3;
        const col = Math.floor(i / 3);
        const x = -1.0 + row * 0.92 + ((col % 2) * 0.12);
        const y = 0.72 + col * 1.08;
        const colors = ['#7f59ce', '#4d9e84', '#a25742', '#4b6fb5', '#a78b4d'];
        return (
          <group key={i} position={[x, y, 0.55]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.16, 0.19, 0.38, 12]} />
              <meshStandardMaterial color={colors[i % colors.length]} roughness={0.3} metalness={0.05} emissive={colors[i % colors.length]} emissiveIntensity={0.08} />
            </mesh>
            <mesh position={[0, 0.24, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.14, 10]} />
              <meshStandardMaterial color="#b7a27e" roughness={0.85} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Candle({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const flame = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!flame.current) return;
    const t = state.clock.elapsedTime;
    flame.current.scale.y = 0.9 + Math.sin(t * 9 + position[0]) * 0.1;
    flame.current.position.x = Math.sin(t * 7 + position[2]) * 0.01;
  });

  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.42, 10]} />
        <meshStandardMaterial color="#d9cfb6" roughness={0.8} />
      </mesh>
      <mesh ref={flame} position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshBasicMaterial color="#ffcb66" />
      </mesh>
      <pointLight position={[0, 0.34, 0]} intensity={1.3} distance={2.6} color="#ff9d4d" />
    </group>
  );
}

function HangingHerbs() {
  return (
    <group position={[0, 4.15, -2.45]}>
      {[-1.3, -0.65, 0.15, 0.92, 1.55].map((x, i) => (
        <group key={x} position={[x, 0, i % 2 ? 0.08 : -0.05]} rotation={[0, 0, (i - 2) * 0.08]}>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.9, 6]} />
            <meshStandardMaterial color="#75604a" />
          </mesh>
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={j} position={[(j % 2 ? 1 : -1) * 0.11, -0.24 - j * 0.13, 0]} rotation={[0, 0, j % 2 ? -0.5 : 0.5]}>
              <sphereGeometry args={[0.14, 8, 6]} />
              <meshStandardMaterial color={i % 2 ? '#475f36' : '#5a4a6f'} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function MagicWindow() {
  return (
    <group position={[0, 2.65, -3.04]}>
      <mesh>
        <boxGeometry args={[2.45, 2.15, 0.18]} />
        <meshStandardMaterial color="#17101e" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[2.02, 1.72]} />
        <meshBasicMaterial color="#171237" />
      </mesh>
      <mesh position={[0.58, 0.22, 0.13]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color="#cfc3ff" />
      </mesh>
      <Sparkles position={[0, 0, 0.2]} count={24} scale={[1.8, 1.5, 0.1]} size={1.1} speed={0.12} color="#d3c8ff" />
      <pointLight position={[0, 0, 0.6]} intensity={1.1} distance={4} color="#7d6eff" />
    </group>
  );
}

function IngredientProp({ id, position, onPick }: { id: IngredientId; position: [number, number, number]; onPick: (id: IngredientId) => void }) {
  const data = INGREDIENTS.find((item) => item.id === id)!;
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.45 + position[0];
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.7 + position[0]) * 0.03;
  });

  const geometry = () => {
    if (id === 'mooncap') {
      return (
        <>
          <mesh position={[0, -0.05, 0]} castShadow><cylinderGeometry args={[0.055, 0.08, 0.27, 10]} /><meshStandardMaterial color="#d9cfbe" /></mesh>
          <mesh position={[0, 0.12, 0]} castShadow><sphereGeometry args={[0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.5} /></mesh>
        </>
      );
    }
    if (id === 'crystal') {
      return <mesh castShadow rotation={[0.1, 0, 0.15]}><octahedronGeometry args={[0.2, 0]} /><meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.7} roughness={0.18} metalness={0.15} /></mesh>;
    }
    if (id === 'mandrake') {
      return (
        <>
          <mesh castShadow><sphereGeometry args={[0.14, 12, 10]} /><meshStandardMaterial color={data.color} roughness={0.9} /></mesh>
          <mesh position={[0, 0.21, 0]} rotation={[0.25, 0, 0.4]}><cylinderGeometry args={[0.025, 0.035, 0.28, 7]} /><meshStandardMaterial color="#557842" /></mesh>
        </>
      );
    }
    if (id === 'ember') {
      return <mesh castShadow><dodecahedronGeometry args={[0.17, 0]} /><meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.75} /></mesh>;
    }
    if (id === 'frog') {
      return <mesh castShadow><sphereGeometry args={[0.16, 16, 12]} /><meshStandardMaterial color="#91d866" roughness={0.2} /><mesh position={[0.05, 0.03, 0.13]}><sphereGeometry args={[0.045, 12, 8]} /><meshBasicMaterial color="#151216" /></mesh></mesh>;
    }
    return <mesh castShadow><icosahedronGeometry args={[0.18, 1]} /><meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.45} roughness={0.55} /></mesh>;
  };

  return (
    <group
      ref={group}
      position={position}
      scale={hovered ? 1.22 : 1}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      onClick={(e) => { e.stopPropagation(); onPick(id); }}
    >
      {geometry()}
      {hovered && <pointLight intensity={1.6} distance={1.4} color={data.color} />}
    </group>
  );
}

function Cauldron({
  brew,
  heat,
  stir,
  result,
  setStir,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  result: BrewResult;
  setStir: React.Dispatch<React.SetStateAction<number>>;
}) {
  const liquid = useRef<THREE.Mesh>(null);
  const cauldron = useRef<THREE.Group>(null);
  const lastPointer = useRef<THREE.Vector2 | null>(null);
  const [stirring, setStirring] = useState(false);

  const potionColor = useMemo(() => {
    if (!brew.length) return new THREE.Color('#2d2340');
    const out = new THREE.Color('#000000');
    brew.forEach((item) => out.add(new THREE.Color(item.color)));
    out.multiplyScalar(1 / brew.length);
    return out;
  }, [brew]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (liquid.current) {
      liquid.current.rotation.z += delta * (0.15 + stir / 80);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + Math.sin(t * 2.5) * 0.08 + stir / 240;
    }
    if (cauldron.current) {
      const shake = result === 'fail' ? Math.sin(t * 38) * 0.035 : 0;
      cauldron.current.position.x = shake;
    }
  });

  const startStir = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setStirring(true);
    lastPointer.current = e.pointer.clone();
    document.body.style.cursor = 'grabbing';
  };

  const moveStir = (e: ThreeEvent<PointerEvent>) => {
    if (!stirring || !lastPointer.current) return;
    e.stopPropagation();
    const dist = e.pointer.distanceTo(lastPointer.current);
    if (dist > 0.002) {
      setStir((value) => Math.min(100, value + dist * 115));
      lastPointer.current.copy(e.pointer);
    }
  };

  const stopStir = () => {
    if (stirring) playTone(390, 0.08, 'triangle');
    setStirring(false);
    lastPointer.current = null;
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={cauldron} position={[0, 0, 0]}>
      <group position={[0, 0.9, 0]}>
        <mesh castShadow receiveShadow scale={[1.24, 0.92, 1.24]}>
          <sphereGeometry args={[0.78, 36, 24, 0, Math.PI * 2, Math.PI * 0.23, Math.PI * 0.65]} />
          <meshStandardMaterial color="#17141a" roughness={0.38} metalness={0.56} side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.09, 14, 44]} />
          <meshStandardMaterial color="#2a252c" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh
          ref={liquid}
          position={[0, 0.43, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={startStir}
          onPointerMove={moveStir}
          onPointerUp={stopStir}
          onPointerLeave={stopStir}
        >
          <circleGeometry args={[0.81, 48]} />
          <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.5} roughness={0.2} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>

        {brew.length > 0 && (
          <>
            <Sparkles position={[0, 0.68, 0]} count={20 + brew.length * 6} scale={[1.35, 0.85, 1.35]} size={2.1} speed={0.65 + stir / 100} color={potionColor} />
            {Array.from({ length: Math.min(7, 2 + brew.length) }).map((_, i) => (
              <Float key={i} speed={2 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.45}>
                <mesh position={[-0.5 + (i % 4) * 0.32, 0.62 + (i % 3) * 0.11, -0.25 + (i % 2) * 0.45]}>
                  <sphereGeometry args={[0.045 + (i % 3) * 0.012, 10, 8]} />
                  <meshBasicMaterial color={potionColor} transparent opacity={0.8} />
                </mesh>
              </Float>
            ))}
          </>
        )}

        {result === 'success' && (
          <group position={[0, 0.8, 0]}>
            <Sparkles count={100} scale={[3.1, 2.7, 3.1]} size={4.2} speed={2.1} color="#d5bdff" />
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[Math.PI / 2, i * 0.7, i * 0.4]} scale={1 + i * 0.5}>
                <torusGeometry args={[0.72, 0.025, 8, 64]} />
                <meshBasicMaterial color={i === 1 ? '#7ee9ff' : '#b996ff'} transparent opacity={0.7 - i * 0.15} />
              </mesh>
            ))}
            <pointLight intensity={8} distance={7} color="#9f7bff" />
          </group>
        )}

        {result === 'fail' && (
          <group position={[0, 0.9, 0]}>
            <Sparkles count={85} scale={[2.6, 2.4, 2.6]} size={5} speed={3} color="#5e4a5d" />
            <pointLight intensity={4} distance={5} color="#ff4d38" />
          </group>
        )}
      </group>

      {[-0.54, 0.54].map((x) => (
        <mesh key={x} castShadow position={[x, 0.3, 0]} rotation={[0, 0, x > 0 ? -0.16 : 0.16]}>
          <cylinderGeometry args={[0.09, 0.13, 0.62, 10]} />
          <meshStandardMaterial color="#1b171c" metalness={0.5} roughness={0.45} />
        </mesh>
      ))}

      <group position={[0, 0.18, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos((i / 6) * Math.PI * 2) * 0.36, 0.08 + (i % 2) * 0.06, Math.sin((i / 6) * Math.PI * 2) * 0.36]}>
            <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.04 : heat === 'medium' ? 0.02 : 0), 0]} />
            <meshBasicMaterial color={heat === 'low' ? '#7a4a2e' : heat === 'medium' ? '#ff8a3d' : '#ffcf61'} />
          </mesh>
        ))}
        <pointLight intensity={heat === 'low' ? 1.2 : heat === 'medium' ? 3.2 : 5.6} distance={4} color={heat === 'high' ? '#ffd071' : '#ff783d'} />
      </group>
    </group>
  );
}

function AlchemyTable() {
  return (
    <group position={[0, 0, 0.4]}>
      <mesh castShadow receiveShadow position={[0, 0.48, 0]}>
        <cylinderGeometry args={[2.2, 2.05, 0.28, 16]} />
        <meshStandardMaterial color="#392116" roughness={0.72} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} castShadow position={[Math.cos(i * Math.PI / 2 + 0.7) * 1.55, -0.08, Math.sin(i * Math.PI / 2 + 0.7) * 1.05]}>
          <cylinderGeometry args={[0.12, 0.15, 1.1, 9]} />
          <meshStandardMaterial color="#28170f" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function BookPile({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.25, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow position={[i * 0.03, i * 0.11, 0]} rotation={[0, i * 0.08, (i - 1) * 0.03]}>
          <boxGeometry args={[0.75 - i * 0.08, 0.1, 0.5]} />
          <meshStandardMaterial color={['#53334e', '#344a3f', '#604326'][i]} roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({
  brew,
  heat,
  stir,
  result,
  addIngredient,
  setStir,
}: {
  brew: BrewItem[];
  heat: Heat;
  stir: number;
  result: BrewResult;
  addIngredient: (id: IngredientId) => void;
  setStir: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      <color attach="background" args={['#09070d']} />
      <fog attach="fog" args={['#0b0810', 6.5, 16]} />
      <ambientLight intensity={0.2} color="#8a7ca8" />
      <directionalLight castShadow position={[4, 7, 4]} intensity={0.7} color="#d9ccff" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 5.2, 1]} intensity={2.4} distance={10} color="#7959b5" />

      <StoneFloor />
      <mesh position={[0, 2.5, -3.2]} receiveShadow>
        <boxGeometry args={[11, 5.2, 0.35]} />
        <meshStandardMaterial color="#151018" roughness={0.95} />
      </mesh>
      <mesh position={[-5.2, 2.5, -0.5]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6.4, 5.2, 0.3]} />
        <meshStandardMaterial color="#100d12" roughness={0.96} />
      </mesh>
      <mesh position={[5.2, 2.5, -0.5]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6.4, 5.2, 0.3]} />
        <meshStandardMaterial color="#100d12" roughness={0.96} />
      </mesh>

      <MagicWindow />
      <HangingHerbs />
      <WoodenShelf position={[-3.65, 0, -2.72]} side={-1} />
      <WoodenShelf position={[3.65, 0, -2.72]} side={1} />
      <Candle position={[-2.15, 0.82, 0.85]} scale={1.1} />
      <Candle position={[2.28, 0.82, 0.65]} scale={0.92} />
      <Candle position={[-4.05, 3.25, -2.13]} scale={0.76} />
      <Candle position={[4.08, 2.16, -2.13]} scale={0.82} />

      <AlchemyTable />
      <Cauldron brew={brew} heat={heat} stir={stir} result={result} setStir={setStir} />
      <BookPile position={[-1.62, 0.76, 0.75]} />

      <IngredientProp id="mooncap" position={[-3.95, 1.1, -2.06]} onPick={addIngredient} />
      <IngredientProp id="crystal" position={[-3.05, 2.18, -2.05]} onPick={addIngredient} />
      <IngredientProp id="mandrake" position={[3.32, 1.12, -2.05]} onPick={addIngredient} />
      <IngredientProp id="ember" position={[4.1, 2.2, -2.05]} onPick={addIngredient} />
      <IngredientProp id="frog" position={[-3.05, 3.28, -2.05]} onPick={addIngredient} />
      <IngredientProp id="shade" position={[3.25, 3.28, -2.05]} onPick={addIngredient} />

      <Sparkles count={78} scale={[9, 5.4, 7]} position={[0, 2.6, -0.8]} size={1.15} speed={0.12} color="#9e83c0" />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.58} scale={10} blur={2.6} far={5} />
      <CameraBreath />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6.8}
        maxDistance={10.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-0.36}
        maxAzimuthAngle={0.36}
        target={[0, 1.2, 0]}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
}

export default function PotionGame() {
  const [brew, setBrew] = useState<BrewItem[]>([]);
  const [heat, setHeat] = useState<Heat>('low');
  const [stir, setStir] = useState(0);
  const [result, setResult] = useState<BrewResult>('idle');
  const [toast, setToast] = useState('Choose ingredients from the shelves or the quick bar.');

  const addIngredient = (id: IngredientId) => {
    if (result !== 'idle') return;
    if (brew.length >= 5) {
      setToast('The cauldron is full. Brew or clear it first.');
      playTone(160, 0.12, 'square');
      return;
    }
    const item = INGREDIENTS.find((ingredient) => ingredient.id === id)!;
    setBrew((items) => [...items, { id: item.id, name: item.name, color: item.color }]);
    setToast(`${item.name} dissolves into the brew…`);
    playTone(260 + brew.length * 55, 0.11, 'sine');
  };

  const changeHeat = (value: Heat) => {
    if (result !== 'idle') return;
    setHeat(value);
    setToast(`Flame set to ${value} heat.`);
    playTone(value === 'low' ? 180 : value === 'medium' ? 240 : 320, 0.09, 'triangle');
  };

  const reset = () => {
    setBrew([]);
    setHeat('low');
    setStir(0);
    setResult('idle');
    setToast('The cauldron is clean. Begin another experiment.');
  };

  const finishBrew = () => {
    if (!brew.length) {
      setToast('The cauldron is empty. Add ingredients first.');
      return;
    }

    const exactIngredients = brew.length === recipe.ingredients.length && recipe.ingredients.every((id, index) => brew[index]?.id === id);
    const correctHeat = heat === recipe.heat;
    const enoughStir = stir >= recipe.stir;
    const success = exactIngredients && correctHeat && enoughStir;

    setResult(success ? 'success' : 'fail');
    if (success) {
      setToast(`✦ ${recipe.name} created — a perfect celestial brew.`);
      playTone(520, 0.18, 'sine');
      window.setTimeout(() => playTone(660, 0.22, 'sine'), 130);
      window.setTimeout(() => playTone(880, 0.3, 'triangle'), 260);
    } else {
      const reasons: string[] = [];
      if (!exactIngredients) reasons.push('the ingredient order feels wrong');
      if (!correctHeat) reasons.push('the flame is unbalanced');
      if (!enoughStir) reasons.push('the potion was not stirred enough');
      setToast(`The potion collapses into smoke — ${reasons.join(', ')}.`);
      playTone(105, 0.36, 'sawtooth');
    }
  };

  return (
    <main className="game-shell">
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.7]}
          camera={{ position: [0, 3.8, 8.8], fov: 48, near: 0.1, far: 40 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Scene brew={brew} heat={heat} stir={stir} result={result} addIngredient={addIngredient} setStir={setStir} />
        </Canvas>
      </div>

      <div className="vignette" />

      <section className="hud">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">✦</div>
            <div>
              <h1>Arcane Apothecary</h1>
              <p>Apprentice alchemy chamber</p>
            </div>
          </div>

          <article className="recipe-card">
            <div className="recipe-kicker">Tonight&apos;s commission</div>
            <h2 className="recipe-title">{recipe.name}</h2>
            <p className="recipe-clue">“{recipe.clue}”</p>
            <div className="recipe-meta">
              <span className="chip">3 essences</span>
              <span className="chip">steady flame</span>
              <span className="chip">stir until awakened</span>
            </div>
          </article>
        </div>

        <div className="ingredient-bar">
          {INGREDIENTS.map((ingredient) => (
            <button className="ingredient-btn" key={ingredient.id} onClick={() => addIngredient(ingredient.id)} title={`Add ${ingredient.name}`}>
              <div className="ingredient-icon" style={{ background: ingredient.icon, color: ingredient.icon }} />
              <span>{ingredient.name}</span>
            </button>
          ))}
        </div>

        <aside className="left-panel">
          <div className="panel-title"><strong>Cauldron</strong><span>{brew.length}/5</span></div>
          <div className="brew-list">
            {brew.length === 0 ? <div className="empty">No ingredients yet</div> : brew.map((item, i) => (
              <div className="brew-row" key={`${item.id}-${i}`}>
                <div className="dot" style={{ background: item.color, color: item.color }} />
                <span>{item.name}</span>
                <small>#{i + 1}</small>
              </div>
            ))}
          </div>
        </aside>

        <aside className="controls">
          <div className="controls-label">Flame control</div>
          <div className="heat-row">
            {(['low', 'medium', 'high'] as Heat[]).map((value) => (
              <button key={value} className={`heat-btn ${heat === value ? 'active' : ''}`} onClick={() => changeHeat(value)}>{value[0].toUpperCase() + value.slice(1)}</button>
            ))}
          </div>
          <div className="stir-track">
            <div className="stir-head"><span>Stirring energy</span><span>{Math.round(stir)}%</span></div>
            <div className="track"><div style={{ width: `${stir}%` }} /></div>
          </div>
          <div className="action-row">
            <button className="brew-btn" onClick={finishBrew}>BREW POTION</button>
            <button className="reset-btn" onClick={reset}>Clear</button>
          </div>
        </aside>

        <div className={`toast ${result}`}>{toast}</div>
        <div className="center-tip">Drag across the potion surface to stir · drag scene to look around · scroll to zoom</div>
      </section>
    </main>
  );
}
