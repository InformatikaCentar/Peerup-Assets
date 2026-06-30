import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, schoolsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// Middleware: samo admin može pristupiti ovim rutama
function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ greska: "Niste prijavljeni." });
  }
  next();
}

// Generira jedinstveni pristupni kod
function genKod(uloga: string, razred: string | null, n: number): string {
  const prefix = uloga === "ucenik" ? "UCE" : "UCT";
  const razredDio = razred ? `-${razred.replace(".", "")}-` : "-";
  const br = String(n).padStart(2, "0");
  return `${prefix}${razredDio}${br}`;
}

// POST /api/admin/generate-codes
// Generira pristupne kodove za učenike ili učitelje
router.post("/generate-codes", requireAdmin, async (req, res) => {
  try {
    const { uloga, razred, broj } = req.body;
    const schoolId = req.session.schoolId;

    if (!uloga || !broj || broj < 1 || broj > 50) {
      return res.status(400).json({ greska: "Nevaljani parametri. Uloga i broj (1-50) su obavezni." });
    }
    if (uloga === "ucenik" && !razred) {
      return res.status(400).json({ greska: "Za učenike je obavezan razred." });
    }

    // Provjera je li trenutni korisnik admin ove škole
    const [admin] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, req.session.userId!), eq(usersTable.schoolId, schoolId!)))
      .limit(1);

    if (!admin || (admin.uloga !== "admin" && admin.uloga !== "ravnatelj")) {
      return res.status(403).json({ greska: "Nemate ovlasti za ovu akciju." });
    }

    const noviKodovi = [];
    const timestamp = Date.now();

    for (let i = 1; i <= broj; i++) {
      // Unikatnost: pokušaj s brojem + timestamp suffix
      let kodBase = genKod(uloga, razred ?? null, i);
      let finalKod = kodBase;
      let suffix = 0;

      while (suffix < 100) {
        const [postoji] = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.kod, finalKod))
          .limit(1);

        if (!postoji) break;
        suffix++;
        finalKod = `${kodBase}-${suffix}`;
      }

      const avatar = uloga === "ucenik" ? "🧑‍🎓" : "👩‍🏫";

      const [noviKorisnik] = await db
        .insert(usersTable)
        .values({
          schoolId: schoolId!,
          uloga,
          kod: finalKod,
          razred: uloga === "ucenik" ? razred : null,
          firstLogin: true,
          aktivan: true,
          avatar,
        })
        .returning();

      noviKodovi.push({
        id: noviKorisnik.id,
        kod: noviKorisnik.kod,
        uloga: noviKorisnik.uloga,
        razred: noviKorisnik.razred,
        koristen: !noviKorisnik.firstLogin && noviKorisnik.ime !== null,
        datum: new Date().toLocaleDateString("hr-HR"),
      });
    }

    logger.info({ schoolId, uloga, broj }, "Generirani novi kodovi");

    return res.status(201).json({ kodovi: noviKodovi, poruka: `Uspješno generirano ${noviKodovi.length} kodova.` });
  } catch (err) {
    logger.error(err, "Greška pri generiranju kodova");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// GET /api/admin/codes
// Lista svih kodova za školu
router.get("/codes", requireAdmin, async (req, res) => {
  try {
    const schoolId = req.session.schoolId;

    const kodovi = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.schoolId, schoolId!)));

    return res.json({
      kodovi: kodovi
        .filter(k => k.uloga !== "admin")
        .map(k => ({
          id: k.id,
          kod: k.kod,
          uloga: k.uloga,
          razred: k.razred,
          ime: k.ime,
          prezime: k.prezime,
          koristen: !k.firstLogin,
          aktivan: k.aktivan,
          datum: k.createdAt.toLocaleDateString("hr-HR"),
        })),
    });
  } catch (err) {
    logger.error(err, "Greška pri dohvatu kodova");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// GET /api/admin/users
// Lista svih korisnika škole
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const schoolId = req.session.schoolId;

    const korisnici = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.schoolId, schoolId!));

    return res.json({
      korisnici: korisnici.map(k => ({
        id: k.id,
        ime: k.ime,
        prezime: k.prezime,
        uloga: k.uloga,
        kod: k.kod,
        razred: k.razred,
        email: k.email,
        aktivan: k.aktivan,
        bodovi: k.bodovi,
        avatar: k.avatar,
        firstLogin: k.firstLogin,
      })),
    });
  } catch (err) {
    logger.error(err, "Greška pri dohvatu korisnika");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// PATCH /api/admin/users/:id/toggle
// Aktivacija/deaktivacija korisnika
router.patch("/users/:id/toggle", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.session.schoolId;

    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, Number(id)), eq(usersTable.schoolId, schoolId!)))
      .limit(1);

    if (!korisnik) {
      return res.status(404).json({ greska: "Korisnik nije pronađen." });
    }

    const [azuriran] = await db
      .update(usersTable)
      .set({ aktivan: !korisnik.aktivan })
      .where(eq(usersTable.id, Number(id)))
      .returning();

    return res.json({ aktivan: azuriran.aktivan });
  } catch (err) {
    logger.error(err, "Greška pri togglanju korisnika");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

// DELETE /api/admin/users/:id
// Brisanje korisnika (samo ako nije admin iste škole)
router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.session.schoolId;
    const adminId = req.session.userId;

    const [korisnik] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, Number(id)), eq(usersTable.schoolId, schoolId!)))
      .limit(1);

    if (!korisnik) {
      return res.status(404).json({ greska: "Korisnik nije pronađen." });
    }

    if (korisnik.id === adminId) {
      return res.status(400).json({ greska: "Ne možete ukloniti vlastiti račun." });
    }

    await db.delete(usersTable).where(eq(usersTable.id, Number(id)));

    return res.json({ poruka: "Korisnik je uspješno uklonjen." });
  } catch (err) {
    logger.error(err, "Greška pri brisanju korisnika");
    return res.status(500).json({ greska: "Interna greška servera." });
  }
});

export default router;

