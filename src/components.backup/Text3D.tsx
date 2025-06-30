import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function TextMesh() {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <Text
        ref={textRef}
        fontSize={1}
        font="/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        OrdVibeHQ
        <meshStandardMaterial 
          color="white"
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={1}
          emissive="white"
          emissiveIntensity={0.1}
        />
      </Text>
    </Float>
  );
}

export default function Text3D() {
  return (
    <div style={{ height: '150px', width: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[10, -10, -10]} intensity={0.5} color="#ff6b35" />
        
        <Suspense fallback={null}>
          <TextMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}