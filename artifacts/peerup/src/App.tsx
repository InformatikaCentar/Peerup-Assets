// @ts-nocheck
import { useState, useRef, useEffect } from "react";

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
  orange:"#ea580c", orangeLight:"#ffedd5",
};

const PREDMETI = ["Matematika","Hrvatski","Engleski","Priroda","Povijest","Geografija","Fizika","Kemija","Biologija","Informatika","Glazbena kultura","Likovna kultura","TZK","Tehnička kultura","Drugi strani jezik","Ostalo"];
const RAZREDI  = ["1.","2.","3.","4.","5.","6.","7.","8."];
const DANI     = ["Pon","Uto","Sri","Čet","Pet"];
const SATI     = ["1. sat (8:00–8:45)","2. sat (8:50–9:35)","3. sat (9:45–10:30)","4. sat (10:40–11:25)","5. sat (11:35–12:20)","6. sat (12:30–13:15)","7. sat (13:20–14:05)"];

const SKOLA_NAZIV = "OŠ Centar";
const SKOLA_GRAD  = "Rijeka";

const RAZINE = [
  { naziv:"Početnik",   min:0,    max:49,   ikona:"🌱", boja:C.inkLight },
  { naziv:"Istraživač", min:50,   max:149,  ikona:"🔍", boja:C.blue },
  { naziv:"Učenjak",    min:150,  max:299,  ikona:"📚", boja:C.teal },
  { naziv:"Prvak",      min:300,  max:499,  ikona:"🏅", boja:C.amber },
  { naziv:"Ekspert",    min:500,  max:799,  ikona:"⭐", boja:C.orange },
  { naziv:"Majstor",    min:800,  max:1199, ikona:"🏆", boja:C.plum },
  { naziv:"Legenda",    min:1200, max:9999, ikona:"👑", boja:C.rose },
];

function getRazina(bodovi) {
  return RAZINE.find(r => bodovi >= r.min && bodovi <= r.max) || RAZINE[0];
}

function getSljedecaRazina(bodovi) {
  const idx = RAZINE.findIndex(r => bodovi >= r.min && bodovi <= r.max);
  return idx < RAZINE.length - 1 ? RAZINE[idx + 1] : null;
}

const LEKCIJE = {
  Matematika:["Razlomci","Decimalni brojevi","Postoci","Jednadžbe","Geometrija","Površina i opseg","Potencije","Kvadratne jednadžbe"],
  Hrvatski:["Glagolska vremena","Imenice i padeži","Opis osobe","Bajka","Roman","Pravopis","Sintaksa","Lektira"],
  Engleski:["Present Perfect","Past Simple","Conditionals","Vocabulary – travel","Reading comprehension","Future tenses"],
  Priroda:["Biljne stanice","Fotosinteza","Ekosustav","Tlo i voda"],
  Povijest:["Stari Egipat","Antička Grčka","Rimsko Carstvo","Srednji vijek","Hrvatska povijest"],
  Geografija:["Kontinenti","Klima","Reljef Hrvatske","Europa"],
  Fizika:["Sila i gibanje","Energija","Električna struja","Optika","Toplina"],
  Kemija:["Atomi i molekule","Periodni sustav","Kiseline i baze","Kemijske reakcije"],
  Biologija:["Stanica","Nasljeđivanje","Evolucija","Organski sustavi"],
  Informatika:["Algoritmi","Scratch","micro:bit","Baze podataka","Internetska sigurnost"],
  "Glazbena kultura":["Note i ritam","Instrumenti","Skladatelji","Glazbeni oblici","Vokalna glazba"],
  "Likovna kultura":["Perspektiva","Boje","Skulptura","Kompozicija","Crtanje i slikanje"],
  "Tehnička kultura":["Materijali","Električni krug","Mehanizmi","3D modeliranje","Projektiranje"],
  "Drugi strani jezik":["Osnove govora","Prezent","Rječnik","Konverzacija","Prošlo vrijeme"],
  TZK:["Atletika","Plivanje","Košarka","Gimnastika"],
};

// --------------- KVIZ BANKA ---------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KVIZ_BANKA = {
  Matematika: [
    { tip:"mcq", pitanje:"Koji je rezultat: 3/4 + 1/4?", opcije:["1/2","1","3/8","7/8"], tocno:1, objasnjenje:"3/4 + 1/4 = 4/4 = 1. Zbrajamo razlomke s istim nazivnikom." },
    { tip:"tocno_netocno", pitanje:"Decimalni broj 0,75 jednak je razlomku 3/4.", tocno:true, objasnjenje:"0,75 = 75/100 = 3/4. Točno!" },
    { tip:"mcq", pitanje:"Koliko je 25% od 200?", opcije:["25","50","75","100"], tocno:1, objasnjenje:"25% od 200 = (25/100) × 200 = 50." },
    { tip:"popuni", pitanje:"Rješenje jednadžbe 2x + 6 = 14 je x = ___", tocno:"4", objasnjenje:"2x = 14 − 6 = 8, x = 4." },
    { tip:"mcq", pitanje:"Koliki je opseg kvadrata sa stranicom 5 cm?", opcije:["10 cm","20 cm","25 cm","15 cm"], tocno:1, objasnjenje:"Opseg kvadrata = 4 × a = 4 × 5 = 20 cm." },
    { tip:"tocno_netocno", pitanje:"2³ = 6", tocno:false, objasnjenje:"2³ = 2×2×2 = 8, ne 6." },
    { tip:"sparivanje", pitanje:"Spoji postotak s razlomkom:", parovi:[["50%","1/2"],["25%","1/4"],["75%","3/4"],["10%","1/10"]], objasnjenje:"Postoci se pretvaraju dijeljenjem sa 100." },
    { tip:"mcq", pitanje:"Površina pravokutnika 6×4 cm je:", opcije:["10 cm²","20 cm²","24 cm²","28 cm²"], tocno:2, objasnjenje:"Površina = a × b = 6 × 4 = 24 cm²." },
    { tip:"popuni", pitanje:"Kvadrat broja 9 je ___", tocno:"81", objasnjenje:"9² = 81." },
    { tip:"mcq", pitanje:"Koji je negativan broj?", opcije:["-5","0","3","12"], tocno:0, objasnjenje:"Negativni brojevi su manji od nule." },
  ],
  Hrvatski: [
    { tip:"mcq", pitanje:"Koji je glagolski oblik: 'Pjevao sam'?", opcije:["Prezent","Perfekt","Futur","Imperativ"], tocno:1, objasnjenje:"'Pjevao sam' je perfekt – prošlo glagolsko vrijeme koje se tvori pomoćnim glagolom 'biti' i glagolskim pridjevom radnim." },
    { tip:"tocno_netocno", pitanje:"Imenice u nominativu odgovaraju na pitanja 'Koga? Što?'", tocno:false, objasnjenje:"Nominativ odgovara na pitanja 'Tko? Što?' (ne 'Koga?')." },
    { tip:"mcq", pitanje:"Što je bajka?", opcije:["Novinska vijest","Književna vrsta s čudesnim elementima","Dramski tekst","Putopis"], tocno:1, objasnjenje:"Bajka je književna vrsta s čudesnim bićima, vilama, čarobnjacima i sretan završetkom." },
    { tip:"popuni", pitanje:"Množina imenice 'pas' u nominativu je ___", tocno:"psi", objasnjenje:"Pas → psi (množina, N)." },
    { tip:"mcq", pitanje:"Koji je primjer epiteta?", opcije:["Brzo trčati","Bijeli snijeg","Skok u vodu","Pjesma ptice"], tocno:1, objasnjenje:"Epitet je ukrasni pridjev uz imenicu – 'bijeli snijeg' je epitet." },
    { tip:"tocno_netocno", pitanje:"Glagol 'pisati' je neprijelazni glagol.", tocno:false, objasnjenje:"'Pisati' je prijelazni glagol jer uz sebe može imati objekt (pisati pismo)." },
    { tip:"sparivanje", pitanje:"Spoji vrstu rečenice s primjerom:", parovi:[["Izjavna","Sunce sja."],["Upitna","Gdje si?"],["Uskličnu","Kako lijepo!"],["Zapovjedna","Sjedi!"]], objasnjenje:"Vrste rečenica razlikujemo po svrsi iskaza." },
    { tip:"mcq", pitanje:"Roman je:", opcije:["Kratka pjesma","Dugačak prozni tekst","Dramski tekst","Novinarski žanr"], tocno:1, objasnjenje:"Roman je dugačak prozni književni oblik s razvijenom radnjom i likovima." },
  ],
  Engleski: [
    { tip:"mcq", pitanje:"Which is correct Present Perfect?", opcije:["I go to London","I have been to London","I was in London","I will go to London"], tocno:1, objasnjenje:"Present Perfect koristimo za iskustvo: 'I have been to London.'" },
    { tip:"tocno_netocno", pitanje:"'Yesterday' is a signal word for Present Perfect.", tocno:false, objasnjenje:"'Yesterday' se koristi s Past Simple, ne Present Perfect. Signal words za PP su: ever, never, already, yet." },
    { tip:"mcq", pitanje:"She ___ to school every day.", opcije:["go","goes","going","gone"], tocno:1, objasnjenje:"S 'she/he/it' koristimo oblik s -s u prezentu: goes." },
    { tip:"popuni", pitanje:"The past simple of 'go' is ___", tocno:"went", objasnjenje:"Go je nepravilni glagol: go – went – gone." },
    { tip:"sparivanje", pitanje:"Match the tense with its signal word:", parovi:[["Present Simple","every day"],["Past Simple","yesterday"],["Present Perfect","already"],["Future","tomorrow"]], objasnjenje:"Signal words pomažu prepoznati glagolsko vrijeme." },
    { tip:"mcq", pitanje:"If I study hard, I ___ pass the exam.", opcije:["would","will","might","had"], tocno:1, objasnjenje:"Zero/First conditional: If + present simple, will + infinitive." },
    { tip:"tocno_netocno", pitanje:"'Since' is used with a point in time, e.g. 'since 2020'.", tocno:true, objasnjenje:"'Since' označava početnu točku: since 2020, since Monday." },
    { tip:"mcq", pitanje:"How do you say 'avion' in English?", opcije:["train","plane","ship","bus"], tocno:1, objasnjenje:"Avion = plane (airplane)." },
  ],
  Priroda: [
    { tip:"mcq", pitanje:"Što je fotosinteza?", opcije:["Disanje biljaka","Proces pretvorbe sunčeve energije u šećer","Klijanje sjemenke","Rast korijena"], tocno:1, objasnjenje:"Fotosinteza je proces u kojemu biljke uz pomoć sunčeve energije, CO₂ i vode stvaraju šećer i kisik." },
    { tip:"tocno_netocno", pitanje:"Biljne stanice imaju staničnu stjenku od celuloze.", tocno:true, objasnjenje:"Biljne stanice, za razliku od životinjskih, imaju staničnu stjenku od celuloze." },
    { tip:"mcq", pitanje:"Koji je produkt fotosinteze?", opcije:["CO₂ i voda","Kisik i šećer","Dušik","Ugljikov monoksid"], tocno:1, objasnjenje:"Fotosinteza: 6CO₂ + 6H₂O + sunce → C₆H₁₂O₆ + 6O₂." },
    { tip:"popuni", pitanje:"Osnovna jedinica živog bića je ___ .", tocno:"stanica", objasnjenje:"Stanica je osnovna strukturna i funkcionalna jedinica svih živih bića." },
    { tip:"mcq", pitanje:"Što čini ekosustav?", opcije:["Samo biljke","Samo životinje","Živi organizmi i njihov okoliš","Samo tlo"], tocno:2, objasnjenje:"Ekosustav čine svi živi organizmi i neživa priroda na nekom prostoru." },
    { tip:"tocno_netocno", pitanje:"Voda je obnovljiv prirodni resurs.", tocno:true, objasnjenje:"Voda se obnavlja u hidrološkom ciklusu, ali može biti zagađena i ograničena." },
  ],
  Povijest: [
    { tip:"mcq", pitanje:"Koja je rijeka bila temelj egipatske civilizacije?", opcije:["Tigris","Eufrat","Nil","Jordan"], tocno:2, objasnjenje:"Nil je davao plodne nanose i vodu za navodnjavanje – temelj civilizacije starog Egipta." },
    { tip:"tocno_netocno", pitanje:"Atena je bila najvažniji grad-država u antičkoj Grčkoj.", tocno:true, objasnjenje:"Atena je bila kulturno, político i intelektualno središte antičke Grčke." },
    { tip:"mcq", pitanje:"Kada je pao Rimski Carstvo na zapadu?", opcije:["476. pr. Kr.","476. n.e.","1066.","395."], tocno:1, objasnjenje:"Zapadno Rimsko Carstvo palo je 476. n.e. kada je Odoakar zbacio cara Romula Augustula." },
    { tip:"popuni", pitanje:"Rimski car koji je vladao u 1. st. n.e. i stvorio Augustovo doba bio je ___", tocno:"August", objasnjenje:"Oktavijan August (27. pr. Kr. – 14. n.e.) utemeljio je Rimsko Carstvo." },
    { tip:"sparivanje", pitanje:"Spoji civilizaciju s rijekom:", parovi:[["Egipat","Nil"],["Mezopotamija","Eufrat"],["Indija","Ind"],["Kina","Huang He"]], objasnjenje:"Prve civilizacije nastale su uz rijeke koje su davale vodu i plodnu zemlju." },
    { tip:"mcq", pitanje:"Što su bile katakombs?", opcije:["Rimski akvedukti","Podzemna grobišta","Trijumfalni lukovi","Arene"], tocno:1, objasnjenje:"Katakombe su podzemne grobnice u kojima su se rani kršćani skrivali i pokapali." },
  ],
  Geografija: [
    { tip:"mcq", pitanje:"Koliko kontinenata ima na Zemlji?", opcije:["5","6","7","8"], tocno:2, objasnjenje:"Na Zemlji ima 7 kontinenata: Europa, Azija, Afrika, Sjeverna Amerika, Južna Amerika, Australija, Antarktika." },
    { tip:"tocno_netocno", pitanje:"Hrvatska izlazi na Jadransko more.", tocno:true, objasnjenje:"Hrvatska ima izlaz na Jadransko more s obalom dugom oko 1800 km." },
    { tip:"mcq", pitanje:"Koji je najviši vrh u Hrvatskoj?", opcije:["Velebit","Risnjak","Dinara","Učka"], tocno:2, objasnjenje:"Dinara (1831 m) je najviši vrh Hrvatske." },
    { tip:"popuni", pitanje:"Glavni grad Francuske je ___ .", tocno:"Pariz", objasnjenje:"Pariz je glavni grad Francuske i jedan od najvećih gradova Europe." },
    { tip:"sparivanje", pitanje:"Spoji kontinent s oceanom:", parovi:[["Europa","Atlantski"],["Australija","Tihi"],["Afrika","Indijski"],["Amerika","Atlantski"]], objasnjenje:"Kontinenti su okruženi oceanima na različitim stranama." },
    { tip:"mcq", pitanje:"Što je klima?", opcije:["Trenutno stanje atmosfere","Dugoročni prosjek vremenskih uvjeta","Padaline","Temperatura zraka"], tocno:1, objasnjenje:"Klima je prosječno stanje atmosfere na nekom prostoru kroz dugi niz godina (min. 30 godina)." },
  ],
  Fizika: [
    { tip:"mcq", pitanje:"Koja je jedinica za silu?", opcije:["Džul","Watt","Newton","Pascal"], tocno:2, objasnjenje:"Sila se mjeri u Newtonima (N). Ime je dobila po Isaacu Newtonu." },
    { tip:"tocno_netocno", pitanje:"Brzina svjetlosti iznosi approximately 300 000 km/s.", tocno:true, objasnjenje:"Brzina svjetlosti u vakuumu je c ≈ 299 792 458 m/s ≈ 300 000 km/s." },
    { tip:"mcq", pitanje:"Što je kinetička energija?", opcije:["Energija položaja","Energija gibanja","Toplinska energija","Kemijska energija"], tocno:1, objasnjenje:"Kinetička energija je energija tijela zbog njegova gibanja: Ek = mv²/2." },
    { tip:"popuni", pitanje:"Jedinica za električni napon je ___ .", tocno:"volt", objasnjenje:"Električni napon mjeri se u voltima (V). Ime po Alessandru Volti." },
    { tip:"sparivanje", pitanje:"Spoji veličinu s jedinicom:", parovi:[["Sila","Newton"],["Energija","Džul"],["Snaga","Watt"],["Tlak","Pascal"]], objasnjenje:"Fizikalne veličine mjere se u SI jedinicama." },
    { tip:"mcq", pitanje:"Što govori Newtonov 1. zakon?", opcije:["Tijelo ubrzava razmjerno sili","Tijelo miruje ili se giblje jednoliko ako na njega ne djeluje sila","Svakoj sili odgovara jednaka reakcijska sila","Gravitacija privlači tijela"], tocno:1, objasnjenje:"Zakon inercije: tijelo ostaje u stanju mirovanja ili jednolikog gibanja ako na njega ne djeluje rezultantna sila." },
  ],
  Kemija: [
    { tip:"mcq", pitanje:"Koji je simbol za kisik u periodnom sustavu?", opcije:["K","O","Ki","Ox"], tocno:1, objasnjenje:"Kisik (Oxygenium) ima simbol O, atomski broj 8." },
    { tip:"tocno_netocno", pitanje:"pH 7 označava neutralnu otopinu.", tocno:true, objasnjenje:"pH = 7 je neutralno, pH < 7 je kiselo, pH > 7 je lužnato." },
    { tip:"mcq", pitanje:"Što je atom?", opcije:["Molekula vode","Osnovna čestica kemijskog elementa","Proton","Elektron"], tocno:1, objasnjenje:"Atom je najmanji dio kemijskog elementa koji zadržava njegova kemijska svojstva." },
    { tip:"popuni", pitanje:"Kemijska formula vode je ___ .", tocno:"H2O", objasnjenje:"Voda (H₂O) se sastoji od 2 atoma vodika i 1 atoma kisika." },
    { tip:"sparivanje", pitanje:"Spoji element sa simbolom:", parovi:[["Vodik","H"],["Ugljik","C"],["Zlato","Au"],["Natrij","Na"]], objasnjenje:"Kemijski simboli često dolaze iz latinskih naziva elemenata." },
    { tip:"mcq", pitanje:"Koja je kemijska reakcija osnova gorenja?", opcije:["Redukcija","Oksidacija","Neutralizacija","Hidroliza"], tocno:1, objasnjenje:"Gorenje je brza oksidacija pri kojoj se oslobađa toplinska i svjetlosna energija." },
  ],
  Biologija: [
    { tip:"mcq", pitanje:"Što je DNS?", opcije:["Protein","Nosač nasljedne informacije","Lipid","Ugljikohidrat"], tocno:1, objasnjenje:"DNA (deoksiribonukleinska kiselina) je molekula koja nosi genetsku informaciju." },
    { tip:"tocno_netocno", pitanje:"Mitohondrij je 'elektrana stanice'.", tocno:true, objasnjenje:"Mitohondrij provodi stanično disanje i proizvodi ATP – energiju za stanicu." },
    { tip:"mcq", pitanje:"Što je evolucija?", opcije:["Rast tijela","Postupna promjena vrsta kroz generacije","Dijeljenje stanica","Nasljeđivanje boje kose"], tocno:1, objasnjenje:"Evolucija je postupna promjena nasljednih obilježja populacije kroz mnogo generacija." },
    { tip:"popuni", pitanje:"Proces koji životinje koriste za dobivanje energije iz hrane naziva se stanično ___ .", tocno:"disanje", objasnjenje:"Stanično disanje je skup metaboličkih procesa koji oslobađaju energiju iz glukoze." },
    { tip:"sparivanje", pitanje:"Spoji organelu s funkcijom:", parovi:[["Mitohondrij","Energija"],["Ribosom","Sinteza proteina"],["Vakuola","Pohrana vode"],["Kloroplast","Fotosinteza"]], objasnjenje:"Svaka organela ima specifičnu funkciju u stanici." },
    { tip:"mcq", pitanje:"Koliko kromosoma ima normalna ljudska stanica?", opcije:["23","44","46","48"], tocno:2, objasnjenje:"Ljudska diploidna stanica ima 46 kromosoma (23 para)." },
  ],
  Informatika: [
    { tip:"mcq", pitanje:"Što je algoritam?", opcije:["Programski jezik","Niz koraka za rješavanje problema","Vrsta računala","Baza podataka"], tocno:1, objasnjenje:"Algoritam je konačan, uređen skup precizno definiranih koraka za rješavanje problema." },
    { tip:"tocno_netocno", pitanje:"Scratch je programski jezik namijenjen djeci.", tocno:true, objasnjenje:"Scratch je vizualni programski jezik koji je razvio MIT za učenje programiranja." },
    { tip:"mcq", pitanje:"Što znači HTML?", opcije:["High Tech Modern Language","HyperText Markup Language","Hyper Transfer Markup Logic","Home Text Making Language"], tocno:1, objasnjenje:"HTML = HyperText Markup Language – osnova svake web stranice." },
    { tip:"popuni", pitanje:"Osnovna logička vrata koja daju 1 samo ako su oba ulaza 1 zovu se ___ .", tocno:"AND", objasnjenje:"AND (I) vrata: izlaz je 1 samo kad su oba ulaza 1." },
    { tip:"sparivanje", pitanje:"Spoji pojam s definicijom:", parovi:[["CPU","Procesor"],["RAM","Radna memorija"],["HDD","Tvrdi disk"],["GPU","Grafička kartica"]], objasnjenje:"Dijelovi računala imaju specifične uloge u obradi i pohrani podataka." },
    { tip:"mcq", pitanje:"Što je baza podataka?", opcije:["Program za pisanje teksta","Organizirana zbirka podataka","Vrsta mreže","Web preglednik"], tocno:1, objasnjenje:"Baza podataka je organizirana zbirka strukturiranih podataka pohranjena elektronički." },
  ],
  "Glazbena kultura": [
    { tip:"mcq", pitanje:"Koliko linija ima glazbeni notni crtovlje?", opcije:["3","4","5","6"], tocno:2, objasnjenje:"Notno crtovlje se sastoji od 5 linija i 4 međuprostora." },
    { tip:"tocno_netocno", pitanje:"Violina je gudački instrument.", tocno:true, objasnjenje:"Violina je gudački instrument – svira se gudalom koje prelazi po žicama." },
    { tip:"mcq", pitanje:"Tko je skladao Mesijin kompleks – 9. simfoniju 'Koral'?", opcije:["Mozart","Beethoven","Bach","Chopin"], tocno:1, objasnjenje:"Beethovenova 9. simfonija u d-molu op. 125 'Koral' jedna je od najpoznatijih simfonija u povijesti glazbe." },
    { tip:"popuni", pitanje:"Nota koja traje cijelu mjeru u 4/4 je ___ nota.", tocno:"cijela", objasnjenje:"Cijela nota traje 4 dobe u 4/4 mjeri." },
    { tip:"mcq", pitanje:"Što znači 'forte' u glazbi?", opcije:["Tiho","Glasno","Polako","Brzo"], tocno:1, objasnjenje:"Forte (f) znači glasno. Piano (p) znači tiho." },
  ],
  "Likovna kultura": [
    { tip:"mcq", pitanje:"Koje su osnovne boje?", opcije:["Crvena, zelena, plava","Crvena, žuta, plava","Narančasta, zelena, ljubičasta","Bijela, crna, siva"], tocno:1, objasnjenje:"Osnovne (primarne) boje su crvena, žuta i plava – iz njih se miješanjem dobivaju sve ostale boje." },
    { tip:"tocno_netocno", pitanje:"Perspektiva u likovnoj umjetnosti stvara dojam dubine.", tocno:true, objasnjenje:"Perspektiva je tehnika prikazivanja trodimenzionalnog prostora na dvodimenzionalnoj površini." },
    { tip:"mcq", pitanje:"Što je skulptura?", opcije:["Slika na papiru","Trodimenzionalno likovno djelo","Grafički dizajn","Fotografija"], tocno:1, objasnjenje:"Skulptura je trodimenzionalno likovno djelo nastalo kiparskim tehnikama (klesanje, modeliranje)." },
    { tip:"popuni", pitanje:"Miješanjem crvene i žute nastaje ___ boja.", tocno:"narančasta", objasnjenje:"Crvena + žuta = narančasta (sekundarna boja)." },
    { tip:"mcq", pitanje:"Tko je naslikao Mona Lisu?", opcije:["Michelangelo","Rafael","Leonardo da Vinci","Botticelli"], tocno:2, objasnjenje:"Mona Lisu naslikao je Leonardo da Vinci (oko 1503.-1506.)." },
  ],
  TZK: [
    { tip:"mcq", pitanje:"Koliko igrača ima momčad u košarci?", opcije:["5","6","7","11"], tocno:0, objasnjenje:"Košarkaška momčad ima 5 igrača na terenu i do 7 igrača na klupi za zamjene." },
    { tip:"tocno_netocno", pitanje:"U atletici, sprint je trka na kratke udaljenosti.", tocno:true, objasnjenje:"Sprint su kratke trke (60m, 100m, 200m) koje se trče maksimalnom brzinom." },
    { tip:"mcq", pitanje:"Koji je stilovi plivanja?", opcije:["Slobodni, leđni, prsni, leptir","Brzinski, laganim, skokoviti","Prednji, zadnji, bočni","Dugi, kratki, srednji"], tocno:0, objasnjenje:"Četiri natjecateljna stila plivanja su: slobodni (kraul), leđni, prsni i leptir." },
    { tip:"popuni", pitanje:"U gimnastici, vježba na gredi izvodi se na gredi širine ___ cm.", tocno:"10", objasnjenje:"Drvena greda je široka 10 cm i visoka 125 cm od tla." },
    { tip:"mcq", pitanje:"Što je aerobna tjelovježba?", opcije:["Vježba za mišiće","Dugotrajna aktivnost koja poveća rad srca i pluća","Kratka intenzivna vježba","Statična vježba"], tocno:1, objasnjenje:"Aerobna tjelovježba (trčanje, plivanje, vožnja bicikla) poveća rad srca i koristi kisik za energiju." },
  ],
};

