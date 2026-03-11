import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  }),
)
app.use(express.json())

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const smtpPort = Number(process.env.SMTP_PORT) || 587
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
})

function sendQuoteEmailSendGrid({ to, fromAddress, subject, text }) {
  if (!process.env.SENDGRID_API_KEY) {
    return Promise.reject(new Error('SENDGRID_API_KEY is not set'))
  }

  // SendGrid requires the "from" email to be a verified Sender/Domain.
  const fromEmail =
    process.env.SENDGRID_FROM_EMAIL ||
    process.env.QUOTE_FROM_EMAIL ||
    process.env.SMTP_USER

  const fromName =
    process.env.SENDGRID_FROM_NAME || 'Rosewood Investigation Quote Form'

  const from = fromAddress || (fromEmail ? { email: fromEmail, name: fromName } : undefined)

  if (!from) {
    return Promise.reject(
      new Error(
        'SendGrid requires a verified From address. Set SENDGRID_FROM_EMAIL or QUOTE_FROM_EMAIL.',
      ),
    )
  }

  return sgMail.send({ to, from, subject, text })
}

app.post('/api/quote', async (req, res) => {
  const { name, email, phone, details } = req.body || {}

  if (!name || !email || !phone || !details) {
    return res.status(400).json({
      ok: false,
      message: 'Please complete all required fields.',
    })
  }

  const to = process.env.QUOTE_TO_EMAIL || process.env.SMTP_USER
  const fromAddress = process.env.QUOTE_FROM_EMAIL || process.env.SMTP_USER
  const subject = `New quote enquiry from ${name}`
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Details:',
    details,
  ].join('\n')

  // Respond immediately so nginx never hits 504; send email in background
  res.json({ ok: true })

  if (process.env.SENDGRID_API_KEY) {
    sendQuoteEmailSendGrid({ to, fromAddress, subject, text }).catch((err) => {
      console.error('Error sending quote email (SendGrid, background):', err)
    })
    return
  }

  transporter
    .sendMail({
      from: `Rosewood Investigation Quote Form <${fromAddress}>`,
      to,
      subject,
      text,
    })
    .catch((err) => {
      console.error('Error sending quote email (background):', err)
    })
})

const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

