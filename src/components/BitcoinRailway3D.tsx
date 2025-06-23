import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Trail, Float, MeshTransmissionMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, MotionBlur, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Bitcoin Block Component with glowing effects
function BitcoinBlock({ position, speed, delay, index }: { position: [number, number, number]; speed: number; delay: number; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh[]>([]);
  const glowRef = useRef<THREE.PointLight>(null);
  
  // Animated position along the track
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.getElapsedTime() * speed + delay;
      const t = (time % 10) / 10; // Loop every 10 seconds
      
      // Curved railway path
      const pathRadius = 15;
      const angle = t * Math.PI * 2;
      const x = Math.cos(angle) * pathRadius;
      const z = Math.sin(angle) * pathRadius;
      const y = Math.sin(t * Math.PI * 4) * 2 + position[1]; // Vertical oscillation
      
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
      
      // Update glow position
      glowRef.current.position.copy(meshRef.current.position);
      
      // Pulsing scale effect
      const scale = 1 + Math.sin(time * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Create hash pattern texture
  const hashTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Bitcoin orange accent
    ctx.fillStyle = '#f7931a';
    ctx.fillRect(0, 0, 256, 4);
    ctx.fillRect(0, 252, 256, 4);
    
    // Hash pattern
    ctx.font = '12px monospace';
    ctx.fillStyle = '#f7931a';
    for (let i = 0; i < 16; i++) {
      const hash = Math.random().toString(36).substring(2, 8);
      ctx.fillText(hash, (i % 4) * 64 + 10, Math.floor(i / 4) * 64 + 128);
    }
    
    // BTC Logo
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#f7931a';
    ctx.textAlign = 'center';
    ctx.fillText('₿', 128, 140);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          map={hashTexture}
          emissive="#f7931a"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glowing point light */}
      <pointLight
        ref={glowRef}
        color="#f7931a"
        intensity={2}
        distance={5}
      />
      
      {/* Particle trail */}
      <BitcoinTrail targetRef={meshRef} />
    </>
  );
}

// Particle trail effect
function BitcoinTrail({ targetRef }: { targetRef: React.RefObject<THREE.Mesh> }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Orange to yellow gradient
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.1;
      
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame(() => {
    if (particlesRef.current && targetRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const targetPos = targetRef.current.position;
      
      // Update particles to follow the block
      for (let i = particleCount - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3] + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1] + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2] + (Math.random() - 0.5) * 0.2;
      }
      
      // First particle follows the block
      positions[0] = targetPos.x;
      positions[1] = targetPos.y;
      positions[2] = targetPos.z;
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Railway track component
function RailwayTrack() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Create circular railway track
    const curve = new THREE.EllipseCurve(
      0, 0,
      15, 15,
      0, 2 * Math.PI,
      false,
      0
    );
    
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    
    // Main track
    const track = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: '#444444', linewidth: 3 })
    );
    
    // Glowing track overlay
    const glowTrack = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ 
        color: '#f7931a', 
        linewidth: 1,
        transparent: true,
        opacity: 0.5
      })
    );
    
    scene.add(track);
    scene.add(glowTrack);
    
    return () => {
      scene.remove(track);
      scene.remove(glowTrack);
    };
  }, [scene]);
  
  return null;
}

// Speed lines effect
function SpeedLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <group ref={linesRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 20;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <boxGeometry args={[0.1, 0.1, 50]} />
            <meshBasicMaterial 
              color="#f7931a" 
              transparent 
              opacity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main scene component
function Scene() {
  // Create multiple blocks with different properties
  const blocks = useMemo(() => 
    Array.from({ length: 8 }).map((_, i) => ({
      position: [0, 0, 0] as [number, number, number],
      speed: 0.3 + Math.random() * 0.4,
      delay: (i / 8) * 10,
      index: i
    })), []
  );
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
      
      {/* Railway track */}
      <RailwayTrack />
      
      {/* Bitcoin blocks */}
      {blocks.map((block, i) => (
        <BitcoinBlock key={i} {...block} />
      ))}
      
      {/* Speed lines */}
      <SpeedLines />
      
      {/* Title */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 5, 0]}
          fontSize={1.5}
          color="#f7931a"
          anchorX="center"
          anchorY="middle"
          font="/Inter-Bold.woff"
        >
          BITCOIN HIGHWAY
        </Text>
      </Float>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
          radius={0.8}
        />
        <MotionBlur 
          samples={8}
          factor={0.3}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
      </EffectComposer>
    </>
  );
}

// Main component
export default function BitcoinRailway3D() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 10, 25], fov: 60 }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 20, 50]} />
        <Scene />
      </Canvas>
    </div>
  );
}