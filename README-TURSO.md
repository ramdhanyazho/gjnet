# gjnet-next-turso-full

Project migrated to use Turso (SQLite) with @libsql/client.
DB name you wanted: wifi-system (use this name in Turso dashboard).

## Setup
1. Copy `.env.example` to `.env.local` and fill TURSO_DATABASE_URL and TURSO_AUTH_TOKEN and JWT_SECRET.
2. Install dependencies: `npm install`
3. Apply schema: `turso db execute <your-db-name> --file schema.sql` (or run SQL from dashboard)
4. Run dev: `npm run dev`
5. Open http://localhost:3000/login

## Endpoints
- POST /api/users/register
- POST /api/users/login
- GET /api/users
- GET/POST /api/customers
- PUT/DELETE /api/customers/:id
- GET/POST /api/payments
- PUT/DELETE /api/payments/:id

Note: This repo replaces Couchbase usage with Turso; verify any other custom Couchbase code in your original repo and adjust if necessary.
