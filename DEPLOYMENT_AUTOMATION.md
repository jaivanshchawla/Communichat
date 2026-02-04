# PLAYTO Community Feed - Full Deployment Guide

## Overview

This guide will help you deploy the PLAYTO Community Feed full-stack application to production using Vercel (frontend) and Render (backend).

**Estimated time: 30-45 minutes**

---

## Part 1: Prerequisites

### What You'll Need

1. **GitHub Account** - Already done! Repository at [jaivanshchawla/Communichat](https://github.com/jaivanshchawla/Communichat)
2. **Vercel Account** - Create at [vercel.com](https://vercel.com)
3. **Render Account** - Create at [render.com](https://render.com)
4. **Clerk Account** - Already configured (JWT auth)
5. **GitHub Personal Access Token** - For CI/CD (optional)

### Get Your Credentials

**Clerk (Already configured):**
- Publishable Key: (from Clerk dashboard)
- Secret Key: (from Clerk dashboard)

**GitHub Secrets** (for automation):
- Go to your repo > Settings > Secrets and variables > Actions
- Add the secrets listed in each section below

---

## Part 2: Backend Deployment (Render)

### Step 1: Create a Render Account & PostgreSQL Database

1. Go to [render.com](https://render.com) and sign up
2. Create a new PostgreSQL database:
   - Click "New +" > "PostgreSQL"
   - Name: `communichat-db`
   - Region: Choose closest to you
   - Wait for database to be created (5-10 minutes)
3. Copy the **Internal Database URL** (you'll need this)

### Step 2: Create a Web Service on Render

1. Click "New +" > "Web Service"
2. Connect your GitHub repository: `jaivanshchawla/Communichat`
3. Configure the service:
   - **Name**: `communichat-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: Free (or upgrade as needed)

### Step 3: Add Environment Variables

In the Render dashboard, go to your web service and add:

```
DEBUG = False
SECRET_KEY = <generate-a-new-django-secret-key>
DATABASE_URL = <your-postgres-internal-database-url>
CLERK_SECRET_KEY = <from-clerk-dashboard>
CORS_ALLOWED_ORIGINS = https://your-vercel-frontend-url.vercel.app
```

### Step 4: Deploy & Test

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Once live, test the API:
   ```bash
   curl https://communichat-backend.onrender.com/api/health/
   ```
   You should get: `{"status": "ok", "message": "PLAYTO Community Feed API", "version": "1.0"}`

### Step 5: Set Up GitHub Secrets (Optional - for CI/CD)

1. Go to your GitHub repo > Settings > Secrets > Actions
2. Add:
   - `RENDER_SERVICE_ID`: (from your Render web service URL)
   - `RENDER_API_KEY`: (create at https://dashboard.render.com/api-tokens)

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Authorize Vercel to access your GitHub repos

### Step 2: Create a New Project

1. Go to Vercel Dashboard
2. Click "Add New" > "Project"
3. Import your GitHub repository: `jaivanshchawla/Communichat`
4. Configure:
   - **Project Name**: `communichat`
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

In Vercel, go to Settings > Environment Variables and add:

**For Production:**
```
VITE_API_URL = https://communichat-backend.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY = <from-clerk-dashboard>
```

**For Preview & Development:**
```
VITE_API_URL = https://communichat-backend.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY = <from-clerk-dashboard>
```

### Step 4: Deploy

1. Vercel will automatically deploy when you add environment variables
2. Your frontend will be live at: `https://communichat.vercel.app`
3. Wait for deployment to complete

### Step 5: Test the App

1. Go to `https://communichat.vercel.app`
2. Sign in with Clerk
3. Create a new post
4. Verify it appears in the feed
5. Check browser console for any errors

### Step 6: Update Backend CORS (if needed)

If you see CORS errors, update the backend `CORS_ALLOWED_ORIGINS`:

```
CORS_ALLOWED_ORIGINS = https://communichat.vercel.app
```

---

## Part 4: Set Up Automatic Deployments (CI/CD)

### GitHub Actions Workflows

We've created two workflows that automatically deploy on push:

**For Frontend** (`.github/workflows/deploy-frontend.yml`):
- Triggers on push to `main` in `/frontend` folder
- Builds and deploys to Vercel automatically

**For Backend** (`.github/workflows/deploy-backend.yml`):
- Triggers on push to `main` in `/backend` folder
- Triggers Render redeployment

### To Enable CI/CD:

1. Add GitHub Secrets:
   ```
   VERCEL_TOKEN = <create at vercel.com/account/tokens>
   VERCEL_ORG_ID = <from vercel dashboard>
   VERCEL_PROJECT_ID = <from vercel dashboard>
   RENDER_SERVICE_ID = <from render dashboard>
   RENDER_API_KEY = <create at render.com/api-tokens>
   ```

2. Push to main:
   ```bash
   git add .
   git commit -m "Enable CI/CD deployment"
   git push origin main
   ```

3. Workflows will run automatically!

---

## Part 5: Production Checklist

- [ ] Backend deployed to Render
- [ ] PostgreSQL database created on Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both services
- [ ] API health check returns 200 OK
- [ ] Sign-in works with Clerk
- [ ] Can create and view posts
- [ ] CORS properly configured
- [ ] Domain/URL accessible publicly
- [ ] GitHub Actions workflows enabled (optional)

---

## Part 6: Monitoring & Maintenance

### Check Deployment Status

**Render Backend:**
- Dashboard: https://dashboard.render.com
- Logs: Click your service > Logs tab
- Health: Check `/api/health/` endpoint

**Vercel Frontend:**
- Dashboard: https://vercel.com/dashboard
- Logs: Click your project > Deployments > View Logs
- Analytics: Click your project > Analytics

### Common Issues & Solutions

**Issue**: Posts not loading
- **Solution**: Check API URL in environment variables
- Verify backend is running: `curl https://communichat-backend.onrender.com/api/posts/`

**Issue**: CORS errors in browser console
- **Solution**: Update backend `CORS_ALLOWED_ORIGINS` to include frontend URL

**Issue**: Sign-in not working
- **Solution**: Verify `VITE_CLERK_PUBLISHABLE_KEY` matches Clerk dashboard

**Issue**: Database connection error
- **Solution**: Check `DATABASE_URL` environment variable on Render

---

## Part 7: Database Management

### Accessing the PostgreSQL Database

On Render, you can use the internal connection string for Django migrations:

```bash
# Run migrations on Render (via release command in Procfile)
# Already configured in Procfile:
# release: python manage.py migrate
```

### Create a Backup

1. Go to Render Dashboard > Your Database
2. Click "Backups"
3. Create manual backup

### Restore from Backup

1. Click the backup > Restore
2. Confirm restoration

---

## Part 8: Scaling & Next Steps

### Upgrade Plans

- **Render**: Free tier good for testing; upgrade for production
- **Vercel**: Free tier includes 100GB bandwidth; upgrade for more

### Add More Features

1. Email notifications
2. Real-time updates (WebSockets)
3. File uploads
4. Search & filters
5. User profiles
6. Follow/unfollow system

### Performance Optimization

- Add Redis caching on Render
- Enable CDN on Vercel (automatic)
- Optimize images
- Add database indexes

---

## Support & Troubleshooting

### Key Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Django Docs](https://docs.djangoproject.com)
- [React Docs](https://react.dev)
- [Clerk Docs](https://clerk.com/docs)

### Get Help

1. Check the deployment logs
2. Review error messages in browser console
3. Verify environment variables
4. Test API endpoints manually
5. Check GitHub Actions workflow logs

---

**Congratulations! Your PLAYTO Community Feed is now in production!** 🚀

For automatic deployments and CI/CD, enable the GitHub Actions workflows by adding the required secrets.
