# Wedora — Project Progress & Architecture Ledger

> **Purpose:** This document is the single source of truth for implementation progress in **Wedora V1**. Every time a UI screen, component, API endpoint, service, or database model is built or updated, this file must be updated so future work can seamlessly build on top of existing foundations.

---

## 1. High-Level Phase Matrix

| Phase | Milestone | UI Status | Backend / API Status | Database / Models Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Phase 0** | Architecture Review & Folder Structure | ✅ Done | ✅ Done | ✅ Done | 10 domain modules, Next.js App Router, config & dependencies installed |
| **Phase 1A** | Marketing Landing Page (`/`) & Global Design Tokens | ✅ Done | N/A | N/A | Built from Stitch screen `d1404416fd8c454f80ea3eea4be6e73f` |
| **Phase 1B** | Authentication (`login`, `signup`, `forgot/reset-password`, `me`, `logout`) | ✅ Done | ✅ Done | ✅ Done | UI from Stitch `8730c8b34c394d2b8bbdd092b51db69d`, custom session auth (`wedora_session`), Mongoose models, Zod validation & unit tests |
| **Phase 2** | Wedding Setup (`/create-wedding`), Dashboard Shell & Members | ✅ Done | ✅ Done | ✅ Done | UI from Stitch (`56e723adfeeb4b1e87c8b22dd9a7326d`, `08675e3eb965472ea16c20a624fb112f`, `099c80f09402448c91c15d685b875c4d`), atomic Wedding + `ADMIN` membership creation, Dashboard aggregation, Member invitations & RBAC |
| **Phase 3** | Events & Tasks Management | ⏳ Next | ⏳ Pending | ⏳ Pending | Event archiving (`archivedAt`), Task filters & concurrency check |
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
- **Stitch Design System:** `assets/2d6041e424d44fe4b65dc199e42dafdb` (*Wedora*)
- **Available Stitch Screens:**
  1. **Desktop SaaS Landing Page:** `d1404416fd8c454f80ea3eea4be6e73f` — **Implemented** at `/`
  2. **Sign In Screen (Validated):** `8730c8b34c394d2b8bbdd092b51db69d` — **Implemented** across `/login`, `/signup`, `/forgot-password`, `/reset-password`
  3. **Wedora — Create Your Wedding Workspace:** `56e723adfeeb4b1e87c8b22dd9a7326d` — **Implemented** at `/create-wedding`
  4. **Wedora — Wedding Overview Dashboard:** `08675e3eb965472ea16c20a624fb112f` — **Implemented** at `/app` (with `DashboardShell`)
  5. **Wedora — Wedding Members & Family Collaboration:** `099c80f09402448c91c15d685b875c4d` — **Implemented** at `/app/members` (plus `/member-invitations/[token]`)

### 2.3 Implemented Frontend Routes & Components
- **`/` (Marketing Landing Page):** [`src/app/(marketing)/page.tsx`](../src/app/(marketing)/page.tsx)
  - [`src/components/features/marketing/landing-header.tsx`](../src/components/features/marketing/landing-header.tsx) — Sticky navbar linking to `#product`, `#features`, `#how-it-works`, `#about`, `/login`, and `/signup`.
  - [`src/components/features/marketing/hero-section.tsx`](../src/components/features/marketing/hero-section.tsx) — Editorial hero + SaaS workspace preview card.
  - [`src/components/features/marketing/value-proposition-section.tsx`](../src/components/features/marketing/value-proposition-section.tsx) — *"The Wedora Standard"* 4-column benefit grid.
  - [`src/components/features/marketing/features-bento-section.tsx`](../src/components/features/marketing/features-bento-section.tsx) — 6-card Bento grid aligned with PRD V1 features and `₹` formatting.
  - [`src/components/features/marketing/how-it-works-section.tsx`](../src/components/features/marketing/how-it-works-section.tsx) — 3-step onboarding cards.
  - [`src/components/features/marketing/impact-section.tsx`](../src/components/features/marketing/impact-section.tsx) — Metrics & verified couple testimonial card.
  - [`src/components/features/marketing/cta-and-footer-section.tsx`](../src/components/features/marketing/cta-and-footer-section.tsx) — Plum CTA banner & 4-column footer.
