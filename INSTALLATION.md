# Playto Community Feed — UI & Tooling Installation Guide

Step-by-step installation for **Vite + React + TypeScript** with Tailwind CSS v4 and multiple UI libraries. Use this as the single source of truth for setting up the frontend. Components from Next.js–oriented libraries (Magic UI, Aceternity, Luxe, etc.) are used by copying/refactoring their code for Vite/React—no Next.js runtime.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Creation (Vite + React + TypeScript)](#2-project-creation-vite--react--typescript)
3. [Tailwind CSS v4 + Path Alias](#3-tailwind-css-v4--path-alias)
4. [DaisyUI + Themes](#4-daisyui--themes)
5. [ShadCN/ui (Vite)](#5-shadcnui-vite)
6. [Magic UI](#6-magic-ui)
7. [Aceternity UI](#7-aceternity-ui)
8. [Luxe UI](#8-luxe-ui)
9. [Coss UI (Optional)](#9-coss-ui-optional)
10. [HeroUI (Optional)](#10-heroui-optional)
11. [Ark UI (Optional, Headless)](#11-ark-ui-optional-headless)
12. [Recommended Installation Order](#12-recommended-installation-order)
13. [Environment Variables & Keys](#13-environment-variables--keys)

---

## 1. Prerequisites

- **Node.js** 20.x or later
- **npm** / **pnpm** / **yarn** / **bun**

---

## 2. Project Creation (Vite + React + TypeScript)

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Confirm:
- Framework: **React**
- Variant: **TypeScript**

---

## 3. Tailwind CSS v4 + Path Alias

### 3.1 Install Tailwind and Vite plugin

```bash
npm install tailwindcss@latest @tailwindcss/vite@latest
npm install -D @types/node
```

### 3.2 Vite config (path alias + Tailwind)

**`vite.config.ts`:**

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### 3.3 TypeScript path alias

**`tsconfig.json`** — add under `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**`tsconfig.app.json`** — same:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3.4 Base CSS (before adding DaisyUI)

**`src/index.css`** (or `src/styles/globals.css`):

```css
@import "tailwindcss";
```

---

## 4. DaisyUI + Themes

DaisyUI provides theme tokens and components. We use it for **theming** (multiple colorways) and selected components (badges, buttons, cards where we want theme-aware styling).

### 4.1 Install

```bash
npm i -D daisyui@latest
```

### 4.2 Add to CSS

**`src/index.css`:**

```css
@import "tailwindcss";
@plugin "daisyui";
```

### 4.3 Enable specific themes (recommended for Playto)

Use a curated set of themes instead of `all` to keep bundle and clarity. Example: light as default, dark for `prefers-color-scheme: dark`, plus a few flavor themes.

```css
@import "tailwindcss";
@plugin "daisyui";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake, nord, sunset, dracula, forest;
}
```

- **light** — default theme  
- **dark** — when user OS is dark  
- **cupcake, nord, sunset, dracula, forest** — optional themes user can switch to via `data-theme`

### 4.4 Enable all 35 built-in themes (optional)

```css
@plugin "daisyui" {
  themes: all;
}
```

### 4.5 Apply theme on the page

**Default (no attribute):** uses `light` (or whatever is `--default`).

**Per page/section:**

```html
<html data-theme="cupcake">
```

**Per section:**

```html
<div data-theme="nord">This block uses nord.</div>
```

### 4.6 Theme switcher (save to localStorage)

Use a dropdown or button list that sets `document.documentElement.setAttribute('data-theme', themeName)` and saves to `localStorage`, then on load reads and applies. No extra package required; optional: [theme-change](https://github.com/saadeghi/theme-change) if you want a small helper.

Example (inline):

```ts
const themes = ["light", "dark", "cupcake", "nord", "sunset", "dracula", "forest"];
function setTheme(name: string) {
  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("playto-theme", name);
}
// On app mount: const saved = localStorage.getItem("playto-theme"); if (saved) setTheme(saved);
```

### 4.7 Custom theme (optional)

```css
@plugin "daisyui/theme" {
  name: "playto";
  default: false;
  prefersdark: false;
  color-scheme: light;
  --color-primary: oklch(55% 0.3 240);
  /* ... rest of variables (see DaisyUI docs) */
}
```

Then add `playto` to the `themes` list and use `data-theme="playto"`.

---

## 5. ShadCN/ui (Vite)

ShadCN is the primary source for **forms, dialogs, cards, buttons, inputs**. It copies components into your repo (no npm package). Use the official Vite setup.

### 5.1 Init (run from project root, e.g. `frontend/`)

```bash
npx shadcn@latest init
```

When prompted:

- **Style:** New York (or Default)
- **Base color:** Neutral / Zinc / etc.
- **CSS variables:** Yes (recommended for theming)
- **Tailwind config:** Use existing (we already have Tailwind v4 in CSS)
- **Components path:** `@/components/ui`
- **Utils path:** `@/lib/utils`

This creates `components.json` and adds the `cn()` helper (e.g. in `src/lib/utils.ts`).

### 5.2 Add components

Add only what you need:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

Usage:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
```

### 5.3 Coexistence with DaisyUI

- **Tailwind:** One Tailwind config (v4 in CSS). DaisyUI and ShadCN both use Tailwind; no conflict.
- **Themes:** DaisyUI’s `data-theme` changes CSS variables. ShadCN components that use CSS variables (e.g. `hsl(var(--primary))`) will follow the active theme if you map DaisyUI theme tokens to the same variable names in a layer, or use ShadCN’s default variables and switch them via `[data-theme="..."]` overrides. For Playto we can either: (a) use ShadCN variables as primary and DaisyUI for non-ShadCN pieces, or (b) define a single set of variables that both respect (recommended: ShadCN vars in `:root` and per `[data-theme]` override for DaisyUI themes).
- **Components:** Prefer ShadCN for buttons/inputs/cards/dialogs; use DaisyUI for badges, stats, or theme-specific blocks where DaisyUI classes are quicker.

---

## 6. Magic UI

Magic UI components are designed for Next.js but can be adapted for Vite/React. They use the **shadcn CLI** and copy source into your project.

### 6.1 Add via ShadCN CLI

```bash
npx shadcn@latest add https://magicui.design/r/blur-fade.json
npx shadcn@latest add https://magicui.design/r/globe.json
```

Or use the Magic UI registry (if they expose a registry URL):

```bash
pnpm dlx shadcn@latest add @magicui/globe
```

Check [Magic UI docs](https://magicui.design/docs) for the exact add command per component. After add, components land in `src/components/ui/` (e.g. `blur-fade.tsx`, `globe.tsx`).

### 6.2 Refactor for Vite/React

- Remove any `"use client"` (not needed in Vite; keep if you like, no harm).
- Replace Next.js `Image` with `<img>` or a small wrapper.
- Replace `next/link` with React Router’s `Link` or `<a>`.
- Ensure any dynamic imports or lazy loading use Vite-compatible syntax.

### 6.3 Suggested components for Playto

- **Blur fade** — subtle entrance for feed items or leaderboard.
- **Shine / Shine border** — cards or buttons.
- **Grid / Dot pattern** — background for hero or sections.
- **Marquee** — optional leaderboard ticker or logos.

---

## 7. Aceternity UI

Aceternity uses the **shadcn CLI** with a custom registry. Components are copied into the project; refactor Next.js-specific code for Vite.

### 7.1 Add Aceternity registry to `components.json`

Edit `components.json` (created by ShadCN init) and add:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { ... },
  "aliases": { ... },
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

### 7.2 Install components

```bash
npx shadcn@latest add @aceternity/bento-grid
npx shadcn@latest add @aceternity/3d-card
npx shadcn@latest add https://ui.aceternity.com/registry/aurora-background.json
```

Browse: [Aceternity UI](https://ui.aceternity.com/).

### 7.3 Refactor for Vite/React

- Replace `next/link` → `Link` (react-router-dom) or `<a>`.
- Replace `next/image` → `<img>` or local component.
- Remove or replace `next/navigation` (use React Router hooks).
- Keep Framer Motion if the component uses it (`npm install framer-motion`).

### 7.4 Suggested components for Playto

- **Bento grid** — feed layout or feature blocks.
- **3D card** — post cards or leaderboard cards.
- **Aurora background** — hero or auth background.
- **Animated tooltip** — post/comment actions.

---

## 8. Luxe UI

Luxe uses its own CLI and adds components that may depend on Tailwind + path alias. It’s built for Vite.

### 8.1 Init (from frontend root)

```bash
npx luxe init
```

This installs dependencies and adds the `cn` util and any global styles. If it asks for path alias, use `@/*` → `./src/*` to match our setup.

### 8.2 Add components

```bash
npx luxe add
```

Select components from the list (e.g. button, card, input). Or add by name:

```bash
npx luxe add button card
```

Components are typically placed under `src/components/` (check CLI output).

### 8.3 Integration

- Ensure Luxe’s Tailwind/content paths include your `src` and component paths.
- If Luxe injects its own CSS variables, align with DaisyUI/ShadCN or scope to avoid overriding.

---

## 9. Coss UI (Optional)

Coss UI is built on Base UI and styled with Tailwind. Install via ShadCN CLI.

### 9.1 Add registry (if available)

Check [coss.com/ui](https://coss.com/ui) for registry URL. Example pattern:

```json
"registries": {
  "@coss": "https://coss.com/ui/registry/{name}.json"
}
```

### 9.2 Install

```bash
npx shadcn@latest add @coss/ui
npx shadcn@latest add @coss/colors-neutral
```

Use for primitives (dialog, tabs, etc.) if you prefer Base UI over Radix. Optional for Playto.

---

## 10. HeroUI (Optional)

HeroUI v2 supports Vite but is being deprecated in favor of v3. Use only if you need specific HeroUI components and accept migration later.

### 10.1 Install (Vite)

```bash
npx heroui@latest init
```

Select Vite, React, Tailwind v4. Then add components:

```bash
npx heroui@latest add button
```

### 10.2 Provider

Wrap the app with `HeroUIProvider` (see HeroUI docs). May conflict with ShadCN/DaisyUI if both style the same elements; prefer one primary system (ShadCN + DaisyUI) and use HeroUI only for isolated widgets if needed.

---

## 11. Ark UI (Optional, Headless)

Ark UI is **headless** (no default styles). Use for behavior (accordion, tabs, tooltip) and style with Tailwind via `data-scope` / `data-part` / `data-state`.

### 11.1 Install

```bash
npm install @ark-ui/react
```

### 11.2 Use and style

```tsx
import { Accordion } from '@ark-ui/react/accordion'
// Style with Tailwind: className="..." or data attributes
```

See [Ark UI styling](https://ark-ui.com/react-docs/styling). Use where you need accessible behavior without pulling in another full UI library.

---

## 12. Recommended Installation Order

Follow this order to avoid conflicts and ensure path alias + Tailwind are in place first:

| Step | Task | Command / Action |
|------|------|-------------------|
| 1 | Create Vite React TS project | `npm create vite@latest frontend -- --template react-ts` |
| 2 | Install Tailwind v4 + @types/node | `npm install tailwindcss @tailwindcss/vite`; `npm i -D @types/node` |
| 3 | Configure Vite (alias + Tailwind plugin) | Edit `vite.config.ts` |
| 4 | Configure TS path alias | Edit `tsconfig.json` and `tsconfig.app.json` |
| 5 | Base CSS | `@import "tailwindcss";` in `src/index.css` |
| 6 | DaisyUI + themes | `npm i -D daisyui`; add `@plugin "daisyui"` and themes in CSS |
| 7 | ShadCN init | `npx shadcn@latest init` |
| 8 | ShadCN components | `npx shadcn@latest add button card input ...` |
| 9 | Aceternity registry + components | Edit `components.json`; `npx shadcn@latest add @aceternity/...` |
| 10 | Magic UI components | `npx shadcn@latest add <magicui-url>` (per Magic UI docs) |
| 11 | Luxe init + add | `npx luxe init`; `npx luxe add ...` |
| 12 | Clerk (frontend) | `npm install @clerk/clerk-react`; wrap app with `ClerkProvider` |
| 13 | React Query, React Router | `npm install @tanstack/react-query react-router-dom` |

---

## 13. Environment Variables & Keys

### Frontend (Vite)

All client-side env vars **must** be prefixed with `VITE_`. Create `.env` and `.env.production` in `frontend/`:

| Variable | Description | Who provides |
|----------|-------------|--------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | You (Clerk dashboard) |
| `VITE_API_URL` | Backend API base URL (e.g. `https://api.playto.railway.app` or `http://localhost:8000`) | You / deploy |

Optional:

- `VITE_APP_NAME` — app name for titles.

### Backend (Django)

In backend `.env` or platform env (Railway, etc.):

| Variable | Description | Who provides |
|----------|-------------|--------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | You (Supabase project settings) |
| `SECRET_KEY` | Django secret key | You (generate once) |
| `CLERK_JWT_ISSUER` | Clerk JWT issuer URL (e.g. `https://your-clerk-domain.clerk.accounts.dev`) | Clerk dashboard |
| `CLERK_PUBLISHABLE_KEY` or JWKS URL | For JWT verification (optional if using issuer + JWKS from Clerk) | Clerk |

### Keys you must provide

1. **Clerk:** Create application at [clerk.com](https://clerk.com). Copy **Publishable key** → `VITE_CLERK_PUBLISHABLE_KEY`; use **Secret key** or JWT verification config for Django.
2. **Supabase:** Create project at [supabase.com](https://supabase.com). In Settings → Database copy **Connection string (URI)** → `DATABASE_URL` (use pooler if you prefer).
3. **Django:** Generate `SECRET_KEY` (e.g. `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`).

---

## Quick reference: Where components live

| Library | Typical path | How to add |
|---------|----------------|------------|
| ShadCN | `src/components/ui/*.tsx` | `npx shadcn@latest add <name>` |
| Magic UI | `src/components/ui/*.tsx` | ShadCN add with Magic UI URL |
| Aceternity | `src/components/ui/*.tsx` | `npx shadcn@latest add @aceternity/<name>` |
| Luxe | `src/components/...` (see CLI) | `npx luxe add <name>` |
| DaisyUI | No path; use Tailwind classes | `className="btn btn-primary"` etc. |

Use this doc whenever you add a new library or onboard someone to the project.
