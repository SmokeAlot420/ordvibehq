import { useEffect, useRef, useState } from 'react';

interface PremiumTextProps {
  text: string;
  className?: string;
}

export default function PremiumText({ text, className = '' }: PremiumTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number>();
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Subtle matrix rain
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
    
    // ASCII characters for subtle effect
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    const drawMatrix = () => {
      // Very subtle fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      ctx.font = '14px monospace';
      
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        
        // Ultra-subtle white/gray gradient based on position
        const opacity = Math.max(0, Math.min(0.15, (1 - y / canvas.height) * 0.15));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        ctx.fillText(char, x, y);
        
        // Reset drop when it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Vary the speed
        drops[i] += 0.5 + Math.random() * 0.5;
      });

      animationFrameRef.current = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    // Mouse tracking for interactive glow
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Matrix rain canvas - very subtle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        style={{ filter: 'blur(1px)' }}
      />
      
      {/* Glass backdrop for legibility */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg" />
      
      {/* The main text */}
      <h2 
        className={`
          relative z-10 
          font-['Space_Grotesk'] font-bold tracking-wider
          whitespace-nowrap
          px-8 py-4
          premium-text
          ${isHovered ? 'premium-text-hover' : ''}
        `}
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          letterSpacing: '0.1em'
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block premium-letter"
            style={{
              animationDelay: `${i * 0.02}s`,
              '--char-index': i
            } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>
      
      {/* Subtle holographic overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <div className="holographic-effect" />
      </div>
      
      {/* Premium edge glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="premium-glow" />
      </div>
    </div>
  );
}