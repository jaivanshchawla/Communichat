## Playto Community Feed — Execution Plan

This document tracks **phases**, **tasks**, and **completion status** for building and shipping the app. Use the checkboxes as a living todo list.

Legend:
- `[ ]` = not started
- `[-]` = in progress / partially done
- `[x]` = completed

---

## Phase 0 — Project & Repo Bootstrap

- [ ] **Create repo structure**
  - [ ] Initialize Git repo
  - [ ] Create root files: `README.md`, `.gitignore`, `PLAN.md`, `INSTALLATION.md`, `EXECUTION_PLAN.md`, `EXPLAINER.md`
  - [ ] Create folders: `backend/`, `frontend/`

- [ ] **Backend virtualenv + base setup**
  - [ ] Create Python virtualenv for `backend/`
  - [ ] Add `requirements.txt` with Django, DRF, psycopg, gunicorn, PyJWT, django-cors-headers, etc.
  - [ ] Add `.env.example` for backend (DATABASE_URL, SECRET_KEY, CLERK_JWT_ISSUER, etc.)

- [ ] **Frontend base setup**
  - [ ] Run Vite React TS scaffold in `frontend/`
  - [ ] Initialize `package.json` scripts (`dev`, `build`, `preview`, `lint` if needed)
  - [ ] Add `.env.example` for frontend (VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL)

---

## Phase 1 — Backend Foundations (Django + Supabase)

- [ ] **Django project & app**
  - [ ] Create Django project (e.g. `config`) inside `backend/`
  - [ ] Create app (e.g. `community`)
  - [ ] Configure `INSTALLED_APPS` (Django, DRF, community, cors headers, etc.)

- [ ] **Database config (Supabase)**
  - [ ] Add `DATABASES` config to use `DATABASE_URL` (Supabase Postgres)
  - [ ] Add `django-environ` or equivalent for env loading
  - [ ] Verify connection locally with a simple `migrate`

- [ ] **User model**
  - [ ] Implement custom User model (extend `AbstractUser`) or Profile
  - [ ] Add `email` as unique
  - [ ] Add optional `clerk_id` field (unique)
  - [ ] Update `AUTH_USER_MODEL` and run initial migrations

- [ ] **Core models**
  - [ ] `Post` model (author, content, timestamps, `like_count`)
  - [ ] `Comment` model (post, author, parent, content, timestamps)
  - [ ] `PostLike` model (user, post, created_at, unique constraint on (user, post))
  - [ ] `CommentLike` model (user, comment, created_at, unique constraint on (user, comment))
  - [ ] Add indexes (post created_at, comment (post_id, parent_id), like created_at)
  - [ ] Create and run migrations

---

## Phase 2 — Auth Integration (Clerk ↔ Django)

- [ ] **Clerk setup**
  - [ ] Create Clerk application in Clerk dashboard
  - [ ] Configure allowed redirect URLs for local dev and production
  - [ ] Copy **Publishable key** and **Secret** and store them securely

- [ ] **JWT verification in Django**
  - [ ] Add dependency for JWT / JWKS verification (PyJWT or appropriate lib)
  - [ ] Add settings for Clerk issuer, audience, JWKS URL
  - [ ] Implement a utility to verify incoming `Authorization: Bearer <token>`
  - [ ] Parse claims to get `sub` (clerk_id) and `email`

- [ ] **Auth middleware / decorator**
  - [ ] Implement DRF authentication class or middleware that:
    - [ ] Extracts JWT from `Authorization` header
    - [ ] Verifies JWT via Clerk
    - [ ] `get_or_create` user by `email` (and store `clerk_id` if present)
    - [ ] Attaches `request.user`
  - [ ] Configure DRF `DEFAULT_AUTHENTICATION_CLASSES` to use it

- [ ] **Basic auth endpoint**
  - [ ] Implement `GET /api/users/me/` to return current user profile and ensure auth is wired correctly

---

## Phase 3 — Core API (Posts, Comments, Likes, Leaderboard)

- [ ] **Serializers**
  - [ ] `UserSerializer` (minimal fields used in feed/leaderboard)
  - [ ] `PostSerializer` (content, author summary, like_count, timestamps)
  - [ ] `CommentSerializer` (for tree nodes: id, content, author, created_at, children list)

- [ ] **Feed & post detail**
  - [ ] Implement `GET /api/posts/` (list with pagination, author + like_count)
  - [ ] Implement `GET /api/posts/:id/` (single post)
  - [ ] For post detail, fetch all comments in one query and build nested tree in Python
  - [ ] Ensure total query count for post detail + comments is small and constant (no N+1)

