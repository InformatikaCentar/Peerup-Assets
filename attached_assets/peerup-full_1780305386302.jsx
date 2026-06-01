import { useState, useRef, useEffect } from "react";

// ─── DIZAJN TOKENI ─────────────────────────────────────────────────────────────
const C = {
  bg:"#f7f3ee", bgDeep:"#efe9e0", card:"#ffffff", cardBorder:"#e8e0d5",
  ink:"#1a1612", inkMid:"#5c5146", inkLight:"#9e9184",
  teal:"#1a8a72", tealLight:"#d4f0e8",
  amber:"#d97706", amberLight:"#fef3c7",
  rose:"#e03e5c", roseLight:"#ffe4ea",
  blue:"#2563eb", blueLight:"#dbeafe",
  plum:"#7c3aed", plumLight:"#ede9fe",
  red:"#dc2626", redLight:"#fee2e2",
  green:"#16a34a", greenLight:"#dcfce7",
};

const PREDMETI = ["Matematika","Hrvatski","Engleski","Priroda","Povijest","Zemljopis","Fizika","Kemija","Biologija","Informatika","Glazbena","Likovna","TZK"];
const RAZREDI  = ["1.","2.","3.","4.","5.","6.","7.","8."];
const DANI     = ["Pon","Uto","Sri","Čet","Pet"];
const SATI     = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00"];

const LEKCIJE = {
  Matematika:["Razlomci","Decimalni brojevi","Postoci","Jednadžbe","Geometrija","Površina i opseg","Potencije","Kvadratne jednadžbe"],
  Hrvatski:["Glagolska vremena","Imenice i padeži","Opis osobe","Bajka","Roman","Pravopis","Sintaksa","Lektira"],
  Engleski:["Present Perfect","Past Simple","Conditionals","Vocabulary – travel","Reading comprehension","Future tenses"],
  Priroda:["Biljne stanice","Fotosinteza","Ekosustav","Tlo i voda"],
  Povijest:["Stari Egipat","Antička Grčka","Rimsko Carstvo","Srednji vijek","Hrvatska povijest"],
  Zemljopis:["Kontinenti","Klima","Reljef Hrvatske","Europa"],
  Fizika:["Sila i gibanje","Energija","Električna struja","Optika","Toplina"],
  Kemija:["Atomi i molekule","Periodni sustav","Kiseline i baze","Kemijske reakcije"],
  Biologija:["Stanica","Nasljeđivanje","Evolucija","Organski sustavi"],
  Informatika:["Algoritmi","Scratch","micro:bit","Baze podataka","Internetska sigurnost"],
  Glazbena:["Note i ritam","Instrumenti","Skladatelji"],
  Likovna:["Perspektiva","Boje","Skulptura"],
  TZK:["Atletika","Plivanje","Košarka","Gimnastika"],
};

// ─── POČETNI PODACI ────────────────────────────────────────────────────────────
const INIT_CLANOVI = [
  { id:1,  ime:"Marko",  prezime:"Horvat",   uloga:"admin",   razred:null, predmeti:[],                     aktivan:true,  kod:"ADMIN001", lozinka:"admin123", avatar:"👨‍💼", bodovi:0   },
  { id:2,  ime:"Ivana",  prezime:"Kovač",    uloga:"ucitelj", razred:null, predmeti:["Matematika","Fizika"], aktivan:true,  kod:"UCT-MAT1", lozinka:"ucit123",  avatar:"👩‍🏫", bodovi:0   },
  { id:3,  ime:"Petra",  prezime:"Novak",    uloga:"ucitelj", razred:null, predmeti:["Hrvatski","Likovna"],  aktivan:true,  kod:"UCT-HRV1", lozinka:"ucit456",  avatar:"👩‍🏫", bodovi:0   },
  { id:5,  ime:"Luka",   prezime:"Marić",    uloga:"ucenik",  razred:"7.", predmeti:[],                     aktivan:true,  kod:"UCE-7-01", lozinka:"luka2024", avatar:"🧑‍🎓", bodovi:142 },
  { id:6,  ime:"Ana",    prezime:"Kolar",    uloga:"ucenik",  razred:"5.", predmeti:[],                     aktivan:true,  kod:"UCE-5-01", lozinka:"ana2024",  avatar:"👩‍🎓", bodovi:98  },
  { id:7,  ime:"Tin",    prezime:"Babić",    uloga:"ucenik",  razred:"8.", predmeti:[],                     aktivan:true,  kod:"UCE-8-01", lozinka:"tin2024",  avatar:"🧑",   bodovi:210 },
  { id:8,  ime:"Sara",   prezime:"Petrić",   uloga:"ucenik",  razred:"3.", predmeti:[],                     aktivan:true,  kod:"UCE-3-01", lozinka:"sara2024", avatar:"👧",   bodovi:55  },
  { id:9,  ime:"Mia",    prezime:"Lučić",    uloga:"ucenik",  razred:"6.", predmeti:[],                     aktivan:false, kod:"UCE-6-01", lozinka:"mia2024",  avatar:"👩",   bodovi:74  },
];
const VALJANI_KODOVI_UCENIKA  = ["UCE-7-02","UCE-5-02","UCE-8-02","UCE-3-02","UCE-4-01","UCE-6-02"];
const VALJANI_KODOVI_UCITELJA = ["UCT-BIO1","UCT-GEO1","UCT-INF1"];

// ─── DEMO PODACI ───────────────────────────────────────────────────────────────
const DEMO_PONUDE = [
  { id:101, ime:"Luka M.",  razred:"7.", predmet:"Matematika", lekcija:"Jednadžbe",        opis:"Mogu objasniti linearne jednadžbe korak po korak. Rješavali smo ih ove godine i super mi ide!", avatar:"🧑‍🎓", bodovi:142, tip:"nudi",  ocjena:4.8, termini:[{dan:"Pon",sat:"10:00",slobodan:true},{dan:"Sri",sat:"11:00",slobodan:false},{dan:"Pet",sat:"13:00",slobodan:true}], prijave:["Ana K.","Sara P."] },
  { id:102, ime:"Ana K.",   razred:"5.", predmet:"Engleski",   lekcija:"Present Perfect",  opis:"Tečno pričam engleski, živjela sam u Irskoj 2 godine. Mogu pomoći s gramatikom i konverzacijom.", avatar:"👩‍🎓", bodovi:98,  tip:"nudi",  ocjena:4.9, termini:[{dan:"Uto",sat:"12:00",slobodan:true},{dan:"Čet",sat:"9:00",slobodan:true}], prijave:["Tin B."] },
  { id:103, ime:"Tin B.",   razred:"8.", predmet:"Fizika",     lekcija:"Sila i gibanje",   opis:"Natjecam se iz fizike, prošao sam okružno natjecanje. Mogu pomoći s teorijom i zadacima.", avatar:"🧑",   bodovi:210, tip:"nudi",  ocjena:5.0, termini:[{dan:"Pon",sat:"11:00",slobodan:true},{dan:"Sri",sat:"14:00",slobodan:true},{dan:"Pet",sat:"10:00",slobodan:false}], prijave:[] },
  { id:104, ime:"Sara P.",  razred:"3.", predmet:"Hrvatski",   lekcija:"Glagolska vremena",opis:"Ne razumijem dobro glagolska vremena, posebno aorist i imperfekt. Trebam nekoga da mi objasni.", avatar:"👧",   bodovi:55,  tip:"traži", ocjena:null, termini:[{dan:"Uto",sat:"10:00",slobodan:true},{dan:"Čet",sat:"13:00",slobodan:true}], prijave:["Luka M."] },
  { id:105, ime:"Mia L.",   razred:"6.", predmet:"Kemija",     lekcija:"Kiseline i baze",  opis:"Trebam pomoć s razumijevanjem pH ljestvice i kemijskih reakcija. Pišemo test za tjedan dana.", avatar:"👩",   bodovi:74,  tip:"traži", ocjena:null, termini:[{dan:"Sri",sat:"9:00",slobodan:true}], prijave:[] },
];

const DEMO_MATERIJALI = [
  { id:201, autor:"Luka M.",  predmet:"Matematika", lekcija:"Jednadžbe",        tip:"Umna mapa", ikona:"🗺️", preuzimanja:23, avatar:"🧑‍🎓", datum:"28.5.2026", opis:"Vizualni prikaz svih koraka rješavanja linearnih jednadžbi s jednom nepoznanicom." },
  { id:202, autor:"Ana K.",   predmet:"Engleski",   lekcija:"Present Perfect",  tip:"Sažetak",   ikona:"📄", preuzimanja:41, avatar:"👩‍🎓", datum:"27.5.2026", opis:"Tablica s primjerima, signal words i usporedbom s Past Simple." },
  { id:203, autor:"Tin B.",   predmet:"Fizika",     lekcija:"Sila i gibanje",   tip:"Bilješke",  ikona:"📝", preuzimanja:18, avatar:"🧑",   datum:"25.5.2026", opis:"Zapisao sam sve formule i riješene zadatke s kojima smo se susreli na natjecanju." },
  { id:204, autor:"Ela T.",   predmet:"Biologija",  lekcija:"Stanica",          tip:"Umna mapa", ikona:"🗺️", preuzimanja:9,  avatar:"👩",   datum:"24.5.2026", opis:"Dijelovi stanice, razlika biljne i životinjske – idealno za pripremu ispita." },
  { id:205, autor:"Noa B.",   predmet:"Hrvatski",   lekcija:"Lektira",          tip:"Sažetak",   ikona:"📄", preuzimanja:34, avatar:"🧒",   datum:"22.5.2026", opis:"Kratki sažetak Kiklopa s likovima, temama i citatima." },
];

const DEMO_RAZMJENA = [
  { id:301, korisnik:"Mia L.",  tip:"Donacija", predmet:"Harry Potter 1-3", kat:"Knjige",  ikona:"📚", svjezina:null,         opis:"Sve tri knjige u odličnom stanju, čitane jednom. Donacija za ljubitelje čitanja!" },
  { id:302, korisnik:"Ivo R.",  tip:"Razmjena", predmet:"Zimska jakna, vel. 146", kat:"Odjeća", ikona:"🧥", svjezina:null,   opis:"Tražim u zamjenu sportsku opremu, vel. 146-152. Jakna korištena jednu sezonu." },
  { id:303, korisnik:"Ela T.",  tip:"Donacija", predmet:"Domaći kolačići 🍪", kat:"Hrana",  ikona:"🍪", svjezina:"2 dana",   opis:"Mama napravila previše za školski ručak. Tko želi, slobodno uzme do četvrtka!" },
  { id:304, korisnik:"Noa S.",  tip:"Razmjena", predmet:"Lego City set (komplet)", kat:"Igračke", ikona:"🧩", svjezina:null, opis:"Kompletirani Lego City sa svim dijelovima i uputama. Tražim u zamjenu Lego Technic." },
  { id:305, korisnik:"Karlo D.",tip:"Donacija", predmet:"Geografski atlas 2024", kat:"Knjige", ikona:"🗺️", svjezina:null,    opis:"Novo izdanje atlasa, potpuno nov, nisam stigao koristiti jer sam dobio digitalni." },
];

