import nodemailer from "nodemailer";
import { logger } from "./logger";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587");

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendResetEmail(to: string, resetUrl: string, ime: string): Promise<boolean> {
  const transport = createTransport();
  const from = process.env.SMTP_USER || "noreply@peerup.hr";

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#f7f3ee;padding:32px;border-radius:16px">
      <div style="text-align:center;margin-bottom:24px">
        <span style="font-size:48px">🤝</span>
        <h1 style="margin:8px 0 0;color:#1a1a2e;font-size:28px">Peer<span style="color:#1a8a72">Up</span></h1>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;border:1.5px solid #e5e0da">
        <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:20px">Resetiranje lozinke</h2>
        <p style="color:#555;line-height:1.6;margin:0 0 20px">Pozdrav, <strong>${ime}</strong>! Primili smo zahtjev za resetiranje lozinke vašeg PeerUp računa.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#1a8a72;color:#fff;padding:12px 28px;border-radius:99px;text-decoration:none;font-weight:700;font-size:15px">
          Resetiraj lozinku →
        </a>
        <p style="color:#888;font-size:12px;margin:20px 0 0;line-height:1.6">Ovaj link vrijedi <strong>60 minuta</strong>. Ako niste zatražili resetiranje, ignorirajte ovaj email.</p>
      </div>
      <p style="text-align:center;color:#aaa;font-size:11px;margin-top:16px">PeerUp · OŠ Centar, Rijeka</p>
    </div>
  `;

  if (!transport) {
    logger.warn({ to, resetUrl }, "SMTP nije konfiguriran — reset link u logu");
    logger.info({ resetUrl }, "🔑 RESET LINK (kopirajte u preglednik)");
    return false;
  }

  try {
    await transport.sendMail({
      from: `"PeerUp" <${from}>`,
      to,
      subject: "PeerUp — Resetiranje lozinke",
      html,
    });
    logger.info({ to }, "Reset email poslan");
    return true;
  } catch (err) {
    logger.error(err, "Greška pri slanju emaila");
    return false;
  }
}