- **Authentication Routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`):**
  - [`src/app/(auth)/layout.tsx`](../src/app/(auth)/layout.tsx) — Shared 2-column split auth shell (`45%` form card + `55%` `AuthEditorialPanel`) with top header and `Back to Home` link.
  - [`src/components/features/auth/auth-editorial-panel.tsx`](../src/components/features/auth/auth-editorial-panel.tsx) — Stitch right-column editorial showcase (`Celebration Countdown`, `Guest RSVP Response`, `Key Itinerary Moments`).
  - [`src/components/features/auth/auth-alert-banner.tsx`](../src/components/features/auth/auth-alert-banner.tsx) — Reusable muted rose error banner & plum success status banner.
  - [`src/components/features/auth/password-input.tsx`](../src/components/features/auth/password-input.tsx) — Reusable password field with visibility toggle (`visibility` / `visibility_off`), hint, error ring, and optional `Forgot password?` link.
  - [`src/components/features/auth/sign-out-button.tsx`](../src/components/features/auth/sign-out-button.tsx) — Client sign-out button calling `POST /api/auth/logout` and redirecting to `/login`.
  - [`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx) & [`src/components/features/auth/login-form.tsx`](../src/components/features/auth/login-form.tsx) — Sign In screen connected to `POST /api/auth/login`.
  - [`src/app/(auth)/signup/page.tsx`](../src/app/(auth)/signup/page.tsx) & [`src/components/features/auth/signup-form.tsx`](../src/components/features/auth/signup-form.tsx) — Sign Up screen connected to `POST /api/auth/signup`.
  - [`src/app/(auth)/forgot-password/page.tsx`](../src/app/(auth)/forgot-password/page.tsx) & [`src/components/features/auth/forgot-password-form.tsx`](../src/components/features/auth/forgot-password-form.tsx) — Account recovery request screen connected to `POST /api/auth/forgot-password`.
  - [`src/app/(auth)/reset-password/page.tsx`](../src/app/(auth)/reset-password/page.tsx) & [`src/components/features/auth/reset-password-form.tsx`](../src/components/features/auth/reset-password-form.tsx) — Token-based password reset screen connected to `POST /api/auth/reset-password`.
- **Phase 2 Workspace Setup, Dashboard Shell, Overview & Members Routes:**
  - [`src/components/layout/dashboard-shell.tsx`](../src/components/layout/dashboard-shell.tsx) & [`src/app/(dashboard)/app/layout.tsx`](../src/app/(dashboard)/app/layout.tsx) — Shared authenticated dashboard shell (`260px` desktop sidebar, mobile slide-over drawer, wedding switcher pill with `ADMIN`/`MANAGER` role badge, 11 navigation items with active route highlighting, user profile footer with sign-out button, and fixed top header bar).
  - [`src/app/(dashboard)/create-wedding/page.tsx`](../src/app/(dashboard)/create-wedding/page.tsx) & [`src/components/features/wedding/create-wedding-form.tsx`](../src/components/features/wedding/create-wedding-form.tsx) — 12-column split Wedding Setup screen (`7 cols` setup form + `5 cols` live Workspace Blueprint preview card) with automatic slug generator (`groom-bride-ddmmyyyy`), manual slug override, copy-link action, and validation.
  - [`src/app/(dashboard)/app/page.tsx`](../src/app/(dashboard)/app/page.tsx) & [`src/components/features/wedding/dashboard-overview.tsx`](../src/components/features/wedding/dashboard-overview.tsx) — Wedding Overview Dashboard with 6 KPI cards (`Countdown`, `Ceremonies`, `Tasks Progress`, `Guest RSVPs`, `Expenses Recorded` in `₹`, `Vendors Booked`), `Upcoming Ceremonies & Events` 7-col timeline, interactive `Upcoming Tasks` 5-col checklist (with live checkbox toggle & quick-add task input), and V1-aligned Row 3 (`Website, QR Photo Gallery & Livestream` + `Spending by Category`).
  - [`src/app/(dashboard)/app/members/page.tsx`](../src/app/(dashboard)/app/members/page.tsx) & [`src/components/features/members/members-management-view.tsx`](../src/components/features/members/members-management-view.tsx) — Wedding Members & Family Collaboration screen with inline Invite Member form (`Email` + `MANAGER | ADMIN`), Active Members table with role tabs (`All`, `Admins`, `Managers`), live search, role selector, last-admin lock safeguard, Pending Invitations table (`Copy Invite Link`, `Preview`, `Revoke`), and 3 V1 permission cards.
  - [`src/app/member-invitations/[token]/page.tsx`](../src/app/member-invitations/[token]/page.tsx) & [`src/components/features/members/member-invitation-card.tsx`](../src/components/features/members/member-invitation-card.tsx) — Public member invitation acceptance screen supporting `PENDING`, `ACCEPTED`, `EXPIRED`, and `REVOKED` states.
