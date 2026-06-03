import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const text = "PeerUp";

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        <h1 className="text-[12vw] font-black tracking-tight text-[#1a8a72] leading-none mb-4 drop-shadow-sm flex">
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -15 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : { opacity: 0, y: 50, scale: 0.5, rotate: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: phase >= 1 ? i * 0.1 : 0 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </h1>
        
        {/* Playful accent dot */}
        <motion.div
          className="absolute -right-[1vw] bottom-[2vw] w-[3vw] h-[3vw] bg-[#d97706] rounded-full"
          initial={{ scale: 0 }}
          animate={phase >= 1 ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1 }}
        />
      </div>

      <motion.div
        className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl border border-white/40"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <p className="text-[2.5vw] font-bold text-[#1a1612]">
          Školska platforma za međuvršnjačku pomoć
        </p>
      </motion.div>
    </motion.div>
  );
}
