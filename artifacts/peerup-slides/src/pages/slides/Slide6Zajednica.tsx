export default function Slide6Zajednica() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#f7f3ee" }}>
      {/* Background blobs */}
      <div className="absolute" style={{ top: "-8vh", left: "-6vw", width: "36vw", height: "36vw", borderRadius: "50%", background: "#7c3aed", opacity: 0.07 }} />
      <div className="absolute" style={{ bottom: "-8vh", right: "-6vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#e03e5c", opacity: 0.07 }} />

      {/* Top accent */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#7c3aed" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#7c3aed", opacity: 0.4 }}>06</div>

      {/* Title — top left */}
      <div className="absolute" style={{ top: "10vh", left: "6vw", maxWidth: "52vw" }}>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "5.5vw", color: "#1a1612", letterSpacing: "-0.02em", lineHeight: 1.1, textWrap: "balance" }}>
          Zajednica i volontiranje
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#7c3aed", borderRadius: "2px" }} />
        <div style={{ marginTop: "2vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e", textWrap: "pretty" }}>
          Skolski feed i projekti
        </div>
      </div>

      {/* Two column cards lower half */}
      <div className="absolute" style={{ bottom: "9vh", left: "6vw", right: "6vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw" }}>
        {/* Priče column */}
        <div style={{ background: "#ffffff", borderRadius: "1.2vw", padding: "3.5vh 3vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "3.2vw", color: "#e03e5c", marginBottom: "1.5vh" }}>Price</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.4 }}>Uchenici dijele uspjehe, projekte i vijesti</div>
          <div style={{ marginTop: "1.5vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.4 }}>Svaka aktivnost vidljiva je cijeloj zajednici</div>
        </div>
        {/* Volontiranje column */}
        <div style={{ background: "#ffffff", borderRadius: "1.2vw", padding: "3.5vh 3vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "3.2vw", color: "#7c3aed", marginBottom: "1.5vh" }}>Volontiranje</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.4 }}>Prijava na skolske projekte i aktivnosti u zajednici</div>
          <div style={{ marginTop: "1.5vh", display: "flex", alignItems: "center", gap: "1vw" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "4vw", color: "#7c3aed" }}>+5</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#6b5c4e" }}>bodova po prijavi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
