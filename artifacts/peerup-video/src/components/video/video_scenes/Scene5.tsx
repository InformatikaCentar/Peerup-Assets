import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-[30vw] h-[30vw] bg-[#1a8a72]/10 rounded-full absolute"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.h1 
        className="text-[10vw] font-black tracking-tight text-[#1a8a72] leading-none mb-6 drop-shadow-sm z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        PeerUp
      </motion.h1>

      <motion.div
        className="bg-white px-8 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 z-10 mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <span className="text-[2vw]">🏫</span>
        <span className="text-[1.8vw] font-bold text-[#1a1612]">OŠ Centar, Rijeka</span>
      </motion.div>

      <motion.p
        className="text-[3vw] font-black text-[#d97706] z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        Učimo zajedno.
      </motion.p>
    </motion.div>
  );
}
