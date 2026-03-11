# Rosewood Investigations – Landing Page

Landing page for Rosewood Investigations: hero, quote forms, about, 3 steps, services, FAQ accordion, and contact. Built with React, Vite, Tailwind CSS, and a Node/Express backend for sending quote requests via email.

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Email:** Nodemailer (SMTP)  
- **Analytics:** Google Analytics 4 (GA4)

## Prerequisites

- Node.js 18+  
- npm (or pnpm/yarn)

## Local development

### 1. Clone and install

```bash
git clone https://github.com/Naseef-Nusky/rosewood-investigations-landing-latest.git
cd rosewood-investigations-landing-latest
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (same folder as `package.json`):

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173

# SMTP (e.g. Gmail for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password

QUOTE_TO_EMAIL=private@rosewoodinvestigations.net
QUOTE_FROM_EMAIL=private@rosewoodinvestigations.net
```

| Variable           | Description                                      |
|--------------------|--------------------------------------------------|
| `PORT`             | Backend port (default 3000)                      |
| `CORS_ORIGIN`      | Allowed origin (e.g. `http://localhost:5173`)   |
| `SMTP_HOST`        | SMTP server (e.g. `smtp.gmail.com`)              |
| `SMTP_PORT`        | 587 (TLS) or 465 (SSL)                           |
| `SMTP_USER`        | SMTP login (usually full email)                 |
| `SMTP_PASS`        | SMTP password or app password                    |
| `QUOTE_TO_EMAIL`   | Where quote form submissions are sent            |
| `QUOTE_FROM_EMAIL` | Sender address shown in emails                   |
| `SENDGRID_API_KEY` | (Optional) SendGrid API key (HTTPS). If set, quote emails are sent via SendGrid instead of SMTP. Recommended on droplets when SMTP times out. |
| `SENDGRID_FROM_EMAIL` | (Optional) Verified sender email in SendGrid. If set, used as the From address when sending via SendGrid. |

Do not commit `.env`; it is listed in `.gitignore`.

### 3. Run locally

Use two terminals:

**Terminal 1 – backend (API + email):**

```bash
npm run server
```

**Terminal 2 – frontend (Vite dev server):**

```bash
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api/quote` to the backend on port 3000.

## Production build

```bash
npm run build
npm run server
```

The server serves the built app from the `dist` folder at `http://localhost:3000`.

## Deploy to DigitalOcean (droplet)

1. **SSH into the droplet:**  
   `ssh root@YOUR_DROPLET_IP`

2. **Install Node, Git, Nginx, PM2:**

   ```bash
   apt update && apt install -y curl git nginx
   curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
   apt install -y nodejs
   npm install -g pm2
   ```

3. **Clone, install, build:**

   ```bash
   cd /var && mkdir -p www && cd www
   git clone https://github.com/Naseef-Nusky/rosewood-investigations-landing-latest.git
   cd rosewood-investigations-landing-latest
   npm install
   npm run build
   ```

4. **Create `.env`** on the droplet with production values (same variables as above; set `CORS_ORIGIN` to `https://yourdomain.com`).

5. **Start with PM2:**

   ```bash
   pm2 start server.js --name rosewood-landing
   pm2 save && pm2 startup
   ```

6. **Configure Nginx** – copy the included config and enable it:

   ```bash
   cp nginx-rosewood.conf /etc/nginx/sites-available/rosewood-landing
   ln -s /etc/nginx/sites-available/rosewood-landing /etc/nginx/sites-enabled/
   rm -f /etc/nginx/sites-enabled/default
   nginx -t && systemctl reload nginx
   ```

   Then enable HTTPS:

   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d rosewoodinvestigations.net -d www.rosewoodinvestigations.net
   ```

7. **Point DNS** – A records for `rosewoodinvestigations.net` and `www.rosewoodinvestigations.net` to the droplet IP.

### Updating after code changes

```bash
cd /var/www/rosewood-investigations-landing-latest
git pull origin master
npm install
npm run build
pm2 restart rosewood-landing
```

## Google Analytics

The site uses GA4 with Measurement ID `G-D9LESVVV3F`. Quote form submissions are tracked with:

- Custom event: `quote_form_sent`
- GA4 lead event: `generate_lead`

Update the Measurement ID in `index.html` if you use a different GA4 property.

## Repository

[https://github.com/Naseef-Nusky/rosewood-investigations-landing-latest](https://github.com/Naseef-Nusky/rosewood-investigations-landing-latest)
