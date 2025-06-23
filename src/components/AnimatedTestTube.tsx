import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedTestTube = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative inline-block cursor-pointer"
      whileHover={{ scale: 1.15, rotateZ: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isActive 
            ? "0 0 40px rgba(0, 255, 127, 0.6), 0 0 80px rgba(0, 255, 127, 0.4), 0 0 120px rgba(0, 255, 127, 0.2)"
            : "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)"
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Main test tube container */}
      <motion.div
        className="relative w-12 h-24 md:w-16 md:h-32"
        animate={{ rotateY: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Test tube glass body */}
        <motion.div
          className="w-full h-full border-3 rounded-b-full mx-auto relative backdrop-blur-lg bg-gradient-to-b from-transparent via-emerald-400/5 to-emerald-400/10"
          style={{
            borderImage: "linear-gradient(180deg, rgba(0, 255, 127, 0.8), rgba(0, 212, 255, 0.6)) 1",
            borderStyle: "solid",
            borderWidth: "2px"
          }}
          animate={{
            borderColor: isActive 
              ? ["rgba(0, 255, 127, 0.8)", "rgba(0, 212, 255, 0.8)", "rgba(255, 107, 53, 0.8)"]
              : ["rgba(0, 212, 255, 0.6)", "rgba(0, 255, 127, 0.6)"]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          {/* Liquid inside */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-full overflow-hidden"
            animate={{
              height: isActive ? "75%" : "40%",
              background: isActive 
                ? "linear-gradient(to top, rgba(0, 255, 127, 0.6), rgba(0, 255, 127, 0.3), rgba(0, 255, 127, 0.1))"
                : "linear-gradient(to top, rgba(0, 212, 255, 0.4), rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))"
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {/* Liquid surface animation */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>



          {/* Glass reflection */}
          <motion.div
            className="absolute top-4 left-2 w-2 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bubbles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${30 + i * 8}%`,
                bottom: `${20 + i * 5}%`
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Energy particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                background: isActive ? "rgba(0, 255, 127, 0.8)" : "rgba(0, 212, 255, 0.6)",
                left: `${Math.random() * 80 + 10}%`,
                bottom: `${Math.random() * 60 + 20}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Magical aura */}
        <motion.div
          className="absolute inset-0 rounded-b-full pointer-events-none"
          animate={{
            background: isActive
              ? "radial-gradient(ellipse at center, rgba(0, 255, 127, 0.1) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.08) 0%, transparent 70%)"
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating chemistry symbols */}
      <motion.div
        className="absolute -top-6 -right-4 text-xs font-mono text-emerald-400/60"
        animate={{ 
          y: [-5, 5, -5],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        CH₄
      </motion.div>

      <motion.div
        className="absolute -bottom-2 -left-4 text-xs font-mono text-blue-400/60"
        animate={{ 
          y: [5, -5, 5],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        H₂O
      </motion.div>
    </motion.div>
  );
};

export default AnimatedTestTube; 