- [ ] **Create content**
  - [ ] `POST /api/posts/` (create post, auth required)
  - [ ] `POST /api/posts/:id/comments/` (create comment, optional `parent_id` for replies)
  - [ ] Validate depth/parent existence

- [ ] **Likes & concurrency**
  - [ ] `POST /api/posts/:id/like/` (create `PostLike`; handle IntegrityError for double-like)
  - [ ] `DELETE /api/posts/:id/like/` (remove `PostLike`)
  - [ ] `POST /api/comments/:id/like/` / `DELETE` analog for `CommentLike`
  - [ ] Update denormalized `like_count` on Post and optionally on Comment
  - [ ] Add tests to confirm double-like is impossible and race safe (DB constraint)

- [ ] **Leaderboard (24h karma)**
  - [ ] Implement query/SQL: 
    - [ ] Filter `PostLike` and `CommentLike` by `created_at >= now() - 24h`
    - [ ] Weight: post likes × 5, comment likes × 1
    - [ ] Aggregate by user, order by total desc, limit 5
  - [ ] Implement `GET /api/leaderboard/` endpoint
  - [ ] Consider small cache TTL if needed

---

## Phase 4 — Demo Data (Seed Script)

- [ ] **Seed command**
  - [ ] Create Django management command (e.g. `seed_demo`)
  - [ ] For each demo user email (from Clerk): `get_or_create` User by email (and set `clerk_id` if known)
  - [ ] Create sample Posts authored by demo users
  - [ ] Create nested Comments (roots + replies) to exercise tree logic
  - [ ] Create Likes (PostLike & CommentLike) with timestamps in last 24h

- [ ] **Idempotency**
  - [ ] Ensure rerunning command does not duplicate posts/comments/likes or breaks constraints
  - [ ] Optionally add a `--reset` flag to clear demo data

---

## Phase 5 — Frontend Foundations (Vite + Tailwind + DaisyUI + ShadCN + Clerk)

- [ ] **Vite React TS project**
  - [ ] Create Vite React TS app in `frontend/` (see INSTALLATION.md)
  - [ ] Verify dev server runs (`npm run dev`)

- [ ] **Tailwind v4 + alias**
  - [ ] Install Tailwind v4 and `@tailwindcss/vite`
  - [ ] Configure `vite.config.ts` with Tailwind plugin and `@/*` alias
  - [ ] Configure `tsconfig.json` + `tsconfig.app.json` for `@/*` paths
  - [ ] Add base CSS `@import "tailwindcss";` to `src/index.css`

- [ ] **DaisyUI + themes**
  - [ ] Install DaisyUI
  - [ ] Add `@plugin "daisyui"` in CSS and configure curated themes (light, dark, cupcake, nord, sunset, dracula, forest, etc.)
  - [ ] Implement theme switcher component (reads/writes `data-theme` + localStorage)

- [ ] **ShadCN/ui**
  - [ ] Run `npx shadcn@latest init` with Vite settings (see INSTALLATION.md)
  - [ ] Add core components: button, card, input, textarea, label, dialog, dropdown-menu, avatar, skeleton, separator, scroll-area
  - [ ] Verify one sample page using ShadCN Button/Card builds and renders

- [ ] **Clerk (frontend)**
  - [ ] Install Clerk React SDK
  - [ ] Wrap app with `ClerkProvider` using `VITE_CLERK_PUBLISHABLE_KEY`
  - [ ] Add basic `SignedIn` / `SignedOut` wrappers
  - [ ] Implement sign-in/sign-up routes and simple header showing user avatar/email

---

## Phase 6 — UI Libraries & Visual System

- [ ] **Aceternity components**
  - [ ] Add Aceternity registry to `components.json`
  - [ ] Install `@aceternity/bento-grid` for feed layout
  - [ ] Install `@aceternity/3d-card` for post/leaderboard cards
  - [ ] Install `aurora-background` for hero/auth background
  - [ ] Refactor Next.js specifics to Vite/React (links, images, routing)

- [ ] **Magic UI components**
  - [ ] Add blur-fade (or similar) via ShadCN CLI
  - [ ] Add at least one background/pattern/marquee component
  - [ ] Refactor to Vite/React as needed

- [ ] **Luxe UI (optional but planned)**
  - [ ] Run `npx luxe init`
  - [ ] Add 1–2 components that complement ShadCN (e.g. premium cards or forms)

