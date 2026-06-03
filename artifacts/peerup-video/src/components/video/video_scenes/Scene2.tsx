import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0, filter: 'blur(10px)' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex w-full px-[10vw] items-center justify-between gap-[5vw]">
        
        {/* Left: Text */}
        <div className="flex-1">
          <motion.h2 
            className="text-[5vw] font-black text-[#1a1612] leading-[1.1] mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Ponudi znanje.<br/>
            <span className="text-[#1a8a72]">Zatraži pomoć.</span>
          </motion.h2>
          
          <motion.div 
            className="w-24 h-2 bg-[#d97706] rounded-full"
            initial={{ width: 0 }}
            animate={phase >= 1 ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        {/* Right: Phone Frame & Cards */}
        <motion.div 
          className="relative w-[30vw] h-[45vw] bg-white rounded-[3rem] shadow-2xl border-[8px] border-[#1a1612] overflow-hidden flex flex-col bg-[#f7f3ee]"
          initial={{ y: 100, rotate: 10, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, rotate: -2, opacity: 1 } : { y: 100, rotate: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          {/* Header */}
          <div className="bg-[#1a8a72] text-white p-6 text-center font-bold text-[1.8vw]">
            🤝 Učimo zajedno
          </div>

          <div className="p-6 flex flex-col gap-4 relative flex-1">
            {/* Card 1 */}
            <motion.div 
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-100"
              initial={{ x: 100, opacity: 0 }}
              animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#e03e5c]/10 rounded-full flex items-center justify-center text-[1.5vw]">👦</div>
                <div>
                  <h3 className="font-bold text-[#1a1612] text-[1.2vw]">Matematika</h3>
                  <p className="text-gray-500 text-[1vw]">7. razred</p>
                </div>
              </div>
              <p className="text-[#1a8a72] font-semibold text-[1.1vw] bg-[#1a8a72]/10 inline-block px-3 py-1 rounded-full">Jednadžbe</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 absolute top-[14vw] left-6 right-6"
              initial={{ x: 100, opacity: 0 }}
              animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-full flex items-center justify-center text-[1.5vw]">👧</div>
                <div>
                  <h3 className="font-bold text-[#1a1612] text-[1.2vw]">Engleski</h3>
                  <p className="text-gray-500 text-[1vw]">6. razred</p>
                </div>
              </div>
              <p className="text-[#d97706] font-semibold text-[1.1vw] bg-[#d97706]/10 inline-block px-3 py-1 rounded-full">Gramatika</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
