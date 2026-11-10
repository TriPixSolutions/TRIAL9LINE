# Public website refinement — 9 November 2026

Kept the existing Manrope/Inter typography, palette and public templates. Refined Home and Services heroes, removed decorative eyebrow labels across public pages, corrected Branding and Paid Advertising imagery, and expanded the footer with studio information and service navigation. Logo treatment is pending the owner's placement guide.

## Project videos

In Admin → Projects → Gallery, add a Video block. Enter a YouTube watch/share/Shorts link, an Instagram public reel/post link, a Vimeo link, or an MP4/WebM URL in **Video link**. Add a heading, optional poster URL and caption, then publish. Existing fields are reused; no database migration is needed.

External players load after the visitor clicks the poster. A provider link remains available as a fallback. Instagram posts must be public and embedding must be enabled. Provider availability, login restrictions, copyright restrictions and playback on actual client links have not been verified because client video links were not supplied. Concept links in automated checks only verify saved content and rendering, not provider playback.

Branding and campaign imagery are illustrative service visuals generated for this refinement, not client case-study evidence.

## Verification

- TypeScript check and isolated production build passed.
- 28 Vitest tests passed, including 17 video source validation cases.
- Production verification on a separate SQLite QA copy passed: draft visibility, publish to grid/detail, saved video controls, edit reflection, access protection and unpublish.
- Browser review at desktop 1440px and mobile 390px; no horizontal overflow on Home, Services, Work and a project detail at 320px.
- Screenshots: Home and Services desktop/mobile, expanded footer desktop/mobile.
