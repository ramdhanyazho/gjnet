# GJnet WiFi System — Vercel Final Version

## Struktur
- `api/` → Backend API Routes (Vercel)
- `src/db.js` → Koneksi Couchbase Capella
- `frontend/` → Frontend (static, bisa deploy ke GitHub Pages)

## Deploy ke Vercel
1. Push repo ini ke GitHub.
2. Import repo ke Vercel, pilih framework **Other**, root directory biarkan default (repo root).
3. Tambahkan Environment Variables di dashboard Vercel:

- JWT_SECRET
- CAPELLA_CONNSTR
- CAPELLA_USER
- CAPELLA_PASS
- CAPELLA_BUCKET

4. Deploy → akses endpoint:
- POST /api/login
- GET /api/customers
- POST /api/customers
- POST /api/payments

## Frontend
Edit `frontend/settings.js` dan ganti `your-project` dengan nama project di Vercel.
