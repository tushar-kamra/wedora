# Wedora — Project Progress & Architecture Ledger

> **Purpose:** This document is the single source of truth for implementation progress in **Wedora V1**. Every time a UI screen, component, API endpoint, service, or database model is built or updated, this file must be updated so future work can seamlessly build on top of existing foundations.

---

## 1. High-Level Phase Matrix

| Phase | Milestone | UI Status | Backend / API Status | Database / Models Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Phase 0** | Architecture Review & Folder Structure | ✅ Done | ✅ Done | ✅ Done | 10 domain modules, Next.js App Router, config & dependencies installed |
| **Phase 1A** | Marketing Landing Page (`/`) & Global Design Tokens | ✅ Done | N/A | N/A | Built from Stitch screen `d1404416fd8c454f80ea3eea4be6e73f` |
| **Phase 1B** | Authentication (`login`, `signup`, `forgot/reset-password`, `me`, `logout`) | ⏳ Next | ⏳ Pending | ⏳ Pending | Stitch Sign In screen `8730c8b34c394d2b8bbdd092b51db69d` available |
| **Phase 2** | Wedding Setup (`/create-wedding`), Dashboard Shell & Members | ⏳ Pending | ⏳ Pending | ⏳ Pending | Atomic Wedding + `ADMIN` membership creation |
| **Phase 3** | Events & Tasks Management | ⏳ Pending | ⏳ Pending | ⏳ Pending | Event archiving (`archivedAt`), Task filters & concurrency check |
| **Phase 4** | Guests, Invitations, Public RSVP (`/invite/[token]`) & Email Jobs | ⏳ Pending | ⏳ Pending | ⏳ Pending | 32-byte stable `invitationToken`, rate-limited public RSVP, Cron worker |
| **Phase 5** | Expenses (INR Paise) & Vendors + Google Places Discovery | ⏳ Pending | ⏳ Pending | ⏳ Pending | Integer `amountPaise`, `/api/vendor-discovery/search` |
| **Phase 6** | Public Wedding Website (`/w/[slug]`) & YouTube Livestream | ⏳ Pending | ⏳ Pending | ⏳ Pending | `CLASSIC`, `MINIMAL`, `MODERN` themes |
| **Phase 7** | Photo Gallery, Direct R2 Uploads, Guest Gallery (`/gallery/[token]`) & QR | ⏳ Pending | ⏳ Pending | ⏳ Pending | `PENDING` → `READY` → `DELETED` lifecycle, presigned R2 PUT/GET |
| **Phase 8** | Production Readiness, Security & Tenant-Isolation Tests | ⏳ Pending | ⏳ Pending | ⏳ Pending | Cross-wedding `404` isolation, index verification, E2E checks |

---

## 2. Reusable Foundations & Inventory (How to Build on Top of Existing Code)

### 2.1 Global Design System & Typography
Configured globally so all new pages and components automatically inherit the **Wedora Stitch Design System**:
- **Stylesheet & Tokens:** [`src/app/globals.css`](../src/app/globals.css)
  - **Colors:** `bg-surface` (`#fff7fd`), `bg-surface-container-lowest` (`#ffffff`), `bg-surface-container-low` (`#faf1f9`), `bg-surface-container` (`#f4ebf4`), `bg-surface-container-high` (`#eee6ee`), `bg-surface-container-highest` (`#e8e0e8`), `text-on-surface` (`#1e1a20`), `text-on-surface-variant` (`#4c454a`), `bg-primary` (`#322231`), `bg-primary-container` (`#493747`), `text-on-primary` (`#ffffff`), `text-secondary` (`#765562`), `bg-secondary-container` (`#fdd2e1`), `text-on-secondary-container` (`#795864`), `bg-tertiary-fixed` (`#edddf3`), `border-outline-variant` (`#cec3ca`), `text-error` (`#ba1a1a`).
  - **Spacing:** `space-xs` (`4px`), `space-sm` (`8px`), `space-md` (`16px`), `space-lg` (`24px`), `space-xl` (`40px`), `space-2xl` (`64px`), `space-3xl` (`96px`), `px-margin` (`64px`), `px-margin-tablet` (`32px`), `px-margin-mobile` (`20px`), `gap-gutter` (`24px`).
  - **Typography Classes:**
    - Serif (`Newsreader`): `font-display-hero text-display-hero`, `text-display-hero-mobile`, `font-headline-xl text-headline-xl`, `text-headline-xl-mobile`, `font-headline-lg text-headline-lg`, `font-headline-md text-headline-md`, `font-headline-sm text-headline-sm`.
    - Sans (`Plus Jakarta Sans`): `font-body-xl text-body-xl`, `font-body-md text-body-md`, `font-body-sm text-body-sm`, `font-label-lg text-label-lg`, `font-label-md text-label-md`, `font-label-caption text-label-caption`.
