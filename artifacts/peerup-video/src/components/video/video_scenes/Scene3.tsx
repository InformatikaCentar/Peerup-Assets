import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const CARDS = [
  { name: "Ana Jurić", razred: "8. r.", predmet: "Matematika", lekcija: "Jednadžbe", stars: 5, color: "#1a8a72", avatar: "👧" },
  { name: "Tomislav B.", razred: "6. r.", predmet: "Engleski", lekcija: "Gramatika", stars: 4, color: "#2563eb", avatar: "👦" },
  { name: "Petra Šimić", razred: "5. r.", predmet: "Fizika", lekcija: "Mehanika", stars: 5, color: "#7c3aed", avatar: "👩" },
];

const DAYS = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

export function Scene3() {
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

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20 gap-[4vw]"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {/* Left label */}
      <motion.div className="flex flex-col gap-[1.2vw] max-w-[22vw]"
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      >
        <div className="text-[4vw] font-black text-[#1a8a72]">📚</div>
        <h2 className="text-[3.2vw] font-black text-[#1a1612] leading-[1.1]">
          Učimo<br /><span className="text-[#1a8a72]">zajedno.</span>
        </h2>
        <p className="text-[1.4vw] text-[#1a1612]/60 font-semibold leading-relaxed">
          Pronađi vršnjaka koji zna predmet, rezerviraj termin i uči.
        </p>
        <div className="flex flex-col gap-[0.5vw]">
          {["Ponudi znanje → +8 bodova", "Rezerviraj termin → +5 bodova", "Ocijeni sat → +10 bodova"].map((t, i) => (
            <motion.div key={i}
              className="flex items-center gap-[0.5vw] text-[1.1vw] font-bold text-[#1a8a72]"
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
      <div style={{ position: 'relative', width: '26vw' }}>
        <div style={{ background: '#1a1612', borderRadius: '3vw', padding: '0.7vw', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#1a1612', height: '1.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2vw' }}>
            <div style={{ width: '5vw', height: '0.6vw', background: '#333', borderRadius: '0.3vw' }} />
          </div>
          <div style={{ background: '#f7f3ee', borderRadius: '2.2vw', overflow: 'hidden', minHeight: '46vw' }}>

            {/* App header */}
            <div style={{ background: 'linear-gradient(135deg,#1a8a72,#0e6b58)', padding: '1.2vw 1vw' }}>
              <div style={{ fontWeight: 900, fontSize: '1.3vw', color: '#fff', fontFamily: 'sans-serif' }}>📚 Učimo zajedno</div>
            </div>

            {/* Cards */}
            <div style={{ padding: '1vw', display: 'flex', flexDirection: 'column', gap: '0.7vw', position: 'relative' }}>
              {CARDS.map((c, i) => (
                <motion.div key={i}
                  style={{ background: '#fff', borderRadius: '1vw', padding: '0.8vw 0.9vw', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e8e4de', position: 'relative', overflow: 'hidden' }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={phase >= (2 + i) ? { x: 0, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', marginBottom: '0.4vw' }}>
                    <div style={{ fontSize: '1.6vw' }}>{c.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1vw', color: '#1a1612', fontFamily: 'sans-serif' }}>{c.name} · {c.razred}</div>
                      <div style={{ fontSize: '0.85vw', color: '#888', fontFamily: 'sans-serif' }}>{"⭐".repeat(c.stars)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4vw' }}>
                    <span style={{ background: c.color, color: '#fff', fontSize: '0.8vw', fontWeight: 800, borderRadius: '0.5vw', padding: '0.15vw 0.5vw', fontFamily: 'sans-serif' }}>{c.predmet}</span>
                    <span style={{ fontSize: '0.8vw', color: '#888', fontFamily: 'sans-serif' }}>{c.lekcija}</span>
                  </div>
                  {/* Reserve button on first card, gets animated */}
                  {i === 0 && (
                    <motion.div
                      style={{ marginTop: '0.5vw', background: '#1a8a72', color: '#fff', fontSize: '0.85vw', fontWeight: 900, borderRadius: '999px', padding: '0.3vw 0.7vw', display: 'inline-block', fontFamily: 'sans-serif', boxShadow: '0 2px 8px #1a8a7244', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
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
                style={{ position: 'absolute', left: 0, right: 0, bottom: '-2vw', background: '#fff', borderRadius: '1.5vw 1.5vw 0 0', padding: '1vw', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
                initial={{ y: '100%' }}
                animate={phase >= 6 ? { y: 0 } : { y: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <div style={{ fontWeight: 900, fontSize: '1.1vw', color: '#1a1612', fontFamily: 'sans-serif', marginBottom: '0.6vw', textAlign: 'center' }}>📅 Odaberi termin — Lipanj 2025</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.25vw', marginBottom: '0.6vw' }}>
                  {DAYS.slice(0, 21).map((d, i) => {
                    const isSelected = d === "12" && phase >= 8;
                    const isAvail = ["3","5","10","12","17","19"].includes(d);
                    return (
                      <motion.div key={d}
                        style={{ borderRadius: '0.5vw', padding: '0.25vw 0', textAlign: 'center', fontSize: '0.8vw', fontWeight: isSelected ? 900 : isAvail ? 700 : 400, fontFamily: 'sans-serif', background: isSelected ? '#1a8a72' : 'transparent', color: isSelected ? '#fff' : isAvail ? '#1a8a72' : '#ccc', border: isAvail && !isSelected ? '1px solid #1a8a7244' : '1px solid transparent', cursor: isAvail ? 'pointer' : 'default' }}
                        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >{d}</motion.div>
                    );
                  })}
                </div>
                <motion.div
                  style={{ background: '#1a8a72', color: '#fff', borderRadius: '999px', padding: '0.5vw', textAlign: 'center', fontSize: '0.9vw', fontWeight: 900, fontFamily: 'sans-serif' }}
                  animate={phase >= 9 ? { scale: [1, 0.93, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >Potvrdi rezervaciju</motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* +5 bodova toast */}
        <motion.div
          style={{ position: 'absolute', top: '-2.5vw', right: '-2vw', background: '#d97706', color: '#fff', borderRadius: '999px', padding: '0.5vw 1.2vw', fontWeight: 900, fontSize: '1.2vw', fontFamily: 'sans-serif', boxShadow: '0 4px 16px #d9770688', zIndex: 10 }}
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
