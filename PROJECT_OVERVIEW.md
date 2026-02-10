# 🎮 PLAYTO — Community Feed Platform

> A full-stack, production-grade community discussion platform built with **React 19**, **Django 5**, and **Clerk Authentication** — designed to demonstrate real-world engineering across frontend, backend, and DevOps.

---

## 📊 Key Metrics at a Glance

| Metric | Value |
|---|---|
| **DaisyUI Themes** | **35+** (32 built-in + `caramellatte`, `silk`) — instant full-app reskin |
| **UI Libraries Integrated** | **6** (DaisyUI, Tailwind, HeroUI, Ark UI, Framer Motion, Lucide) |
| **Mock Users** | **15** unique profiles with realistic developer personas |
| **Seeded Posts** | **50** community posts across diverse tech topics |
| **Comments** | **~200** auto-generated across posts (0–8 per post) |
| **API Endpoints** | **14+** RESTful endpoints (CRUD + actions) |
| **Django Models** | **5** (User, Post, Comment, PostLike, CommentLike) |
| **React Components** | **5** feature components + **2** context providers |
| **Auth Provider** | Clerk (JWT-based, production-grade) |
| **Deployment** | Frontend → **Vercel** \| Backend → **Render** |
| **Karma System** | Post like = **5 pts** \| Comment like = **1 pt** |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     FRONTEND                        │
│   React 19 + TypeScript + Vite 7                    │
│   Tailwind CSS v4 + DaisyUI v5 (35+ themes)        │
│   Clerk Auth (SSO, JWT tokens)                      │
│   Deployed on Vercel                                │
└────────────────────┬────────────────────────────────┘
                     │ Axios (REST API calls)
                     ▼
┌─────────────────────────────────────────────────────┐
│                     BACKEND                         │
│   Django 5.0 + Django REST Framework 3.15           │
│   Custom Clerk JWT Authentication                   │
│   PostgreSQL (Supabase) / SQLite fallback           │
│   Deployed on Render (Gunicorn + WhiteNoise)        │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Tech Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **React** | `19.2.0` | UI framework (latest features: Actions, `use()`) |
| **TypeScript** | `5.9.3` | Type-safe development |
| **Vite** | `7.2.4` | Lightning-fast HMR & build tooling |
| **React Router DOM** | `7.13.0` | Client-side routing |

### UI / Styling Libraries

| Library | Version | Role |
|---|---|---|
| **Tailwind CSS** | `4.1.18` | Utility-first CSS framework |
| **DaisyUI** | `5.5.17` | 35+ pre-built themes, component classes (`btn`, `card`, `navbar`, `badge`, `alert`, `modal`, etc.) |
| **HeroUI** | `2.8.8` | Premium React UI components |
| **Ark UI** | `5.31.0` | Headless, accessible UI primitives |
| **Framer Motion** | `12.31.2` | Production-grade animations & transitions |
| **Lucide React** | `0.563.0` | Beautiful, customizable SVG icon set |

### State & Data Management

| Library | Version | Role |
|---|---|---|
| **Zustand** | `5.0.11` | Lightweight global state management |
| **TanStack React Query** | `5.90.20` | Server state, caching, and data fetching |
| **Axios** | `1.13.4` | HTTP client with interceptors |

### Authentication

| Library | Version | Role |
|---|---|---|
| **Clerk React** | `5.60.0` | Auth UI components (`SignInButton`, `UserButton`, `SignedIn`/`SignedOut` guards) |

---

## 🎭 35+ DaisyUI Themes

All themes are registered in `tailwind.config.js` and switchable at runtime via the `ThemeSwitcher` component with **localStorage persistence**:

```
☀️ light     🌙 dark       🧁 cupcake     🐝 bumblebee   💚 emerald
💼 corporate 🌆 synthwave  📻 retro       🤖 cyberpunk   💗 valentine
🎃 halloween 🌸 garden     🌲 forest      💧 aqua        🎵 lofi
🎨 pastel    ✨ fantasy    📐 wireframe   ⚫ black       👑 luxury
🧛 dracula   🖨️ cmyk       🍂 autumn      📊 business    ⚗️ acid
🍋 lemonade  🌃 night      ☕ coffee      ❄️ winter      🌑 dim
🧊 nord      🌅 sunset     🍮 caramellatte 🧵 silk
```

