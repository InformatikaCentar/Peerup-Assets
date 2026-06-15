export default function Slide3Ucimo() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#1a8a72" }}>
      {/* Decorative circles */}
      <div className="absolute" style={{ top: "-10vh", left: "-6vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div className="absolute" style={{ bottom: "-8vh", right: "-5vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "rgba(217,119,6,0.25)" }} />
      <div className="absolute" style={{ top: "5vh", right: "5vw", width: "8vw", height: "8vw", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "rgba(255,255,255,0.35)" }}>03</div>

      {/* Left column — title */}
      <div className="absolute" style={{ top: "50%", left: "6vw", transform: "translateY(-50%)", width: "36vw" }}>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "6.5vw", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.0, textWrap: "balance" }}>
          Ucimo<br />zajedno
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#d97706", borderRadius: "2px" }} />
        <div style={{ marginTop: "2.5vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "rgba(255,255,255,0.8)", lineHeight: 1.35, textWrap: "pretty" }}>
          Trznica meduvrsnjackih instrukcija
        </div>
      </div>

      {/* Right column — feature list */}
      <div className="absolute" style={{ top: "50%", right: "5vw", transform: "translateY(-50%)", width: "46vw", display: "flex", flexDirection: "column", gap: "2.2vh" }}>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "1vw", padding: "2.2vh 2.5vw", borderLeft: "0.4vw solid #d97706" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#fff", lineHeight: 1.3 }}>Uchenici nude i traze pomoc iz bilo kojeg predmeta</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "1vw", padding: "2.2vh 2.5vw", borderLeft: "0.4vw solid #d97706" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#fff", lineHeight: 1.3 }}>Rezervacija termina putem interaktivnog kalendara</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "1vw", padding: "2.2vh 2.5vw", display: "flex", gap: "2vw", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "4vw", color: "#d97706", lineHeight: 1 }}>+8</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.7)" }}>za objavu</div>
          </div>
          <div style={{ width: "0.15vw", height: "6vh", background: "rgba(255,255,255,0.25)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "4vw", color: "#d97706", lineHeight: 1 }}>+10</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.7)" }}>za odraden sat</div>
          </div>
          <div style={{ width: "0.15vw", height: "6vh", background: "rgba(255,255,255,0.25)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "4vw", color: "#d97706", lineHeight: 1 }}>+5</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "rgba(255,255,255,0.7)" }}>rezervatoru</div>
          </div>
        </div>
      </div>
    </div>
  );
}
