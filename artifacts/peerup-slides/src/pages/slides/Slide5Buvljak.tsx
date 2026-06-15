export default function Slide5Buvljak() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#1a1612" }}>
      {/* Amber glow top-right */}
      <div className="absolute" style={{ top: "-14vh", right: "-8vw", width: "44vw", height: "44vw", borderRadius: "50%", background: "#d97706", opacity: 0.18 }} />
      <div className="absolute" style={{ bottom: "-10vh", left: "-6vw", width: "32vw", height: "32vw", borderRadius: "50%", background: "#d97706", opacity: 0.1 }} />
      <div className="absolute" style={{ top: "40vh", right: "3vw", width: "7vw", height: "7vw", borderRadius: "50%", background: "rgba(217,119,6,0.3)" }} />

      {/* Top accent */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#d97706" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.2vw", color: "#d97706", opacity: 0.4 }}>05</div>

      {/* Left: title */}
      <div className="absolute" style={{ top: "50%", left: "6vw", transform: "translateY(-50%)", width: "38vw" }}>
        <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "7vw", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.0 }}>
          Skolski<br /><span style={{ color: "#d97706" }}>buvljak</span>
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#d97706", borderRadius: "2px" }} />
        <div style={{ marginTop: "2.5vh", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.65)", lineHeight: 1.35, textWrap: "pretty" }}>
          Razmjena skolskog materijala
        </div>
      </div>

      {/* Right: three feature blocks */}
      <div className="absolute" style={{ top: "50%", right: "5vw", transform: "translateY(-50%)", width: "44vw", display: "flex", flexDirection: "column", gap: "2.5vh" }}>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "1vw", padding: "3vh 2.8vw", border: "0.12vw solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.6vw", color: "#d97706", marginBottom: "0.8vh" }}>Sto se razmjenjuje</div>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>Udzbenici, pribor, oprema — zamjena, posudba ili dar</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "1vw", padding: "3vh 2.8vw", border: "0.12vw solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.6vw", color: "#d97706", marginBottom: "0.8vh" }}>Kako funkcionira</div>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>Rezervacija preuzimanja putem kalendara</div>
        </div>
        <div style={{ background: "rgba(217,119,6,0.15)", borderRadius: "1vw", padding: "2.5vh 2.8vw", border: "0.12vw solid rgba(217,119,6,0.3)" }}>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>Smanjuje troskove i potice solidarnost u razredu</div>
        </div>
      </div>
    </div>
  );
}
