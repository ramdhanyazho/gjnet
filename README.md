# GJnet WiFi System — Vercel Version

## Struktur
- `api/` → Backend API Routes (Vercel)
- `src/db.js` → Koneksi Couchbase Capella
- `frontend/` → Frontend (bisa deploy ke GitHub Pages atau Vercel)

## Deploy ke Vercel
1. Push repo ini ke GitHub.
2. Import repo ke Vercel.
3. Vercel otomatis detect `api/` sebagai serverless functions.

## Environment Variables (di Vercel Dashboard)
- JWT_SECRET (isi random panjang)
- CAPELLA_CONNSTR (couchbases://... dari Capella)
- CAPELLA_USER (username Capella)
- CAPELLA_PASS (password Capella)
- CAPELLA_BUCKET=wifi-system

## Endpoint
- POST /api/login
- GET /api/customers
- POST /api/customers
- POST /api/payments

## Frontend
- Edit `frontend/settings.js` isi API_BASE dengan URL Vercel misalnya:
  window.API_BASE = "https://your-project.vercel.app/api";