**How it works:**
- Theme state managed via React Context (`ThemeContext.tsx`)
- `data-theme` attribute set on `<html>` element
- All DaisyUI semantic classes (`bg-base-100`, `text-primary`, `btn-primary`, etc.) automatically adapt
- User preference persisted in `localStorage`

---

## 🔧 Backend Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Django** | `5.0.3` | Web framework |
| **Django REST Framework** | `3.15.1` | RESTful API layer |
| **PostgreSQL** (via `psycopg`) | `3.2.13` | Production database (Supabase-hosted) |
| **SQLite** | — | Local development fallback |
| **PyJWT** | `2.8.0` | JWT token verification |
| **django-cors-headers** | `4.3.1` | Cross-origin resource sharing |
| **Gunicorn** | `21.2.0` | Production WSGI server |
| **WhiteNoise** | `6.6.0` | Static file serving |
| **dj-database-url** | `2.1.0` | Database URL parsing (12-factor) |
| **python-dotenv** | `1.0.1` | Environment variable loading |

---

## 📐 Data Models

```
┌─────────────────────┐
│       User          │
│  (AbstractUser)     │
├─────────────────────┤
│ email (unique)      │
│ clerk_id (unique)   │
│ username            │
│ first_name          │
│ last_name           │
│ total_karma (int)   │
│ created_at          │
│ updated_at          │
└───────┬─────────────┘
        │ 1:N
        ▼
┌─────────────────────┐       ┌─────────────────────┐
│       Post          │       │    PostLike          │
├─────────────────────┤       ├─────────────────────┤
│ author (FK→User)    │◄──────│ user (FK→User)      │
│ title               │       │ post (FK→Post)      │
│ content             │       │ created_at          │
│ created_at          │       │ unique(user, post)   │
│ updated_at          │       │ karma: +5 to author  │
└───────┬─────────────┘       └─────────────────────┘
        │ 1:N
        ▼
┌─────────────────────┐       ┌─────────────────────┐
│     Comment         │       │   CommentLike        │
├─────────────────────┤       ├─────────────────────┤
│ post (FK→Post)      │       │ user (FK→User)      │
│ author (FK→User)    │       │ comment (FK→Comment) │
│ parent (FK→self)    │◄──────│ created_at          │
│ content             │       │ unique(user,comment) │
│ created_at          │       │ karma: +1 to author  │
└─────────────────────┘       └─────────────────────┘
```