const DEMO_PRICE = [
  { id:401, korisnik:"Filip G.", razred:"7.", avatar:"⚽", tag:"Sport",     naslov:"Prvak županije u plivanju!", sadrzaj:"Osvojio sam zlatnu medalju na županijskom natjecanju u plivanju na 100m slobodnim stilom! Tri godine treninga i rano ustajanje na 5:30 su se konačno isplatili 🏅 Hvala svim prijateljima i profesorici TZK-a na podršci!", lajkovi:47, komentari:["Bravo Filip! 🔥","Zaslužena medalja!","Nevjerojatno, čestitke!"], vrijeme:"2h" },
  { id:402, korisnik:"Petra V.", razred:"5.", avatar:"🎨", tag:"Kreativno", naslov:"Moja prva uljana slika",   sadrzaj:"Nakon 6 mjeseci vježbanja konačno sam završila prvu pravu uljanu sliku. Slikam krajolik Plitvičkih jezera. Izlažem je na školskoj izložbi sljedeći tjedan – vidimo se!", lajkovi:31, komentari:["Prelijepo!","Divna slika ❤️"], vrijeme:"5h" },
  { id:403, korisnik:"Karlo D.", razred:"8.", avatar:"🏆", tag:"Uspjeh",    naslov:"Matematička olimpijada – 2. mjesto!", sadrzaj:"Predstavljao sam školu na županijskoj Matematičkoj olimpijadi i osvojio 2. mjesto! Ogromna zahvala Tinu B. koji mi je dva tjedna strpljivo objašnjavao teške zadatke 💪 Ovo je naša zajednička pobjeda!", lajkovi:89, komentari:["Legend! 👏","Zaslužio si!","Bravo vas dvojica!"], vrijeme:"1 dan" },
  { id:404, korisnik:"Mia L.",   razred:"4.", avatar:"🎵", tag:"Kreativno", naslov:"Koncert glazbene škole",   sadrzaj:"Jučer sam nastupila na godišnjem koncertu glazbene škole i svirala Chopina pred punom dvoranom! Bila sam jako nervozna ali je sve prošlo super 🎹", lajkovi:52, komentari:["Wow, Chopin!!! 😍","Bravo Mia!"], vrijeme:"2 dana" },
];

const DEMO_LJESTVICA = [
  { r:1, ime:"Tin B.",   razred:"8.", bodovi:210, avatar:"🧑",   bed:"🥇", sati:14, donacije:3 },
  { r:2, ime:"Luka M.",  razred:"7.", bodovi:142, avatar:"🧑‍🎓", bed:"🥈", sati:8,  donacije:5 },
  { r:3, ime:"Ana K.",   razred:"5.", bodovi:98,  avatar:"👩‍🎓", bed:"🥉", sati:6,  donacije:2 },
  { r:4, ime:"Mia L.",   razred:"6.", bodovi:74,  avatar:"👩",   bed:null, sati:3,  donacije:7 },
  { r:5, ime:"Filip G.", razred:"7.", bodovi:61,  avatar:"⚽",   bed:null, sati:2,  donacije:4 },
  { r:6, ime:"Sara P.",  razred:"3.", bodovi:55,  avatar:"👧",   bed:null, sati:1,  donacije:6 },
];

const DEMO_IZAZOVI = [
  { id:1, naslov:"Pomozi kolegi ovaj tjedan",     bodovi:15, ikona:"🤝", gotovo:false },
  { id:2, naslov:"Doniraj predmet ili hranu",      bodovi:10, ikona:"📦", gotovo:true  },
  { id:3, naslov:"Ostavi 3 lijepa komentara",     bodovi:5,  ikona:"💬", gotovo:false },
  { id:4, naslov:"Podijeli bilješku ili umnu mapu",bodovi:8,  ikona:"📝", gotovo:true  },
  { id:5, naslov:"Rezerviraj termin instrukcija",  bodovi:5,  ikona:"📅", gotovo:false },
];

