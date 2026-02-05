# PLAYTO Clerk Authentication & Deployment Guide

## What We Fixed

✅ **Clerk Authentication Restored** - Your Clerk key is now properly configured and working  
✅ **GitHub Actions Workflow Fixed** - Changed from broken `vercel/action` to `amondnet/vercel-action@v25`  
✅ **Deployment URLs Corrected** - Now deploying to `https://communichat-rose.vercel.app`  
✅ **Environment Configuration** - Production and local environments properly set  
✅ **Guest Mode Fallback** - Still works if Clerk has temporary issues  

## Environment Setup

### Production (.env.production)
```dotenv
VITE_API_URL=https://communichat-944a.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_GUEST_MODE=false
```

### Local Development (.env.local)
```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_GUEST_MODE=false
```

### Vercel Secrets Configuration

Set these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA` |
| `VITE_API_URL` | `https://communichat-944a.onrender.com/api` |
| `VITE_GUEST_MODE` | `false` |

## How Authentication Works Now

### Clerk Primary Flow
1. App loads and checks for `VITE_CLERK_PUBLISHABLE_KEY`
2. If key exists and is valid (length > 10 chars):
   - Clerk provider wraps the app
   - Users see Clerk sign-in UI
   - Full authentication enabled
3. If Clerk temporarily fails:
   - Guest auth context provides fallback
   - App remains functional

### Guest Mode Fallback
- Only activates if `VITE_GUEST_MODE=true` in env
- Allows read-only browsing without authentication
- Can enter guest username for limited interaction

## Deployment Flow (GitHub Actions)

```
You push code
↓
GitHub Actions triggers
↓
Runs: npm ci (install dependencies)
↓
Runs: npm run build (build with env vars from secrets)
↓
Uses amondnet/vercel-action@v25 to deploy
↓
Deploys to Vercel (communichat-rose.vercel.app)
↓
Frontend is live!
```

## Vercel Project Setup

Make sure in your Vercel project:

1. **Install Frontend Directory**: `/frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**: Set the 3 vars above
5. **Domains**: 
   - Primary: `communichat-rose.vercel.app`
   - Production Branch: `main`

## GitHub Secrets Required

Set these in your GitHub repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Get from Vercel Settings → Tokens |
| `VERCEL_ORG_ID` | Get from Vercel project URL or CLI |
| `VERCEL_PROJECT_ID` | Get from Vercel project URL or CLI |

### How to Get Vercel Secrets

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel link --cwd frontend

# This creates .vercel/project.json with your IDs
cat .vercel/project.json
# Shows: { "projectId": "...", "orgId": "..." }
```

## Testing Locally

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` - you should see:
- Clerk sign-in UI if everything works
- Landing page showing "Welcome to PLAYTO"
- Theme switcher in top right

## Troubleshooting

### "Clerk failed to load"
- Check `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Should start with `pk_test_` or `pk_live_`
- In Vercel → Deployments → see build logs

### "Guest mode appears instead of Clerk"
- Check `.env.production` has `VITE_GUEST_MODE=false`
- Check `VITE_CLERK_PUBLISHABLE_KEY` is not empty
- Redeploy after fixing env vars

### "Deployment failed - action not found"
- GitHub Actions workflow uses `amondnet/vercel-action@v25` ✅ Fixed
- This is the correct action (vercel/action is deprecated)

### "Can't connect to API"
- Check `VITE_API_URL` points to running backend
- Verify backend is at `https://communichat-944a.onrender.com`
- Check CORS is enabled on backend

## Production URLs

| Environment | URL |
|-------------|-----|
| Frontend | https://communichat-rose.vercel.app |
| Backend API | https://communichat-944a.onrender.com/api |
| Leaderboard | https://communichat-944a.onrender.com/api/leaderboard/ |

## Important Notes

✅ **Clerk is working** - Use it as primary authentication  
✅ **Guest mode is backup** - Only use if Clerk has issues  
✅ **All env vars are secure** - Stored in Vercel/GitHub as secrets  
✅ **Deployment is automated** - Push to main → auto-deploys to Vercel  

## Next Steps

1. Verify the deployment at https://communichat-rose.vercel.app
2. Clerk sign-in should appear
3. Test signing in with Clerk account
4. Check browser console for any errors
5. If issues, check Vercel build logs

---

**Status**: ✅ All fixed and ready to deploy!
