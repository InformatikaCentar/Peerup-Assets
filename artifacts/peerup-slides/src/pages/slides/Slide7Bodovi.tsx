export default function Slide7Bodovi() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#f7f3ee" }}>
      {/* Background blobs */}
      <div className="absolute" style={{ bottom: "-10vh", right: "-6vw", width: "40vw", height: "40vw", borderRadius: "50%", background: "#d97706", opacity: 0.08 }} />
      <div className="absolute" style={{ top: "-8vh", left: "30vw", width: "24vw", height: "24vw", borderRadius: "50%", background: "#1a8a72", opacity: 0.07 }} />

      {/* Top accent */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#d97706" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#d97706", opacity: 0.4 }}>07</div>

      {/* Title */}
      <div className="absolute" style={{ top: "9vh", left: "6vw" }}>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "5.5vw", color: "#1a1612", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Bodovi i nagrade
        </div>
        <div style={{ marginTop: "1.2vh", width: "5vw", height: "0.5vh", background: "#d97706", borderRadius: "2px" }} />
        <div style={{ marginTop: "1.5vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e" }}>
          Gamifikacijska jezgra platforme
        </div>
      </div>

      {/* Ranks strip */}
      <div className="absolute" style={{ top: "38vh", left: "6vw", right: "6vw" }}>
        <div style={{ display: "flex", gap: "1.8vw", alignItems: "stretch" }}>
          <div style={{ flex: 1, background: "#ffffff", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#6b5c4e", lineHeight: 1 }}>Pochetnik</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#aaa" }}>Rang 1</div>
          </div>
          <div style={{ flex: 1, background: "#ffffff", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#2563eb", lineHeight: 1 }}>Istrazivac</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#aaa" }}>Rang 2</div>
          </div>
          <div style={{ flex: 1, background: "#ffffff", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#1a8a72", lineHeight: 1 }}>Pomagac</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#aaa" }}>Rang 3</div>
          </div>
          <div style={{ flex: 1, background: "#ffffff", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#7c3aed", lineHeight: 1 }}>Mentor</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#aaa" }}>Rang 4</div>
          </div>
          <div style={{ flex: 1, background: "#d97706", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#fff", lineHeight: 1 }}>Zvijezda</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.75)" }}>Rang 5</div>
          </div>
          <div style={{ flex: 1, background: "#1a8a72", borderRadius: "0.8vw", padding: "2vh 1.5vw", textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.8vw", color: "#fff", lineHeight: 1 }}>Legenda</div>
            <div style={{ marginTop: "0.8vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.75)" }}>Rang 6</div>
          </div>
        </div>
      </div>

      {/* Bottom stats row */}
      <div className="absolute" style={{ bottom: "8vh", left: "6vw", right: "6vw", display: "flex", gap: "3vw" }}>
        <div style={{ flex: 1, background: "#ffffff", borderRadius: "1vw", padding: "2.5vh 2vw", textAlign: "center", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "4.5vw", color: "#d97706" }}>+15–25</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.6vw", color: "#6b5c4e" }}>bodova za tjedni izazov</div>
        </div>
        <div style={{ flex: 2, background: "#ffffff", borderRadius: "1vw", padding: "2.5vh 2vw", boxShadow: "0 2px 12px rgba(26,22,18,0.07)" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "3vw", color: "#1a1612", marginBottom: "0.8vh" }}>Ljestvica skole</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e" }}>Transparentan rang svakog uchenika — potiче redovitu aktivnost i natjecanje</div>
        </div>
      </div>
    </div>
  );
}
