export default function Slide9Outro() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#1a8a72" }}>
      {/* Decorative circles */}
      <div className="absolute" style={{ top: "-10vh", right: "-6vw", width: "42vw", height: "42vw", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div className="absolute" style={{ bottom: "-12vh", left: "-8vw", width: "38vw", height: "38vw", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div className="absolute" style={{ top: "20vh", right: "6vw", width: "10vw", height: "10vw", borderRadius: "50%", background: "#d97706", opacity: 0.75 }} />
      <div className="absolute" style={{ bottom: "20vh", left: "40vw", width: "5vw", height: "5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />

      {/* Main content — centered */}
      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "80vw" }}>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "10vw", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
          Peer<span style={{ color: "#d97706" }}>Up</span>
        </div>
        <div style={{ marginTop: "3vh", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "8vw", height: "0.5vh", background: "#d97706", borderRadius: "2px" }} />
        </div>
        <div style={{ marginTop: "3.5vh", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "3.8vw", color: "rgba(255,255,255,0.95)", lineHeight: 1.3, textWrap: "balance" }}>
          Ucimo zajedno. Rastemo zajedno.
        </div>
        <div style={{ marginTop: "4vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3.2vw", color: "rgba(255,255,255,0.72)", lineHeight: 1.5, textWrap: "balance" }}>
          PeerUp je spreman za OS Centar, Rijeka.
        </div>
        <div style={{ marginTop: "1.5vh", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "3.2vw", color: "rgba(255,255,255,0.72)", lineHeight: 1.5, textWrap: "balance" }}>
          Svaki ucenik koji pomogne — zaradzuje. Svako znanje koje se podijeli — ostaje.
        </div>

        {/* Feature pills row */}
        <div style={{ marginTop: "5vh", display: "flex", justifyContent: "center", gap: "2vw", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "99px", padding: "1vh 2vw", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.6vw", color: "#fff" }}>Ucimo zajedno</div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "99px", padding: "1vh 2vw", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.6vw", color: "#fff" }}>Biljezke i mape</div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "99px", padding: "1vh 2vw", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.6vw", color: "#fff" }}>Skolski buvljak</div>
          <div style={{ background: "rgba(217,119,6,0.5)", borderRadius: "99px", padding: "1vh 2vw", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "2.6vw", color: "#fff" }}>Bodovi i nagrade</div>
        </div>
      </div>
    </div>
  );
}
