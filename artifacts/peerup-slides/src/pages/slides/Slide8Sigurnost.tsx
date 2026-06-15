export default function Slide8Sigurnost() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#f7f3ee" }}>
      {/* Background blobs */}
      <div className="absolute" style={{ top: "-10vh", right: "-8vw", width: "36vw", height: "36vw", borderRadius: "50%", background: "#1a8a72", opacity: 0.08 }} />
      <div className="absolute" style={{ bottom: "-8vh", left: "-4vw", width: "24vw", height: "24vw", borderRadius: "50%", background: "#7c3aed", opacity: 0.07 }} />

      {/* Top accent */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#1a8a72" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "2.2vw", color: "#1a8a72", opacity: 0.4 }}>08</div>

      {/* Main layout: left title + right content */}
      <div className="absolute" style={{ top: "50%", left: "6vw", transform: "translateY(-50%)", width: "36vw" }}>
        <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "6vw", color: "#1a1612", letterSpacing: "-0.03em", lineHeight: 1.0, textWrap: "balance" }}>
          Sigurnost i pristup
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#1a8a72", borderRadius: "2px" }} />
        <div style={{ marginTop: "2.5vh", fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e", lineHeight: 1.35, textWrap: "pretty" }}>
          Zatvorena skolska zajednica
        </div>
        <div style={{ marginTop: "3vh", background: "#1a8a72", borderRadius: "1vw", padding: "2.5vh 2.5vw", display: "inline-block" }}>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 900, fontSize: "3.5vw", color: "#fff", letterSpacing: "0.05em" }}>UCE-7-01</div>
          <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.75)", marginTop: "0.5vh" }}>Primjer pristupnog koda</div>
        </div>
      </div>

      {/* Right: three role cards */}
      <div className="absolute" style={{ top: "50%", right: "5vw", transform: "translateY(-50%)", width: "46vw", display: "flex", flexDirection: "column", gap: "2.2vh" }}>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.8vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", gap: "2.5vw", alignItems: "center" }}>
          <div style={{ width: "0.5vw", height: "6vh", background: "#1a8a72", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "3.2vw", color: "#1a8a72", lineHeight: 1 }}>Ucenik</div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "2.8vw", color: "#6b5c4e", marginTop: "0.6vh" }}>Pristup svim modulima, zaradzuje bodove</div>
          </div>
        </div>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.8vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", gap: "2.5vw", alignItems: "center" }}>
          <div style={{ width: "0.5vw", height: "6vh", background: "#2563eb", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "3.2vw", color: "#2563eb", lineHeight: 1 }}>Ucitelj</div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "2.8vw", color: "#6b5c4e", marginTop: "0.6vh" }}>Nudi Expertnu pomoc, upravlja materijalima</div>
          </div>
        </div>
        <div style={{ background: "#ffffff", borderRadius: "1vw", padding: "2.8vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)", display: "flex", gap: "2.5vw", alignItems: "center" }}>
          <div style={{ width: "0.5vw", height: "6vh", background: "#7c3aed", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 800, fontSize: "3.2vw", color: "#7c3aed", lineHeight: 1 }}>Admin</div>
            <div style={{ fontFamily: "Book Antiqua, Palatino Linotype, Palatino, serif", fontWeight: 700, fontSize: "2.8vw", color: "#6b5c4e", marginTop: "0.6vh" }}>Generira kodove, upravlja korisnicima</div>
          </div>
        </div>
      </div>
    </div>
  );
}
