"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

// ---- Thyroid "butterfly" gland: two lobes + isthmus, softly pulsing ----
function ThyroidGland() {
  const group = useRef<THREE.Group>(null);
  const leftLobe = useRef<THREE.Mesh>(null);
  const rightLobe = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.position.y = Math.sin(t * 0.4) * 0.15;
    }
    const pulse = 1 + Math.sin(t * 0.8) * 0.03;
    leftLobe.current?.scale.setScalar(pulse);
    rightLobe.current?.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <mesh ref={leftLobe} position={[-0.62, 0.05, 0]} rotation={[0.3, 0.4, 0.2]}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <MeshDistortMaterial
          color="#0f8a86"
          emissive="#0b5563"
          emissiveIntensity={0.4}
          distort={0.28}
          speed={1.1}
          roughness={0.25}
          metalness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh ref={rightLobe} position={[0.62, -0.05, 0]} rotation={[-0.2, -0.35, -0.15]}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <MeshDistortMaterial
          color="#14b8a6"
          emissive="#6366f1"
          emissiveIntensity={0.3}
          distort={0.25}
          speed={0.9}
          roughness={0.25}
          metalness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* isthmus connecting the two lobes */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.14, 0.5, 8, 16]} />
        <MeshDistortMaterial
          color="#5eead4"
          emissive="#14b8a6"
          emissiveIntensity={0.35}
          distort={0.2}
          speed={1}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// ---- Orbiting SHAP-style data nodes with connecting lines ----
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function DataNodeField() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const rand = seededRandom(7);
    return Array.from({ length: 34 }, () => {
      const radius = 2.3 + rand() * 1.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      return {
        pos: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) * 0.6,
          radius * Math.cos(phi)
        ),
        scale: 0.02 + rand() * 0.035,
        speed: 0.15 + rand() * 0.25,
        offset: rand() * Math.PI * 2,
        color: rand() > 0.5 ? "#5eead4" : "#a5b4fc",
      };
    });
  }, []);

  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 1.3) pairs.push([i, j]);
      }
    }
    return pairs;
  }, [nodes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          points={[nodes[a].pos, nodes[b].pos]}
          color="#14b8a6"
          transparent
          opacity={0.12}
          lineWidth={0.6}
        />
      ))}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.scale, 10, 10]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 3]} intensity={22} color="#14b8a6" distance={12} />
      <pointLight position={[-3, -2, -2]} intensity={16} color="#6366f1" distance={12} />
      <pointLight position={[0, 3, -3]} intensity={10} color="#5eead4" distance={14} />
    </>
  );
}

export function ThyroidScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.6]}
      >
        <Suspense fallback={null}>
          <Lights />
          <ThyroidGland />
          <DataNodeField />
        </Suspense>
      </Canvas>
    </div>
  );
}
