export default function Slide2Problem() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#f7f3ee" }}>
      {/* Decorative background blob */}
      <div className="absolute" style={{ top: "-12vh", right: "-8vw", width: "42vw", height: "42vw", borderRadius: "50%", background: "#e03e5c", opacity: 0.07 }} />
      <div className="absolute" style={{ bottom: "-8vh", left: "-6vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#d97706", opacity: 0.08 }} />

      {/* Top accent bar */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "1vh", background: "#e03e5c" }} />

      {/* Slide number */}
      <div className="absolute" style={{ top: "4vh", right: "5vw", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#e03e5c", opacity: 0.5 }}>02</div>

      {/* Main content */}
      <div className="absolute" style={{ top: "10vh", left: "7vw", right: "7vw" }}>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "5.5vw", color: "#1a1612", letterSpacing: "-0.02em", lineHeight: 1.1, textWrap: "balance" }}>
          Problem koji<br />rjesavamo
        </div>
        <div style={{ marginTop: "1.5vh", width: "5vw", height: "0.5vh", background: "#e03e5c", borderRadius: "2px" }} />

        {/* Four problem cards in 2x2 grid */}
        <div style={{ marginTop: "5vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vh 3vw" }}>
          <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "3vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#e03e5c", marginBottom: "1vh" }}>01</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3, textWrap: "balance" }}>Uchenici tesko nalaze pomoc izvan nastave</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "3vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#e03e5c", marginBottom: "1vh" }}>02</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3, textWrap: "balance" }}>Nastavnici ne mogu pokriti sve individualne potrebe</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "3vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#e03e5c", marginBottom: "1vh" }}>03</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3, textWrap: "balance" }}>Znanje i materijali nestaju umjesto da se dijele</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "3vh 2.5vw", boxShadow: "0 2px 16px rgba(26,22,18,0.07)" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.2vw", color: "#e03e5c", marginBottom: "1vh" }}>04</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3vw", color: "#1a1612", lineHeight: 1.3, textWrap: "balance" }}>Angazman u skoli nije nagraden ni vidljiv</div>
          </div>
        </div>
      </div>
    </div>
  );
}