const INIT_CLANOVI = [
  { id:1,  ime:"Marko",   prezime:"Horvat",   uloga:"admin",   razred:null, predmeti:[],                     aktivan:true,  kod:"ADMIN001", lozinka:"admin123", avatar:"👨‍💼", bodovi:0,   pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:2,  ime:"Ivana",   prezime:"Kovač",    uloga:"ucitelj", razred:null, predmeti:["Matematika","Fizika"], aktivan:true,  kod:"UCT-MAT1", lozinka:"ucit123",  avatar:"👩‍🏫", bodovi:0,   pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:3,  ime:"Petra",   prezime:"Novak",    uloga:"ucitelj", razred:null, predmeti:["Hrvatski","Likovna"],  aktivan:true,  kod:"UCT-HRV1", lozinka:"ucit456",  avatar:"👩‍🏫", bodovi:0,   pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:5,  ime:"Luka",    prezime:"Marić",    uloga:"ucenik",  razred:"7.", predmeti:[],                     aktivan:true,  kod:"UCE-7-01", lozinka:"luka2024", avatar:"🧑‍🎓", bodovi:142, pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:6,  ime:"Ana",     prezime:"Kolar",    uloga:"ucenik",  razred:"5.", predmeti:[],                     aktivan:true,  kod:"UCE-5-01", lozinka:"ana2024",  avatar:"👩‍🎓", bodovi:98,  pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:7,  ime:"Tin",     prezime:"Babić",    uloga:"ucenik",  razred:"8.", predmeti:[],                     aktivan:true,  kod:"UCE-8-01", lozinka:"tin2024",  avatar:"🧑",   bodovi:210, pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:8,  ime:"Sara",    prezime:"Petrić",   uloga:"ucenik",  razred:"3.", predmeti:[],                     aktivan:true,  kod:"UCE-3-01", lozinka:"sara2024", avatar:"👧",   bodovi:55,  pokusaji:0, zakljucan:false, banan:false, opomene:0 },
  { id:9,  ime:"Mia",     prezime:"Lučić",    uloga:"ucenik",  razred:"6.", predmeti:[],                     aktivan:false, kod:"UCE-6-01", lozinka:"mia2024",  avatar:"👩",   bodovi:74,  pokusaji:0, zakljucan:false, banan:false, opomene:0 },
];
// ---- POČETNI SKUP PRISTUPNIH KODOVA ----
function genKod(uloga, razred, n) {
  if (uloga === "ucenik") return `UCE-${razred.replace(".","")}-${String(n).padStart(2,"0")}`;
  const predTag = ["MAT","HRV","ENG","FIZ","KEM","BIO","INF","GEO","POV","GLB","LIK","TZK","PRI"][n % 13];
  return `UCT-${predTag}${n}`;
}
const LOZINKE_DEMO = ["znanje24","ucenje1","skolica2","pametan3","peerup5","hrvatska6","marko77","ivana88","split99","zagreb00","kljuc12","biljeska3","razred55","kviz777","tablica8"];
const genLozinku = () => {
  const adj = ["Plavi","Brzi","Sretni","Mali","Zeleni","Crveni","Mudri","Hrabri","Topli","Mirni"];
  const nou = ["Kit","Lav","Orao","Vuk","Medvjed","Lisica","Jelen","Kuna","Zec","Delfin"];
  return `${adj[Math.floor(Math.random()*adj.length)]}${nou[Math.floor(Math.random()*nou.length)]}${Math.floor(Math.random()*900+100)}`;
};
const getSchoolYear = () => {
  const now = new Date(); const y = now.getFullYear(); const m = now.getMonth();
  return m >= 8 ? `${y}/${y+1}` : `${y-1}/${y}`;
};
const genSessionToken = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
function initKodovi() {
  const kodovi = [];
  let n = 2;
  for (const r of ["1.","2.","3.","4.","5.","6.","7.","8."]) {
    for (let i = 0; i < 4; i++) {
      kodovi.push({ id: n*100+i, kod: genKod("ucenik", r, n*10+i), uloga:"ucenik", razred:r, lozinka: LOZINKE_DEMO[(n*10+i)%LOZINKE_DEMO.length], koristen:false, datum: new Date().toLocaleDateString("hr-HR"), skola:SKOLA_NAZIV });
    }
    n++;
  }
  for (let i = 0; i < 10; i++) {
    kodovi.push({ id: 9000+i, kod: genKod("ucitelj", null, i+1), uloga:"ucitelj", razred:null, lozinka: LOZINKE_DEMO[(i+5)%LOZINKE_DEMO.length], koristen:false, datum: new Date().toLocaleDateString("hr-HR"), skola:SKOLA_NAZIV });
  }
  return kodovi;
}
const INIT_KODOVI = initKodovi();

const DEMO_PONUDE = [
  { id:101, ime:"Luka M.",  razred:"7.", predmet:"Matematika", lekcija:"Jednadžbe",        opis:"Mogu objasniti linearne jednadžbe korak po korak. Rješavali smo ih ove godine i super mi ide!", avatar:"🧑‍🎓", bodovi:142, tip:"nudi",  ocjena:4.8, termini:[{dan:"Pon",sat:"3. sat (9:45–10:30)",slobodan:true},{dan:"Sri",sat:"4. sat (10:40–11:25)",slobodan:false},{dan:"Pet",sat:"6. sat (12:30–13:15)",slobodan:true}], prijave:["Ana K.","Sara P."] },
  { id:102, ime:"Ana K.",   razred:"5.", predmet:"Engleski",   lekcija:"Present Perfect",  opis:"Tečno pričam engleski, živjela sam u Irskoj 2 godine. Mogu pomoći s gramatikom i konverzacijom.", avatar:"👩‍🎓", bodovi:98,  tip:"nudi",  ocjena:4.9, termini:[{dan:"Uto",sat:"5. sat (11:35–12:20)",slobodan:true},{dan:"Čet",sat:"2. sat (8:50–9:35)",slobodan:true}], prijave:["Tin B."] },
  { id:103, ime:"Tin B.",   razred:"8.", predmet:"Fizika",     lekcija:"Sila i gibanje",   opis:"Natječem se iz fizike, prošao sam školsko natjecanje. Mogu pomoći s teorijom i zadacima.", avatar:"🧑",   bodovi:210, tip:"nudi",  ocjena:5.0, termini:[{dan:"Pon",sat:"4. sat (10:40–11:25)",slobodan:true},{dan:"Sri",sat:"7. sat (13:20–14:05)",slobodan:true},{dan:"Pet",sat:"3. sat (9:45–10:30)",slobodan:false}], prijave:[] },
  { id:104, ime:"Sara P.",  razred:"7.", predmet:"Hrvatski",   lekcija:"Glagolska vremena",opis:"Ne razumijem dobro glagolska vremena, posebno aorist i imperfekt. Trebam nekoga da mi objasni.", avatar:"👧",   bodovi:55,  tip:"traži", ocjena:null, termini:[{dan:"Uto",sat:"3. sat (9:45–10:30)",slobodan:true},{dan:"Čet",sat:"6. sat (12:30–13:15)",slobodan:true}], prijave:["Luka M."] },
  { id:105, ime:"Mia L.",   razred:"7.", predmet:"Kemija",     lekcija:"Kiseline i baze",  opis:"Trebam pomoć s razumijevanjem pH ljestvice i kemijskih reakcija. Pišemo test za tjedan dana.", avatar:"👩",   bodovi:74,  tip:"traži", ocjena:null, termini:[{dan:"Sri",sat:"2. sat (8:50–9:35)",slobodan:true}], prijave:[] },
];

const DEMO_MATERIJALI = [
  {
    id:201, autor:"Luka M.", predmet:"Matematika", lekcija:"Jednadžbe", tip:"Umna mapa", ikona:"🗺️",
    preuzimanja:23, avatar:"🧑‍🎓", datum:"28.5.2026",
    opis:"Vizualni prikaz svih koraka rješavanja linearnih jednadžbi s jednom nepoznanicom.", datoteka:null,
    sadrzajRich:{
      tip:"umnamapa", centar:"Jednadžbe",
      grane:[
        { boja:"#1a8a72", naslov:"Linearne", listice:["ax + b = 0","Izolirati x na jednu stranu","x = −b/a","Primjer: 2x + 4 = 0 → x = −2","Provjera: 2·(−2)+4 = 0 ✓"] },
        { boja:"#7c3aed", naslov:"Kvadratne", listice:["ax² + bx + c = 0","D = b² − 4ac","x = (−b ± √D) / 2a","D > 0 → dva rješenja","D = 0 → jedno rješenje","D < 0 → nema rješenja"] },
        { boja:"#d97706", naslov:"Provjera", listice:["Uvrstiti x natrag u jednadžbu","Lijeva strana = Desna strana","Zaključak je točan ✓"] },
      ]
    }
  },
  {
    id:202, autor:"Ana K.", predmet:"Engleski", lekcija:"Present Perfect", tip:"Sažetak", ikona:"📄",
    preuzimanja:41, avatar:"👩‍🎓", datum:"27.5.2026",
    opis:"Signal words, tvorba i usporedba s Past Simple.", datoteka:null,
    sadrzajRich:{
      tip:"sazetak",
      uvod:"Present Perfect tvori se s have/has + 3. oblik glagola (past participle). Koristimo ga za radnje koje su se dogodile u prošlosti, ali imaju vezu sa sadašnjošću ili je vrijeme neodređeno.",
      sekcije:[
        { naslov:"✅ Signal words", stavke:["already (već) — She has already finished.","yet (još / još uvijek) — I haven't eaten yet.","ever (ikad) — Have you ever been to London?","never (nikad) — He has never tried sushi.","just (upravo) — They have just arrived.","for/since (od/za) — I've known her for 5 years."] },
        { naslov:"📊 Usporedba s Past Simple", stavke:["Present Perfect: I have seen that film. (ima vezu sa sadašnjošću)","Past Simple: I saw that film yesterday. (konkretno prošlo vrijeme, završeno)","Ključ: ako je dan/sat/godina poznata → Past Simple!"] },
        { naslov:"📝 Primjeri rečenica", stavke:["✔ She has already done her homework.","✔ Have you ever eaten ćevapi?","✔ I haven't called him yet.","✔ We've lived here since 2010."] },
      ]
    }
  },
  {
    id:203, autor:"Tin B.", predmet:"Fizika", lekcija:"Sila i gibanje", tip:"Bilješke", ikona:"📝",
    preuzimanja:18, avatar:"🧑", datum:"25.5.2026",
    opis:"Sve formule i riješeni zadaci s natjecanja — Newtonovi zakoni.", datoteka:null,
    sadrzajRich:{
      tip:"biljeske",
      blokovi:[
        { naslov:"🔬 Newtonovi zakoni", tekst:"1. Zakon inercije — tijelo ostaje u mirovanju ili se giba jednoliko pravocrtno ako na njega ne djeluje ukupna vanjska sila.\n\n2. Drugi zakon — rezultantna sila jednaka je umnošku mase i ubrzanja (F = m·a).\n\n3. Treći zakon — svaka sila akcije ima jednaku, suprotno usmjerenu silu reakcije." },
        { naslov:"📐 Formule", formule:["F = m · a  [N = kg·m/s²]","a = F / m  [m/s²]","v = s / t  [m/s]","s = v · t  [m]","W = F · s  [J]","Ep = m · g · h  [J]","Ek = ½mv²  [J]"] },
        { naslov:"💡 Riješeni zadatak s natjecanja", tekst:"Tijelo mase 4 kg kreće se ubrzanjem 3 m/s².\nKolika sila djeluje na tijelo?\n\nRješenje:\nF = m · a = 4 kg · 3 m/s² = 12 N\n\nOdgovor: Na tijelo djeluje sila od 12 N." },
      ]
    }
  },
  {
    id:204, autor:"Ela T.", predmet:"Biologija", lekcija:"Stanična građa", tip:"Umna mapa", ikona:"🗺️",
    preuzimanja:9, avatar:"👩", datum:"24.5.2026",
    opis:"Dijelovi stanice, razlika biljne i životinjske – idealno za pripremu ispita.", datoteka:null,
    sadrzajRich:{
      tip:"umnamapa", centar:"Stanica",
      grane:[
        { boja:"#1a8a72", naslov:"Zajednički dijelovi", listice:["Stanična membrana (selekt. propusnost)","Citoplazma (tekuća osnova)","Jezgra — nosi DNA","Ribosomi (sinteza bjelančevina)","Mitohondriji (ATP energija)"] },
        { boja:"#7c3aed", naslov:"Samo biljne 🌱", listice:["Stanična stijenka (celuloza, čvrstoća)","Kloroplasti (fotosinteza, klorofil)","Centralna vakuola (velika, pohranjuje vodu)"] },
        { boja:"#e03e5c", naslov:"Samo životinjske 🐾", listice:["Centrioli (deoba stanice)","Lizosomi (razgradnja)","Mnoge male vakuole"] },
      ]
    }
  },
  {
    id:205, autor:"Noa B.", predmet:"Hrvatski", lekcija:"Kiklop — lektira", tip:"Sažetak", ikona:"📄",
    preuzimanja:34, avatar:"🧒", datum:"22.5.2026",
    opis:"Kratki sažetak Kiklopa s likovima, temama i citatima.", datoteka:null,
    sadrzajRich:{
      tip:"sazetak",
      uvod:"Kiklop je roman Ranka Marinkovića (1965.), smješten u Zagreb za Drugoga svjetskog rata. Protagonist Melkior Tresić, intelektualac i glumac, suočava se s egzistencijalnim strahom, besmisom rata i vlastitom kukavičlukom.",
      sekcije:[
        { naslov:"👤 Likovi", stavke:["Melkior Tresić — protagonist; prestrašen, intelektualan, moralno nesiguran","Kiklop — metafora za rat i totalitarni sustav koji 'proždire' ljude","Maestro — prijatelj, veseo, kontrast Melkioru","Vivijana — ženska protagonistica, Melkiorova ljubavna čežnja"] },
        { naslov:"🎭 Teme", stavke:["Strah od smrti i rata — osnovna pokretačka sila priče","Moralna odgovornost — može li pojedinac ostati human u ratu?","Groteska i crni humor — Marinković ismijava kukavičluk i apsurd","Alijenacija — Melkior je otuđen od društva i samog sebe"] },
        { naslov:"✏️ Ključni citati", stavke:['"Smijeh je jedino oružje slabih."','"Strah nije sramota, sramota je ne priznati ga."','Kiklop = sve što je monstruozno, neljudsko, ratno'] },
      ]
    }
  },
];

