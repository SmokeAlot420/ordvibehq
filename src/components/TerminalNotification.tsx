import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onComplete?: () => void;
}

const TerminalNotification = ({ message, type = 'success', onComplete }: TerminalNotificationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  // Terminal prefix based on type
  const prefix = type === 'success' ? '> SUCCESS: ' : type === 'error' ? '> ERROR: ' : '> ';
  const fullMessage = prefix + message;
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullMessage.length) {
        setDisplayedText(fullMessage.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        // Hide cursor after typing is complete
        setTimeout(() => {
          setShowCursor(false);
          if (onComplete) {
            setTimeout(onComplete, 2000); // Wait 2 seconds before calling onComplete
          }
        }, 500);
      }
    }, 30); // Typing speed

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [fullMessage, onComplete]);

  const textColor = type === 'success' ? 'text-emerald-400' : type === 'error' ? 'text-red-400' : 'text-cyan-400';
  const borderColor = type === 'success' ? 'border-emerald-400/30' : type === 'error' ? 'border-red-400/30' : 'border-cyan-400/30';
  const glowColor = type === 'success' ? 'shadow-emerald-500/20' : type === 'error' ? 'shadow-red-500/20' : 'shadow-cyan-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        bg-black/90 backdrop-blur-md
        border ${borderColor}
        rounded-lg p-4 px-6
        shadow-2xl ${glowColor}
        max-w-[90vw] sm:max-w-md
      `}
    >
      <div className={`font-mono text-sm ${textColor}`}>
        {displayedText}
        {showCursor && <span className="animate-pulse">_</span>}
      </div>
      
      {/* Subtle scanning line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`h-px ${type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-red-400' : 'bg-cyan-400'} 
          absolute top-0 left-0 right-0 animate-scan`} />
      </motion.div>
    </motion.div>
  );
};

export default TerminalNotification;