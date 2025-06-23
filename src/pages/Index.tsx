import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const Index = () => {
  const [wallet, setWallet] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Wallet submitted:", wallet);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Create flowing highway tunnel
    const createHighwayTunnel = () => {
      const geometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(5, 2, -10),
          new THREE.Vector3(-3, -1, -20),
          new THREE.Vector3(2, 3, -30),
          new THREE.Vector3(-4, -2, -40),
          new THREE.Vector3(3, 1, -50),
        ]),
        100, // tubularSegments
        2,   // radius
        8,   // radialSegments
        false // closed
      );

      // Main tunnel material with glowing effect
      const tunnelMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });

      const tunnel = new THREE.Mesh(geometry, tunnelMaterial);
      scene.add(tunnel);

      // Create flowing lines along the tunnel
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = [];
      const lineColors = [];
      
      for (let i = 0; i < 200; i++) {
        const t = i / 200;
        const point = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(5, 2, -10),
          new THREE.Vector3(-3, -1, -20),
          new THREE.Vector3(2, 3, -30),
          new THREE.Vector3(-4, -2, -40),
          new THREE.Vector3(3, 1, -50),
        ]).getPoint(t);

        // Create multiple lines around the tunnel
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const radius = 2.2;
          const x = point.x + Math.cos(angle) * radius;
          const y = point.y + Math.sin(angle) * radius;
          const z = point.z;

          linePositions.push(x, y, z);
          
          // Color gradient from orange to cyan
          const intensity = Math.sin(t * Math.PI * 3 + j) * 0.5 + 0.5;
          lineColors.push(
            1.0 * intensity,      // R
            0.4 + 0.6 * intensity, // G  
            0.1 + 0.4 * intensity  // B
          );
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const flowingLines = new THREE.Points(lineGeometry, lineMaterial);
      scene.add(flowingLines);

      return { tunnel, flowingLines };
    };

    // Create particle system
    const createParticles = () => {
      const particleCount = 1000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = Math.random() * -50;

        // Orange to cyan gradient
        const intensity = Math.random();
        colors[i * 3] = 1.0 * intensity;
        colors[i * 3 + 1] = 0.4 + 0.6 * intensity;
        colors[i * 3 + 2] = 0.1 + 0.4 * intensity;

        sizes[i] = Math.random() * 0.03 + 0.01;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          uniform float time;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.3);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            float alpha = 1.0 - (distance * 2.0);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      return new THREE.Points(geometry, material);
    };

    // Setup scene objects
    const { tunnel, flowingLines } = createHighwayTunnel();
    const particles = createParticles();
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff6b35, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 0.8, 50);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    // Camera positioning
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, -10);

    // GSAP Animations
    const tl = gsap.timeline({ repeat: -1 });
    
    // Camera movement through tunnel
    tl.to(camera.position, {
      duration: 20,
      z: -45,
      ease: "none"
    })
    .to(camera.position, {
      duration: 0.1,
      z: 5,
      ease: "none"
    });

    // Tunnel rotation
    gsap.to(tunnel.rotation, {
      duration: 30,
      z: Math.PI * 2,
      repeat: -1,
      ease: "none"
    });

    // Flowing lines animation
    gsap.to(flowingLines.rotation, {
      duration: 15,
      z: -Math.PI * 2,
      repeat: -1,
      ease: "none"
    });

    // Particle animation
    const particleMaterial = particles.material as THREE.ShaderMaterial;
    gsap.to(particleMaterial.uniforms.time, {
      duration: 10,
      value: Math.PI * 2,
      repeat: -1,
      ease: "none"
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.1;
        if (positions[i + 2] > 5) {
          positions[i + 2] = -50;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      gsap.killTweensOf([camera.position, tunnel.rotation, flowingLines.rotation, particleMaterial.uniforms.time]);
      
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Three.js Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
      />

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
