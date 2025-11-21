# Shopify-Scale Commerce Build Plan

## 1. Objectives
- Deliver a single online-store channel with Shopify-level feature depth.
- Keep React + TypeScript + Tailwind as the UI stack; Node/Express + MongoDB for APIs already in repo.
- Maintain tight Cursor/21st.dev integration for AI-assisted flows.

## 2. Architectural Pillars
1. **App Shell**: Vite + React Router + React Query + Zustand for global state.
2. **Domain Modules** (each self-contained): Products, Orders, Customers, Discounts, Inventory/Collections, Settings, Analytics.
3. **API Layer**: `/server` Express routes per module, using controllers/services/models to isolate business logic. Shared DTO validation via `zod`.
4. **Design System**: Tailwind + custom component library derived from Figma tokens (`@/ui`). Themeable, responsive, accessible.
5. **Data & Caching**: React Query hooks hitting `/api/v1/*`, optimistic updates, background revalidation.

## 3. Feature Breakdown
### Products
- CRUD with variants, pricing tiers, inventory counts, media gallery.
- Collections assignment (manual + automated rules).
- Bulk edit + CSV import/export.

### Orders
- Filter/search, status pipeline, timeline notes, invoicing PDF.
- Payment/refund actions, fulfillment tracking, delivery method summary.

### Customers
- Profiles with order history, notes, marketing opt-ins.
- Segments (dynamic filters) + saved views.

### Discounts & Marketing
- Codes (amount, percentage, BOGO), usage limits, schedule.
- Campaign dashboard with performance metrics.

### Sales Channel (Online Store)
- Publishing toggle per product/collection.
- Theme preview + storefront status health checks.

### Analytics Dashboard
- KPI cards (GMV, AOV, conversion), charts (sales vs. target, orders by status, customer cohorts).
- Exportable reports.

### Settings
- Payments, shipping zones, tax rules, integrations, notification email settings.
- Audit log for change tracking.

### Inventory & Collections
- Multi-location stock, low-stock alerts, transfers.
- Smart collections with rule builder.

## 4. Technical Roadmap
1. **Foundation (Week 1)**
   - Add TypeScript toolchain + `tsconfig`.
   - Introduce routing, Query client providers, Zustand store skeleton.
   - Set up folder convention: `src/modules/<domain>` with `components`, `hooks`, `api`, `types`.
2. **Products Module (Week 1-2)**
   - Backend: products schema, routes, controllers, tests.
   - Frontend: Product list/table, detail drawer, variant editor, media uploader stub.
3. **Orders Module (Week 2)**
   - Order APIs, search, status transitions.
   - UI pages + timeline components.
4. **Customers + Discounts (Week 3)**
   - Customer profiles, segments.
   - Discount creation wizard.
5. **Settings + Inventory (Week 4)**
   - Payment/shipping/tax forms.
   - Inventory dashboard, location transfer flows.
6. **Analytics + Polish (Week 5)**
   - KPI service + charts.
   - Responsive refinements, accessibility checks, documentation.

## 5. Documentation & Tooling
- `/docs` folder with module READMEs, API contracts, and design tokens reference.
- Update `extensions.json` + `.vscode/settings.json` to keep 21st.dev + TS tooling recommended.
- Scripts: `npm run dev:app`, `npm run dev:server`, `npm run test:api`, `npm run lint`.

## 6. Acceptance Checklist
- All required modules implemented for online store channel.
- Responsive UI validated on mobile/tablet/desktop.
- Full TypeScript coverage for new modules (no `any` except typed escapes).
- QA scenarios documented (products/checkout/orders/customers/discounts/settings).
- 21st.dev toolbar confirmed operational for UI editing flows.