- **Frontend API Client Helpers:**
  - [`src/lib/api/client.ts`](../src/lib/api/client.ts) — Typed `apiRequest<T>()` wrapper & `ApiClientError` class parsing `{ error: { code, message, details } }`.
  - [`src/lib/api/auth.ts`](../src/lib/api/auth.ts) — Typed client functions: `signupApi`, `loginApi`, `logoutApi`, `getMeApi`, `forgotPasswordApi`, `resetPasswordApi`.
  - [`src/lib/api/wedding.ts`](../src/lib/api/wedding.ts) — Typed client functions: `createWeddingApi`, `getWeddingApi`, `updateWeddingApi`, `getDashboardApi`.
  - [`src/lib/api/members.ts`](../src/lib/api/members.ts) — Typed client functions: `listMembersApi`, `listPendingInvitationsApi`, `inviteMemberApi`, `revokeInvitationApi`, `updateMemberRoleApi`, `removeMemberApi`, `getPublicMemberInvitationApi`, `acceptMemberInvitationApi`.

### 2.4 Backend Modules, Database Models & Server Infrastructure
- **Shared API Types:** [`src/types/api.ts`](../src/types/api.ts) (`ApiErrorCode`, `ApiSuccessResponse`, `ApiPaginatedResponse`, `ApiActionResponse`, `ApiErrorResponse`).
- **Server Config & Database:**
  - [`src/server/config/env.ts`](../src/server/config/env.ts) — Zod-validated server environment (`getServerEnv()`).
  - [`src/server/db/mongoose.ts`](../src/server/db/mongoose.ts) — Global cached Mongoose connection helper (`connectToDatabase()`).
- **HTTP Error & Response Helpers:**
  - [`src/server/http/errors.ts`](../src/server/http/errors.ts) — `AppError` + factory helpers (`createValidationError`, `createUnauthenticatedError`, `createForbiddenError`, `createNotFoundError`, `createConflictError`, `createInvalidTokenError`, `createTokenExpiredError`, `createRateLimitedError`).
  - [`src/server/http/response.ts`](../src/server/http/response.ts) — `ok()`, `created()`, `paginated()`, `actionOk()`, `handleApiError()`.
- **Security, Auth Crypto, Session & Email:**
  - [`src/server/security/rate-limit.ts`](../src/server/security/rate-limit.ts) — In-memory sliding window rate limiter (`assertRateLimit`, `getClientIp`).
  - [`src/server/auth/crypto.ts`](../src/server/auth/crypto.ts) — `normalizeEmail()`, `hashPassword()`, `verifyPassword()` (`crypto.scrypt` + `timingSafeEqual`), `generateRandomToken()`, `hashToken()` (HMAC-SHA-256).
  - [`src/server/auth/cookies.ts`](../src/server/auth/cookies.ts) — `wedora_session` HTTP-only cookie helpers (`setSessionCookie`, `clearSessionCookie`, `getSessionTokenFromCookies`).
  - [`src/server/auth/session.ts`](../src/server/auth/session.ts) — Server session resolvers (`requireAuth()`, `requireWeddingMember()`, `requireWeddingAdmin()`, `getOptionalAuth()`).
  - [`src/server/email/resend.ts`](../src/server/email/resend.ts) — `sendPasswordResetEmail()` and `sendMemberInvitationEmail()` via Resend SDK with automatic dev console fallback when using placeholder key.
- **Mongoose Models Implemented:**
  - [`src/modules/auth/user.model.ts`](../src/modules/auth/user.model.ts) — `users` collection (`unique(emailNormalized)`).
  - [`src/modules/auth/session.model.ts`](../src/modules/auth/session.model.ts) — `sessions` collection (`unique(tokenHash)`, `index(userId)`, `TTL(expiresAt)`).
  - [`src/modules/auth/password-reset-token.model.ts`](../src/modules/auth/password-reset-token.model.ts) — `password_reset_tokens` collection (`unique(tokenHash)`, `index(userId)`, `TTL(expiresAt)`).
  - [`src/modules/wedding/wedding.model.ts`](../src/modules/wedding/wedding.model.ts) — `weddings` collection (`unique(website.slug)`, `unique(gallery.tokenHash)`, `index(createdAt)`).
  - [`src/modules/members/membership.model.ts`](../src/modules/members/membership.model.ts) — `wedding_memberships` collection (`unique(userId)`, `unique(weddingId, userId)`, `index(weddingId, role)`).
  - [`src/modules/members/member-invitation.model.ts`](../src/modules/members/member-invitation.model.ts) — `wedding_member_invitations` collection (`unique(tokenHash)`, `index(weddingId, status)`, `index(emailNormalized)`, `index(expiresAt)`, partial unique `{ weddingId, emailNormalized }` where `status = 'PENDING'`).
