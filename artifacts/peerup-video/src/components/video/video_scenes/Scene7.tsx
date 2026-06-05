import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const LEADERBOARD = [
  { rank: 1, name: "Ana Jurić", bodovi: 487, avatar: "👧", color: "#d97706", badge: "⭐ Zvijezda" },
  { rank: 2, name: "Tomislav Babić", bodovi: 441, avatar: "👦", color: "#7c3aed", badge: "🎓 Mentor" },
  { rank: 3, name: "Luka Marić", bodovi: 398, avatar: "🧑‍🎓", color: "#1a8a72", badge: "🎓 Mentor", isMe: true },
  { rank: 4, name: "Petra Šimić", bodovi: 352, avatar: "👩", color: "#e03e5c", badge: "🤝 Pomagač" },
  { rank: 5, name: "Ivan Horvat", bodovi: 318, avatar: "👨", color: "#2563eb", badge: "🤝 Pomagač" },
];

const CHALLENGES = [
  { text: "Rezerviraj 3 termina ovaj tjedan", done: true, pts: 15 },
  { text: "Podijeli 2 bilješke", done: true, pts: 12 },
  { text: "Sudjeluj u volontiranju", done: false, pts: 25 },
];

export function Scene7() {
  const { scale: s, isMobile } = useVideoScale();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1200),
      setTimeout(() => setPhase(5), 1500),
      setTimeout(() => setPhase(6), 1800),
      setTimeout(() => setPhase(7), 2600),
      setTimeout(() => setPhase(8), 3500),
      setTimeout(() => setPhase(9), 4200),
      setTimeout(() => setPhase(10), 4700),
      setTimeout(() => setPhase(11), 5200),
      setTimeout(() => setPhase(12), 5800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const panelW = isMobile ? '90vw' : undefined;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        gap: `${3.5 * s}vw`,
        padding: isMobile ? `${2 * s}vw ${3 * s}vw` : '0',
        overflowY: 'hidden',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
    >
      {/* Leaderboard */}
      <motion.div
        style={{ background: '#fff', borderRadius: `${1.8 * s}vw`, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e8e4de', overflow: 'hidden', width: panelW ?? `${30 * s}vw` }}
        initial={{ opacity: 0, x: -40 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        <div style={{ background: 'linear-gradient(135deg,#d97706,#b45309)', padding: `${1.2 * s}vw ${1.4 * s}vw` }}>
          <div style={{ fontWeight: 900, fontSize: `${1.5 * s}vw`, color: '#fff', fontFamily: 'sans-serif' }}>🏆 Ljestvica — Tjedan</div>
          <div style={{ fontSize: `${0.9 * s}vw`, color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif' }}>Lipanj 2025</div>
        </div>

        <div style={{ padding: `${0.8 * s}vw`, display: 'flex', flexDirection: 'column', gap: `${0.4 * s}vw` }}>
          {LEADERBOARD.map((p, i) => (
            <motion.div key={i}
              style={{ display: 'flex', alignItems: 'center', gap: `${0.7 * s}vw`, padding: `${0.6 * s}vw ${0.8 * s}vw`, borderRadius: `${0.8 * s}vw`, background: p.isMe ? '#dcfce7' : i === 0 ? '#fef3c7' : '#f9f7f4', border: `1.5px solid ${p.isMe ? '#86efac' : i === 0 ? '#fbbf24' : 'transparent'}` }}
              initial={{ x: -30, opacity: 0 }}
              animate={phase >= (2 + i) ? { x: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <div style={{ width: `${1.6 * s}vw`, fontWeight: 900, fontSize: `${1 * s}vw`, color: i < 3 ? p.color : '#888', fontFamily: 'sans-serif', textAlign: 'center' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </div>
              <span style={{ fontSize: `${1.5 * s}vw` }}>{p.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: `${0.95 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif' }}>
                  {p.name} {p.isMe && <span style={{ color: '#1a8a72', fontSize: `${0.8 * s}vw` }}>(Ti)</span>}
                </div>
                <div style={{ fontSize: `${0.75 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>{p.badge}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: `${1.1 * s}vw`, color: p.color, fontFamily: 'sans-serif' }}>{p.bodovi}</div>
            </motion.div>
          ))}

          {/* My progress */}
          {phase >= 7 && (
            <motion.div
              style={{ marginTop: `${0.4 * s}vw`, padding: `${0.7 * s}vw ${0.8 * s}vw`, background: '#f0fdf4', borderRadius: `${0.8 * s}vw`, border: '1.5px solid #86efac' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.4 * s}vw` }}>
                <span style={{ fontWeight: 800, fontSize: `${0.85 * s}vw`, color: '#15803d', fontFamily: 'sans-serif' }}>Do ⭐ Zvijezde: 89 bodova</span>
                <span style={{ fontSize: `${0.8 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>398/487</span>
              </div>
              <div style={{ height: `${0.5 * s}vw`, background: '#d1fae5', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg,#1a8a72,#d97706)', borderRadius: '999px' }}
                  initial={{ width: '30%' }}
                  animate={phase >= 8 ? { width: '82%' } : { width: '30%' }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right: rank + challenges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.5 * s}vw`, width: panelW ?? `${26 * s}vw` }}>
        {/* Rank unlock */}
        <motion.div
          style={{ background: '#fff', borderRadius: `${1.8 * s}vw`, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', border: '1px solid #e8e4de', padding: `${1.4 * s}vw`, textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 8 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <motion.div
            style={{ fontSize: `${4 * s}vw` }}
            animate={phase >= 9 ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6 }}
          >🎓</motion.div>
          <div style={{ fontWeight: 900, fontSize: `${1.6 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif' }}>Rang: Mentor</div>
          <div style={{ fontSize: `${1 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>Otključano! Novi rang! 🎉</div>
          {phase >= 9 && (
            <motion.div
              style={{ display: 'flex', justifyContent: 'center', gap: `${0.3 * s}vw`, marginTop: `${0.5 * s}vw` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map(i => (
                <motion.span key={i} style={{ fontSize: `${1.2 * s}vw` }}
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 12 }}>⭐</motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Weekly challenges */}
        <motion.div
          style={{ background: '#fff', borderRadius: `${1.8 * s}vw`, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', border: '1px solid #e8e4de', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 9 ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', padding: `${0.8 * s}vw ${1.2 * s}vw` }}>
            <div style={{ fontWeight: 900, fontSize: `${1.2 * s}vw`, color: '#fff', fontFamily: 'sans-serif' }}>⚡ Tjedni izazovi</div>
          </div>
          <div style={{ padding: `${0.8 * s}vw`, display: 'flex', flexDirection: 'column', gap: `${0.5 * s}vw` }}>
            {CHALLENGES.map((ch, i) => (
              <motion.div key={i}
                style={{ display: 'flex', alignItems: 'center', gap: `${0.6 * s}vw`, padding: `${0.5 * s}vw ${0.6 * s}vw`, borderRadius: `${0.7 * s}vw`, background: ch.done ? '#f0fdf4' : '#f9f7f4', border: `1.5px solid ${ch.done ? '#86efac' : '#e8e4de'}` }}
                initial={{ x: 20, opacity: 0 }}
                animate={phase >= (10 + i) ? { x: 0, opacity: 1 } : {}}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <div style={{ width: `${1.4 * s}vw`, height: `${1.4 * s}vw`, minWidth: `${1.4 * s}vw`, borderRadius: '50%', background: ch.done ? '#22c55e' : '#e8e4de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${0.8 * s}vw`, flexShrink: 0 }}>
                  {ch.done ? '✓' : ''}
                </div>
                <span style={{ flex: 1, fontSize: `${0.85 * s}vw`, fontWeight: 700, color: ch.done ? '#15803d' : '#888', fontFamily: 'sans-serif', textDecoration: ch.done ? 'line-through' : 'none' }}>{ch.text}</span>
                <span style={{ fontSize: `${0.8 * s}vw`, fontWeight: 900, color: '#d97706', fontFamily: 'sans-serif' }}>+{ch.pts}</span>
              </motion.div>
            ))}
            <motion.div
              style={{ background: '#d97706', color: '#fff', borderRadius: '999px', padding: `${0.5 * s}vw`, textAlign: 'center', fontWeight: 900, fontSize: `${0.9 * s}vw`, fontFamily: 'sans-serif', marginTop: `${0.2 * s}vw` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={phase >= 12 ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            >
              🏅 Ukupno +27 bodova ovaj tjedan!
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
