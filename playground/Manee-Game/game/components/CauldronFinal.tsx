'use client';

import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

type Heat = 'low' | 'medium' | 'high';

export default function CauldronFinal({
  color,
  heat,
  stirring,
  splash,
  reacting = false,
}: {
  color: string;
  heat: Heat;
  stirring: boolean;
  splash: number;
  reacting?: boolean;
}) {
  const liquid = useRef<THREE.Mesh>(null);
  const innerLiquid = useRef<THREE.Mesh>(null);
  const spoon = useRef<THREE.Group>(null);
  const runeRing = useRef<THREE.Group>(null);
  const runeRing2 = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const potionColor = useMemo(() => new THREE.Color(color), [color]);
  const flame = heat === 'low' ? '#ffbd70' : heat === 'medium' ? '#ff7c54' : '#ffd45f';

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (liquid.current) {
      liquid.current.rotation.z += delta * (stirring ? 5.2 : reacting ? 2.2 : 0.2);
      const mat = liquid.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.78 + Math.sin(t * 3.1) * 0.08 + (stirring ? 0.22 : 0) + (reacting ? 0.32 : 0);
    }
    if (innerLiquid.current) {
      innerLiquid.current.rotation.z -= delta * (stirring ? 3.4 : reacting ? 1.6 : 0.12);
      const s = 1 + Math.sin(t * (reacting ? 7 : 2.2)) * (reacting ? 0.045 : 0.012);
      innerLiquid.current.scale.setScalar(s);
    }
    if (spoon.current) {
      spoon.current.visible = !reacting;
      spoon.current.rotation.z = stirring ? Math.sin(t * 5.6) * 0.52 - 0.08 : -0.16;
      spoon.current.rotation.x = stirring ? Math.sin(t * 2.8) * 0.08 : 0.08;
    }
    if (runeRing.current) runeRing.current.rotation.y += delta * (reacting ? 1.15 : 0.16);
    if (runeRing2.current) runeRing2.current.rotation.y -= delta * (reacting ? 0.78 : 0.1);
    if (body.current) {
      body.current.position.x = reacting ? Math.sin(t * 22) * 0.012 : THREE.MathUtils.lerp(body.current.position.x, 0, 0.12);
      body.current.rotation.z = reacting ? Math.sin(t * 17) * 0.006 : THREE.MathUtils.lerp(body.current.rotation.z, 0, 0.12);
    }
  });

  return (
    <group position={[0, -2.72, 0]} scale={0.97}>
      <group ref={body}>
        <mesh receiveShadow position={[0, -0.53, 0]}>
          <cylinderGeometry args={[1.34, 1.57, 0.4, 12]} />
          <meshStandardMaterial color="#694536" roughness={0.92} />
        </mesh>
        <mesh position={[0, -0.31, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.23, 0.075, 10, 64]} />
          <meshStandardMaterial color="#9b7145" roughness={0.72} />
        </mesh>

        <mesh castShadow scale={[1.33, 0.8, 1.33]} position={[0, 0.46, 0]}>
          <sphereGeometry args={[1.03, 64, 44, 0, Math.PI * 2, Math.PI * 0.17, Math.PI * 0.73]} />
          <meshStandardMaterial color="#281130" roughness={0.21} metalness={0.38} />
        </mesh>
        <mesh position={[0, 0.5, 0.95]} scale={[0.7, 0.14, 0.055]}>
          <sphereGeometry args={[1, 28, 18]} />
          <meshBasicMaterial color="#c18bd3" transparent opacity={0.15} />
        </mesh>
        <mesh position={[-0.48, 0.78, 0.95]} scale={[0.2, 0.055, 0.025]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.24} />
        </mesh>

        <mesh castShadow position={[0, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.14, 22, 100]} />
          <meshStandardMaterial color="#8e5aa5" roughness={0.15} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.225, 0.038, 14, 100]} />
          <meshStandardMaterial color="#d3a85e" emissive="#855421" emissiveIntensity={0.18} roughness={0.27} metalness={0.65} />
        </mesh>

        <mesh ref={liquid} position={[0, 1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 100]} />
          <meshStandardMaterial color={potionColor} emissive={potionColor} emissiveIntensity={0.82} roughness={0.04} transparent opacity={0.98} />
        </mesh>
        <mesh ref={innerLiquid} position={[0, 1.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.92, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={reacting ? 0.13 : 0.075} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.28, 0.56, 0]} rotation={[0, 0, side * -0.1]}>
            <mesh castShadow rotation={[0, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2]}>
              <torusGeometry args={[0.31, 0.06, 12, 44, Math.PI * 1.36]} />
              <meshStandardMaterial color="#c59a50" roughness={0.3} metalness={0.62} />
            </mesh>
            <mesh position={[side * 0.08, -0.03, 0]}>
              <sphereGeometry args={[0.095, 14, 12]} />
              <meshStandardMaterial color="#7b4d8d" roughness={0.28} metalness={0.36} />
            </mesh>
          </group>
        ))}

        {[-0.78, 0, 0.78].map((x, index) => (
          <mesh key={x} castShadow position={[x, -0.06, index === 1 ? -0.48 : 0.17]} rotation={[0.1, 0, x * -0.17]}>
            <cylinderGeometry args={[0.1, 0.2, 0.6, 12]} />
            <meshStandardMaterial color="#25142f" roughness={0.42} metalness={0.25} />
          </mesh>
        ))}
      </group>

      <group ref={runeRing} position={[0, 0.26, -0.03]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05]} rotation={[Math.PI / 2, 0, -a]}>
              <boxGeometry args={[0.12, 0.035, 0.035]} />
              <meshBasicMaterial color={potionColor} transparent opacity={reacting ? 0.72 : 0.28} />
            </mesh>
          );
        })}
      </group>
      <group ref={runeRing2} position={[0, 1.0, -0.02]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.72, 0, Math.sin(a) * 0.72]} rotation={[Math.PI / 2, 0, -a]}>
              <tetrahedronGeometry args={[0.055, 0]} />
              <meshBasicMaterial color="#fff4ff" transparent opacity={reacting ? 0.85 : 0.16} />
            </mesh>
          );
        })}
      </group>

      <group position={[0, -0.23, 0]}>
        {Array.from({ length: 14 }).map((_, i) => (
          <Float key={i} speed={2 + (i % 3) * 0.18} floatIntensity={0.15} rotationIntensity={0.05}>
            <mesh position={[Math.cos((i / 14) * Math.PI * 2) * 0.48, 0.06 + (i % 2) * 0.055, Math.sin((i / 14) * Math.PI * 2) * 0.35]}>
              <dodecahedronGeometry args={[0.09 + (heat === 'high' ? 0.05 : heat === 'medium' ? 0.026 : 0), 0]} />
              <meshBasicMaterial color={flame} />
            </mesh>
          </Float>
        ))}
        <pointLight intensity={heat === 'low' ? 2.3 : heat === 'medium' ? 4.6 : 6.5} distance={5.8} color={flame} />
      </group>

      <group ref={spoon} position={[0.18, 1.76, 0.04]} rotation={[0.08, 0, -0.16]}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.28, 12]} />
          <meshStandardMaterial color="#9e653d" roughness={0.74} />
        </mesh>
        <mesh position={[0, -1.03, 0]} scale={[0.2, 0.3, 0.09]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#bd7d4a" roughness={0.68} />
        </mesh>
      </group>

      {Array.from({ length: reacting ? 32 : 18 }).map((_, i) => (
        <Float key={i} speed={1.1 + i * 0.035} floatIntensity={reacting ? 0.85 : 0.62} rotationIntensity={0.03}>
          <mesh position={[-0.9 + (i % 8) * 0.26, 1.17 + (i % 6) * 0.16, -0.24 + (i % 3) * 0.24]}>
            <sphereGeometry args={[0.022 + (i % 3) * 0.012, 10, 8]} />
            <meshBasicMaterial color={i % 5 === 0 ? '#fff7ff' : potionColor} transparent opacity={reacting ? 0.86 : 0.7} />
          </mesh>
        </Float>
      ))}

      {reacting && (
        <>
          <pointLight position={[0, 1.2, 0]} intensity={4.8} distance={5.2} color={potionColor} />
          <group position={[0, 1.1, 0]}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={1 + i * 0.32}>
                <torusGeometry args={[0.52, 0.018, 8, 72]} />
                <meshBasicMaterial color={potionColor} transparent opacity={0.52 - i * 0.11} />
              </mesh>
            ))}
          </group>
        </>
      )}

      {splash > 0 && (
        <group key={splash} position={[0, 1.08, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={1 + i * 0.23}>
              <torusGeometry args={[0.46, 0.018, 8, 72]} />
              <meshBasicMaterial color={potionColor} transparent opacity={0.48 - i * 0.085} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