const DEMO_RAZMJENA = [
  { id:301, korisnik:"Mia L.",  tip:"Donacija", predmet:"Harry Potter 1-3", kat:"Knjige",  ikona:"📚", svjezina:null,         opis:"Sve tri knjige u odličnom stanju, čitane jednom. Donacija za ljubitelje čitanja!",
    slike:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=240&h=240&fit=crop","https://images.unsplash.com/photo-1512820790803-83ca734da794?w=240&h=240&fit=crop"], rezerviran:null },
  { id:302, korisnik:"Ivo R.",  tip:"Razmjena", predmet:"Zimska jakna, vel. 146", kat:"Odjeća", ikona:"🧥", svjezina:null,   opis:"Tražim u zamjenu sportsku opremu, vel. 146-152. Jakna korištena jednu sezonu.",
    slike:["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=240&h=240&fit=crop","https://images.unsplash.com/photo-1539533018257-51b2451b2c4e?w=240&h=240&fit=crop"], rezerviran:null },
  { id:303, korisnik:"Ela T.",  tip:"Donacija", predmet:"Domaći kolačići 🍪", kat:"Hrana",  ikona:"🍪", svjezina:"2 dana",   opis:"Mama napravila previše za školski ručak. Tko želi, slobodno uzme do četvrtka!",
    slike:["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=240&h=240&fit=crop","https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=240&h=240&fit=crop"], rezerviran:null },
  { id:304, korisnik:"Noa S.",  tip:"Razmjena", predmet:"Lego City set (komplet)", kat:"Igračke", ikona:"🧩", svjezina:null, opis:"Kompletirani Lego City sa svim dijelovima i uputama. Tražim u zamjenu Lego Technic.",
    slike:["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=240&h=240&fit=crop","https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=240&h=240&fit=crop"], rezerviran:null },
  { id:305, korisnik:"Karlo D.",tip:"Donacija", predmet:"Geografski atlas 2024", kat:"Knjige", ikona:"🗺️", svjezina:null,    opis:"Novo izdanje atlasa, potpuno nov, nisam stigao koristiti jer sam dobio digitalni.",
    slike:["https://images.unsplash.com/photo-1524661135-423995f22d0b?w=240&h=240&fit=crop","https://images.unsplash.com/photo-1508921234172-b68ed862d5a5?w=240&h=240&fit=crop"], rezerviran:null },
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

const INIT_IZAZOVI = [
  { id:1, naslov:"Pomozi kolegi ovaj tjedan",      bodovi:15, ikona:"🤝", gotovo:false, kreirao:"sustav" },
  { id:2, naslov:"Doniraj predmet ili hranu",       bodovi:10, ikona:"📦", gotovo:true,  kreirao:"sustav" },
  { id:3, naslov:"Ostavi 3 lijepa komentara",      bodovi:5,  ikona:"💬", gotovo:false, kreirao:"sustav" },
  { id:4, naslov:"Podijeli bilješku ili umnu mapu", bodovi:8,  ikona:"📝", gotovo:true,  kreirao:"sustav" },
  { id:5, naslov:"Rezerviraj termin instrukcija",   bodovi:5,  ikona:"📅", gotovo:false, kreirao:"sustav" },
];

const VOLONT_PROJEKTI = [
  { id:1, naslov:"Pomoć u čitanju – 1. razred",   opis:"Pomaži prvašićima da vježbaju čitanje 2x tjedno po 30 min.", ikona:"📖", mjesta:3, prijavljeni:["Luka M.","Ana K."], bodovi:25, organizator:"Učiteljica Petra", datum:"2026-06-10", vrijemeOd:"09:00", vrijemeDo:"10:00", dolaznost:{"Luka M.":true,"Ana K.":false}, nagrade:{} },
  { id:2, naslov:"Školski vrt – sadnja i njega",  opis:"Zalijevaj i brini za školski vrt. Upiši se za jedan dan tjedno.", ikona:"🌱", mjesta:5, prijavljeni:["Tin B."], bodovi:20, organizator:"Ravnateljica Tina Bošković Sertić", datum:"2026-06-12", vrijemeOd:"11:00", vrijemeDo:"12:30", dolaznost:{"Tin B.":false}, nagrade:{} },
  { id:3, naslov:"IT pomoć starijim učiteljima",  opis:"Pomozi učiteljima oko računala, tableta i e-dnevnika.", ikona:"💻", mjesta:2, prijavljeni:[], bodovi:20, organizator:"Učiteljica Ivana", datum:"2026-06-15", vrijemeOd:"13:00", vrijemeDo:"14:00", dolaznost:{}, nagrade:{} },
  { id:4, naslov:"Zidne novine – uređivanje",     opis:"Svaki tjedan obnoviti oglasnu ploču i zidne novine škole.", ikona:"📰", mjesta:4, prijavljeni:["Sara P."], bodovi:15, organizator:"Učiteljica Petra", datum:"2026-06-11", vrijemeOd:"12:00", vrijemeDo:"13:00", dolaznost:{"Sara P.":false}, nagrade:{} },
  { id:5, naslov:"Prikupljanje igračaka za bolnicu", opis:"Organiziraj prikupljanje igračaka za djecu u bolnici.", ikona:"🧸", mjesta:6, prijavljeni:["Mia L.","Filip G.","Ana K."], bodovi:30, organizator:"Ravnateljica Tina Bošković Sertić", datum:"2026-06-20", vrijemeOd:"10:00", vrijemeDo:"12:00", dolaznost:{"Mia L.":false,"Filip G.":false,"Ana K.":false}, nagrade:{} },
];

// ---- REUSABLE COMPONENTS ----
const Pill = ({ label, color, bg, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:bg, color, borderRadius:999, padding:"3px 10px", fontSize:11, fontWeight:700, letterSpacing:0.3, ...style }}>{label}</span>
);
const Card = ({ children, style={}, accent, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:16, padding:16, marginBottom:12, borderLeft:accent?`4px solid ${accent}`:undefined, boxShadow:"0 2px 8px #1a16120a", cursor:onClick?"pointer":undefined, ...style }}>{children}</div>
);
const Btn = ({ label, color=C.teal, textColor=C.card, onClick=undefined, full=false, disabled=false, outline=false, small=false, style={} }) => (
  <button onClick={onClick} disabled={disabled} style={{ background:outline?"transparent":disabled?C.bgDeep:color, color:outline?color:disabled?C.inkLight:textColor, border:outline?`2px solid ${color}`:"none", borderRadius:999, padding:small?"6px 16px":"11px 24px", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:small?12:14, cursor:disabled?"default":"pointer", width:full?"100%":"auto", opacity:disabled?0.6:1, transition:"all 0.15s", boxShadow:disabled||outline?"none":`0 3px 12px ${color}44`, letterSpacing:0.2, ...style }}>{label}</button>
);
const FInp = ({ label=undefined, type="text", value, onChange, placeholder=undefined, icon=undefined, error=undefined }) => (
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
const ulogaBoja = (u) => ({ admin:{color:C.plum,bg:C.plumLight,label:"Admin"}, ucitelj:{color:C.blue,bg:C.blueLight,label:"Učitelj"}, ucenik:{color:C.teal,bg:C.tealLight,label:"Učenik"} }[u]||{color:C.inkLight,bg:C.bgDeep,label:u});

// ---- MODALS ----
function KalendarModal({ naslov="📅 Odaberi termin", dostupniTermini=undefined, onClose, onPotvrdi }) {
  const MJES_HR = ["Siječanj","Veljača","Ožujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"];
  const DOW_SHORT = ["Ne","Pon","Uto","Sri","Čet","Pet","Sub"]; // 0=Sun
  const DOW_HEADER = ["Po","Ut","Sr","Če","Pe","Su","Ne"];
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay]     = useState(null);
  const [sat, setSat]     = useState(null);

  const slobodniTermini = dostupniTermini ? dostupniTermini.filter(t=>t.slobodan) : null;
  const slobodniDanSlugs = slobodniTermini ? [...new Set(slobodniTermini.map(t=>t.dan))] : null;

  const getDanSlug = d => DOW_SHORT[new Date(year, month, d).getDay()];

  const isDayAvailable = d => {
    const date = new Date(year, month, d);
    const dow  = date.getDay();
    if (dow === 0 || dow === 6) return false;            // no weekends
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false; // no past
    if (slobodniDanSlugs) return slobodniDanSlugs.includes(DOW_SHORT[dow]);
    return true;
  };

  const availableHours = (() => {
    if (!day) return SATI;
    if (!slobodniTermini) return SATI;
    const slug = getDanSlug(day);
    return slobodniTermini.filter(t=>t.dan===slug).map(t=>t.sat);
  })();

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const startOffset  = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-first

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    const lim  = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev < lim) return;
    setMonth(prev.getMonth()); setYear(prev.getFullYear()); setDay(null); setSat(null);
  };
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setMonth(next.getMonth()); setYear(next.getFullYear()); setDay(null); setSat(null);
  };

  const isToday = d => d===today.getDate() && month===today.getMonth() && year===today.getFullYear();

  const danLabel  = day ? `${getDanSlug(day)} ${day}.${month+1}.${year}.` : null;
  const potvrdiLabel = day && sat ? `✓ Potvrdi — ${danLabel} u ${sat}` : "Odaberi datum i sat";

  const arrowSt = { background:"none", border:`1.5px solid ${C.cardBorder}`, borderRadius:8, width:34, height:34, cursor:"pointer", color:C.ink, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif" };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:20, padding:22, width:"100%", maxWidth:400, border:`1.5px solid ${C.cardBorder}`, boxShadow:"0 12px 48px #1a161230", maxHeight:"92vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16 }}>{naslov}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>

        {/* Month/Year navigation */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <button onClick={prevMonth} style={arrowSt}>‹</button>
          <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:15, color:C.ink }}>
            {MJES_HR[month]} {year}
          </span>
          <button onClick={nextMonth} style={arrowSt}>›</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
          {DOW_HEADER.map(d=>(
            <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:800, color:C.inkLight, fontFamily:"'Nunito',sans-serif", padding:"4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:16 }}>
          {Array.from({length:startOffset}).map((_,i)=><div key={`e${i}`} />)}
          {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{
            const avail   = isDayAvailable(d);
            const sel     = d===day;
            const todayMk = isToday(d);
            return (
              <button key={d} onClick={()=>{if(!avail)return; setDay(d); setSat(null);}} style={{
                padding:"9px 2px", borderRadius:10, border: sel ? `2px solid ${C.teal}` : todayMk ? `2px solid ${C.teal}66` : "2px solid transparent",
                background: sel ? C.teal : "transparent",
                color: sel ? "#fff" : avail ? C.ink : C.inkLight,
                fontFamily:"'Nunito',sans-serif", fontWeight: todayMk ? 900 : 700, fontSize:13,
                cursor: avail ? "pointer" : "default", opacity: avail ? 1 : 0.28,
                transition:"background .15s",
              }}>{d}</button>
            );
          })}
        </div>

        {/* Selected date chip */}
        {day && (
          <div style={{ background:C.tealLight, borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>📅</span>
            <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:C.teal, fontSize:14 }}>{danLabel}</span>
            <button onClick={()=>{setDay(null);setSat(null);}} style={{ marginLeft:"auto", background:"none", border:"none", color:C.teal, cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
          </div>
        )}

        {/* Hour picker */}
        {day && (
          <>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Odaberi sat</p>
            {availableHours.length === 0
              ? <p style={{ color:C.inkLight, fontSize:13, fontStyle:"italic", marginBottom:14 }}>Nema slobodnih termina ovaj dan.</p>
              : <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:18 }}>
                  {availableHours.map(s=>(
                    <button key={s} onClick={()=>setSat(s)} style={{ padding:"10px 0", borderRadius:10, border:`2px solid ${sat===s?C.blue:C.cardBorder}`, background:sat===s?C.blueLight:C.bg, color:sat===s?C.blue:C.inkMid, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{s}</button>
                  ))}
                </div>
            }
          </>
        )}

        <Btn label={potvrdiLabel} color={C.teal} full disabled={!day||!sat} onClick={()=>day&&sat&&onPotvrdi(danLabel,sat)} />
      </div>
    </div>
  );
}

function NovaPonudaModal({ korisnik, onClose, onDodaj }) {
  const [korak, setKorak] = useState(1);
  const [tipPonude, setTipPonude] = useState("nudi");
  const [predmet, setPredmet] = useState("Matematika");
  const [razred, setRazred] = useState(korisnik.razred || "7.");
  const [lekcija, setLekcija] = useState("");
  const [lekcijaRucno, setLekcijaRucno] = useState("");
  const [predmetRucno, setPredmetRucno] = useState("");
  const [opis, setOpis] = useState("");
  const [odabraniTermini, setOdabraniTermini] = useState([]);
  const [kalModal, setKalModal] = useState(false);
  const [gotovo, setGotovo] = useState(false);
  const dodajTermin = (dan, sat) => {
    if (!odabraniTermini.find(t=>t.dan===dan&&t.sat===sat)) setOdabraniTermini(prev=>[...prev,{dan,sat,slobodan:true}]);
    setKalModal(false);
  };
  const objavi = () => {
    const finLekcija = lekcija==="__ostalo__" ? lekcijaRucno : lekcija;
    const finPredmet = predmet==="Ostalo" ? predmetRucno : predmet;
    onDodaj({ id:Date.now(), ime:`${korisnik.ime} ${korisnik.prezime[0]}.`, razred, predmet:finPredmet, lekcija:finLekcija, opis, avatar:korisnik.avatar, bodovi:korisnik.bodovi, tip:tipPonude, ocjena:null, termini:odabraniTermini, prijave:[] });
    setGotovo(true);
    setTimeout(onClose, 1800);
  };
  if (gotovo) return (
    <div style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.card, borderRadius:20, padding:32, maxWidth:340, textAlign:"center" }}>
        <div style={{ fontSize:56 }}>🎉</div>
        <h3 style={{ color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>Objavljeno!</h3>
        <p style={{ color:C.inkMid, fontSize:13 }}>Tvoja objava je vidljiva svim učenicima. Zarađuješ <strong>+10 bodova</strong> kad se sat održi!</p>
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      {kalModal && <KalendarModal naslov="📅 Dodaj slobodni termin" onClose={()=>setKalModal(false)} onPotvrdi={dodajTermin} />}
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>{korak===1?"📋 Nova objava":korak===2?"📖 Detalji":"📅 Termini"}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:18 }}>
          {[1,2,3].map(k=><div key={k} style={{ flex:1, height:4, borderRadius:99, background:k<=korak?C.teal:C.cardBorder, transition:"background 0.3s" }} />)}
        </div>
        {korak===1 && (
          <>
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
            <select value={predmet} onChange={e=>{setPredmet(e.target.value);setLekcija("");setPredmetRucno("");}} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:predmet==="Ostalo"?8:16, outline:"none" }}>
              {PREDMETI.map(p=><option key={p}>{p}</option>)}
            </select>
            {predmet==="Ostalo" && (
              <input value={predmetRucno} onChange={e=>setPredmetRucno(e.target.value)} placeholder="Upiši naziv predmeta ili područja..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.teal}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            )}
            <Btn label="Dalje →" color={C.teal} full disabled={predmet==="Ostalo"&&!predmetRucno.trim()} onClick={()=>setKorak(2)} />
          </>
        )}
        {korak===2 && (
          <>
            <select value={lekcija} onChange={e=>setLekcija(e.target.value)} style={{ width:"100%", background:C.bg, color:lekcija?C.ink:C.inkLight, border:`1.5px solid ${lekcija?C.teal:C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:8, outline:"none" }}>
              <option value="">— Odaberi lekciju —</option>
              {(LEKCIJE[predmet]||[]).map(l=><option key={l}>{l}</option>)}
              <option value="__ostalo__">Ostalo (upiši ručno)</option>
            </select>
            {lekcija==="__ostalo__" && (
              <input value={lekcijaRucno} onChange={e=>setLekcijaRucno(e.target.value)} placeholder="Upiši naziv lekcije..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.teal}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, boxSizing:"border-box", marginBottom:8, outline:"none" }} />
            )}
            <p style={{ margin:"14px 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Opis</p>
            <textarea rows={4} value={opis} onChange={e=>setOpis(e.target.value)} placeholder="Što znaš ili što trebaš..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            <div style={{ display:"flex", gap:8 }}>
              <Btn label="← Natrag" color={C.inkLight} outline onClick={()=>setKorak(1)} />
              <Btn label="Dalje →" color={C.teal} disabled={!lekcija||(lekcija==="__ostalo__"&&!lekcijaRucno)} onClick={()=>setKorak(3)} />
            </div>
          </>
        )}
        {korak===3 && (
          <>
            <p style={{ margin:"0 0 4px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Slobodni termini</p>
            <p style={{ margin:"0 0 12px", fontSize:12, color:C.inkMid }}>Dodaj jedan ili više termina kada možeš.</p>
            {odabraniTermini.map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.tealLight, border:`1.5px solid ${C.teal}44`, borderRadius:10, padding:"8px 12px", marginBottom:6 }}>
                <span style={{ color:C.teal, fontWeight:800, fontSize:14 }}>📅 {t.dan} u {t.sat}</span>
                <button onClick={()=>setOdabraniTermini(prev=>prev.filter((_,idx)=>idx!==i))} style={{ background:"none", border:"none", color:C.rose, cursor:"pointer", fontWeight:800, fontSize:16 }}>✕</button>
              </div>
            ))}
            <button onClick={()=>setKalModal(true)} style={{ width:"100%", padding:14, borderRadius:12, border:`2px dashed ${C.blue}`, background:C.blueLight, color:C.blue, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:16 }}>+ Dodaj termin</button>
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

function DetaljiPonudeModal({ ponuda, korisnik, onClose, onRezervacija }) {
  const [kalModal, setKalModal] = useState(false);
  const [rezervirano, setRezervirano] = useState(null);
  const slobodniTermini = ponuda.termini.filter(t=>t.slobodan);
  const potvrdi = (dan, sat) => {
    setRezervirano(`${dan} u ${sat}`);
    setKalModal(false);
    onRezervacija(ponuda.id, dan, sat);
  };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      {kalModal && <KalendarModal naslov="📅 Odaberi slobodni termin" dostupniTermini={ponuda.termini} onClose={()=>setKalModal(false)} onPotvrdi={potvrdi} />}
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:22, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📋 Detalji ponude</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:48 }}>{ponuda.avatar}</div>
          <div>
            <div style={{ fontWeight:900, fontSize:18, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>{ponuda.ime}</div>
            <div style={{ color:C.inkMid, fontSize:13 }}>{ponuda.razred} razred</div>
            {ponuda.ocjena && <div style={{ color:C.amber, fontWeight:700 }}>{"★".repeat(Math.floor(ponuda.ocjena))} {ponuda.ocjena}</div>}
          </div>
        </div>
        <Card style={{ background:C.bgDeep, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <Pill label={ponuda.predmet} color={C.blue} bg={C.blueLight} />
            <Pill label={ponuda.tip==="nudi"?"Nudi pomoć":"Traži pomoć"} color={ponuda.tip==="nudi"?C.teal:C.rose} bg={ponuda.tip==="nudi"?C.tealLight:C.roseLight} />
          </div>
          <div style={{ fontSize:15, fontWeight:800, color:C.ink }}>📖 {ponuda.lekcija}</div>
        </Card>
        {ponuda.opis && <div style={{ background:C.bgDeep, borderRadius:12, padding:"10px 14px", marginBottom:14, color:C.inkMid, fontSize:13, lineHeight:1.6 }}>{ponuda.opis}</div>}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Slobodni termini</div>
          {slobodniTermini.length===0
            ? <div style={{ color:C.inkLight, fontSize:13, fontStyle:"italic" }}>Nema slobodnih termina.</div>
            : <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {slobodniTermini.map((t,i)=>(
                  <div key={i} style={{ background:C.tealLight, border:`1.5px solid ${C.teal}44`, borderRadius:10, padding:"8px 14px", color:C.teal, fontWeight:800, fontSize:13 }}>📅 {t.dan} u {t.sat}</div>
                ))}
              </div>
          }
        </div>
        {rezervirano ? (
          <div style={{ background:C.greenLight, border:`1.5px solid ${C.green}44`, borderRadius:12, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:32 }}>✅</div>
            <div style={{ color:C.green, fontWeight:900, fontFamily:"'Nunito', sans-serif" }}>{ponuda.tip==="nudi"?"Rezervirano!":"Termin predložen!"}</div>
            <div style={{ color:C.inkMid, fontSize:13, marginTop:4 }}>Termin: <strong>{rezervirano}</strong></div>
          </div>
        ) : slobodniTermini.length > 0 && (
          <Btn label={ponuda.tip==="nudi"?"📅 Rezerviraj termin":"🙋 Predloži termin pomoći"} color={ponuda.tip==="nudi"?C.teal:C.rose} full onClick={()=>setKalModal(true)} />
        )}
      </div>
    </div>
  );
}

// ---- RICH CONTENT RENDERER ----
function SadrzajRichPregled({ sadrzajRich, boja, bojaLight }) {
  if (!sadrzajRich) return null;
  const { tip } = sadrzajRich;

  if (tip === "umnamapa") {
    return (
      <div>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>🗺️ Umna mapa</div>
        {/* Centar */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <div style={{ background:boja, color:"#fff", borderRadius:16, padding:"10px 24px", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:15, boxShadow:"0 4px 16px #1a161220" }}>
            {sadrzajRich.centar}
          </div>
        </div>
        {/* Vertical line */}
        <div style={{ width:2, height:16, background:`${boja}44`, margin:"0 auto 8px" }} />
        {/* Grane */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(sadrzajRich.grane||[]).map((grana, gi) => (
            <div key={gi} style={{ borderRadius:14, border:`2px solid ${grana.boja}44`, overflow:"hidden" }}>
              <div style={{ background:grana.boja, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff", opacity:0.8 }} />
                <span style={{ color:"#fff", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:13 }}>{grana.naslov}</span>
              </div>
              <div style={{ background:`${grana.boja}0d`, padding:"10px 14px", display:"flex", flexDirection:"column", gap:6 }}>
                {(grana.listice||[]).map((l, li) => (
                  <div key={li} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:grana.boja, marginTop:5, flexShrink:0 }} />
                    <span style={{ color:C.ink, fontSize:13, fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tip === "sazetak") {
    return (
      <div>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>📄 Sažetak</div>
        {sadrzajRich.uvod && (
          <div style={{ background:bojaLight, border:`1.5px solid ${boja}33`, borderRadius:12, padding:14, marginBottom:14, color:C.inkMid, fontSize:13, lineHeight:1.7 }}>
            {sadrzajRich.uvod}
          </div>
        )}
        {(sadrzajRich.sekcije||[]).map((sek, si) => (
          <div key={si} style={{ marginBottom:12 }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:boja, fontSize:13, marginBottom:8 }}>{sek.naslov}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {(sek.stavke||[]).map((s, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", background:C.bgDeep, borderRadius:8, padding:"7px 10px" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:boja, marginTop:5, flexShrink:0 }} />
                  <span style={{ color:C.ink, fontSize:13, fontFamily:"'Nunito',sans-serif", lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tip === "biljeske") {
    return (
      <div>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>📝 Bilješke</div>
        {(sadrzajRich.blokovi||[]).map((blok, bi) => (
          <div key={bi} style={{ marginBottom:14, background:C.bgDeep, borderRadius:14, overflow:"hidden", border:`1.5px solid ${C.cardBorder}` }}>
            <div style={{ background:boja, padding:"8px 14px" }}>
              <span style={{ color:"#fff", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:13 }}>{blok.naslov}</span>
            </div>
            <div style={{ padding:"12px 14px" }}>
              {blok.tekst && (
                <pre style={{ margin:0, fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.ink, lineHeight:1.75, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{blok.tekst}</pre>
              )}
              {blok.formule && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:blok.tekst?10:0 }}>
                  {blok.formule.map((f, fi) => (
                    <div key={fi} style={{ background:C.card, border:`1.5px solid ${boja}44`, borderRadius:8, padding:"5px 12px", fontFamily:"monospace", fontSize:13, color:boja, fontWeight:700 }}>{f}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// ---- FILE PREVIEW MODAL ----
function PregledDatotekeModal({ materijal, onClose }) {
  const [tekstSadrzaj, setTekstSadrzaj] = useState(null);
  const isImage = materijal.datoteka && materijal.datoteka.type && materijal.datoteka.type.startsWith("image/");
  const isPdf   = materijal.datoteka && materijal.datoteka.type === "application/pdf";
  const isTekst = materijal.datoteka && (materijal.datoteka.type === "text/plain" || materijal.datoteka.name?.endsWith(".txt"));

  useEffect(() => {
    if (isTekst) {
      const reader = new FileReader();
      reader.onload = e => setTekstSadrzaj(e.target.result);
      reader.readAsText(materijal.datoteka);
    }
  }, [isTekst]);

  const handleDownload = () => {
    if (!materijal.datoteka) return;
    const url = URL.createObjectURL(materijal.datoteka);
    const a = document.createElement("a");
    a.href = url;
    a.download = materijal.datoteka.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const boja = materijal.tip === "Umna mapa" ? C.plum : materijal.tip === "Sažetak" ? C.blue : C.teal;
  const bojaLight = materijal.tip === "Umna mapa" ? C.plumLight : materijal.tip === "Sažetak" ? C.blueLight : C.tealLight;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161299", zIndex:600, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:16 }}>{materijal.ikona} {materijal.lekcija}</h3>
            <div style={{ color:C.inkMid, fontSize:12 }}>{materijal.tip} · {materijal.predmet} · {materijal.autor}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>

        {/* Tip badge + opis */}
        <div style={{ background:bojaLight, border:`1.5px solid ${boja}33`, borderRadius:14, padding:14, marginBottom:14 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:22 }}>{materijal.ikona}</span>
            <div>
              <div style={{ fontWeight:800, color:boja, fontSize:13 }}>{materijal.tip}</div>
              <div style={{ fontSize:11, color:C.inkLight }}>{materijal.predmet}</div>
            </div>
          </div>
          {materijal.opis && (
            <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{materijal.opis}</div>
          )}
        </div>

        {/* Pregled datoteke ili sadrzajRich */}
        {materijal.datoteka ? (
          <div>
            <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>👁 Pregled datoteke</div>
            {isImage && (
              <img
                src={URL.createObjectURL(materijal.datoteka)}
                alt={materijal.datoteka.name}
                style={{ width:"100%", borderRadius:12, marginBottom:12, maxHeight:320, objectFit:"contain", background:C.bgDeep }}
              />
            )}
            {isPdf && (
              <iframe
                src={URL.createObjectURL(materijal.datoteka)}
                style={{ width:"100%", height:340, borderRadius:12, border:`1.5px solid ${C.cardBorder}`, marginBottom:12 }}
                title="PDF pregled"
              />
            )}
            {isTekst && (
              <div style={{ background:C.bgDeep, borderRadius:12, padding:16, marginBottom:12, maxHeight:280, overflowY:"auto" }}>
                <pre style={{ margin:0, fontFamily:"monospace", fontSize:12, color:C.ink, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                  {tekstSadrzaj ?? "Učitavam..."}
                </pre>
              </div>
            )}
            {!isImage && !isPdf && !isTekst && (
              <div style={{ background:C.bgDeep, borderRadius:12, padding:20, textAlign:"center", marginBottom:12 }}>
                <div style={{ fontSize:48, marginBottom:8 }}>📄</div>
                <div style={{ color:C.inkMid, fontSize:13, fontWeight:700 }}>{materijal.datoteka.name}</div>
                <div style={{ color:C.inkLight, fontSize:11, marginTop:4 }}>({(materijal.datoteka.size/1024).toFixed(1)} KB)</div>
              </div>
            )}
            <Btn label="⬇ Preuzmi datoteku" color={boja} full onClick={handleDownload} />
          </div>
        ) : materijal.sadrzajRich ? (
          /* Strukturirani sadrzaj (demo ili učenički unos) */
          <SadrzajRichPregled sadrzajRich={materijal.sadrzajRich} boja={boja} bojaLight={bojaLight} />
        ) : materijal.sadrzaj ? (
          /* Slobodni tekst koji je učenik upisao pri dodavanju */
          <div>
            <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>📋 Sadržaj bilješki</div>
            <div style={{ background:C.bgDeep, borderRadius:14, padding:16, maxHeight:340, overflowY:"auto" }}>
              <pre style={{ margin:0, fontFamily:"'Nunito', sans-serif", fontSize:13, color:C.ink, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{materijal.sadrzaj}</pre>
            </div>
          </div>
        ) : (
          <div style={{ background:C.bgDeep, borderRadius:14, padding:16 }}>
            <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.8 }}>{materijal.opis}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- QUIZ COMPONENT ----
function KvizIgra({ predmet, nacin, onZavrsi, pitanjaOverride }) {
  const svaP = pitanjaOverride || KVIZ_BANKA[predmet] || [];
  const brPitanja = nacin === "kviz" ? 8 : 12;
  const bpPoPitanju = nacin === "kviz" ? 3 : 2;
  const [pitanja] = useState(() => shuffle(svaP).slice(0, Math.min(brPitanja, svaP.length)));
  const [trenutni, setTrenutni] = useState(0);
  const [odgovori, setOdgovori] = useState({});
  const [provjerenо, setProvjerenо] = useState(false);
  const [zavrseno, setZavrseno] = useState(false);
  const [sparivanje, setSparivanje] = useState({});

  const p = pitanja[trenutni];
  if (!p) return null;

  const odgovori_user = odgovori[trenutni];
  const tocan = (() => {
    if (p.tip === "mcq") return odgovori_user === p.tocno;
    if (p.tip === "tocno_netocno") return odgovori_user === p.tocno;
    if (p.tip === "popuni") return odgovori_user?.toLowerCase().trim() === p.tocno.toLowerCase().trim();
    if (p.tip === "sparivanje") {
      return p.parovi.every(([l, d]) => sparivanje[l] === d);
    }
    return false;
  })();

  const ukupnoBodova = () => {
    let b = 0;
    pitanja.forEach((pp, i) => {
      const od = odgovori[i];
      const sp = {};
      let ok = false;
      if (pp.tip === "mcq") ok = od === pp.tocno;
      else if (pp.tip === "tocno_netocno") ok = od === pp.tocno;
      else if (pp.tip === "popuni") ok = od?.toLowerCase().trim() === pp.tocno.toLowerCase().trim();
      else if (pp.tip === "sparivanje") {
        ok = pp.parovi.every(([l,d]) => od?.[l] === d);
      }
      if (ok) b += bpPoPitanju;
    });
    return b;
  };

  const sljedece = () => {
    if (trenutni < pitanja.length - 1) {
      setTrenutni(i => i + 1);
      setProvjerenо(false);
      setSparivanje({});
    } else {
      setZavrseno(true);
    }
  };

  if (zavrseno) {
    const b = ukupnoBodova();
    const max = pitanja.length * bpPoPitanju;
    const posto = Math.round((b / max) * 100);
    return (
      <div style={{ padding:24, textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:8 }}>{posto >= 80 ? "🏆" : posto >= 50 ? "⭐" : "💪"}</div>
        <h2 style={{ color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900, marginBottom:4 }}>Gotovo!</h2>
        <div style={{ fontSize:40, fontWeight:900, color:b>0?C.teal:C.rose, fontFamily:"'Nunito', sans-serif", margin:"12px 0" }}>
          {b} / {max}
        </div>
        <div style={{ color:C.inkMid, fontSize:14, marginBottom:8 }}>{posto}% točnih odgovora</div>
        <div style={{ background:posto>=80?C.greenLight:posto>=50?C.amberLight:C.roseLight, borderRadius:12, padding:"10px 16px", marginBottom:20, color:posto>=80?C.green:posto>=50?C.amber:C.rose, fontWeight:800, fontSize:14 }}>
          {posto >= 80 ? "Izvrsno! Odlično vladaš gradivom! 🎉" : posto >= 50 ? "Dobro, ali ima mjesta za napredak! 📚" : "Vježbaj više, uspjeh dolazi s trudom! 💡"}
        </div>
        <div style={{ background:C.tealLight, borderRadius:12, padding:"10px 16px", marginBottom:20, color:C.teal, fontWeight:800, fontSize:14 }}>
          +{b} bodova zarađeno!
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <Btn label="🔄 Igraj ponovo" color={C.teal} onClick={()=>onZavrsi(b, true)} />
          <Btn label="✓ Zatvori" color={C.inkLight} outline onClick={()=>onZavrsi(b, false)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:20 }}>
      {/* Progress */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:13, color:C.inkMid, fontWeight:700 }}>Pitanje {trenutni+1} / {pitanja.length}</div>
        <Pill label={predmet} color={C.teal} bg={C.tealLight} />
      </div>
      <div style={{ height:6, background:C.bgDeep, borderRadius:99, marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((trenutni+1)/pitanja.length)*100}%`, background:C.teal, borderRadius:99, transition:"width 0.4s" }} />
      </div>

      {/* Pitanje */}
      <div style={{ background:C.bgDeep, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:C.inkLight, fontWeight:700, textTransform:"uppercase", marginBottom:6 }}>
          {p.tip==="mcq"?"Višestruki izbor":p.tip==="tocno_netocno"?"Točno / Netočno":p.tip==="popuni"?"Popuni prazninu":"Sparivanje"}
        </div>
        <div style={{ color:C.ink, fontWeight:800, fontSize:15, lineHeight:1.6, fontFamily:"'Nunito', sans-serif" }}>{p.pitanje}</div>
      </div>

      {/* MCQ */}
      {p.tip === "mcq" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
          {p.opcije.map((o, i) => {
            let bg = C.bg, border = C.cardBorder, color = C.ink;
            if (provjerenо) {
              if (i === p.tocno) { bg = C.greenLight; border = C.green; color = C.green; }
              else if (odgovori_user === i && i !== p.tocno) { bg = C.roseLight; border = C.rose; color = C.rose; }
            } else if (odgovori_user === i) { bg = C.blueLight; border = C.blue; color = C.blue; }
            return (
              <button key={i} onClick={()=>!provjerenо&&setOdgovori(prev=>({...prev,[trenutni]:i}))}
                style={{ background:bg, border:`2px solid ${border}`, borderRadius:12, padding:"12px 16px", textAlign:"left", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, color, cursor:provjerenо?"default":"pointer", transition:"all 0.15s" }}>
                <span style={{ fontWeight:900, marginRight:8 }}>{["A","B","C","D"][i]}.</span>{o}
                {provjerenо && i===p.tocno && " ✓"}
                {provjerenо && odgovori_user===i && i!==p.tocno && " ✗"}
              </button>
            );
          })}
        </div>
      )}

      {/* T/F */}
      {p.tip === "tocno_netocno" && (
        <div style={{ display:"flex", gap:12, marginBottom:16 }}>
          {[true, false].map(v => {
            let bg = C.bg, border = C.cardBorder, color = C.ink;
            if (provjerenо) {
              if (v === p.tocno) { bg = C.greenLight; border = C.green; color = C.green; }
              else if (odgovori_user === v && v !== p.tocno) { bg = C.roseLight; border = C.rose; color = C.rose; }
            } else if (odgovori_user === v) { bg = C.blueLight; border = C.blue; color = C.blue; }
            return (
              <button key={String(v)} onClick={()=>!provjerenо&&setOdgovori(prev=>({...prev,[trenutni]:v}))}
                style={{ flex:1, background:bg, border:`2px solid ${border}`, borderRadius:12, padding:"16px 0", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:16, color, cursor:provjerenо?"default":"pointer" }}>
                {v ? "✅ Točno" : "❌ Netočno"}
              </button>
            );
          })}
        </div>
      )}

      {/* Popuni */}
      {p.tip === "popuni" && (
        <div style={{ marginBottom:16 }}>
          <input
            type="text"
            value={odgovori_user || ""}
            onChange={e=>!provjerenо&&setOdgovori(prev=>({...prev,[trenutni]:e.target.value}))}
            placeholder="Upiši odgovor..."
            disabled={provjerenо}
            style={{ width:"100%", background:provjerenо?(tocan?C.greenLight:C.roseLight):C.bg, color:provjerenо?(tocan?C.green:C.rose):C.ink, border:`2px solid ${provjerenо?(tocan?C.green:C.rose):C.blue}`, borderRadius:12, padding:"12px 16px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:15, boxSizing:"border-box", outline:"none" }}
          />
          {provjerenо && !tocan && (
            <div style={{ marginTop:6, color:C.green, fontWeight:700, fontSize:13 }}>Točan odgovor: <strong>{p.tocno}</strong></div>
          )}
        </div>
      )}

      {/* Sparivanje */}
      {p.tip === "sparivanje" && (
        <div style={{ marginBottom:16 }}>
          {p.parovi.map(([lijevo, desno], i) => {
            const odabrano = sparivanje[lijevo];
            let borderColor = C.cardBorder;
            if (provjerenо) borderColor = sparivanje[lijevo]===desno ? C.green : C.rose;
            else if (odabrano) borderColor = C.blue;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ flex:1, background:C.bgDeep, borderRadius:10, padding:"10px 14px", fontWeight:700, fontSize:13, color:C.ink }}>{lijevo}</div>
                <div style={{ color:C.inkLight }}>→</div>
                <select
                  value={odabrano || ""}
                  onChange={e=>!provjerenо&&setSparivanje(prev=>({...prev,[lijevo]:e.target.value}))}
                  disabled={provjerenо}
                  style={{ flex:1, background:C.bg, color:C.ink, border:`2px solid ${borderColor}`, borderRadius:10, padding:"9px 10px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, outline:"none" }}>
                  <option value="">— odaberi —</option>
                  {p.parovi.map(([_, d]) => <option key={d} value={d}>{d}</option>)}
                </select>
                {provjerenо && <span>{sparivanje[lijevo]===desno?"✅":"❌"}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Objašnjenje */}
      {provjerenо && (
        <div style={{ background:tocan?C.greenLight:C.amberLight, border:`1.5px solid ${tocan?C.green:C.amber}44`, borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ fontWeight:900, color:tocan?C.green:C.amber, marginBottom:4, fontSize:14 }}>
            {tocan ? "✅ Točno!" : "💡 Objašnjenje"}
          </div>
          <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.6 }}>{p.objasnjenje}</div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display:"flex", gap:10 }}>
        {!provjerenо ? (
          <Btn label="Provjeri odgovor" color={C.teal} full
            disabled={
              (p.tip==="mcq" && odgovori_user===undefined) ||
              (p.tip==="tocno_netocno" && odgovori_user===undefined) ||
              (p.tip==="popuni" && !odgovori_user?.trim()) ||
              (p.tip==="sparivanje" && p.parovi.some(([l])=>!sparivanje[l]))
            }
            onClick={()=>{
              if (p.tip==="sparivanje") setOdgovori(prev=>({...prev,[trenutni]:{...sparivanje}}));
              setProvjerenо(true);
            }} />
        ) : (
          <Btn label={trenutni < pitanja.length-1 ? "Sljedeće pitanje →" : "Završi kviz 🏁"} color={C.blue} full onClick={sljedece} />
        )}
      </div>
    </div>
  );
}

// ---- TABS ----
function UcimoZajedno({ korisnik, ponude, setPonude, onNotifikacija, addBodovi }) {
  const [predFilter, setPredFilter] = useState("Svi");
  const [razFilter, setRazFilter] = useState("Svi");
  const [novaModal, setNovaModal] = useState(false);
  const [detaljiModal, setDetaljiModal] = useState(null);
  const filtered = ponude.filter(p=>(predFilter==="Svi"||p.predmet===predFilter)&&(razFilter==="Svi"||p.razred===razFilter));
  const rezerviraj = (ponudaId, dan, sat) => {
    const danSlug = dan.split(' ')[0]; // "Pon 9.6.2025." → "Pon"
    setPonude(prev=>prev.map(p=>p.id===ponudaId?{...p,termini:p.termini.map(t=>t.dan===danSlug&&t.sat===sat?{...t,slobodan:false}:t),prijave:[...(p.prijave||[]),`${korisnik.ime} ${korisnik.prezime[0]}.`]}:p));
    setDetaljiModal(prev=>prev?{...prev,termini:prev.termini.map(t=>t.dan===danSlug&&t.sat===sat?{...t,slobodan:false}:t),prijave:[...(prev.prijave||[]),`${korisnik.ime} ${korisnik.prezime[0]}.`]}:null);
    onNotifikacija({ tekst:`📅 Rezervirali ste termin za ${dan} u ${sat}. +5 bodova!`, boja:C.teal });
    addBodovi(5);
  };
  return (
    <div>
      {novaModal && <NovaPonudaModal korisnik={korisnik} onClose={()=>setNovaModal(false)} onDodaj={nova=>{setPonude(prev=>[nova,...prev]);addBodovi(8);onNotifikacija({tekst:"🎉 Objava je objavljena! +8 bodova",boja:C.teal});}} />}
      {detaljiModal && <DetaljiPonudeModal ponuda={detaljiModal} korisnik={korisnik} onClose={()=>setDetaljiModal(null)} onRezervacija={rezerviraj} />}
      <div style={{ padding:"0 16px 12px", display:"flex", gap:8 }}>
        {korisnik.uloga === "ucitelj" ? (
          <Btn label="📚 Ponudi poduku" color={C.teal} onClick={()=>setNovaModal(true)} />
        ) : (
          <>
            <Btn label="🙋 Nudim pomoć" color={C.teal} onClick={()=>setNovaModal(true)} />
            <Btn label="🤔 Tražim pomoć" color={C.rose} onClick={()=>setNovaModal(true)} />
          </>
        )}
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
                <div style={{ marginTop:8, background:C.bgDeep, borderRadius:8, padding:"7px 10px" }}>
                  <div style={{ fontSize:10, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Lekcija</div>
                  <div style={{ color:C.ink, fontWeight:700, fontSize:13 }}>📖 {p.lekcija}</div>
                </div>
                {p.opis && <div style={{ marginTop:6, color:C.inkMid, fontSize:12, lineHeight:1.5 }}>{p.opis.slice(0,90)}{p.opis.length>90?"...":""}</div>}
                <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                  {p.termini.filter(t=>t.slobodan).slice(0,3).map((t,i)=>(
                    <Pill key={i} label={`${t.dan} ${t.sat}`} color={C.teal} bg={C.tealLight} />
                  ))}
                  {p.termini.filter(t=>t.slobodan).length===0 && <Pill label="Nema slobodnih termina" color={C.inkLight} bg={C.bgDeep} />}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KvizModal({ materijal, onClose, addBodovi, onNotifikacija }) {
  const [gotov, setGotov] = useState(false);
  const [nacin, setNacin] = useState(null);
  const [kljuc, setKljuc] = useState(0);

  // Filter questions by subject, then prioritise those matching the lekcija title keywords
  const svaPredjPitanja = KVIZ_BANKA[materijal.predmet] || [];
  const keywords = (materijal.lekcija||"").toLowerCase().split(/\s+/).filter(w=>w.length>3);
  const filtriranaPitanja = keywords.length > 0
    ? svaPredjPitanja.filter(p => keywords.some(kw => p.pitanje.toLowerCase().includes(kw)))
    : svaPredjPitanja;
  const pitanjaZaKviz = filtriranaPitanja.length >= 4 ? filtriranaPitanja : svaPredjPitanja;
  const imaBanku = pitanjaZaKviz.length > 0;
  const generiranoIzMaterijala = filtriranaPitanja.length >= 4;

  const zavrsi = (bodovi, ponoviIsto) => {
    addBodovi(bodovi);
    onNotifikacija({ tekst:`🧠 Kviz "${materijal.lekcija}" završen! +${bodovi} bodova`, boja:C.plum });
    if (ponoviIsto) { setKljuc(k=>k+1); }
    else { setGotov(true); setTimeout(onClose, 1400); }
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#1a161299", zIndex:600, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ padding:"16px 20px 10px", borderBottom:`1px solid ${C.cardBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.card, zIndex:10 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:15, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>🧠 Kviz za ponavljanje</div>
            <div style={{ fontSize:12, color:C.inkMid }}>{materijal.ikona} {materijal.lekcija} · {materijal.predmet}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.inkLight }}>✕</button>
        </div>

        {!imaBanku ? (
          <div style={{ padding:24, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚧</div>
            <div style={{ color:C.inkMid, fontSize:14 }}>Za ovaj predmet još nema pitanja u banci kvizova.</div>
          </div>
        ) : gotov ? (
          <div style={{ padding:24, textAlign:"center" }}>
            <div style={{ fontSize:56 }}>🎉</div>
            <div style={{ color:C.teal, fontWeight:900, fontFamily:"'Nunito', sans-serif", fontSize:18, marginTop:8 }}>Odlično! Kviz završen.</div>
          </div>
        ) : !nacin ? (
          <div style={{ padding:20 }}>
            {/* Material study card */}
            <div style={{ background:C.plumLight, border:`1.5px solid ${C.plum}33`, borderRadius:14, padding:14, marginBottom:16 }}>
              <div style={{ fontSize:12, color:C.plum, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>
                {generiranoIzMaterijala ? "✅ Kviz generiran iz ovog materijala" : "📚 Kviz za predmet"}
              </div>
              <div style={{ fontWeight:900, color:C.ink, fontSize:15, marginBottom:4 }}>{materijal.ikona} {materijal.lekcija}</div>
              {materijal.opis && (
                <div style={{ color:C.inkMid, fontSize:12, lineHeight:1.65, marginBottom:6, whiteSpace:"pre-wrap" }}>
                  {materijal.opis.slice(0,160)}{materijal.opis.length>160?"…":""}
                </div>
              )}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                <span style={{ background:C.card, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700, color:C.plum }}>{materijal.predmet}</span>
                <span style={{ background:C.card, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700, color:C.inkMid }}>{pitanjaZaKviz.length} pitanja dostupno</span>
              </div>
            </div>

            <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Odaberi način ponavljanja</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={()=>setNacin("kviz")} style={{ background:C.plum, color:C.card, border:"none", borderRadius:14, padding:"16px 18px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:14, cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>⚡ Brzi kviz</div>
                <div style={{ fontWeight:700, opacity:0.85 }}>8 nasumičnih pitanja · 3 boda/točno</div>
                <div style={{ fontSize:11, opacity:0.7, marginTop:2 }}>Provjeri jesi li razumio gradivo</div>
              </button>
              <button onClick={()=>setNacin("vjezba")} style={{ background:C.blue, color:C.card, border:"none", borderRadius:14, padding:"16px 18px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:14, cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>📚 Temeljita vježba</div>
                <div style={{ fontWeight:700, opacity:0.85 }}>12 nasumičnih pitanja · 2 boda/točno</div>
                <div style={{ fontSize:11, opacity:0.7, marginTop:2 }}>Dublje ponovi sve što si naučio/la</div>
              </button>
            </div>
          </div>
        ) : (
          <div key={kljuc}>
            <KvizIgra predmet={materijal.predmet} nacin={nacin} onZavrsi={zavrsi} pitanjaOverride={pitanjaZaKviz} />
          </div>
        )}
      </div>
    </div>
  );
}

function Biljeske({ korisnik, materijali, setMaterijali, addBodovi, onNotifikacija }) {
  const [predFilter, setPredFilter] = useState("Svi");
  const [tipFilter, setTipFilter] = useState("Svi");
  const [modal, setModal] = useState(false);
  const [pregled, setPregled] = useState(null);
  const [kvizMaterijal, setKvizMaterijal] = useState(null);
  const [noviBiljezak, setNoviBiljezak] = useState({ predmet:"Matematika", lekcija:"", tip:"Bilješke", opis:"", sadrzaj:"", datoteka:null });
  const tipovi = ["Svi","Bilješke","Sažetak","Umna mapa"];
  const filtered = materijali.filter(m=>(predFilter==="Svi"||m.predmet===predFilter)&&(tipFilter==="Svi"||m.tip===tipFilter));
  const fileRef = useRef(null);

  const objavi = () => {
    const ikone = {"Bilješke":"📝","Sažetak":"📄","Umna mapa":"🗺️"};
    const novi = {
      id:Date.now(), autor:`${korisnik.ime} ${korisnik.prezime[0]}.`, avatar:korisnik.avatar,
      predmet:noviBiljezak.predmet, lekcija:noviBiljezak.lekcija||"Opće",
      tip:noviBiljezak.tip, ikona:ikone[noviBiljezak.tip]||"📝",
      preuzimanja:0, datum:new Date().toLocaleDateString("hr-HR"),
      opis:noviBiljezak.opis||"Novi materijal",
      sadrzaj:noviBiljezak.sadrzaj||null,
      datoteka:noviBiljezak.datoteka
    };
    setMaterijali(prev=>[novi,...prev]);
    addBodovi(12);
    onNotifikacija({ tekst:`📤 Materijal objavljen! +12 bodova`, boja:C.teal });
    setModal(false);
    setNoviBiljezak({ predmet:"Matematika", lekcija:"", tip:"Bilješke", opis:"", sadrzaj:"", datoteka:null });
  };

  return (
    <div>
      {pregled && <PregledDatotekeModal materijal={pregled} onClose={()=>setPregled(null)} />}
      {kvizMaterijal && <KvizModal materijal={kvizMaterijal} onClose={()=>setKvizMaterijal(null)} addBodovi={addBodovi} onNotifikacija={onNotifikacija} />}
      {modal && (
        <div onClick={()=>setModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📤 Dodaj materijal</h3>
              <button onClick={()=>setModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Predmet</p>
            <select value={noviBiljezak.predmet} onChange={e=>setNoviBiljezak(p=>({...p,predmet:e.target.value}))} style={{ width:"100%", background:C.bg, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:14, marginBottom:12, outline:"none" }}>
              {PREDMETI.map(p=><option key={p}>{p}</option>)}
            </select>
            <FInp label="Lekcija / naziv" value={noviBiljezak.lekcija} onChange={e=>setNoviBiljezak(p=>({...p,lekcija:e.target.value}))} placeholder="npr. Razlomci" />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Tip</p>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Bilješke","Sažetak","Umna mapa"].map(t=>(
                <button key={t} onClick={()=>setNoviBiljezak(p=>({...p,tip:t}))} style={{ flex:1, padding:"8px 0", borderRadius:10, border:`2px solid ${noviBiljezak.tip===t?C.teal:C.cardBorder}`, background:noviBiljezak.tip===t?C.tealLight:C.bg, color:noviBiljezak.tip===t?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
            <FInp label="Kratki opis" value={noviBiljezak.opis} onChange={e=>setNoviBiljezak(p=>({...p,opis:e.target.value}))} placeholder="Što je u materijalu..." />
            <p style={{ margin:"0 0 6px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Sadržaj bilješki (upiši direktno)</p>
            <textarea
              rows={6}
              value={noviBiljezak.sadrzaj}
              onChange={e=>setNoviBiljezak(p=>({...p,sadrzaj:e.target.value}))}
              placeholder={noviBiljezak.tip==="Umna mapa"
                ? "Upiši pojmove i veze, npr.:\nJednadžbe\n  → Linearne: ax + b = 0\n  → Kvadratne: ax² + bx + c = 0\n  → Provjera: uvrstiti x natrag"
                : noviBiljezak.tip==="Sažetak"
                ? "Upiši ključne točke, npr.:\nUvod: ...\n\n✅ Signal words:\n- already (već)\n- yet (još)\n\n📊 Primjeri:\n- ..."
                : "Upiši bilješke, formule i primjere:\n\n1. Zakon inercije — ...\n\nFormule:\nF = m · a\n\nZadatak:\n..."}
              style={{ width:"100%", background:C.bgDeep, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:12, padding:"10px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"vertical", boxSizing:"border-box", marginBottom:12, outline:"none", lineHeight:1.6 }}
            />
            <input ref={fileRef} type="file" accept="image/*,.pdf,.docx,.txt" style={{ display:"none" }} onChange={e=>{ if (e.target.files[0]) setNoviBiljezak(p=>({...p,datoteka:e.target.files[0]})); }} />
            <button onClick={()=>fileRef.current?.click()} style={{ width:"100%", padding:14, borderRadius:12, border:`2px dashed ${noviBiljezak.datoteka?C.teal:C.cardBorder}`, background:noviBiljezak.datoteka?C.tealLight:C.bg, color:noviBiljezak.datoteka?C.teal:C.inkLight, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", marginBottom:16 }}>
              {noviBiljezak.datoteka ? `📎 ${noviBiljezak.datoteka.name}` : "📎 Ili učitaj datoteku (slika, PDF...)"}
            </button>
            <Btn label="📤 Objavi materijal (+12 bodova)" color={C.teal} full onClick={objavi} />
          </div>
        </div>
      )}
      <div style={{ padding:"0 16px 12px" }}>
        <Btn label="➕ Dodaj materijal" color={C.teal} onClick={()=>setModal(true)} />
      </div>
      <div style={{ padding:"0 16px 8px", display:"flex", gap:6, overflowX:"auto" }}>
        {["Svi",...PREDMETI.slice(0,6)].map(p=>(
          <button key={p} onClick={()=>setPredFilter(p)} style={{ background:predFilter===p?C.teal:C.bgDeep, color:predFilter===p?C.card:C.inkMid, border:`1.5px solid ${predFilter===p?C.teal:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{p}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px 8px", display:"flex", gap:6 }}>
        {tipovi.map(t=>(
          <button key={t} onClick={()=>setTipFilter(t)} style={{ background:tipFilter===t?C.plum:C.bgDeep, color:tipFilter===t?C.card:C.inkMid, border:`1.5px solid ${tipFilter===t?C.plum:C.cardBorder}`, borderRadius:99, padding:"5px 11px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        {filtered.map(m=>(
          <Card key={m.id} accent={C.plum}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ fontSize:36 }}>{m.ikona}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ color:C.ink, fontWeight:800, fontSize:15, fontFamily:"'Nunito', sans-serif" }}>{m.lekcija}</div>
                    <div style={{ color:C.inkMid, fontSize:12 }}>{m.autor} · {m.predmet}</div>
                  </div>
                  <Pill label={m.tip} color={C.plum} bg={C.plumLight} />
                </div>
                {m.opis && <div style={{ marginTop:6, color:C.inkMid, fontSize:12, lineHeight:1.5 }}>{m.opis.slice(0,80)}{m.opis.length>80?"...":""}</div>}
                <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ color:C.inkLight, fontSize:12 }}>⬇ {m.preuzimanja}</span>
                  <span style={{ color:C.inkLight, fontSize:12 }}>📅 {m.datum}</span>
                  <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                    <Btn label="👁 Pregled" small color={m.datoteka||m.sadrzajRich||m.sadrzaj?C.teal:C.blue} onClick={()=>setPregled(m)} />
                    <Btn label="🧠 Kviz" small color={C.plum} onClick={()=>setKvizMaterijal(m)} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SkolskiBuvljak({ korisnik, razmjena, setRazmjena, addBodovi, onNotifikacija }) {
  const [filter, setFilter] = useState("Svi");
  const [modal, setModal] = useState(false);
  const [zamjenaZa, setZamjenaZa] = useState(null);
  const [novaStvar, setNovaStvar] = useState({ tip:"Donacija", predmet:"", kat:"Knjige", opis:"", slike:[] });
  const [slika_urls, setSlika_urls] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const fileRef = useRef(null);
  const kategFiltri = ["Svi","Knjige","Odjeća","Igračke","Hrana","Ostalo"];
  const mojeIme = `${korisnik.ime} ${korisnik.prezime[0]}.`;

  const parseHrDate = (str) => {
    const [d, m, y] = str.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  const add3WorkingDays = (from) => {
    let d = new Date(from);
    let added = 0;
    while (added < 3) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return d;
  };

  useEffect(() => {
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    setRazmjena(prev =>
      prev
        .filter(r => {
          if (!r.rezerviran) return true;
          const exp = parseHrDate(r.rezerviran.do);
          return !(exp < danas && r.kat === "Hrana");
        })
        .map(r => {
          if (!r.rezerviran) return r;
          const exp = parseHrDate(r.rezerviran.do);
          if (exp < danas) return { ...r, rezerviran: null };
          return r;
        })
    );
  }, []);

  const filtered = razmjena.filter(r=>filter==="Svi"||r.kat===filter);

  const handleSlikeChange = (e) => {
    const files = Array.from(e.target.files);
    setNovaStvar(p=>({...p, slike:files}));
    setSlika_urls(files.map(f => URL.createObjectURL(f)));
  };

  const potvrdiDonaciju = () => {
    const ikone = {"Knjige":"📚","Odjeća":"👕","Igračke":"🧩","Hrana":"🍎","Ostalo":"📦"};
    const nova = {
      id:Date.now(), korisnik:mojeIme,
      tip:novaStvar.tip, predmet:novaStvar.predmet||"Predmet",
      kat:novaStvar.kat, ikona:ikone[novaStvar.kat]||"📦",
      svjezina:novaStvar.kat==="Hrana"?"3 dana":null,
      opis:novaStvar.opis||"Nema opisa.", slike:novaStvar.slike, rezerviran:null
    };
    setRazmjena(prev=>[nova,...prev]);
    addBodovi(10);
    onNotifikacija({ tekst:`📦 Objava objavljena! +10 bodova`, boja:C.teal });
    setModal(false);
    setNovaStvar({ tip:"Donacija", predmet:"", kat:"Knjige", opis:"", slike:[] });
    setSlika_urls([]);
  };

  const rezerviraj = (r) => {
    if (r.rezerviran || r.korisnik === mojeIme) return;
    const expiry = add3WorkingDays(new Date());
    const expStr = expiry.toLocaleDateString("hr-HR");
    setRazmjena(prev=>prev.map(item=>item.id===r.id ? {...item, rezerviran:{ korisnik:mojeIme, do:expStr }} : item));
    onNotifikacija({ tekst:`🔒 Rezervirali ste "${r.predmet}". Preuzimanje do ${expStr} (3 radna dana).`, boja:C.blue });
  };

  const uruceno = (r) => {
    setRazmjena(prev => prev.filter(item => item.id !== r.id));
    addBodovi(15);
    onNotifikacija({ tekst:`🎁 Predmet "${r.predmet}" uspješno uručen! +15 bodova`, boja:C.teal });
  };

  const slobodneZaZamjenu = razmjena.filter(r => r.tip==="Razmjena" && !r.rezerviran && r.korisnik !== mojeIme && zamjenaZa && r.id !== zamjenaZa.id);

  return (
    <div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{ position:"fixed", inset:0, background:"#000000dd", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img
              src={typeof lightbox.slike[lightbox.idx] === "string" ? lightbox.slike[lightbox.idx] : URL.createObjectURL(lightbox.slike[lightbox.idx])}
              alt=""
              style={{ maxWidth:"88vw", maxHeight:"80vh", borderRadius:16, objectFit:"contain", display:"block", boxShadow:"0 8px 40px #00000088" }}
            />
            <button onClick={()=>setLightbox(null)} style={{ position:"absolute", top:-14, right:-14, width:34, height:34, borderRadius:"50%", background:"#fff", border:"none", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px #00000044" }}>✕</button>
            {lightbox.slike.length > 1 && lightbox.idx > 0 && (
              <button onClick={e=>{ e.stopPropagation(); setLightbox(p=>({...p,idx:p.idx-1})); }} style={{ position:"absolute", left:-20, top:"50%", transform:"translateY(-50%)", width:38, height:38, borderRadius:"50%", background:"#fff", border:"none", fontSize:22, cursor:"pointer", boxShadow:"0 2px 10px #00000044", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            )}
            {lightbox.slike.length > 1 && lightbox.idx < lightbox.slike.length - 1 && (
              <button onClick={e=>{ e.stopPropagation(); setLightbox(p=>({...p,idx:p.idx+1})); }} style={{ position:"absolute", right:-20, top:"50%", transform:"translateY(-50%)", width:38, height:38, borderRadius:"50%", background:"#fff", border:"none", fontSize:22, cursor:"pointer", boxShadow:"0 2px 10px #00000044", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            )}
            {lightbox.slike.length > 1 && (
              <div style={{ position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)", color:"#ffffffcc", fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>{lightbox.idx+1} / {lightbox.slike.length}</div>
            )}
          </div>
        </div>
      )}

      {/* Nova objava modal */}
      {modal && (
        <div onClick={()=>setModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>🎒 Nova objava</h3>
              <button onClick={()=>setModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Donacija","Razmjena"].map(t=>(
                <button key={t} onClick={()=>setNovaStvar(p=>({...p,tip:t}))} style={{ flex:1, padding:"10px 0", borderRadius:12, border:`2px solid ${novaStvar.tip===t?(t==="Donacija"?C.teal:C.blue):C.cardBorder}`, background:novaStvar.tip===t?(t==="Donacija"?C.tealLight:C.blueLight):C.bg, color:novaStvar.tip===t?(t==="Donacija"?C.teal:C.blue):C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                  {t==="Donacija"?"🎁 Donacija":"🔄 Razmjena"}
                </button>
              ))}
            </div>
            <FInp label="Naziv predmeta" value={novaStvar.predmet} onChange={e=>setNovaStvar(p=>({...p,predmet:e.target.value}))} placeholder="npr. Harry Potter, jakna..." />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Kategorija</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {["Knjige","Odjeća","Igračke","Hrana","Ostalo"].map(k=>(
                <button key={k} onClick={()=>setNovaStvar(p=>({...p,kat:k}))} style={{ padding:"7px 14px", borderRadius:10, border:`2px solid ${novaStvar.kat===k?C.amber:C.cardBorder}`, background:novaStvar.kat===k?C.amberLight:C.bg, color:novaStvar.kat===k?C.amber:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{k}</button>
              ))}
            </div>
            <FInp label="Opis" value={novaStvar.opis} onChange={e=>setNovaStvar(p=>({...p,opis:e.target.value}))} placeholder="Kratki opis stanja i detalja..." />
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleSlikeChange} />
            <button onClick={()=>fileRef.current?.click()} style={{ width:"100%", padding:12, borderRadius:12, border:`2px dashed ${slika_urls.length>0?C.teal:C.blue}`, background:slika_urls.length>0?C.tealLight:C.blueLight, color:slika_urls.length>0?C.teal:C.blue, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:slika_urls.length>0?10:14 }}>
              {slika_urls.length>0 ? `📸 ${slika_urls.length} fotografija odabrano` : "📸 Dodaj fotografije"}
            </button>
            {slika_urls.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:14 }}>
                {slika_urls.map((url,i)=><img key={i} src={url} alt="" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderRadius:10, border:`2px solid ${C.teal}` }} />)}
              </div>
            )}
            <Btn label="✅ Potvrdi i objavi (+10 bodova)" color={C.teal} full onClick={potvrdiDonaciju} disabled={!novaStvar.predmet.trim()} />
          </div>
        </div>
      )}

      {/* Predloži zamjenu modal */}
      {zamjenaZa && (
        <div onClick={()=>setZamjenaZa(null)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>🔄 Predloži zamjenu</h3>
              <button onClick={()=>setZamjenaZa(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <div style={{ background:C.blueLight, border:`1.5px solid ${C.blue}33`, borderRadius:12, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.inkMid }}>
              Odaberi što nudiš u zamjenu za <strong style={{ color:C.ink }}>{zamjenaZa.predmet}</strong> (@{zamjenaZa.korisnik}):
            </div>
            {slobodneZaZamjenu.length === 0
              ? <div style={{ textAlign:"center", padding:24, color:C.inkLight, fontSize:13 }}>Nema slobodnih predmeta za razmjenu.</div>
              : slobodneZaZamjenu.map(r=>(
                <div key={r.id} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:12, padding:"12px 14px", marginBottom:8, display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:28 }}>{r.ikona}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:C.ink, fontSize:14 }}>{r.predmet}</div>
                    <div style={{ fontSize:12, color:C.inkMid }}>@{r.korisnik} · {r.kat}</div>
                  </div>
                  <Btn label="Predloži" small color={C.blue} onClick={()=>{ onNotifikacija({ tekst:`🔄 Poslali ste prijedlog zamjene za "${r.predmet}"`, boja:C.blue }); setZamjenaZa(null); }} />
                </div>
              ))
            }
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px 12px" }}>
        <Btn label="➕ Dodaj predmet" color={C.amber} textColor={C.ink} onClick={()=>setModal(true)} />
      </div>
      <div style={{ padding:"0 16px 8px", display:"flex", gap:6, overflowX:"auto" }}>
        {kategFiltri.map(k=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?C.amber:C.bgDeep, color:filter===k?C.ink:C.inkMid, border:`1.5px solid ${filter===k?C.amber:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{k}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        {filtered.map(r=>{
          const jeVlasnik = r.korisnik === mojeIme;
          const jeRezerviranMnom = r.rezerviran?.korisnik === mojeIme;
          return (
            <Card key={r.id} accent={r.rezerviran ? C.inkLight : r.tip==="Donacija"?C.teal:C.blue}>
              {r.slike && r.slike.length > 0 && (
                <div style={{ display:"flex", gap:8, marginBottom:12, overflowX:"auto" }}>
                  {r.slike.map((f,i)=>{
                    const src = typeof f === "string" ? f : URL.createObjectURL(f);
                    return (
                      <div key={i} onClick={()=>setLightbox({ slike:r.slike, idx:i })} style={{ position:"relative", width:90, height:90, flexShrink:0, cursor:"pointer" }}>
                        <img src={src} alt="" style={{ width:90, height:90, objectFit:"cover", borderRadius:12, border:`1.5px solid ${C.cardBorder}`, display:"block" }} />
                        {r.rezerviran && (
                          <div style={{ position:"absolute", inset:0, borderRadius:12, background:"#00000055", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <div style={{ background:"#e03e5cdd", color:"#fff", fontSize:8, fontWeight:900, fontFamily:"'Nunito',sans-serif", letterSpacing:0.5, padding:"3px 7px", borderRadius:6, transform:"rotate(-20deg)", textTransform:"uppercase", whiteSpace:"nowrap" }}>Rezervirano</div>
                          </div>
                        )}
                        <div style={{ position:"absolute", bottom:5, right:5, background:"#00000066", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>🔍</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ display:"flex", gap:10, flex:1 }}>
                  <div style={{ fontSize:32, opacity:r.rezerviran?0.5:1 }}>{r.ikona}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:15, color:r.rezerviran?C.inkMid:C.ink, fontFamily:"'Nunito', sans-serif" }}>{r.predmet}</div>
                    <div style={{ color:C.inkMid, fontSize:12 }}>@{r.korisnik}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Pill label={r.tip} color={r.rezerviran?C.inkLight:r.tip==="Donacija"?C.teal:C.blue} bg={r.rezerviran?C.bgDeep:r.tip==="Donacija"?C.tealLight:C.blueLight} />
                  <Pill label={r.kat} color={C.amber} bg={C.amberLight} />
                </div>
              </div>
              {r.svjezina && (
                <div style={{ marginTop:6 }}><Pill label={`Svježe do: ${r.svjezina}`} color={C.orange} bg={C.orangeLight} /></div>
              )}
              {r.rezerviran && (
                <div style={{ marginTop:8, background:C.bgDeep, borderRadius:10, padding:"8px 12px", display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:16 }}>🔒</span>
                  <div style={{ fontSize:12, color:C.inkMid }}>
                    Rezervirano — <strong style={{ color:C.ink }}>{r.rezerviran.korisnik}</strong>
                    <span style={{ color:C.inkLight }}> · ističe {r.rezerviran.do}</span>
                  </div>
                </div>
              )}
              {r.opis && <div style={{ marginTop:8, color:C.inkMid, fontSize:12, lineHeight:1.5 }}>{r.opis}</div>}
              {!jeVlasnik && (
                <div style={{ marginTop:10, display:"flex", gap:8 }}>
                  {jeRezerviranMnom ? (
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                      <Pill label="✅ Rezervirano od tebe" color={C.green} bg={C.greenLight} />
                      <Btn label="✖ Otkaži" small color={C.rose} onClick={()=>{ setRazmjena(prev=>prev.map(item=>item.id===r.id?{...item,rezerviran:null}:item)); onNotifikacija({ tekst:`❌ Otkazali ste rezervaciju za "${r.predmet}"`, boja:C.rose }); }} />
                    </div>
                  ) : r.rezerviran ? (
                    <Pill label="Nije dostupno" color={C.inkLight} bg={C.bgDeep} />
                  ) : (
                    <Btn label="🔒 REZERVIRAJ" small color={C.teal} onClick={()=>rezerviraj(r)} />
                  )}
                  {r.tip==="Razmjena" && !r.rezerviran && (
                    <Btn label="🔄 Predloži zamjenu" small color={C.blue} onClick={()=>setZamjenaZa(r)} />
                  )}
                </div>
              )}
              {jeVlasnik && r.rezerviran && (
                <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                  <Pill label={`📩 ${r.rezerviran.korisnik} · do ${r.rezerviran.do}`} color={C.teal} bg={C.tealLight} />
                  <Btn label="✅ Označi kao uručeno (+15)" small color={C.teal} onClick={()=>uruceno(r)} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Price({ korisnik, price, setPrice, addBodovi }) {
  const [filter, setFilter] = useState("Svi");
  const [novaModal, setNovaModal] = useState(false);
  const [otvorenaId, setOtvorenaId] = useState(null);
  const [novaPrica, setNovaPrica] = useState({ naslov:"", tag:"Uspjeh", sadrzaj:"" });
  const [komentarTekst, setKomentarTekst] = useState({});
  const tagovi = ["Svi","Sport","Kreativno","Uspjeh","Humor","Ostalo"];
  const filtered = price.filter(p=>filter==="Svi"||p.tag===filter);
  const lajkao = useState(new Set())[0];

  const objavi = () => {
    const nova = { id:Date.now(), korisnik:`${korisnik.ime} ${korisnik.prezime[0]}.`, razred:korisnik.razred||"?.", avatar:korisnik.avatar||"😊", tag:novaPrica.tag, naslov:novaPrica.naslov, sadrzaj:novaPrica.sadrzaj, lajkovi:0, komentari:[], vrijeme:"upravo" };
    setPrice(prev=>[nova,...prev]);
    addBodovi(5);
    setNovaModal(false);
    setNovaPrica({ naslov:"", tag:"Uspjeh", sadrzaj:"" });
  };

  const dodajKomentar = (id) => {
    const tekst = komentarTekst[id]?.trim();
    if (!tekst) return;
    setPrice(prev=>prev.map(p=>p.id===id ? {...p, komentari:[...p.komentari, `${korisnik.ime} ${korisnik.prezime[0]}.: ${tekst}`]} : p));
    setKomentarTekst(prev=>({...prev,[id]:""}));
  };

  const toggleLajk = (id) => {
    const vec = lajkao.has(id);
    if (vec) { lajkao.delete(id); setPrice(prev=>prev.map(p=>p.id===id?{...p,lajkovi:Math.max(0,p.lajkovi-1)}:p)); }
    else      { lajkao.add(id);    setPrice(prev=>prev.map(p=>p.id===id?{...p,lajkovi:p.lajkovi+1}:p)); }
  };

  return (
    <div>
      {novaModal && (
        <div onClick={()=>setNovaModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"88vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>✏️ Nova priča</h3>
              <button onClick={()=>setNovaModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <FInp label="Naslov" value={novaPrica.naslov} onChange={e=>setNovaPrica(p=>({...p,naslov:e.target.value}))} placeholder="Što si postigao/la?" />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Tag</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {["Sport","Kreativno","Uspjeh","Humor","Ostalo"].map(t=>(
                <button key={t} onClick={()=>setNovaPrica(p=>({...p,tag:t}))} style={{ padding:"7px 14px", borderRadius:10, border:`2px solid ${novaPrica.tag===t?C.rose:C.cardBorder}`, background:novaPrica.tag===t?C.roseLight:C.bg, color:novaPrica.tag===t?C.rose:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Priča</p>
            <textarea rows={5} value={novaPrica.sadrzaj} onChange={e=>setNovaPrica(p=>({...p,sadrzaj:e.target.value}))} placeholder="Podijeli svoju priču..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:16, outline:"none" }} />
            <Btn label="✨ Objavi priču (+5 bodova)" color={C.rose} full disabled={!novaPrica.naslov||!novaPrica.sadrzaj} onClick={objavi} />
          </div>
        </div>
      )}
      <div style={{ padding:"0 16px 12px" }}>
        <Btn label="✏️ Podijeli priču" color={C.rose} onClick={()=>setNovaModal(true)} />
      </div>
      <div style={{ padding:"0 16px 8px", display:"flex", gap:6, overflowX:"auto", paddingBottom:10 }}>
        {tagovi.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{ background:filter===t?C.rose:C.bgDeep, color:filter===t?C.card:C.inkMid, border:`1.5px solid ${filter===t?C.rose:C.cardBorder}`, borderRadius:99, padding:"5px 12px", whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        {filtered.map(p=>{
          const otvoren = otvorenaId === p.id;
          const jeLajkao = lajkao.has(p.id);
          return (
            <Card key={p.id} accent={C.rose}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:32 }}>{p.avatar}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>{p.korisnik}</div>
                    <div style={{ color:C.inkMid, fontSize:11 }}>{p.razred} razred · {p.vrijeme}</div>
                  </div>
                </div>
                <Pill label={p.tag} color={C.rose} bg={C.roseLight} />
              </div>
              <div style={{ fontWeight:900, fontSize:16, color:C.ink, fontFamily:"'Nunito', sans-serif", marginBottom:6 }}>{p.naslov}</div>
              <div style={{ color:C.inkMid, fontSize:13, lineHeight:1.6, marginBottom:10 }}>
                {otvoren ? p.sadrzaj : p.sadrzaj.slice(0,150)}
                {!otvoren && p.sadrzaj.length>150 && <button onClick={()=>setOtvorenaId(p.id)} style={{ background:"none", border:"none", color:C.rose, fontWeight:700, fontSize:12, cursor:"pointer", padding:0 }}> ... čitaj više</button>}
              </div>
              <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom: otvoren ? 12 : 0 }}>
                <button onClick={()=>toggleLajk(p.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:jeLajkao?C.rose:C.inkLight, fontWeight:700, fontFamily:"'Nunito', sans-serif", transition:"color 0.15s" }}>❤️ {p.lajkovi}</button>
                <button onClick={()=>setOtvorenaId(otvoren?null:p.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.inkMid, fontWeight:700, fontFamily:"'Nunito', sans-serif" }}>💬 {p.komentari.length} {otvoren?"▲":"▼"}</button>
              </div>
              {otvoren && (
                <div style={{ borderTop:`1.5px solid ${C.cardBorder}`, paddingTop:12 }}>
                  {p.komentari.length === 0 && (
                    <div style={{ color:C.inkLight, fontSize:12, fontStyle:"italic", marginBottom:10 }}>Budi prvi koji komentira!</div>
                  )}
                  {p.komentari.map((k,i)=>(
                    <div key={i} style={{ background:C.bgDeep, borderRadius:10, padding:"8px 11px", marginBottom:7, fontSize:13, color:C.ink, lineHeight:1.5 }}>
                      {typeof k === "string" && k.includes(": ") ? (
                        <>
                          <span style={{ fontWeight:800, color:C.inkMid }}>{k.split(": ")[0]}</span>
                          <span style={{ color:C.inkLight }}>{" • "}</span>
                          <span>{k.split(": ").slice(1).join(": ")}</span>
                        </>
                      ) : k}
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <input
                      value={komentarTekst[p.id]||""}
                      onChange={e=>setKomentarTekst(prev=>({...prev,[p.id]:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&dodajKomentar(p.id)}
                      placeholder="Napiši komentar..."
                      style={{ flex:1, background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"8px 11px", fontFamily:"'Nunito', sans-serif", fontSize:13, outline:"none" }}
                    />
                    <button onClick={()=>dodajKomentar(p.id)} disabled={!komentarTekst[p.id]?.trim()} style={{ background:C.rose, color:C.card, border:"none", borderRadius:10, padding:"8px 13px", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", opacity:komentarTekst[p.id]?.trim()?1:0.4 }}>→</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Kvizovi({ korisnik, addBodovi, onNotifikacija }) {
  const [odabranPredmet, setOdabranPredmet] = useState(null);
  const [nacin, setNacin] = useState(null);
  const [kvizAktivan, setKvizAktivan] = useState(false);

  const zavrsiKviz = (bodovi, ponoviIsto) => {
    addBodovi(bodovi);
    onNotifikacija({ tekst:`🧠 Kviz završen! +${bodovi} bodova`, boja:C.plum });
    if (ponoviIsto) {
      setKvizAktivan(false);
      setTimeout(()=>setKvizAktivan(true), 50);
    } else {
      setKvizAktivan(false);
      setOdabranPredmet(null);
      setNacin(null);
    }
  };

  if (kvizAktivan && odabranPredmet && nacin) {
    return (
      <div>
        <div style={{ padding:"12px 16px 0", display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>{setKvizAktivan(false);setOdabranPredmet(null);setNacin(null);}} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>←</button>
          <div style={{ fontWeight:900, fontSize:16, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>🧠 {odabranPredmet}</div>
          <Pill label={nacin==="kviz"?"Kviz (8 pit.)":"Vježba (12 pit.)"} color={nacin==="kviz"?C.plum:C.blue} bg={nacin==="kviz"?C.plumLight:C.blueLight} />
        </div>
        <KvizIgra predmet={odabranPredmet} nacin={nacin} onZavrsi={zavrsiKviz} />
      </div>
    );
  }

  if (odabranPredmet && !kvizAktivan) {
    return (
      <div style={{ padding:20 }}>
        <button onClick={()=>setOdabranPredmet(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight, marginBottom:14 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:64, marginBottom:8 }}>🧠</div>
          <h2 style={{ color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900, margin:"0 0 6px" }}>{odabranPredmet}</h2>
          <div style={{ color:C.inkMid, fontSize:13 }}>{(KVIZ_BANKA[odabranPredmet]||[]).length} pitanja u banci</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <button onClick={()=>{setNacin("kviz");setKvizAktivan(true);}} style={{ background:C.plum, color:C.card, border:"none", borderRadius:14, padding:"18px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:15, cursor:"pointer", textAlign:"left" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>⚡ Kviz</div>
            <div style={{ fontWeight:700, opacity:0.85 }}>8 nasumičnih pitanja · 3 boda po točnom</div>
            <div style={{ fontSize:12, opacity:0.7, marginTop:2 }}>Provjeri znanje brzo!</div>
          </button>
          <button onClick={()=>{setNacin("vjezba");setKvizAktivan(true);}} style={{ background:C.blue, color:C.card, border:"none", borderRadius:14, padding:"18px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:15, cursor:"pointer", textAlign:"left" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>📚 Vježba</div>
            <div style={{ fontWeight:700, opacity:0.85 }}>12 nasumičnih pitanja · 2 boda po točnom</div>
            <div style={{ fontSize:12, opacity:0.7, marginTop:2 }}>Temeljito ponovi gradivo</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"0 16px 20px" }}>
      <div style={{ background:`linear-gradient(135deg, ${C.plum}, #5b21b6)`, borderRadius:16, padding:20, marginBottom:20, color:C.card }}>
        <div style={{ fontSize:32, marginBottom:6 }}>🧠</div>
        <h2 style={{ margin:0, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:20, marginBottom:6 }}>Kvizovi i vježbe</h2>
        <p style={{ margin:0, opacity:0.85, fontSize:13 }}>Provjeri znanje iz svih predmeta. Osvoji bodove!</p>
      </div>
      <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Odaberi predmet</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
        {PREDMETI.map(p=>{
          const banka = KVIZ_BANKA[p]||[];
          return (
            <button key={p} onClick={()=>setOdabranPredmet(p)} style={{ background:C.card, border:`2px solid ${C.cardBorder}`, borderRadius:14, padding:"14px 12px", textAlign:"left", fontFamily:"'Nunito', sans-serif", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ fontWeight:900, fontSize:14, color:C.ink, marginBottom:4 }}>{p}</div>
              <div style={{ fontSize:11, color:C.inkLight }}>{banka.length} pitanja</div>
              <div style={{ marginTop:6, display:"flex", gap:4 }}>
                <Pill label="Kviz" color={C.plum} bg={C.plumLight} style={{ fontSize:10 }} />
                <Pill label="Vježba" color={C.blue} bg={C.blueLight} style={{ fontSize:10 }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Volontiranje({ korisnik, addBodovi, onNotifikacija }) {
  const [projekti, setProjekti] = useState(VOLONT_PROJEKTI);
  const [noviModal, setNoviModal] = useState(false);
  const [evidencijaId, setEvidencijaId] = useState(null);
  const [noviProjekt, setNoviProjekt] = useState({ naslov:"", opis:"", ikona:"🤝", mjesta:5, bodovi:20, datum:"", vrijemeOd:"", vrijemeDo:"" });
  const jeUcitelj = korisnik.uloga === "ucitelj" || korisnik.uloga === "admin";
  const mojeIme = `${korisnik.ime} ${korisnik.prezime[0]}.`;
  const evidencijaModal = projekti.find(p => p.id === evidencijaId) || null;

  /* Award bodovi to the logged-in student for confirmed attendance (fires on profile switch or mount) */
  useEffect(() => {
    if (korisnik.uloga !== "ucenik") return;
    const toAward = projekti.filter(p => p.dolaznost?.[mojeIme] === true && !p.nagrade?.[mojeIme]);
    if (toAward.length === 0) return;
    toAward.forEach(p => {
      addBodovi(p.bodovi);
      onNotifikacija({ tekst:`🎖 Dolaznost potvrđena: "${p.naslov}" — +${p.bodovi} bod.!`, boja:C.orange });
    });
    setProjekti(prev => prev.map(p => {
      if (toAward.some(ta => ta.id === p.id)) return {...p, nagrade:{...(p.nagrade||{}), [mojeIme]:true}};
      return p;
    }));
  }, [korisnik.id]); // eslint-disable-line

  const prijavi = (id) => {
    const p = projekti.find(pp=>pp.id===id);
    if (!p) return;
    setProjekti(prev=>prev.map(pp=>pp.id===id?{...pp, prijavljeni:[...pp.prijavljeni,mojeIme], dolaznost:{...(pp.dolaznost||{}), [mojeIme]:false}}:pp));
    onNotifikacija({ tekst:`🤝 Prijavljeni ste na "${p.naslov}". Bodove dobivate po potvrdi dolaznosti od učitelja.`, boja:C.orange });
  };

  const dodajProjekt = () => {
    const novi = { id:Date.now(), naslov:noviProjekt.naslov, opis:noviProjekt.opis, ikona:noviProjekt.ikona, mjesta:noviProjekt.mjesta, prijavljeni:[], bodovi:noviProjekt.bodovi, organizator:`${korisnik.ime} ${korisnik.prezime}`, kreatorId:korisnik.id, datum:noviProjekt.datum, vrijemeOd:noviProjekt.vrijemeOd, vrijemeDo:noviProjekt.vrijemeDo, dolaznost:{}, nagrade:{} };
    setProjekti(prev=>[novi,...prev]);
    onNotifikacija({ tekst:`📢 Objavili ste volonterski projekt "${noviProjekt.naslov}"`, boja:C.orange });
    setNoviModal(false);
    setNoviProjekt({ naslov:"", opis:"", ikona:"🤝", mjesta:5, bodovi:20, datum:"", vrijemeOd:"", vrijemeDo:"" });
  };

  const ukloniProjekt = (id) => {
    setProjekti(prev=>prev.filter(p=>p.id!==id));
    onNotifikacija({ tekst:`🗑 Projekt uklonjen s popisa`, boja:C.inkMid });
  };

  const mozeSeoOdjaviti = (p) => {
    if (!p.datum) return true;
    const eventDate = new Date(p.datum);
    if (p.vrijemeOd) { const [h,m] = p.vrijemeOd.split(":").map(Number); eventDate.setHours(h,m,0,0); }
    return new Date() < new Date(eventDate.getTime() - 24*60*60*1000);
  };

  const odjaviSe = (id) => {
    const p = projekti.find(pp=>pp.id===id);
    if (!p) return;
    setProjekti(prev=>prev.map(pp=>pp.id===id?{
      ...pp,
      prijavljeni:pp.prijavljeni.filter(ime=>ime!==mojeIme),
      dolaznost:Object.fromEntries(Object.entries(pp.dolaznost||{}).filter(([k])=>k!==mojeIme))
    }:pp));
    onNotifikacija({ tekst:`❌ Odjavljeni ste s aktivnosti "${p.naslov}"`, boja:C.rose });
  };

  const toggloDolaznost = (projektId, ime) => {
    setProjekti(prev=>prev.map(p=>p.id===projektId?{...p, dolaznost:{...(p.dolaznost||{}), [ime]:!(p.dolaznost?.[ime])}}:p));
    setEvidencijaId(projektId);
  };

  const spremiEvidenciju = () => {
    if (!evidencijaModal) return;
    /* Award bodovi to current student if they just got marked as attended */
    if (korisnik.uloga === "ucenik" && evidencijaModal.dolaznost?.[mojeIme] && !evidencijaModal.nagrade?.[mojeIme]) {
      addBodovi(evidencijaModal.bodovi);
      setProjekti(prev=>prev.map(p=>p.id===evidencijaModal.id?{...p, nagrade:{...(p.nagrade||{}), [mojeIme]:true}}:p));
      onNotifikacija({ tekst:`🎖 Prisustvo potvrđeno: "${evidencijaModal.naslov}" — +${evidencijaModal.bodovi} bod.!`, boja:C.orange });
    }
    setEvidencijaId(null);
  };

  const formatDatum = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString("hr-HR", { weekday:"short", day:"numeric", month:"long", year:"numeric" }); }
    catch { return d; }
  };

  const mojePrijave = projekti.filter(p=>p.prijavljeni.includes(mojeIme));

  return (
    <div style={{ padding:"0 16px 20px" }}>

      {/* ---- Evidencija dolaznosti modal (teacher) ---- */}
      {evidencijaModal && (
        <div onClick={()=>setEvidencijaId(null)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:600, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"88vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📋 Evidencija dolaznosti</h3>
              <button onClick={()=>setEvidencijaId(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <div style={{ background:C.orangeLight, border:`1.5px solid ${C.orange}44`, borderRadius:12, padding:"10px 14px", marginBottom:16 }}>
              <div style={{ fontWeight:900, color:C.ink, fontSize:14, marginBottom:2 }}>{evidencijaModal.ikona} {evidencijaModal.naslov}</div>
              {evidencijaModal.datum && <div style={{ color:C.inkMid, fontSize:12 }}>📅 {formatDatum(evidencijaModal.datum)}{evidencijaModal.vrijemeOd ? ` · ${evidencijaModal.vrijemeOd}–${evidencijaModal.vrijemeDo||"?"}` : ""}</div>}
              <div style={{ color:C.inkMid, fontSize:12 }}>🏅 Nagrada: {evidencijaModal.bodovi} bodova po učeniku</div>
            </div>
            {evidencijaModal.prijavljeni.length === 0 ? (
              <div style={{ textAlign:"center", padding:24, color:C.inkLight, fontSize:13 }}>Nema prijavljenih učenika.</div>
            ) : (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 60px", gap:6, padding:"7px 12px", background:C.bgDeep, borderRadius:10, marginBottom:8, fontSize:11, color:C.inkLight, fontWeight:800, textTransform:"uppercase", letterSpacing:0.5 }}>
                  <div>Učenik</div><div style={{ textAlign:"center" }}>Prisutan</div><div style={{ textAlign:"center" }}>Bodovi</div>
                </div>
                {evidencijaModal.prijavljeni.map((ime, i) => {
                  const prisutan = evidencijaModal.dolaznost?.[ime] || false;
                  const nagraden = evidencijaModal.nagrade?.[ime] || false;
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 80px 60px", gap:6, padding:"10px 12px", background:prisutan?C.greenLight:C.bg, borderRadius:10, marginBottom:6, alignItems:"center", border:`1.5px solid ${prisutan?C.green:C.cardBorder}`, transition:"all 0.2s" }}>
                      <div style={{ fontWeight:800, color:C.ink, fontSize:13 }}>{ime}</div>
                      <button onClick={()=>toggloDolaznost(evidencijaModal.id, ime)} style={{ padding:"5px 10px", borderRadius:8, border:`2px solid ${prisutan?C.green:C.cardBorder}`, background:prisutan?C.green:"transparent", color:prisutan?"#fff":C.inkMid, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:12, cursor:"pointer", textAlign:"center" }}>
                        {prisutan ? "✓ Da" : "Ne"}
                      </button>
                      <div style={{ fontSize:11, color:nagraden?C.green:prisutan?C.orange:C.inkLight, fontWeight:800, textAlign:"center" }}>
                        {nagraden ? `✓ +${evidencijaModal.bodovi}` : prisutan ? `+${evidencijaModal.bodovi}` : "—"}
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop:16 }}>
                  <Btn label="💾 Spremi evidenciju" color={C.orange} textColor={C.card} full onClick={spremiEvidenciju} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Nova aktivnost modal (teacher) ---- */}
      {noviModal && (
        <div onClick={()=>setNoviModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>📢 Nova aktivnost</h3>
              <button onClick={()=>setNoviModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <FInp label="Naziv aktivnosti" value={noviProjekt.naslov} onChange={e=>setNoviProjekt(p=>({...p,naslov:e.target.value}))} placeholder="npr. Pomoć u knjižnici..." />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Opis zadatka</p>
            <textarea rows={3} value={noviProjekt.opis} onChange={e=>setNoviProjekt(p=>({...p,opis:e.target.value}))} placeholder="Što učenici rade, gdje se nalaze, što trebaju donijeti..." style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"9px 12px", fontFamily:"'Nunito', sans-serif", fontSize:13, resize:"none", boxSizing:"border-box", marginBottom:14, outline:"none" }} />
            {/* DATE & TIME */}
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>📅 Datum i vrijeme</p>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <div style={{ flex:2 }}>
                <input type="date" value={noviProjekt.datum} onChange={e=>setNoviProjekt(p=>({...p,datum:e.target.value}))} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${noviProjekt.datum?C.orange:C.cardBorder}`, borderRadius:10, padding:"10px 12px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, boxSizing:"border-box", outline:"none" }} />
              </div>
              <div style={{ flex:1 }}>
                <input type="time" value={noviProjekt.vrijemeOd} onChange={e=>setNoviProjekt(p=>({...p,vrijemeOd:e.target.value}))} placeholder="Od" style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${noviProjekt.vrijemeOd?C.orange:C.cardBorder}`, borderRadius:10, padding:"10px 8px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, boxSizing:"border-box", outline:"none" }} />
              </div>
              <div style={{ flex:1 }}>
                <input type="time" value={noviProjekt.vrijemeDo} onChange={e=>setNoviProjekt(p=>({...p,vrijemeDo:e.target.value}))} placeholder="Do" style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${noviProjekt.vrijemeDo?C.orange:C.cardBorder}`, borderRadius:10, padding:"10px 8px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, boxSizing:"border-box", outline:"none" }} />
              </div>
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Ikona</p>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {["🤝","📖","🌱","💻","📰","🧸","🎨","🏫"].map(ik=>(
                <button key={ik} onClick={()=>setNoviProjekt(p=>({...p,ikona:ik}))} style={{ padding:"8px 10px", borderRadius:10, border:`2px solid ${noviProjekt.ikona===ik?C.orange:C.cardBorder}`, background:noviProjekt.ikona===ik?C.orangeLight:C.bg, fontSize:20, cursor:"pointer" }}>{ik}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:14 }}>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Mjesta</p>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[2,3,5,8,10].map(n=>(
                    <button key={n} onClick={()=>setNoviProjekt(p=>({...p,mjesta:n}))} style={{ padding:"7px 12px", borderRadius:9, border:`2px solid ${noviProjekt.mjesta===n?C.teal:C.cardBorder}`, background:noviProjekt.mjesta===n?C.tealLight:C.bg, color:noviProjekt.mjesta===n?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{n}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Bodovi</p>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[10,15,20,25,30].map(b=>(
                    <button key={b} onClick={()=>setNoviProjekt(p=>({...p,bodovi:b}))} style={{ padding:"7px 12px", borderRadius:9, border:`2px solid ${noviProjekt.bodovi===b?C.amber:C.cardBorder}`, background:noviProjekt.bodovi===b?C.amberLight:C.bg, color:noviProjekt.bodovi===b?C.amber:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{b}</button>
                  ))}
                </div>
              </div>
            </div>
            <Btn label="📢 Objavi aktivnost" color={C.orange} textColor={C.card} full disabled={!noviProjekt.naslov.trim()||!noviProjekt.opis.trim()} onClick={dodajProjekt} />
          </div>
        </div>
      )}

      <div style={{ background:`linear-gradient(135deg, ${C.orange}, #c2410c)`, borderRadius:16, padding:20, marginBottom:20, color:C.card }}>
        <div style={{ fontSize:32, marginBottom:6 }}>🤝</div>
        <h2 style={{ margin:0, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:20, marginBottom:6 }}>Volontiranje</h2>
        <p style={{ margin:0, opacity:0.85, fontSize:13 }}>Pomozi školi, zaradi bodove i postani pravi školski heroj!</p>
      </div>

      {jeUcitelj && (
        <div style={{ marginBottom:20 }}>
          <Btn label="📢 Dodaj volontersku aktivnost" color={C.orange} textColor={C.card} full onClick={()=>setNoviModal(true)} />
        </div>
      )}

      {!jeUcitelj && mojePrijave.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Moje volonterske aktivnosti</div>
          {mojePrijave.map(p=>{
            const potvrden = p.dolaznost?.[mojeIme] === true;
            const nagraden = p.nagrade?.[mojeIme] === true;
            return (
              <div key={p.id} style={{ background:nagraden?C.greenLight:potvrden?C.orangeLight:C.bgDeep, border:`1.5px solid ${nagraden?C.green:potvrden?C.orange:C.cardBorder}44`, borderRadius:12, padding:"10px 14px", marginBottom:8 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:24 }}>{p.ikona}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:14, color:C.ink }}>{p.naslov}</div>
                    <div style={{ color:C.inkMid, fontSize:12 }}>{p.organizator}{p.datum ? ` · ${formatDatum(p.datum)}` : ""}</div>
                  </div>
                  {nagraden
                    ? <Pill label={`✅ +${p.bodovi} bod.`} color={C.green} bg={C.greenLight} />
                    : potvrden
                    ? <Pill label="⏳ Potvrđeno" color={C.orange} bg={C.card} />
                    : <Pill label="⏳ Čeka potvrdu" color={C.inkLight} bg={C.card} />
                  }
                </div>
                {!nagraden && !potvrden && (
                  <div style={{ marginTop:8, paddingTop:8, borderTop:`1px dashed ${C.cardBorder}` }}>
                    {mozeSeoOdjaviti(p)
                      ? <Btn label="✖ Odjavi se" small color={C.rose} onClick={()=>odjaviSe(p.id)} />
                      : <span style={{ fontSize:11, color:C.inkLight, fontWeight:700 }}>🔒 Odjava nije moguća — manje od 24h do akcije</span>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Dostupne aktivnosti</div>
      {projekti.map(p=>{
        const slobodnoMjesta = p.mjesta - p.prijavljeni.length;
        const vecPrijavljen = p.prijavljeni.includes(mojeIme);
        const jeMojProjekt = jeUcitelj && (p.kreatorId === korisnik.id || p.organizator === `${korisnik.ime} ${korisnik.prezime}`);
        return (
          <Card key={p.id} accent={vecPrijavljen?C.green:C.orange}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ fontSize:36 }}>{p.ikona}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                  <div style={{ fontWeight:900, fontSize:15, color:C.ink, fontFamily:"'Nunito', sans-serif", marginBottom:2, flex:1 }}>{p.naslov}</div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                    <Pill label={`+${p.bodovi} bod.`} color={C.orange} bg={C.orangeLight} />
                    {jeMojProjekt && (
                      <button onClick={()=>ukloniProjekt(p.id)} style={{ background:C.roseLight, border:"none", borderRadius:8, padding:"3px 8px", color:C.rose, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:11, cursor:"pointer" }}>🗑</button>
                    )}
                  </div>
                </div>
                <div style={{ color:C.inkMid, fontSize:12, marginBottom:6, lineHeight:1.5 }}>{p.opis}</div>
                {(p.datum || p.vrijemeOd) && (
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    {p.datum && <Pill label={`📅 ${formatDatum(p.datum)}`} color={C.inkMid} bg={C.bgDeep} />}
                    {p.vrijemeOd && <Pill label={`🕐 ${p.vrijemeOd}–${p.vrijemeDo||"?"}`} color={C.inkMid} bg={C.bgDeep} />}
                  </div>
                )}
                <div style={{ color:C.inkLight, fontSize:11, marginBottom:8 }}>👤 {p.organizator}</div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:C.inkLight, marginBottom:4 }}>Mjesta: {p.prijavljeni.length}/{p.mjesta}</div>
                    <div style={{ height:6, background:C.bgDeep, borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(p.prijavljeni.length/p.mjesta)*100}%`, background:slobodnoMjesta===0?C.rose:C.orange, borderRadius:99 }} />
                    </div>
                  </div>
                  {jeUcitelj ? (
                    <Btn label={`📋 Evidencija (${p.prijavljeni.length})`} small color={p.prijavljeni.length>0?C.teal:C.inkLight} onClick={()=>setEvidencijaId(p.id)} />
                  ) : vecPrijavljen ? (
                    <Pill label="✅ Prijavljen/a" color={C.green} bg={C.greenLight} />
                  ) : slobodnoMjesta > 0 ? (
                    <Btn label="Prijavi se" small color={C.orange} textColor={C.card} onClick={()=>prijavi(p.id)} />
                  ) : (
                    <Pill label="Popunjeno" color={C.rose} bg={C.roseLight} />
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Bodovi({ korisnik, izazovi, setIzazovi, ljestvica, addBodovi, onNotifikacija }) {
  const [noviIzazovModal, setNoviIzazovModal] = useState(false);
  const [noviIzazov, setNoviIzazov] = useState({ naslov:"", bodovi:10, ikona:"⭐" });
  const razina = getRazina(korisnik.bodovi);
  const sljedeca = getSljedecaRazina(korisnik.bodovi);
  const posto = sljedeca ? Math.round(((korisnik.bodovi - razina.min) / (sljedeca.min - razina.min)) * 100) : 100;

  const oznaci = (id) => {
    setIzazovi(prev=>prev.map(i=>i.id===id?{...i,gotovo:true}:i));
    const iz = izazovi.find(i=>i.id===id);
    if (iz) { addBodovi(iz.bodovi); onNotifikacija({ tekst:`⭐ Izazov završen! +${iz.bodovi} bodova`, boja:C.amber }); }
  };
  const dodajIzazov = () => {
    const novi = { id:Date.now(), naslov:noviIzazov.naslov, bodovi:noviIzazov.bodovi, ikona:noviIzazov.ikona, gotovo:false, kreirao:`${korisnik.ime} ${korisnik.prezime[0]}.` };
    setIzazovi(prev=>[...prev, novi]);
    setNoviIzazovModal(false);
    setNoviIzazov({ naslov:"", bodovi:10, ikona:"⭐" });
  };

  return (
    <div style={{ padding:"0 16px 20px" }}>
      {noviIzazovModal && (
        <div onClick={()=>setNoviIzazovModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0, color:C.ink, fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>⭐ Novi izazov</h3>
              <button onClick={()=>setNoviIzazovModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
            </div>
            <FInp label="Naziv izazova" value={noviIzazov.naslov} onChange={e=>setNoviIzazov(p=>({...p,naslov:e.target.value}))} placeholder="npr. Pomozi kolegi danas" />
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Bodovi</p>
            <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
              {[5,8,10,15,20,25].map(b=>(
                <button key={b} onClick={()=>setNoviIzazov(p=>({...p,bodovi:b}))} style={{ padding:"8px 14px", borderRadius:10, border:`2px solid ${noviIzazov.bodovi===b?C.amber:C.cardBorder}`, background:noviIzazov.bodovi===b?C.amberLight:C.bg, color:noviIzazov.bodovi===b?C.amber:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{b}</button>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Ikona</p>
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {["⭐","🤝","📚","🏆","💡","🎯","🎨","🌱"].map(ik=>(
                <button key={ik} onClick={()=>setNoviIzazov(p=>({...p,ikona:ik}))} style={{ padding:"8px 10px", borderRadius:10, border:`2px solid ${noviIzazov.ikona===ik?C.amber:C.cardBorder}`, background:noviIzazov.ikona===ik?C.amberLight:C.bg, fontSize:20, cursor:"pointer" }}>{ik}</button>
              ))}
            </div>
            <Btn label="✅ Dodaj izazov" color={C.amber} textColor={C.ink} full disabled={!noviIzazov.naslov.trim()} onClick={dodajIzazov} />
          </div>
        </div>
      )}

      {/* Moja razina */}
      <div style={{ background:`linear-gradient(135deg, ${razina.boja}, ${razina.boja}cc)`, borderRadius:16, padding:20, marginBottom:20, color:C.card }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:11, opacity:0.8, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>Moja razina</div>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:"'Nunito', sans-serif" }}>{razina.ikona} {razina.naziv}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:36, fontWeight:900, fontFamily:"'Nunito', sans-serif" }}>{korisnik.bodovi}</div>
            <div style={{ fontSize:12, opacity:0.8 }}>bodova</div>
          </div>
        </div>
        {sljedeca && (
          <>
            <div style={{ height:8, background:"rgba(255,255,255,0.3)", borderRadius:99, marginBottom:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${posto}%`, background:"rgba(255,255,255,0.9)", borderRadius:99, transition:"width 0.6s" }} />
            </div>
            <div style={{ fontSize:12, opacity:0.85 }}>{sljedeca.min - korisnik.bodovi} bodova do razine {sljedeca.ikona} {sljedeca.naziv}</div>
          </>
        )}
        {!sljedeca && <div style={{ fontSize:13, opacity:0.9 }}>🎉 Dostigao/la si maksimalnu razinu – Legenda!</div>}
      </div>

      {/* Sve razine */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Sustav razina</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
          {RAZINE.map(r=>{
            const je = korisnik.bodovi >= r.min && korisnik.bodovi <= r.max;
            return (
              <div key={r.naziv} style={{ background:je?r.boja+"22":C.bgDeep, border:`2px solid ${je?r.boja:C.cardBorder}`, borderRadius:12, padding:"10px 12px", display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ fontSize:22 }}>{r.ikona}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:13, color:je?r.boja:C.ink }}>{r.naziv}</div>
                  <div style={{ fontSize:10, color:C.inkLight }}>{r.min}–{r.max=== 9999?"∞":r.max} bod.</div>
                </div>
                {je && <Pill label="Ti" color={r.boja} bg={r.boja+"33"} style={{ marginLeft:"auto" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tjedni izazovi */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Tjedni izazovi</div>
        {korisnik.uloga === "ucitelj" && (
          <Btn label="+ Dodaj" small color={C.amber} textColor={C.ink} onClick={()=>setNoviIzazovModal(true)} />
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
        {izazovi.map(iz=>(
          <div key={iz.id} style={{ background:iz.gotovo?C.greenLight:C.card, border:`1.5px solid ${iz.gotovo?C.green:C.cardBorder}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:24 }}>{iz.ikona}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color:iz.gotovo?C.green:C.ink, fontFamily:"'Nunito', sans-serif" }}>{iz.naslov}</div>
              <div style={{ fontSize:11, color:C.inkLight, marginTop:2 }}>
                {iz.kreirao && iz.kreirao!=="sustav" ? `Kreirao: ${iz.kreirao}` : "Tjedni izazov"}
              </div>
            </div>
            {iz.gotovo ? (
              <Pill label={`+${iz.bodovi} ✓`} color={C.green} bg={C.greenLight} />
            ) : (
              <Btn label={`+${iz.bodovi} bod.`} small color={C.amber} textColor={C.ink} onClick={()=>oznaci(iz.id)} />
            )}
          </div>
        ))}
      </div>

      {/* Ljestvica */}
      <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>🏆 Ljestvica škole</div>
      {ljestvica.map(l=>{
        const jaMojIme = korisnik.ime === l.ime.split(" ")[0];
        return (
          <div key={l.r} style={{ display:"flex", gap:10, alignItems:"center", background:jaMojIme?`${C.teal}18`:C.card, border:`1.5px solid ${jaMojIme?C.teal:C.cardBorder}`, borderRadius:12, padding:"11px 12px", marginBottom:8 }}>
            <div style={{ fontWeight:900, fontSize:18, color:l.r<=3?C.amber:C.inkLight, width:26, textAlign:"center" }}>{l.bed||l.r}</div>
            <div style={{ fontSize:26 }}>{l.avatar}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:14, color:jaMojIme?C.teal:C.ink, display:"flex", alignItems:"center", gap:6 }}>
                {l.ime}
                {jaMojIme && <span style={{ fontSize:10, background:C.teal, color:C.card, borderRadius:99, padding:"1px 7px", fontWeight:900 }}>Ti</span>}
              </div>
              <div style={{ color:C.inkLight, fontSize:11, marginTop:1 }}>⏱ {l.sati}h · 🎁 {l.donacije} donacija</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:900, fontSize:17, color:jaMojIme?C.teal:C.ink, fontFamily:"'Nunito', sans-serif" }}>{l.bodovi}</div>
              <div style={{ fontSize:10, color:C.inkLight }}>bodova</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Profil({ korisnik, notifikacije, onOdjaviSe, onProcitaj }) {
  const razina = getRazina(korisnik.bodovi);
  const sljedeca = getSljedecaRazina(korisnik.bodovi);
  const posto = sljedeca ? Math.round(((korisnik.bodovi - razina.min) / (sljedeca.min - razina.min)) * 100) : 100;
  const [inboxTab, setInboxTab] = useState("sve");

  const rezervacije = notifikacije.filter(n=>n.tekst.includes("Rezervira") || n.tekst.includes("rezervira") || n.tekst.includes("🔒"));
  const aktivnosti  = notifikacije.filter(n=>!n.tekst.includes("Rezervira") && !n.tekst.includes("rezervira") && !n.tekst.includes("🔒"));
  const prikazane = inboxTab==="rezervacije" ? rezervacije : inboxTab==="aktivnosti" ? aktivnosti : notifikacije;
  const ukupnoNeprocitano = notifikacije.filter(n=>!n.procitana).length;

  return (
    <div style={{ padding:"0 16px 20px" }}>
      {/* Avatar & info */}
      <div style={{ background:`linear-gradient(135deg, ${razina.boja}33, ${razina.boja}11)`, border:`2px solid ${razina.boja}44`, borderRadius:20, padding:20, marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:8 }}>{korisnik.avatar}</div>
        <div style={{ fontWeight:900, fontSize:22, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>{korisnik.ime} {korisnik.prezime}</div>
        <div style={{ color:C.inkMid, fontSize:14, marginBottom:10 }}>
          {korisnik.uloga==="ucenik"?`${korisnik.razred} razred`:`${korisnik.uloga==="ucitelj"?"Učitelj/ica":"Administrator"}`}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:12 }}>
          <Pill label={`${razina.ikona} ${razina.naziv}`} color={razina.boja} bg={razina.boja+"22"} style={{ fontSize:13 }} />
          <Pill label={`${korisnik.bodovi} bod.`} color={C.teal} bg={C.tealLight} style={{ fontSize:13 }} />
        </div>
        {sljedeca && (
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:11, color:C.inkLight, marginBottom:4 }}>Do razine {sljedeca.ikona} {sljedeca.naziv}: {sljedeca.min - korisnik.bodovi} bod.</div>
            <div style={{ height:8, background:C.bgDeep, borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${posto}%`, background:razina.boja, borderRadius:99, transition:"width 0.6s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Inbox */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
            📬 Inbox
            {ukupnoNeprocitano > 0 && <span style={{ background:C.rose, color:C.card, borderRadius:99, padding:"1px 7px", fontSize:10, marginLeft:6 }}>{ukupnoNeprocitano} novo</span>}
          </div>
          {ukupnoNeprocitano > 0 && (
            <button onClick={()=>notifikacije.forEach(n=>!n.procitana&&onProcitaj(n.id))} style={{ background:"none", border:"none", fontSize:11, color:C.teal, fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer", padding:0 }}>Označi sve pročitanim</button>
          )}
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          {[["sve","Sve",notifikacije.filter(n=>!n.procitana).length],["rezervacije","🔒 Rezervacije",rezervacije.filter(n=>!n.procitana).length],["aktivnosti","⭐ Aktivnosti",aktivnosti.filter(n=>!n.procitana).length]].map(([id,label,count])=>(
            <button key={id} onClick={()=>setInboxTab(id)} style={{ flex:1, padding:"6px 4px", borderRadius:10, border:`2px solid ${inboxTab===id?C.teal:C.cardBorder}`, background:inboxTab===id?C.tealLight:C.bg, color:inboxTab===id?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:11, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span>{label}</span>
              {count>0 && <span style={{ background:C.rose, color:C.card, borderRadius:99, padding:"0 6px", fontSize:10, fontWeight:900 }}>{count}</span>}
            </button>
          ))}
        </div>
        {prikazane.length === 0 ? (
          <div style={{ background:C.bgDeep, borderRadius:12, padding:16, textAlign:"center", color:C.inkLight, fontSize:13 }}>Nema {inboxTab==="rezervacije"?"rezervacija":inboxTab==="aktivnosti"?"aktivnosti":"obavijesti"}.</div>
        ) : (
          prikazane.slice().reverse().map((n, i) => (
            <div key={n.id||i} onClick={()=>!n.procitana&&onProcitaj(n.id)} style={{ background:n.procitana?C.bg:n.boja+"18", border:`1.5px solid ${n.procitana?C.cardBorder:n.boja+"66"}`, borderRadius:12, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"flex-start", gap:10, cursor:n.procitana?"default":"pointer", opacity:n.procitana?0.65:1, transition:"all 0.2s" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:n.procitana?C.inkLight:n.boja, flexShrink:0, marginTop:4, transition:"all 0.2s" }} />
              <div style={{ flex:1 }}>
                <div style={{ color:C.ink, fontSize:13, fontWeight:n.procitana?600:800, lineHeight:1.5 }}>{n.tekst}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistike */}
      <div style={{ fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Statistike</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { label:"Ukupno bodova", v:korisnik.bodovi, ikona:"⭐" },
          { label:"Razina", v:razina.naziv, ikona:razina.ikona },
          { label:"Predmeti", v:korisnik.predmeti?.length||"—", ikona:"📚" },
          { label:korisnik.uloga==="ucenik"?"Razred":"Uloga", v:korisnik.razred||korisnik.uloga, ikona:"🏫" },
        ].map((s,i)=>(
          <div key={i} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:14, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:4 }}>{s.ikona}</div>
            <div style={{ fontWeight:900, fontSize:18, color:C.ink, fontFamily:"'Nunito', sans-serif" }}>{s.v}</div>
            <div style={{ fontSize:11, color:C.inkLight }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Btn label="🚪 Odjavi se" color={C.rose} full onClick={onOdjaviSe} />
    </div>
  );
}

// ---- ADMIN DASHBOARD ----
function AdminDashboard({ korisnik, setKorisnik, clanovi, setClanovi, kodovi, setKodovi, skola = { naziv: SKOLA_NAZIV, grad: SKOLA_GRAD }, onOdjava }) {
  const [tab, setTab] = useState("pregled");
  const [noviModal, setNoviModal] = useState(false);
  const [noviKor, setNoviKor] = useState({ ime:"", prezime:"", uloga:"ucenik", razred:"5.", lozinka:"", avatar:"🧑‍🎓" });
  const [odblokovanLoz, setOdblokovanLoz] = useState({}); // {[userId]: novaLozinka}
  const [genUloga, setGenUloga] = useState("ucenik");
  const [genRazred, setGenRazred] = useState("5.");
  const [genBroj, setGenBroj] = useState(5);
  const [genIdentifikator, setGenIdentifikator] = useState("");
  const [filterKodovi, setFilterKodovi] = useState("svi");
  const [kopiran, setKopiran] = useState(null);

  const ukupnoUcenika = clanovi.filter(c=>c.uloga==="ucenik").length;
  const ukupnoUcitelja = clanovi.filter(c=>c.uloga==="ucitelj").length;
  const tekucaGodina = getSchoolYear();
  const slobodniKodovi = kodovi.filter(k=>!k.koristen || k.koristenGodina !== tekucaGodina).length;
  const koristeniKodovi = kodovi.filter(k=>k.koristen && k.koristenGodina === tekucaGodina).length;

  const dodajKorisnika = () => {
    const prefix = noviKor.uloga==="ucenik"?"UCE":noviKor.uloga==="ucitelj"?"UCT":"ADM";
    const novi = { id:Date.now(), ...noviKor, lozinka:"", kod:`${prefix}-MAN-${Date.now().toString().slice(-4)}`, aktivan:true, bodovi:0, predmeti:[], pokusaji:0, zakljucan:false };
    setClanovi(prev=>[...prev,novi]);
    setNoviModal(false);
    setNoviKor({ ime:"", prezime:"", uloga:"ucenik", razred:"5.", avatar:"🧑‍🎓" });
  };

  const odblokujKorisnika = (id) => {
    const novaLoz = genLozinku();
    setClanovi(prev => prev.map(c => c.id===id ? {...c, zakljucan:false, pokusaji:0, lozinka:novaLoz, aktivan:true} : c));
    setOdblokovanLoz(prev => ({...prev, [id]: novaLoz}));
  };

  const generirajKodove = () => {
    const noviKodovi = [];
    const timestamp = Date.now();
    for (let i = 0; i < genBroj; i++) {
      const n = timestamp + i;
      const loz = LOZINKE_DEMO[n % LOZINKE_DEMO.length] + Math.floor(Math.random()*90+10);
      const suf = String(Math.floor(Math.random()*99)+1).padStart(2,"0");
      const kod = genUloga === "ucenik"
        ? `UCE-${genRazred.replace(".","")}-${suf}`
        : `UCT-${["MAT","HRV","ENG","FIZ","KEM","BIO","INF","GEO"][i%8]}${suf}`;
      noviKodovi.push({ id:n, kod, uloga:genUloga, razred:genUloga==="ucenik"?genRazred:null, lozinka:loz, koristen:false, datum:new Date().toLocaleDateString("hr-HR"), identifikator:genIdentifikator.trim()||null, skola:SKOLA_NAZIV });
    }
    setKodovi(prev=>[...noviKodovi,...prev]);
    setGenIdentifikator("");
  };

  const kopirajKod = (unos) => {
    const tekst = `Kod: ${unos.kod}  Lozinka: ${unos.lozinka}`;
    navigator.clipboard?.writeText(tekst).catch(()=>{});
    setKopiran(unos.id);
    setTimeout(()=>setKopiran(null), 2000);
  };

  const obrisiKod = (id) => setKodovi(prev=>prev.filter(k=>k.id!==id));

  const prikazaniKodovi = kodovi.filter(k=>{
    if (filterKodovi === "slobodni") return !k.koristen || k.koristenGodina !== tekucaGodina;
    if (filterKodovi === "koristeni") return k.koristen && k.koristenGodina === tekucaGodina;
    if (filterKodovi === "ucenik") return k.uloga==="ucenik";
    if (filterKodovi === "ucitelj") return k.uloga==="ucitelj";
    return true;
  });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.plum},#5b21b6)`, padding:"22px 16px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ margin:0, color:C.card, fontWeight:900, fontSize:20, fontFamily:"'Nunito', sans-serif" }}>⚙️ Admin Panel</h2>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:2 }}>🏫 {skola.naziv}{skola.grad ? `, ${skola.grad}` : ""}</div>
          </div>
          <Btn label="Odjava" small color={C.card} textColor={C.plum} onClick={onOdjava} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1.5px solid ${C.cardBorder}`, background:C.card, overflowX:"auto" }}>
        {[["pregled","📊 Pregled"],["korisnici","👥 Korisnici"],["kodovi","🔑 Kodovi"],["generator","⚡ Generator"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{ flex:"0 0 auto", padding:"12px 14px", background:"none", border:"none", borderBottom:`3px solid ${tab===k?C.plum:"transparent"}`, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:12, color:tab===k?C.plum:C.inkMid, cursor:"pointer", whiteSpace:"nowrap" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:16, paddingBottom:40 }}>

        {/* ── PREGLED ── */}
        {tab==="pregled" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                {label:"Učenika",    v:ukupnoUcenika,   c:C.teal,  bg:C.tealLight,  ic:"🧑‍🎓"},
                {label:"Učitelja",   v:ukupnoUcitelja,  c:C.blue,  bg:C.blueLight,  ic:"👩‍🏫"},
                {label:"Slobodnih",  v:slobodniKodovi,  c:C.green, bg:C.greenLight, ic:"🔑"},
                {label:"Iskorišt.",  v:koristeniKodovi, c:C.amber, bg:C.amberLight, ic:"✅"},
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg, border:`1.5px solid ${s.c}33`, borderRadius:14, padding:16, textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:4 }}>{s.ic}</div>
                  <div style={{ fontWeight:900, fontSize:26, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:12, color:C.inkMid }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:14, padding:14 }}>
              <div style={{ fontWeight:900, color:C.ink, marginBottom:8 }}>📊 Statistika škole</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[["Ukupno korisnika", clanovi.length,"👥"],["Aktivnih korisnika", clanovi.filter(c=>c.aktivan).length,"✅"],["Ukupno kodova u bazi", kodovi.length,"🗄️"],["Slobodnih kodova", slobodniKodovi,"🔓"]].map(([l,v,ic])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.bgDeep}` }}>
                    <span style={{ color:C.inkMid, fontSize:13 }}>{ic} {l}</span>
                    <span style={{ fontWeight:900, color:C.ink, fontSize:14 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── KORISNICI ── */}
        {tab==="korisnici" && (
          <>
            <Btn label="+ Dodaj korisnika ručno" color={C.plum} full onClick={()=>setNoviModal(true)} />
            {noviModal && (
              <div onClick={()=>setNoviModal(false)} style={{ position:"fixed", inset:0, background:"#1a161288", zIndex:600, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div onClick={e=>e.stopPropagation()} style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:430, maxHeight:"88vh", overflowY:"auto" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                    <h3 style={{ margin:0, color:C.ink, fontWeight:900, fontFamily:"'Nunito', sans-serif" }}>👤 Novi korisnik</h3>
                    <button onClick={()=>setNoviModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.inkLight }}>✕</button>
                  </div>
                  <FInp label="Ime" value={noviKor.ime} onChange={e=>setNoviKor(p=>({...p,ime:e.target.value}))} />
                  <FInp label="Prezime" value={noviKor.prezime} onChange={e=>setNoviKor(p=>({...p,prezime:e.target.value}))} />
                  <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Uloga</p>
                  <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                    {["ucenik","ucitelj"].map(u=>(
                      <button key={u} onClick={()=>setNoviKor(p=>({...p,uloga:u}))} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`2px solid ${noviKor.uloga===u?C.plum:C.cardBorder}`, background:noviKor.uloga===u?C.plumLight:C.bg, color:noviKor.uloga===u?C.plum:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{u==="ucenik"?"🧑‍🎓 Učenik":"👩‍🏫 Učitelj"}</button>
                    ))}
                  </div>
                  <div style={{ background:C.tealLight, border:`1.5px solid ${C.teal}33`, borderRadius:10, padding:"9px 12px", marginBottom:14, fontSize:12, color:C.teal, fontWeight:700 }}>
                    💡 Korisnik će se prijaviti s pristupnim kodom koji mu dodijeli sustav — bez lozinke.
                  </div>
                  <Btn label="✅ Dodaj korisnika" color={C.plum} full disabled={!noviKor.ime||!noviKor.prezime} onClick={dodajKorisnika} />
                </div>
              </div>
            )}
            <div style={{ marginTop:12 }}>
              {clanovi.map(c=>{
                const ub = ulogaBoja(c.uloga);
                return (
                  <div key={c.id} style={{ background:c.zakljucan?C.roseLight:C.card, border:`1.5px solid ${c.zakljucan?C.rose+"66":C.cardBorder}`, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ fontSize:28 }}>{c.avatar}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:800, color:C.ink, fontSize:14 }}>{c.ime} {c.prezime}</div>
                        <div style={{ fontSize:11, color:C.inkLight, fontFamily:"monospace" }}>Kod: {c.kod}</div>
                        {c.razred && <div style={{ fontSize:11, color:C.inkMid }}>{c.razred} razred</div>}
                        {c.zakljucan && <div style={{ fontSize:11, color:C.rose, fontWeight:800 }}>🔒 Zaključan — previše neuspjelih pokušaja</div>}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
                        <Pill label={ub.label} color={ub.color} bg={ub.bg} />
                        {!c.zakljucan && <button onClick={()=>setClanovi(prev=>prev.map(cc=>cc.id===c.id?{...cc,aktivan:!cc.aktivan}:cc))} style={{ fontSize:10, background:c.aktivan?C.greenLight:C.roseLight, border:"none", borderRadius:6, padding:"2px 8px", color:c.aktivan?C.green:C.rose, fontFamily:"'Nunito', sans-serif", fontWeight:700, cursor:"pointer" }}>{c.aktivan?"✅ Aktivan":"❌ Neaktivan"}</button>}
                        {c.zakljucan && <button onClick={()=>odblokujKorisnika(c.id)} style={{ fontSize:10, background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:6, padding:"3px 9px", color:C.amber, fontFamily:"'Nunito', sans-serif", fontWeight:800, cursor:"pointer" }}>🔓 Odblokuj</button>}
                        {c.uloga !== "admin" && !c.zakljucan && (
                          <button onClick={()=>{ if(window.confirm(`Ukloniti ${c.ime} ${c.prezime}?`)) setClanovi(prev=>prev.filter(cc=>cc.id!==c.id)); }} style={{ fontSize:10, background:C.roseLight, border:"none", borderRadius:6, padding:"2px 8px", color:C.rose, fontFamily:"'Nunito', sans-serif", fontWeight:700, cursor:"pointer" }}>🗑 Ukloni</button>
                        )}
                      </div>
                    </div>
                    {/* Actions row */}
                    <div style={{ marginTop:8, paddingTop:8, borderTop:`1px dashed ${c.zakljucan?C.rose+"44":C.cardBorder}`, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                        {c.opomene > 0 && <span style={{ fontSize:10, color:C.amber, fontWeight:700 }}>⚠ {c.opomene} opomena</span>}
                        {c.banan && <span style={{ fontSize:10, background:C.rose, color:C.card, borderRadius:6, padding:"2px 7px", fontWeight:800 }}>🚫 BANAN</span>}
                      </div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {/* Role change */}
                        <select value={c.uloga} onChange={e=>{ const novaUloga = e.target.value; if(c.id === korisnik?.id && novaUloga !== "admin") { if(!window.confirm("Mijenjate vlastitu ulogu s admin. Izgubit ćete pristup Admin panelu. Nastaviti?")) return; } setClanovi(prev=>prev.map(cc=>cc.id===c.id?{...cc,uloga:novaUloga,avatar:novaUloga==="admin"?cc.avatar:novaUloga==="ucitelj"?"👩‍🏫":"🧑‍🎓"}:cc)); if(c.id === korisnik?.id && setKorisnik) setKorisnik(prev=>({...prev,uloga:novaUloga})); }} style={{ fontSize:10, background:C.bgDeep, border:`1.5px solid ${C.cardBorder}`, borderRadius:6, padding:"3px 6px", color:C.inkMid, fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>
                          <option value="ucenik">🧑‍🎓 Učenik</option>
                          <option value="ucitelj">👩‍🏫 Učitelj</option>
                          <option value="admin">⚙️ Admin</option>
                        </select>
                        {/* Warn / ban — only for non-self */}
                        {c.id !== korisnik?.id && (
                          <>
                            <button onClick={()=>setClanovi(prev=>prev.map(cc=>cc.id===c.id?{...cc,opomene:(cc.opomene||0)+1}:cc))} style={{ fontSize:10, background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:6, padding:"3px 8px", color:C.amber, fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>⚠ Opomena</button>
                            {!c.banan
                              ? <button onClick={()=>{ if(window.confirm(`Banirati ${c.ime} ${c.prezime}? Korisnik više neće moći pristupiti aplikaciji.`)) setClanovi(prev=>prev.map(cc=>cc.id===c.id?{...cc,banan:true,aktivan:false}:cc)); }} style={{ fontSize:10, background:C.roseLight, border:`1.5px solid ${C.rose}44`, borderRadius:6, padding:"3px 8px", color:C.rose, fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>🚫 Baniraj</button>
                              : <button onClick={()=>setClanovi(prev=>prev.map(cc=>cc.id===c.id?{...cc,banan:false,aktivan:true}:cc))} style={{ fontSize:10, background:C.greenLight, border:`1.5px solid ${C.green}44`, borderRadius:6, padding:"3px 8px", color:C.green, fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>✅ Odbaniraj</button>
                            }
                          </>
                        )}
                      </div>
                    </div>
                    {odblokovanLoz[c.id] && (
                      <div style={{ marginTop:8, background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:8, padding:"7px 10px", fontSize:12 }}>
                        🔑 Nova lozinka: <strong style={{ fontFamily:"monospace", color:C.plum }}>{odblokovanLoz[c.id]}</strong> — priopći korisniku!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── BAZA KODOVA ── */}
        {tab==="kodovi" && (
          <>
            <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, paddingBottom:2 }}>
              {[["svi","Svi"],["slobodni","Slobodni"],["koristeni","Iskorišteni"],["ucenik","Učenici"],["ucitelj","Učitelji"]].map(([k,l])=>(
                <button key={k} onClick={()=>setFilterKodovi(k)} style={{ flexShrink:0, padding:"5px 12px", borderRadius:99, background:filterKodovi===k?C.plum:C.bgDeep, color:filterKodovi===k?C.card:C.inkMid, border:`1.5px solid ${filterKodovi===k?C.plum:C.cardBorder}`, fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{l}</button>
              ))}
            </div>
            <div style={{ color:C.inkLight, fontSize:12, marginBottom:10 }}>{prikazaniKodovi.length} kod(ova)</div>
            {prikazaniKodovi.map(k=>(
              <div key={k.id} style={{ background:C.card, border:`1.5px solid ${k.koristen?C.cardBorder:C.green}33`, borderRadius:12, padding:"10px 12px", marginBottom:6, display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontFamily:"monospace", fontWeight:900, fontSize:13, color:k.koristen?C.inkMid:C.ink }}>{k.kod}</span>
                    <span style={{ background: k.koristen && k.koristenGodina===tekucaGodina ? C.bgDeep : k.koristen ? C.amberLight : C.greenLight, color: k.koristen && k.koristenGodina===tekucaGodina ? C.inkLight : k.koristen ? C.amber : C.green, fontSize:10, fontWeight:700, borderRadius:6, padding:"1px 7px" }}>{k.koristen && k.koristenGodina===tekucaGodina ? `Korišten ${tekucaGodina}` : k.koristen ? `Prošla god.` : "Slobodan"}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.inkLight }}>
                    {k.uloga==="ucenik"?"🧑‍🎓":"👩‍🏫"} {k.uloga==="ucenik"?`${k.razred} razred`:"Učitelj"} · Lozinka: <span style={{ fontFamily:"monospace", color:C.inkMid }}>{k.lozinka}</span>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:2 }}>
                    {k.identifikator && (
                      <span style={{ fontSize:11, color:C.plum, fontWeight:700 }}>🏷 {k.identifikator}</span>
                    )}
                    {k.skola && (
                      <span style={{ fontSize:10, color:C.inkLight, fontWeight:700 }}>🏫 {k.skola}</span>
                    )}
                  </div>
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={()=>kopirajKod(k)} style={{ background:kopiran===k.id?C.greenLight:C.bgDeep, border:"none", borderRadius:8, padding:"5px 9px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:11, cursor:"pointer", color:kopiran===k.id?C.green:C.inkMid }}>{kopiran===k.id?"✅":"📋"}</button>
                  {(!k.koristen || k.koristenGodina !== tekucaGodina) && <button onClick={()=>obrisiKod(k.id)} style={{ background:C.roseLight, border:"none", borderRadius:8, padding:"5px 9px", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:11, cursor:"pointer", color:C.rose }}>🗑</button>}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── GENERATOR KODOVA ── */}
        {tab==="generator" && (
          <>
            <div style={{ background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:12, padding:14, marginBottom:20 }}>
              <div style={{ fontWeight:900, color:C.amber, marginBottom:4 }}>⚡ Generator pristupnih kodova</div>
              <div style={{ fontSize:13, color:C.inkMid }}>Generiraj kodove za učenike ili učitelje. Svaki korisnik dobiva kod i lozinku za prvu prijavu. Vezani su isključivo uz ovu školu.</div>
            </div>

            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Uloga</p>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {["ucenik","ucitelj"].map(u=>(
                <button key={u} onClick={()=>setGenUloga(u)} style={{ flex:1, padding:"12px 0", borderRadius:12, border:`2px solid ${genUloga===u?C.plum:C.cardBorder}`, background:genUloga===u?C.plumLight:C.bg, color:genUloga===u?C.plum:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer" }}>{u==="ucenik"?"🧑‍🎓 Učenici":"👩‍🏫 Učitelji"}</button>
              ))}
            </div>

            {genUloga === "ucenik" && (
              <>
                <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Razred</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {RAZREDI.map(r=>(
                    <button key={r} onClick={()=>setGenRazred(r)} style={{ padding:"7px 14px", borderRadius:10, border:`2px solid ${genRazred===r?C.teal:C.cardBorder}`, background:genRazred===r?C.tealLight:C.bg, color:genRazred===r?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{r}</button>
                  ))}
                </div>
              </>
            )}

            <FInp label="Identifikator (nije obavezan)" value={genIdentifikator} onChange={e=>setGenIdentifikator(e.target.value)} placeholder="npr. Ana K., 5.b razred..." />

            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Broj kodova</p>
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {[5,10,20,30].map(n=>(
                <button key={n} onClick={()=>setGenBroj(n)} style={{ flex:1, padding:"10px 0", borderRadius:10, border:`2px solid ${genBroj===n?C.blue:C.cardBorder}`, background:genBroj===n?C.blueLight:C.bg, color:genBroj===n?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:15, cursor:"pointer" }}>{n}</button>
              ))}
            </div>

            <div style={{ background:C.bgDeep, borderRadius:12, padding:14, marginBottom:16 }}>
              <div style={{ fontSize:13, color:C.inkMid }}>
                Generirat će se <strong style={{ color:C.ink }}>{genBroj} novih kodova</strong> za <strong style={{ color:C.ink }}>{genUloga==="ucenik"?`učenike ${genRazred} razreda`:"učitelje"}</strong>.
                {genIdentifikator.trim() && <> Identifikator: <strong style={{ color:C.plum }}>{genIdentifikator.trim()}</strong>.</>}
              </div>
            </div>

            <Btn label={`⚡ Generiraj ${genBroj} kodova`} color={C.plum} full onClick={generirajKodove} />
            <div style={{ marginTop:10, textAlign:"center" }}>
              <button onClick={()=>setTab("kodovi")} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>→ Pogledaj sve kodove</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---- AUTH ----
function EkranRegistracijaSkole({ setClanovi, setKodovi, setSkola, onUspjeh, onNatrag }) {
  const [korak, setKorak] = useState(1);
  const [naziv, setNaziv] = useState("");
  const [grad, setGrad] = useState("");
  const [mzoKod, setMzoKod] = useState("");
  const [oib, setOib] = useState("");
  const [provjeravam, setProvjeravam] = useState(false);
  const [verificirano, setVerificirano] = useState(false);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [uloga, setUloga] = useState("ucitelj");
  const [loz, setLoz] = useState("");
  const [loz2, setLoz2] = useState("");
  const [greska, setGreska] = useState("");
  const [gotovo, setGotovo] = useState(false);
  const [adminKod, setAdminKod] = useState("");

  const provjeriSkolu = () => {
    setGreska("");
    if (!naziv.trim()) { setGreska("Upiši naziv i grad ustanove (npr. OŠ Centar, Rijeka)."); return; }
    if (!naziv.includes(",")) { setGreska("Upiši naziv i grad odvojene zarezom (npr. OŠ Centar, Rijeka)."); return; }
    if (!/^\d{5,10}$/.test(mzoKod.trim())) { setGreska("Šifra MZOM mora biti broj od 5 do 10 znamenki."); return; }
    if (!/^\d{11}$/.test(oib.trim())) { setGreska("OIB škole mora imati točno 11 znamenki."); return; }
    setProvjeravam(true);
    setTimeout(() => { setProvjeravam(false); setVerificirano(true); setKorak(2); }, 2000);
  };

  const registriraj = () => {
    setGreska("");
    if (!ime.trim() || !prezime.trim()) { setGreska("Upiši ime i prezime."); return; }
    if (loz.length < 8) { setGreska("Lozinka mora imati barem 8 znakova."); return; }
    if (loz !== loz2) { setGreska("Lozinke se ne podudaraju."); return; }
    const kod = `ADM-${mzoKod.trim().slice(0,6)}`;
    const token = genSessionToken(); const schoolYear = getSchoolYear();
    const noviAdmin = { id: Date.now(), ime: ime.trim(), prezime: prezime.trim(), uloga: "admin", razred: null, predmeti: [], aktivan: true, kod, lozinka: loz, avatar: uloga === "ucitelj" ? "👩‍🏫" : "👤", bodovi: 0, pokusaji: 0, zakljucan: false, banan: false, opomene: 0, sessionToken: token, sessionYear: schoolYear };
    const dijelovi = naziv.trim().split(",");
    const parsiraniGrad = dijelovi.length > 1 ? dijelovi[dijelovi.length - 1].trim() : "";
    const parsiraniNaziv = dijelovi.slice(0, -1).join(",").trim();
    const novaSkola = { naziv: parsiraniNaziv || naziv.trim(), grad: parsiraniGrad, mzoKod: mzoKod.trim(), oib: oib.trim() };
    setClanovi([noviAdmin]);
    setKodovi([]);
    setSkola(novaSkola);
    setAdminKod(kod);
    try { localStorage.setItem('peerup_session', JSON.stringify({ userId: noviAdmin.id, token, schoolYear })); } catch {}
    setGotovo(true);
    setTimeout(() => onUspjeh(noviAdmin), 3000);
  };

  if (gotovo) return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, #1a8a72, #0e6b58)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
      <div>
        <div style={{ fontSize:80, marginBottom:16 }}>🏫</div>
        <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#fff", margin:"0 0 10px", fontSize:30, letterSpacing:-0.5 }}>Dobrodošli, {naziv}!</h2>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, margin:"0 0 20px", maxWidth:320 }}>PeerUp je aktiviran za vašu školu. Automatski ste postavljeni kao administrator.</p>
        <div style={{ background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:16, padding:"16px 24px", display:"inline-block", marginBottom:16 }}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:700, marginBottom:4 }}>VAŠ ADMIN KOD</div>
          <div style={{ fontFamily:"monospace", fontSize:22, fontWeight:900, color:"#fff", letterSpacing:2 }}>{adminKod}</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginTop:4 }}>Sačuvajte ovaj kod — trebat će vam za prijavu</div>
        </div>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>Ulaz u aplikaciju...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <button onClick={korak===1?onNatrag:()=>setKorak(1)} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", padding:0, marginBottom:20 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:44 }}>🏫</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:24, color:C.ink }}>Registracija škole</h2>
          <p style={{ margin:0, color:C.inkLight, fontSize:12 }}>Samo za djelatnike škole · {korak}/2</p>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[1,2].map(k=><div key={k} style={{ flex:1, height:4, borderRadius:99, background:k<=korak?C.teal:C.cardBorder, transition:"background 0.3s" }} />)}
        </div>

        {korak===1 && (
          <Card>
            <div style={{ background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:10, padding:"10px 12px", marginBottom:16 }}>
              <p style={{ margin:0, fontSize:12, color:C.amber, fontWeight:700 }}>📋 Podaci moraju biti usklađeni s MZOM registrom ustanova. Registraciju može izvršiti samo djelatnik škole.</p>
            </div>
            <FInp label="Naziv i grad ustanove" value={naziv} onChange={e=>setNaziv(e.target.value)} placeholder="npr. OŠ Centar, Rijeka" icon="🏫" />
            <FInp label="Šifra škole (MZOM)" value={mzoKod} onChange={e=>setMzoKod(e.target.value.replace(/\D/g,""))} placeholder="npr. 00-000-000" icon="🔢" />
            <FInp label="OIB škole" value={oib} onChange={e=>setOib(e.target.value.replace(/\D/g,""))} placeholder="11 znamenki" icon="🪪" />
            {greska && <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
            {provjeravam ? (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:28 }}>🔍</div>
                <p style={{ color:C.teal, fontWeight:800, fontSize:14, margin:"8px 0 4px" }}>Provjera u MZOM registru...</p>
                <p style={{ color:C.inkLight, fontSize:12, margin:0 }}>Molimo pričekajte</p>
              </div>
            ) : (
              <Btn label="Provjeri i nastavi →" color={C.teal} full disabled={!naziv||!grad||!mzoKod||!oib} onClick={provjeriSkolu} />
            )}
          </Card>
        )}

        {korak===2 && (
          <Card>
            <div style={{ background:C.tealLight, border:`1.5px solid ${C.teal}44`, borderRadius:10, padding:"10px 12px", marginBottom:16 }}>
              <p style={{ margin:0, fontSize:12, color:C.teal, fontWeight:800 }}>✅ Škola verificirana: <strong>{naziv}</strong>, {grad}</p>
              <p style={{ margin:"4px 0 0", fontSize:11, color:C.teal, fontWeight:600 }}>MZO: {mzoKod} · OIB: {oib}</p>
            </div>
            <p style={{ margin:"0 0 12px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Podaci administratora</p>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1 }}><FInp label="Ime" value={ime} onChange={e=>setIme(e.target.value)} placeholder="Ime" /></div>
              <div style={{ flex:1 }}><FInp label="Prezime" value={prezime} onChange={e=>setPrezime(e.target.value)} placeholder="Prezime" /></div>
            </div>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Uloga</p>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["ucitelj","👩‍🏫 Učitelj/ica"],["ravnatelj","🏛️ Ravnatelj/ica"]].map(([v,l])=>(
                <button key={v} onClick={()=>setUloga(v)} style={{ flex:1, padding:"9px 8px", borderRadius:12, border:`2px solid ${uloga===v?C.teal:C.cardBorder}`, background:uloga===v?C.tealLight:C.bg, color:uloga===v?C.teal:C.inkMid, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{l}</button>
              ))}
            </div>
            <FInp label="Lozinka" type="password" value={loz} onChange={e=>setLoz(e.target.value)} placeholder="Min. 8 znakova" icon="🔒" />
            <FInp label="Ponovi lozinku" type="password" value={loz2} onChange={e=>setLoz2(e.target.value)} placeholder="Ista lozinka" icon="🔒" error={loz2&&loz!==loz2?"Lozinke se ne podudaraju":""} />
            {greska && <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
            <Btn label="Aktiviraj PeerUp za moju školu →" color={C.teal} full disabled={!ime||!prezime||loz.length<8||loz!==loz2} onClick={registriraj} />
          </Card>
        )}
      </div>
    </div>
  );
}

function PrijavaSustav({ clanovi, setClanovi, kodovi, setKodovi, onPrijava, skola, setSkola }) {
  const [ekran, setEkran] = useState("dobrodoslica"); // dobrodoslica | prijava | registracija | demo | registracijaskole

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Nunito', sans-serif" }}>
      {ekran==="dobrodoslica"     && <EkranDobrodoslica onLogin={()=>setEkran("prijava")} onRegister={()=>setEkran("registracija")} onDemo={()=>setEkran("demo")} onRegistracijaSkole={()=>setEkran("registracijaskole")} />}
      {ekran==="prijava"          && <EkranPrijava clanovi={clanovi} setClanovi={setClanovi} onUspjeh={onPrijava} onNatrag={()=>setEkran("dobrodoslica")} />}
      {ekran==="registracija"     && <EkranRegistracija clanovi={clanovi} setClanovi={setClanovi} kodovi={kodovi} setKodovi={setKodovi} onUspjeh={onPrijava} onNatrag={()=>setEkran("dobrodoslica")} />}
      {ekran==="demo"             && <EkranDemo clanovi={clanovi} onUspjeh={onPrijava} onNatrag={()=>setEkran("dobrodoslica")} />}
      {ekran==="registracijaskole"&& <EkranRegistracijaSkole setClanovi={setClanovi} setKodovi={setKodovi} setSkola={setSkola} onUspjeh={onPrijava} onNatrag={()=>setEkran("dobrodoslica")} />}
    </div>
  );
}

function EkranDobrodoslica({ onLogin, onRegister, onDemo, onRegistracijaSkole }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400, textAlign:"center" }}>
        <div style={{ fontSize:72, lineHeight:1, marginBottom:12 }}>🤝</div>
        <h1 style={{ margin:0, fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:40, color:C.ink, letterSpacing:-1 }}>
          Peer<span style={{ color:C.teal }}>Up</span>
        </h1>
        <p style={{ margin:"6px 0 28px", color:C.inkLight, fontSize:14, fontWeight:600 }}>Školska platforma za međuvršnjačku pomoć</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:36 }}>
          {["📖 Učimo zajedno","🗺️ Bilješke i mape","🔄 Školski buvljak","🏆 Bodovi i nagrade"].map(f=>(
            <span key={f} style={{ background:C.card, border:`1.5px solid ${C.cardBorder}`, borderRadius:999, padding:"5px 12px", fontSize:12, fontWeight:700, color:C.inkMid }}>{f}</span>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Btn label="🔑 Prijava" color={C.teal} full onClick={onLogin} />
          <Btn label="✏️ Registracija korisnika" color={C.ink} full onClick={onRegister} />
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"2px 0" }}>
            <div style={{ flex:1, height:1, background:C.cardBorder }} />
            <span style={{ color:C.inkLight, fontSize:12, fontWeight:700 }}>ili</span>
            <div style={{ flex:1, height:1, background:C.cardBorder }} />
          </div>
          <button onClick={onRegistracijaSkole} style={{ width:"100%", background:`linear-gradient(135deg,${C.plum},#5b21b6)`, color:"#fff", border:"none", borderRadius:999, padding:"13px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:14, cursor:"pointer", boxShadow:`0 4px 16px ${C.plum}44`, letterSpacing:0.2 }}>
            🏫 Registracija škole (za djelatnike)
          </button>
          <button onClick={onDemo} style={{ width:"100%", background:`linear-gradient(135deg,${C.amber},#f59e0b)`, color:C.card, border:"none", borderRadius:999, padding:"13px 20px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:14, cursor:"pointer", boxShadow:`0 4px 16px ${C.amber}44`, letterSpacing:0.2 }}>
            🎭 Demo prikaz (bez prijave)
          </button>
        </div>
        <p style={{ marginTop:20, fontSize:11, color:C.inkLight, lineHeight:1.6 }}>Za prijavu trebaš kod koji ti daje učitelj/ica ili administrator škole.</p>
      </div>
    </div>
  );
}

function EkranPrijava({ clanovi, onUspjeh, onNatrag }) {
  const [kod, setKod] = useState("");
  const [greska, setGreska] = useState("");
  const [ucitavam, setUcitavam] = useState(false);

  const prijava = () => {
    setGreska(""); setUcitavam(true);
    setTimeout(() => {
      const kodNorm = kod.trim().toUpperCase();
      const clan = clanovi.find(c => c.kod === kodNorm);

      if (!clan) { setGreska("Neispravan pristupni kod. Provjeri kod koji si dobio/la od administratora."); setUcitavam(false); return; }
      if (clan.banan) { setGreska("🚫 Pristup je onemogućen. Obrati se administratoru škole."); setUcitavam(false); return; }
      if (!clan.aktivan) { setGreska("Račun je deaktiviran. Obrati se administratoru."); setUcitavam(false); return; }

      /* Uspješna prijava — spremi sesiju */
      const token = genSessionToken();
      const schoolYear = getSchoolYear();
      try { localStorage.setItem('peerup_session', JSON.stringify({ userId: clan.id, token, schoolYear })); } catch {}
      onUspjeh({ ...clan, sessionToken: token, sessionYear: schoolYear });
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <button onClick={onNatrag} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", padding:0, marginBottom:24 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48 }}>🔑</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:26, color:C.ink }}>Prijava</h2>
          <p style={{ margin:0, color:C.inkLight, fontSize:13 }}>Upiši pristupni kod koji si dobio/la od administratora</p>
        </div>
        <Card>
          <FInp label="Tvoj pristupni kod" value={kod} onChange={e=>setKod(e.target.value)} placeholder="npr. UCE-7-01" icon="🪪" onKeyDown={e=>e.key==="Enter"&&prijava()} />
          {greska && <div style={{ background:C.redLight, border:`1.5px solid ${C.red}44`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}><p style={{ margin:0, color:C.red, fontSize:13, fontWeight:700 }}>⚠ {greska}</p></div>}
          <Btn label={ucitavam ? "Prijavljujem..." : "Prijavi se →"} color={C.teal} full disabled={!kod||ucitavam} onClick={prijava} />
        </Card>
      </div>
    </div>
  );
}

function EkranRegistracija({ clanovi, setClanovi, kodovi, setKodovi, onUspjeh, onNatrag }) {
  const [korak, setKorak]       = useState(1);
  const [kod, setKod]           = useState("");
  const [uloga, setUloga]       = useState(null);
  const [ime, setIme]           = useState("");
  const [prezime, setPrezime]   = useState("");
  const [razred, setRazred]     = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [greska, setGreska]     = useState("");
  const [gotovo, setGotovo]     = useState(false);

  const [skolaKoda, setSkolaKoda] = useState(null);

  const provjeriKod = () => {
    setGreska("");
    const kodT = kod.trim().toUpperCase();
    const postojeciRacun = clanovi.find(c => c.kod === kodT && c.aktivan && !c.banan);
    if (postojeciRacun) { setGreska("Korisnički račun s ovim kodom već postoji. Prijavi se direktno s kodom i lozinkom."); return; }
    const unos = kodovi.find(k => k.kod === kodT);
    if (!unos) { setGreska("Kod nije valjan. Provjeri s administratorom škole."); return; }
    setUloga(unos.uloga);
    if (unos.razred) setRazred(unos.razred);
    setSkolaKoda(unos.skola || null);
    setKorak(2);
  };

  const registriraj = () => {
    setGreska("");
    if (!ime.trim() || !prezime.trim()) { setGreska("Upiši ime i prezime."); return; }
    if (uloga === "ucenik" && !razred) { setGreska("Odaberi razred."); return; }
    if (uloga === "ucitelj" && predmeti.length === 0) { setGreska("Odaberi barem jedan predmet."); return; }
    const token = genSessionToken(); const schoolYear = getSchoolYear();
    const noviClan = { id:Date.now(), ime:ime.trim(), prezime:prezime.trim(), uloga, razred:uloga==="ucenik"?razred:null, predmeti:uloga==="ucitelj"?predmeti:[], aktivan:true, kod:kod.trim().toUpperCase(), lozinka:"", avatar:uloga==="ucenik"?"🧑‍🎓":"👩‍🏫", bodovi:0, pokusaji:0, zakljucan:false, banan:false, opomene:0, sessionToken:token, sessionYear:schoolYear };
    setClanovi(c => [...c, noviClan]);
    setKodovi(prev => prev.map(k => k.kod === kod.trim().toUpperCase() ? {...k, koristen:true, koristenGodina:schoolYear} : k));
    try { localStorage.setItem('peerup_session', JSON.stringify({ userId: noviClan.id, token, schoolYear })); } catch {}
    setGotovo(true);
    setTimeout(() => onUspjeh(noviClan), 1800);
  };

  if (gotovo) return (
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
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:48 }}>{korak===1?"✏️":"📋"}</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:26, color:C.ink }}>Registracija</h2>
          {korak===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
              <p style={{ margin:0, color:C.inkLight, fontSize:13 }}>Registracija kao: <strong style={{ color:uloga==="ucenik"?C.teal:C.blue }}>{uloga==="ucenik"?"Učenik":"Učitelj"}</strong></p>
              {skolaKoda && <p style={{ margin:0, fontSize:12, color:C.plum, fontWeight:700 }}>🏫 {skolaKoda}</p>}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[1,2].map(k=><div key={k} style={{ flex:1, height:4, borderRadius:99, background:k<=korak?C.teal:C.cardBorder, transition:"background 0.3s" }} />)}
        </div>
        <Card>
          {korak===1 && (
            <>
              <FInp label="Pristupni kod" value={kod} onChange={e=>setKod(e.target.value)} placeholder="npr. UCE-5-01" icon="🪪" />
              <div style={{ background:C.amberLight, border:`1.5px solid ${C.amber}44`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                <p style={{ margin:0, fontSize:12, color:C.amber, fontWeight:700 }}>💡 Kod dobivaš od učitelja/ice ili administratora. Kod vrijedi cijelu školsku godinu — čuvaj ga.</p>
              </div>
              {greska && <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
              <Btn label="Provjeri kod →" color={C.teal} full disabled={!kod} onClick={provjeriKod} />
            </>
          )}
          {korak===2 && (
            <>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ flex:1 }}><FInp label="Ime" value={ime} onChange={e=>setIme(e.target.value)} placeholder="Ime" /></div>
                <div style={{ flex:1 }}><FInp label="Prezime" value={prezime} onChange={e=>setPrezime(e.target.value)} placeholder="Prezime" /></div>
              </div>
              {uloga==="ucenik" && (
                <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Razred</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {RAZREDI.map(r=><button key={r} onClick={()=>setRazred(r)} style={{ padding:"7px 12px", borderRadius:9, border:`2px solid ${razred===r?C.teal:C.cardBorder}`, background:razred===r?C.tealLight:C.bg, color:razred===r?C.teal:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>{r} r.</button>)}
                </div></>
              )}
              {uloga==="ucitelj" && (
                <><p style={{ margin:"0 0 8px", fontSize:12, color:C.inkLight, fontWeight:700, textTransform:"uppercase" }}>Predmeti</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {PREDMETI.map(p=>{const sel=predmeti.includes(p);return <button key={p} onClick={()=>setPredmeti(prev=>sel?prev.filter(x=>x!==p):[...prev,p])} style={{ padding:"5px 10px", borderRadius:8, border:`2px solid ${sel?C.blue:C.cardBorder}`, background:sel?C.blueLight:C.bg, color:sel?C.blue:C.inkMid, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:11, cursor:"pointer" }}>{p}</button>;})}
                </div></>
              )}
              {greska && <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:10 }}>⚠ {greska}</p>}
              <Btn label="Registriraj se →" color={C.teal} full disabled={!ime||!prezime} onClick={registriraj} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function EkranDemo({ clanovi, onUspjeh, onNatrag }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <button onClick={onNatrag} style={{ background:"none", border:"none", color:C.teal, fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", padding:0, marginBottom:24 }}>← Natrag</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48 }}>🎭</div>
          <h2 style={{ margin:"8px 0 4px", fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:26, color:C.ink }}>Demo prikaz</h2>
          <p style={{ margin:0, color:C.inkLight, fontSize:13 }}>Isprobaj aplikaciju bez registracije</p>
        </div>
        <Card>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[{id:5,label:"🧑‍🎓 Učenik – Luka Marić",sub:"7. razred · 142 boda"},{id:2,label:"👩‍🏫 Učiteljica – Ivana Kovač",sub:"Matematika · Fizika"},{id:1,label:"👨‍💼 Administrator – Marko Horvat",sub:"Upravljačka ploča"}].map(d=>(
              <button key={d.id} onClick={()=>onUspjeh({...clanovi.find(c=>c.id===d.id), sessionToken:"demo", sessionYear:getSchoolYear()})} style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:`1.5px solid ${C.cardBorder}`, background:C.bg, fontFamily:"'Nunito', sans-serif", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontWeight:800, color:C.ink, fontSize:14 }}>{d.label}</div>
                <div style={{ fontWeight:600, color:C.inkLight, fontSize:12, marginTop:2 }}>{d.sub}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---- MAIN APP ----
function GlavnaAplikacija({ korisnik, setKorisnik, clanovi, setClanovi, kodovi, setKodovi, skola = { naziv: SKOLA_NAZIV, grad: SKOLA_GRAD, mzoKod: "", oib: "" }, setSkola, onOdjava }) {
  const [aktTab, setAktTab] = useState("ucimo");
  const [ponude, setPonude] = useState(DEMO_PONUDE);
  const [materijali, setMaterijali] = useState(DEMO_MATERIJALI);
  const [razmjena, setRazmjena] = useState(DEMO_RAZMJENA);
  const [price, setPrice] = useState(DEMO_PRICE);
  const [izazovi, setIzazovi] = useState(INIT_IZAZOVI);
  const [notifikacije, setNotifikacije] = useState([]);

  /* Provjera sesije i školske godine */
  useEffect(() => {
    if (korisnik.sessionToken === "demo") return; // demo mode — preskoci provjeru
    try {
      const stored = localStorage.getItem('peerup_session');
      if (!stored) { onOdjava(); return; }
      const sess = JSON.parse(stored);
      if (sess.userId !== korisnik.id || sess.token !== korisnik.sessionToken) {
        alert("Detektirana prijava s drugog uređaja. Molimo prijavi se ponovo.");
        onOdjava(); return;
      }
      const currentYear = getSchoolYear();
      if (sess.schoolYear !== currentYear) {
        localStorage.removeItem('peerup_session');
        alert(`Nova školska godina (${currentYear}). Molimo prijavi se ponovo za ovu školsku godinu.`);
        onOdjava(); return;
      }
    } catch { onOdjava(); }
  }, []);

  const addBodovi = (n) => setKorisnik(prev => ({ ...prev, bodovi: prev.bodovi + n }));
  const onNotifikacija = (n) => setNotifikacije(prev => [...prev, {...n, procitana:false, id:Date.now()+Math.random()}]);
  const onProcitaj = (id) => setNotifikacije(prev => prev.map(n => n.id===id ? {...n, procitana:true} : n));

  const TABOVI = [
    { id:"ucimo",       label:"Učimo",    ikona:"🤝" },
    { id:"biljeske",    label:"Bilješke", ikona:"📝" },
    { id:"buvljak",     label:"Buvljak",  ikona:"🎒" },
    { id:"price",       label:"Priče",    ikona:"💬" },
    { id:"volontiranje",label:"Volonti.", ikona:"🤲" },
    { id:"bodovi",      label:"Bodovi",   ikona:"⭐" },
  ];
  const razina = getRazina(korisnik.bodovi);
  const neprocitane = notifikacije.filter(n=>!n.procitana).length;
  const jeAdmin = korisnik.uloga === "admin";

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Nunito', sans-serif", maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, #1a8a72 0%, #0e6b58 100%)`, padding:"12px 16px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px #1a8a7233" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={onOdjava} title="Početna stranica" style={{ background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:10, padding:"5px 8px", fontSize:16, cursor:"pointer", lineHeight:1, color:"#fff", backdropFilter:"blur(4px)" }}>🏠</button>
          <div>
            <div style={{ fontWeight:900, fontSize:17, color:"#fff", fontFamily:"'Nunito', sans-serif", letterSpacing:-0.5 }}>Peer<span style={{ color:"#a7f3d0" }}>Up</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.75)" }}>🏫 {skola.naziv} · {korisnik.ime}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:999, padding:"4px 12px", display:"flex", gap:5, alignItems:"center", backdropFilter:"blur(4px)" }}>
            <span style={{ fontSize:13 }}>{razina.ikona}</span>
            <span style={{ fontWeight:900, fontSize:13, color:"#fff" }}>{korisnik.bodovi}</span>
          </div>
          <button onClick={()=>setAktTab("profil")} title="Obavijesti" style={{ position:"relative", background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:999, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:16 }}>
            🔔
            {neprocitane > 0 && <span style={{ position:"absolute", top:-3, right:-3, background:C.rose, color:C.card, borderRadius:"50%", fontSize:9, fontWeight:900, width:17, height:17, display:"flex", alignItems:"center", justifyContent:"center" }}>{neprocitane}</span>}
          </button>
          <button onClick={()=>setAktTab("profil")} title="Profil" style={{ position:"relative", background:aktTab==="profil"?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.2)", border:`1.5px solid ${aktTab==="profil"?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)"}`, borderRadius:999, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:16 }}>
            👤
          </button>
          {jeAdmin && (
            <button onClick={()=>setAktTab("adminpanel")} title="Admin panel" style={{ background:aktTab==="adminpanel"?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.2)", border:`1.5px solid ${aktTab==="adminpanel"?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)"}`, borderRadius:999, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:16 }}>
              ⚙️
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:72, paddingTop:4 }}>
        {aktTab==="ucimo"        && <UcimoZajedno korisnik={korisnik} ponude={ponude} setPonude={setPonude} onNotifikacija={onNotifikacija} addBodovi={addBodovi} />}
        {aktTab==="biljeske"     && <Biljeske korisnik={korisnik} materijali={materijali} setMaterijali={setMaterijali} addBodovi={addBodovi} onNotifikacija={onNotifikacija} />}
        {aktTab==="buvljak"      && <SkolskiBuvljak korisnik={korisnik} razmjena={razmjena} setRazmjena={setRazmjena} addBodovi={addBodovi} onNotifikacija={onNotifikacija} />}
        {aktTab==="price"        && <Price korisnik={korisnik} price={price} setPrice={setPrice} addBodovi={addBodovi} />}
        {aktTab==="volontiranje"  && <Volontiranje korisnik={korisnik} addBodovi={addBodovi} onNotifikacija={onNotifikacija} />}
        {aktTab==="bodovi"       && <Bodovi korisnik={korisnik} izazovi={izazovi} setIzazovi={setIzazovi} ljestvica={DEMO_LJESTVICA} addBodovi={addBodovi} onNotifikacija={onNotifikacija} />}
        {aktTab==="profil"       && <Profil korisnik={korisnik} notifikacije={notifikacije} onOdjaviSe={onOdjava} onProcitaj={onProcitaj} />}
        {aktTab==="adminpanel"   && <AdminDashboard korisnik={korisnik} setKorisnik={setKorisnik} clanovi={clanovi} setClanovi={setClanovi} kodovi={kodovi} setKodovi={setKodovi} skola={skola} onOdjava={onOdjava} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(255,255,255,0.95)", borderTop:`1px solid ${C.cardBorder}`, display:"flex", zIndex:200, overflowX:"auto", backdropFilter:"blur(12px)", boxShadow:"0 -4px 20px #1a16120d" }}>
        {TABOVI.map(t=>(
          <button key={t.id} onClick={()=>setAktTab(t.id)} style={{ flex:"0 0 auto", minWidth:54, padding:"8px 3px 10px", background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", position:"relative", transition:"all 0.15s" }}>
            <span style={{ fontSize:aktTab===t.id?20:17, transition:"font-size 0.15s" }}>{t.ikona}</span>
            <span style={{ fontSize:9, fontWeight:800, color:aktTab===t.id?C.teal:C.inkLight, fontFamily:"'Nunito', sans-serif", whiteSpace:"nowrap" }}>{t.label}</span>
            {aktTab===t.id && <span style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:24, height:3, background:C.teal, borderRadius:"3px 3px 0 0" }} />}
            {t.id==="profil" && neprocitane > 0 && (
              <span style={{ position:"absolute", top:4, right:"50%", marginRight:-18, background:C.rose, color:C.card, borderRadius:"50%", fontSize:8, fontWeight:900, width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center" }}>{neprocitane}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- ROOT ----
export default function App() {
  const [clanovi, setClanovi] = useState(INIT_CLANOVI);
  const [kodovi, setKodovi]   = useState(INIT_KODOVI);
  const [korisnik, setKorisnik] = useState(null);
  const [skola, setSkola] = useState({ naziv: SKOLA_NAZIV, grad: SKOLA_GRAD, mzoKod: "", oib: "" });

  const odjava = () => { try { localStorage.removeItem('peerup_session'); } catch {} setKorisnik(null); };

  if (!korisnik) return <PrijavaSustav clanovi={clanovi} setClanovi={setClanovi} kodovi={kodovi} setKodovi={setKodovi} onPrijava={setKorisnik} skola={skola} setSkola={setSkola} />;
  return <GlavnaAplikacija korisnik={korisnik} setKorisnik={setKorisnik} clanovi={clanovi} setClanovi={setClanovi} kodovi={kodovi} setKodovi={setKodovi} skola={skola} setSkola={setSkola} onOdjava={odjava} />;
}
