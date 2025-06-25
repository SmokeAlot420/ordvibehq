import { motion } from 'framer-motion';

interface FramerTextProps {
  text: string;
  className?: string;
}

export default function FramerText({ text, className = '' }: FramerTextProps) {
  // Split text into letters for individual animation
  const letters = text.split('');

  // Container animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      }
    }
  };

  // Letter animation
  const letterAnimation = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      }
    }
  };

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      animate="visible"
      className={`text-white font-bold tracking-wider ${className}`}
      style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterAnimation}
          className="inline-block"
          whileHover={{
            y: -5,
            scale: 1.1,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
}