# 🔐 Clerk Configuration - Complete Setup

## ✅ What's Been Updated

### Backend Configuration
- ✅ `backend/.env` - Updated with Clerk URLs
  - `CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev`
  - `CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json`
  - `CLERK_SECRET_KEY=sk_test_quz0ULwTTvKZ0jwUIsGHhSV6EaN8vbgnyiEGzbQXTr`
  - `CLERK_INSTANCE_URL=https://epic-marlin-86.clerk.accounts.dev`
  - `CLERK_JWKS_URL=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json`

- ✅ `backend/api/auth.py` - Already configured for JWT verification
- ✅ `backend/playto_config/settings.py` - Already configured for Clerk

### Frontend Configuration
- ✅ `frontend/.env.local` - Ready for your real Clerk publishable key
- ✅ `frontend/.env.production` - Ready for GitHub Secrets override

---

## 🚨 CRITICAL: You Need Your Real Clerk Publishable Key

The key you provided (`pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA`) is **base64 encoded**.

**You need the RAW publishable key that looks like:**
```
pk_test_1f2e3d4c5b6a7980aAbBcCdDeEfFgGhHiIjJkKlMnOpPqQrStUvWxXyYzZ1a2b3c4d5e6f7g8h
```

### How to Get Your Real Publishable Key:

1. **Go to:** https://dashboard.clerk.com
2. **Log in** with your account
3. **Select your project:** epic-marlin-86 (or whatever your instance is)
4. **Go to:** Developers → API Keys
5. **Copy:** "Publishable Key" (NOT the Secret Key)
6. **It should:**
   - Start with `pk_test_` or `pk_live_`
   - Be 60-80+ characters long
   - Contain only alphanumeric characters and underscores
   - NOT be base64 encoded

**💾 Copy this key and save it securely**

---

## 📋 What You Need to Update

### 1️⃣ Update GitHub Secrets (MOST IMPORTANT)

**Go to:** https://github.com/jaivanshchawla/Communichat

1. Click **Settings** tab
2. Left sidebar: **Secrets and variables** → **Actions**
3. Update or create: `VITE_CLERK_PUBLISHABLE_KEY`
4. Paste your **REAL publishable key** from Step 1
5. Click **Update secret** / **Add secret**

**This is used by Vercel during build**

### 2️⃣ Update Render Environment Variables

**Go to:** https://dashboard.render.com

1. Select your **communichat-944a** backend service
2. Click **Environment**
3. Update/Add these variables:

```
CLERK_JWT_ISSUER=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWT_KEY=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
CLERK_SECRET_KEY=sk_test_quz0ULwTTvKZ0jwUIsGHhSV6EaN8vbgnyiEGzbQXTr
CLERK_INSTANCE_URL=https://epic-marlin-86.clerk.accounts.dev
CLERK_JWKS_URL=https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
```

4. Click **Save Changes** (auto-redeploys)

### 3️⃣ Update Vercel Environment Variables (Optional)

**Vercel gets these from GitHub Secrets automatically, but you can also set them directly:**

1. Go to: https://vercel.com/dashboard
2. Select **communichat-rose** project
3. Settings → **Environment Variables**
4. Add/Update:

```
VITE_API_URL=https://communichat-944a.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_REAL_KEY
VITE_CLERK_INSTANCE_URL=https://epic-marlin-86.clerk.accounts.dev
```

5. Click **Save** (auto-redeploys)

**Note:** GitHub Secrets take precedence, so you mainly need GitHub Secrets

### 4️⃣ Update Local Development

Edit `frontend/.env.local`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_REAL_KEY_HERE_60_PLUS_CHARS
VITE_CLERK_INSTANCE_URL=https://epic-marlin-86.clerk.accounts.dev
VITE_API_URL=http://localhost:8000/api
```

---

## 🧪 Testing After Updates

### Test Backend JWT Verification

```bash
cd backend

# Activate venv
source .venv/Scripts/Activate.ps1  # Windows PowerShell

