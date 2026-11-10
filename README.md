# TRAIL9INE MEDIA — Production Website & Operations Platform

**Hostinger Cloud Startup:** use Node 22, `npm ci`, `npm run build:hostinger`, and `npm start`. [Deployment settings and launch prerequisites](docs/10-hostinger-cloud-startup.md). Production configuration must use MongoDB Atlas and Cloudinary; local database files and secrets are not included in Git.

> **Implementation update — 10 November 2026:** The agency dashboard, Cloudinary media integration, independent Home/Works placements, CMS services and configurable project layouts are implemented. See [current implementation and operational notes](docs/09-agency-platform-implementation.md). The sections below describe the earlier baseline where they differ. Current verification: 39 tests pass; TypeScript and the Next.js 16.4.6 production build pass. Cloudinary was verified with real uploads; Atlas connection verification is blocked by a TLS handshake error, so the application currently uses the preserved local database. No public deployment has been performed.

Production application built for **TRAIL9INE MEDIA**, an independent Toronto creative agency specializing in restaurant and hospitality marketing.

---

## 1. What Was Implemented

### Public Website
- **Home (`/`)**: Atmospheric hero with brand gradient, authentic culinary poster media, selected work showcase (Tharavadu, 90’s Lounge, Piravi, Biryani & Barbeque), agency introduction, 5-service capability overview, 3-step approach (Understand, Create, Connect), and conversion CTA.
- **About (`/about`)**: Studio narrative, founders (Riyan & Shamil), restaurant focus, BTS on-set photography, and agency principles (Clarity before output, Craft in the details, Consistency over noise).
- **Services Overview (`/services`)**: In-depth capability index covering all 5 core services, deliverables, approach, and service FAQs.
- **5 Service Detail Pages (`/services/[slug]`)**:
  1. `/services/social-media-marketing`
  2. `/services/content-creation-video-production`
  3. `/services/food-commercial-photography`
  4. `/services/branding-graphic-design`
  5. `/services/paid-advertising-digital-marketing`
- **Work / Portfolio (`/work`)**:
  - Responsive 3-column (desktop), 2-column (tablet), 1-column (mobile) uniform 4:3 grid.
  - Active CMS category filtering (All projects, Video production, Social media, Photography, Creative campaigns) with clean URL state persistence.
  - Dynamic pagination when published projects exceed page size.
- **Project Detail Route (`/work/[slug]`)**: Reusable modular template supporting:
  - Wide imagery (16:9 / 21:9)
  - Balanced image pairs (4:3)
  - Vertical 9:16 portrait video/photo strips
  - Video embeds/players
  - Captioned images
  - Editorial text interludes
  - Next-project recommendation links
- **Contact (`/contact`)**:
  - Full Name, Business Name, Email, Phone, Service Interest (pre-selectable from CTAs), and Project Message.
  - Privacy acknowledgement checkbox.
  - Client-side and server-side Zod validation.
  - Spam honeypot detection.
  - IP-based rate limiting.
  - Exact receipt success notice: *"Thanks for telling us about your project. Your inquiry has been received."*
  - Resilient failure recovery preserving all entered field values.
- **Privacy (`/privacy`)**: Transparent Canadian/Toronto privacy statement.
- **Designed 404 (`/_not-found`)**: Editorial 404 screen.

### Authenticated Staff Dashboard (`/admin`)
- Built using **Payload CMS 3.x** embedded directly in the Next.js App Router.
- **Role-Based Access Control (RBAC)**:
  - **Owner**: Full access to projects, categories, media, staff accounts (`users`), inquiries, and notification retries.
  - **Editor**: Portfolio, categories, and media management (cannot view client leads or staff accounts).
  - **Inquiry Manager**: Inquiry inbox, private notes, lead status changes, and notification retries (cannot modify portfolio or users).
- **Inquiry Inbox & Lead Tracker**:
  - Lead statuses: `New` / `In progress` / `Closed` / `Spam`.
  - Independent email notification statuses: `Pending` / `Provider accepted` / `Delivered` / `Failed` / `Bounced`.
  - Notification attempt history and permission-gated retry button (`POST /api/inquiries/retry`).
- **Durable Notification Outbox Worker**:
  - PostgreSQL / SQLite outbox table with distributed locking leases.
  - Exponential backoff retry schedule: 1m, 5m, 15m, 60m up to 5 attempts.
  - Resend email delivery with signed webhook status sync (`POST /api/notifications/webhook`).

---

## 2. Local Startup Commands

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Seed database (Categories & Projects)
npm run seed

# 3. Start development server
npm run dev
# The public site will be live at http://localhost:3000
# The staff dashboard will be live at http://localhost:3000/admin
```

### Running Background Outbox Worker
```bash
# Run one polling pass of due email notifications
npm run worker
```

### Running Tests & Typechecks
```bash
# TypeScript verification
npx tsc --noEmit

# Vitest test suite
npm test

# Production build
npm run build
```

---

## 3. Secure First-Owner Setup

Public account registration is disabled. To create your first Owner account:
1. Navigate to **`http://localhost:3000/admin`** in your browser.
2. Because no users exist in the database initially, Payload will display the **Create First User** setup screen.
3. Enter your Name, Email, and a secure Password. The first user is automatically granted the `Owner` role.
4. Once logged in, the Owner can manage team members under **Users** and assign `Editor` or `Inquiry Manager` roles.

*(Alternatively, set `INITIAL_OWNER_EMAIL` and `INITIAL_OWNER_PASSWORD` in your `.env.local` before running `npm run seed` to automatically provision the account).*

---

## 4. Environment Variables

Refer to `.env.example` for all configurable variables:

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URI` | PostgreSQL or local SQLite URL | `file:./local-dev.db` (local) or `postgresql://...` |
| `PAYLOAD_SECRET` | 32+ character random secret | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | Application root URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for email delivery | `re_...` |
| `RESEND_SENDER_EMAIL` | Verified sender email | `"TRAIL9INE MEDIA <inquiries@trail9ine.com>"` |
| `BUSINESS_NOTIFICATION_EMAIL`| Recipient inbox for new leads | `inquiries@trail9ine.com` |
| `WORKER_AUTH_SECRET` | Token for background cron worker | Required unique random secret |
| `S3_BUCKET` / `S3_ENDPOINT` | Private object storage credentials | Optional in dev (uses local `./public/media`) |

---

## 5. Verification Results

- **TypeScript (`npx tsc --noEmit`)**: 0 errors. Strict typing enabled.
- **Vitest Unit & Integration Suite (`npm test`)**: 8/8 tests passed (inquiry validation, rate limiting, access control, draft isolation, outbox persistence).
- **Production Build (`npm run build`)**: Compiled successfully. All 11 static and dynamic routes generated cleanly.
- **End-to-End Live Journey (`node --import tsx src/scripts/verify-e2e.ts`)**: 13/13 scenarios passed:
  1. Homepage branding & hero copy verified.
  2. Work portfolio grid & published project records verified.
  3. Services overview & 5 capabilities verified.
  4. Dynamic service detail routes verified.
  5. Reusable project detail routes & modular galleries verified.
  6. About page studio & founders verified.
  7. Contact page form shell verified.
  8. Form validation errors verified (400 on empty submission).
  9. Valid form submission verified (durable receipt & reference code).
  10. Honeypot anti-spam verification (silent interception).
  11. Access control: Unauthorized draft preview verified (401).
  12. Access control: Unauthorized notification retry guarded (403).
  13. Background outbox worker execution verified.
