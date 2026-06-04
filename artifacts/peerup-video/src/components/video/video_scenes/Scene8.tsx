import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const TABS = [
  { icon: "📚", label: "Učimo zajedno", color: "#1a8a72" },
  { icon: "📝", label: "Bilješke i mape", color: "#2563eb" },
  { icon: "🎒", label: "Školski buvljak", color: "#d97706" },
  { icon: "📖", label: "Priče", color: "#e03e5c" },
  { icon: "🤝", label: "Volontiranje", color: "#7c3aed" },
  { icon: "🏆", label: "Bodovi i nagrade", color: "#d97706" },
];

export function Scene8() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => setPhase(6), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Feature pills arc */}
      <div className="flex flex-wrap gap-[0.8vw] justify-center max-w-[70vw] mb-[3vw]">
        {TABS.map((tab, i) => (
          <motion.div key={i}
            className="flex items-center gap-[0.5vw] px-[1.4vw] py-[0.7vw] rounded-full text-white font-bold text-[1.3vw] shadow-lg"
            style={{ background: tab.color }}
            initial={{ opacity: 0, y: 30, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.09 }}
          >
            <span>{tab.icon}</span> {tab.label}
          </motion.div>
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="flex items-center gap-[1.5vw] mb-[1.5vw]"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <motion.div
          className="text-[8vw]"
          animate={phase >= 3 ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : {}}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
        >🤝</motion.div>
        <div className="flex">
          {"PeerUp".split('').map((ch, i) => (
            <motion.span key={i}
              className="text-[8vw] font-black leading-none"
              style={{ color: i < 4 ? '#1a1612' : '#1a8a72' }}
              initial={{ opacity: 0, y: -20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.05 + 0.1 }}
            >{ch}</motion.span>
          ))}
        </div>
      </motion.div>

      {/* School badge */}
      <motion.div
        className="flex items-center gap-[0.8vw] bg-white/80 backdrop-blur-md px-[2vw] py-[0.8vw] rounded-2xl shadow-xl border border-white/50 mb-[2vw]"
        initial={{ opacity: 0, y: 15 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <span className="text-[2vw]">🏫</span>
        <span className="text-[1.6vw] font-bold text-[#1a1612]">OŠ Centar, Rijeka</span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-[3vw] font-black mb-[1.5vw]"
        style={{ color: '#1a8a72' }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Učimo zajedno. Rastemo zajedno.
      </motion.p>

      {/* CTA */}
      <motion.div
        className="flex items-center gap-[2vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-[#1a8a72] text-white px-[3vw] py-[1vw] rounded-full font-black text-[1.6vw] shadow-xl"
          animate={phase >= 5 ? { boxShadow: ['0 4px 16px #1a8a7244', '0 8px 32px #1a8a7266', '0 4px 16px #1a8a7244'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚀 Pokreni PeerUp u svojoj školi
        </motion.div>
      </motion.div>

      {phase >= 6 && (
        <motion.p
          className="text-[1.2vw] text-[#1a1612]/50 font-bold mt-[1.5vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Svaka škola. Svaki razred. Svaki učenik.
        </motion.p>
      )}
    </motion.div>
  );
}
