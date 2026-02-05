# 🚀 Deployment Guide - PLAYTO

## Current Status
✅ **All changes pushed to GitHub**

---

## 📋 Deployment Options

### Option 1: Automatic Deployment (Recommended)

#### Frontend - Vercel
If you have Vercel connected to GitHub:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your PLAYTO project
3. Ensure **GitHub Auto Deploy** is enabled
4. Changes should automatically deploy when pushed to main
5. Watch the deployment progress
6. Access your live site once deployment completes

#### Backend - Render
If you have Render connected to GitHub:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your PLAYTO API service
3. Ensure **Auto-Deploy from Git** is enabled
4. Trigger deployment manually if needed
5. Watch logs for build progress
6. Service restarts automatically

---

### Option 2: Manual Deployment

#### Frontend - Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel --prod
```

#### Backend - Render CLI
Currently, Render deploys via Git push. To force a redeploy:
1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" button
4. Choose "Redeploy Latest Commit"

Or manually trigger via Git:
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [x] All changes committed to git
- [x] Code pushed to GitHub main branch
- [x] Environment variables configured in services
- [x] Database migrations ready (Django)
- [x] Build configuration files present

### Frontend (Vercel)
- [ ] Vercel project connected to GitHub
- [ ] Build command configured: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables set:
  - `VITE_API_URL`: Your backend API URL
  - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk key
- [ ] Installation: `npm install`
- [ ] Auto-deploy enabled

### Backend (Render)
- [ ] Render service connected to GitHub
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT`
- [ ] Environment variables set:
  - `DEBUG`: `false` (production)
  - `ALLOWED_HOSTS`: Your domain
  - `SECRET_KEY`: Strong secret key
  - `CLERK_API_KEY`: Your Clerk API key
  - `DATABASE_URL`: PostgreSQL connection string (if using)
- [ ] Auto-deploy enabled

---

## 🔧 Environment Variables

### Frontend (.env or Vercel Settings)
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### Backend (.env or Render Settings)
```env
SECRET_KEY=your_django_secret_key
DEBUG=false
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost
CLERK_API_KEY=your_clerk_api_key
DATABASE_URL=postgresql://user:password@host/dbname
```

---

## 📍 Deployment URLs

Once deployed, you'll have:

**Frontend**: 
- Vercel URL (automatic): `https://your-project.vercel.app`
- Custom domain (optional): `https://your-domain.com`

**Backend**:
- Render URL (automatic): `https://your-backend.onrender.com`
- Custom domain (optional): `https://api.your-domain.com`

Update `VITE_API_URL` in frontend if using custom backend domain.

---

## 🔄 Post-Deployment Steps

### After Frontend Deployment
1. ✅ Verify app loads at your URL
2. ✅ Test theme switching
3. ✅ Test Clerk sign-in
4. ✅ Test API calls work
5. ✅ Check console for errors (F12)

### After Backend Deployment
1. ✅ Check logs for errors: `https://api-url/api/posts/`
2. ✅ Verify database connectivity
3. ✅ Run migrations: `python manage.py migrate`
4. ✅ Seed demo data: `python manage.py seed_demo_data`
5. ✅ Test API endpoints with Postman or browser

---

## 🐛 Troubleshooting

### Frontend Issues

**Blank page / 404**:
- Check build logs on Vercel
- Verify `VITE_API_URL` points to correct backend
- Clear browser cache

**API calls returning 404**:
- Check `VITE_API_URL` environment variable
- Ensure backend is up and running
- Check CORS settings on backend

**Theme switcher not working**:
- Check browser localStorage
- Clear cache and refresh
- Verify CSS is loading

### Backend Issues

**"Environment variable not found"**:
- Add missing variables to Render settings
- Restart service after adding variables
- Check variable names match code

**Database connection error**:
- Verify `DATABASE_URL` is correct
- Check PostgreSQL service is running
- Run: `python manage.py migrate`

**502 Bad Gateway**:
- Check application logs
- Verify gunicorn is running
- Restart service from Render dashboard

---

## 🚀 Quick Deploy Steps

### If Using GitHub Auto-Deploy (Easiest)

✅ **Frontend (Vercel)**:
1. Code already pushed ✓
2. Vercel auto-detects changes
3. Automatic build and deploy
4. Monitor at: Vercel Dashboard → Deployments

✅ **Backend (Render)**:
1. Code already pushed ✓
2. Render auto-detects changes
3. Automatic build and redeploy
4. Monitor at: Render Dashboard → Service Logs

**That's it!** Services should redeploy automatically.

---

## 📊 Deployment Monitoring

### Vercel Dashboard
- View deployments: https://vercel.com/dashboard
- Check build logs
- Monitor performance
- Review analytics

### Render Dashboard
- View deployments: https://dashboard.render.com
- Check service logs
- Monitor resource usage
- View error messages

---

## 📝 Rollback Instructions

If something goes wrong:

**From GitHub**:
```bash
git revert HEAD
git push origin main
```
Services will automatically redeploy with previous version.

**Manual Rollback**:
1. Go to Vercel/Render Dashboard
2. Find previous successful deployment
3. Click "Redeploy"
4. Confirm rollback

---

## ✨ What's Deployed

### New Features
- ✅ Modern minimalist UI design
- ✅ 30+ DaisyUI themes with theme switcher
- ✅ Enhanced PostCard styling
- ✅ Improved Leaderboard with medals
- ✅ Better CreatePost form
- ✅ Enhanced CommentThread nesting
- ✅ 8 demo users with rich content
- ✅ 10 demo posts with discussions
- ✅ 17 comments with nested replies
- ✅ Karma system (working)
- ✅ Clerk authentication (preserved)

---

## 🎯 Next Steps

1. **Monitor logs** after deployment
2. **Test functionality** on live site
3. **Verify theme switching** works
4. **Check leaderboard** displays correctly
5. **Test Clerk sign-in**
6. **Create test posts** and comments

---

## 📞 Support

If deployment fails:
1. Check GitHub Actions logs (for auto-deploy)
2. Review error logs on Vercel/Render dashboard
3. Verify environment variables are set
4. Check database connectivity
5. Review recent commits for issues

---

**Deployment Status**: Ready to Deploy ✅

All code changes are committed and pushed to GitHub. Services should automatically deploy if auto-deploy is enabled.

---

Last Updated: Feb 6, 2026
Generated after UI overhaul and demo data update
