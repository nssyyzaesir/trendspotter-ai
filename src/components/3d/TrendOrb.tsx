import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface TrendOrbMeshProps {
  trendScore: number; // 0-100
  size?: number;
}

function OrbMesh({ trendScore, size = 1 }: TrendOrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Cor lerp: azul (0) → laranja (50) → vermelho (100)
  const color = useMemo(() => {
    const t = trendScore / 100;
    if (t < 0.5) {
      return new THREE.Color().lerpColors(
        new THREE.Color("#4f87ff"), // azul
        new THREE.Color("#ff8c00"), // laranja
        t * 2
      );
    }
    return new THREE.Color().lerpColors(
      new THREE.Color("#ff8c00"), // laranja
      new THREE.Color("#ff1744"), // vermelho
      (t - 0.5) * 2
    );
  }, [trendScore]);

  // Frequência de pulso proporcional ao score
  const pulseFreq = 0.5 + (trendScore / 100) * 2; // 0.5 Hz a 2.5 Hz

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * pulseFreq * Math.PI * 2) * 0.08 + 1;
    meshRef.current.scale.setScalar(pulse * size);
    materialRef.current.emissiveIntensity = 0.3 + Math.sin(t * pulseFreq * Math.PI * 2) * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </Sphere>
  );
}

interface TrendOrbProps {
  trendScore: number;
  size?: number;
  className?: string;
}

function TrendOrbFallback({ trendScore }: { trendScore: number }) {
  const hue = trendScore < 50 ? 220 + (trendScore / 50) * 20 : 30 - ((trendScore - 50) / 50) * 30;
  return (
    <div
      className="rounded-full animate-pulse"
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at 35% 35%, hsl(${hue}, 90%, 70%), hsl(${hue}, 80%, 40%))`,
        boxShadow: `0 0 40px hsl(${hue}, 80%, 50% / 0.6)`,
      }}
    />
  );
}

/**
 * TrendOrb — Esfera 3D com Three.js que pulsa conforme o trend_score.
 * Degrada graciosamente para um div animado se Three.js não estiver disponível.
 */
export function TrendOrb({ trendScore, size = 1, className = "" }: TrendOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pausa o render quando fora da tela (Intersection Observer)
  const pausedRef = useRef(false);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ aspectRatio: "1" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        fallback={<TrendOrbFallback trendScore={trendScore} />}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#7c6fff" />
        <OrbMesh trendScore={trendScore} size={size} />
      </Canvas>
    </div>
  );
}