- **Auth Domain Module & REST Endpoints:**
  - [`src/modules/auth/auth.types.ts`](../src/modules/auth/auth.types.ts), [`src/modules/auth/auth.validation.ts`](../src/modules/auth/auth.validation.ts), [`src/modules/auth/auth.repository.ts`](../src/modules/auth/auth.repository.ts), [`src/modules/auth/auth.service.ts`](../src/modules/auth/auth.service.ts).
  - `POST /api/auth/signup` ([`src/app/api/auth/signup/route.ts`](../src/app/api/auth/signup/route.ts))
  - `POST /api/auth/login` ([`src/app/api/auth/login/route.ts`](../src/app/api/auth/login/route.ts))
  - `POST /api/auth/logout` ([`src/app/api/auth/logout/route.ts`](../src/app/api/auth/logout/route.ts))
  - `GET /api/auth/me` ([`src/app/api/auth/me/route.ts`](../src/app/api/auth/me/route.ts))
  - `POST /api/auth/forgot-password` ([`src/app/api/auth/forgot-password/route.ts`](../src/app/api/auth/forgot-password/route.ts))
  - `POST /api/auth/reset-password` ([`src/app/api/auth/reset-password/route.ts`](../src/app/api/auth/reset-password/route.ts))
- **Wedding & Dashboard Domain Module & REST Endpoints:**
  - [`src/modules/wedding/wedding.types.ts`](../src/modules/wedding/wedding.types.ts), [`src/modules/wedding/wedding.validation.ts`](../src/modules/wedding/wedding.validation.ts), [`src/modules/wedding/wedding.repository.ts`](../src/modules/wedding/wedding.repository.ts), [`src/modules/wedding/wedding.service.ts`](../src/modules/wedding/wedding.service.ts).
  - `POST /api/wedding`, `GET /api/wedding`, `PATCH /api/wedding` ([`src/app/api/wedding/route.ts`](../src/app/api/wedding/route.ts))
  - `GET /api/dashboard` ([`src/app/api/dashboard/route.ts`](../src/app/api/dashboard/route.ts))
- **Members & Invitations Domain Module & REST Endpoints:**
  - [`src/modules/members/members.types.ts`](../src/modules/members/members.types.ts), [`src/modules/members/members.validation.ts`](../src/modules/members/members.validation.ts), [`src/modules/members/members.repository.ts`](../src/modules/members/members.repository.ts), [`src/modules/members/members.service.ts`](../src/modules/members/members.service.ts).
  - `GET /api/members` ([`src/app/api/members/route.ts`](../src/app/api/members/route.ts))
  - `GET /api/members/invitations`, `POST /api/members/invitations` ([`src/app/api/members/invitations/route.ts`](../src/app/api/members/invitations/route.ts))
  - `DELETE /api/members/invitations/:invitationId` ([`src/app/api/members/invitations/[invitationId]/route.ts`](../src/app/api/members/invitations/[invitationId]/route.ts))
  - `PATCH /api/members/:membershipId`, `DELETE /api/members/:membershipId` ([`src/app/api/members/[membershipId]/route.ts`](../src/app/api/members/[membershipId]/route.ts))
  - `GET /api/public/member-invitations/:token` ([`src/app/api/public/member-invitations/[token]/route.ts`](../src/app/api/public/member-invitations/[token]/route.ts))
  - `POST /api/member-invitations/:token/accept` ([`src/app/api/member-invitations/[token]/accept/route.ts`](../src/app/api/member-invitations/[token]/accept/route.ts))
- **Unit Tests:** [`tests/unit/auth.test.ts`](../tests/unit/auth.test.ts) & [`tests/unit/wedding-members.test.ts`](../tests/unit/wedding-members.test.ts) (10 passing unit tests).

---

## 3. Frozen Architectural & Product Decisions

