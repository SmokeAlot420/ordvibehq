import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// CH4 Molecule Component
function CH4Molecule({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Carbon atom (center) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#404040" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Hydrogen atoms */}
      <mesh position={[0.6, 0.6, 0.6]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[-0.6, -0.6, 0.6]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[0.6, -0.6, -0.6]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[-0.6, 0.6, -0.6]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.6} />
      </mesh>
      
      {/* Bonds */}
      <mesh position={[0.3, 0.3, 0.3]} rotation={[Math.PI/4, Math.PI/4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[-0.3, -0.3, 0.3]} rotation={[-Math.PI/4, -Math.PI/4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.3, -0.3, -0.3]} rotation={[Math.PI/4, -Math.PI/4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[-0.3, 0.3, -0.3]} rotation={[-Math.PI/4, Math.PI/4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 15;
    positions[i + 2] = (Math.random() - 0.5) * 15;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff6b35" size={0.1} sizeAttenuation />
    </points>
  );
}

// Main 3D Scene
function MolecularScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b35" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* CH4 Molecules */}
      <CH4Molecule position={[-3, 2, -2]} scale={0.8} />
      <CH4Molecule position={[4, -1, 1]} scale={0.6} />
      <CH4Molecule position={[-2, -3, 3]} scale={0.7} />
      <CH4Molecule position={[3, 3, -3]} scale={0.9} />
      <CH4Molecule position={[0, 0, 4]} scale={0.5} />
    </>
  );
}

const Index = () => {
  const [wallet, setWallet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Wallet submitted:", wallet);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
        >
          <MolecularScene />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Main mysterious line */}
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            <div className="inline-block relative">
              {/* Custom minimal test tube */}
              <div className="w-8 h-16 md:w-12 md:h-20 border-2 border-emerald-400 rounded-b-full mx-auto relative">
                <div className="absolute bottom-0 left-0 right-0 h-6 md:h-8 bg-emerald-400/30 rounded-b-full"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-emerald-400"></div>
              </div>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 font-mono">
            alkanes.experiment( )
          </p>

          {/* Wallet Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter taproot address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 backdrop-blur-sm"
            />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-semibold"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
