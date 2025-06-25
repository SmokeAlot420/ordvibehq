import { useEffect, useRef, useState } from 'react';

interface LiquidMetalTextProps {
  text: string;
  className?: string;
}

export default function LiquidMetalText({ text, className = '' }: LiquidMetalTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });

      // Magnetic effect on letters
      lettersRef.current.forEach((letter, i) => {
        if (!letter) return;
        
        const letterRect = letter.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top + letterRect.height / 2;
        
        const distX = e.clientX - letterCenterX;
        const distY = e.clientY - letterCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const maxDistance = 150;
        const force = Math.max(0, (maxDistance - distance) / maxDistance);
        
        const translateX = (distX * force * 0.2);
        const translateY = (distY * force * 0.2);
        const scale = 1 + (force * 0.1);
        
        letter.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      });
    };

    const handleMouseLeave = () => {
      lettersRef.current.forEach(letter => {
        if (letter) {
          letter.style.transform = 'translate(0, 0) scale(1)';
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* HUD corner brackets */}
      <div className="hud-brackets">
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />
      </div>
      
      {/* Main text */}
      <h2 
        className={`
          relative
          font-black
          whitespace-nowrap
          liquid-metal-text
          ${isHovered ? 'liquid-metal-hover' : ''}
        `}
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontFamily: "'SF Pro Display', 'Inter', -apple-system, sans-serif",
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            className="liquid-letter"
            style={{
              '--char-index': i,
              '--mouse-x': mousePos.x,
              '--mouse-y': mousePos.y
            } as React.CSSProperties}
          >
            {/* Main letter */}
            <span className="letter-main">
              {char === ' ' ? '\u00A0' : char}
            </span>
            
            {/* Chromatic aberration layers */}
            <span className="letter-r" aria-hidden="true">
              {char === ' ' ? '\u00A0' : char}
            </span>
            <span className="letter-b" aria-hidden="true">
              {char === ' ' ? '\u00A0' : char}
            </span>
            
            {/* Reflection layer */}
            <span className="letter-reflection" aria-hidden="true">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </h2>
      
      {/* Subtle scanlines */}
      <div className="scanlines" />
      
      {/* Depth blur edges */}
      <div className="depth-blur depth-blur-top" />
      <div className="depth-blur depth-blur-bottom" />
    </div>
  );
}