1. **Co-located Domain Modules (`src/modules/<domain>/*`):** Each module owns its Mongoose model, repository, service, Zod schemas, and TypeScript types (`auth`, `wedding`, `members`, `events`, `tasks`, `guests`, `expenses`, `vendors`, `photos`, `email-jobs`).
2. **Server-Only Isolation (`src/server/*`):** Database connection pooling, auth session/cookie/token helpers, HTTP response/error wrappers, rate limiting, and external provider adapters (Cloudflare R2, Resend, Google Places) live in `src/server/`.
3. **Authenticated Route Prefix (`/app/*`):** All private Wedding Member workspace pages live under `/app/*` (`src/app/(dashboard)/app/*`), while onboarding lives at `/create-wedding`.
4. **Stable Sharing Tokens:** Guest invitation tokens (`Guest.invitationToken`) and gallery sharing tokens (`Wedding.gallery.token`) use 32-byte cryptographically random base64url strings excluded from default queries and logs (`select: false`) so links and QR codes can be repeatedly retrieved, while session, password-reset, and member-invitation tokens use one-way HMAC-SHA-256 hashes (`tokenHash`).
5. **Password Hashing & Timing Safety:** Passwords use Node's built-in `crypto.scrypt` with a 16-byte random salt and `crypto.timingSafeEqual`, plus a dummy scrypt verification on unknown emails during login to prevent timing enumeration.
6. **PRD V1 Scope Discipline:** All UI copy and features strictly reflect V1 capabilities (no hotel room allocation, flight tracking, budget variance/installment schedules, or multi-wedding planner accounts).

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
- **2026-11-05 — Milestone 3: Phase 1B Step 1 — Authentication UI Screens (`1b9df0e`)**
  - Built shared 2-column Stitch auth layout (`src/app/(auth)/layout.tsx`) and editorial right-column showcase (`AuthEditorialPanel`).
  - Implemented `/login`, `/signup`, `/forgot-password`, and `/reset-password` UI screens with interactive client-side validation, password visibility toggle, muted rose error alerts, and loading states.
- **2026-11-05 — Milestone 4: Phase 1B Step 2 — Authentication Backend, Database Models & UI Wiring (`4ff1066`)**
  - Built shared server infrastructure (`src/server/config/env.ts`, `src/server/db/mongoose.ts`, `src/server/http/*`, `src/server/security/rate-limit.ts`, `src/server/auth/*`, `src/server/email/resend.ts`).
  - Implemented `UserModel`, `SessionModel`, `PasswordResetTokenModel`, `WeddingModel`, and `WeddingMembershipModel`.
  - Implemented `AuthService`, `AuthRepository`, Zod schemas, and all 6 `/api/auth/*` REST endpoints (`signup`, `login`, `logout`, `me`, `forgot-password`, `reset-password`).
  - Connected `/login`, `/signup`, `/forgot-password`, and `/reset-password` forms to the backend and added authenticated `/create-wedding` and `/app` placeholder routes with `SignOutButton`.
- **2026-11-06 — Milestone 5: Phase 2 Step 1 — Wedding Setup, Dashboard Shell, Overview & Members UI**
  - Pulled Stitch screens `56e723adfeeb4b1e87c8b22dd9a7326d`, `08675e3eb965472ea16c20a624fb112f`, and `099c80f09402448c91c15d685b875c4d` from Stitch project `15003352521024248804`.
  - Built `/create-wedding` (`CreateWeddingForm`), shared `/app` layout (`DashboardShell`), `/app` (`DashboardOverview`), `/app/members` (`MembersManagementView`), and `/member-invitations/[token]` (`MemberInvitationCard`) aligned strictly with PRD V1 rules.
- **2026-11-06 — Milestone 6: Phase 2 Step 2 — Wedding, Dashboard & Members Backend APIs, Models & UI Wiring**
  - Implemented `WeddingMemberInvitationModel` (`wedding_member_invitations`) with partial uniqueness on pending invitations.
  - Built `WeddingService` & `WeddingRepository` (`POST /api/wedding` atomic transaction, `GET /api/wedding`, `PATCH /api/wedding` with stable slug, and `GET /api/dashboard` aggregation).
  - Built `MembersService` & `MembersRepository` (`GET /api/members`, `POST /api/members/invitations`, `GET /api/members/invitations`, `DELETE /api/members/invitations/:invitationId`, `PATCH /api/members/:membershipId`, `DELETE /api/members/:membershipId`, `GET /api/public/member-invitations/:token`, `POST /api/member-invitations/:token/accept`) with RBAC, last-Admin protection, and Resend email dispatch.
  - Connected `/create-wedding`, `/app`, `/app/members`, and `/member-invitations/[token]` to the live backend APIs and added unit tests in `tests/unit/wedding-members.test.ts`.
