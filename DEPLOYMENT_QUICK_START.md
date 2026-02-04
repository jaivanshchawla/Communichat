# PLAYTO Deployment - Quick Start Checklist

## ✅ Files Created for Deployment

- [x] `backend/Procfile` - Deployment command for Render
- [x] `backend/runtime.txt` - Python version
- [x] `frontend/vercel.json` - Vercel configuration
- [x] `frontend/.env.production` - Production environment variables
- [x] `DEPLOYMENT_GUIDE.md` - Complete deployment guide

## 🚀 Quick Deployment Steps

### STEP 1: Push to GitHub (5 minutes)
```bash
# If not already a git repo
git init
git add .
git commit -m "PLAYTO ready for production"
git branch -M main
git remote add origin https://github.com/yourusername/playto.git
git push -u origin main
```

### STEP 2: Deploy Backend to Render (10-15 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Fill in:
   - **Name:** `playto-api`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT`
6. Click "Create Web Service"
7. **Copy your Render URL** (e.g., `https://playto-api.onrender.com`)
8. Go to "Settings" → "Environment" → add these variables:

```
DEBUG=False
SECRET_KEY=django-insecure-generate-a-very-long-random-string-here-minimum-50-chars
CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
CLERK_JWT_SECRET_KEY=copy-from-your-clerk-dashboard
ALLOWED_HOSTS=*.onrender.com,localhost
DATABASE_URL=postgresql://... (we'll create this next)
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

9. Create PostgreSQL database on Render:
   - Click "New" → "PostgreSQL"
   - Copy the connection string to `DATABASE_URL` above

### STEP 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select your PLAYTO repository
5. Configure:
   - **Framework:** Vite (or auto-detect)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"
7. Go to "Settings" → "Environment Variables" → add:

```
VITE_API_URL=https://playto-api.onrender.com/api (your Render URL)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
```

8. Click "Redeploy"

### STEP 4: Test Everything (5 minutes)

1. Visit your Vercel URL
2. See demo posts load ✅
3. Click "Sign In"
4. Sign in with Clerk test account
5. Like a post
6. Create a new post
7. All working? 🎉

---

## 📝 Important Notes

- **First Render deployment:** Takes 10-15 min (builds Python dependencies)
- **Subsequent Render deploys:** 2-3 min
- **Vercel deployment:** Usually instant, builds happen in background
- **Database:** Migrations run automatically via Procfile `release` command
- **Frontend:** Auto-deploys when you push to GitHub

---

## 🔑 Where to Find Keys

### Clerk Keys
1. Go to https://dashboard.clerk.com
2. Select your application
3. API Keys → Copy "Publishable key" and "Secret key"

### Django Secret Key (generate new)
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### PostgreSQL Connection String (from Render)
- Created database → Internal Database URL (copy this to DATABASE_URL)

---

## 🔗 Useful Links

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Clerk Docs: https://clerk.com/docs

---

## ⚠️ Common Issues & Fixes

**"502 Bad Gateway" on Render**
- Check Procfile is correct
- Check environment variables
- View logs: Render Dashboard → Logs

**Frontend can't reach backend**
- Update `VITE_API_URL` in Vercel environment
- Redeploy frontend after changing
- Check CORS_ALLOWED_ORIGINS on backend

**Database connection fails**
- Copy exact DATABASE_URL from Render
- Make sure it's set as environment variable
- Wait 30 seconds after creating database

**"Module not found" on Render**
- Check `requirements.txt` has all packages
- Run `pip install -r requirements.txt` locally to verify

---

## 📊 After Deployment

### Monitor Performance
- Render: Dashboard → Metrics
- Vercel: Analytics → Web Vitals

### View Logs
- Render: Services → Logs
- Vercel: Deployments → Details

### CI/CD Automation
- Auto-deploy on GitHub push
- Auto-run tests (optional)
- Automatic rollback if deploy fails

---

**Questions? Check DEPLOYMENT_GUIDE.md for detailed instructions!**

Total deployment time: ~30-45 minutes
Status: Ready to deploy! 🚀
