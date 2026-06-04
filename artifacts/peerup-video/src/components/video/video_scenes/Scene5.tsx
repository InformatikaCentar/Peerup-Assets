import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const QUESTION = "Što se zbiva u procesu fotosinteze?";
const ANSWERS = [
  { label: "A", text: "Razgradnja ugljikohidrata", correct: false },
  { label: "B", text: "Sinteza glukoze iz CO₂ i H₂O", correct: true },
  { label: "C", text: "Razgradnja bjelančevina", correct: false },
  { label: "D", text: "Apsorpcija dušika iz tla", correct: false },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1500),
      setTimeout(() => setPhase(5), 1800),
      setTimeout(() => setPhase(6), 2100),
      setTimeout(() => setPhase(7), 2900),  // click wrong
      setTimeout(() => setPhase(8), 3400),  // wrong highlight
      setTimeout(() => setPhase(9), 4100),  // click correct
      setTimeout(() => setPhase(10), 4500), // correct highlight
      setTimeout(() => setPhase(11), 5000), // +3 points
      setTimeout(() => setPhase(12), 5800), // progress
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
      borderRadius: '0.8vw',
      padding: '0.7vw 0.9vw',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7vw',
      cursor: 'pointer',
      position: 'relative' as const,
      overflow: 'hidden',
      transform: wrong ? 'scale(1)' : 'scale(1)',
    };
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      {/* Scene label */}
      <motion.div
        className="flex items-center gap-[0.8vw] mb-[2vw]"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        <span className="text-[2.5vw]">🎯</span>
        <span className="text-[2.5vw] font-black text-[#1a1612]">Kviz — Biologija</span>
        <div className="bg-[#d97706] text-white text-[1.2vw] font-bold px-[1vw] py-[0.3vw] rounded-full">Pitanje 2/5</div>
      </motion.div>

      {/* Main quiz card */}
      <motion.div
        className="bg-white rounded-[2vw] shadow-2xl border border-[#e8e4de] w-[55vw] overflow-hidden"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        {/* Progress bar */}
        <div className="h-[0.5vw] bg-gray-100">
          <motion.div className="h-full bg-[#d97706]" style={{ width: '40%' }} />
        </div>

        <div className="p-[2.5vw]">
          {/* Question */}
          <motion.p
            className="text-[2.2vw] font-black text-[#1a1612] mb-[2.5vw] text-center leading-[1.3]"
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {QUESTION}
          </motion.p>

          {/* Answers grid */}
          <div className="grid grid-cols-2 gap-[0.8vw]">
            {ANSWERS.map((a, i) => (
              <motion.div key={i}
                style={getAnswerStyle(i)}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={phase >= (3 + i) ? { opacity: 1, x: 0 } : {}}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                {/* Click ripple */}
                {((i === 0 && phase === 7) || (i === 1 && phase === 9)) && (
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', borderRadius: '0.8vw' }}
                    initial={{ opacity: 0.9, scale: 0.3 }} animate={{ opacity: 0, scale: 2 }} transition={{ duration: 0.4 }} />
                )}

                {/* Label */}
                <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '0.4vw', background: i === 0 && phase >= 8 ? '#ef4444' : i === 1 && phase >= 10 ? '#22c55e' : '#f7f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1vw', fontFamily: 'sans-serif', color: i === 0 && phase >= 8 ? '#fff' : i === 1 && phase >= 10 ? '#fff' : '#1a1612', flexShrink: 0 }}>
                  {i === 0 && phase >= 8 ? '✗' : i === 1 && phase >= 10 ? '✓' : a.label}
                </div>
                <span style={{ fontSize: '1.15vw', fontWeight: 700, color: i === 0 && phase >= 8 ? '#991b1b' : i === 1 && phase >= 10 ? '#15803d' : '#1a1612', fontFamily: 'sans-serif' }}>
                  {a.text}
                </span>

                {/* Wrong shake */}
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
              className="mt-[1.5vw] bg-[#f0fdf4] border border-[#86efac] rounded-[1vw] p-[1vw] flex items-start gap-[0.7vw]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-[1.5vw]">💡</span>
              <p className="text-[1.1vw] font-semibold text-[#15803d]">
                Točno! Fotosinteza je proces u kojem biljke pomoću sunčeve energije pretvaraju CO₂ i H₂O u glukozu i kisik.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Points badge */}
      <motion.div
        className="mt-[1.5vw] flex items-center gap-[1.5vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 11 ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      >
        <motion.div
          className="bg-[#1a8a72] text-white px-[2vw] py-[0.7vw] rounded-full font-black text-[1.5vw] shadow-lg"
          animate={phase >= 11 ? { scale: [0, 1.2, 1] } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0 }}
        >
          +3 boda 🏅
        </motion.div>
        {phase >= 12 && (
          <motion.div
            className="text-[1.4vw] font-bold text-[#1a1612]/70"
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
