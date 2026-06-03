import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 800),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.h2 
        className="text-[4.5vw] font-black text-[#1a1612] mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        Razmijeni. Dijeli.<br/>
        <span className="text-[#7c3aed]">Rastu svi.</span>
      </motion.h2>

      <div className="flex gap-[4vw]">
        {/* Left: Buvljak */}
        <motion.div
          className="w-[25vw] bg-white rounded-3xl shadow-xl p-6 border-t-8 border-[#d97706] transform origin-bottom-right"
          initial={{ x: -100, rotate: -15, opacity: 0 }}
          animate={phase >= 2 ? { x: 0, rotate: -4, opacity: 1 } : { x: -100, rotate: -15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="text-[3vw] mb-4">🎒</div>
          <h3 className="text-[1.8vw] font-bold text-[#1a1612] mb-2">Školski buvljak</h3>
          <p className="text-[1.2vw] text-gray-500 mb-6">Pronađi udžbenike i pribor.</p>
          <div className="bg-[#d97706] text-white text-center py-3 rounded-xl font-bold text-[1.2vw] flex items-center justify-center gap-2">
            📚 Rezerviraj
          </div>
        </motion.div>

        {/* Right: Biljeske */}
        <motion.div
          className="w-[25vw] bg-white rounded-3xl shadow-xl p-6 border-t-8 border-[#1a8a72] transform origin-bottom-left"
          initial={{ x: 100, rotate: 15, opacity: 0 }}
          animate={phase >= 3 ? { x: 0, rotate: 4, opacity: 1 } : { x: 100, rotate: 15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="text-[3vw] mb-4">📝</div>
          <h3 className="text-[1.8vw] font-bold text-[#1a1612] mb-2">Bilješke i mape</h3>
          <p className="text-[1.2vw] text-gray-500 mb-6">Uči iz tuđih materijala.</p>
          <div className="bg-[#1a8a72] text-white text-center py-3 rounded-xl font-bold text-[1.2vw] flex items-center justify-center gap-2">
            🗺️ Dijeli bilješke
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
