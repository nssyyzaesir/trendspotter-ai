import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/** Generates points distributed on a sphere surface */
function globePoints(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.8 + (Math.random() - 0.5) * 0.04;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function GlobeMesh({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => globePoints(5000), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const [mx, my] = mouseRef.current;
    groupRef.current.rotation.y += 0.0012;
    groupRef.current.rotation.x += (my * 0.3 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y += (mx * 0.3 - groupRef.current.rotation.y) * 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Globe dots */}
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f5ff"
          size={0.012}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.75, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0x00f5ff)}
          transparent
          opacity={0.025}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.1, 0.004, 16, 200]} />
        <meshBasicMaterial color={new THREE.Color(0x8b5cf6)} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

interface GlobeSceneProps {
  className?: string;
}

export function GlobeScene({ className = "" }: GlobeSceneProps) {
  const mouseRef = useRef<[number, number]>([0, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mouseRef.current = [
      ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    ];
  };

  return (
    <div
      className={className}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00f5ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8b5cf6" />
        <GlobeMesh mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