// ─── UTILITY ──────────────────────────────────────────────────────────────────
const Pill = ({ label, color, bg, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:bg, color, borderRadius:999, padding:"3px 10px", fontSize:11, fontWeight:700, letterSpacing:0.3, ...style }}>{label}</span>
);
const Card = ({ children, style={}, accent, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:16, padding:16, marginBottom:12, borderLeft:accent?`4px solid ${accent}`:undefined, boxShadow:"0 2px 8px #1a16120a", cursor:onClick?"pointer":undefined, ...style }}>{children}</div>
);
const Btn = ({ label, color=C.teal, textColor=C.card, onClick, full, disabled, outline, small }) => (
  <button onClick={onClick} disabled={disabled} style={{ background:outline?"transparent":disabled?C.bgDeep:color, color:outline?color:disabled?C.inkLight:textColor, border:outline?`2px solid ${color}`:"none", borderRadius:10, padding:small?"6px 12px":"10px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:small?12:14, cursor:disabled?"default":"pointer", width:full?"100%":"auto", opacity:disabled?0.6:1, transition:"all 0.15s" }}>{label}</button>
);
const FInp = ({ label, type="text", value, onChange, placeholder, icon, error }) => (
  <div style={{ marginBottom:14 }}>
    {label && <p style={{ margin:"0 0 6px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{label}</p>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${error?C.red:value?C.teal:C.cardBorder}`, borderRadius:10, padding:icon?"10px 12px 10px 42px":"10px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, boxSizing:"border-box", outline:"none" }} />
    </div>
    {error && <p style={{ margin:"4px 0 0", fontSize:11, color:C.red, fontWeight:700 }}>⚠ {error}</p>}
  </div>
);
const Div = () => <div style={{ height:1, background:C.cardBorder, margin:"10px 0" }} />;
const ulogaBoja = u => ({ admin:{color:C.plum,bg:C.plumLight,label:"Admin"}, ucitelj:{color:C.blue,bg:C.blueLight,label:"Učitelj"}, ucenik:{color:C.teal,bg:C.tealLight,label:"Učenik"} }[u]||{color:C.inkLight,bg:C.bgDeep,label:u});

// ─── KALENDAR MODAL ───────────────────────────────────────────────────────────
function KalendarModal({ naslov="📅 Odaberi termin", dostupniTermini, onClose, onPotvrdi }) {
  const [dan, setDan]   = useState(null);
  const [sat, setSat]   = useState(null);

  // Ako ima dostupnih termina, prikazujemo samo te
  const filterDani = dostupniTermini ? [...new Set(dostupniTermini.filter(t=>t.slobodan).map(t=>t.dan))] : DANI;
  const filterSati = dan && dostupniTermini
    ? dostupniTermini.filter(t=>t.dan===dan && t.slobodan).map(t=>t.sat)
    : SATI;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, border:`1.5px solid ${C.cardBorder}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>{naslov}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>
        <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
          {dostupniTermini ? "Slobodni termini ponuditelja" : "Dan"}
        </p>
        <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
          {filterDani.map(d=>(
            <button key={d} onClick={()=>{setDan(d);setSat(null);}} style={{ flex:"0 0 auto", padding:"8px 14px", borderRadius:10, border:`2px solid ${dan===d?C.teal:C.cardBorder}`, background:dan===d?C.tealLight:C.bg, color:dan===d?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{d}</button>
          ))}
        </div>
        {dan && (
          <>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Sat</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:18 }}>
              {filterSati.map(s=>(
                <button key={s} onClick={()=>setSat(s)} style={{ padding:"10px 0", borderRadius:10, border:`2px solid ${sat===s?C.blue:C.cardBorder}`, background:sat===s?C.blueLight:C.bg, color:sat===s?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{s}</button>
              ))}
            </div>
          </>
        )}
        <Btn label={dan&&sat?`✓ Potvrdi — ${dan} u ${sat}`:"Odaberi dan i sat"} color={C.teal} full disabled={!dan||!sat} onClick={()=>dan&&sat&&onPotvrdi(dan,sat)} />
      </div>
    </div>
  );
}

// ─── NOVA PONUDA MODAL ────────────────────────────────────────────────────────
function NovaPonudaModal({ korisnik, onClose, onDodaj }) {
  const [korak, setKorak]       = useState(1);
  const [tipPonude, setTipPonude] = useState("nudi");
  const [predmet, setPredmet]   = useState("Matematika");
  const [razred, setRazred]     = useState(korisnik.razred || "7.");
  const [lekcija, setLekcija]   = useState("");
  const [lekcijaRucno, setLekcijaRucno] = useState("");
  const [opis, setOpis]         = useState("");
  const [odabraniTermini, setOdabraniTermini] = useState([]);
  const [kalModal, setKalModal] = useState(false);
  const [gotovo, setGotovo]     = useState(false);

  const dodajTermin = (dan, sat) => {
    if (!odabraniTermini.find(t=>t.dan===dan&&t.sat===sat)) {
      setOdabraniTermini(prev=>[...prev,{dan,sat,slobodan:true}]);
    }
    setKalModal(false);
  };
  const ukloniTermin = (i) => setOdabraniTermini(prev=>prev.filter((_,idx)=>idx!==i));

  const objavi = () => {
    const finLekcija = lekcija==="__ostalo__" ? lekcijaRucno : lekcija;
    const novaPonuda = {
      id: Date.now(),
      ime: `${korisnik.ime} ${korisnik.prezime[0]}.`,
      razred, predmet, lekcija: finLekcija, opis,
      avatar: korisnik.avatar, bodovi: korisnik.bodovi,
      tip: tipPonude, ocjena: null,
      termini: odabraniTermini,
      prijave: [],
    };
    onDodaj(novaPonuda);
    setGotovo(true);
    setTimeout(onClose, 1800);
  };

  if (gotovo) return (
    <div style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.card, borderRadius:20, padding:32, maxWidth:340, textAlign:"center" }}>
        <div style={{ fontSize:56 }}>🎉</div>
        <h3 style={{ color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>Objavljeno!</h3>
        <p style={{ color:C.inkMid, fontSize:13 }}>Tvoja objava je vidljiva svim učenicima. Zarađuješ <strong>+10 bodova</strong> kad se sat održi!</p>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      {kalModal && <KalendarModal naslov="📅 Dodaj slobodni termin" onClose={()=>setKalModal(false)} onPotvrdi={dodajTermin} />}
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>
            {korak===1?"📋 Nova objava":"📅 Termini"}
          </h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:18 }}>
          {[1,2,3].map(k=><div key={k} style={{ flex:1, height:4, borderRadius:99, background:k<=korak?C.teal:C.cardBorder, transition:"background 0.3s" }} />)}
        </div>

        {/* Korak 1: tip + predmet + razred */}
        {korak===1 && (
          <>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Ja</p>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {["nudi","traži"].map(t=>(
                <button key={t} onClick={()=>setTipPonude(t)} style={{ flex:1, padding:"10px 0", borderRadius:12, border:`2px solid ${tipPonude===t?(t==="nudi"?C.teal:C.rose):C.cardBorder}`, background:tipPonude===t?(t==="nudi"?C.tealLight:C.roseLight):C.bg, color:tipPonude===t?(t==="nudi"?C.teal:C.rose):C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                  {t==="nudi"?"🙋 Nudim pomoć":"🤔 Tražim pomoć"}
                </button>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Razred</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
              {RAZREDI.map(r=>(
                <button key={r} onClick={()=>setRazred(r)} style={{ padding:"7px 14px", borderRadius:9, border:`2px solid ${razred===r?C.blue:C.cardBorder}`, background:razred===r?C.blueLight:C.bg, color:razred===r?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{r} razred</button>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Predmet</p>
            <select value={predmet} onChange={e=>{setPredmet(e.target.value);setLekcija("");}} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:16, outline:"none" }}>
              {PREDMETI.map(p=><option key={p}>{p}</option>)}
            </select>
            <Btn label="Dalje →" color={C.teal} full onClick={()=>setKorak(2)} />
          </>
        )}

        {/* Korak 2: lekcija + opis */}
        {korak===2 && (
          <>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Nastavna cjelina / Lekcija</p>
            <select value={lekcija} onChange={e=>setLekcija(e.target.value)} style={{ width:"100%", background:C.bg, color:lekcija?C.ink:C.inkLight, border:`1.5px solid ${lekcija?C.teal:C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:8, outline:"none" }}>
              <option value="">— Odaberi lekciju —</option>
              {(LEKCIJE[predmet]||[]).map(l=><option key={l}>{l}</option>)}
              <option value="__ostalo__">Ostalo (upiši ručno)</option>
            </select>
            {lekcija==="__ostalo__" && (
              <input value={lekcijaRucno} onChange={e=>setLekcijaRucno(e.target.value)} placeholder="Upiši naziv lekcije..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.teal}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, boxSizing:"border-box", marginBottom:8, outline:"none" }} />
            )}
            <p style={{ margin:"14px 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Opis (što znaš / što trebaš)</p>
            <textarea rows={4} value={opis} onChange={e=>setOpis(e.target.value)} placeholder="npr. Mogu objasniti rješavanje linearnih jednadžbi s jednom nepoznanicom, radili smo to ove godine i odlično mi ide..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            <div style={{ display:"flex", gap:8 }}>
              <Btn label="← Natrag" color={C.inkLight} outline onClick={()=>setKorak(1)} />
              <Btn label="Dalje →" color={C.teal} disabled={!lekcija||(lekcija==="__ostalo__"&&!lekcijaRucno)} onClick={()=>setKorak(3)} />
            </div>
          </>
        )}

        {/* Korak 3: termini */}
        {korak===3 && (
          <>
            <p style={{ margin:"0 0 4px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Slobodni termini</p>
            <p style={{ margin:"0 0 12px", fontSize:12, color:C.inkMid }}>Dodaj jedan ili više termina kada možeš. Zainteresirani učenici odabrat će jedan od tvojih termina.</p>

            {odabraniTermini.length > 0 && (
              <div style={{ marginBottom:12 }}>
                {odabraniTermini.map((t,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.tealLight, border:`1.5px solid ${C.teal}44`, borderRadius:10, padding:"8px 12px", marginBottom:6 }}>
                    <span style={{ color:C.teal, fontWeight:800, fontSize:14 }}>📅 {t.dan} u {t.sat}</span>
                    <button onClick={()=>ukloniTermin(i)} style={{ background:"none", border:"none", color:C.rose, cursor:"pointer", fontWeight:800, fontSize:16 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={()=>setKalModal(true)} style={{ width:"100%", padding:14, borderRadius:12, border:`2px dashed ${C.blue}`, background:C.blueLight, color:C.blue, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:16 }}>
              + Dodaj termin
            </button>

            {/* Sažetak */}
            {odabraniTermini.length>0 && (
              <Card style={{ background:C.bgDeep, border:`1.5px solid ${C.cardBorder}`, marginBottom:16 }}>
                <div style={{ fontSize:12, color:C.teal, fontWeight:700, marginBottom:4 }}>Tvoja objava:</div>
                <div style={{ color:C.ink, fontWeight:800 }}>{predmet} · {razred} razred</div>
                <div style={{ color:C.inkMid, fontSize:13 }}>📖 {lekcija==="__ostalo__"?lekcijaRucno:lekcija}</div>
                {opis && <div style={{ color:C.inkMid, fontSize:12, marginTop:4, fontStyle:"italic" }}>"{opis.slice(0,60)}{opis.length>60?"...":""}"</div>}
                <div style={{ marginTop:8 }}>
                  {odabraniTermini.map((t,i)=><Pill key={i} label={`${t.dan} ${t.sat}`} color={C.teal} bg={C.tealLight} style={{ marginRight:4 }} />)}
                </div>
              </Card>
            )}

            <div style={{ display:"flex", gap:8 }}>
              <Btn label="← Natrag" color={C.inkLight} outline onClick={()=>setKorak(2)} />
              <Btn label="🚀 Objavi!" color={C.teal} disabled={odabraniTermini.length===0} onClick={objavi} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── DETALJI PONUDE MODAL ─────────────────────────────────────────────────────
function DetaljiPonudeModal({ ponuda, korisnik, onClose, onRezervacija }) {
  const [kalModal, setKalModal]   = useState(false);
  const [rezervirano, setRezervirano] = useState(null);

  const slobodniTermini = ponuda.termini.filter(t=>t.slobodan);

  const potvrdiRezervaciju = (dan, sat) => {
    setRezervirano(`${dan} u ${sat}`);
    setKalModal(false);
    onRezervacija(ponuda.id, dan, sat);
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      {kalModal && <KalendarModal naslov="📅 Odaberi slobodni termin" dostupniTermini={ponuda.termini} onClose={()=>setKalModal(false)} onPotvrdi={potvrdiRezervaciju} />}
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:22, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📋 Detalji ponude</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>

        {/* Profil ponuditelja */}
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:48 }}>{ponuda.avatar}</div>
          <div>
            <div style={{ fontWeight:900, fontSize:18, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>{ponuda.ime}</div>
            <div style={{ color:C.inkMid, fontSize:13 }}>{ponuda.razred} razred</div>
            {ponuda.ocjena && <div style={{ color:C.amber, fontWeight:700 }}>{"★".repeat(Math.floor(ponuda.ocjena))} {ponuda.ocjena}</div>}
          </div>
        </div>

        {/* Predmet i lekcija */}
        <Card style={{ background:C.bgDeep, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <Pill label={ponuda.predmet} color={C.blue} bg={C.blueLight} />
            <Pill label={ponuda.tip==="nudi"?"Nudi pomoć":"Traži pomoć"} color={ponuda.tip==="nudi"?C.teal:C.rose} bg={ponuda.tip==="nudi"?C.tealLight:C.roseLight} />
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>📖</span>
            <div>
              <div style={{ fontSize:10, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Lekcija</div>
              <div style={{ color:C.ink, fontWeight:800, fontSize:15 }}>{ponuda.lekcija}</div>
            </div>
          </div>
        </Card>

        {/* Opis */}
        {ponuda.opis && (
          <div style={{ background:C.bgDeep, borderRadius:12, padding:"10px 14px", marginBottom:14 }}>
            <div style={{ fontSize:11, color:C.inkLight, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Opis</div>
            <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.6 }}>{ponuda.opis}</div>
          </div>
        )}

        {/* Slobodni termini */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Slobodni termini</div>
          {slobodniTermini.length===0
            ? <div style={{ color:C.inkLight, fontSize:13, fontStyle:"italic" }}>Nema slobodnih termina.</div>
            : <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {slobodniTermini.map((t,i)=>(
                  <div key={i} style={{ background:C.tealLight, border:`1.5px solid ${C.teal}44`, borderRadius:10, padding:"8px 14px", color:C.teal, fontWeight:800, fontSize:13 }}>
                    📅 {t.dan} u {t.sat}
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Rezervacija */}
        {rezervirano ? (
          <div style={{ background:C.greenLight, border:`1.5px solid ${C.green}44`, borderRadius:12, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:32 }}>✅</div>
            <div style={{ color:C.green, fontWeight:900, fontFamily:"'Nunito', sans-serif" }}>Rezervirano!</div>
            <div style={{ color:C.inkMid, fontSize:13, marginTop:4 }}>Termin: <strong>{rezervirano}</strong></div>
            <div style={{ color:C.inkMid, fontSize:12, marginTop:4 }}>Ponuditelj je obaviješten o tvojoj rezervaciji.</div>
          </div>
        ) : (
          slobodniTermini.length > 0 && (
            <Btn label="📅 Rezerviraj termin" color={ponuda.tip==="nudi"?C.teal:C.rose} full onClick={()=>setKalModal(true)} />
          )
        )}

        {/* Prijave (vidljivo samo ponuditelju) */}
        {ponuda.prijave && ponuda.prijave.length > 0 && (
          <div style={{ marginTop:14, background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:12, padding:12 }}>
            <div style={{ color:C.amber, fontWeight:800, fontSize:13, marginBottom:6 }}>🔔 Zainteresirani učenici:</div>
            {ponuda.prijave.map((p,i)=>(
              <div key={i} style={{ color:C.ink, fontSize:13, fontWeight:700, padding:"4px 0" }}>👤 {p}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TAB: UČIMO ZAJEDNO ───────────────────────────────────────────────────────
function UcimoZajedno({ korisnik, ponude, setPonude }) {
  const [predFilter, setPredFilter] = useState("Svi");
  const [razFilter, setRazFilter]   = useState("Svi");
  const [novaModal, setNovaModal]   = useState(false);
  const [detaljiModal, setDetaljiModal] = useState(null);

  const filtered = ponude.filter(p=>
    (predFilter==="Svi"||p.predmet===predFilter) &&
    (razFilter==="Svi"||p.razred===razFilter)
  );

  const rezerviraj = (ponudaId, dan, sat) => {
    setPonude(prev=>prev.map(p=>p.id===ponudaId ? {
      ...p,
      termini: p.termini.map(t=>t.dan===dan&&t.sat===sat ? {...t,slobodan:false} : t),
      prijave: [...(p.prijave||[]), `${korisnik.ime} ${korisnik.prezime[0]}.`],
    } : p));
    // Ažuriraj detalji modal
    setDetaljiModal(prev=>prev ? {...prev,
      termini: prev.termini.map(t=>t.dan===dan&&t.sat===sat?{...t,slobodan:false}:t),
      prijave: [...(prev.prijave||[]), `${korisnik.ime} ${korisnik.prezime[0]}.`],
    } : null);
  };

  return (
    <div>
      {novaModal && <NovaPonudaModal korisnik={korisnik} onClose={()=>setNovaModal(false)} onDodaj={nova=>setPonude(prev=>[nova,...prev])} />}
      {detaljiModal && <DetaljiPonudeModal ponuda={detaljiModal} korisnik={korisnik} onClose={()=>setDetaljiModal(null)} onRezervacija={rezerviraj} />}

      <div style={{ padding:"0 16px 12px", display:"flex", gap:8 }}>
        <Btn label="➕ Objavi ponudu" color={C.teal} onClick={()=>setNovaModal(true)} />
        <Btn label="🔍 Traži pomoć" color={C.rose} onClick={()=>setNovaModal(true)} />
      </div>

      <div style={{ padding:"0 16px 6px", overflowX:"auto", display:"flex", gap:6, paddingBottom:8 }}>
        {["Svi",...PREDMETI.slice(0,7)].map(p=>(
          <button key={p} onClick={()=>setPredFilter(p)} style={{ background:predFilter===p?C.teal:C.bgDeep, color:predFilter===p?C.card:C.inkMid, border:`1.5px solid ${predFilter===p?C.teal:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{p}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px 12px", overflowX:"auto", display:"flex", gap:6 }}>
        {["Svi",...RAZREDI].map(r=>(
          <button key={r} onClick={()=>setRazFilter(r)} style={{ background:razFilter===r?C.blue:C.bgDeep, color:razFilter===r?C.card:C.inkMid, border:`1.5px solid ${razFilter===r?C.blue:C.cardBorder}`, borderRadius:99, padding:"5px 11px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{r==="Svi"?"Svi razredi":`${r} razred`}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {filtered.length===0 && <div style={{ textAlign:"center", color:C.inkLight, padding:32 }}>Nema rezultata za odabrane filtre.</div>}
        {filtered.map(p=>(
          <Card key={p.id} accent={p.tip==="nudi"?C.teal:C.rose} onClick={()=>setDetaljiModal(p)}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ fontSize:36 }}>{p.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ color:C.ink, fontWeight:800, fontSize:15, fontFamily:"'Nunito', sans-serif" }}>{p.ime}</div>
                    <div style={{ color:C.inkMid, fontSize:12 }}>{p.razred} razred · {p.predmet}</div>
                  </div>
                  <Pill label={p.tip==="nudi"?"Nudi pomoć":"Traži pomoć"} color={p.tip==="nudi"?C.teal:C.rose} bg={p.tip==="nudi"?C.tealLight:C.roseLight} />
                </div>

                <div style={{ marginTop:8, background:C.bgDeep, borderRadius:8, padding:"7px 10px", display:"flex", gap:6 }}>
                  <span>📖</span>
                  <div>
                    <div style={{ fontSize:10, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Lekcija</div>
                    <div style={{ color:C.ink, fontWeight:700, fontSize:13 }}>{p.lekcija}</div>
                  </div>
                </div>

                {p.opis && <div style={{ marginTop:6, color:C.inkMid, fontSize:12, lineHeight:1.5 }}>{p.opis.slice(0,80)}{p.opis.length>80?"...":""}</div>}

                {/* Termini preview */}
                {p.termini && p.termini.length>0 && (
                  <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                    {p.termini.filter(t=>t.slobodan).slice(0,3).map((t,i)=>(
                      <Pill key={i} label={`${t.dan} ${t.sat}`} color={C.teal} bg={C.tealLight} />
                    ))}
                    {p.termini.filter(t=>t.slobodan).length===0 && <Pill label="Nema slobodnih termina" color={C.inkLight} bg={C.bgDeep} />}
                  </div>
                )}

                {/* Prijave notifikacija */}
                {p.prijave && p.prijave.length>0 && (
                  <div style={{ marginTop:8, background:C.amberLight, border:`1px solid ${C.amber}33`, borderRadius:8, padding:"6px 10px", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:16 }}>🔔</span>
                    <span style={{ color:C.amber, fontWeight:800, fontSize:12 }}>{p.prijave.length} zainteresiran{p.prijave.length===1?"":"ih"} učenik{p.prijave.length===1?"":"a"}</span>
                  </div>
                )}

                <div style={{ marginTop:10, display:"flex", gap:8, alignItems:"center" }}>
                  <Btn label="Detalji i rezervacija" color={p.tip==="nudi"?C.teal:C.rose} small onClick={e=>{e.stopPropagation();setDetaljiModal(p);}} />
                  <Pill label="⚡ +10" color={C.amber} bg={C.amberLight} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: BILJEŠKE I MAPE ─────────────────────────────────────────────────────
function BiljeskeIMape({ materijali, setMaterijali, korisnik }) {
  const [predFilter, setPredFilter] = useState("Svi");
  const [tipFilter, setTipFilter]   = useState("Svi");
  const [uploadModal, setUploadModal] = useState(false);
  const [preuzeto, setPreuzeto]       = useState([]);
  const fileRef = useRef(null);
  const [uPredmet, setUPredmet]   = useState("Matematika");
  const [uLekcija, setULekcija]   = useState("");
  const [uTip, setUTip]           = useState("Umna mapa");
  const [uOpis, setUOpis]         = useState("");
  const [uFile, setUFile]         = useState(null);
  const [uGotovo, setUGotovo]     = useState(false);

  const filtered = materijali.filter(m=>(predFilter==="Svi"||m.predmet===predFilter)&&(tipFilter==="Svi"||m.tip===tipFilter));

  const objavi = () => {
    const novi = { id:Date.now(), autor:`${korisnik.ime} ${korisnik.prezime[0]}.`, predmet:uPredmet, lekcija:uLekcija==="ostalo"?"Ostalo":uLekcija, tip:uTip, ikona:uTip==="Umna mapa"?"🗺️":uTip==="Sažetak"?"📄":"📝", preuzimanja:0, avatar:korisnik.avatar, datum:new Date().toLocaleDateString("hr-HR"), opis:uOpis };
    setMaterijali(prev=>[novi,...prev]);
    setUGotovo(true);
    setTimeout(()=>{setUploadModal(false);setUGotovo(false);setUFile(null);setUOpis("");setULekcija("");},1800);
  };

  return (
    <div>
      {uploadModal && (
        <div onClick={()=>{setUploadModal(false);setUGotovo(false);}} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
            {uGotovo ? (
              <div style={{ textAlign:"center", padding:24 }}>
                <div style={{ fontSize:56 }}>🎉</div>
                <h3 style={{ color:C.plum, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>Objavljeno!</h3>
                <p style={{ color:C.inkMid, fontSize:13 }}>Zahvaljujemo na dijeljenju znanja! Zarađuješ <strong>+8 bodova</strong>.</p>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📤 Podijeli materijal</h3>
                  <button onClick={()=>setUploadModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
                </div>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Vrsta materijala</p>
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  {["Umna mapa","Sažetak","Bilješke"].map(t=>(
                    <button key={t} onClick={()=>setUTip(t)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`2px solid ${uTip===t?C.plum:C.cardBorder}`, background:uTip===t?C.plumLight:C.bg, color:uTip===t?C.plum:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:11, cursor:"pointer" }}>
                      {t==="Umna mapa"?"🗺️ "+t:t==="Sažetak"?"📄 "+t:"📝 "+t}
                    </button>
                  ))}
                </div>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Predmet</p>
                <select value={uPredmet} onChange={e=>{setUPredmet(e.target.value);setULekcija("");}} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:14, outline:"none" }}>
                  {PREDMETI.map(p=><option key={p}>{p}</option>)}
                </select>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Lekcija</p>
                <select value={uLekcija} onChange={e=>setULekcija(e.target.value)} style={{ width:"100%", background:C.bg, color:uLekcija?C.ink:C.inkLight, border:`1.5px solid ${uLekcija?C.plum:C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:14, outline:"none" }}>
                  <option value="">— Odaberi lekciju —</option>
                  {(LEKCIJE[uPredmet]||[]).map(l=><option key={l}>{l}</option>)}
                  <option value="ostalo">Ostalo</option>
                </select>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Kratki opis</p>
                <textarea rows={2} value={uOpis} onChange={e=>setUOpis(e.target.value)} placeholder="Opiši što ovaj materijal pokriva..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:14, outline:"none" }} />
                <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.docx" onChange={e=>setUFile(e.target.files[0])} style={{ display:"none" }} />
                <button onClick={()=>fileRef.current?.click()} style={{ width:"100%", padding:14, borderRadius:12, border:`2px dashed ${uFile?C.plum:C.cardBorder}`, background:uFile?C.plumLight:C.bg, color:uFile?C.plum:C.inkLight, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", marginBottom:16 }}>
                  {uFile?`📎 ${uFile.name}`:"📎 Odaberi datoteku (PDF, slika, Word)"}
                </button>
                <Pill label="⚡ +8 bodova za dijeljenje!" color={C.amber} bg={C.amberLight} style={{ marginBottom:14, display:"block" }} />
                <Btn label="📤 Objavi materijal" color={C.plum} full disabled={!uLekcija||!uFile} onClick={objavi} />
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px 14px" }}>
        <button onClick={()=>setUploadModal(true)} style={{ width:"100%", background:`linear-gradient(135deg,${C.plum},#9333ea)`, color:C.card, border:"none", borderRadius:14, padding:14, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 4px 20px ${C.plum}44` }}>
          <span style={{ fontSize:20 }}>📤</span> Podijeli svoju umnu mapu ili sažetak
        </button>
      </div>

      <div style={{ padding:"0 16px 6px", overflowX:"auto", display:"flex", gap:6, paddingBottom:8 }}>
        {["Svi",...PREDMETI.slice(0,6)].map(p=>(
          <button key={p} onClick={()=>setPredFilter(p)} style={{ background:predFilter===p?C.plum:C.bgDeep, color:predFilter===p?C.card:C.inkMid, border:`1.5px solid ${predFilter===p?C.plum:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{p}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px 12px", display:"flex", gap:6 }}>
        {["Svi","Umna mapa","Sažetak","Bilješke"].map(t=>(
          <button key={t} onClick={()=>setTipFilter(t)} style={{ background:tipFilter===t?C.bgDeep:"transparent", color:tipFilter===t?C.ink:C.inkMid, border:`1.5px solid ${tipFilter===t?C.ink:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {filtered.map(m=>{
          const jePr=preuzeto.includes(m.id);
          return (
            <Card key={m.id} accent={C.plum}>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ fontSize:40, lineHeight:1 }}>{m.ikona}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ color:C.ink, fontWeight:800, fontSize:15 }}>{m.predmet}</div>
                      <div style={{ color:C.inkMid, fontSize:12 }}>od {m.autor} · {m.datum}</div>
                    </div>
                    <Pill label={m.tip} color={C.plum} bg={C.plumLight} />
                  </div>
                  <div style={{ marginTop:8, background:C.bgDeep, borderRadius:8, padding:"7px 10px", display:"flex", gap:6 }}>
                    <span>📖</span>
                    <div>
                      <div style={{ fontSize:10, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Lekcija</div>
                      <div style={{ color:C.ink, fontWeight:700, fontSize:13 }}>{m.lekcija}</div>
                    </div>
                  </div>
                  {m.opis && <div style={{ marginTop:6, color:C.inkMid, fontSize:12, lineHeight:1.5 }}>{m.opis}</div>}
                  <div style={{ marginTop:10, display:"flex", gap:8 }}>
                    <Btn label={jePr?"✓ Preuzeto":"⬇ Preuzmi"} color={jePr?C.inkLight:C.plum} outline={jePr} small onClick={()=>setPreuzeto(p=>[...p,m.id])} />
                    <span style={{ color:C.inkLight, fontSize:12, alignSelf:"center" }}>📥 {m.preuzimanja+(jePr?1:0)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAB: ŠKOLSKI BUVLJAK ────────────────────────────────────────────────────
function SkolskiBuvljak({ razmjena, setRazmjena, korisnik }) {
  const [filter, setFilter] = useState("Sve");
  const [noviModal, setNoviModal] = useState(false);
  const [nPredmet, setNPredmet] = useState("");
  const [nTip, setNTip]         = useState("Donacija");
  const [nKat, setNKat]         = useState("Knjige");
  const [nOpis, setNOpis]       = useState("");
  const [nSvjezina, setNSvjezina] = useState("");
  const KATS = ["Sve","Knjige","Odjeća","Hrana","Igračke","Ostalo"];
  const filtered = razmjena.filter(i=>filter==="Sve"||i.kat===filter);
  const IKONE = { Knjige:"📚", Odjeća:"🧥", Hrana:"🍎", Igračke:"🧩", Ostalo:"📦" };

  const objavi = () => {
    const novi = { id:Date.now(), korisnik:`${korisnik.ime} ${korisnik.prezime[0]}.`, tip:nTip, predmet:nPredmet, kat:nKat, ikona:IKONE[nKat]||"📦", svjezina:nKat==="Hrana"&&nSvjezina?nSvjezina:null, opis:nOpis };
    setRazmjena(prev=>[novi,...prev]);
    setNoviModal(false); setNPredmet(""); setNOpis(""); setNSvjezina("");
  };

  return (
    <div>
      {noviModal && (
        <div onClick={()=>setNoviModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>➕ Objavi predmet</h3>
              <button onClick={()=>setNoviModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Donacija","Razmjena"].map(t=>(
                <button key={t} onClick={()=>setNTip(t)} style={{ flex:1, padding:"10px 0", borderRadius:12, border:`2px solid ${nTip===t?(t==="Donacija"?C.rose:C.blue):C.cardBorder}`, background:nTip===t?(t==="Donacija"?"#ffe4ea":C.blueLight):C.bg, color:nTip===t?(t==="Donacija"?C.rose:C.blue):C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer" }}>{t==="Donacija"?"❤️ Donacija":"🔄 Razmjena"}</button>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Kategorija</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {["Knjige","Odjeća","Hrana","Igračke","Ostalo"].map(k=>(
                <button key={k} onClick={()=>setNKat(k)} style={{ padding:"6px 12px", borderRadius:9, border:`2px solid ${nKat===k?C.rose:C.cardBorder}`, background:nKat===k?C.roseLight:C.bg, color:nKat===k?C.rose:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{IKONE[k]||"📦"} {k}</button>
              ))}
            </div>
            <FInp label="Naziv predmeta" value={nPredmet} onChange={e=>setNPredmet(e.target.value)} placeholder="npr. Harry Potter 1-3, zimska jakna..." />
            {nKat==="Hrana" && <FInp label="Rok trajanja / svježina" value={nSvjezina} onChange={e=>setNSvjezina(e.target.value)} placeholder="npr. Vrijedi još 3 dana" icon="🕐" />}
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Opis</p>
            <textarea rows={3} value={nOpis} onChange={e=>setNOpis(e.target.value)} placeholder="Dodatne informacije o predmetu..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            <Btn label="Objavi" color={C.rose} full disabled={!nPredmet} onClick={objavi} />
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px 12px" }}>
        <Btn label="➕ Objavi predmet" color={C.rose} onClick={()=>setNoviModal(true)} />
      </div>
      <div style={{ padding:"0 16px 12px", overflowX:"auto", display:"flex", gap:6 }}>
        {KATS.map(k=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?C.rose:C.bgDeep, color:filter===k?C.card:C.inkMid, border:`1.5px solid ${filter===k?C.rose:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{k}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        {filtered.map(item=>(
          <Card key={item.id} accent={item.tip==="Donacija"?C.rose:C.blue}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ fontSize:42, lineHeight:1 }}>{item.ikona}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ color:C.ink, fontWeight:800, fontSize:15 }}>{item.predmet}</div>
                    <div style={{ color:C.inkMid, fontSize:12 }}>od {item.korisnik}</div>
                  </div>
                  <Pill label={item.tip} color={item.tip==="Donacija"?C.rose:C.blue} bg={item.tip==="Donacija"?C.roseLight:C.blueLight} />
                </div>
                {item.svjezina && <Pill label={`🕐 Svježe još: ${item.svjezina}`} color={C.amber} bg={C.amberLight} style={{ marginTop:6 }} />}
                {item.opis && <div style={{ color:C.inkMid, fontSize:12, marginTop:6, lineHeight:1.5 }}>{item.opis}</div>}
                <div style={{ marginTop:10, display:"flex", gap:8 }}>
                  <Btn label={item.tip==="Donacija"?"❤️ Preuzmi":"🔄 Razmijeni"} color={item.tip==="Donacija"?C.rose:C.blue} small />
                  <Pill label={`⚡ +${item.tip==="Donacija"?5:3}`} color={C.amber} bg={C.amberLight} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: PRIČE I USPJESI ─────────────────────────────────────────────────────
function PriceIUspjesi({ price, setPrice, korisnik }) {
  const [lajkovi, setLajkovi] = useState([]);
  const [komentarModal, setKomentarModal] = useState(null);
  const [noviKom, setNoviKom] = useState("");
  const [novaModal, setNovaModal] = useState(false);
  const [nNaslov, setNNaslov]   = useState("");
  const [nSadrzaj, setNSadrzaj] = useState("");
  const [nTag, setNTag]         = useState("Uspjeh");
  const TAG_BOJA = { Sport:C.blue, Kreativno:C.plum, Uspjeh:C.amber, Priča:C.rose, Ostalo:C.inkLight };

  const dodajKomentar = (id) => {
    if (!noviKom.trim()) return;
    setPrice(prev=>prev.map(p=>p.id===id?{...p,komentari:[...p.komentari,`${korisnik.ime[0]}. ${korisnik.prezime}: ${noviKom}`]}:p));
    setNoviKom("");
  };

  const objavi = () => {
    const nova = { id:Date.now(), korisnik:`${korisnik.ime} ${korisnik.prezime[0]}.`, razred:korisnik.razred||"—", avatar:korisnik.avatar, tag:nTag, naslov:nNaslov, sadrzaj:nSadrzaj, lajkovi:0, komentari:[], vrijeme:"upravo" };
    setPrice(prev=>[nova,...prev]);
    setNovaModal(false); setNNaslov(""); setNSadrzaj("");
  };

  return (
    <div>
      {novaModal && (
        <div onClick={()=>setNovaModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>✍️ Nova objava</h3>
              <button onClick={()=>setNovaModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Kategorija</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {Object.keys(TAG_BOJA).map(t=>(
                <button key={t} onClick={()=>setNTag(t)} style={{ padding:"6px 12px", borderRadius:9, border:`2px solid ${nTag===t?TAG_BOJA[t]:C.cardBorder}`, background:nTag===t?TAG_BOJA[t]+"22":C.bg, color:nTag===t?TAG_BOJA[t]:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
            <FInp label="Naslov" value={nNaslov} onChange={e=>setNNaslov(e.target.value)} placeholder="Kratki naslov tvoje priče..." />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Sadržaj</p>
            <textarea rows={4} value={nSadrzaj} onChange={e=>setNSadrzaj(e.target.value)} placeholder="Podijeli svoju priču, uspjeh ili kreativni rad..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            <Btn label="📢 Objavi" color={C.blue} full disabled={!nNaslov||!nSadrzaj} onClick={objavi} />
          </div>
        </div>
      )}

      {komentarModal!==null && (
        <div onClick={()=>setKomentarModal(null)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"70vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>💬 Komentari</h3>
              <button onClick={()=>setKomentarModal(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            {price.find(p=>p.id===komentarModal)?.komentari.map((k,i)=>(
              <div key={i} style={{ background:C.bgDeep, borderRadius:10, padding:"8px 12px", marginBottom:8, fontSize:13, color:C.inkMid }}>{k}</div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <input value={noviKom} onChange={e=>setNoviKom(e.target.value)} placeholder="Napiši komentar..." style={{ flex:1, background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, outline:"none" }} />
              <Btn label="Pošalji" color={C.blue} onClick={()=>dodajKomentar(komentarModal)} />
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px 12px" }}>
        <Btn label="✍️ Podijeli svoju priču" color={C.blue} onClick={()=>setNovaModal(true)} />
      </div>
      <div style={{ padding:"0 16px" }}>
        {price.map(p=>(
          <Card key={p.id}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:30 }}>{p.avatar}</div>
              <div>
                <div style={{ color:C.ink, fontWeight:800 }}>{p.korisnik}</div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Pill label={p.tag} color={TAG_BOJA[p.tag]||C.inkLight} bg={(TAG_BOJA[p.tag]||C.inkLight)+"22"} />
                  <span style={{ color:C.inkLight, fontSize:11 }}>prije {p.vrijeme}</span>
                </div>
              </div>
            </div>
            <div style={{ color:C.ink, fontWeight:800, fontSize:15, marginBottom:4 }}>{p.naslov}</div>
            <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.6 }}>{p.sadrzaj}</div>
            <Div />
            <div style={{ display:"flex", gap:16 }}>
              <button onClick={()=>setLajkovi(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])} style={{ background:"none", border:"none", cursor:"pointer", color:lajkovi.includes(p.id)?C.rose:C.inkLight, fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
                {lajkovi.includes(p.id)?"❤️":"🤍"} {p.lajkovi+(lajkovi.includes(p.id)?1:0)}
              </button>
              <button onClick={()=>setKomentarModal(p.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.inkLight, fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
                💬 {p.komentari.length}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: BODOVI ──────────────────────────────────────────────────────────────
function Bodovi({ ljestvica, korisnik }) {
  const [izGotovo, setIzGotovo] = useState([2,4]);
  return (
    <div style={{ padding:"0 16px" }}>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:10, margin:"8px 0 20px" }}>
        {[ljestvica[1],ljestvica[0],ljestvica[2]].map((p,i)=>{
          const h=[78,100,62],col=[C.inkMid,C.amber,C.amber+"99"];
          return (
            <div key={p.r} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ fontSize:26 }}>{p.avatar}</div>
              <div style={{ fontSize:10, color:C.inkMid, fontWeight:800 }}>{p.ime}</div>
              <div style={{ width:56, height:h[i], background:col[i]+"22", border:`2px solid ${col[i]}`, borderRadius:"8px 8px 0 0", display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:5 }}>
                <span style={{ fontSize:11, color:col[i], fontWeight:800 }}>{p.bodovi}</span>
              </div>
              <div style={{ fontSize:18 }}>{p.bed||`#${p.r}`}</div>
            </div>
          );
        })}
      </div>
      <Card>
        {ljestvica.map((p,i)=>(
          <div key={p.r} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<ljestvica.length-1?`1px solid ${C.cardBorder}`:"none" }}>
            <div style={{ width:24, color:C.inkMid, fontSize:13, textAlign:"center" }}>{p.bed||`#${p.r}`}</div>
            <div style={{ fontSize:22 }}>{p.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:C.ink, fontWeight:700, fontSize:14 }}>{p.ime}</div>
              <div style={{ color:C.inkLight, fontSize:11 }}>{p.razred} razred · 📅 {p.sati} sati · 📦 {p.donacije} donacija</div>
            </div>
            <Pill label={`⚡ ${p.bodovi}`} color={C.amber} bg={C.amberLight} />
          </div>
        ))}
      </Card>
      <h3 style={{ margin:"16px 0 10px", color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:16 }}>⚡ Tjedni izazovi</h3>
      {DEMO_IZAZOVI.map(iz=>{
        const got=izGotovo.includes(iz.id);
        return (
          <Card key={iz.id} style={{ display:"flex", alignItems:"center", gap:12, opacity:got?0.65:1 }}>
            <div style={{ fontSize:28 }}>{iz.ikona}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:got?C.inkLight:C.ink, fontWeight:700, fontSize:14, textDecoration:got?"line-through":"none" }}>{iz.naslov}</div>
              <Pill label={`+${iz.bodovi} bodova`} color={C.amber} bg={C.amberLight} />
            </div>
            {got?<Pill label="✓ Gotovo" color={C.teal} bg={C.tealLight} />:<Btn label="Označi" color={C.teal} small onClick={()=>setIzGotovo(d=>[...d,iz.id])} />}
          </Card>
        );
      })}
    </div>
  );
}

// ─── TAB: PROFIL ──────────────────────────────────────────────────────────────
function Profil({ korisnik, onOdjava }) {
  const [raspolozenje, setRaspolozenje] = useState(null);
  const [lozinkaModal, setLozinkaModal] = useState(false);
  return (
    <div style={{ padding:"0 16px" }}>
      <Card style={{ textAlign:"center", padding:28 }}>
        <div style={{ fontSize:60 }}>{korisnik.avatar}</div>
        <div style={{ color:C.ink, fontWeight:900, fontSize:22, fontFamily:"'Nunito', sans-serif", marginTop:8 }}>{korisnik.ime} {korisnik.prezime}</div>
        <div style={{ color:C.inkMid, fontSize:13, marginBottom:8 }}>
          {korisnik.razred?`${korisnik.razred} razred`:"Učitelj/ica"}
          {korisnik.predmeti?.length>0&&` · ${korisnik.predmeti.join(", ")}`}
        </div>
        <Pill label={ulogaBoja(korisnik.uloga).label} color={ulogaBoja(korisnik.uloga).color} bg={ulogaBoja(korisnik.uloga).bg} />
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:16 }}>
          <div><div style={{ color:C.amber, fontWeight:900, fontSize:24 }}>{korisnik.bodovi}</div><div style={{ color:C.inkLight, fontSize:11 }}>Bodovi</div></div>
          <div style={{ width:1, background:C.cardBorder }} />
          <div><div style={{ color:C.teal, fontWeight:900, fontSize:24 }}>8</div><div style={{ color:C.inkLight, fontSize:11 }}>Sat. inst.</div></div>
          <div style={{ width:1, background:C.cardBorder }} />
          <div><div style={{ color:C.plum, fontWeight:900, fontSize:24 }}>3</div><div style={{ color:C.inkLight, fontSize:11 }}>Bedževi</div></div>
        </div>
      </Card>
      <Card>
        <div style={{ color:C.ink, fontWeight:800, marginBottom:10 }}>🎖️ Moji bedževi</div>
        <div style={{ display:"flex", gap:10 }}>
          {[{i:"🌟",l:"Super Tutor"},{i:"📚",l:"Knjižni Vilenjak"},{i:"🤝",l:"Top Pomagač"}].map(b=>(
            <div key={b.l} style={{ flex:1, textAlign:"center", background:C.bgDeep, borderRadius:12, padding:"10px 4px" }}>
              <div style={{ fontSize:28 }}>{b.i}</div>
              <div style={{ fontSize:10, color:C.inkMid, marginTop:4, fontWeight:700 }}>{b.l}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ color:C.ink, fontWeight:800, marginBottom:4 }}>😊 Kako se danas osjećaš?</div>
        <div style={{ color:C.inkLight, fontSize:11, marginBottom:10 }}>Anonimno · Dijeli se s pedagogom samo ako je potrebno</div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {["😄","🙂","😐","😕","😔"].map((r,i)=>(
            <button key={i} onClick={()=>setRaspolozenje(i)} style={{ fontSize:28, background:raspolozenje===i?C.tealLight:"transparent", border:`2px solid ${raspolozenje===i?C.teal:"transparent"}`, borderRadius:12, padding:6, cursor:"pointer" }}>{r}</button>
          ))}
        </div>
        {raspolozenje!==null&&<Pill label="✓ Zabilježeno" color={C.teal} bg={C.tealLight} style={{ marginTop:10 }} />}
      </Card>
      <Card style={{ background:C.plumLight, border:`1.5px solid ${C.plum}44` }}>
        <div style={{ color:C.plum, fontWeight:800, fontSize:15 }}>🎓 Postani mentor</div>
        <div style={{ color:C.inkMid, fontSize:13, margin:"6px 0 10px" }}>Pomozi učenicima 1.-3. razreda kao stariji mentor. Zarađuješ +15 bodova po satu!</div>
        <Btn label="Prijavi se kao mentor" color={C.plum} />
      </Card>
      <Btn label="🚪 Odjava" color={C.red} outline full onClick={onOdjava} />
    </div>
  );
}

// ─── ADMIN DASHBOARD (kompaktan) ─────────────────────────────────────────────
function AdminDashboard({ clanovi, setClanovi, korisnik, onOdjava }) {
  const [tab, setTab]           = useState("clanovi");
  const [pretraga, setPretraga] = useState("");
  const [filterUloga, setFilterUloga] = useState("svi");
  const [noviModal, setNoviModal]     = useState(false);
  const [potvrdi, setPotvrdi]         = useState(null);
  const [detalji, setDetalji]         = useState(null);
  const [noviIme, setNoviIme]     = useState("");
  const [noviPre, setNoviPre]     = useState("");
  const [noviUloga, setNoviUloga] = useState("ucenik");
  const [noviRazred, setNoviRazred] = useState("7.");
  const [noviPredmeti, setNoviPredmeti] = useState([]);
  const [genKod, setGenKod]       = useState(null);

  const generirajKod = (uloga, razred) => {
    const prefix = uloga==="ucenik"?`UCE-${razred?.replace(".","")}-`:uloga==="ucitelj"?"UCT-":"ADM-";
    return prefix+Math.floor(Math.random()*900+100);
  };

  const dodajClana = () => {
    const kod = generirajKod(noviUloga, noviRazred);
    const novi = { id:Date.now(), ime:noviIme.trim(), prezime:noviPre.trim(), uloga:noviUloga, razred:noviUloga==="ucenik"?noviRazred:null, predmeti:noviUloga==="ucitelj"?noviPredmeti:[], aktivan:true, kod, lozinka:"promijeni123", avatar:noviUloga==="ucenik"?"🧑‍🎓":noviUloga==="ucitelj"?"👩‍🏫":"👨‍💼", bodovi:0 };
    setClanovi(c=>[...c,novi]);
    setGenKod({ kod, ime:noviIme, uloga:noviUloga });
    setNoviIme(""); setNoviPre(""); setNoviPredmeti([]);
  };

  const filtrirani = clanovi.filter(c=>{
    const txt=pretraga.toLowerCase();
    return (!txt||`${c.ime} ${c.prezime} ${c.kod}`.toLowerCase().includes(txt))&&(filterUloga==="svi"||c.uloga===filterUloga);
  });

  const stat = { ukupno:clanovi.length, ucenici:clanovi.filter(c=>c.uloga==="ucenik").length, ucitelji:clanovi.filter(c=>c.uloga==="ucitelj").length, aktivni:clanovi.filter(c=>c.aktivan).length };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Nunito', sans-serif" }}>
      {/* Modali */}
      {noviModal && (
        <div onClick={()=>{setNoviModal(false);setGenKod(null);}} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:500, maxHeight:"92vh", overflowY:"auto" }}>
            {genKod?(
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:56 }}>🎉</div>
                <h3 style={{ color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>Račun kreiran!</h3>
                <p style={{ color:C.inkMid, fontSize:13 }}>Proslijedi ovaj kod osobi: <strong>{genKod.ime}</strong></p>
                <div style={{ background:C.bgDeep, border:`2px dashed ${C.teal}`, borderRadius:14, padding:20, margin:"16px 0" }}>
                  <p style={{ margin:"0 0 4px", fontSize:11, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Jednokratni kod</p>
                  <div style={{ fontFamily:"monospace", fontSize:28, fontWeight:900, color:C.teal, letterSpacing:3 }}>{genKod.kod}</div>
                  <p style={{ margin:"8px 0 0", fontSize:11, color:C.inkLight }}>Početna lozinka: <strong>promijeni123</strong></p>
                </div>
                <p style={{ fontSize:11, color:C.amber, fontWeight:700, marginBottom:16 }}>⚠ Zapiši ovaj kod — više ga nećeš moći vidjeti!</p>
                <Btn label="Zatvori" color={C.teal} full onClick={()=>{setNoviModal(false);setGenKod(null);}} />
              </div>
            ):(
              <>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <h3 style={{ margin:0, color:C.ink, fontWeight:900 }}>➕ Dodaj novog člana</h3>
                  <button onClick={()=>setNoviModal(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.inkLight }}>✕</button>
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  {["ucenik","ucitelj","admin"].map(u=>{
                    const b=ulogaBoja(u);
                    return <button key={u} onClick={()=>setNoviUloga(u)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`2px solid ${noviUloga===u?b.color:C.cardBorder}`, background:noviUloga===u?b.bg:C.bg, color:noviUloga===u?b.color:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{b.label}</button>;
                  })}
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><FInp label="Ime" value={noviIme} onChange={e=>setNoviIme(e.target.value)} placeholder="Ime" /></div>
                  <div style={{ flex:1 }}><FInp label="Prezime" value={noviPre} onChange={e=>setNoviPre(e.target.value)} placeholder="Prezime" /></div>
                </div>
                {noviUloga==="ucenik" && (
                  <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Razred</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {RAZREDI.map(r=><button key={r} onClick={()=>setNoviRazred(r)} style={{ padding:"6px 12px", borderRadius:8, border:`2px solid ${noviRazred===r?C.teal:C.cardBorder}`, background:noviRazred===r?C.tealLight:C.bg, color:noviRazred===r?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{r} r.</button>)}
                  </div></>
                )}
                {noviUloga==="ucitelj" && (
                  <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Predmeti</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {PREDMETI.map(p=>{const sel=noviPredmeti.includes(p);return <button key={p} onClick={()=>setNoviPredmeti(prev=>sel?prev.filter(x=>x!==p):[...prev,p])} style={{ padding:"5px 10px", borderRadius:8, border:`2px solid ${sel?C.blue:C.cardBorder}`, background:sel?C.blueLight:C.bg, color:sel?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:11, cursor:"pointer" }}>{p}</button>;})}
                  </div></>
                )}
                <Btn label="🎲 Generiraj kod i dodaj" color={C.teal} full disabled={!noviIme.trim()||!noviPre.trim()} onClick={dodajClana} />
              </>
            )}
          </div>
        </div>
      )}

      {potvrdi && (
        <div onClick={()=>setPotvrdi(null)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:20, padding:24, maxWidth:360, width:"100%" }}>
            <div style={{ fontSize:48, textAlign:"center" }}>⚠️</div>
            <h3 style={{ textAlign:"center", color:C.ink, fontWeight:900, margin:"8px 0" }}>Trajno uklanjanje</h3>
            <p style={{ textAlign:"center", color:C.inkMid, fontSize:13, marginBottom:20 }}>Trajno ukloniti <strong>{potvrdi.ime} {potvrdi.prezime}</strong>?</p>
            <div style={{ display:"flex", gap:10 }}>
              <Btn label="Odustani" color={C.inkLight} outline full onClick={()=>setPotvrdi(null)} />
              <Btn label="🗑 Ukloni" color={C.red} full onClick={()=>{setClanovi(c=>c.filter(m=>m.id!==potvrdi.id));setPotvrdi(null);setDetalji(null);}} />
            </div>
          </div>
        </div>
      )}

      {detalji && (
        <div onClick={()=>setDetalji(null)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:500 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontWeight:900 }}>Detalji člana</h3>
              <button onClick={()=>setDetalji(null)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
              <div style={{ fontSize:52 }}>{detalji.avatar}</div>
              <div>
                <div style={{ fontWeight:900, fontSize:18, color:C.ink }}>{detalji.ime} {detalji.prezime}</div>
                <Pill {...ulogaBoja(detalji.uloga)} label={ulogaBoja(detalji.uloga).label} style={{ marginTop:4 }} />
                {detalji.razred&&<div style={{ color:C.inkMid, fontSize:13, marginTop:4 }}>Razred: {detalji.razred}</div>}
              </div>
            </div>
            <div style={{ background:C.bgDeep, borderRadius:12, padding:14, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.inkLight, fontSize:13 }}>Kod:</span><span style={{ fontFamily:"monospace", fontWeight:800, color:C.teal }}>{detalji.kod}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.inkLight, fontSize:13 }}>Bodovi:</span><span style={{ fontWeight:800, color:C.amber }}>⚡ {detalji.bodovi}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.inkLight, fontSize:13 }}>Status:</span><Pill label={detalji.aktivan?"✓ Aktivan":"✗ Neaktivan"} color={detalji.aktivan?C.green:C.red} bg={detalji.aktivan?C.greenLight:C.redLight} /></div>
            </div>
            {detalji.predmeti?.length>0 && <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{detalji.predmeti.map(p=><Pill key={p} label={p} color={C.blue} bg={C.blueLight} />)}</div>}
            {detalji.uloga!=="admin" && (
              <div style={{ display:"flex", gap:10 }}>
                <Btn label={detalji.aktivan?"⏸ Deaktiviraj":"▶ Aktiviraj"} color={detalji.aktivan?C.amber:C.green} full onClick={()=>{setClanovi(c=>c.map(m=>m.id===detalji.id?{...m,aktivan:!m.aktivan}:m));setDetalji(d=>({...d,aktivan:!d.aktivan}));}} />
                <Btn label="🗑 Ukloni" color={C.red} outline onClick={()=>{setDetalji(null);setPotvrdi(detalji);}} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ background:C.card, borderBottom:`1.5px solid ${C.cardBorder}`, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:11, color:C.teal, letterSpacing:1.5, textTransform:"uppercase" }}>PeerUp · Admin</div>
          <h1 style={{ margin:"2px 0 0", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:20, color:C.ink }}>Upravljačka ploča</h1>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ fontSize:28 }}>{korisnik.avatar}</div>
          <Btn label="Odjava" color={C.inkLight} outline small onClick={onOdjava} />
        </div>
      </header>

      <div style={{ background:C.card, borderBottom:`1px solid ${C.cardBorder}`, padding:"0 20px", display:"flex", gap:0, overflowX:"auto" }}>
        {[["clanovi","👥 Članovi"],["statistike","📊 Statistike"],["sadrzaj","🛡 Sadržaj"],["razredi","🏫 Razredi"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ background:"none", border:"none", borderBottom:`3px solid ${tab===id?C.teal:"transparent"}`, color:tab===id?C.teal:C.inkLight, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, padding:"12px 14px", cursor:"pointer", whiteSpace:"nowrap" }}>{lbl}</button>
        ))}
      </div>

      <div style={{ padding:20, maxWidth:700, margin:"0 auto" }}>
        {tab==="clanovi" && (
          <>
            <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
              <input value={pretraga} onChange={e=>setPretraga(e.target.value)} placeholder="🔍 Pretraži..." style={{ flex:1, minWidth:160, background:C.card, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"10px 14px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, outline:"none" }} />
              <select value={filterUloga} onChange={e=>setFilterUloga(e.target.value)} style={{ background:C.card, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"10px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, outline:"none" }}>
                <option value="svi">Sve uloge</option>
                <option value="ucenik">Učenici</option>
                <option value="ucitelj">Učitelji</option>
                <option value="admin">Admin</option>
              </select>
              <Btn label="➕ Dodaj" color={C.teal} onClick={()=>setNoviModal(true)} />
            </div>
            <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, marginBottom:10 }}>Prikazano {filtrirani.length} od {clanovi.length}</div>
            {filtrirani.map(c=>{
              const b=ulogaBoja(c.uloga);
              return (
                <Card key={c.id} style={{ opacity:c.aktivan?1:0.65 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:32 }}>{c.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ fontWeight:900, fontSize:14, color:C.ink }}>{c.ime} {c.prezime}</span>
                        <Pill label={b.label} color={b.color} bg={b.bg} />
                        {!c.aktivan&&<Pill label="Neaktivan" color={C.red} bg={C.redLight} />}
                      </div>
                      <div style={{ color:C.inkLight, fontSize:11, marginTop:2 }}>
                        {c.razred&&`${c.razred} · `}<span style={{ fontFamily:"monospace", fontWeight:700 }}>{c.kod}</span>
                        {c.uloga==="ucenik"&&` · ⚡ ${c.bodovi}`}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>setDetalji(c)} style={{ background:C.bgDeep, border:`1.5px solid ${C.cardBorder}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, color:C.inkMid }}>Detalji</button>
                      {c.uloga!=="admin"&&<button onClick={()=>setClanovi(p=>p.map(m=>m.id===c.id?{...m,aktivan:!m.aktivan}:m))} style={{ background:c.aktivan?C.amberLight:C.greenLight, border:`1.5px solid ${c.aktivan?C.amber:C.green}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, color:c.aktivan?C.amber:C.green }}>{c.aktivan?"⏸":"▶"}</button>}
                      {c.uloga!=="admin"&&<button onClick={()=>setPotvrdi(c)} style={{ background:C.redLight, border:`1.5px solid ${C.red}44`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, color:C.red }}>🗑</button>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}
        {tab==="statistike" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:16 }}>
              {[{lbl:"Ukupno",v:stat.ukupno,i:"👥",c:C.teal},{lbl:"Učenici",v:stat.ucenici,i:"🧑‍🎓",c:C.blue},{lbl:"Učitelji",v:stat.ucitelji,i:"👩‍🏫",c:C.plum},{lbl:"Aktivnih",v:stat.aktivni,i:"✅",c:C.green}].map(s=>(
                <Card key={s.lbl} style={{ textAlign:"center", padding:20 }}>
                  <div style={{ fontSize:32 }}>{s.i}</div>
                  <div style={{ fontWeight:900, fontSize:28, color:s.c }}>{s.v}</div>
                  <div style={{ color:C.inkLight, fontSize:12, fontWeight:700 }}>{s.lbl}</div>
                </Card>
              ))}
            </div>
            <Card>
              <div style={{ fontWeight:900, color:C.ink, marginBottom:12 }}>🏆 Top učenici</div>
              {[...clanovi].filter(c=>c.uloga==="ucenik").sort((a,b)=>b.bodovi-a.bodovi).slice(0,5).map((c,i)=>(
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.cardBorder}` }}>
                  <div style={{ width:24, textAlign:"center", fontWeight:900, color:C.amber }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
                  <div style={{ fontSize:22 }}>{c.avatar}</div>
                  <div style={{ flex:1, fontWeight:700, color:C.ink, fontSize:14 }}>{c.ime} {c.prezime} <span style={{ color:C.inkLight }}>({c.razred})</span></div>
                  <Pill label={`⚡ ${c.bodovi}`} color={C.amber} bg={C.amberLight} />
                </div>
              ))}
            </Card>
          </>
        )}
        {tab==="sadrzaj" && (
          <>
            <Card style={{ background:C.amberLight, border:`1.5px solid ${C.amber}44` }}>
              <div style={{ fontWeight:900, color:C.amber, fontSize:15, marginBottom:4 }}>🛡 Moderacija sadržaja</div>
              <div style={{ color:C.inkMid, fontSize:13 }}>Označeni komentari i objave čekaju pregled.</div>
            </Card>
            {[{t:"Komentar",k:"Nepoznat učenik",s:"[Sadržaj označen filtrom]",r:"Uvredljiv jezik",v:"Prije 2h"},{t:"Objava",k:"Nepoznat učenik",s:"[Sadržaj označen filtrom]",r:"Neprimjerena slika",v:"Prije 5h"}].map((s,i)=>(
              <Card key={i} accent={C.amber}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <Pill label={s.t} color={C.amber} bg={C.amberLight} />
                  <Pill label={s.r} color={C.red} bg={C.redLight} />
                </div>
                <div style={{ background:C.bgDeep, borderRadius:8, padding:"8px 10px", color:C.inkMid, fontSize:13, fontStyle:"italic", marginBottom:12 }}>{s.s}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn label="✓ Odobri" color={C.green} small />
                  <Btn label="🗑 Ukloni" color={C.red} small />
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="razredi" && (
          RAZREDI.map(r=>{
            const u=clanovi.filter(c=>c.razred===r);
            if(!u.length) return null;
            return (
              <Card key={r}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontWeight:900, fontSize:16, color:C.ink }}>{r} razred</div>
                  <Pill label={`${u.length} učenika`} color={C.teal} bg={C.tealLight} />
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {u.map(uc=><span key={uc.id} style={{ background:C.bgDeep, border:`1px solid ${C.cardBorder}`, borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:700, color:uc.aktivan?C.ink:C.inkLight }}>{uc.avatar} {uc.ime} {uc.prezime[0]}.{!uc.aktivan&&" ⏸"}</span>)}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── EKRANI ZA AUTENTIFIKACIJU ────────────────────────────────────────────────
function EkranDobrodoslica({ onLogin, onRegister, onDemo }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400, textAlign:"center" }}>
        <div style={{ fontSize:72, lineHeight:1, marginBottom:12 }}>🤝</div>
        <h1 style={{ margin:0, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:42, color:C.ink, letterSpacing:-1 }}>
          Peer<span style={{ color:C.teal }}>Up</span>
        </h1>
        <p style={{ margin:"6px 0 24px", color:C.inkLight, fontSize:14, fontWeight:600 }}>Školska platforma za međuvršnjačku pomoć</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:32 }}>
          {["📖 Učimo zajedno","🗺️ Bilješke i mape","🔄 Školski buvljak","⭐ Priče i uspjesi","🏆 Bodovi"].map(f=>(
            <span key={f} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:999, padding:"5px 12px", fontSize:12, fontWeight:700, color:C.inkMid }}>{f}</span>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Btn label="🔑 Prijava" color={C.teal} full onClick={onLogin} />
          <Btn label="✏️ Registracija" color={C.ink} full onClick={onRegister} />
          <div style={{ position:"relative", margin:"4px 0" }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center" }}>
              <div style={{ flex:1, height:1, background:C.cardBorder }} />
              <span style={{ padding:"0 10px", color:C.inkLight, fontSize:12, fontWeight:700 }}>ili</span>
              <div style={{ flex:1, height:1, background:C.cardBorder }} />
            </div>
          </div>
          <button onClick={onDemo} style={{ width:"100%", background:`linear-gradient(135deg,${C.amber},#f59e0b)`, color:C.card, border:"none", borderRadius:10, padding:"12px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:15, cursor:"pointer", boxShadow:`0 4px 16px ${C.amber}44` }}>
            🎭 Demo prikaz (bez prijave)
          </button>
        </div>
        <p style={{ marginTop:20, fontSize:11, color:C.inkLight, lineHeight:1.5 }}>
          Za prijavu trebaš kod koji ti daje učitelj/ica.
        </p>
      </div>
    </div>
  );
}

function EkranPrijava({ clanovi, onUspjeh, onNatrag }) {
  const [kod, setKod] = useState("");
  const [loz, setLoz] = useState("");
  const [greska, setGreska] = useState("");
  const [ucitavam, setUcitavam] = useState(false);

  const prijava = () => {
    setGreska(""); setUcitavam(true);
    setTimeout(()=>{
      const clan=clanovi.find(c=>c.kod===kod.trim().toUpperCase()&&c.lozinka===loz.trim());
      if(!clan){setGreska("Neispravan kod ili lozinka.");setUcitavam(false);return;}
      if(!clan.aktivan){setGreska("Račun je deaktiviran. Obrati se administratoru.");setUcitavam(false);return;}
      onUspjeh(clan);
    },700);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <button onClick={onNatrag} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", padding:0, marginBottom:24 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48 }}>🔑</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:26, color:C.ink }}>Prijava</h2>
          <p style={{ margin:0, color:C.inkLight, fontSize:13 }}>Upiši kod i lozinku</p>
        </div>
        <Card>
          <FInp label="Tvoj kod" value={kod} onChange={e=>setKod(e.target.value)} placeholder="npr. UCE-7-01" icon="🪪" />
          <FInp label="Lozinka" type="password" value={loz} onChange={e=>setLoz(e.target.value)} placeholder="Tvoja lozinka" icon="🔒" />
          {greska&&<div style={{ background:C.redLight, border:`1.5px solid ${C.red}44`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}><p style={{ margin:0, color:C.red, fontSize:13, fontWeight:700 }}>⚠ {greska}</p></div>}
          <Btn label={ucitavam?"Prijavljujem...":"Prijavi se"} color={C.teal} full disabled={!kod||!loz||ucitavam} onClick={prijava} />
        </Card>
        <div style={{ background:C.bgDeep, border:`1.5px solid ${C.cardBorder}`, borderRadius:14, padding:14, marginTop:16 }}>
          <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Testni podaci</p>
          {[{lbl:"Admin",kod:"ADMIN001",loz:"admin123"},{lbl:"Učiteljica",kod:"UCT-MAT1",loz:"ucit123"},{lbl:"Učenik (Luka)",kod:"UCE-7-01",loz:"luka2024"}].map(t=>(
            <button key={t.kod} onClick={()=>{setKod(t.kod);setLoz(t.loz);}} style={{ display:"block", width:"100%", textAlign:"left", background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:8, padding:"6px 10px", marginBottom:6, cursor:"pointer", fontFamily:"'Nunito', sans-serif", fontSize:12, fontWeight:700, color:C.ink }}>
              {t.lbl}: <span style={{ fontFamily:"monospace", color:C.teal }}>{t.kod}</span> / <span style={{ color:C.inkMid }}>{t.loz}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EkranRegistracija({ clanovi, setClanovi, onUspjeh, onNatrag }) {
  const [korak, setKorak]     = useState(1);
  const [kod, setKod]         = useState("");
  const [uloga, setUloga]     = useState(null);
  const [ime, setIme]         = useState("");
  const [prezime, setPrezime] = useState("");
  const [razred, setRazred]   = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [loz, setLoz]         = useState("");
  const [loz2, setLoz2]       = useState("");
  const [greska, setGreska]   = useState("");
  const [gotovo, setGotovo]   = useState(false);

  const provjeriKod = () => {
    setGreska("");
    const kodT=kod.trim().toUpperCase();
    if(clanovi.find(c=>c.kod===kodT)){setGreska("Ovaj kod je već iskorišten.");return;}
    if(VALJANI_KODOVI_UCENIKA.includes(kodT)){setUloga("ucenik");setKorak(2);return;}
    if(VALJANI_KODOVI_UCITELJA.includes(kodT)){setUloga("ucitelj");setKorak(2);return;}
    setGreska("Kod nije valjan. Provjeri s učiteljem/administratorom.");
  };

  const registriraj = () => {
    setGreska("");
    if(!ime.trim()||!prezime.trim()){setGreska("Upiši ime i prezime.");return;}
    if(uloga==="ucenik"&&!razred){setGreska("Odaberi razred.");return;}
    if(uloga==="ucitelj"&&predmeti.length===0){setGreska("Odaberi barem jedan predmet.");return;}
    if(loz.length<6){setGreska("Lozinka mora imati barem 6 znakova.");return;}
    if(loz!==loz2){setGreska("Lozinke se ne podudaraju.");return;}
    const noviClan={ id:Date.now(), ime:ime.trim(), prezime:prezime.trim(), uloga, razred:uloga==="ucenik"?razred:null, predmeti:uloga==="ucitelj"?predmeti:[], aktivan:true, kod:kod.trim().toUpperCase(), lozinka:loz, avatar:uloga==="ucenik"?"🧑‍🎓":"👩‍🏫", bodovi:0 };
    setClanovi(c=>[...c,noviClan]);
    setGotovo(true);
    setTimeout(()=>onUspjeh(noviClan),1800);
  };

  if(gotovo) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:72 }}>🎉</div>
        <h2 style={{ fontFamily:"'Nunito', sans-serif", fontWeight:900, color:C.teal, margin:"12px 0 8px" }}>Dobrodošao/la, {ime}!</h2>
        <p style={{ color:C.inkMid }}>Račun je kreiran. Prijavljujem te...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <button onClick={korak===1?onNatrag:()=>setKorak(1)} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", padding:0, marginBottom:24 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48 }}>{korak===1?"✏️":"📋"}</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:26, color:C.ink }}>Registracija</h2>
          {korak===2&&<p style={{ margin:0, color:C.inkLight, fontSize:13 }}>Registracija kao: <strong style={{ color:uloga==="ucenik"?C.teal:C.blue }}>{uloga==="ucenik"?"Učenik":"Učitelj"}</strong></p>}
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[1,2].map(k=><div key={k} style={{ flex:1, height:4, borderRadius:99, background:k<=korak?C.teal:C.cardBorder, transition:"background 0.3s" }} />)}
        </div>
        <Card>
          {korak===1&&(
            <>
              <FInp label="Jednokratni kod" value={kod} onChange={e=>setKod(e.target.value)} placeholder="npr. UCE-7-02" icon="🪪" />
              <div style={{ background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                <p style={{ margin:0, fontSize:12, color:C.amber, fontWeight:700 }}>💡 Kod dobivaš od učitelja/ice. Svaki kod se može koristiti samo jednom.</p>
              </div>
              {greska&&<p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
              <Btn label="Provjeri kod →" color={C.teal} full disabled={!kod} onClick={provjeriKod} />
            </>
          )}
          {korak===2&&(
            <>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ flex:1 }}><FInp label="Ime" value={ime} onChange={e=>setIme(e.target.value)} placeholder="Ime" /></div>
                <div style={{ flex:1 }}><FInp label="Prezime" value={prezime} onChange={e=>setPrezime(e.target.value)} placeholder="Prezime" /></div>
              </div>
              {uloga==="ucenik"&&(
                <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Razred</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {RAZREDI.map(r=><button key={r} onClick={()=>setRazred(r)} style={{ padding:"7px 12px", borderRadius:9, border:`2px solid ${razred===r?C.teal:C.cardBorder}`, background:razred===r?C.tealLight:C.bg, color:razred===r?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{r} r.</button>)}
                </div></>
              )}
              {uloga==="ucitelj"&&(
                <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Predmeti</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {PREDMETI.map(p=>{const sel=predmeti.includes(p);return <button key={p} onClick={()=>setPredmeti(prev=>sel?prev.filter(x=>x!==p):[...prev,p])} style={{ padding:"5px 10px", borderRadius:8, border:`2px solid ${sel?C.blue:C.cardBorder}`, background:sel?C.blueLight:C.bg, color:sel?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:11, cursor:"pointer" }}>{p}</button>;})}
                </div></>
              )}
              <FInp label="Lozinka" type="password" value={loz} onChange={e=>setLoz(e.target.value)} placeholder="Min. 6 znakova" icon="🔒" />
              <FInp label="Ponovi lozinku" type="password" value={loz2} onChange={e=>setLoz2(e.target.value)} placeholder="Ista lozinka" icon="🔒" error={loz2&&loz!==loz2?"Lozinke se ne podudaraju":""} />
              {greska&&<p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
              <Btn label="✓ Kreiraj račun" color={C.teal} full disabled={!ime||!prezime||!loz||!loz2||loz!==loz2} onClick={registriraj} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── GLAVNA APLIKACIJA ─────────────────────────────────────────────────────────
const TABOVI = [
  {id:"ucimo",    ikona:"📖", naziv:"Učimo\nzajedno"},
  {id:"biljeske", ikona:"🗺️", naziv:"Bilješke\ni mape"},
  {id:"buvljak",  ikona:"🔄", naziv:"Školski\nbuvljak"},
  {id:"price",    ikona:"⭐", naziv:"Priče"},
  {id:"bodovi",   ikona:"🏆", naziv:"Bodovi"},
  {id:"profil",   ikona:"👤", naziv:"Profil"},
];

function GlavnaAplikacija({ korisnik, onOdjava }) {
  const [tab, setTab]           = useState("ucimo");
  const [ponude, setPonude]     = useState(DEMO_PONUDE);
  const [materijali, setMaterijali] = useState(DEMO_MATERIJALI);
  const [razmjena, setRazmjena] = useState(DEMO_RAZMJENA);
  const [price, setPrice]       = useState(DEMO_PRICE);

  const tabNazivi = {
    ucimo:{naziv:"Učimo zajedno",opis:"Ponudi ili potraži pomoć"},
    biljeske:{naziv:"Bilješke i mape",opis:"Dijeli materijale za učenje"},
    buvljak:{naziv:"Školski buvljak",opis:"Donacije i razmjena"},
    price:{naziv:"Priče i uspjesi",opis:"Slavimo zajedno"},
    bodovi:{naziv:"Bodovi",opis:"Ljestvica i izazovi"},
    profil:{naziv:"Moj profil",opis:"Tvoj put dosad"},
  };
  const t = tabNazivi[tab];

  return (
    <div style={{ fontFamily:"'Nunito', sans-serif", background:C.bg, color:C.ink, minHeight:"100vh", maxWidth:430, margin:"0 auto", paddingBottom:90 }}>
      {/* Header */}
      <header style={{ padding:"16px 16px 10px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:`1px solid ${C.cardBorder}`, background:C.card }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
            <span style={{ fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:12, color:C.teal, letterSpacing:1.2, textTransform:"uppercase" }}>PeerUp</span>
            {korisnik.uloga==="ucitelj"&&<Pill label="Učitelj" color={C.blue} bg={C.blueLight} />}
            {korisnik.demo&&<Pill label="Demo" color={C.amber} bg={C.amberLight} />}
            <span style={{ color:C.cardBorder }}>·</span>
            <span style={{ fontSize:12, color:C.inkLight }}>{t.opis}</span>
          </div>
          <h1 style={{ margin:0, fontSize:21, fontFamily:"'Nunito', sans-serif", fontWeight:900, color:C.ink }}>{t.naziv}</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Pill label={`⚡ ${korisnik.bodovi}`} color={C.amber} bg={C.amberLight} />
          <div style={{ fontSize:28, cursor:"pointer" }} title="Odjava" onClick={()=>{if(window.confirm("Odjaviti se?")) onOdjava();}}>{korisnik.avatar}</div>
        </div>
      </header>

      <div style={{ paddingTop:12 }}>
        {tab==="ucimo"    && <UcimoZajedno    korisnik={korisnik} ponude={ponude} setPonude={setPonude} />}
        {tab==="biljeske" && <BiljeskeIMape   materijali={materijali} setMaterijali={setMaterijali} korisnik={korisnik} />}
        {tab==="buvljak"  && <SkolskiBuvljak  razmjena={razmjena} setRazmjena={setRazmjena} korisnik={korisnik} />}
        {tab==="price"    && <PriceIUspjesi   price={price} setPrice={setPrice} korisnik={korisnik} />}
        {tab==="bodovi"   && <Bodovi          ljestvica={DEMO_LJESTVICA} korisnik={korisnik} />}
        {tab==="profil"   && <Profil          korisnik={korisnik} onOdjava={onOdjava} />}
      </div>

      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.card, borderTop:`1.5px solid ${C.cardBorder}`, display:"flex", justifyContent:"space-around", padding:"8px 0 14px", zIndex:100, boxShadow:"0 -4px 20px #1a16120d" }}>
        {TABOVI.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, color:tab===t.id?C.teal:C.inkLight, transition:"color 0.15s", padding:"0 4px", minWidth:0 }}>
            <span style={{ fontSize:20, lineHeight:1 }}>{t.ikona}</span>
            <span style={{ fontSize:9, fontWeight:tab===t.id?800:600, textAlign:"center", whiteSpace:"pre-line", lineHeight:1.2 }}>{t.naziv}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── DEMO KORISNIK ─────────────────────────────────────────────────────────────
const DEMO_KORISNIK = {
  id:999, ime:"Demo", prezime:"Korisnik", uloga:"ucenik", razred:"7.", predmeti:[],
  aktivan:true, kod:"DEMO", lozinka:"demo", avatar:"🎭", bodovi:88, demo:true,
};

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function PeerUpRoot() {
  const [clanovi, setClanovi]   = useState(INIT_CLANOVI);
  const [ekran, setEkran]       = useState("dobrodoslica");
  const [korisnik, setKorisnik] = useState(null);

  const prijava = (clan) => {
    setKorisnik(clan);
    setEkran(clan.uloga==="admin"?"admin":"app");
  };
  const odjava = () => { setKorisnik(null); setEkran("dobrodoslica"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; }
        input, select, textarea, button { outline: none; }
        ::-webkit-scrollbar { width:0; height:0; }
      `}</style>
      {ekran==="dobrodoslica" && <EkranDobrodoslica onLogin={()=>setEkran("prijava")} onRegister={()=>setEkran("registracija")} onDemo={()=>prijava(DEMO_KORISNIK)} />}
      {ekran==="prijava"      && <EkranPrijava      clanovi={clanovi} onUspjeh={prijava} onNatrag={()=>setEkran("dobrodoslica")} />}
      {ekran==="registracija" && <EkranRegistracija clanovi={clanovi} setClanovi={setClanovi} onUspjeh={prijava} onNatrag={()=>setEkran("dobrodoslica")} />}
      {ekran==="app"   && korisnik && <GlavnaAplikacija korisnik={korisnik} onOdjava={odjava} />}
      {ekran==="admin" && korisnik && <AdminDashboard   clanovi={clanovi} setClanovi={setClanovi} korisnik={korisnik} onOdjava={odjava} />}
    </>
  );
}