**Karma System:**
- A **post like** awards **5 karma points** to the post author
- A **comment like** awards **1 karma point** to the comment author
- Karma is tracked on the `User.total_karma` field and drives the **Leaderboard**

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/` | Public | Health check + endpoint directory |
| `GET` | `/api/posts/` | Public | List all posts (paginated, 20/page) |
| `POST` | `/api/posts/` | Required | Create a new post |
| `GET` | `/api/posts/{id}/` | Public | Get post details with comments |
| `PUT` | `/api/posts/{id}/` | Owner only | Update own post |
| `DELETE` | `/api/posts/{id}/` | Owner only | Delete own post |
| `POST` | `/api/posts/{id}/like/` | Required | Like a post (+5 karma to author) |
| `POST` | `/api/posts/{id}/unlike/` | Required | Unlike a post |
| `GET` | `/api/comments/` | Public | List all comments |
| `POST` | `/api/comments/` | Required | Create comment (supports threading via `parent`) |
| `POST` | `/api/comments/{id}/like/` | Required | Like a comment (+1 karma) |
| `POST` | `/api/comments/{id}/unlike/` | Required | Unlike a comment |
| `GET` | `/api/users/` | Public | List all user profiles |
| `GET` | `/api/leaderboard/?limit=5` | Public | Top users by 24-hour karma |

**Pagination:** Default 20 items/page, configurable via `page_size` query param (max 100).

---

## 👥 Mock Users (15 Developer Personas)

The `seed_demo_data` management command populates the database with realistic demo data:

| # | Username | Name | Email |
|---|---|---|---|
| 1 | `alice_w` | Alice Wonder | alice@playto.app |
| 2 | `bob_builds` | Bob Builder | bob@playto.app |
| 3 | `code_charlie` | Charlie Dev | charlie@playto.app |
| 4 | `design_diana` | Diana Prince | diana@playto.app |
| 5 | `evan_flows` | Evan You | evan@playto.app |
| 6 | `fiona_front` | Fiona Stack | fiona@playto.app |
| 7 | `git_george` | George Branch | george@playto.app |
| 8 | `hannah_hacks` | Hannah Montana | hannah@playto.app |
| 9 | `ian_infra` | Ian Ops | ian@playto.app |
| 10 | `julia_java` | Julia Roberts | julia@playto.app |
| 11 | `kube_kevin` | Kevin Kubernetes | kevin@playto.app |
| 12 | `linux_linda` | Linda Torvalds | linda@playto.app |
| 13 | `mike_micro` | Mike Service | mike@playto.app |
| 14 | `node_nina` | Nina Node | nina@playto.app |
| 15 | `oscar_open` | Oscar Source | oscar@playto.app |

**Seeded Content:**
- **50 posts** covering real developer topics (Rust, Tailwind, OAuth2, Docker, Kubernetes, TypeScript, etc.)
- **~200 comments** randomly distributed (0–8 per post), with some long-form
- **Post likes** with virality simulation (80% get 0–5 likes, 20% get 5–15 likes)
- **Comment likes** with ~50% probability

---

## 🧩 Frontend Component Architecture

```
App.tsx
├── <ClerkProvider>             ← Auth wrapper
│   ├── <ThemeProvider>         ← Theme context (35+ themes)
│   │   ├── <SignedIn>
│   │   │   └── <Feed>
│   │   │       ├── <ThemeSwitcher />       ← Theme dropdown with emojis
│   │   │       ├── <CreatePost />          ← Post creation form
│   │   │       ├── <PostCard />            ← Individual post display
│   │   │       │   └── <CommentThread />   ← Threaded comment display
│   │   │       └── <Leaderboard />         ← Top 5 karma sidebar
│   │   └── <SignedOut>
│   │       └── Landing Page (Sign In CTA)
```

| Component | File | Description |
|---|---|---|
| **ThemeSwitcher** | `ThemeSwitcher.tsx` | Dropdown with 32 themes, emoji labels, active checkmark |
| **CreatePost** | `CreatePost.tsx` | Title + content form, auth-gated |
| **PostCard** | `PostCard.tsx` | Post display with like/comment actions, engagement stats |
| **CommentThread** | `CommentThread.tsx` | Threaded comments with reply support |
| **Leaderboard** | `Leaderboard.tsx` | Sidebar showing top 5 users by karma with medal emojis |
| **ThemeContext** | `context/ThemeContext.tsx` | React Context for theme state + localStorage persistence |
| **GuestAuthContext** | `context/GuestAuthContext.tsx` | Guest/anonymous user handling |

---

## 🚀 Deployment Architecture

```
┌──────────────┐          HTTPS          ┌────────────────────┐
│   Vercel     │ ◄────────────────────── │   User Browser     │
│  (Frontend)  │                         └────────────────────┘
│  React + SPA │              │
└──────┬───────┘              │
       │ API calls            │ Clerk Auth
       ▼                      ▼
