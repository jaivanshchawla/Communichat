# PLAYTO Quick Reference Card

## 🎯 Current Status: ✅ FULLY OPERATIONAL & REDESIGNED

Both servers are running with new modern minimalist design!

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

### Step 3: Explore Features
```
✅ View 10 demo posts
✅ Like posts (5 karma each)
✅ Create new posts  
✅ Add comments (1 karma each)
✅ Reply to comments (nested up to 3 levels)
✅ Switch themes with moon icon
✅ View leaderboard
```

---

## 📊 Enhanced Demo Data

| Item | Count | Status |
|------|-------|--------|
| Users | 8 | ✅ |
| Posts | 10 | ✅ |
| Comments | 17 | ✅ |
| Threaded Replies | 3 | ✅ |
| Post Likes | 24 | ✅ |
| Comment Likes | 12 | ✅ |

---

## 🎨 New Features

### Modern Minimalist Design
- ✅ Clean border-based cards
- ✅ Gradient text branding
- ✅ Better spacing and typography
- ✅ Smooth animations
- ✅ Responsive layout

### Enhanced Theme Switcher
- ✅ 30+ DaisyUI themes
- ✅ Organized by light/dark
- ✅ Emoji for each theme
- ✅ Instant switching
- ✅ Persistent storage

### Improved Components
- ✅ Better PostCard styling
- ✅ Medal-based leaderboard
- ✅ Enhanced comments
- ✅ Better forms with labels
- ✅ Cleaner UI overall

---

## 🌙 Theme Switcher

**Location**: Top-right corner (moon icon)

**Categories**:
- **Light Themes**: ☀️ light, 🧁 cupcake, 🐝 bumblebee, 💚 emerald, 🌸 garden, 🌲 forest, 💧 aqua, 🎨 pastel, 🍋 lemonade
- **Dark Themes**: 🌙 dark, 🌆 synthwave, 📻 retro, 🤖 cyberpunk, 💗 valentine, 🎃 halloween, ✨ fantasy, 📐 wireframe, ⚫ black, 👑 luxury, 🧛 dracula, 🖨️ cmyk, 🍂 autumn, 📊 business, ⚗️ acid, 🎵 lofi, 🌃 night, ☕ coffee, ❄️ winter, 🌑 dim, 🧊 nord, 🌅 sunset, 💼 corporate

---

## 👥 Demo Users

All with password: `demopass123`

- alice@playto.app - Alice Wonderland
- bob@playto.app - Bob Builder
- charlie@playto.app - Charlie Coder
- diana@playto.app - Diana Designer
- eve@playto.app - Eve Innovator
- frank@playto.app - Frank Founder
- grace@playto.app - Grace Guru
- henry@playto.app - Henry Hacker

---

## 🏆 Leaderboard System

**Karma Points**:
- 5 points per post like
- 1 point per comment like

**Demo Rankings**:
Shows top 5 users with medal emojis (🥇🥈🥉⭐)

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