# Test that Clerk URLs are configured
python manage.py shell
>>> from django.conf import settings
>>> print(settings.CLERK_JWT_ISSUER)
>>> print(settings.CLERK_JWT_KEY)
>>> print(settings.CLERK_SECRET_KEY)
# Should all print without errors
```

### Test Frontend Locally

```bash
cd frontend
npm run dev
# Visit http://localhost:5174
# Should show Clerk sign-in UI (not white screen)
```

### Test Production Deployment

After pushing to GitHub:

1. **Frontend:** Check Vercel deployment
   - Go to: https://vercel.com/dashboard
   - Check latest deployment status
   - Visit: https://communichat-rose.vercel.app
   - Should show Clerk sign-in (not errors)

2. **Backend:** Check Render deployment
   - Go to: https://dashboard.render.com
   - Check service status
   - Logs should show no Clerk errors

---

## 📊 Configuration Summary

| Service | Key | Value | Status |
|---------|-----|-------|--------|
| **Clerk Instance** | N/A | epic-marlin-86.clerk.accounts.dev | ✅ Configured |
| **JWT Issuer** | CLERK_JWT_ISSUER | https://epic-marlin-86.clerk.accounts.dev | ✅ Backend |
| **JWKS URL** | CLERK_JWT_KEY | https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json | ✅ Backend |
| **Secret Key** | CLERK_SECRET_KEY | sk_test_quz0ULwTTvKZ0jwUIsGHhSV6EaN8vbgnyiEGzbQXTr | ✅ Backend |
| **Publishable Key** | VITE_CLERK_PUBLISHABLE_KEY | ⏳ NEED YOUR REAL KEY | ❌ Pending |
| **Frontend URL** | VITE_API_URL | http://localhost:8000/api (local) / https://communichat-944a.onrender.com/api (prod) | ✅ Frontend |
| **Frontend Instance** | VITE_CLERK_INSTANCE_URL | https://epic-marlin-86.clerk.accounts.dev | ✅ Frontend |

---

## 🔑 Keys Provided vs What You Need

### ❌ What You Provided (Wrong Format)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXBpYy1tYXJsaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA
```
- ❌ This is base64 encoded
- ❌ Decodes to: epic-marlin-86.clerk.accounts.dev
- ❌ NOT a real publishable key
- ❌ Frontend will fail

### ✅ What You Need (Real Format)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_1f2e3d4c5b6a7980aAbBcCdDeEfFgGhHiIjJkKlMnOpPqQrStUvWxXyYzZ...
```
- ✅ Real publishable key from Clerk dashboard
- ✅ Starts with pk_test_ or pk_live_
- ✅ 60+ alphanumeric characters
- ✅ NOT base64 encoded
- ✅ Frontend will work

### ✅ What You Provided (Correct)
- ✅ Clerk Instance: epic-marlin-86.clerk.accounts.dev
- ✅ JWKS URL: https://epic-marlin-86.clerk.accounts.dev/.well-known/jwks.json
- ✅ Public Key: [RSA public key for JWT verification]
- ✅ Secret Key: sk_test_quz0ULwTTvKZ0jwUIsGHhSV6EaN8vbgnyiEGzbQXTr

---

## ✨ Next Steps

1. **Get your real Clerk publishable key** from dashboard (CRITICAL)
2. **Update GitHub Secrets** with publishable key
3. **Update Render environment variables**
4. **Optionally update Vercel** environment variables
5. **Push changes** to GitHub (auto-deploys)
6. **Test locally** with `npm run dev`
7. **Test production** deployments

---

## ❓ Quick Reference

| What | Where | When Updated | Impact |
|------|-------|--------------|--------|
| Publishable Key | GitHub Secrets + local .env | Every deployment | Frontend auth works |
| Backend URLs | backend/.env + Render | Service redeploy | Backend verifies JWTs |
| Frontend URLs | frontend/.env | Frontend build | Frontend calls API |
| Clerk Instance | All three | Setup once | Auth routing |

---

## 🚀 After Everything is Set Up

1. Users can sign in via Clerk
2. Frontend gets JWT token
3. Frontend sends JWT to backend
4. Backend verifies JWT using JWKS
5. Backend returns user data
6. Feed displays posts

```
User → Clerk Sign-In → JWT Token → Backend → Database → Feed
```

---

## 📞 Support Checklist

- [ ] Got real Clerk publishable key
- [ ] Updated GitHub Secrets
- [ ] Updated Render environment
- [ ] (Optional) Updated Vercel environment
- [ ] Local .env.local has real key
- [ ] Tested `npm run dev` locally
- [ ] Pushed to GitHub
- [ ] Vercel deployment succeeded
- [ ] Frontend shows Clerk UI (not white screen)
- [ ] Backend can verify JWTs

