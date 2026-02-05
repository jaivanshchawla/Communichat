# PLAYTO Community Feed — Complete Build Plan

## 🎯 Vision
Build an **absolutely stunning, high-performance community feed** with:
- Modern, clean UI using DaisyUI themes
- Threaded nested comments (Reddit-style)
- Karma gamification system
- 24-hour dynamic leaderboard
- N+1 query optimization
- Race condition protection
- Smooth, fast, responsive experience

---

## 📋 Execution Phases

### Phase 1: Frontend Setup (UI Foundation)
- [ ] Add DaisyUI with theme support
- [ ] Add shadcn/ui components
- [ ] Create reusable component library
- [ ] Set up theme switcher
- [ ] Clean up existing components

### Phase 2: Backend Models & Optimization
- [ ] Update Comment model to support nesting (parent_id)
- [ ] Add PostLike & CommentLike models with unique constraints
- [ ] Add Karma calculation fields to User model
- [ ] Create indexes for performance
- [ ] Implement N+1 query optimization for comments

### Phase 3: API Endpoints
- [ ] Update `/api/posts/` to return nested comments efficiently
- [ ] Implement `/api/posts/{id}/comments/` with threading support
- [ ] Add `/api/posts/{id}/like/` with concurrency protection
- [ ] Add `/api/comments/{id}/like/` endpoint
- [ ] Implement `/api/leaderboard/` (24-hour karma only)
- [ ] Add `/api/karma/` for user stats

### Phase 4: Frontend Components
- [ ] Build Feed component with infinite scroll
- [ ] Build PostCard with beautiful styling
- [ ] Build nested CommentThread component
- [ ] Build Like button with optimistic updates
- [ ] Build Leaderboard widget
- [ ] Build User profile/stats

### Phase 5: Integration & Polish
- [ ] Connect frontend to new API endpoints
- [ ] Test concurrency (race conditions)
- [ ] Performance testing
- [ ] UI refinement
- [ ] Deploy to production

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- DaisyUI (themes)
- shadcn/ui (advanced components)
- Axios (API calls)
- Clerk (auth)

**Backend:**
- Django 5.0
- Django REST Framework
- PostgreSQL (Render)
- Gunicorn
- PyJWT (auth)

**Infrastructure:**
- Vercel (frontend)
- Render (backend + database)
- GitHub Actions (CI/CD)

---

## 🎨 UI Components to Build

1. **Feed Container** — Infinite scroll, clean layout
2. **PostCard** — Author, content, like button, reply count
3. **CommentThread** — Nested comments, indentation, reply UI
4. **LikeButton** — Interactive, animated, real-time
5. **Leaderboard** — Top 5 users, karma breakdown
6. **ThemeSwitcher** — DaisyUI theme selector
7. **LoadingStates** — Skeletons, spinners
8. **Modals** — Reply form, user profile

---

## 🚀 Starting Now...
