# PLAYTO Quick Reference Card

## 🎯 Current Status: ✅ FULLY OPERATIONAL

Both servers are running and ready for testing!

---

## 🌐 Where to Go

| What | URL | Status |
|------|-----|--------|
| **App** | http://localhost:5173 | ✅ Running |
| **API** | http://localhost:8000/api/ | ✅ Running |
| **Admin** | http://localhost:8000/admin/ | ✅ Available |

---

## 🎮 What to Do

### Step 1: Open App
```
Go to: http://localhost:5173
```

### Step 2: Sign In
```
Click "Sign In" button
Use Clerk test credentials
```

### Step 3: Explore
```
View 4 demo posts
Like posts
Create new posts  
Add comments
```

---

## 📊 Demo Data Ready

| Item | Count | Status |
|------|-------|--------|
| Users | 3 | ✅ |
| Posts | 4 | ✅ |
| Comments | 6 | ✅ |
| Likes | 6 | ✅ |

---

## 🔧 If Something Breaks

### Frontend Won't Load
```bash
cd frontend
npm run dev
```

### Backend Won't Respond
```bash
cd backend
python manage.py runserver localhost:8000
```

### Need Fresh Start
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py seed_demo_data
```

---

## 🔐 Credentials

### Demo Users (if Clerk test mode enabled)
- demo@playto.app
- alice@playto.app
- bob@playto.app

### Django Admin
- URL: http://localhost:8000/admin/
- Superuser needed (create if needed)

---

## 📱 API Endpoints

```
Health Check:        GET  /api/
List Posts:          GET  /api/posts/
Create Post:         POST /api/posts/
Like Post:           POST /api/posts/{id}/like/
List Users:          GET  /api/users/
List Comments:       GET  /api/comments/
Create Comment:      POST /api/comments/
```

---

## 🎁 What's Included

✅ React frontend with Clerk auth  
✅ Django REST API with JWT auth  
✅ SQLite database with demo data  
✅ 4 posts with comments & likes  
✅ User profiles & authentication  
✅ Like/unlike functionality  
✅ TypeScript for type safety  
✅ Hot reload for development  

---

## 🚀 Go Test It!

**Open your browser to:**
# http://localhost:5173

Sign in and explore! 🎉
