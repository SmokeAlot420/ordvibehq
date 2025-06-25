import { useEffect, useRef, useState } from 'react';

interface ChemistryTextProps {
  text: string;
  className?: string;
}

export default function ChemistryText({ text, className = '' }: ChemistryTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating chemical formula particles
    const formulas = ['CH₄', 'H₂O', 'CO₂', 'O₂', 'H₂', 'C', 'H', 'BTC', '₿'];
    const container = containerRef.current;
    
    // Clean up existing particles
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];

    // Create new particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'chemistry-particle';
      particle.textContent = formulas[Math.floor(Math.random() * formulas.length)];
      particle.style.cssText = `
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: ${10 + Math.random() * 6}px;
        color: rgba(255, 255, 255, ${0.02 + Math.random() * 0.03});
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: chemFloat ${15 + Math.random() * 10}s linear infinite;
        animation-delay: ${Math.random() * 10}s;
        pointer-events: none;
        z-index: 1;
      `;
      
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }

    return () => {
      particlesRef.current.forEach(p => p.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer" />
      </div>
      
      {/* The main text with outline style */}
      <h2 
        className={`
          relative z-10 
          font-['Space_Grotesk'] font-bold
          whitespace-nowrap
          px-8 py-4
          chemistry-text
          ${isHovered ? 'chemistry-text-hover' : ''}
        `}
        style={{
          fontSize: 'clamp(1.25rem, 3.5vw, 2.25rem)',
          letterSpacing: '0.15em'
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block chemistry-letter"
            style={{
              animationDelay: `${i * 0.03}s`,
              '--char-index': i
            } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>
      
      {/* Energy lines effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <line 
          x1="0" 
          y1="50%" 
          x2="100%" 
          y2="50%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          className="energy-line"
        />
      </svg>
    </div>
  );
}