# TRAIL9INE MEDIA — Technical stack & admin dashboard

Architecture revision · 9 November 2026
This extends the public website plan with an authenticated operational dashboard. Status: specification, not implemented software.

## 1. Selected implementation baseline

| Layer | Selection | Purpose |
|---|---|---|
| Public frontend | Next.js App Router + React + TypeScript (strict) | Rendered pages, reusable service/project routes, metadata, preview |
| Runtime/backend | Node.js + Next.js Route Handlers + Payload server APIs | Authenticated content operations and public inquiry endpoint |
| Styling | Tailwind CSS, shared design tokens | Responsive public interface and custom admin components |
| CMS/admin | Payload CMS embedded in the Next.js application | Auth, content collections, drafts/versions, upload management; custom overview/inquiry views |
| Database | PostgreSQL through @payloadcms/db-postgres | Projects, categories, media metadata, users, inquiries and notification outbox |
| Media storage | Private S3-compatible object storage through @payloadcms/storage-s3 | Durable image/video originals; provider selected with hosting |
| Images | Sharp + responsive image delivery | Size variants, crops, focal points and fixed dimensions |
| Motion | Motion for React (package motion, imports from motion/react) | Reveals, layout transitions, menu/accordion interactions |
| Lottie | lottie-react, lazy loaded where an approved asset exists | Small optional process illustration; static fallback |
| Forms/validation | React Hook Form + Zod | Usable public form and authoritative server-side validation |
| Transactional email | Resend SDK; @payloadcms/email-resend for CMS account email | Inquiry notifications and account recovery; verified sender required |
| Background delivery | PostgreSQL outbox + authenticated scheduled worker | Email retries and durable status updates |
| Quality | TypeScript checks, focused Vitest integration tests, Playwright journey checks | Publishing, access control, uploads and inquiry reliability |

This is one integrated Next.js/Node application, not a second Express server. Payload supplies CMS/auth conventions; application code still implements the inquiry workflow, publication projection, cache invalidation, custom dashboard views and media-policy checks. Tailwind styles the public site and our custom views; the built-in Payload panel is themed via supported admin customisation rather than replaced wholesale.

Versions: choose a mutually compatible, patched stable Next.js/React/Payload/Node set at scaffolding, check official compatibility requirements and package peer dependencies, then pin the lockfile and runtime. Do not blindly install independently selected “latest” versions. Exact versions and deployment vendor are not frozen by this planning document.

### Animation decision

Motion for React is the primary animation library for this minimal, media-led UI. Use CSS transitions for simple colour/focus states and Motion for controlled entrances, menus and gallery layout changes. Honour reduced motion and keep server-rendered copy readable before hydration.

GSAP is reserved for a later, specifically approved complex timeline that Motion cannot reasonably cover. Three.js is reserved for a real 3D concept, which is absent from the present brief. Neither is a baseline dependency. Installing several animation engines does not improve the desired calm, professional experience.

Lottie is limited to the process illustration and only loaded where used. Dashboard motion is functional and short; do not animate every table row.

## 2. Application boundaries

Public visitors can read published content and submit an inquiry. Staff sign into /admin. There is no public account registration or customer portal.

Suggested source organisation:

~~~text
src/
  app/
    (site)/
      layout.tsx
      page.tsx
      about/page.tsx
      services/page.tsx
      services/[slug]/page.tsx
      work/page.tsx
      work/[slug]/page.tsx
      contact/page.tsx
      privacy/page.tsx
    (payload)/
      admin/[[...segments]]/page.tsx
      api/[...slug]/route.ts
    api/
      inquiries/route.ts
      notifications/worker/route.ts
      notifications/webhook/route.ts
      preview/route.ts
      media-delivery/[id]/route.ts
  collections/
    Users.ts
    Projects.ts
    Categories.ts
    Services.ts
    Media.ts
    Inquiries.ts
    NotificationOutbox.ts
    Redirects.ts
  globals/
    SiteSettings.ts
    AboutPage.ts
    HomePage.ts
  blocks/
  components/
    public/
    admin/
  lib/
    access/
    validation/
    inquiries/
    notifications/
    publishing/
    media/
  payload.config.ts
