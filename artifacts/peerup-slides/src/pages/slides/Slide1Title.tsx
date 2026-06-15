export default function Slide1Title() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#1a8a72" }}>
      {/* Background decorative circles */}
      <div className="absolute" style={{ top: "-8vh", right: "-6vw", width: "38vw", height: "38vw", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div className="absolute" style={{ bottom: "-10vh", left: "-5vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div className="absolute" style={{ top: "18vh", right: "4vw", width: "12vw", height: "12vw", borderRadius: "50%", background: "#d97706", opacity: 0.85 }} />
      <div className="absolute" style={{ bottom: "12vh", right: "18vw", width: "5vw", height: "5vw", borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
      <div className="absolute" style={{ top: "8vh", left: "2vw", width: "6vw", height: "6vw", borderRadius: "50%", background: "rgba(217,119,6,0.3)" }} />

      {/* School badge top-left */}
      <div className="absolute" style={{ top: "5vh", left: "5vw" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6vw", background: "rgba(255,255,255,0.15)", borderRadius: "99px", padding: "0.6vh 1.4vw", backdropFilter: "blur(4px)" }}>
          <span style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "2.2vw", color: "#fff", letterSpacing: "-0.01em" }}>OS Centar, Rijeka</span>
        </div>
      </div>

      {/* Main content — left-aligned, vertically centered */}
      <div className="absolute" style={{ top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "55vw" }}>
        <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "11vw", color: "#ffffff", lineHeight: 0.95, letterSpacing: "-0.03em", textWrap: "balance" }}>
          Peer<span style={{ color: "#d97706" }}>Up</span>
        </div>
        <div style={{ marginTop: "3vh", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3.4vw", color: "rgba(255,255,255,0.88)", lineHeight: 1.25, textWrap: "balance" }}>
          Skolska platforma za meduvrsnjacku pomoc
        </div>
        <div style={{ marginTop: "4vh", width: "6vw", height: "0.5vh", background: "#d97706", borderRadius: "2px" }} />
        <div style={{ marginTop: "3vh", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 400, fontSize: "3vw", color: "rgba(255,255,255,0.72)", lineHeight: 1.5, maxWidth: "48vw", textWrap: "pretty" }}>
          PeerUp nije samo alat za ucenje — to je skolska zajednica koja nagraduje suradnju, solidarnost i angazman.
        </div>
      </div>

      {/* Handshake icon area — right side */}
      <div className="absolute" style={{ top: "50%", right: "7vw", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2vh" }}>
        <div style={{ width: "18vw", height: "18vw", borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "0.3vw solid rgba(255,255,255,0.2)" }}>
          <svg width="9vw" height="9vw" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 40C8 40 14 44 20 44C24 44 28 40 32 40C36 40 40 44 44 44C50 44 56 40 56 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 28L20 40L32 32L44 40L56 28" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="20" r="8" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="3"/>
            <path d="M18 28C18 28 22 24 32 24C42 24 46 28 46 28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.4vw", color: "rgba(255,255,255,0.9)", textAlign: "center", letterSpacing: "0.05em" }}>
          2025./2026.
        </div>
      </div>
    </div>
  );
}
