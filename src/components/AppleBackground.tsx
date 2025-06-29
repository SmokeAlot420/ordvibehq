import { useEffect, useRef } from 'react';

export default function AppleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Gradient colors - Apple style
    const colors = [
      'rgba(255, 107, 53, 0.03)',  // Orange
      'rgba(0, 212, 255, 0.03)',    // Cyan
      'rgba(255, 107, 53, 0.02)',   // Orange lighter
      'rgba(0, 212, 255, 0.02)',    // Cyan lighter
    ];

    // Initialize particles
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 200 + 100,
        life: Math.random(),
        maxLife: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / rect.width;
      mouseRef.current.y = e.clientY / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Create subtle gradient background
      const bgGradient = ctx.createRadialGradient(
        rect.width * mouseRef.current.x,
        rect.height * mouseRef.current.y,
        0,
        rect.width * 0.5,
        rect.height * 0.5,
        rect.width * 0.8
      );
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update life
        particle.life += 0.01;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
        }

        // Smooth movement with mouse influence
        const dx = mouseRef.current.x * rect.width - particle.x;
        const dy = mouseRef.current.y * rect.height - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          particle.vx += dx * 0.00001;
          particle.vy += dy * 0.00001;
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around screen
        if (particle.x < -particle.size) particle.x = rect.width + particle.size;
        if (particle.x > rect.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = rect.height + particle.size;
        if (particle.y > rect.height + particle.size) particle.y = -particle.size;

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        const opacity = lifeRatio < 0.1 ? lifeRatio * 10 : 
                       lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1;

        // Draw particle as gradient circle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        
        const baseColor = index % 2 === 0 ? 
          `rgba(255, 107, 53, ${opacity * 0.05})` : 
          `rgba(0, 212, 255, ${opacity * 0.05})`;
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.5, baseColor.replace('0.05', '0.02'));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw subtle mesh gradient overlay
      for (let i = 0; i < 3; i++) {
        const time = Date.now() * 0.0001;
        const x = rect.width * (0.5 + Math.sin(time + i) * 0.3);
        const y = rect.height * (0.5 + Math.cos(time + i) * 0.3);
        
        const meshGradient = ctx.createRadialGradient(x, y, 0, x, y, rect.width * 0.4);
        meshGradient.addColorStop(0, `rgba(255, 107, 53, ${0.02 - i * 0.005})`);
        meshGradient.addColorStop(0.5, `rgba(0, 212, 255, ${0.01 - i * 0.003})`);
        meshGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = meshGradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom, #000000, #0a0a0a)',
        opacity: 1,
      }}
    />
  );
}