~~~

The Payload catch-all API and explicit application endpoints must be wired without ambiguous route collisions. Server-side data access is restricted by explicit caller identity and permissions; trusted local APIs must not silently bypass public/draft access checks. Return allowlisted public data, not raw records containing internal fields.

## 3. Dashboard route/screen inventory

These follow Payload collection/global route conventions; login and custom overview use its admin shell.

| Route | Screen |
|---|---|
| /admin/login | Staff sign-in |
| /admin | Custom overview: projects, drafts, new inquiries, failed email notifications |
| /admin/collections/projects | Portfolio list with status/category/search filters |
| /admin/collections/projects/create | New reusable project record |
| /admin/collections/projects/[id] | Project editor, gallery, preview and publishing |
| /admin/collections/categories | Category list/create/edit |
| /admin/collections/media | Media library and uploads |
| /admin/collections/inquiries | Inquiry inbox with status/service/date filters |
| /admin/collections/inquiries/[id] | Inquiry detail, notes and notification status |
| /admin/collections/services | Service-content management |
| /admin/globals/home-page | Editable Home sections |
| /admin/globals/about-page | Editable agency copy |
| /admin/globals/site-settings | Verified contacts, links and defaults |
| /admin/collections/users | Owner-managed staff accounts |

Password recovery uses Payload's supported flow; final URL conventions follow the installed version. The custom overview and polished inquiry UI are implementation work, not out-of-box promises. Use Payload's collection operations instead of designing a second parallel CMS.

## 4. Roles and permissions

Owner: manage staff roles and settings, publish/archive content, manage inquiries and retry notifications.
Editor: manage portfolio, categories, service/page content and media; preview/publish within the agreed workflow. Cannot access inquiries, staff accounts or notification records.
Inquiry manager: read inquiries, change lead status and internal notes, retry failed inquiry notifications. Cannot manage users or publish portfolio work.

Enforce permissions in collection access rules, field access and server endpoints, not only hidden navigation. Public clients cannot list inquiries, create staff, set roles, set email state, or call arbitrary CMS writes. First owner creation is a controlled setup step; public staff signup is disabled. Staff use secure sessions, logout and recovery; login rate limiting and CSRF protections must be configured and checked.

Admin responses and authenticated previews are private/no-store. Exclude admin/API routes from public indexing and sitemap; indexing rules are not security controls. Do not include inquiry personal data in analytics or routine error logs.

## 5. Portfolio creation and publication

### Editor form

Basics: title, generated editable slug, client display name, editorial headline, industry, service relationships and one-or-more category relationships.
Story: confirmed overview, optional approved approach, optional verified outcomes and approval status.
Media: cover/poster, gallery blocks and video sources.
Presentation: featured flag, display order, related/next project.
SEO: title, description and share image.

Show helpful labels, not database jargon. No code editor or raw JSON requirement. Group the native fields using tabs/collapsible sections rather than assuming every Stitch arrangement maps to a built-in widget.

### Categories

Separate Category records: name, unique slug, display order and active state. Seed Video production, Social media, Photography, Creative campaigns. All projects is a filter state, not a category record.

Allow multi-category assignment. A public filter uses active categories and published projects only; counts come from that same dataset. Adding a category in the dashboard must make it available to the public filter without a code change. A category in use cannot be deleted silently: show affected projects and require reassignment or explicit removal. Keep services and categories separate concepts.

### Reusable gallery template

Allowed modules: wide image; image pair; portrait strip; video; captioned image; short text interlude. Each has a stable ID, ordered position and validated fields. Editors can add, reorder, replace and remove blocks. Curated variants preserve layout quality while making each project feel distinct.

### Workflow

Create project → assign categories/services → enter copy → select/upload media → arrange gallery → save draft → authenticated preview → publish → public list and detail refresh.

Require a unique slug, title, overview, category, valid cover and rights/approval confirmation before publishing. Validate complete media blocks; do not publish broken video sources or unapproved factual claims. Save draft and Publish are distinct controls. Warn about unsaved changes.

