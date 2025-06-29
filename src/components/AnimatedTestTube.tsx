import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedTestTube = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  // Message arrays for dynamic generation
  const ordinalsMessages = [
    "inscribing satoshis", "digital artifact secured", "inscription ready", "ordinal placement",
    "first is first", "ordinal theory", "blockspace is precious", "cypherpunk ethos",
    "verifiably scarce", "permanently stored", "provably unique", "digital antiquity"
  ];

  const alkanesMessages = [
    "reaction bubbling", "elements combusting", "chains forming", "catalyst igniting",
    "hydrocarbon chains forming", "covalent bonds strengthening", "polymerization in progress",
    "alkane synthesis", "catalytic conversion", "fractional distillation", "molecular bonding"
  ];

  const processMessages = [
    "something is brewing", "reaction starting", "catalyst added", "temperature rising",
    "pressure building", "pH shifting", "bonds forming", "energy building",
    "molecules dancing", "atoms colliding", "chains extending", "reaction cascading",
    "elements combining", "structure forming", "pattern emerging", "synthesis beginning"
  ];

  const mysteryMessages = [
    "they don't know", "it's happening", "getting closer", "almost there",
    "can't stop it now", "the secret ingredient", "forbidden knowledge",
    "ancient formula", "lost recipe", "hidden truth", "classified data",
    "experimental phase", "prototype loading", "algorithm running", "code compiling"
  ];

  const degenMessages = [
    "probably nothing", "full send", "run it", "keep an eye out",
    "dude you down?", "we're experimenting", "stay frosty", "gm gm gm",
    "send it", "few understand", "experimental, free?", "fair launch",
    "shadow drop", "doors opening", "almost time", "get ready",
    "pay attention", "no promises", "iykyk", "trust the process"
  ];

  const randomMessage = () => {
    const allArrays = [ordinalsMessages, alkanesMessages, processMessages, mysteryMessages, degenMessages];
    const randomArray = allArrays[Math.floor(Math.random() * allArrays.length)];
    return randomArray[Math.floor(Math.random() * randomArray.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
      setCurrentMessage(randomMessage());
    }, 3000);
    
    // Set initial message
    setCurrentMessage(randomMessage());
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full">
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
          className="relative w-16 h-36 sm:w-20 sm:h-48 md:w-24 md:h-56"
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

            {/* Bubbles - reduced for mobile performance */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${30 + i * 12}%`,
                  bottom: `${20 + i * 8}%`
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

            {/* Energy particles - reduced for mobile performance */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-0.5 h-0.5 rounded-full hidden sm:block"
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

          {/* Dynamic mysterious message */}
          <motion.div
            key={currentMessage} // This makes it re-animate when message changes
            className="absolute -right-24 sm:-right-32 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-cyan-300/80 font-mono whitespace-nowrap tracking-wider hidden sm:block"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ letterSpacing: '0.1em' }}
          >
            {currentMessage}
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Mobile version of message */}
      <motion.div
        key={`mobile-${currentMessage}`}
        className="block sm:hidden mt-4 text-xs text-cyan-300/80 font-mono tracking-wider text-center whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ letterSpacing: '0.1em' }}
      >
        {currentMessage}
      </motion.div>
    </div>
  );
};

export default AnimatedTestTube;