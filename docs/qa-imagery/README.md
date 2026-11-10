# Agency imagery audit

Replaced the food/restaurant template photography throughout Home, About, Services, all five service detail pages, Works and all four seeded project detail pages. Contact and Privacy have no decorative photographs. Brand marks are preserved.

Six new editorial images use a consistent warm neutral and plum palette: social content planning, cinema production, product photography, graphic design materials, campaign analytics and a creative workspace. The built-in image_gen tool produced these illustrative assets; they do not document actual staff, premises or client deliverables. Exact scene prompts are recorded in `prompts.json`. Final optimized WebP files live in `public/images/agency/` (roughly 800 KB total).

Compatibility handling replaces known legacy image paths and imported template media even when Cloudinary URLs are opaque. Custom uploads remain editable and are preserved. Service defaults are contextual; selecting a new image in the dashboard still takes precedence. Image descriptions and illustrative project-gallery captions were updated with the visuals.

The protected local source database was backed up before updating its eight known template media records through Payload/Cloudinary. Original provider assets remain recoverable. This local update does not migrate the database to Atlas or update another deployed database.

For an existing deployed database, back it up and preview the optional library refresh:

```sh
node --import tsx scripts/with-env.mjs src/scripts/refresh-imagery.ts
node --import tsx scripts/with-env.mjs src/scripts/refresh-imagery.ts --apply
```

The script updates only recognised template media and skips already-refreshed records. Runtime compatibility already replaces the old public visuals without requiring that write; the refresh also updates stored dashboard media previews.

Browser audit: 15 public pages at 1440 px and 390 px (30 page/viewport combinations). No legacy food image sources, horizontal overflow or broken eager images were observed. Lazy images were checked by their rendered source; this is not a complete network/load test for every offscreen image. Details: `browser-audit.json`. Visual samples: `services-desktop.png`, `social-mobile.png`.

Production build and TypeScript checks passed. The complete suite passed 48 tests; the imagery compatibility checks also cover preserving new CMS selections and custom uploads.