┌──────────────┐        ┌─────────────┐
│   Render     │        │   Clerk     │
│  (Backend)   │        │  (Auth)     │
│  Gunicorn    │        │  JWT/SSO    │
│  Django DRF  │        └─────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
│  (Supabase)  │
└──────────────┘
```

| Layer | Service | Config File |
|---|---|---|
| Frontend | **Vercel** | `vercel.json` — SPA rewrites, env vars |
| Backend | **Render** | `render.yaml` — Gunicorn, Python 3.11, auto SECRET_KEY |
| Database | **Supabase** (PostgreSQL) | `DATABASE_URL` env var with `dj-database-url` |
| Auth | **Clerk** | JWT verification via JWKS endpoint |

---

## 🎯 Role-Specific Talking Points

### 🟣 For a Frontend Role

<details>
<summary><strong>Click to expand frontend highlights</strong></summary>

**UI / Design System Mastery:**
- Integrated **6 UI libraries** (DaisyUI, Tailwind, HeroUI, Ark UI, Framer Motion, Lucide) into a cohesive design system
- **35+ DaisyUI themes** with runtime switching — demonstrates deep understanding of CSS custom properties, theming architecture, and design tokens
- Built a `ThemeContext` with `localStorage` persistence and synchronous DOM updates (`data-theme` attribute)
- Consistent use of DaisyUI **semantic classes** (`bg-base-100`, `btn-primary`, `card`, `navbar`) ensuring every theme "just works"

**Modern React Patterns:**
- **React 19** — latest version with modern features
- **TypeScript** throughout — fully typed props, API responses, state, and context
- **Context API** for cross-cutting concerns (theme, guest auth)
- **Zustand** for lightweight global state (no Redux boilerplate)
- **TanStack React Query** for server state management and caching
- Clean component composition: `PostCard → CommentThread` nesting

**Performance & UX:**
- **Vite 7** for sub-second HMR and optimized production builds
- **Framer Motion** for smooth animations and micro-interactions
- Loading spinners, error boundaries, and empty states handled gracefully
- Responsive grid layout (`lg:grid-cols-4`) with sticky sidebar
- **Clerk** auth components for polished sign-in/sign-out UX

**State Management Showcase:**
- `useState` for local component state (form data, toggle states)
- `useEffect` for side effects (data fetching, auth setup)
- Context for global theme state
- Zustand available for complex global state needs
- TanStack Query for server-synchronized data

</details>

---

### 🟢 For a Backend Role

<details>
<summary><strong>Click to expand backend highlights</strong></summary>

**API Design:**
- RESTful API built with **Django REST Framework** using `ModelViewSet` pattern
- **14+ endpoints** with proper HTTP methods (GET, POST, PUT, DELETE)
- Custom actions (`like/unlike`) using DRF's `@action` decorator
- **Paginated responses** with configurable page size (default 20, max 100)
- Health check endpoint with API directory

**Authentication & Authorization:**
- Custom **Clerk JWT Authentication** backend (`ClerkJWTAuthentication`)
- `IsAuthenticatedOrReadOnly` permission — public reads, authenticated writes
- **Owner-only mutations** — users can only edit/delete their own posts and comments
- JWT verification via Clerk's JWKS endpoint

**Data Modeling:**
- **Custom User model** extending `AbstractUser` with `clerk_id` and `total_karma`
- Proper **foreign keys** with `CASCADE` delete and `related_name` for reverse lookups
- **Self-referential FK** on `Comment.parent` for threaded replies
- **Unique constraints** (`unique_together`) preventing duplicate likes
- **Database indexes** for performance on common query patterns
- **Karma system** with automatic point award in model `save()` overrides

**DevOps & Production:**
- **12-factor app** configuration (env vars, `dj-database-url`, `.env` files)
- **PostgreSQL** (Supabase) for production, SQLite fallback for development
- **Gunicorn** WSGI server with configurable concurrency (`WEB_CONCURRENCY=4`)
- **WhiteNoise** for zero-dependency static file serving
- **CORS** configuration with `django-cors-headers`
- **Render** deployment with `render.yaml` infrastructure-as-code
- Seed command (`python manage.py seed_demo_data`) for reproducible demo environments

</details>

---

### 🔵 For a Full-Stack Role

<details>
<summary><strong>Click to expand full-stack highlights</strong></summary>

**End-to-End Architecture:**
- **Decoupled frontend/backend** — React SPA calling a Django REST API
- Separate deployment: **Vercel** (frontend) + **Render** (backend) + **Supabase** (database)
- **Clerk** as a third-party auth provider bridging both layers (JWT tokens)
- Environment-aware API configuration (dev → `localhost:8000`, prod → Render URL)

**Cross-Stack Integration:**
- Axios HTTP client with **request/response interceptors** for auth token injection and logging
- Frontend `api.ts` module wrapping all backend endpoints into a clean API layer
- Clerk JWT tokens passed from React → Django via `Authorization: Bearer` header
- Custom Django auth backend verifying Clerk-issued JWTs against JWKS endpoint
- CORS properly configured for cross-origin deployment

**Data Flow:**
```
User Action → React Component → api.ts (Axios) → Django View → Model → PostgreSQL
                                                        ↓
                                                  Serializer → JSON Response → React State → UI Update
