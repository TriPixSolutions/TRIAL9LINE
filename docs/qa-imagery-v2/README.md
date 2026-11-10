# Distinct editorial photography across the website

This revision supersedes the six-image plum-themed set in `docs/qa-imagery`.

Forty individually generated photographs now fill forty distinct public photo placements. Colours follow each natural scene; there is no imposed brand tint. All sources are optimized WebP with dedicated 480 px and 960 px variants, served through responsive `srcset` rather than downloading desktop images on every phone.

## Placement inventory

- Home: a print-review hero, editing-workstation capability image and four unique hospitality thumbnails.
- About: a daylight creative workspace and a collaborative moodboard scene.
- Services: two dedicated abstract/design-equipment hero images, five service-specific listing photographs and five different service-detail photographs. Related project links use a compact text treatment to avoid reusing portfolio photos inside service pages.
- Works: four dedicated restaurant/lounge/cafe/food thumbnails, different from Home and detail covers.
- Project detail pages: four dedicated hospitality hero photographs and twelve individual food, coffee, restaurant-interior and hospitality gallery scenes. A video block with a poster but no playable URL displays its still image without a misleading play action.
- Contact and Privacy have no decorative photos. Existing brand marks are retained.

The built-in `image_gen` tool generated the photographs individually; exact prompts and final asset paths are in `prompts.json`. Assets live in `public/images/editorial/`. These are illustrative images, not documentation of named clients, staff or actual premises; project detail pages identify illustrative hospitality imagery.

## Content handling

Known template/imported images receive the appropriate contextual presentation. A project's Home, Works and detail covers are distinct. New seed data uses dedicated project/gallery assets. Unrelated custom media uploads and their text remain intact; dashboard cover cells follow the same project thumbnail selection. Editors can replace template imagery with their own uploads.

This revision does not modify database records, production credentials or hosting settings. Existing protected local media records and original provider assets remain recoverable. No Atlas content migration or Hostinger deployment is implied.

## Verification

Browser audit: 15 public routes at 1440 px and 390 px (30 route/viewport combinations), including all five service details and all four project details. At desktop there are 40 photo placements and 40 distinct source URLs, with no duplicates. Visible images loaded, and no horizontal overflow was observed. The capability photo is intentionally hidden by the existing mobile layout and therefore remains lazy/unloaded on mobile.

Evidence is saved in `browser-audit.json`, `works-desktop.png`, `services-desktop.png` and `branding-mobile.png`. TypeScript and the production build passed. All 52 tests passed. The isolated Node 22 standalone release passed 129 checks: nine route/static/access checks plus all 40 original WebP images and their 80 responsive variants.