- **Root Layout & Fonts:** [`src/app/layout.tsx`](../src/app/layout.tsx)
  - Loads `Newsreader` (`--font-newsreader`) and `Plus Jakarta Sans` (`--font-plus-jakarta`) via `next/font/google`.
  - Loads Google `Material Symbols Outlined` icon font (`<span className="material-symbols-outlined">icon_name</span>`).

### 2.2 Stitch MCP Reference Inventory
- **Plugin Config:** [`.agents/plugins/stitch/plugin.json`](../.agents/plugins/stitch/plugin.json) (MCP credentials in git-ignored `.agents/plugins/stitch/mcp_config.json`)
- **Stitch Project:** `projects/15003352521024248804` (*Wedora Landing Page*)
- **Available Stitch Screens:**
  1. **Desktop SaaS Landing Page:** `d1404416fd8c454f80ea3eea4be6e73f` — **Implemented** at `/`
  2. **Sign In Screen (Validated):** `8730c8b34c394d2b8bbdd092b51db69d` — **Ready for `/login` UI implementation**

### 2.3 Implemented Frontend Routes & Components
- **`/` (Marketing Landing Page):** [`src/app/(marketing)/page.tsx`](../src/app/(marketing)/page.tsx)
  - [`src/components/features/marketing/landing-header.tsx`](../src/components/features/marketing/landing-header.tsx) — Sticky navbar linking to `#product`, `#features`, `#how-it-works`, `#about`, `/login`, and `/signup`.
  - [`src/components/features/marketing/hero-section.tsx`](../src/components/features/marketing/hero-section.tsx) — Editorial hero + SaaS workspace preview card.
  - [`src/components/features/marketing/value-proposition-section.tsx`](../src/components/features/marketing/value-proposition-section.tsx) — *"The Wedora Standard"* 4-column benefit grid.
  - [`src/components/features/marketing/features-bento-section.tsx`](../src/components/features/marketing/features-bento-section.tsx) — 6-card Bento grid aligned with PRD V1 features and `₹` formatting.
  - [`src/components/features/marketing/how-it-works-section.tsx`](../src/components/features/marketing/how-it-works-section.tsx) — 3-step onboarding cards.
  - [`src/components/features/marketing/impact-section.tsx`](../src/components/features/marketing/impact-section.tsx) — Metrics & verified couple testimonial card.
  - [`src/components/features/marketing/cta-and-footer-section.tsx`](../src/components/features/marketing/cta-and-footer-section.tsx) — Plum CTA banner & 4-column footer.

### 2.4 Backend Modules & Infrastructure
- Folder hierarchy is scaffolded under `src/app/api/`, `src/modules/`, `src/server/`, `src/lib/`, `src/types/`, and `tests/`.
- No backend logic files have been added yet (following our UI-first / step-by-step approval workflow).

---

## 3. Frozen Architectural & Product Decisions

1. **Co-located Domain Modules (`src/modules/<domain>/*`):** Each module owns its Mongoose model, repository, service, Zod schemas, and TypeScript types (`auth`, `wedding`, `members`, `events`, `tasks`, `guests`, `expenses`, `vendors`, `photos`, `email-jobs`).
2. **Server-Only Isolation (`src/server/*`):** Database connection pooling, auth session/cookie/token helpers, HTTP response/error wrappers, rate limiting, and external provider adapters (Cloudflare R2, Resend, Google Places) live in `src/server/`.
3. **Authenticated Route Prefix (`/app/*`):** All private Wedding Member workspace pages live under `/app/*` (`src/app/(dashboard)/app/*`).
4. **Stable Sharing Tokens:** Guest invitation tokens (`Guest.invitationToken`) and gallery sharing tokens (`Wedding.gallery.token`) use 32-byte cryptographically random base64url strings excluded from default queries and logs so links and QR codes can be repeatedly retrieved, while session, password-reset, and member-invitation tokens use one-way HMAC-SHA-256 hashes (`tokenHash`).
5. **PRD V1 Scope Discipline:** All UI copy and features strictly reflect V1 capabilities (no hotel room allocation, flight tracking, budget variance/installment schedules, or multi-wedding planner accounts).

---

## 4. Chronological Milestone Log

- **2026-11-05 — Milestone 1: Architecture Approval & Workspace Scaffolding (`0381fd7`)**
  - Reviewed `PRD.md`, `SYSTEM_DESIGN.md`, `DATABASE_DESIGN.md`, and `API_DESIGN.md`.
  - Approved modular monolith folder structure, configured Next.js 15 + TypeScript + Tailwind v4 + Vitest (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.env.example`, `.gitignore`), and installed dependencies.
  - Created and pushed `dev` branch.
- **2026-11-05 — Milestone 2: Stitch MCP Integration & Landing Page UI (`a9306a0`)**
  - Connected Google Stitch MCP via `.agents/plugins/stitch/` and ignored secret config in `.gitignore`.
  - Configured global Stitch design tokens and `Newsreader` + `Plus Jakarta Sans` fonts in `src/app/globals.css` and `src/app/layout.tsx`.
  - Implemented the responsive Landing Page UI in `src/app/(marketing)/page.tsx` and `src/components/features/marketing/*`.

