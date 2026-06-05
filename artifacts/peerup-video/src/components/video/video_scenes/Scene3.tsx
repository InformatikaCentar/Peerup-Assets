import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useVideoScale } from '../VideoTemplate';

const CARDS = [
  { name: "Ana Jurić", razred: "8. r.", predmet: "Matematika", lekcija: "Jednadžbe", stars: 5, color: "#1a8a72", avatar: "👧" },
  { name: "Tomislav B.", razred: "6. r.", predmet: "Engleski", lekcija: "Gramatika", stars: 4, color: "#2563eb", avatar: "👦" },
  { name: "Petra Šimić", razred: "5. r.", predmet: "Fizika", lekcija: "Mehanika", stars: 5, color: "#7c3aed", avatar: "👩" },
];

const DAYS = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

export function Scene3() {
  const { scale: s, isMobile } = useVideoScale();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 2600),
      setTimeout(() => setPhase(6), 3100),
      setTimeout(() => setPhase(7), 3700),
      setTimeout(() => setPhase(8), 4800),
      setTimeout(() => setPhase(9), 5300),
      setTimeout(() => setPhase(10), 6200),
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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {/* Left label */}
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: `${1.2 * s}vw`, maxWidth: isMobile ? '90vw' : '22vw', order: isMobile ? 1 : 0 }}
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      >
        <div style={{ fontSize: `${4 * s}vw`, fontWeight: 900, color: '#1a8a72' }}>📚</div>
        <h2 style={{ fontSize: `${3.2 * s}vw`, fontWeight: 900, color: '#1a1612', lineHeight: 1.1, margin: 0 }}>
          Učimo<br /><span style={{ color: '#1a8a72' }}>zajedno.</span>
        </h2>
        <p style={{ fontSize: `${1.4 * s}vw`, color: 'rgba(26,22,18,0.6)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
          Pronađi vršnjaka koji zna predmet, rezerviraj termin i uči.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.5 * s}vw` }}>
          {["Ponudi znanje → +8 bodova", "Rezerviraj termin → +5 bodova", "Ocijeni sat → +10 bodova"].map((t, i) => (
            <motion.div key={i}
              style={{ display: 'flex', alignItems: 'center', gap: `${0.5 * s}vw`, fontSize: `${1.1 * s}vw`, fontWeight: 700, color: '#1a8a72' }}
              initial={{ opacity: 0, x: -15 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12 }}
            >
              <span>✦</span> {t}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phone mockup */}
      <div style={{ position: 'relative', width: `${phoneW}vw`, order: isMobile ? -1 : 0 }}>
        <div style={{ background: '#1a1612', borderRadius: `${3 * s}vw`, padding: `${0.7 * s}vw`, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#1a1612', height: `${1.4 * s}vw`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: `${0.2 * s}vw` }}>
            <div style={{ width: `${5 * s}vw`, height: `${0.6 * s}vw`, background: '#333', borderRadius: `${0.3 * s}vw` }} />
          </div>
          <div style={{ background: '#f7f3ee', borderRadius: `${2.2 * s}vw`, overflow: 'hidden', minHeight: `${phoneH}vw` }}>
            {/* App header */}
            <div style={{ background: 'linear-gradient(135deg,#1a8a72,#0e6b58)', padding: `${1.2 * s}vw ${1 * s}vw` }}>
              <div style={{ fontWeight: 900, fontSize: `${1.3 * s}vw`, color: '#fff', fontFamily: 'sans-serif' }}>📚 Učimo zajedno</div>
            </div>

            {/* Cards */}
            <div style={{ padding: `${1 * s}vw`, display: 'flex', flexDirection: 'column', gap: `${0.7 * s}vw`, position: 'relative' }}>
              {CARDS.map((c, i) => (
                <motion.div key={i}
                  style={{ background: '#fff', borderRadius: `${1 * s}vw`, padding: `${0.8 * s}vw ${0.9 * s}vw`, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e8e4de', position: 'relative', overflow: 'hidden' }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={phase >= (2 + i) ? { x: 0, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: `${0.6 * s}vw`, marginBottom: `${0.4 * s}vw` }}>
                    <div style={{ fontSize: `${1.6 * s}vw` }}>{c.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: `${1 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif' }}>{c.name} · {c.razred}</div>
                      <div style={{ fontSize: `${0.85 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>{"⭐".repeat(c.stars)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: `${0.4 * s}vw` }}>
                    <span style={{ background: c.color, color: '#fff', fontSize: `${0.8 * s}vw`, fontWeight: 800, borderRadius: `${0.5 * s}vw`, padding: `${0.15 * s}vw ${0.5 * s}vw`, fontFamily: 'sans-serif' }}>{c.predmet}</span>
                    <span style={{ fontSize: `${0.8 * s}vw`, color: '#888', fontFamily: 'sans-serif' }}>{c.lekcija}</span>
                  </div>
                  {i === 0 && (
                    <motion.div
                      style={{ marginTop: `${0.5 * s}vw`, background: '#1a8a72', color: '#fff', fontSize: `${0.85 * s}vw`, fontWeight: 900, borderRadius: '999px', padding: `${0.3 * s}vw ${0.7 * s}vw`, display: 'inline-block', fontFamily: 'sans-serif', boxShadow: '0 2px 8px #1a8a7244', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                      animate={phase >= 5 ? { scale: [1, 0.92, 1], boxShadow: ['0 2px 8px #1a8a7244', '0 0 24px #1a8a7288', '0 2px 8px #1a8a7244'] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      📅 Rezerviraj termin
                      {phase === 5 && (
                        <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', borderRadius: '999px' }}
                          initial={{ scale: 0.3, opacity: 0.9 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.45 }} />
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Calendar modal */}
              <motion.div
                style={{ position: 'absolute', left: 0, right: 0, bottom: `-${2 * s}vw`, background: '#fff', borderRadius: `${1.5 * s}vw ${1.5 * s}vw 0 0`, padding: `${1 * s}vw`, boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
                initial={{ y: '100%' }}
                animate={phase >= 6 ? { y: 0 } : { y: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <div style={{ fontWeight: 900, fontSize: `${1.1 * s}vw`, color: '#1a1612', fontFamily: 'sans-serif', marginBottom: `${0.6 * s}vw`, textAlign: 'center' }}>📅 Odaberi termin — Lipanj 2025</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: `${0.25 * s}vw`, marginBottom: `${0.6 * s}vw` }}>
                  {DAYS.slice(0, 21).map((d) => {
                    const isSelected = d === "12" && phase >= 8;
                    const isAvail = ["3","5","10","12","17","19"].includes(d);
                    return (
                      <motion.div key={d}
                        style={{ borderRadius: `${0.5 * s}vw`, padding: `${0.25 * s}vw 0`, textAlign: 'center', fontSize: `${0.8 * s}vw`, fontWeight: isSelected ? 900 : isAvail ? 700 : 400, fontFamily: 'sans-serif', background: isSelected ? '#1a8a72' : 'transparent', color: isSelected ? '#fff' : isAvail ? '#1a8a72' : '#ccc', border: isAvail && !isSelected ? '1px solid #1a8a7244' : '1px solid transparent', cursor: isAvail ? 'pointer' : 'default' }}
                        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >{d}</motion.div>
                    );
                  })}
                </div>
                <motion.div
                  style={{ background: '#1a8a72', color: '#fff', borderRadius: '999px', padding: `${0.5 * s}vw`, textAlign: 'center', fontSize: `${0.9 * s}vw`, fontWeight: 900, fontFamily: 'sans-serif' }}
                  animate={phase >= 9 ? { scale: [1, 0.93, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >Potvrdi rezervaciju</motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* +5 bodova toast */}
        <motion.div
          style={{ position: 'absolute', top: `${-2.5 * s}vw`, right: `${-2 * s}vw`, background: '#d97706', color: '#fff', borderRadius: '999px', padding: `${0.5 * s}vw ${1.2 * s}vw`, fontWeight: 900, fontSize: `${1.2 * s}vw`, fontFamily: 'sans-serif', boxShadow: '0 4px 16px #d9770688', zIndex: 10 }}
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={phase >= 10 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 14 }}
        >
          🏅 +5 bodova!
        </motion.div>
      </div>
    </motion.div>
  );
}
