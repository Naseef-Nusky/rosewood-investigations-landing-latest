import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
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

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

app.post('/api/quote', async (req, res) => {
  const { name, email, phone, details, source } = req.body || {}

  if (!name || !email || !phone || !details) {
    return res.status(400).json({
      ok: false,
      message: 'Please complete all required fields.',
    })
  }

  try {
    const to = process.env.QUOTE_TO_EMAIL || process.env.SMTP_USER
    const from = process.env.QUOTE_FROM_EMAIL || process.env.SMTP_USER

    const subject = `New quote enquiry from ${name}`
    const text = [
      `Source: ${source || 'unknown'}`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      '',
      'Details:',
      details,
    ].join('\n')

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('Error sending quote email:', err)
    res
      .status(500)
      .json({ ok: false, message: 'Sorry, something went wrong sending your request.' })
  }
})

const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

