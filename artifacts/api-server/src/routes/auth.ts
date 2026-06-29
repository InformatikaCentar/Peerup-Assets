import { Router } from "express";
import { db } from "@workspace/db";
import { mzoSchoolsTable, schoolsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logger } from "../lib/logger";

const router = Router();

// POST /api/auth/register-school
// Registracija nove škole — provjerava OIB i šifru škole u mzo_schools tablici
router.post("/register-school", async (req, res) => {
  try {
    const { oib, sifra_skole, admin_email, admin_password, admin_ime, admin_prezime } = req.body;

    if (!oib || !sifra_skole || !admin_email || !admin_password || !admin_ime || !admin_prezime) {
      return res.status(400).json({ greska: "Sva polja su obavezna." });
    }
    if (admin_password.length < 8) {
      return res.status(400).json({ greska: "Lozinka mora imati najmanje 8 znakova." });
    }

    // Provjera OIB-a i šifre škole u MZO bazi
    const [mzoSkola] = await db
      .select()
      .from(mzoSchoolsTable)
      .where(and(eq(mzoSchoolsTable.oib, oib.trim()), eq(mzoSchoolsTable.sifraSkole, sifra_skole.trim())))
      .limit(1);

    if (!mzoSkola) {
      return res.status(404).json({ greska: "Škola nije pronađena u MZO evidenciji. Provjerite OIB i šifru škole." });
    }

    // Provjera je li škola već registrirana
    const [postojecaSkola] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.oib, oib.trim()))
      .limit(1);

    if (postojecaSkola) {
      return res.status(409).json({ greska: "Ova škola je već registrirana u sustavu." });
    }

    // Provjera emaila
    const [postojeciKorisnik] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, admin_email.trim().toLowerCase()))
      .limit(1);

    if (postojeciKorisnik) {
      return res.status(409).json({ greska: "Korisnik s ovim emailom već postoji." });
    }

    // Kreiranje škole
    const [novaSkola] = await db
      .insert(schoolsTable)
      .values({
        oib: oib.trim(),
        sifraSkole: sifra_skole.trim(),
        naziv: mzoSkola.naziv,
        verified: true,
      })
      .returning();

    // Hash lozinke
    const passwordHash = await bcrypt.hash(admin_password, 12);

    // Kreiranje admin korisnika
    const adminKod = `ADM-${sifra_skole.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}`;
    const [adminKorisnik] = await db
      .insert(usersTable)
      .values({
        schoolId: novaSkola.id,
        uloga: "admin",
        email: admin_email.trim().toLowerCase(),
        passwordHash,
        kod: adminKod,
        ime: admin_ime.trim(),
        prezime: admin_prezime.trim(),
        firstLogin: false,
        aktivan: true,
        avatar: "👨‍💼",
      })
      .returning();

    req.session.userId = adminKorisnik.id;
    req.session.schoolId = novaSkola.id;

    logger.info({ schoolId: novaSkola.id, email: admin_email }, "Nova škola registrirana");

    return res.status(201).json({
      poruka: `Dobrodošli! Škola "${mzoSkola.naziv}" uspješno je registrirana.`,
      korisnik: {
        id: adminKorisnik.id,
        ime: adminKorisnik.ime,
        prezime: adminKorisnik.prezime,
        uloga: adminKorisnik.uloga,
        kod: adminKorisnik.kod,
        avatar: adminKorisnik.avatar,
        bodovi: adminKorisnik.bodovi,
        firstLogin: adminKorisnik.firstLogin,
        skolaNaziv: novaSkola.naziv,
        skolaId: novaSkola.id,
      },
    });
  } catch (err) {
    logger.error(err, "Greška pri registraciji škole");
    return res.status(500).json({ greska: "Interna greška servera. Pokušajte ponovo." });
  }
});

