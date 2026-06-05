import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const TABS = [
  { icon: "📚", label: "Učimo zajedno", color: "#1a8a72" },
  { icon: "📝", label: "Bilješke i mape", color: "#2563eb" },
  { icon: "🎒", label: "Školski buvljak", color: "#d97706" },
  { icon: "📖", label: "Priče", color: "#e03e5c" },
  { icon: "🤝", label: "Volontiranje", color: "#7c3aed" },
  { icon: "🏆", label: "Bodovi i nagrade", color: "#d97706" },
];

export function Scene8() {
  const { scale: s } = useVideoScale();
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
      style={{ padding: `${2 * s}vw` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Feature pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${0.8 * s}vw`, justifyContent: 'center', maxWidth: '90vw', marginBottom: `${3 * s}vw` }}>
        {TABS.map((tab, i) => (
          <motion.div key={i}
            style={{ display: 'flex', alignItems: 'center', gap: `${0.5 * s}vw`, padding: `${0.7 * s}vw ${1.4 * s}vw`, borderRadius: '999px', color: '#fff', fontWeight: 700, fontSize: `${1.3 * s}vw`, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: tab.color }}
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
        style={{ display: 'flex', alignItems: 'center', gap: `${1.5 * s}vw`, marginBottom: `${1.5 * s}vw` }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <motion.div
          style={{ fontSize: `${8 * s}vw` }}
          animate={phase >= 3 ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : {}}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
        >🤝</motion.div>
        <div style={{ display: 'flex' }}>
          {"PeerUp".split('').map((ch, i) => (
            <motion.span key={i}
              style={{ fontSize: `${8 * s}vw`, fontWeight: 900, lineHeight: 1, color: i < 4 ? '#1a1612' : '#1a8a72' }}
              initial={{ opacity: 0, y: -20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.05 + 0.1 }}
            >{ch}</motion.span>
          ))}
        </div>
      </motion.div>

      {/* School badge */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: `${0.8 * s}vw`, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', padding: `${0.8 * s}vw ${2 * s}vw`, borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.5)', marginBottom: `${2 * s}vw` }}
        initial={{ opacity: 0, y: 15 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <span style={{ fontSize: `${2 * s}vw` }}>🏫</span>
        <span style={{ fontSize: `${1.6 * s}vw`, fontWeight: 700, color: '#1a1612' }}>OŠ Centar, Rijeka</span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        style={{ fontSize: `${3 * s}vw`, fontWeight: 900, color: '#1a8a72', marginBottom: `${1.5 * s}vw`, margin: `0 0 ${1.5 * s}vw` }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Učimo zajedno. Rastemo zajedno.
      </motion.p>

      {/* CTA */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: `${2 * s}vw` }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={{ background: '#1a8a72', color: '#fff', padding: `${1 * s}vw ${3 * s}vw`, borderRadius: '999px', fontWeight: 900, fontSize: `${1.6 * s}vw`, boxShadow: '0 8px 32px #1a8a7244' }}
          animate={phase >= 5 ? { boxShadow: ['0 4px 16px #1a8a7244', '0 8px 32px #1a8a7266', '0 4px 16px #1a8a7244'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚀 Pokreni PeerUp u svojoj školi
        </motion.div>
      </motion.div>

      {phase >= 6 && (
        <motion.p
          style={{ fontSize: `${1.2 * s}vw`, color: 'rgba(26,22,18,0.5)', fontWeight: 700, marginTop: `${1.5 * s}vw` }}
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
