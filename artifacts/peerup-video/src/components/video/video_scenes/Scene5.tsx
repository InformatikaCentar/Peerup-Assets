import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const QUESTION = "Što se zbiva u procesu fotosinteze?";
const ANSWERS = [
  { label: "A", text: "Razgradnja ugljikohidrata", correct: false },
  { label: "B", text: "Sinteza glukoze iz CO₂ i H₂O", correct: true },
  { label: "C", text: "Razgradnja bjelančevina", correct: false },
  { label: "D", text: "Apsorpcija dušika iz tla", correct: false },
];

export function Scene5() {
  const { scale: s, isMobile } = useVideoScale();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1500),
      setTimeout(() => setPhase(5), 1800),
      setTimeout(() => setPhase(6), 2100),
      setTimeout(() => setPhase(7), 2900),
      setTimeout(() => setPhase(8), 3400),
      setTimeout(() => setPhase(9), 4100),
      setTimeout(() => setPhase(10), 4500),
      setTimeout(() => setPhase(11), 5000),
      setTimeout(() => setPhase(12), 5800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const getAnswerStyle = (i: number) => {
    const wrong = i === 0 && phase >= 8;
    const correct = i === 1 && phase >= 10;
    const clicking = (i === 0 && phase === 7) || (i === 1 && phase === 9);
    return {
      background: correct ? '#dcfce7' : wrong ? '#fee2e2' : '#fff',
      border: `2px solid ${correct ? '#22c55e' : wrong ? '#ef4444' : clicking ? '#d97706' : '#e8e4de'}`,
      borderRadius: `${0.8 * s}vw`,
      padding: `${0.7 * s}vw ${0.9 * s}vw`,
      display: 'flex',
      alignItems: 'center',
      gap: `${0.7 * s}vw`,
      cursor: 'pointer',
      position: 'relative' as const,
      overflow: 'hidden',
    };
  };

  const cardWidth = isMobile ? '90vw' : '55vw';

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{ padding: isMobile ? `${2 * s}vw` : '0' }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      {/* Scene label */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: `${0.8 * s}vw`, marginBottom: `${2 * s}vw` }}
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        <span style={{ fontSize: `${2.5 * s}vw` }}>🎯</span>
        <span style={{ fontSize: `${2.5 * s}vw`, fontWeight: 900, color: '#1a1612' }}>Kviz — Biologija</span>
        <div style={{ background: '#d97706', color: '#fff', fontSize: `${1.2 * s}vw`, fontWeight: 700, padding: `${0.3 * s}vw ${1 * s}vw`, borderRadius: '999px' }}>Pitanje 2/5</div>
      </motion.div>

      {/* Main quiz card */}
      <motion.div
        style={{ background: '#fff', borderRadius: `${2 * s}vw`, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e8e4de', width: cardWidth, overflow: 'hidden' }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        {/* Progress bar */}
        <div style={{ height: `${0.5 * s}vw`, background: '#f3f4f6' }}>
          <motion.div style={{ height: '100%', background: '#d97706', width: '40%' }} />
        </div>

        <div style={{ padding: `${2.5 * s}vw` }}>
          {/* Question */}
          <motion.p
            style={{ fontSize: `${2.2 * s}vw`, fontWeight: 900, color: '#1a1612', marginBottom: `${2.5 * s}vw`, textAlign: 'center', lineHeight: 1.3 }}
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {QUESTION}
          </motion.p>

          {/* Answers grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${0.8 * s}vw` }}>
            {ANSWERS.map((a, i) => (
              <motion.div key={i}
                style={getAnswerStyle(i)}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={phase >= (3 + i) ? { opacity: 1, x: 0 } : {}}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                {((i === 0 && phase === 7) || (i === 1 && phase === 9)) && (
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', borderRadius: `${0.8 * s}vw` }}
                    initial={{ opacity: 0.9, scale: 0.3 }} animate={{ opacity: 0, scale: 2 }} transition={{ duration: 0.4 }} />
                )}
                <div style={{ width: `${1.8 * s}vw`, height: `${1.8 * s}vw`, minWidth: `${1.8 * s}vw`, borderRadius: `${0.4 * s}vw`, background: i === 0 && phase >= 8 ? '#ef4444' : i === 1 && phase >= 10 ? '#22c55e' : '#f7f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: `${1 * s}vw`, fontFamily: 'sans-serif', color: i === 0 && phase >= 8 ? '#fff' : i === 1 && phase >= 10 ? '#fff' : '#1a1612', flexShrink: 0 }}>
                  {i === 0 && phase >= 8 ? '✗' : i === 1 && phase >= 10 ? '✓' : a.label}
                </div>
                <span style={{ fontSize: `${1.15 * s}vw`, fontWeight: 700, color: i === 0 && phase >= 8 ? '#991b1b' : i === 1 && phase >= 10 ? '#15803d' : '#1a1612', fontFamily: 'sans-serif' }}>
                  {a.text}
                </span>
                {i === 0 && phase >= 8 && (
                  <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    animate={{ x: [-6, 6, -4, 4, 0] }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Explanation */}
          {phase >= 10 && (
            <motion.div
              style={{ marginTop: `${1.5 * s}vw`, background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: `${1 * s}vw`, padding: `${1 * s}vw`, display: 'flex', alignItems: 'flex-start', gap: `${0.7 * s}vw` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span style={{ fontSize: `${1.5 * s}vw` }}>💡</span>
              <p style={{ fontSize: `${1.1 * s}vw`, fontWeight: 600, color: '#15803d', margin: 0, fontFamily: 'sans-serif' }}>
                Točno! Fotosinteza je proces u kojem biljke pomoću sunčeve energije pretvaraju CO₂ i H₂O u glukozu i kisik.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Points badge */}
      <motion.div
        style={{ marginTop: `${1.5 * s}vw`, display: 'flex', alignItems: 'center', gap: `${1.5 * s}vw` }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 11 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      >
        <motion.div
          style={{ background: '#1a8a72', color: '#fff', padding: `${0.7 * s}vw ${2 * s}vw`, borderRadius: '999px', fontWeight: 900, fontSize: `${1.5 * s}vw`, boxShadow: '0 4px 16px #1a8a7244' }}
          animate={phase >= 11 ? { scale: [0, 1.2, 1] } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
        >
          +3 boda 🏅
        </motion.div>
        {phase >= 12 && (
          <motion.div
            style={{ fontSize: `${1.4 * s}vw`, fontWeight: 700, color: 'rgba(26,22,18,0.7)', fontFamily: 'sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            2/5 točnih · Nastavi kviz →
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
