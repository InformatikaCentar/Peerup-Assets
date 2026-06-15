export default function Slide4Biljezke() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#f7f3ee" }}>
      {/* Background blobs */}
      <div className="absolute" style={{ top: "-10vh", right: "-8vw", width: "38vw", height: "38vw", borderRadius: "50%", background: "#2563eb", opacity: 0.07 }} />
      <div className="absolute" style={{ bottom: "-6vh", left: "30vw", width: "22vw", height: "22vw", borderRadius: "50%", background: "#1a8a72", opacity: 0.06 }} />

      {/* Top accent */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#2563eb" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.2vw", color: "#2563eb", opacity: 0.4 }}>04</div>

      {/* Left: title */}
      <div className="absolute" style={{ top: "50%", left: "6vw", transform: "translateY(-50%)", width: "38vw" }}>
        <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "6.5vw", color: "#1a1612", letterSpacing: "-0.03em", lineHeight: 1.0, textWrap: "balance" }}>
          Biljezke<br />i mape
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#2563eb", borderRadius: "2px" }} />
        <div style={{ marginTop: "2.5vh", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e", lineHeight: 1.35, textWrap: "pretty" }}>
          Repozitorij edukativnih materijala
        </div>
      </div>

      {/* Right: feature cards */}
      <div className="absolute" style={{ top: "50%", right: "5vw", transform: "translateY(-50%)", width: "44vw", display: "flex", flexDirection: "column", gap: "2vh" }}>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.4vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "0.4vw", height: "5vh", background: "#2563eb", borderRadius: "2px", flexShrink: 0 }} />
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3 }}>Biljezke, sazetci i umne mape dijele se unutar skole</div>
        </div>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.4vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "0.4vw", height: "5vh", background: "#2563eb", borderRadius: "2px", flexShrink: 0 }} />
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3 }}>Pretrazivanje i filtriranje po predmetu i razredu</div>
        </div>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.4vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "0.4vw", height: "5vh", background: "#2563eb", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3 }}>"Generiraj kviz" — interaktivni kviz s bodovima</div>
          </div>
        </div>
        <div style={{ background: "#2563eb", borderRadius: "1vw", padding: "2vh 2.5vw", display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "4vw", color: "#fff", lineHeight: 1 }}>+6</div>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}>bodova za dijeljenje materijala</div>
        </div>
      </div>
    </div>
  );
}