```

**Full-Stack Patterns Demonstrated:**
1. **Theming** — 35+ themes managed entirely on the frontend (CSS custom properties)
2. **Authentication** — Clerk handles user identity; Django verifies JWT tokens
3. **CRUD Operations** — Full create/read/update/delete on Posts and Comments
4. **Engagement System** — Like/unlike with karma computation (backend) and optimistic UI (frontend)
5. **Leaderboard** — 24-hour rolling leaderboard query (backend) surfaced in a sidebar widget (frontend)
6. **Seeding** — Management command to populate realistic demo data for demos and interviews

**DevOps & CI:**
- Git-based deployment on both Vercel and Render
- Environment variables for secrets (Clerk keys, database URL, Django secret key)
- Production-ready configs: Gunicorn, WhiteNoise, PostgreSQL
- SPA routing handled via Vercel rewrites (`vercel.json`)

</details>

---

## 🛠️ Local Development

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data   # Populate 15 users, 50 posts, ~200 comments
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev   # → http://localhost:5173
```

**Environment Variables:**
```env
# Frontend (.env.local)
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend (.env)
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...          # Optional, falls back to SQLite
CLERK_JWT_ISSUER=https://...clerk.accounts.dev
CLERK_SECRET_KEY=sk_test_...
```

---

## 📁 Project Structure

```
PLAYTO/
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ThemeSwitcher.tsx     # 35+ theme dropdown
│   │   │   ├── CreatePost.tsx        # Post creation form
│   │   │   ├── PostCard.tsx          # Post display + actions
│   │   │   ├── CommentThread.tsx     # Threaded comments
│   │   │   └── Leaderboard.tsx       # Karma leaderboard sidebar
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx       # Theme state + localStorage
│   │   │   └── GuestAuthContext.tsx   # Guest user handling
│   │   ├── api.ts                    # Axios API client
│   │   ├── App.tsx                   # Main app with routing
│   │   └── main.tsx                  # Entry point (Clerk + Theme providers)
│   ├── tailwind.config.js            # 35 DaisyUI themes configured
│   ├── vite.config.ts                # Vite build config
│   ├── vercel.json                   # Vercel deployment config
│   └── package.json                  # All dependencies
│
├── backend/                          # Django REST API
│   ├── api/
│   │   ├── models.py                 # User, Post, Comment, PostLike, CommentLike
│   │   ├── views.py                  # ViewSets + leaderboard endpoint
│   │   ├── serializers.py            # DRF serializers
│   │   ├── auth.py                   # Clerk JWT authentication
│   │   ├── urls.py                   # API routing (DefaultRouter)
│   │   ├── utils.py                  # Leaderboard query helper
│   │   └── management/commands/
│   │       └── seed_demo_data.py     # 15 users, 50 posts, ~200 comments
│   ├── playto_config/
│   │   └── settings.py               # Django settings (CORS, auth, DB)
│   ├── render.yaml                   # Render deployment config
│   └── requirements.txt              # Python dependencies
│
└── vercel.json                       # Root Vercel config
```

---

*Built by **Jaivansh Chawla** — Full-Stack Developer*
