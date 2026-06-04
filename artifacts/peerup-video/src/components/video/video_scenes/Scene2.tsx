import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const CODE = "UCE-7-01";

export function Scene2() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 3000),
      setTimeout(() => setPhase(5), 3600),
      setTimeout(() => setPhase(6), 4200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    let i = 0;
    const iv = setInterval(() => {
      setTyped(CODE.slice(0, i + 1));
      i++;
      if (i >= CODE.length) clearInterval(iv);
    }, 120);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20 gap-[6vw]"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80, filter: 'blur(8px)' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      {/* Left: explanation */}
      <motion.div className="flex flex-col gap-[1.5vw] max-w-[28vw]"
        initial={{ opacity: 0, x: -40 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      >
        <h2 className="text-[4vw] font-black text-[#1a1612] leading-[1.1]">
          Pristup samo s<br /><span className="text-[#1a8a72]">tvojim kodom.</span>
        </h2>
        <p className="text-[1.6vw] text-[#1a1612]/60 font-semibold leading-relaxed">
          Admin generira kodove za razred. Nema javne registracije — samo pravi učenici OŠ Centar.
        </p>
        <div className="flex flex-col gap-[0.6vw]">
          {["Jednostavna prijava", "Kod vrijedi cijelu školsku godinu", "Zatvorenica zajednica škole"].map((t, i) => (
            <motion.div key={i} className="flex items-center gap-[0.6vw]"
              initial={{ opacity: 0, x: -20 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 + 0.1 }}
            >
              <div className="w-[1.4vw] h-[1.4vw] rounded-full bg-[#1a8a72] flex items-center justify-center text-white text-[0.8vw] font-bold">✓</div>
              <span className="text-[1.4vw] font-semibold text-[#1a1612]/80">{t}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right: phone mockup */}
      <motion.div
        className="relative"
        initial={{ y: 60, opacity: 0, rotate: 3 }}
        animate={phase >= 1 ? { y: 0, opacity: 1, rotate: -1 } : {}}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        {/* Phone shell */}
        <div style={{ width: '25vw', background: '#1a1612', borderRadius: '3vw', padding: '0.7vw', boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}>
          <div style={{ background: '#1a1612', height: '1.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2vw' }}>
            <div style={{ width: '5vw', height: '0.7vw', background: '#333', borderRadius: '0.35vw' }} />
          </div>
          <div style={{ background: '#f7f3ee', borderRadius: '2.2vw', overflow: 'hidden', minHeight: '44vw', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#1a8a72,#0e6b58)', padding: '1.5vw 1.2vw', display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
              <span style={{ fontSize: '1.8vw' }}>🤝</span>
              <span style={{ fontWeight: 900, fontSize: '1.5vw', color: '#fff', fontFamily: 'sans-serif' }}>PeerUp</span>
            </div>

            {/* Login form */}
            <div style={{ padding: '2vw 1.5vw', display: 'flex', flexDirection: 'column', gap: '1vw', alignItems: 'center' }}>
              <div style={{ fontSize: '3.5vw', marginBottom: '0.4vw' }}>🔑</div>
              <div style={{ fontWeight: 900, fontSize: '1.8vw', color: '#1a1612', fontFamily: 'sans-serif', marginBottom: '0.2vw' }}>Prijava</div>
              <div style={{ fontSize: '1vw', color: '#888', fontFamily: 'sans-serif', textAlign: 'center', marginBottom: '0.5vw' }}>Upiši pristupni kod</div>

              {/* Code input */}
              <motion.div
                style={{ width: '100%', background: '#fff', borderRadius: '1vw', padding: '0.8vw 1vw', border: `2px solid ${phase >= 3 ? '#1a8a72' : '#e2e0dc'}`, display: 'flex', alignItems: 'center', gap: '0.5vw', boxSizing: 'border-box' }}
                animate={{ borderColor: phase >= 3 ? '#1a8a72' : '#e2e0dc' }}
                transition={{ duration: 0.3 }}
              >
                <span style={{ fontSize: '1.2vw' }}>🪪</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.3vw', color: '#1a1612', fontWeight: 700, letterSpacing: '0.1em', minHeight: '1.4vw' }}>
                  {typed || <span style={{ color: '#ccc' }}>npr. UCE-7-01</span>}
                </span>
                {phase >= 3 && phase < 4 && (
                  <motion.span style={{ width: '0.1vw', height: '1.4vw', background: '#1a8a72', marginLeft: 'auto' }}
                    animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                )}
              </motion.div>

              {/* Login button */}
              <motion.div
                style={{ width: '100%', background: phase >= 4 ? '#0e6b58' : '#1a8a72', borderRadius: '999px', padding: '0.9vw', textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3vw', fontFamily: 'sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px #1a8a7244', position: 'relative', overflow: 'hidden' }}
                animate={phase === 4 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {phase >= 5 ? "Prijavljujem..." : "Prijavi se →"}
                {phase === 4 && (
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.3)', borderRadius: '999px' }}
                    initial={{ scale: 0.4, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5 }} />
                )}
              </motion.div>

              {/* Success message */}
              <motion.div
                style={{ width: '100%', background: '#dcfce7', borderRadius: '1vw', padding: '1vw', textAlign: 'center', border: '2px solid #86efac' }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={phase >= 6 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <div style={{ fontSize: '2vw' }}>🎉</div>
                <div style={{ fontWeight: 900, fontSize: '1.2vw', color: '#15803d', fontFamily: 'sans-serif' }}>Dobrodošao, Luka!</div>
                <div style={{ fontSize: '0.9vw', color: '#166534', fontFamily: 'sans-serif' }}>UCE-7-01 · 7. razred</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
