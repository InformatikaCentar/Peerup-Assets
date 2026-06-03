import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 1600),
      setTimeout(() => setPhase(6), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center w-[80vw]">
        <motion.h2 
          className="text-[4.5vw] font-black text-[#1a1612] mb-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          Sakupi bodove. <span className="text-[#d97706]">Postani legenda.</span>
        </motion.h2>

        <div className="flex gap-[6vw] items-center w-full max-w-[60vw]">
          {/* Badge & Progress */}
          <div className="flex-1 flex flex-col items-center">
            <motion.div
              className="w-[15vw] h-[15vw] bg-gradient-to-tr from-[#d97706] to-[#f59e0b] rounded-full shadow-2xl flex items-center justify-center relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={phase >= 2 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              <span className="text-[6vw]">🏅</span>
              {/* Star bursts */}
              {phase >= 2 && [0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute text-[2vw]"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: [0, 1, 0], x: (i-1)*50, y: -80 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                >⭐</motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="text-[2vw] font-bold text-[#1a1612] mb-4"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            >
              Prvak
            </motion.div>

            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#1a8a72] to-[#d97706]"
                initial={{ width: '10%' }}
                animate={phase >= 3 ? { width: '85%' } : { width: '10%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            {[
              { name: "Ana M.", pts: 450, color: "bg-[#d97706]", text: "text-white" },
              { name: "Luka T.", pts: 420, color: "bg-white", text: "text-[#1a1612]" },
              { name: "Ti", pts: 390, color: "bg-[#1a8a72]", text: "text-white" }
            ].map((row, i) => (
              <motion.div
                key={i}
                className={`p-4 rounded-2xl shadow-sm flex justify-between items-center ${row.color} ${row.text}`}
                initial={{ x: 100, opacity: 0 }}
                animate={phase >= (3 + i) ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="flex items-center gap-3">
                  <div className="font-bold text-[1.5vw]">{i+1}.</div>
                  <div className="text-[1.2vw] font-semibold">{row.name}</div>
                </div>
                <div className="font-bold text-[1.2vw]">{row.pts} pts</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