Public pages read only published versions. Draft edits to a published project must not leak before republishing. Publish/unpublish/category changes invalidate the affected /work filters, project pages, featured Home content, related-work sections and sitemap as appropriate. Do not rely on a manual rebuild to show portfolio changes.

Unpublish removes public listings and public detail access; authenticated preview remains available. A published slug change creates a redirect and invalidates both routes. Archive/unpublish should precede destructive deletion. Restore a version without accidentally publishing it.

Preview uses short-lived authenticated access and private responses; never grant draft access solely from a user-supplied slug. External preview links must be scoped and expiring.

## 6. Image, video and link handling

Images: choose existing media or upload, show progress and failure, enter descriptive alt text, choose crop/focal point, replace without losing gallery order. Validate actual file signature, size and allowed formats on the server; reject active-content uploads such as unsanitised SVG/HTML. Initial image policy: JPEG/PNG/WebP/AVIF, up to 15MB per original, subject to tested infrastructure limits.

Videos: support either an approved YouTube/Vimeo URL or uploaded MP4/WebM media. Store source type, source reference, poster, accessible title, caption and optional transcript/caption file. Do not treat a general project link as a video embed.

Initial hosted-upload ceiling: 100MB per video, configurable after deployment testing. Large videos upload directly to private storage using authenticated short-lived signed upload permissions; do not push large binaries through a serverless request body. Track completion and validate size/type after upload. Signed permissions must not allow arbitrary keys or overwrites. Retain posters so unavailable video never leaves a blank frame.

External links: optional project/client URL plus label, HTTPS protocol validation and approved embed hosts. Reject arbitrary HTML/iframe scripts and unsafe URL schemes. Do not fetch arbitrary remote URLs on the server. Use provider IDs/validated URLs for known embeds.

Storage: durable object storage, not ephemeral application disk. Metadata stays in PostgreSQL. Original objects remain private. Public delivery resolves media IDs only when referenced by published content, then serves an approved derivative or short-lived object URL. Authenticated staff can preview draft media. Public CMS media queries must not enumerate draft assets. Validate generated variants and adapter behaviour; native admin access rules alone do not protect a publicly readable bucket.

Uploads show queued/uploading/processing/ready/failed states. Do not mark a source ready before its object and metadata are valid. Prevent deletion of referenced media until replaced; clean up abandoned uploads separately. Unpublishing cannot revoke already downloaded public media, but must remove future unauthorised source access.

Progressive MP4 delivery is sufficient initially; transcoding/adaptive streaming is an optional later provider integration if actual media volume warrants it, not an assumed capability of object storage.

## 7. Inquiry saved in dashboard + email notification

### Durable flow

~~~text
Contact form
  → POST /api/inquiries
  → validate, rate-limit, spam-check, accept idempotency key
  → one PostgreSQL transaction:
       insert inquiry
       insert pending notification outbox event
  → commit
  → return inquiry receipt success
  → dashboard can read saved inquiry immediately

Authenticated scheduled worker
  → claim due outbox events with a lease/lock
  → send Resend notification
  → store provider message ID + attempt result
  → signed provider webhook updates delivered/bounced/failed status
  → retry transient failures with bounded backoff
~~~

Database persistence is the source of truth. Once saved, the visitor sees “Thanks for telling us about your project. Your inquiry has been received.” Email failure must not discard the lead or invite duplicate resubmission. If the transaction fails, return a genuine form error and preserve entered values. Never promise delivery to an email inbox merely because the provider accepted the request.

Use a bounded idempotency key scoped to the form submission to prevent duplicated inquiry/outbox records after retries. Claim outbox work atomically so two workers do not send the same event concurrently. Use provider idempotency where available and track uncertain send results. Email and database are separate systems; do not claim exact-once inbox delivery.

A scheduled worker runs outside the visitor request lifecycle; do not depend on an unawaited promise continuing after a serverless response. Proposed retry schedule: 1, 5, 15 and 60 minutes, then a visible failed/manual-retry state. Timing is a chosen policy. A worker crash releases its lease after a bounded interval; keep attempts and next due time. Verify webhook signatures and process events idempotently.

### Inquiry record

