import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Float, Trail } from '@react-three/drei';
import * as THREE from 'three';

function Particle({ index, totalParticles }: { index: number; totalParticles: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  
  const { angle, speed, delay, radius } = useMemo(() => ({
    angle: (index / totalParticles) * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.5,
    delay: Math.random() * Math.PI * 2,
    radius: 0.5 + Math.random() * 0.5
  }), [index, totalParticles]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const t = state.clock.elapsedTime * speed + delay;
    const distance = (t % 10) * 2;
    
    ref.current.position.x = Math.cos(angle) * distance * radius;
    ref.current.position.z = Math.sin(angle) * distance * radius;
    ref.current.position.y = Math.sin(t * 2) * 0.3;
    
    const scale = Math.min(distance * 0.3, 2);
    ref.current.scale.setScalar(scale);
    
    const opacity = distance < 2 ? distance / 2 : distance > 18 ? (20 - distance) / 2 : 1;
    if (ref.current.material && 'opacity' in ref.current.material) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
    }
  });

  return (
    <Trail
      width={2}
      length={8}
      color={new THREE.Color(index % 2 === 0 ? '#ff6b35' : '#00d4ff')}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={index % 2 === 0 ? '#ff6b35' : '#00d4ff'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </Trail>
  );
}

function TunnelRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, 0, -i * 2]}>
          <torusGeometry args={[3 + i * 0.5, 0.02, 8, 64]} />
          <meshBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={0.3 - i * 0.01}
          />
        </mesh>
      ))}
    </group>
  );
}

function EnergyBeam({ angle, offset }: { angle: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!ref.current || !materialRef.current) return;
    
    const t = state.clock.elapsedTime + offset;
    ref.current.position.x = Math.cos(angle) * 2 * Math.sin(t * 0.5);
    ref.current.position.z = Math.sin(angle) * 2 * Math.sin(t * 0.5);
    
    materialRef.current.uniforms.time.value = t;
  });

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#ff6b35') },
        color2: { value: new THREE.Color('#00d4ff') }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float gradient = sin(vPosition.z * 0.5 + time * 2.0) * 0.5 + 0.5;
          vec3 color = mix(color1, color2, gradient);
          float alpha = (1.0 - vUv.y) * 0.8;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} material={shaderMaterial}>
        <planeGeometry args={[0.1, 20]} />
        <primitive object={shaderMaterial} ref={materialRef} />
      </mesh>
    </Float>
  );
}

function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    if (!cameraRef.current) return;
    
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.1) * 0.5;
    state.camera.position.y = Math.cos(t * 0.1) * 0.5;
    state.camera.lookAt(0, 0, -10);
  });

  return (
    <>
      <fog attach="fog" args={['#000000', 5, 30]} />
      
      <TunnelRings />
      
      {Array.from({ length: 200 }, (_, i) => (
        <Particle key={i} index={i} totalParticles={200} />
      ))}
      
      {Array.from({ length: 8 }, (_, i) => (
        <EnergyBeam 
          key={i} 
          angle={(i / 8) * Math.PI * 2} 
          offset={i * 0.5}
        />
      ))}
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={2}
          radius={0.8}
        />
        <ChromaticAberration 
          offset={[0.001, 0.001]}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}

export default function HighwayTunnel3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}