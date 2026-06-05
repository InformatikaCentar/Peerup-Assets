import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const ITEMS = [
  { name: "Matematika udžbenik 7. r.", tip: "Darivanje", ikona: "📚", stanje: "Odlično", vlasnik: "Ana J.", color: "#1a8a72" },
  { name: "Kemijski pribor — komplet", tip: "Posudba", ikona: "🔬", stanje: "Dobro", vlasnik: "Marko P.", color: "#2563eb" },
  { name: "Školska torba Adidas", tip: "Zamjena", ikona: "🎒", stanje: "Dobro", vlasnik: "Petra Š.", color: "#7c3aed" },
];

const FILTERS = ["Svi", "Zamjena 🔄", "Posudba 📋", "Darivanje 🎁"];

export function Scene6() {
  const { scale: s, isMobile } = useVideoScale();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 1800),
      setTimeout(() => setPhase(6), 2800),
      setTimeout(() => setPhase(7), 3300),
      setTimeout(() => setPhase(8), 4000),
      setTimeout(() => setPhase(9), 4800),
      setTimeout(() => setPhase(10), 5500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const phoneW = isMobile ? 65 : 26;
  const phoneH = phoneW * 46 / 26;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        gap: `${4 * s}vw`,
        padding: isMobile ? `${2 * s}vw ${3 * s}vw` : '0',
        overflowY: 'hidden',
      }}
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 110, damping: 20 }}
    >
      {/* Left text */}
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: `${1.2 * s}vw`, maxWidth: isMobile ? '90vw' : '22vw', order: isMobile ? 1 : 0 }}
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      >
        <div style={{ fontSize: `${4 * s}vw` }}>🎒</div>
        <h2 style={{ fontSize: `${3.2 * s}vw`, fontWeight: 900, color: '#1a1612', lineHeight: 1.1, margin: 0 }}>
          Školski<br /><span style={{ color: '#d97706' }}>buvljak.</span>
        </h2>
        <p style={{ fontSize: `${1.4 * s}vw`, color: 'rgba(26,22,18,0.6)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
          Razmijeni, posudi ili darivaj udžbenike, pribor i opremu vršnjacima iz škole.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.5 * s}vw` }}>
          {[{ ic: "🔄", t: "Zamjena — pronađi što trebaš" }, { ic: "📋", t: "Posudba — vrati kad završiš" }, { ic: "🎁", t: "Darivanje — pomozi drugima" }].map((item, i) => (
            <motion.div key={i}
              style={{ display: 'flex', alignItems: 'center', gap: `${0.6 * s}vw`, fontSize: `${1.1 * s}vw`, fontWeight: 700, color: 'rgba(26,22,18,0.7)' }}
              initial={{ opacity: 0, x: -15 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.13 }}
            >
              <span>{item.ic}</span> {item.t}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phone */}
      <div style={{ position: 'relative', width: `${phoneW}vw`, order: isMobile ? -1 : 0 }}>
        <motion.div
          style={{ background: '#1a1612', borderRadius: `${3 * s}vw`, padding: `${0.7 * s}vw`, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
          initial={{ y: 40, opacity: 0, rotate: -2 }}
          animate={phase >= 1 ? { y: 0, opacity: 1, rotate: 1 } : {}}
          transition={{ type: 'spring', stiffness: 150, damping: 16 }}
        >
          <div style={{ background: '#1a1612', height: `${1.4 * s}vw`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: `${0.2 * s}vw` }}>
            <div style={{ width: `${5 * s}vw`, height: `${0.6 * s}vw`, background: '#333', borderRadius: `${0.3 * s}vw` }} />
          </div>
          <div style={{ background: '#f7f3ee', borderRadius: `${2.2 * s}vw`, overflow: 'hidden', minHeight: `${phoneH}vw` }}>
            <div style={{ background: 'linear-gradient(135deg,#d97706,#b45309)', padding: `${1.2 * s}vw ${1 * s}vw` }}>
              <div style={{ fontWeight: 900, fontSize: `${1.3 * s}vw`, color: '#fff', fontFamily: 'sans-serif' }}>🎒 Školski buvljak</div>
            </div>

            <div style={{ padding: `${0.8 * s}vw`, display: 'flex', flexDirection: 'column', gap: `${0.6 * s}vw` }}>
              {/* Filter pills */}
              <motion.div
                style={{ display: 'flex', gap: `${0.4 * s}vw`, flexWrap: 'wrap' }}
                initial={{ opacity: 0, y: -10 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
              >
                {FILTERS.map((f, i) => (
                  <motion.div key={i}
                    style={{ background: i === 0 ? '#d97706' : '#fff', color: i === 0 ? '#fff' : '#888', border: `1.5px solid ${i === 0 ? '#d97706' : '#e2e0dc'}`, borderRadius: '999px', padding: `${0.15 * s}vw ${0.6 * s}vw`, fontSize: `${0.75 * s}vw`, fontWeight: 800, fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}
                    initial={{ scale: 0 }}
                    animate={phase >= 2 ? { scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.07 }}
                  >{f}</motion.div>
                ))}
              </motion.div>

              {/* Item cards */}
              {ITEMS.map((item, i) => (
                <motion.div key={i}
                  style={{ background: i === 0 && phase >= 9 ? '#f0fdf4' : '#fff', borderRadius: `${1 * s}vw`, padding: `${0.8 * s}vw ${0.9 * s}vw`, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: `1.5px solid ${i === 0 && phase >= 9 ? '#86efac' : '#e8e4de'}`, position: 'relative', overflow: 'hidden' }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={phase >= (3 + i) ? { y: 0, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: `${0.6 * s}vw`, marginBottom: `${0.4 * s}vw` }}>
                    <span style={{ fontSize: `${1.8 * s}vw` }}>{item.ikona}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: `${0.9 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif' }}>{item.name}</div>
                      <div style={{ fontSize: `${0.75 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>Stanje: {item.stanje} · {item.vlasnik}</div>
                    </div>
                    <span style={{ background: item.color, color: '#fff', fontSize: `${0.7 * s}vw`, fontWeight: 800, borderRadius: `${0.4 * s}vw`, padding: `${0.1 * s}vw ${0.4 * s}vw`, fontFamily: 'sans-serif', flexShrink: 0 }}>{item.tip}</span>
                  </div>

                  {i === 0 && (
                    <motion.div
                      style={{ background: '#d97706', color: '#fff', borderRadius: '999px', padding: `${0.3 * s}vw ${0.8 * s}vw`, fontSize: `${0.8 * s}vw`, fontWeight: 900, fontFamily: 'sans-serif', display: 'inline-block', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                      animate={phase >= 6 ? { scale: [1, 0.9, 1], boxShadow: ['0 2px 8px #d9770644', '0 0 20px #d9770688', '0 2px 8px #d9770644'] } : { scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      📅 Rezerviraj
                      {phase === 6 && (
                        <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)' }}
                          initial={{ opacity: 0.9, scale: 0.3 }} animate={{ opacity: 0, scale: 2.5 }} transition={{ duration: 0.45 }} />
                      )}
                    </motion.div>
                  )}

                  {i === 0 && phase >= 9 && (
                    <motion.div
                      style={{ display: 'flex', alignItems: 'center', gap: `${0.4 * s}vw`, marginTop: `${0.4 * s}vw` }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span style={{ fontSize: `${0.9 * s}vw` }}>✅</span>
                      <span style={{ fontSize: `${0.8 * s}vw`, color: '#15803d', fontWeight: 800, fontFamily: 'sans-serif' }}>Rezervirano — 12. lipnja u 14:00</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Mini calendar */}
              {phase >= 7 && phase < 9 && (
                <motion.div
                  style={{ background: '#fff', borderRadius: `${1 * s}vw`, padding: `${0.7 * s}vw`, border: '2px solid #d9770644', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <div style={{ fontWeight: 800, fontSize: `${0.85 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif', marginBottom: `${0.4 * s}vw` }}>📅 Odaberi dan preuzimanja</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: `${0.3 * s}vw` }}>
                    {["10","11","12","13","14","17","18","19","20","21"].map((d) => (
                      <motion.div key={d}
                        style={{ borderRadius: `${0.5 * s}vw`, padding: `${0.3 * s}vw`, textAlign: 'center', fontSize: `${0.8 * s}vw`, fontWeight: 700, fontFamily: 'sans-serif', background: d === "12" && phase >= 8 ? '#d97706' : '#f7f3ee', color: d === "12" && phase >= 8 ? '#fff' : '#1a1612', cursor: 'pointer' }}
                        animate={d === "12" && phase >= 8 ? { scale: [1, 1.25, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >{d}</motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Toast */}
        <motion.div
          style={{ position: 'absolute', top: `${-2.5 * s}vw`, right: `${-1.5 * s}vw`, background: '#1a8a72', color: '#fff', borderRadius: '999px', padding: `${0.5 * s}vw ${1.2 * s}vw`, fontWeight: 900, fontSize: `${1.1 * s}vw`, fontFamily: 'sans-serif', boxShadow: '0 4px 16px #1a8a7255', zIndex: 10, whiteSpace: 'nowrap' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 10 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 14 }}
        >
          🎒 Dogovoreno! +2 boda
        </motion.div>
      </div>
    </motion.div>
  );
}
