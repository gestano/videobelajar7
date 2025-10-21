import nodemailer from "nodemailer";

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
  }

  // fallback Ethereal (untuk dev/testing)
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  console.log("[MAIL] Using Ethereal account:", testAccount.user);
  return transporter;
}

export async function sendVerificationEmail(to, token) {
  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  const url = `${base}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`;
  const from = process.env.MAIL_FROM || "Videobelajar <no-reply@videobelajar.local>";

  const t = await getTransporter();
  const info = await t.sendMail({
    from,
    to,
    subject: "Verifikasi Email Akun Anda",
    html: `
      <p>Halo,</p>
      <p>Terima kasih sudah mendaftar di Videobelajar. Klik tautan di bawah untuk verifikasi email Anda:</p>
      <p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>
      <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
    `,
  });

  if (nodemailer.getTestMessageUrl) {
    console.log("[MAIL] Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}