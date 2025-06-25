import { useEffect, useRef, useState } from 'react';

interface ModernTextProps {
  text: string;
  className?: string;
}

export default function ModernText({ text, className = '' }: ModernTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
    >
      {/* Main text with modern typography */}
      <h2 
        className={`
          relative
          font-bold
          whitespace-nowrap
          modern-text
          ${isVisible ? 'modern-text-visible' : ''}
        `}
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
          fontWeight: 800,
          letterSpacing: '-0.04em'
        }}
      >
        {/* Split text for individual letter animations */}
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block modern-letter"
            style={{
              '--char-index': i,
              '--total-chars': text.length
            } as React.CSSProperties}
          >
            <span className="letter-inner">
              {char === ' ' ? '\u00A0' : char}
            </span>
            <span className="letter-shadow" aria-hidden="true">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </h2>
      
      {/* Animated underline */}
      <div className="absolute -bottom-4 left-0 right-0 h-[2px] overflow-hidden">
        <div className="modern-underline" />
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="modern-gradient-overlay" />
      </div>
    </div>
  );
}