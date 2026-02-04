# Production Environment Variables Reference

## Backend Environment Variables (Set on Render)

Copy-paste this format into Render Dashboard → Environment Variables

```
DEBUG=False
SECRET_KEY=django-insecure-GENERATE-NEW-LONG-RANDOM-STRING-HERE-AT-LEAST-50-CHARS
DJANGO_ALLOWED_HOSTS=*.onrender.com,localhost,127.0.0.1
CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
CLERK_JWT_SECRET_KEY=YOUR_CLERK_SECRET_KEY_FROM_DASHBOARD
ALLOWED_HOSTS=*.onrender.com,localhost
DATABASE_URL=postgresql://username:password@host:5432/databasename
CORS_ALLOWED_ORIGINS=https://playto-app.vercel.app,http://localhost:3000,http://localhost:5173
```

## Frontend Environment Variables (Set on Vercel)

Copy-paste into Vercel Dashboard → Settings → Environment Variables

```
VITE_API_URL=https://playto-api.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
```

---

## How to Generate Each Value

### SECRET_KEY (Django)
Run this locally:
```bash
cd backend
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and paste as SECRET_KEY.

### CLERK_JWT_SECRET_KEY
1. Go to https://dashboard.clerk.com
2. Select your PLAYTO application
3. Go to "API Keys"
4. Copy the "Secret Key" value
5. Paste as CLERK_JWT_SECRET_KEY

### DATABASE_URL
1. Go to Render Dashboard
2. Create PostgreSQL database first
3. Internal Database URL will be shown
4. Copy full URL (it looks like: `postgresql://user:pass@host:5432/db`)

### CORS_ALLOWED_ORIGINS
Replace with your actual Vercel domain after deployment:
- Example: `https://playto-app.vercel.app`
- Or use wildcard for subdomains: `https://*.vercel.app`

---

## Verification Checklist

After setting environment variables:

- [ ] Backend can be accessed at `https://playto-api.onrender.com/api/`
- [ ] Health check returns 200 OK
- [ ] Database migrations ran (check Render logs)
- [ ] Frontend can be accessed at Vercel domain
- [ ] Frontend can reach backend API
- [ ] Demo posts load
- [ ] Sign in button works
- [ ] Can like posts after signing in

---

## If Something Goes Wrong

1. **Backend 502 error:**
   - Check all environment variables are set
   - Check Procfile has correct content
   - View logs on Render

2. **Frontend can't reach API:**
   - Update VITE_API_URL
   - Redeploy frontend
   - Check CORS settings on backend

3. **Database won't connect:**
   - Verify DATABASE_URL format
   - Make sure PostgreSQL database is created
   - Check credentials are correct

4. **Clerk authentication fails:**
   - Verify CLERK_JWT_SECRET_KEY is correct
   - Check Clerk dashboard has your domain whitelisted
   - Add Vercel domain to Clerk redirect URIs

---

## Keeping Secrets Secret

**DO NOT** commit these files to GitHub:
- `.env` (local development)
- `.env.local` (local frontend)
- Anything with credentials

**DO use** platform dashboards:
- Render Environment Variables
- Vercel Environment Variables

This way credentials never appear in your code repository.
