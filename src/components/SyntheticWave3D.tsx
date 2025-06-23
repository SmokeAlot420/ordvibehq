import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import { OrbitControls } from '@react-three/drei';

// Vertex shader with sine wave displacement and Perlin noise
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vDisplacement;
  
  // Simple 3D Perlin noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    
    // Create wave displacement
    float waveX = sin(position.x * 2.0 + uTime * 2.0) * 0.1;
    float waveY = sin(position.y * 3.0 + uTime * 1.5) * 0.1;
    
    // Add Perlin noise for organic movement
    float noise = snoise(vec2(position.x * 0.5 + uTime * 0.3, position.y * 0.5)) * 0.2;
    
    // Mouse interaction
    vec2 mouseEffect = (uMouse - 0.5) * 0.3;
    float mouseDistance = distance(uv, vec2(0.5 + mouseEffect.x, 0.5 + mouseEffect.y));
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * 0.3;
    
    // Combine displacements
    vDisplacement = waveX + waveY + noise + mouseInfluence;
    
    vec3 newPosition = position;
    newPosition.z += vDisplacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader with gradient coloring
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vDisplacement;
  
  void main() {
    // Create gradient from orange to cyan
    vec3 color1 = vec3(1.0, 0.42, 0.21); // #ff6b35
    vec3 color2 = vec3(0.0, 0.83, 1.0);  // #00d4ff
    
    // Use displacement and UV to create dynamic gradient
    float mixFactor = vUv.x + vDisplacement * 0.5 + sin(uTime * 0.5) * 0.1;
    vec3 color = mix(color1, color2, mixFactor);
    
    // Add some brightness variation based on displacement
    color += vDisplacement * 0.3;
    
    // Add subtle shimmer effect
    float shimmer = sin(vUv.x * 50.0 + uTime * 3.0) * sin(vUv.y * 50.0 + uTime * 2.0) * 0.05;
    color += shimmer;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Wave mesh component
function WaveMesh() {
  const meshRef = useRef<Mesh>(null);
  const mouseRef = useRef(new Vector2(0.5, 0.5));
  
  // Create shader material with uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) }
    }),
    []
  );
  
  // Handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    mouseRef.current.x = event.clientX / window.innerWidth;
    mouseRef.current.y = 1.0 - event.clientY / window.innerHeight;
  };
  
  // Set up mouse listener
  useMemo(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse movement
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.1;
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} scale={[4, 4, 1]}>
      <planeGeometry args={[5, 5, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={false}
      />
    </mesh>
  );
}

// Main component
export default function SyntheticWave3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <WaveMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}