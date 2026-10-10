'use client';

import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

type Heat = 'low' | 'medium' | 'high';

export default function CauldronV2({ color, heat, stirring, splash }: { color: string; heat: Heat; stirring: boolean; splash: number }) {
  const liquid = useRef<THREE.Mesh>(null);
  const spoon = useRef<THREE.Group>(null);
  const runeRing = useRef<THREE.Group>(null);
  const potionColor = useMemo(() => new THREE.Color(color), [color]);
  const flame = heat === 'low' ? '#ffbf6f' : heat === 'medium' ? '#ff7d52' : '#ffd75c';

  useFrame((state, delta) => {
    if (liquid.current) {
      liquid.current.rotation.z += delta * (stirring ? 4.5 : 0.18);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.78 + Math.sin(state.clock.elapsedTime * 3.1) * 0.09 + (stirring ? 0.2 : 0);
    }
    if (spoon.current) {
      spoon.current.rotation.z = stirring ? Math.sin(state.clock.elapsedTime * 5.5) * 0.52 - 0.08 : -0.16;
      spoon.current.rotation.x = stirring ? Math.sin(state.clock.elapsedTime * 2.8) * 0.08 : 0.08;
    }
    if (runeRing.current) runeRing.current.rotation.y += delta * 0.18;
  });

  return (
    <group position={[0, -2.48, 0]}>
      {/* stone/wood hearth base */}
      <mesh receiveShadow position={[0, -0.56, 0]}>
        <cylinderGeometry args={[1.38, 1.55, 0.38, 10]} />
        <meshStandardMaterial color="#6a4736" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.08, 10, 64]} />
        <meshStandardMaterial color="#93673f" roughness={0.7} />
      </mesh>

      {/* squat cartoon cauldron body */}
      <mesh castShadow scale={[1.28, 0.82, 1.28]} position={[0, 0.48, 0]}>
        <sphereGeometry args={[1.02, 64, 42, 0, Math.PI * 2, Math.PI * 0.18, Math.PI * 0.72]} />
        <meshStandardMaterial color="#291233" roughness={0.24} metalness={0.35} />
      </mesh>

      {/* belly highlight bands */}
      <mesh position={[0, 0.5, 0.91]} scale={[0.66, 0.14, 0.06]}>
        <sphereGeometry args={[1, 28, 18]} />
        <meshBasicMaterial color="#b482c4" transparent opacity={0.16} />
      </mesh>
      <mesh position={[-0.45, 0.78, 0.92]} scale={[0.18, 0.05, 0.03]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </mesh>

      {/* chunky gold/purple rim */}
      <mesh castShadow position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.13, 22, 100]} />
        <meshStandardMaterial color="#9d65b2" roughness={0.18} metalness={0.48} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.035, 14, 100]} />
        <meshStandardMaterial color="#d2a85f" emissive="#8b5a25" emissiveIntensity={0.16} roughness={0.28} metalness={0.62} />
      </mesh>

      {/* liquid */}
      <mesh ref={liquid} position={[0, 1.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.03, 100]} />
        <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.82} roughness={0.06} transparent opacity={0.97} />
      </mesh>
      <mesh position={[0, 1.048, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.09} />
      </mesh>

      {/* curled handles */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.2, 0.58, 0]} rotation={[0, 0, side * -0.12]}>
          <mesh castShadow rotation={[0, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2]}>
            <torusGeometry args={[0.3, 0.055, 12, 40, Math.PI * 1.35]} />
            <meshStandardMaterial color="#c19a55" roughness={0.32} metalness={0.58} />
          </mesh>
          <mesh position={[side * 0.08, -0.03, 0]}>
            <sphereGeometry args={[0.09, 14, 12]} />
            <meshStandardMaterial color="#7a4c8b" roughness={0.28} metalness={0.34} />
          </mesh>
        </group>
      ))}

      {/* three feet */}
      {[-0.72, 0, 0.72].map((x, index) => (
        <mesh key={x} castShadow position={[x, -0.07, index === 1 ? -0.48 : 0.16]} rotation={[0.1, 0, x * -0.18]}>
          <cylinderGeometry args={[0.1, 0.19, 0.58, 12]} />
          <meshStandardMaterial color="#25152f" roughness={0.4} metalness={0.24} />
        </mesh>
      ))}

      {/* rotating rune band */}
      <group ref={runeRing} position={[0, 0.28, -0.02]}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.03, 0, Math.sin(a) * 1.03]} rotation={[Math.PI / 2, 0, -a]}>
              <boxGeometry args={[0.11, 0.035, 0.035]} />
              <meshBasicMaterial color="#dcb5e7" transparent opacity={0.34} />
            </mesh>
          );
        })}
      </group>

      {/* flame bed */}
      <group position={[0, -0.24, 0]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Float key={i} speed={2 + (i % 3) * 0.18} floatIntensity={0.14} rotationIntensity={0.05}>
            <mesh position={[Math.cos((i / 12) * Math.PI * 2) * 0.46, 0.06 + (i % 2) * 0.05, Math.sin((i / 12) * Math.PI * 2) * 0.34]}>
              <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.045 : heat === 'medium' ? 0.024 : 0), 0]} />
              <meshBasicMaterial color={flame} />
            </mesh>
          </Float>
        ))}
        <pointLight intensity={heat === 'low' ? 2.2 : heat === 'medium' ? 4.4 : 6.2} distance={5.8} color={flame} />
      </group>

      {/* wooden stirring spoon */}
      <group ref={spoon} position={[0.18, 1.75, 0.04]} rotation={[0.08, 0, -0.16]}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.28, 12]} />
          <meshStandardMaterial color="#9e653d" roughness={0.74} />
        </mesh>
        <mesh position={[0, -1.03, 0]} scale={[0.2, 0.3, 0.09]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#bd7d4a" roughness={0.68} />
        </mesh>
      </group>

      {/* bubbles / magic motes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <Float key={i} speed={1.1 + i * 0.045} floatIntensity={0.62} rotationIntensity={0.02}>
          <mesh position={[-0.86 + (i % 7) * 0.28, 1.18 + (i % 5) * 0.17, -0.2 + (i % 2) * 0.32]}>
            <sphereGeometry args={[0.023 + (i % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={potionColor} transparent opacity={0.72} />
          </mesh>
        </Float>
      ))}

      {splash > 0 && (
        <group key={splash} position={[0, 1.08, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={1 + i * 0.22}>
              <torusGeometry args={[0.46, 0.018, 8, 72]} />
              <meshBasicMaterial color={potionColor} transparent opacity={0.44 - i * 0.08} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
