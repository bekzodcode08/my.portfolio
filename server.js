const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*', // Frontend URL ni bu yerga qo'ying
  methods: ['POST'],
}));
app.use(express.json());

// Input validation helper
function validate({ name, email, subject, message }) {
  const errors = [];
  if (!name || name.trim().length < 2)
    errors.push('Ism kamida 2 ta harf bo\'lishi kerak.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('Email manzil noto\'g\'ri.');
  if (!subject || subject.trim().length < 3)
    errors.push('Mavzu kamida 3 ta harf bo\'lishi kerak.');
  if (!message || message.trim().length < 10)
    errors.push('Xabar kamida 10 ta harf bo\'lishi kerak.');
  return errors;
}

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate
  const errors = validate({ name, email, subject, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Configure transporter
  // Gmail uchun: App Password ishlatish kerak (2FA yoqilgan bo'lsa)
  // Boshqa SMTP uchun host/port ni o'zgartiring
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true = 465, false = 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    subject: `[Aloqa formasi] ${subject}`,
    text: `Ism: ${name}\nEmail: ${email}\n\nXabar:\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#333">Yangi xabar</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;color:#666;width:80px"><b>Ism:</b></td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;color:#666"><b>Email:</b></td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;color:#666"><b>Mavzu:</b></td><td style="padding:8px">${subject}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee">
        <p style="color:#333;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Xabar muvaffaqiyatli yuborildi.' });
  } catch (err) {
    console.error('Email yuborishda xatolik:', err);
    return res.status(500).json({ success: false, errors: ['Server xatosi. Keyinroq urinib ko\'ring.'] });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
