import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GSAPTextProps {
  text: string;
  className?: string;
}

export default function GSAPText({ text, className = '' }: GSAPTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    // Clear refs
    lettersRef.current = [];

    // Initial state - letters hidden
    gsap.set(lettersRef.current, {
      opacity: 0,
      y: 50,
      rotationX: -90,
    });

    // Animate letters in with stagger
    gsap.to(lettersRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)",
      delay: 0.3
    });

    // Hover effect
    lettersRef.current.forEach((letter) => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          y: -5,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Continuous subtle animation
    gsap.to(lettersRef.current, {
      y: -2,
      duration: 2,
      stagger: 0.1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, [text]);

  return (
    <div 
      ref={containerRef}
      className={`text-white font-bold ${className}`}
      style={{
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        perspective: '1000px',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={el => el && (lettersRef.current[i] = el)}
          className="inline-block cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'text-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}