import { useEffect, useRef, useState } from 'react';

interface MatrixTextProps {
  text: string;
  className?: string;
}

export default function MatrixText({ text, className = '' }: MatrixTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const animationFrameRef = useRef<number>();

  // Matrix rain characters
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?αβγδεζηθικλμνξοπρστυφχψω';

  useEffect(() => {
    const canvases = canvasRefs.current.filter(Boolean) as HTMLCanvasElement[];
    const contexts = canvases.map(canvas => canvas.getContext('2d'));
    
    // Initialize matrix rain for each letter
    const drops: number[][] = canvases.map(() => {
      const cols = 3; // 3 columns per letter
      return Array(cols).fill(0);
    });

    const drawMatrixRain = () => {
      contexts.forEach((ctx, index) => {
        if (!ctx) return;
        
        const canvas = canvases[index];
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = '10px monospace';
        
        drops[index].forEach((y, col) => {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = col * 10 + 5;
          
          ctx.fillText(char, x, y);
          
          if (y > canvas.height && Math.random() > 0.95) {
            drops[index][col] = 0;
          }
          drops[index][col] += 10;
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(drawMatrixRain);
    };

    drawMatrixRain();

    // Glitch effect timer
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(glitchInterval);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div className="relative">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`relative inline-block matrix-letter ${glitchActive ? 'glitch-active' : ''}`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* Matrix rain canvas for each letter */}
            <canvas
              ref={el => canvasRefs.current[index] = el}
              className="absolute inset-0 w-full h-full opacity-30"
              width={40}
              height={60}
              style={{ filter: 'blur(1px)' }}
            />
            
            {/* The actual letter */}
            <span className="relative z-10 matrix-char" data-char={char}>
              {char === ' ' ? '\u00A0' : char}
            </span>
            
            {/* Glitch copies */}
            {glitchActive && (
              <>
                <span className="absolute inset-0 glitch-copy glitch-1" aria-hidden="true">
                  {char === ' ' ? '\u00A0' : char}
                </span>
                <span className="absolute inset-0 glitch-copy glitch-2" aria-hidden="true">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </>
            )}
          </span>
        ))}
      </div>
      
      {/* Scan line effect */}
      <div className="scan-line" />
    </div>
  );
}