# Playto Community Feed — Implementation Plan (v2)

Full blueprint for the Community Feed prototype: **Clerk auth**, **multi-library UI** (DaisyUI, ShadCN, Magic UI, Aceternity, Luxe, etc.), **DaisyUI themes**, **pre-loaded demo data**, and **Vercel deployment**. Use **INSTALLATION.md** for step-by-step setup of all UI libraries.

---

## 1. Stack Summary

| Layer | Choice | Notes |
|-------|--------|-------|
| **Auth (frontend)** | Clerk | Sign-in/sign-up; users linked by email; JWT for API |
| **Backend** | Django + Django REST Framework | REST API; verifies Clerk JWT; business logic |
| **Database** | Supabase (PostgreSQL) | Hosted Postgres; Django connects via `psycopg2` |
| **Frontend** | React + Vite + TypeScript + Tailwind v4 | SPA; path alias `@/*` |
| **UI libraries** | DaisyUI, ShadCN, Magic UI, Aceternity, Luxe (optional: Coss, HeroUI, Ark) | See [UI Strategy](#6-ui-library-strategy--component-map) |
| **Theming** | DaisyUI themes | Multiple colorways; theme switcher; `data-theme` |
| **Deployment** | Vercel (frontend) + Railway or Vercel (backend) | GitHub → Vercel; backend env on Railway/Vercel |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  React SPA (Vite + Tailwind + DaisyUI themes + ShadCN/Magic/Aceternity/Luxe)  │
│  • ClerkProvider → Sign In / Sign Up                                         │
│  • Feed, Post detail, Threaded comments, Leaderboard, Create post             │
│  • Theme switcher (DaisyUI data-theme)                                        │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ HTTP/REST + Authorization: Bearer <Clerk JWT>
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Django + DRF                                                                │
│  • Clerk JWT verification (middleware or view) → request.user (by email)     │
│  • Posts, Comments, Likes, Leaderboard (24h karma)                           │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Supabase PostgreSQL                                                         │
│  • User (email, clerk_id), Post, Comment, PostLike, CommentLike              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Clerk Authentication

### 3.1 Flow

1. **Frontend:** User signs in/up with Clerk (Clerk-hosted or custom UI). Clerk returns a JWT (session token).
2. **API calls:** Frontend sends `Authorization: Bearer <jwt>` on every request to Django.
3. **Backend:** Django verifies the JWT using Clerk’s JWKS (or secret). From the JWT claims, read `sub` (Clerk user id) and/or `email`. Get or create a Django User by `email` (and optionally store `clerk_id` for idempotency). Set `request.user`.
4. **Linking:** Every user in the app is tied to an email (and optionally `clerk_id`). Demo seed users can be created in Clerk first, then same emails used in Django seed data.

### 3.2 Backend (Django)

- **User model:** Extend `AbstractUser` or use a Profile linked to User. Store at least: `email` (unique), optional `clerk_id` (unique).
- **JWT verification:** Use `PyJWT` + Clerk’s JWKS URL, or a small library that supports Clerk. Verify `iss`, `aud`, expiry; extract `sub`, `email`.
- **Middleware or view mixin:** On each request with `Authorization: Bearer <token>`, verify JWT → get/create User by email (and clerk_id) → set `request.user`. Unauthorized if token missing/invalid.
- **No Django login/register views:** Auth is delegated to Clerk; Django only validates the token and syncs user by email.

### 3.3 Frontend

- **ClerkProvider** wraps the app; use `VITE_CLERK_PUBLISHABLE_KEY`.
- **Protected routes:** Use Clerk’s `<SignedIn>` / `<SignedOut>` or redirect unauthenticated users to sign-in.
- **API client:** Attach `getToken()` from `useAuth()` to every fetch/axios call as `Authorization: Bearer <token>`.

### 3.4 Demo / pre-loaded data

- Create 2–3 users in Clerk (e.g. demo@playto.app, alice@playto.app, bob@playto.app). Note their emails.
- Run Django seed (management command or fixture): create same users (by email) and optionally set `clerk_id` if you stored it. Create posts and comments authored by these users. After that, all new content is user-generated via the app.

---

## 4. Backend (Django + DRF) — Recap

### 4.1 Data models

- **User:** Email (unique), optional `clerk_id` (unique). No “daily karma” field.
- **Post:** `author` (FK → User), `content`, `created_at`, `updated_at`; denormalized `like_count` kept in sync.
- **Comment:** `post`, `author`, `parent` (nullable FK → self), `content`, `created_at`, `updated_at`. Adjacency list for tree.
- **PostLike** / **CommentLike:** Unique on `(user, post)` / `(user, comment)`; `created_at` for 24h leaderboard.

### 4.2 N+1, concurrency, leaderboard

- **Comments:** One query for all comments of a post; build tree in Python; serialize tree (no per-node queries).
- **Double-like:** DB unique constraint + idempotent create (catch IntegrityError).
- **Leaderboard:** Compute from PostLike (×5) and CommentLike (×1) where `created_at >= now() - 24h`; aggregate by user; top 5. No stored “daily karma” field.

### 4.3 API endpoints (with Clerk)

- **Auth:** No register/login; optional `POST /api/users/me/` or `GET /api/users/me/` that returns current user from JWT (for profile/sync).
- **Posts:** `GET /api/posts/`, `GET /api/posts/:id/`, `POST /api/posts/` (auth required).
- **Comments:** `POST /api/posts/:id/comments/` (body: `content`, optional `parent_id`).
- **Likes:** `POST/DELETE /api/posts/:id/like/`, `POST/DELETE /api/comments/:id/like/`.
- **Leaderboard:** `GET /api/leaderboard/`.

All authenticated endpoints expect `Authorization: Bearer <Clerk JWT>`.

---

## 5. Pre-Loaded Demo Data

### 5.1 Purpose

- **Starter experience:** New visitors see a populated feed and leaderboard without creating content first.
- **After that:** All new posts/comments/likes come from real users (Clerk + Django).

### 5.2 Approach

1. **Clerk:** Create 2–3 demo users (e.g. demo@playto.app, alice@playto.app, bob@playto.app). Use Clerk Dashboard or API.
2. **Django seed command:** e.g. `python manage.py seed_demo`.
   - Get or create User by email (and optionally clerk_id) for each demo user.
   - Create a set of Posts and nested Comments (and optionally some PostLike/CommentLike) authored by these users.
   - Idempotent: safe to run multiple times (e.g. “reset demo” button or CI).
3. **Frontend:** No special “demo mode”; feed and leaderboard just show data from API. First-time visitors see seed data; once users sign in and post/comment/like, new data appears.

### 5.3 What to seed

- **Users:** 2–3 (matching Clerk).
- **Posts:** 5–10 with varied content.
- **Comments:** 10–30 total, some nested (replies), so comment tree is non-trivial.
- **Likes:** Some post and comment likes so leaderboard (24h) has data if seed uses recent `created_at` or you backdate carefully for demo.

---

## 6. UI Library Strategy & Component Map

We use **multiple UI libraries** and refactor Next.js-oriented code to **Vite/React** where needed. Each library has a clear role to avoid duplication and conflict.

### 6.1 Role per library

| Library | Role | Use for |
|---------|------|--------|
| **DaisyUI** | Theming + utility components | Theme switcher, `data-theme`, badges, stats, optional buttons/cards where theme tokens are desired |
| **ShadCN/ui** | Core UI primitives | Buttons, inputs, textarea, labels, cards, dialog, dropdown, avatar, skeleton, separator, scroll-area |
| **Magic UI** | Motion & flair | Blur-fade, shine, grid/dot backgrounds, marquee (e.g. leaderboard ticker) |
| **Aceternity** | High-impact blocks | Bento grid (feed layout), 3D cards (post/leaderboard), aurora background (hero/auth), animated tooltips |
| **Luxe UI** | Extra polish | Optional: additional cards, buttons, or forms if they fit the look |
| **Coss UI / HeroUI / Ark** | Optional | Use only for specific needs (e.g. Ark for headless accordion/tabs); avoid overlapping with ShadCN |

### 6.2 Component map (where to use what)

| Feature | Components | Library |
|---------|------------|---------|
| **App shell** | Layout, sidebar, header | ShadCN (sheet for mobile nav), DaisyUI (navbar if desired) |
| **Theme switcher** | Dropdown or button group to set `data-theme` | DaisyUI (dropdown/buttons) + ShadCN dropdown-menu |
| **Feed (list)** | Post cards in a list/grid | ShadCN Card or Aceternity Bento/3D card; Magic UI blur-fade for entrance |
| **Post detail** | Single post + comment tree | ShadCN Card, Avatar; recursive comment component with ShadCN/DaisyUI |
| **Comments (threaded)** | Nested list, reply form | ShadCN (input, textarea, button), custom recursive tree; optional Aceternity tooltip |
| **Like button** | Heart or thumbs | ShadCN Button + icon; optional micro-animation (CSS or Framer Motion) |
| **Leaderboard widget** | Top 5 users, karma | ShadCN Card + Avatar; optional Magic UI marquee or Aceternity 3D card |
| **Create post** | Modal or page with form | ShadCN Dialog + Input/Textarea + Button |
| **Auth (Clerk)** | Sign-in/up UI | Clerk components; wrap in ShadCN Card or Aceternity aurora background |
| **Backgrounds / hero** | Decorative | Aceternity aurora; Magic UI grid/dots |
| **Loading** | Skeletons, spinners | ShadCN Skeleton; DaisyUI loading |

### 6.3 DaisyUI themes (multiple colorways)

- **Config:** In `src/index.css`, enable a curated set: e.g. `light --default`, `dark --prefersdark`, plus `cupcake`, `nord`, `sunset`, `dracula`, `forest` (see INSTALLATION.md).
- **Theme switcher:** Dropdown in header or settings that sets `document.documentElement.setAttribute('data-theme', themeName)` and saves to `localStorage`. On load, read and apply.
- **Scope:** Entire app respects `data-theme`; ShadCN components that use CSS variables can be wired to the same tokens per theme (override variables in `[data-theme="..."]` blocks) so one switcher controls everything.

### 6.4 Refactoring Next.js → Vite/React

- Replace `next/link` → React Router `Link` or `<a>`.
- Replace `next/image` → `<img>` or a small optimized image component.
- Replace `next/navigation` (useNavigate, useParams) → React Router hooks.
- Remove or keep `"use client"` (no effect in Vite).
- Ensure any dynamic imports are Vite-compatible.

---

## 7. Deployment (Vercel + GitHub)

### 7.1 Targets

- **Frontend:** Vercel (static + SPA; build command `npm run build`, output `dist`, root `frontend` if monorepo).
- **Backend:** Railway, Render, or Vercel serverless (Django on Vercel via serverless adapter). Recommendation: **Railway** for simplicity.
- **Database:** Supabase (already hosted).
- **GitHub:** Single repo; connect to Vercel; optional second connection for backend if backend is in same repo (e.g. Vercel for frontend, Railway for backend from same repo or subfolder).

### 7.2 Frontend (Vercel)

- **Build command:** `npm run build` (from `frontend/` or root if configured).
- **Output directory:** `dist`.
- **Env vars (Vercel dashboard):**  
  `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL` (e.g. `https://your-backend.railway.app`).
- **Branch:** Connect `main` (or default) for auto-deploy.

### 7.3 Backend (e.g. Railway)

- **Start command:** `gunicorn config.wsgi:application` (or `python manage.py runserver` for dev only).
- **Env vars:** `DATABASE_URL` (Supabase), `SECRET_KEY`, `CLERK_JWT_ISSUER`, Clerk secret or JWKS config, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (Vercel frontend URL).
- **Migrations:** Run on deploy (e.g. `python manage.py migrate`) in build or release phase.

### 7.4 Keys and env — what you provide

| Key / Env | Where | Used by |
|-----------|--------|---------|
| **Clerk Publishable Key** | Vercel (frontend) as `VITE_CLERK_PUBLISHABLE_KEY` | React app (ClerkProvider) |
| **Clerk Secret / JWT config** | Railway (backend) | Django JWT verification |
| **Supabase DB URL** | Railway (backend) as `DATABASE_URL` | Django |
| **Django SECRET_KEY** | Railway (backend) | Django |
| **Backend URL** | Vercel (frontend) as `VITE_API_URL` | Frontend API client |

No keys in repo; all in env (local `.env` and platform env vars).

---

## 8. Automation & Scripts

### 8.1 What can be automated

- **Project creation:** Script that creates `backend/` (Django) and `frontend/` (Vite React TS), root README, `.gitignore`.
- **Backend:** `pip install -r requirements.txt`, `python manage.py migrate`, optional `python manage.py seed_demo`.
- **Frontend:** `npm install`, then run CLI commands to add ShadCN/DaisyUI/Aceternity/Magic UI/Luxe (see INSTALLATION.md). Can be a single `setup-frontend.sh` or `npm run setup:ui` that runs the init and add commands.
- **Component selection:** Document in INSTALLATION.md and optionally a script that runs `npx shadcn@latest add button card input ...` and `npx shadcn@latest add @aceternity/bento-grid` etc.

### 8.2 What you do manually

- Create Clerk application and copy keys.
- Create Supabase project and copy `DATABASE_URL`.
- Generate Django `SECRET_KEY` and set backend env.
- Connect GitHub repo to Vercel and set env vars.
- Deploy backend to Railway (or chosen host) and set env vars.

### 8.3 Suggested repo layout

```
playto/
├── backend/                 # Django + DRF
│   ├── config/              # project settings
│   ├── community/           # app (posts, comments, likes, leaderboard)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # Vite React TS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # ShadCN, Magic UI, Aceternity
│   │   │   ├── feed/
│   │   │   ├── leaderboard/
│   │   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── components.json      # ShadCN + registries
│   └── .env.example
├── INSTALLATION.md          # UI libs + env setup
├── PLAN.md                  # This file
├── README.md                # How to run locally + deploy
└── EXPLAINER.md             # Tree, Math, AI Audit
```

---

## 9. Implementation Order (Updated)

1. **Repo + backend scaffold**  
   Django project + app; `User` (email, optional clerk_id), Post, Comment, PostLike, CommentLike; migrations; Supabase connection.

2. **Clerk + Django auth**  
   JWT verification in Django; get/create user by email; middleware or mixin; protect endpoints.

3. **DRF endpoints**  
   Posts, comments, likes, leaderboard; N+1-free comment tree; idempotent likes; 24h leaderboard query.

4. **Seed data**  
   Management command; create demo users (by email) and seed posts/comments/likes.

5. **Frontend scaffold**  
   Vite React TS; Tailwind v4; path alias; DaisyUI + themes; ShadCN init + core components (see INSTALLATION.md).

6. **Clerk on frontend**  
   ClerkProvider; SignedIn/SignedOut; attach token to API client.

7. **UI components from libraries**  
   Add Aceternity (bento, 3D card, aurora), Magic UI (blur-fade, etc.), Luxe if desired; refactor for Vite.

8. **Pages and features**  
   Feed (list), post detail (with comment tree), leaderboard widget, create post (dialog or page); theme switcher.

9. **Polish**  
   Animations, responsive layout, loading states.

10. **Docs and deploy**  
    README (run locally, env vars); EXPLAINER (Tree, Math, AI Audit); connect GitHub to Vercel; deploy backend to Railway; set all env vars.

---

## 10. EXPLAINER.md Outline (Unchanged)

- **The Tree:** Adjacency-list Comment model; single query for all comments of a post; build tree in Python; serialize tree (no N+1).
- **The Math:** Exact QuerySet or SQL for top 5 users by karma in last 24 hours (post likes × 5 + comment likes × 1).
- **The AI Audit:** One concrete example where generated code was buggy or inefficient and how you fixed it.

---

## 11. Success Criteria

- Users sign in with Clerk; each user is linked by email (and optional clerk_id) in Django.
- Feed shows posts with author and like count; post detail shows full comment tree with no N+1.
- No double-like (DB + API); leaderboard is top 5 by karma in last 24 hours only (computed from like history).
- UI uses multiple libraries (DaisyUI themes, ShadCN, Magic UI, Aceternity, etc.) in a coherent way; theme switcher changes colorway app-wide.
- Demo data is pre-loaded; thereafter all content is user-generated.
- App is deployable: frontend on Vercel, backend on Railway (or similar), DB on Supabase; keys only in env; README and INSTALLATION.md allow anyone to run and deploy.

Use **INSTALLATION.md** for all UI library and env setup steps; use this plan for architecture, auth, data, and deployment decisions.
