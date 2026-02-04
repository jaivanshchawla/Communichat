# PLAYTO Community Feed - Deployment Guide

## 🚀 Deployment Overview

- **Frontend:** Vercel (React + Vite)
- **Backend:** Render (Django REST API)
- **Database:** PostgreSQL on Render or Supabase
- **Authentication:** Clerk (already configured)

---

## PART 1: BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Backend for Production

#### 1.1 Update Settings for Production

Create a new file `backend/playto_config/settings_production.py` or update `settings.py`:

**Key changes needed in settings.py:**
```python
DEBUG = os.getenv('DEBUG', 'False') == 'True'  # Set to False in production
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
```

Make sure `ALLOWED_HOSTS` includes your Render domain.

#### 1.2 Create `runtime.txt` in backend folder

```
python-3.12.1
```

#### 1.3 Create `Procfile` in backend folder

```
web: gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate
```

#### 1.4 Update `requirements.txt`

Make sure these are included (they should be):
```
Django==5.0.3
djangorestframework==3.15.1
gunicorn==21.2.0
psycopg2-binary==2.9.9
python-dotenv==1.0.1
PyJWT==2.8.0
django-cors-headers==4.3.1
dj-database-url==2.1.0
requests==2.31.0
```

Run this to make sure:
```bash
cd backend
pip install -r requirements.txt
```

#### 1.5 Create `.env` for Production (keep it secret!)

You'll need to set environment variables on Render's dashboard, NOT in a file.

### Step 2: Deploy to Render

#### 2.1 Sign up on Render
Go to https://render.com and create a free account

#### 2.2 Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - **Name:** `playto-api` (or your choice)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Root Directory:** `backend`

#### 2.3 Set Environment Variables
Go to Service Settings → Environment:

```
DEBUG=False
SECRET_KEY=your-django-secret-key-here
CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
CLERK_JWT_SECRET_KEY=your-clerk-secret-key
ALLOWED_HOSTS=*.onrender.com,localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:3000,http://localhost:5173
```

#### 2.4 Create PostgreSQL Database (on Render)

1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Fill in details and create
4. Copy the Database URL and paste it as `DATABASE_URL` in web service environment

#### 2.5 Deploy
- Click "Deploy"
- Wait for build to complete
- You'll get a URL like `https://playto-api.onrender.com`

**Note:** First deployment takes 5-10 minutes. Subsequent deployments are faster.

#### 2.6 Test Backend
```bash
curl https://playto-api.onrender.com/api/
# Should return health check response
```

---

## PART 2: FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend

#### 1.1 Update API URL Configuration

Update `frontend/.env.production`:
```
VITE_API_URL=https://playto-api.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
```

#### 1.2 Create `vercel.json` in frontend folder

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_CLERK_PUBLISHABLE_KEY": "@vite_clerk_key"
  }
}
```

#### 1.3 Make sure `package.json` has build script

Check that it exists:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

#### 2.1 Sign up on Vercel
Go to https://vercel.com and create account (can use GitHub)

#### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Choose `frontend` as root directory
4. Click "Deploy"

#### 2.3 Set Environment Variables
After import, go to Settings → Environment Variables:

```
VITE_API_URL: https://playto-api.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY: pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
```

#### 2.4 Deploy
- Vercel will auto-deploy after you push to main branch
- Or click "Deploy" button manually

**Deployment takes 2-3 minutes**

#### 2.5 Test Frontend
Visit your Vercel domain (e.g., `https://playto-app.vercel.app`)

---

## STEP-BY-STEP CHECKLIST

### Before Deployment
- [ ] Backend: `Procfile` created
- [ ] Backend: `runtime.txt` created (python-3.12.1)
- [ ] Backend: `requirements.txt` updated
- [ ] Backend: `settings.py` has production config
- [ ] Frontend: `vercel.json` created
- [ ] Frontend: `package.json` has build script
- [ ] Frontend: `.env.production` created with correct API URL
- [ ] Clerk: Verify JWKS endpoint is accessible

### Render Setup
- [ ] Create Render account
- [ ] Create PostgreSQL database
- [ ] Create Web Service for backend
- [ ] Set all environment variables
- [ ] Database migrations run automatically via Procfile
- [ ] Backend URL is working

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set frontend root directory to `frontend`
- [ ] Set environment variables
- [ ] Auto-deploy enabled on push to main
- [ ] Frontend URL is working

