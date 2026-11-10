# Deploy TRAIL9INE MEDIA on Hostinger Cloud Startup

## Hostinger settings

Use **Web App / Node.js**, not PHP/static-file hosting. Import `TriPixSolutions/TRIAL9LINE`, branch `main`, with the repository root as the application directory.

| Setting | Value |
| --- | --- |
| Node.js | **22.x** (also pinned in `.nvmrc` and `package.json`) |
| Install | `npm ci` (include build/dev dependencies) |
| Build | `npm run build:hostinger` |
| Start | `npm start` |
| Framework preset | Next.js |
| Output, if requested | `.next` |
| Entry file, if using Other/custom configuration | `server.mjs` |

Set the environment variables from [the deployment example](../.env.hostinger.example) in hPanel **before building**. `NEXT_PUBLIC_SERVER_URL` must be the real HTTPS origin, including Hostinger's preview domain if that is being used initially. Changing it requires another build. Keep `HOSTING_TARGET=hostinger` enabled so both build/runtime reject local database fallbacks or missing media credentials. Hostinger assigns `PORT`; the launcher supports that environment variable and `-p`/`--port` arguments without starting another process.

The launcher imports the generated standalone server. Build packaging includes public images and static chunks, and removes traced local environment files. `npm run start:next` is retained only as a diagnostic full-install alternative.

These settings follow Hostinger's [Node.js deployment documentation](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) and [supported Node versions](https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/). This application needs server-side Next.js, Payload and APIs, so do not select static export.

## What is optimized

- Two build workers instead of consuming every available CPU; the plan's resources are shared with other sites.
- Standalone runtime, no PM2, no second queue server, and no persistent background process.
- MongoDB uses at most five pooled application connections with idle expiry and bounded connection/socket timeouts. Simultaneous first requests share one Payload initialization promise. Additional hosts/processes each have their own pool.
- Media files live in Cloudinary; responsive image transformations are served by its CDN. Hostinger is not the durable media store. Public fallback images receive a one-hour cache lifetime.
- Grid/Home queries fetch card fields only, without loading complete case-study galleries for each card.
- Only the selected database adapter is loaded at startup. Public API relation depth is bounded.
- Notification passes process up to five jobs, stop starting more jobs after a minute, and limit each email network request to eight seconds. Failures remain in the durable outbox for retry.
- Local databases, uploads, credentials, caches and design-reference exports are excluded from Git/release assets.

Hostinger's [Node.js limits](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) describe one app server per website, a 120-second request limit, and no persistent background workers. No claim is made that a fixed amount of RAM is reserved exclusively for this app. Load-test against actual traffic after deployment.

## Database and existing content: launch prerequisite

**Atlas live connectivity has not yet been verified.** The local machine returned Atlas TLS handshake errors even with its observed outbound IP allowlisted. Do not deploy with `file:./local-dev.db` or copy `.local/studio.db` into a versioned Hostinger build: content could be lost during redeployment.

Use a valid Atlas URI and allow the deployment's actual outbound IP/network in Atlas. A website's inbound/dedicated IP is not automatically proof of its outbound address. Keep TLS certificate verification enabled. Resolve the Atlas connection issue and rehearse the import before sending production traffic to the app.

Git contains code, not the local portfolio database or staff credentials. A new empty Atlas database does not inherit the current projects/users by pushing this repository. The existing protected migration snapshots remain only on the local machine. Follow the [migration notes](09-agency-platform-implementation.md) to import them securely from a machine with Atlas access. Do not commit, upload publicly, or print the snapshots. Initial owner provisioning on a new empty database is available at `/admin`; an imported owner retains their existing password hash.

## Notification cron

After deploying and configuring Resend, add an every-minute cron job in hPanel → Advanced → Cron Jobs. Use Node 22 and the active deployed source path:

```text
/opt/alt/alt-nodejs22/root/bin/node --env-file=/home/USER/domains/DOMAIN/hbuilds/config/.env /home/USER/domains/DOMAIN/hbuilds/current/nodejs/scripts/cron-notifications.mjs
```

Replace `USER` and `DOMAIN` with the values shown by your account. Confirm the exact active path and keep the command within Hostinger's 255-character limit. Do not put the worker secret in a URL or committed script. The helper loads the environment, makes one authenticated HTTPS POST to `/api/notifications/worker`, then exits; the website performs the database work using its existing connection pool. It does not send emails directly from the cron process.

Hostinger documents the environment-file path, per-account Node executable and UTC scheduling in [Node.js cron instructions](https://www.hostinger.com/support/how-to-run-cron-jobs-for-node-js-websites-at-hostinger/). Cron does not automatically inherit website variables. Use `--env-file` as above; do not assume shell profile settings apply.

Set the Resend delivery webhook to `https://YOUR_DOMAIN/api/notifications/webhook` and its matching `RESEND_WEBHOOK_SECRET`. Verify a real inquiry, the saved inbox record, provider acceptance and the signed delivery event before treating notifications as operational.

## Deployment checks

1. Verify Atlas connection and complete the content/account migration.
2. Confirm hPanel environment checks pass, build succeeds, and runtime logs contain no configuration errors.
3. Open Home, Works, a project detail, `/admin` and an image. Sign in and publish a draft, then verify the public grid/detail update.
4. Submit one real test inquiry. Run the cron once and verify the notification lifecycle.
5. Recheck narrow/mobile layouts and image loading on the actual domain.
6. Redeploy once and verify projects, uploads and staff access persist because MongoDB/Cloudinary are external.

A code push and local build verification do not establish a successful Hostinger deployment. No domain, hPanel environment variables or live hosting content were changed by this preparation task.

## Local release verification

The production build completed successfully. TypeScript checks and all 44 tests passed. An isolated standalone release running Node 22.23.4 passed nine route, static-asset and access-control checks. These checks used the protected local test database; they do not verify Atlas connectivity or a live Hostinger deployment.
