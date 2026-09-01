import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('[athar] SMTP غير مُعدّ — لن يتم إرسال بريد إلكتروني فعليًا. راجعي functions/.env')
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return transporter
}

export async function sendEmail(to: string, subject: string, html: string) {
  const t = getTransporter()
  if (!t) return
  const from = process.env.SMTP_FROM ?? 'أَثَر <no-reply@example.com>'
  await t.sendMail({
    from,
    to,
    subject,
    html: `<div dir="rtl" lang="ar" style="font-family: Tahoma, Arial, sans-serif; font-size: 15px; line-height: 1.8; color:#241F19;">${html}</div>`,
  })
}
