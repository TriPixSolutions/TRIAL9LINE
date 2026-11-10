# Public website rebuild — implementation and verification

9 November 2026. This revision replaces the rejected serif/italic presentation with locally hosted Manrope display and Inter body typography, a charcoal/plum palette, a photographic hero, open editorial sections and a consistent portfolio grid.

## Delivered

- Rebuilt Home, About, Services, Work and Contact.
- One reusable service-detail template populated for all five services.
- One database-driven project-detail template for existing and future projects.
- Shared navigation/footer, responsive layouts, restrained reveals, clear form controls and validation.
- Known imported page screenshots are no longer used as project cover photographs. The presentation resolver maps those specific legacy asset paths to appropriate supplied photographs without changing database records.
- Actual image/video/gallery handling, with no decorative fake play buttons.
- Authenticated project-preview route and draft-aware rendering; private notes are not rendered as public project narrative.
- Public content queries use explicit published-content access.
- Dev command uses Turbopack after reproducing client module failures with the existing Webpack development setup.
- Optional NEXT_BUILD_DIR allows production verification in a separate directory without overwriting the active dev build.

The dashboard and inquiry-delivery implementation were preserved, not redesigned or certified as complete by this public UI task. No database schema changes or user-record resets were performed.

## Verification completed

| Check | Result |
|---|---|
| TypeScript | Passed |
| Existing Vitest suites | 11 tests passed on an isolated database copy |
| Production build | Passed using NEXT_BUILD_DIR=.next-production |
| Public route HTTP checks | 14 main pages and Privacy returned 200 |
| Missing project | Returned 404 |
| Unauthenticated preview API | Returned 401 |
| Desktop browser inspection | All seven public template types inspected/captured at 1440px |
| Mobile browser inspection | All seven public template types inspected/captured at 390px |
| Narrow layout | Representative seven-template routes checked at 320px; no horizontal document overflow |
| Tablet/intermediate layout | Home, Work, Services and Contact checked at 768px and 1024px; no horizontal document overflow |
| Work interaction | Category filtering and project-card click into the rendered detail page checked in browser |
| Mobile navigation | Open, follow Work link, automatic close checked |
| Contact | Empty-submit validation, focus on invalid field and service preselection checked |
| Production browser | Home/Work and navigation checked; no captured console errors |

## New-project integration verification

The script in scripts/verify-rebuild.ts ran against a separate production server and an isolated /tmp database copy. Five checks passed:

1. Draft excluded from public detail and grid.
2. New publication appears in the grid and renders the saved title, overview, image and gallery in its dynamic detail route.
3. Published edits appear without rebuilding.
4. Unauthenticated draft preview is rejected.
5. Unpublishing removes the public detail and grid entry.

The disposable record was deleted from the test copy. Existing user projects were not used as test records. These are CMS/API-to-render integration checks, not a claim of creating the test record through the browser admin editor.

Live email delivery and authenticated staff-preview UX were not tested in this pass. No public deployment was performed. Browser checks are not a formal accessibility certification or measured field-performance report.

## Screenshots

First-viewport captures of the actual application, not mockups.

| Page/template | Desktop | Mobile |
|---|---|---|
| Home | [Desktop](home-desktop.jpg) | [Mobile](home-mobile.jpg) |
| About | [Desktop](about-desktop.jpg) | [Mobile](about-mobile.jpg) |
| Services | [Desktop](services-desktop.jpg) | [Mobile](services-mobile.jpg) |
| Service detail | [Desktop](service-detail-desktop.jpg) | [Mobile](service-detail-mobile.jpg) |
| Work | [Desktop](work-desktop.jpg) | [Mobile](work-mobile.jpg) |
| Project detail | [Desktop](project-desktop.jpg) | [Mobile](project-mobile.jpg) |
| Contact | [Desktop](contact-desktop.jpg) | [Mobile](contact-mobile.jpg) |

## Local use

Run npm run dev and open http://localhost:3000.

To verify a production build while keeping dev running:
NEXT_BUILD_DIR=.next-production npm run build

The isolated QA server on port 3001 was stopped after verification.
