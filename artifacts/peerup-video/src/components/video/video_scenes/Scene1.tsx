import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const FEATURES = [
  { icon: "📚", label: "Učimo zajedno", color: "#1a8a72", delay: 0.1 },
  { icon: "📝", label: "Bilješke i mape", color: "#2563eb", delay: 0.2 },
  { icon: "🎒", label: "Školski buvljak", color: "#d97706", delay: 0.3 },
  { icon: "📖", label: "Priče", color: "#e03e5c", delay: 0.4 },
  { icon: "🤝", label: "Volontiranje", color: "#7c3aed", delay: 0.5 },
  { icon: "🏆", label: "Bodovi i nagrade", color: "#d97706", delay: 0.6 },
];

export function Scene1() {
  const { scale: s } = useVideoScale();
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
      style={{ padding: `${2*s}vw` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 0.7 }}
    >
      {/* Logo */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: `${1.5*s}vw`, marginBottom: `${2*s}vw` }}
        initial={{ y: -30, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      >
        <motion.div
          style={{ fontSize: `${8*s}vw` }}
          animate={phase >= 1 ? { rotate: [0, -10, 10, -5, 0] } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >🤝</motion.div>
        <div style={{ display: 'flex' }}>
          {"PeerUp".split('').map((ch, i) => (
            <motion.span key={i}
              style={{ fontSize: `${8*s}vw`, fontWeight: 900, lineHeight: 1, color: i < 4 ? '#1a1612' : '#1a8a72' }}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 350, damping: 16, delay: i * 0.07 + 0.1 }}
            >{ch}</motion.span>
          ))}
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        style={{ fontSize: `${2.2*s}vw`, fontWeight: 700, color: 'rgba(26,22,18,0.7)', marginBottom: `${3*s}vw`, textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Školska platforma za međuvršnjačku pomoć
      </motion.p>

      {/* Feature pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${1*s}vw`, justifyContent: 'center', maxWidth: `${70*s}vw`, marginBottom: `${2.5*s}vw` }}>
        {FEATURES.map((f, i) => (
          <motion.div key={i}
            style={{ display: 'flex', alignItems: 'center', gap: `${0.5*s}vw`, padding: `${0.6*s}vw ${1.4*s}vw`, borderRadius: '999px', color: '#fff', fontWeight: 700, fontSize: `${1.3*s}vw`, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: f.color }}
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
        style={{ display: 'flex', alignItems: 'center', gap: `${0.8*s}vw`, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', padding: `${0.8*s}vw ${2*s}vw`, borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.5)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <span style={{ fontSize: `${2*s}vw` }}>🏫</span>
        <span style={{ fontSize: `${1.6*s}vw`, fontWeight: 700, color: '#1a1612' }}>OŠ Centar, Rijeka</span>
      </motion.div>
    </motion.div>
  );
}