ID/reference, created time, submitted fields, service interest, internal lead status, assigned staff (optional), private notes, privacy-policy version/acknowledgement time, notification aggregate state and bounded source information. Server assigns status/timestamps; the public payload cannot set them.

Lead status: New → In progress → Closed, with Spam as a separate classification. Email state is independent: Pending / Provider accepted / Delivered / Failed / Bounced. Do not call provider acceptance “Delivered”. Opening an inquiry does not silently change its workflow status.

Outbox event: inquiry ID, event type, state, attempt count, next-attempt time, lease, provider ID, safe error category, created/updated timestamps. Staff see a readable delivery history; provider credentials and raw sensitive payloads remain hidden.

### Inbox experience

List: search name/business/email, filter status/service/date, show received time, readable service and independent notification badge. Detail: full inquiry, contact actions, change status, add private note, notification attempts and permission-gated retry. Dashboard totals come from actual data, with empty states when none exists.

Email notification: inquiry reference, contact/business details, selected service, project message and a link to the authenticated inquiry detail. Use a verified business sender; visitor email is Reply-To, never From. Escape submitted content. No automatic marketing subscription, auto-reply or email sending from the dashboard is added to scope.

Recipients must be verified and configured before production. Use Resend delivery webhooks to record available delivery events; email filtering is outside application control. Retention, privacy text and deletion must cover both the database and third-party email copies.

## 8. Deployment and setup requirements

Deploy as a Node-capable Next.js application with persistent PostgreSQL, object storage and a working scheduler. This requirement supersedes a static-only deployment plan. Provider selection remains open; do not provision paid services in this architecture phase.

Separate development/staging/production data, buckets and credentials. Keep secrets server-only. Minimum configuration: DATABASE_URL, PAYLOAD_SECRET, storage endpoint/region/bucket/credentials, RESEND_API_KEY, verified sender, recipient, webhook secret, worker authentication secret and trusted application origin. Publish only variable names in an eventual .env.example.

Use migrations rather than production schema auto-push. Back up the database and object storage and verify restore. Health checks should cover database, storage and worker activity without exposing configuration.

Installation sequence for implementation:
1. Verify local runtime and official compatibility; scaffold Next.js with TypeScript/Tailwind.
2. Add Payload and matching adapters, migrations and generated types.
3. Add Motion, form validation and notification dependencies; add Lottie when used.
4. Configure collections, access rules, draft previews and storage policy.
5. Implement public templates and dashboard customisations.
6. Implement transactional inquiries/outbox, scheduler, webhook and retry flow.
7. Run focused checks and stage with sandbox/test notification recipients.

No packages or app scaffolding are installed by this planning revision; the user has authorised needed tool installation for implementation. The dependency plan is now concrete without starting UI implementation before Stitch design.

## 9. Required implementation acceptance checks

- Create a new category and project in /admin; upload/select assets, add external link/video, reorder blocks and save draft.
- Verify anonymous visitors cannot see drafts or draft media; preview works only with permitted identity.
- Publish and observe new project in category filter, Home when featured, detail route and sitemap; edit/unpublish/rename and check invalidation/redirects.
- Verify all three roles against API and UI, including no public inquiry read access and no editor access to leads.
- Reject unsafe links, disallowed files, oversized uploads and incomplete blocks; failed uploads can retry without breaking content.
- Submit an inquiry and observe durable inbox record plus outbox event. Confirm notification delivery state against a real test provider event.
- Force provider failure and verify lead remains saved, visitor success remains accurate, retries are visible and duplicates are prevented.
- Force database failure and verify real error, preserved fields and no false success.
- Check session/recovery, keyboard use, responsive admin layout, SEO, backups and worker restart handling before launch.

## 10. Official implementation references

These establish capabilities; the application workflows and limits above are project decisions to implement and test.

- [Next.js App Router](https://nextjs.org/docs/app)
- [Payload installation and compatibility](https://payloadcms.com/docs/getting-started/installation)
- [Payload admin panel](https://payloadcms.com/docs/admin/overview)
- [Payload access control](https://payloadcms.com/docs/access-control/overview)
- [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)
- [Payload email adapters](https://payloadcms.com/docs/email/overview)
- [Motion for React](https://motion.dev/docs/react)
