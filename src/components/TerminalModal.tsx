import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const TerminalModal = ({ isOpen, onClose, title, message, type = 'success' }: TerminalModalProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Terminal prefix based on type
  const prefix = type === 'success' ? '> SUCCESS: ' : type === 'error' ? '> ERROR: ' : '> ';
  const fullMessage = `${prefix}${title}\n${message}`;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDisplayedText("");
      setShowCursor(true);
      setIsTypingComplete(false);
    }
  }, [isOpen]);

  // Typing effect
  useEffect(() => {
    if (!isOpen) return;

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullMessage.length) {
        setDisplayedText(fullMessage.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        // Auto-close after 2.5 seconds
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [isOpen, fullMessage, onClose]);

  // Cursor blink effect
  useEffect(() => {
    if (!isOpen) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Color variants
  const colors = {
    success: {
      text: 'text-emerald-400',
      border: 'border-emerald-400/30',
      glow: 'shadow-[0_0_40px_rgba(52,211,153,0.2)]',
      scanLine: 'bg-emerald-400',
    },
    error: {
      text: 'text-red-400',
      border: 'border-red-400/30',
      glow: 'shadow-[0_0_40px_rgba(248,113,113,0.2)]',
      scanLine: 'bg-red-400',
    },
    info: {
      text: 'text-cyan-400',
      border: 'border-cyan-400/30',
      glow: 'shadow-[0_0_40px_rgba(34,211,238,0.2)]',
      scanLine: 'bg-cyan-400',
    },
  };

  const colorScheme = colors[type];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Terminal Window */}
          <motion.div
            className={`
              relative z-10 w-[95vw] sm:w-[90vw] max-w-[500px]
              bg-black/95 ${colorScheme.border} border rounded-xl
              ${colorScheme.glow} shadow-2xl
              overflow-hidden
            `}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Title Bar */}
            <div className="flex items-center gap-2 px-3 sm:px-4 h-7 sm:h-8 bg-white/[0.03] border-b border-emerald-400/20">
              {/* macOS Buttons */}
              <div className="flex gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
              </div>
              {/* Window Title */}
              <span className="flex-1 text-center text-[10px] sm:text-xs text-emerald-400/60 font-mono tracking-wider">
                BITPLEX://TERMINAL
              </span>
              {/* Spacer for centering */}
              <div className="w-[52px] sm:w-[62px]" />
            </div>

            {/* Terminal Content */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[80px]">
              <span className={colorScheme.text} style={{ whiteSpace: 'pre-wrap' }}>
                {displayedText}
              </span>
              {showCursor && !isTypingComplete && (
                <span className={`${colorScheme.text} animate-pulse`}>_</span>
              )}
              {isTypingComplete && (
                <motion.span
                  className={colorScheme.text}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              )}
            </div>

            {/* Scan Line Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`h-px ${colorScheme.scanLine} absolute left-0 right-0`}
                initial={{ top: 0, opacity: 0 }}
                animate={{
                  top: ['0%', '100%'],
                  opacity: [0, 0.3, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalModal;
