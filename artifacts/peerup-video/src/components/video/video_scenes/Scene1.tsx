import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: "📚", label: "Učimo zajedno", color: "#1a8a72", delay: 0.1 },
  { icon: "📝", label: "Bilješke i mape", color: "#2563eb", delay: 0.2 },
  { icon: "🎒", label: "Školski buvljak", color: "#d97706", delay: 0.3 },
  { icon: "📖", label: "Priče", color: "#e03e5c", delay: 0.4 },
  { icon: "🤝", label: "Volontiranje", color: "#7c3aed", delay: 0.5 },
  { icon: "🏆", label: "Bodovi i nagrade", color: "#d97706", delay: 0.6 },
];

export function Scene1() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 0.7 }}
    >
      {/* Logo */}
      <motion.div className="flex items-center gap-[1.5vw] mb-[2vw]"
        initial={{ y: -30, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      >
        <motion.div
          className="text-[8vw]"
          animate={phase >= 1 ? { rotate: [0, -10, 10, -5, 0] } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >🤝</motion.div>
        <div className="flex">
          {"PeerUp".split('').map((ch, i) => (
            <motion.span key={i}
              className="text-[8vw] font-black leading-none"
              style={{ color: i < 4 ? '#1a1612' : '#1a8a72' }}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 350, damping: 16, delay: i * 0.07 + 0.1 }}
            >{ch}</motion.span>
          ))}
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-[2.2vw] font-bold text-[#1a1612]/70 mb-[3vw] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Školska platforma za međuvršnjačku pomoć
      </motion.p>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-[1vw] justify-center max-w-[70vw] mb-[2.5vw]">
        {FEATURES.map((f, i) => (
          <motion.div key={i}
            className="flex items-center gap-[0.5vw] px-[1.4vw] py-[0.6vw] rounded-full text-white font-bold text-[1.3vw] shadow-lg"
            style={{ background: f.color }}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 16, delay: f.delay }}
          >
            <span>{f.icon}</span> {f.label}
          </motion.div>
        ))}
      </div>

      {/* School badge */}
      <motion.div
        className="flex items-center gap-[0.8vw] bg-white/80 backdrop-blur-md px-[2vw] py-[0.8vw] rounded-2xl shadow-xl border border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <span className="text-[2vw]">🏫</span>
        <span className="text-[1.6vw] font-bold text-[#1a1612]">OŠ Centar, Rijeka</span>
      </motion.div>
    </motion.div>
  );
}