// POST /api/auth/login
// Prijava admina s emailom i lozinkom
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ greska: "Email i lozinka su obavezni." });
    }

    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email.trim().toLowerCase()), eq(usersTable.uloga, "admin")))
      .limit(1);

    if (!korisnik || !korisnik.passwordHash) {
      return res.status(401).json({ greska: "Neispravan email ili lozinka." });
    }

    if (!korisnik.aktivan) {
      return res.status(403).json({ greska: "Vaš račun je deaktiviran. Obratite se administratoru." });
    }

    const tocna = await bcrypt.compare(password, korisnik.passwordHash);
    if (!tocna) {
      return res.status(401).json({ greska: "Neispravan email ili lozinka." });
    }

    const [skola] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.id, korisnik.schoolId))
      .limit(1);

    req.session.userId = korisnik.id;
    req.session.schoolId = korisnik.schoolId;

    return res.json({
      korisnik: {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        uloga: korisnik.uloga,
        kod: korisnik.kod,
        email: korisnik.email,
        avatar: korisnik.avatar,
        bodovi: korisnik.bodovi,
        firstLogin: korisnik.firstLogin,
        skolaNaziv: skola?.naziv ?? "",
        skolaId: korisnik.schoolId,
      },
    });
  } catch (err) {
    logger.error(err, "Greška pri prijavi");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// POST /api/auth/login-code
// Prijava učenika ili učitelja s pristupnim kodom
router.post("/login-code", async (req, res) => {
  try {
    const { kod, ime, prezime } = req.body;
    if (!kod) {
      return res.status(400).json({ greska: "Pristupni kod je obavezan." });
    }

    const kodNorm = kod.trim().toUpperCase();
    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.kod, kodNorm))
      .limit(1);

    if (!korisnik) {
      return res.status(404).json({ greska: "Neispravan pristupni kod. Provjeri kod koji si dobio/la od administratora." });
    }

    if (!korisnik.aktivan) {
      return res.status(403).json({ greska: "Vaš račun je deaktiviran. Obratite se administratoru škole." });
    }

    // Ako je prvi login — korisnik mora unijeti ime i prezime
    if (korisnik.firstLogin) {
      if (!ime || !prezime) {
        return res.status(200).json({ firstLogin: true, kod: kodNorm, poruka: "Molimo unesite ime i prezime za postavljanje profila." });
      }

      // Postavi ime i prezime te označi firstLogin = false
      const [azuriran] = await db
        .update(usersTable)
        .set({ ime: ime.trim(), prezime: prezime.trim(), firstLogin: false })
        .where(eq(usersTable.id, korisnik.id))
        .returning();

      const [skola] = await db.select().from(schoolsTable).where(eq(schoolsTable.id, korisnik.schoolId)).limit(1);

      req.session.userId = azuriran.id;
      req.session.schoolId = azuriran.schoolId;

      return res.json({
        korisnik: {
          id: azuriran.id,
          ime: azuriran.ime,
          prezime: azuriran.prezime,
          uloga: azuriran.uloga,
          kod: azuriran.kod,
          razred: azuriran.razred,
          avatar: azuriran.avatar,
          bodovi: azuriran.bodovi,
          firstLogin: false,
          skolaNaziv: skola?.naziv ?? "",
          skolaId: azuriran.schoolId,
        },
      });
    }

    // Svaki sljedeći login: samo kod
    const [skola] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.id, korisnik.schoolId))
      .limit(1);

    req.session.userId = korisnik.id;
    req.session.schoolId = korisnik.schoolId;

    return res.json({
      korisnik: {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        uloga: korisnik.uloga,
        kod: korisnik.kod,
        razred: korisnik.razred,
        avatar: korisnik.avatar,
        bodovi: korisnik.bodovi,
        firstLogin: false,
        skolaNaziv: skola?.naziv ?? "",
        skolaId: korisnik.schoolId,
      },
    });
  } catch (err) {
    logger.error(err, "Greška pri prijavi s kodom");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ poruka: "Odjavljeni ste." });
  });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ greska: "Niste prijavljeni." });
    }

    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId))
      .limit(1);

    if (!korisnik) {
      req.session.destroy(() => {});
      return res.status(401).json({ greska: "Sesija istekla." });
    }

    const [skola] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.id, korisnik.schoolId))
      .limit(1);

    return res.json({
      korisnik: {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        uloga: korisnik.uloga,
        kod: korisnik.kod,
        email: korisnik.email,
        razred: korisnik.razred,
        avatar: korisnik.avatar,
        bodovi: korisnik.bodovi,
        firstLogin: korisnik.firstLogin,
        skolaNaziv: skola?.naziv ?? "",
        skolaId: korisnik.schoolId,
      },
    });
  } catch (err) {
    logger.error(err, "Greška pri /me");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// POST /api/auth/check-school
// Provjera OIB-a i šifre škole u MZO evidenciji (bez registracije)
router.post("/check-school", async (req, res) => {
  try {
    const { oib, sifra_skole } = req.body;
    if (!oib || !sifra_skole) {
      return res.status(400).json({ greska: "OIB i šifra škole su obavezni." });
    }

    const [mzoSkola] = await db
      .select()
      .from(mzoSchoolsTable)
      .where(and(eq(mzoSchoolsTable.oib, oib.trim()), eq(mzoSchoolsTable.sifraSkole, sifra_skole.trim())))
      .limit(1);

    if (!mzoSkola) {
      return res.status(404).json({ greska: "Škola nije pronađena u MZO evidenciji. Provjerite OIB i šifru škole." });
    }

    // Provjera je li škola već registrirana
    const [postojecaSkola] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.oib, oib.trim()))
      .limit(1);

    if (postojecaSkola) {
      return res.status(409).json({ greska: "Ova škola je već registrirana. Prijavite se kao administrator." });
    }

    return res.json({ naziv: mzoSkola.naziv, oib: mzoSkola.oib, sifraSkole: mzoSkola.sifraSkole });
  } catch (err) {
    logger.error(err, "Greška pri provjeri škole");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

export default router;
