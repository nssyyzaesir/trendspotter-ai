import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 500;
const FPS_CHECK_INTERVAL = 3000; // ms
const FPS_THRESHOLD = 30;

function ParticleSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Posições e velocidades iniciais
  const particles = useMemo(() => {
    const count = PARTICLE_COUNT;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() * 0.01) + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return { pos, vel };
  }, []);

  const { pos, vel } = particles;
  const disabledRef = useRef(false);
  const frameCount = useRef(0);
  const lastCheck = useRef(Date.now());

  useFrame(() => {
    if (disabledRef.current || !meshRef.current) return;

    // Verificar FPS a cada 3s
    frameCount.current++;
    const now = Date.now();
    if (now - lastCheck.current > FPS_CHECK_INTERVAL) {
      const fps = (frameCount.current / (now - lastCheck.current)) * 1000;
      if (fps < FPS_THRESHOLD) {
        disabledRef.current = true; // desabilitar se FPS baixo
        return;
      }
      frameCount.current = 0;
      lastCheck.current = now;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];

      // Reset quando sai da tela (loop)
      if (pos[i * 3 + 1] > 10) {
        pos[i * 3 + 1] = -10;
        pos[i * 3] = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      dummy.scale.setScalar(Math.random() * 0.03 + 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshBasicMaterial color="#7c6fff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

interface DataParticlesProps {
  className?: string;
}

/**
 * DataParticles — 500 partículas de baixo polycount fluindo pelo fundo.
 * Desabilita automaticamente se FPS < 30 (degradação graciosa).
 */
export function DataParticles({ className = "" }: DataParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        dpr={[0.5, 1]} // Render a metade da resolução para melhor performance
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
