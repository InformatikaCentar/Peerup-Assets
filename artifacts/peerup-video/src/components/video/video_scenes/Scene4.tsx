import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NOTES = [
  { title: "Jednadžbe s jednom nepoznatom", predmet: "Matematika", razred: "7. r.", preuz: 45, color: "#1a8a72", icon: "📐" },
  { title: "Fotosinteza i stanično disanje", predmet: "Biologija", razred: "6. r.", preuz: 38, color: "#16a34a", icon: "🌿" },
];

const MAP_NODES = [
  { label: "Jednadžbe", x: 140, y: 20, color: "#1a8a72" },
  { label: "Funkcije", x: 240, y: 100, color: "#d97706" },
  { label: "Geometrija", x: 140, y: 180, color: "#7c3aed" },
  { label: "Statistika", x: 40, y: 100, color: "#e03e5c" },
];

function MindMap({ phase }: { phase: number }) {
  const cx = 140; const cy = 100;
  return (
    <div style={{ position: 'relative', width: '100%', height: '13vw' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {MAP_NODES.map((n, i) => (
          <motion.line key={i} x1={`${cx / 2.8 * 100}%`} y1={`${cy / 2.0 * 100}%`}
            x2={`${n.x / 2.8 * 100}%`} y2={`${n.y / 2.0 * 100}%`}
            stroke={n.color} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase >= 3 ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
      </svg>
      {/* Center node */}
      <motion.div
        style={{ position: 'absolute', left: `${cx / 2.8 * 100}%`, top: `${cy / 2 * 100}%`, transform: 'translate(-50%,-50%)', background: '#1a8a72', color: '#fff', borderRadius: '0.6vw', padding: '0.3vw 0.7vw', fontSize: '0.9vw', fontWeight: 900, fontFamily: 'sans-serif', whiteSpace: 'nowrap', zIndex: 2, boxShadow: '0 2px 8px #1a8a7244' }}
        initial={{ scale: 0 }}
        animate={phase >= 3 ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      >🧮 Matematika</motion.div>
      {/* Branch nodes */}
      {MAP_NODES.map((n, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: `${n.x / 2.8 * 100}%`, top: `${n.y / 2 * 100}%`, transform: 'translate(-50%,-50%)', background: n.color, color: '#fff', borderRadius: '0.5vw', padding: '0.25vw 0.6vw', fontSize: '0.78vw', fontWeight: 800, fontFamily: 'sans-serif', whiteSpace: 'nowrap', zIndex: 2, boxShadow: `0 2px 6px ${n.color}55` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.12 + 0.2 }}
        >{n.label}</motion.div>
      ))}
    </div>
  );
}

export function Scene4() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => setPhase(6), 3800),
      setTimeout(() => setPhase(7), 5200),
      setTimeout(() => setPhase(8), 5800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20 gap-[4vw]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.7 }}
    >
      {/* Phone mockup */}
      <div style={{ position: 'relative', width: '26vw' }}>
        <motion.div
          style={{ background: '#1a1612', borderRadius: '3vw', padding: '0.7vw', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
          initial={{ y: 40, opacity: 0, rotate: 2 }}
          animate={phase >= 1 ? { y: 0, opacity: 1, rotate: 1 } : {}}
          transition={{ type: 'spring', stiffness: 150, damping: 16 }}
        >
          <div style={{ background: '#1a1612', height: '1.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2vw' }}>
            <div style={{ width: '5vw', height: '0.6vw', background: '#333', borderRadius: '0.3vw' }} />
          </div>
          <div style={{ background: '#f7f3ee', borderRadius: '2.2vw', overflow: 'hidden', minHeight: '46vw' }}>

            <div style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', padding: '1.2vw 1vw' }}>
              <div style={{ fontWeight: 900, fontSize: '1.3vw', color: '#fff', fontFamily: 'sans-serif' }}>📝 Bilješke i mape</div>
            </div>

            <div style={{ padding: '0.8vw', display: 'flex', flexDirection: 'column', gap: '0.6vw' }}>
              {/* Note cards */}
              {NOTES.map((n, i) => (
                <motion.div key={i}
                  style={{ background: '#fff', borderRadius: '1vw', padding: '0.7vw 0.8vw', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e8e4de' }}
                  initial={{ x: -40, opacity: 0 }}
                  animate={phase >= (2 + i) ? { x: 0, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw', marginBottom: '0.4vw' }}>
                    <span style={{ fontSize: '1.6vw' }}>{n.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95vw', color: '#1a1612', fontFamily: 'sans-serif', lineHeight: 1.2 }}>{n.title}</div>
                      <div style={{ fontSize: '0.75vw', color: '#888', fontFamily: 'sans-serif' }}>{n.razred} · {n.preuz} preuz.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4vw', alignItems: 'center' }}>
                    <span style={{ background: n.color, color: '#fff', fontSize: '0.7vw', fontWeight: 800, borderRadius: '0.4vw', padding: '0.1vw 0.4vw', fontFamily: 'sans-serif' }}>{n.predmet}</span>
                    {i === 0 && (
                      <motion.span
                        style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.7vw', fontWeight: 800, borderRadius: '0.4vw', padding: '0.1vw 0.4vw', fontFamily: 'sans-serif', cursor: 'pointer' }}
                        animate={phase >= 7 ? { scale: [1, 0.88, 1.08, 1], background: ['#fef3c7', '#fbbf24', '#fef3c7'] } : {}}
                        transition={{ duration: 0.4 }}
                      >🎯 Generiraj kviz →</motion.span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Mind map section */}
              <motion.div
                style={{ background: '#fff', borderRadius: '1vw', padding: '0.7vw', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e8e4de' }}
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9vw', color: '#1a1612', fontFamily: 'sans-serif', marginBottom: '0.4vw' }}>🗺️ Umna mapa — Matematika</div>
                <MindMap phase={phase} />
              </motion.div>

              {/* Download + quiz buttons */}
              {phase >= 5 && (
                <motion.div
                  style={{ display: 'flex', gap: '0.5vw' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{ flex: 1, background: '#f0fdf4', color: '#15803d', border: '1.5px solid #86efac', borderRadius: '0.6vw', padding: '0.4vw', textAlign: 'center', fontSize: '0.8vw', fontWeight: 800, fontFamily: 'sans-serif' }}>⬇ Preuzmi · +3 b.</div>
                  <motion.div
                    style={{ flex: 1, background: '#d97706', color: '#fff', borderRadius: '0.6vw', padding: '0.4vw', textAlign: 'center', fontSize: '0.8vw', fontWeight: 900, fontFamily: 'sans-serif', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    animate={phase >= 7 ? { scale: [1, 0.9, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    🎯 Generiraj kviz
                    {phase === 7 && (
                      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', borderRadius: '0.6vw' }}
                        initial={{ opacity: 0.9, scale: 0.3 }} animate={{ opacity: 0, scale: 2 }} transition={{ duration: 0.4 }} />
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Loading spinner */}
              {phase >= 8 && (
                <motion.div
                  style={{ background: '#fff', borderRadius: '1vw', padding: '1vw', textAlign: 'center', border: '2px dashed #d97706' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                >
                  <motion.div style={{ fontSize: '2vw', display: 'inline-block' }}
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚙️</motion.div>
                  <div style={{ fontWeight: 800, fontSize: '0.9vw', color: '#d97706', fontFamily: 'sans-serif', marginTop: '0.3vw' }}>Generiranje kviza...</div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right label */}
      <motion.div className="flex flex-col gap-[1.2vw] max-w-[22vw]"
        initial={{ opacity: 0, x: 40 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
      >
        <div className="text-[4vw]">📝</div>
        <h2 className="text-[3.2vw] font-black text-[#1a1612] leading-[1.1]">
          Bilješke,<br /><span className="text-[#2563eb]">mape</span> i<br /><span className="text-[#d97706]">kvizovi.</span>
        </h2>
        <p className="text-[1.4vw] text-[#1a1612]/60 font-semibold leading-relaxed">
          Dijeli bilješke, crtaj umne mape i generiraj AI kviz iz bilo kojeg materijala.
        </p>
        {phase >= 6 && (
          <motion.div
            className="bg-[#fef3c7] border border-[#fbbf24] rounded-2xl p-[1vw] flex items-center gap-[0.6vw]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <span className="text-[2vw]">🎯</span>
            <div>
              <div className="text-[1vw] font-black text-[#92400e]">Generiraj kviz</div>
              <div className="text-[0.85vw] font-semibold text-[#78350f]">Provjeri znanje odmah!</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
