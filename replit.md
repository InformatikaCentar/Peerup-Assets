# PeerUp

PeerUp je školska platforma za međuvršnjačku pomoć koja učenicima OŠ Centar u Rijeci omogućuje rezervaciju instrukcija, razmjenu bilješki i školskog materijala te sakupljanje bodova za aktivno sudjelovanje u zajednici.

---

## Opis projekta

### Vizija i smjernice

PeerUp je zamišljen kao zatvorena digitalna zajednica jedne škole — u ovom slučaju **OŠ Centar, Rijeka** — u kojoj učenici međusobno pomažu jedni drugima bez posredništva nastavnika. Platforma potiče vršnjačko učenje (*peer learning*), dijeljenje znanja i resursa te aktivno sudjelovanje u školskom životu.

Ključne smjernice projekta:
- Pristup je strogo ograničen na učenike i nastavnike te škole putem **jednokratnih pristupnih kodova** — nema javne registracije.
- Svaka aktivnost (pomoć, dijeljenje, rezervacija, kviz) nagrađuje se **bodovima** kako bi se potaknulo redovito sudjelovanje.
- Sučelje je na **hrvatskom jeziku**, prilagođeno učenicima od 1. do 8. razreda i njihovim nastavnicima.
- Aplikacija je **frontend-only** (React + Vite, TypeScript), bez backenda — podaci se čuvaju u stanju komponenti.
- Dizajn koristi font **Nunito** i paletu boja PeerUp: tirkizno zelena (#1a8a72), amber (#d97706), ružičasto crvena (#e03e5c), ljubičasta (#7c3aed), topla bež pozadina (#f7f3ee).

---

### Prijava i registracija

Na početnom ekranu korisnik bira između tri opcije:

| Opcija | Opis |
|---|---|
| **🔑 Prijava** | Unos školskog koda (npr. `UCE-7-01`) i lozinke za postojeće korisnike |
| **✏️ Registracija** | Zahtijeva jednokratni pristupni kod koji generira administrator; korisnik zatim unosi ime, prezime, razred i lozinku |
| **🎭 Demo prikaz** | Trenutni ulaz bez lozinke — nudi unaprijed konfiguriranih 3 demo profila (učenik Luka, učiteljica Ivana, admin Marko) za istraživanje svih funkcija |

#### Uloge
- **Učenik** — pristup svim tabovima; može nuditi i tražiti pomoć, dijeliti bilješke, sudjelovati u buvljaku, zarađivati bodove
- **Učitelj** — može ponuditi *Expertnu pomoć*, upravljati edukativnim materijalima, ima prilagođeno sučelje (npr. gumb "Ponudi poduku" umjesto "Traži pomoć")
- **Admin** — pristup posebnoj administratorskoj nadzornoj ploči: statistike škole, upravljanje korisnicima, generiranje pristupnih kodova za cijele razrede

---

### Kartice / izbornici

#### 1. 📚 Učimo zajedno
**Cilj:** Tržnica međuvršnjačkih instrukcija — svaki učenik može ponuditi ili zatražiti pomoć iz određenog predmeta.

- Prikaz svih objava s filterima po **predmetu** i **razredu**
- Kartica objave prikazuje: ime učenika, razred, predmet, lekciju, kratki opis, slobodne termine i prosječnu ocjenu
- Gumb **"Rezerviraj termin"** otvara **klasični kalendar** s odabirom godine → mjeseca → dana → sata; kalendar automatski grije datume koji nisu dostupni u rasporedu ponuditelja
- Učenici mogu kreirati **novu objavu** (obrazac u 3 koraka: tip/predmet → detalji → termini)
- Rezervacija donosi **+5 bodova** rezervatoru; objava i odrađeni sat donose **+8/+10 bodova** ponuditelju

#### 2. 📝 Bilješke i mape
**Cilj:** Repozitorij edukativnih materijala koje učenici međusobno dijele — bilješke, sažeci, umne mape.

- Pretraživanje i filtriranje po predmetu
- Svaki materijal ima: naslov, opis, predmet, razred, autora, broj preuzimanja i ocjenu
- Gumb **"Preuzmi"** simulira preuzimanje i dodjeljuje bodove
- Gumb **"Generiraj kviz"** pokreće interaktivni kviz s pitanjima vezanim uz taj predmet; točni odgovori donose **bodove** i prikazuju se s objašnjenjem
- Učenici mogu **Dodati materijal** — unos naslova, opisa, predmeta, razreda i sadržaja

#### 3. 🎒 Školski buvljak
**Cilj:** Platforma za razmjenu, posuđivanje i doniranje školskog materijala — udžbenici, pribor, oprema, odjeća.

- Prikaz oglasa s filterima po kategoriji i tipu (zamjena / posudba / darivanje)
- Kartica oglasa: naziv, opis, cijena ili uvjet zamjene, stanje predmeta, vlasnik, lokacija preuzimanja
- Gumb **"Rezerviraj"** otvara kalendar za dogovor preuzimanja; rezervacija označava oglas kao zauzet
- Učenici mogu **Dodati oglas** — unos naziva, opisa, kategorije, tipa ponude i dostupnih termina

#### 4. 📖 Priče
**Cilj:** Školski socijalni feed — učenici dijele uspjehe, projekte, školske vijesti i motivacijske poruke.

- Kronološki feed objava s mogućnošću **lajkanja** i **komentiranja**
- Objave mogu biti: uspjesi (natjecanja, nagrade), projektne vijesti, školski događaji, osobni postignuti ciljevi
- Gumb **"Podijeli priču"** otvara editor s unosom naslova i teksta te odabirom kategorije

#### 5. 🤝 Volontiranje
**Cilj:** Organizacija školskih projekata i volonterskih aktivnosti u zajednici.

- Popis aktivnih projekata: naziv, opis, datum, lokacija, broj potrebnih volontera, mentor
- Gumb **"Prijavi se"** dodjeljuje bodove i potvrdu prijave
- Admin i učitelji mogu **Kreirati novu aktivnost** s datumom, lokacijom i opisom zadataka

#### 6. 🏆 Bodovi i nagrade
**Cilj:** Gamifikacijska jezgra platforme — motivira redovitu aktivnost i natjecanje.

- **Ljestvica (Leaderboard):** rang-lista svih učenika škole s ukupnim bodovima i rangom
- **Moji bodovi:** pregled osobnog napretka, trenutni rang, bodovi do sljedećeg ranga, traka napretka
- **Izazovi:** tjedni/mjesečni zadaci (npr. "Rezerviraj 3 termina ovaj tjedan", "Podijeli 2 bilješke") s nagradama u bodovima
- **Rangovi** (od najnižeg): Početnik 🌱 → Istraživač 🔍 → Pomagač 🤝 → Mentor 🎓 → Zvijezda ⭐ → Legenda 🏆

#### 7. 👤 Profil
**Cilj:** Osobna stranica korisnika s pregledom svih aktivnosti i postavkama.

- Profilna kartica: avatar emoji, ime, prezime, razred, uloga, ukupni bodovi, trenutni rang
- **Statistike:** broj ponuđenih/primljenih instrukcija, preuzimanja bilješki, odrađenih volonterskih sati
- **Obavijesti (Inbox):** sve notifikacije podijeljene u tabs — Sve / Rezervacije / Aktivnosti
- **Odjava** iz aplikacije

#### 8. 🛡️ Admin nadzorna ploča *(samo za administratore)*
**Cilj:** Upravljanje školskom zajednicom i korisničkim pristupom.

- **Statistike škole:** ukupan broj učenika i nastavnika, broj aktivnih korisnika, najaktivniji korisnik
- **Upravljanje korisnicima:** lista svih članova s filtriranjem po ulozi; mogućnost aktivacije/deaktivacije korisnika
- **Generiranje pristupnih kodova:** kreiranje jednokratnih kodova za cijele razrede (npr. `UCE-7-01` do `UCE-7-30`) koje admin zatim distribuira učenicima

---

### Gamifikacija — bodovni sustav

| Akcija | Bodovi |
|---|---|
| Objava ponude za pomoć | +8 |
| Odrađen sat instrukcija | +10 |
| Rezervacija termina | +5 |
| Dijeljenje bilješki/materijala | +6 |
| Preuzimanje i ocjena materijala | +3 |
| Rješavanje kviza | +2–5 po točnom odgovoru |
| Prijava na volontersku aktivnost | +5 |
| Završen tjedni izazov | +15–25 |

---

### Tehnički stack

- **Frontend:** React 18 + Vite, TypeScript, Tailwind CSS, Framer Motion
- **Font:** Nunito (Google Fonts)
- **Arhitektura:** Jednodatotečna SPA aplikacija (`App.tsx`), podaci u React stanju (bez backenda)
- **Monorepo:** pnpm workspaces — aplikacija u `artifacts/peerup/`
- **Promo video:** Zasebni artifact u `artifacts/peerup-video/` — animirani klip od 5 scena (19 sekundi) s glazbom

---

## Where things live

- `artifacts/peerup/src/App.tsx` — cijela frontend aplikacija (~2 400 redaka, `// @ts-nocheck`)
- `artifacts/peerup-video/src/` — promotivni video (scene, VideoTemplate, VideoWithControls, hooks)
- `artifacts/peerup-video/public/audio/bg_music.mp3` — generirana pozadinska glazba

## Architecture decisions

- Aplikacija je namjerno bez backenda — svi podaci žive u React stanju kako bi prototip bio potpuno prenosiv i ne zahtijeva konfiguraciju baze.
- Jednokratni pristupni kodovi simuliraju sigurnu registraciju zatvorene školske zajednice bez pravog auth sustava.
- Kalendar za rezervaciju termina koristi lokalni `new Date()` za navigaciju, ali kompatibilan je s postojećim podacima koji koriste kratice dana u tjednu (Pon/Uto/…).

## User preferences

- Škola: **OŠ Centar**, grad: **Rijeka** — koristiti konzistentno u svim komponentama
- Jezik sučelja: **hrvatski** (hr)
- Font: **Nunito** (Google Fonts), paleta boja PeerUp: tirkizno #1a8a72, amber #d97706, ružičasto #e03e5c, ljubičasta #7c3aed

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
