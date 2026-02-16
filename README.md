# LiveNote Domain Homepage (`lvnt.my`)

This repository now supports two modes:
- `docs/` GitHub Pages static site (recommended for update/news page)
- Node/Express web service (optional; existing files kept)

## GitHub Pages (recommended)

1. GitHub repo `Settings` -> `Pages`
2. `Build and deployment` -> `Deploy from a branch`
3. Branch: `main`, Folder: `/docs`
4. Save

After deployment:
- Site URL: `https://dev-mjkoo.github.io/livenote_server/`
- Custom domain: set `lvnt.my` in Pages settings
- `docs/CNAME` already includes `lvnt.my`

Update content files:
- `docs/updates.json` (공지 목록)
- `docs/app.js` -> `QUESTION_FORM_URL` (문의 폼 URL)

## 1) Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## 2) Deploy (example: Render / Railway / Fly.io)

Set service settings:
- Build command: `npm install`
- Start command: `npm start`
- Port: use `PORT` env (already supported in `server.js`)

## 3) Connect domain `lvnt.my`

In your DNS provider:
- Create `A` record for root (`@`) to your server IP
- Create `CNAME` for `www` to your service host (if your host requires it)

In hosting provider:
- Add custom domain: `lvnt.my`
- Add secondary domain: `www.lvnt.my` (optional)
- Enable TLS/SSL certificate

## 4) Connect from LiveNote app message button

Set the message button URL to:
- `https://lvnt.my`

If you want a specific path:
- `https://lvnt.my/ask`

(Current server routes all unknown paths to homepage, so `/ask` works too.)

## 5) Update notices

Edit:
- `data/updates.json`

Example item:
```json
{
  "date": "2026-02-16",
  "text": "Released new meeting summary feature."
}
```

## 6) View received questions

Messages are stored in:
- `data/messages.json`

You can later move this to a database (Supabase, Postgres, etc.) without changing the frontend form.
