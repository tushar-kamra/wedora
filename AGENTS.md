# Wedora — Workspace Agent Rules & Workflow Guidelines

These rules apply across the entire **Wedora** repository and must be followed in every conversation turn.

## 1. Source-of-Truth Documentation & Progress Tracking

1. **Always Consult `docs/PROGRESS.md` First:**
   - Before planning, designing, or implementing any feature, read [`docs/PROGRESS.md`](./docs/PROGRESS.md) to understand what UI components, design tokens, routes, services, and database models have already been built and how to reuse them.
   - Treat [`docs/PRD.md`](./docs/PRD.md), [`docs/SYSTEM_DESIGN.md`](./docs/SYSTEM_DESIGN.md), [`docs/DATABASE_DESIGN.md`](./docs/DATABASE_DESIGN.md), and [`docs/API_DESIGN.md`](./docs/API_DESIGN.md) as the authoritative product and technical specifications.

2. **Always Update `docs/PROGRESS.md` After Building:**
   - Every time a UI screen, shared component, API endpoint, domain service, database model, or architectural decision is created or modified, update [`docs/PROGRESS.md`](./docs/PROGRESS.md) in the same milestone:
     - Update the **High-Level Phase Matrix** (UI, Backend/API, Database status).
     - Add new reusable components, tokens, routes, or modules to **Section 2 (Reusable Foundations & Inventory)**.
     - Record any new architectural or product clarifications in **Section 3 (Frozen Decisions)**.
     - Append a concise entry to **Section 4 (Chronological Milestone Log)**.

## 2. Development & Approval Workflow

1. **Clarify Before Implementing:**
   - When starting a new screen, module, or phase—or if there is any ambiguity between Stitch designs and the PRD/API/Database docs—ask focused clarifying questions first before writing implementation code.
2. **Respect Scope & Step-by-Step Instructions:**
   - If the user asks for UI-only work, do not add backend logic or database code until requested.
   - Strictly adhere to Wedora V1 product boundaries defined in `docs/PRD.md` (do not introduce non-V1 features like hotel room allocation, flight tracking, or payment installment schedules).
3. **Reuse the Global Stitch Design System:**
   - All UI screens must use the global Stitch color tokens, spacing scale, and typography utilities (`Newsreader` headlines + `Plus Jakarta Sans` body/labels) defined in [`src/app/globals.css`](./src/app/globals.css) and [`src/app/layout.tsx`](./src/app/layout.tsx).
4. **Secret & Credential Safety:**
   - Never commit `.env*`, `.vscode/mcp.json`, `.agents/plugins/stitch/mcp_config.json`, or raw API keys/tokens to Git.

