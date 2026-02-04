# Dev environment setup

1) Supabase
  - Project URL: https://nmsjudwlmyvniagxmpdv.supabase.co
  - Publishable (anon) key: sb_publishable_EqgteCfsu_Nxe2kT3cMfXw_kg98gHOc
  - Database connection (fill password): postgresql://postgres:REPLACE_WITH_DB_PASSWORD@db.nmsjudwlmyvniagxmpdv.supabase.co:5432/postgres

2) Clerk (you must copy values from your Clerk Dashboard)
  - Where to find values:
    - Sign in at https://clerk.com → select your application → go to **API keys** (or **Settings**).
    - The JWT issuer will look like: `https://<your-instance>.clerk.accounts.dev` — this is your `CLERK_JWT_ISSUER`.
    - The JWKS URL is the issuer with `/.well-known/jwks.json` appended. You can set `CLERK_JWT_KEY` to that JWKS URL if you prefer network verification.
    - Copy the **Publishable key** into `VITE_CLERK_PUBLISHABLE_KEY` for the frontend.
    - Copy the **Secret key** (if present) into `CLERK_SECRET_KEY` for server-side SDKs.
    - IMPORTANT: I did not receive your Clerk publishable/secret keys or your Supabase DB password from the earlier paste. I populated the repo env files with the Supabase project URL and anon key you provided, but the following values are still missing and must be set before JWT verification and DB access will work:
      - Supabase DB password (replace `[YOUR-PASSWORD]` in `DATABASE_URL`)
      - `VITE_CLERK_PUBLISHABLE_KEY` (frontend)
      - `CLERK_JWT_ISSUER` (backend)
      - `CLERK_JWT_KEY` or JWKS URL, or `CLERK_SECRET_KEY` (backend)

    - If you prefer, paste those values here and I will inject them into `backend/.env` and `frontend/.env.local` and run quick verification steps.

3) How to apply
  - Copy `.env.example` to `backend/.env` and `frontend/.env.local` (or create `.env` at project root) and replace `REPLACE_WITH_...` values.

4) Quick verification
  - Backend: start Django (or run a short script) and ensure `DATABASE_URL` parses and `CLERK_JWT_ISSUER` is set.
  - Frontend: run the Vite dev server; `VITE_CLERK_PUBLISHABLE_KEY` should be accessible as `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`.

5) Notes about the Clerk issuer
  - The `iss` (issuer) claim in Clerk tokens equals the JWT issuer above. Use that value when verifying tokens (validate `iss` and `aud`).
  - If unsure, fetch the JWKS at `https://<your-instance>.clerk.accounts.dev/.well-known/jwks.json` and inspect keys.
