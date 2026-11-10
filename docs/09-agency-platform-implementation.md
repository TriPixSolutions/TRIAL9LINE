# Agency platform implementation — 10 November 2026

## Delivered

- MongoDB Atlas adapter, with SQLite retained for isolated tests and a protected local fallback.
- Cloudinary integration through the normal authenticated Media Library uploader. A real upload, stored metadata and HTTPS CDN URL were verified against the connected account. No browser-side API secret or public unsigned upload preset is used.
- Branded dashboard overview, actual project/inquiry counts, project list thumbnails, automatic page address, visual layout choices and clear placement switches.
- Independent Home/Works visibility, Home ordering and section limit, configurable Works grid/image ratio/page size, and editorial/film/photography project presentations.
- CMS services feed Home, service navigation, overview and detail pages. Home/About/site settings now feed public content.
- Home / Works / About Us / Services / Contact Us navigation with desktop service disclosure and a mobile service accordion.
- Upload/select media controls, alt text, captions, focal positioning, video poster uploads and gallery shape controls. Existing video link support is preserved.
- Responsive Cloudinary image delivery, explicit View project text, a small original Lottie spark honoring reduced motion, sitemap/robots and old project URL redirects.
- Closed anonymous writes to operational collections, private project notes protected in APIs, signed delivery webhooks, transactional inquiry/outbox creation, unique submission keys, conditional job claims, bounded retries and a staff retry action.
- Tests always use a fresh disposable database; they do not run against the environment's live MongoDB account.
- Legacy migration tooling remaps relationships, preserves password hashes and historical project versions, pauses unsent notification jobs and supports repeat runs without duplicate imports.

## Local operation

Run `npm run dev` for the application. The existing owner account is preserved in the migrated local database. If MongoDB is not yet verified, `.env.local` uses `.local/studio.db`; the original `local-dev.db` remains unchanged.

Run `npm run setup:connections` to open a temporary local setup server. Its console prints an expiring, random local URL. Enter the existing database user's password and provider credentials there, rather than in chat. The form verifies both connections before replacing the connection values in `.env.local`. Restart the application after environment changes.

Cloudinary credentials and MongoDB candidate credentials are private local configuration. `.env*`, `.local/`, database files, media uploads and build output are excluded by `.gitignore`.

The application can use MongoDB by setting `DATABASE_URI` to a valid Atlas URI. A database user password must be supplied by the account owner. An Atlas database role such as `atlasAdmin @ admin` is not a password.

## Migration

A protected pre-change source archive exists at `/private/tmp/trail9ine-before-implementation.tgz`; a protected data snapshot with password hashes is in `.local/legacy-export.json`. Do not commit or share that snapshot. It includes private account/inquiry data.

To import the snapshot into the configured destination:

```sh
LEGACY_EXPORT_PATH=.local/legacy-export.json npm run migrate:legacy
```

Use an empty staging database first. The script preserves IDs through a relationship mapping, imports historical project versions, and marks pending/processing source notifications as failed for manual review, preventing accidental replay of old emails. Import globals only when they were actually saved; untouched legacy defaults do not replace current public copy.

`npm run migrate:media` can import existing local project/service images into the connected media library and link them to the database records. Existing URL fallbacks and original files are retained.

The legacy migration was rehearsed twice in an isolated SQLite destination: 4 projects, 4 categories, 1 user, 2 inquiries and 2 notification jobs; 4 historical project versions plus current versions. Password hash/salt equality and one latest version per project were checked. MongoDB-specific verification is a separate check and must not be inferred from this rehearsal.

## Operational notes

- Run `npm run worker` from a scheduler for durable email processing. The worker handles a single pass of up to 10 due jobs. The HTTP worker requires a Bearer token matching `WORKER_AUTH_SECRET`; secret query parameters and hardcoded fallback secrets are removed.
- Configure `RESEND_API_KEY` and `RESEND_WEBHOOK_SECRET` for real email delivery. Provider acceptance is not the same as confirmed delivery. Email simulation requires explicit `EMAIL_SIMULATION=true` outside production.
- Assets in the media library are public website assets. Do not upload confidential files. File uploads are limited to 20 MB and approved image/MP4/WebM types.
- Removing an unused media record retains the provider original for recovery; provider asset cleanup is a separate deliberate operation. In-use media cannot be deleted from the library.
- Staff should unpublish a project to make its detail unavailable. Turning both placement switches off only removes it from listings. Old public URLs redirect after a slug change.
- The contact rate limiter is still process-local. A multi-instance deployment should use a shared limiter or upstream protection.
- Final hosting, backup policy, scheduler configuration and live email delivery need deployment-specific verification. No public deployment has been performed.

## Verification log

- TypeScript and production build passed during implementation; final dependency and integration results are recorded in the handoff.
- 39 unit/integration tests passed, including placements, private fields, anonymous operational writes, inquiry idempotency/outbox persistence, bounded retry failures and webhook signatures.
- Browser: logged into the isolated QA dashboard, used layout/visibility controls, uploaded an existing project image through the media drawer, published a temporary project and checked its Works card and public detail page.
- A dashboard prop mismatch found by browser testing was fixed. The generated Payload import map is now wired into admin rendering and server functions.
- Browser width override did not produce the requested 390px viewport; the measured view was 913px. A fresh 320/390px mobile verification is still required; do not treat the intermediate-width review as mobile certification.

## Final integration status

- Next.js updated to 16.4.6, which falls within Payload 3.93.0's supported Next range; image processing and validation dependencies were patched. The unused rich-text package was removed; this project has no rich-text fields. Final production dependency audit: zero high/critical findings, 19 low/moderate findings remain. This is not a claim that all dependencies or deployment configurations are vulnerability-free.
- Final TypeScript check, 39 tests and the Webpack production build passed after the dependency updates.
- The original project/service imagery was imported/reused as 7 Cloudinary assets, with media relationships saved in `.local/studio.db`. Public image files and URL fallbacks were retained.
- Live Atlas verification is blocked: the server returns a TLS handshake internal-error alert (80). The application's public outbound IP matches Atlas's active /32 allowlist entry. Node 22 LTS and IPv4 checks also failed without disabling certificate verification. One earlier attempt returned Atlas error 8000. Credentials and the destination schema have therefore not been certified, and no Atlas migration was run.
- The entered MongoDB candidate is retained only in protected `.local/mongo-candidate.env` for a future retry. The active `DATABASE_URI` remains the migrated local database, preserving a working site. Do not switch to Atlas until a successful connection and staging migration have been demonstrated.
- The temporary browser QA project was removed from its isolated database after the publication journey was verified.

## Review artifacts

Local review server: `http://127.0.0.1:3003`; staff dashboard: `/admin`. It uses the migrated original data and Cloudinary imagery. The original owner's credentials are preserved.

Screenshots: [dashboard](qa-platform/dashboard.png), [Works](qa-platform/works.png). Final Works browser check at the measured 1280px viewport found all four Cloudinary cover images loaded and no horizontal overflow. Temporary setup and QA servers were stopped; the local review server is retained.

For an Atlas support/network investigation, the provider's [connection troubleshooting guide](https://www.mongodb.com/docs/atlas/troubleshoot-connection/) covers IP allowlists, TLS and connectivity. No certificate validation or network isolation protections were disabled during the checks.
