import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, usersTable } from "@workspace/db";
import { eq, and, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "@workspace/db";
import { logger } from "../lib/logger";
import { sendResetEmail } from "../lib/mailer";

const router = Router();

// POST /api/auth/register-school
// Registracija nove škole — provjerava format OIB-a i šifre škole, korisnik unosi naziv
router.post("/register-school", async (req, res) => {
  try {
    const { oib, sifra_skole, naziv_skole, admin_email, admin_password, admin_ime, admin_prezime, uloga_prikaz } = req.body;

    if (!oib || !sifra_skole || !naziv_skole || !admin_email || !admin_password || !admin_ime || !admin_prezime) {
      return res.status(400).json({ greska: "Sva polja su obavezna." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin_email.trim())) {
      return res.status(400).json({ greska: "Unesite valjanu email adresu." });
    }
    if (!/^\d{11}$/.test(oib.trim())) {
      return res.status(400).json({ greska: "OIB mora imati točno 11 znamenki." });
    }
    if (!/^\d{2}-\d{3}-\d{3}$/.test(sifra_skole.trim())) {
      return res.status(400).json({ greska: "Šifra škole mora biti u obliku 00-000-000." });
    }
    if (admin_password.length < 8) {
      return res.status(400).json({ greska: "Lozinka mora imati najmanje 8 znakova." });
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

    // Kreiranje škole s korisničkim podatcima
    const [novaSkola] = await db
      .insert(schoolsTable)
      .values({
        oib: oib.trim(),
        sifraSkole: sifra_skole.trim(),
        naziv: naziv_skole.trim(),
        verified: true,
      })
      .returning();

    // Hash lozinke
    const passwordHash = await bcrypt.hash(admin_password, 12);

    // Kreiranje admin korisnika
    const adminKod = `ADM-${sifra_skole.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}`;
    const dbUloga = (uloga_prikaz === "ravnatelj") ? "ravnatelj" : "admin";
    const [adminKorisnik] = await db
      .insert(usersTable)
      .values({
        schoolId: novaSkola.id,
        uloga: dbUloga,
        email: admin_email.trim().toLowerCase(),
        passwordHash,
        kod: adminKod,
        ime: admin_ime.trim(),
        prezime: admin_prezime.trim(),
        firstLogin: false,
        aktivan: true,
        avatar: dbUloga === "ravnatelj" ? "🏛️" : "🛡️",
      })
      .returning();

    req.session.userId = adminKorisnik.id;
    req.session.schoolId = novaSkola.id;

    logger.info({ schoolId: novaSkola.id, uloga_prikaz: uloga_prikaz ?? "ravnatelj", adminKod }, "Nova škola registrirana");

    return res.status(201).json({
      poruka: `Dobrodošli! Škola "${naziv_skole.trim()}" uspješno je registrirana.`,
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
      .where(and(
        eq(usersTable.email, email.trim().toLowerCase()),
        or(eq(usersTable.uloga, "admin"), eq(usersTable.uloga, "ravnatelj"))
      ))
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
        const [skolaInfo] = await db.select().from(schoolsTable).where(eq(schoolsTable.id, korisnik.schoolId)).limit(1);
        return res.status(200).json({
          firstLogin: true,
          kod: kodNorm,
          uloga: korisnik.uloga,
          razred: korisnik.razred,
          skolaNaziv: skolaInfo?.naziv ?? "",
          poruka: "Molimo unesite ime i prezime za postavljanje profila.",
        });
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
// Provjera formata OIB-a i šifre škole, te je li škola već registrirana
router.post("/check-school", async (req, res) => {
  try {
    const { oib, sifra_skole } = req.body;
    if (!oib || !sifra_skole) {
      return res.status(400).json({ greska: "OIB i šifra škole su obavezni." });
    }
    if (!/^\d{11}$/.test(oib.trim())) {
      return res.status(400).json({ greska: "OIB mora imati točno 11 znamenki." });
    }
    if (!/^\d{2}-\d{3}-\d{3}$/.test(sifra_skole.trim())) {
      return res.status(400).json({ greska: "Šifra škole mora biti u obliku 00-000-000." });
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

    return res.json({ oib: oib.trim(), sifraSkole: sifra_skole.trim() });
  } catch (err) {
    logger.error(err, "Greška pri provjeri škole");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ greska: "Email je obavezan." });

    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(and(
        eq(usersTable.email, email.trim().toLowerCase()),
        or(eq(usersTable.uloga, "admin"), eq(usersTable.uloga, "ravnatelj"))
      ))
      .limit(1);

    // Uvijek vrati OK (ne otkrivamo postoji li email)
    if (!korisnik) {
      return res.json({ poruka: "Ako email postoji u sustavu, poslali smo link za resetiranje." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 sat

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [korisnik.id, token, expiresAt]
    );

    const domains = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost:80";
    const resetUrl = `https://${domains}/?reset=${token}`;

    const emailSent = await sendResetEmail(korisnik.email!, resetUrl, korisnik.ime || "Korisnik");

    logger.info({ userId: korisnik.id, emailSent }, "Zahtjev za reset lozinke");
    return res.json({ poruka: "Ako email postoji u sustavu, poslali smo link za resetiranje." });
  } catch (err) {
    logger.error(err, "Greška pri forgot-password");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, nova_lozinka } = req.body;
    if (!token || !nova_lozinka) return res.status(400).json({ greska: "Token i nova lozinka su obavezni." });
    if (nova_lozinka.length < 8) return res.status(400).json({ greska: "Lozinka mora imati najmanje 8 znakova." });

    const { rows } = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({ greska: "Link za resetiranje je istekao ili je već iskorišten." });
    }

    const resetRow = rows[0];
    const hash = await bcrypt.hash(nova_lozinka, 12);

    await db.update(usersTable)
      .set({ passwordHash: hash })
      .where(eq(usersTable.id, resetRow.user_id));

    await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`,
      [resetRow.id]
    );

    logger.info({ userId: resetRow.user_id }, "Lozinka resetirana");
    return res.json({ poruka: "Lozinka je uspješno promijenjena. Možete se prijaviti." });
  } catch (err) {
    logger.error(err, "Greška pri reset-password");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

export default router;