### Final Testing
- [ ] Visit frontend URL
- [ ] API health check passes
- [ ] Can see demo posts
- [ ] Sign in works with Clerk
- [ ] Can like posts (after signin)
- [ ] Can create posts (after signin)

---

## PRODUCTION ENVIRONMENT VARIABLES

### Backend (.env on Render)
```
DEBUG=False
SECRET_KEY=generate-a-new-long-random-string
DJANGO_ALLOWED_HOSTS=playto-api.onrender.com,localhost
CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
CLERK_JWT_SECRET_KEY=your-actual-secret-key
ALLOWED_HOSTS=*.onrender.com,localhost
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ALLOWED_ORIGINS=https://yourdomain.vercel.app,http://localhost:3000,http://localhost:5173
```

### Frontend (.env.production on Vercel)
```
VITE_API_URL=https://your-render-domain.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## TROUBLESHOOTING

### Backend Issues

**502 Bad Gateway**
- Check Procfile is correct
- Check environment variables are set
- Check logs on Render dashboard

**Database connection error**
- Verify DATABASE_URL format
- Make sure database is created
- Check credentials are correct

**CORS errors in frontend**
- Update CORS_ALLOWED_ORIGINS with your Vercel domain
- Restart web service

**Migration errors**
- Check Procfile release command
- Check database is accessible
- Run migrations manually via Render shell

### Frontend Issues

**API URL not working**
- Check VITE_API_URL environment variable
- Make sure backend is deployed
- Check CORS settings on backend

**Clerk authentication not working**
- Verify VITE_CLERK_PUBLISHABLE_KEY is correct
- Check Clerk dashboard has correct domains
- Clear browser cache and cookies

**Build fails**
- Check `npm run build` works locally
- Verify Node version is compatible
- Check all dependencies in package.json

---

## ALTERNATIVE DEPLOYMENT OPTIONS

### Backend Alternatives to Render
- **Railway.app** - Simple, pay-as-you-go
- **Heroku** - Traditional choice, free tier removed
- **PythonAnywhere** - Python-specific hosting
- **DigitalOcean** - More control, reasonable pricing
- **AWS Lightsail** - Scalable, but more complex

### Frontend Alternatives to Vercel
- **Netlify** - Very similar to Vercel
- **GitHub Pages** - Free but static only
- **Cloudflare Pages** - Fast, good for SPAs
- **AWS Amplify** - AWS ecosystem

---

## PERFORMANCE TIPS

### Backend
- Enable caching headers
- Use CDN for static files (though we don't have many)
- Monitor database performance
- Set up proper logging

### Frontend
- Images are optimized by Vite
- Vercel handles CDN automatically
- Monitor Core Web Vitals in Vercel dashboard
- Enable incremental static regeneration if needed

---

## COST ESTIMATES (Monthly)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Render Backend | $7 | $12-100+ |
| Render PostgreSQL | $15/month | $15-100+ |
| Vercel Frontend | Free | $20+ |
| Clerk Auth | Free up to 10k users | Usage-based |
| **Total** | ~$22 | ~$50-250 |

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Set up monitoring**
   - Enable error tracking (Sentry)
   - Monitor database performance

2. **CI/CD Pipeline**
   - Auto-tests on pull requests
   - Automated deployments on merge

3. **Analytics**
   - Add Google Analytics
   - Track user behavior

4. **Backup & Recovery**
   - Database automated backups
   - Disaster recovery plan

5. **Scaling**
   - Monitor usage
   - Upgrade resources as needed

---

## USEFUL COMMANDS

### Local Testing Before Deployment
```bash
# Test build
cd frontend
npm run build

# Serve production build locally
npm run preview

# Backend production test
cd backend
DEBUG=False python manage.py runserver
```

### Render Commands (via Shell)
```bash
# Connect to Render shell
# Via Render Dashboard → Services → Shell

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Check logs
# Via Render Dashboard → Logs
```

### Vercel Commands
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from command line
vercel --prod

# Preview deployment
vercel
```

---

**Your PLAYTO app is ready to go live! 🚀**

Questions? Check the specific platform's documentation or reach out to support.