- [ ] **Unification**
  - [ ] Ensure all new components respect DaisyUI theme (either via Tailwind classes or CSS variables)
  - [ ] Ensure no conflicting globals from multiple libraries

---

## Phase 7 — App Screens & Features

- [ ] **Routing**
  - [ ] Install and configure React Router
  - [ ] Define routes: `/` (feed), `/post/:id`, `/leaderboard` (optional separate page), `/auth/*` (Clerk), `/profile` (optional)

- [ ] **Feed page (`/`)**
  - [ ] Fetch posts from `GET /api/posts/` with React Query
  - [ ] Render list using Aceternity Bento/3D cards or ShadCN Cards + Magic UI blur-fade
  - [ ] Show author, content snippet, like count, comment count, timestamp
  - [ ] Add button to open create-post dialog

- [ ] **Post detail page (`/post/:id`)**
  - [ ] Fetch single post (with full comment tree) from API
  - [ ] Render post detail (card) with full content and likes
  - [ ] Implement recursive comment tree component with reply actions:
    - [ ] Reply button opens inline ShadCN textarea + button
    - [ ] Nested replies styled with indentation / lines
  - [ ] Wire comment create API calls

- [ ] **Likes**
  - [ ] Implement like buttons for posts and comments (ShadCN buttons + icons)
  - [ ] On click: call API; update counts (optimistic or via refetch)
  - [ ] Add micro-interaction (scale/opacity or Magic UI animation)

- [ ] **Leaderboard widget**
  - [ ] Fetch top 5 users from `GET /api/leaderboard/`
  - [ ] Render as sidebar widget (desktop) and separate section (mobile)
  - [ ] Use ShadCN Card + Avatar, optionally Aceternity 3D card or Magic UI marquee for flair

- [ ] **Create post UX**
  - [ ] Implement ShadCN Dialog or dedicated page for new post
  - [ ] Wire `POST /api/posts/`
  - [ ] On success: close modal and refetch feed or navigate to new post

- [ ] **Auth flows**
  - [ ] Integrate Clerk sign-in / sign-up pages into layout
  - [ ] Protect routes (`/`, `/post/:id`) for signed-in users (or allow read-only for signed-out; design decision)
  - [ ] Ensure tokens attached in all API calls

---

## Phase 8 — Polish, Performance, and QA

- [ ] **Animations & UX polish**
  - [ ] Add enter transitions for feed items (Magic UI / CSS)
  - [ ] Smooth expand/collapse for comment replies
  - [ ] Hover states on cards, buttons, leaderboard entries

- [ ] **Responsiveness**
  - [ ] Test on mobile, tablet, desktop breakpoints
  - [ ] Adjust layout: stacked on mobile, feed + leaderboard side-by-side on desktop

- [ ] **Performance**
  - [ ] Use React Query caching and sensible refetch strategies
  - [ ] Lazy-load heavier components/pages as needed
  - [ ] Check API query counts for post-detail with many comments

- [ ] **Testing / sanity checks**
  - [ ] Manual tests for like race conditions (fast repeated clicks)
  - [ ] Verify leaderboard only counts last 24h
  - [ ] Verify N+1 for comments is avoided (Django debug toolbar or logging)

---

## Phase 9 — Documentation & Deployment

- [ ] **EXPLAINER.md**
  - [ ] Describe comment tree modeling and single-query loading
  - [ ] Paste the exact QuerySet/SQL for 24h leaderboard
  - [ ] Document one AI-generated bug/inefficiency and how it was fixed

- [ ] **README.md**
  - [ ] Local setup instructions (backend + frontend)
  - [ ] Env var configuration for Clerk, Supabase, etc.
  - [ ] How to run tests (if any) and seed demo data

- [ ] **Deployment**
  - [ ] Create Vercel project for frontend, link GitHub repo
  - [ ] Set Vercel env vars (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`)
  - [ ] Deploy frontend and verify at production URL
  - [ ] Deploy backend to Railway (or chosen host) with env vars and migrations
  - [ ] Point `VITE_API_URL` to backend production URL and redeploy frontend

- [ ] **Final QA**
  - [ ] Run through full flows on production (sign in, post, comment, like, leaderboard, theme switching)
  - [ ] Confirm no obvious errors in browser console or backend logs

---

You can now work phase by phase, checking items off as you go. This plan stays high-level but is concrete enough to guide day-to-day implementation while staying aligned with `PLAN.md` and `INSTALLATION.md`.

