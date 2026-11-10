# TRAIL9INE MEDIA — Proposed visual system

Direction: Editorial warmth × studio precision.
This is a new concept pending brand approval, not a reconstruction of an existing logo or visual identity.

## Visual idea

Let the work carry the colour. Pair warm paper backgrounds and near-black typography with restrained burnt-orange accents. Use high-quality food, hospitality and behind-the-scenes photography at generous scale. Add enough structure to feel professional, without making the studio feel like a generic enterprise software company.

Signature device: a fine editorial rule, small two-digit section numbers, and a restrained right-angle crop mark near selected media. Use the device sparingly. A typographic TRAIL9INE MEDIA wordmark is a design placeholder until official identity assets arrive; do not present a newly invented mark as their approved logo.

Avoid neon gradients, glass panels, pill-shaped cards everywhere, giant rotating slogans, decorative dashboards, false charts, continuous marquees, stock handshake imagery, mock award badges, and auto-playing carousels. Use real project imagery; stock/concept media may establish mood in exploration only and must be labelled in handoff as non-client material.

## Colour tokens

| Token | Value | Use |
|---|---|---|
| Paper | `#F5F3EE` | Main canvas |
| Surface | `#FFFFFF` | Forms and occasional media surroundings |
| Ink | `#171916` | Body text, headings, dark sections |
| Muted text | `#5C6058` | Supporting text on paper |
| Hairline | `#D8D9D1` | Decorative borders, not sole form boundary |
| Control boundary | `#73786D` | Visible input edges where needed |
| Accent | `#A83E24` | Links and small solid buttons with white text |
| On dark | `#F5F3EE` | Text on ink background |
| Error | `#A62525` | Form error text, with explanatory words |

Check contrast in implementation and on actual image overlays. Avoid small text directly on busy food images. A text colour is not interchangeable with a decorative border colour.

## Typography

Proposed pairing: Manrope for display/headings; Inter for body/UI. Check font availability and licences before production. Use sensible system sans fallbacks rather than blocking rendering. No condensed display face that compromises long service titles.

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| Hero | 84–104px / 0.98–1.05 | 42–52px / 1.05–1.12 | Intentional wrapping, no clipping |
| Section H2 | 44–56px / 1.1 | 30–36px / 1.15 | Sentence case |
| Section H3 | 25–32px / 1.2 | 23–28px / 1.25 | Clear hierarchy |
| Lead | 20–22px / 1.55 | 18–20px / 1.55 | Moderate text width |
| Body | 17–18px / 1.65 | 16–17px / 1.6 | Long text around 60–68 characters/line |
| UI | 14–16px / 1.4 | 14–16px / 1.4 | Comfortable hit areas |
| Eyebrow | 12px / 1.4 | 11–12px / 1.4 | Short uppercase labels only |

Use semantically correct headings independent of visual size. Do not make entire paragraphs uppercase or squeeze body copy to fit a screenshot.

## Grid and spacing

Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128, 160px.

- Desktop reference artboard: 1440px; 80px outer gutters; max content width 1280px; 12 columns; 24px gaps. On larger screens keep the content centred.
- Tablet reference: 834px; 32px gutters; 8 columns; 20px gaps.
- Mobile reference: 390px; 20px gutters; 4 columns; 16px gaps. Verify 360px and 320px minimum layout too.
- Header: around 88px desktop, 72px mobile. If sticky, ensure anchors and focused fields are not obscured.
- Section spacing: usually 112–144px desktop, 64–80px mobile; less between tightly connected content.
- Editorial project grid: alternate 7/5-column emphasis while keeping strong row baselines. Mobile follows the same reading order, one project per row.
- Buttons: at least 48px tall in this design; mostly 4–8px radius. Media radius 4–8px. No heavy shadow system.

## Page composition

Home hero: large left-aligned statement, short supporting column and CTA pair, followed by an expansive 16:9 or 16:10 media panel. Show a hint of selected work within the first scroll. Avoid a massive heading that consumes the entire first screen on mobile.

Services: light background, numbered ruled rows with clear names and a short scope. Each detail page gets relevant media: social content strip, cinema landscape, photography editorial spread, branding flat-lay/mockup, or campaign creative board. Never use fictional analytics dashboards as proof.

Work: minimal filters above an editorial grid. Keep project title, category and link readable without hover. Align caption baselines.

Case studies: shared headline/facts area plus modular galleries. Vary media ratios and sequence by project, not typography and navigation. Use one dark cinematic section for the film-led project if the imagery supports it. Avoid full-page dark mode switching on every route.

Contact: a calmer, shorter layout; introduction left, form right on desktop; introduction then form then contact information on mobile. Labels above fields. No information conveyed only through placeholder text.

## Image and icon art direction

Needed real assets: approved hero/showreel and poster; four project covers; each project's gallery and playable videos; agency/BTS image; founders' portraits if wanted; service visual samples; official logo.

Mood: tactile food close-ups, natural texture, warm restaurant lighting, honest environments and deliberate composition. Avoid excessive AI gloss, fake client signage, recognisable stock restaurants passed off as client work, or recycled cover images throughout a page.

Use consistent 24px line icons, roughly 1.5–1.75px stroke: connected content tiles (social), frame/play (video), lens (photo), grid/pen (design), target/message (paid media). Icons supplement visible labels. They should not become the main service imagery.

Image crops: define focal points and mobile alternatives in the CMS. A 16:9 cinematic cover may need a separate portrait-safe crop; do not randomly centre-crop dishes or people. Portrait reels use 9:16 and remain distinguishable from landscape films.

## Motion and Lottie specification

| Element | Proposed behaviour | Duration / constraint | Reduced-motion alternative |
|---|---|---|---|
| Section entry | Subtle fade + 12px translation, once | 400–550ms, short stagger | Immediate/static content |
| Button/link | Small arrow movement and colour change | 160–220ms | Colour/focus only |
| Project media | Image scale up to 1.025 on pointer hover | 300–400ms | Static image |
| FAQ/filter | Calm transition; never hide keyboard focus | 180–250ms | Immediate state change |
| Process Lottie | Thin line connects Understand → Create → Connect | One 2–3s play when visible | Static final diagram |
| Video | User-initiated player from poster | No sound autoplay | Same controllable player |

Lottie is optional enhancement and must not carry essential copy. Proposed asset: small transparent vector animation using ink/accent only, with no embedded fonts, images or complex effects. Aim below 150KB if practical; final budget depends on the actual file. A static SVG diagram is the fallback if a suitable Lottie is unavailable. No Lottie asset has been created in this phase.

Avoid page-load curtains, scroll hijacking, parallax dependent on pointer motion, a custom cursor, and text that stays hidden if animation JS fails. Define motion through annotations as well as visual frames; a static Stitch screen does not prove animation works.

## Interaction states to design

Navigation: active route, keyboard focus, mobile menu closed/open, close action, long-page scroll. Do not hide Services behind a desktop mega-menu requiring hover.

Project cards: default, hover and focus. Whole-card links must not conflict with a separate nested play control.

Filters: default and selected, count, no matching results, reset. Use buttons and an accessible results announcement in implementation. A service preselection must be visible and editable on Contact.

Video dialog: poster/loading/player/error, visible close and playback controls, focus return. Captions/transcripts depend on media content. Related thumbnails should not auto-start other players.

Form: empty, focused, filled, invalid, submitting, success, server failure. Prevent accidental double submission. Do not clear fields on failure.

## UI acceptance criteria

- Home, About, Services, five service details, Work, four project details and Contact are all covered.
- A coherent shared system connects pages while project galleries feel individual.
- Desktop 1440px and mobile 390px are designed; 834/768, 360 and 320px behaviour is specified and checked during implementation.
- All text in the copy deck is accounted for: visible section, accordion answer or deliberately documented omission. No lorem ipsum.
- Text never overlaps, escapes containers or becomes unreadably small to fit the design.
- Work discovery, service-to-work links and inquiry CTA destinations are clear.
- No pricing, fake metrics, fictional testimonials, fabricated awards or invented contact details.
- Concept media and unapproved project approach notes are clearly identified in handoff; internal notes never appear as finished public copy.
- Motion has a static fallback and mobile use does not depend on hover.
- A reviewed privacy destination and actual form delivery configuration are required before launch.


## Admin dashboard extension

The selected implementation is the Payload admin panel within Next.js. Theme its supported shell and build custom overview/inquiry components where required; do not design a separate unconstrained dashboard that assumes all native editor behaviour can be replaced.

Keep the brand palette and typography, but favour task clarity: compact sidebar, page title/actions, readable tables, native-style form tabs and restrained feedback. Use white/light surfaces, ink text and orange only for primary action/focus accents. State badges include text/icons and do not rely on colour.

Desktop reference 1440px: roughly 240px sidebar, flexible workspace, 24–32px padding. Project editor uses a main content column with publication controls in a side panel where feasible. Mobile 390px: collapsible navigation, stacked editor panels, list cards or purposeful table overflow without whole-page horizontal scrolling. Keep Save draft/Publish reachable without obscuring fields.

Required screens: sign-in, overview, projects list, new/edit project, categories manager, media library/upload, inquiry inbox/detail, settings, permission-denied and session-expired states. Existing public pages remain 14; admin screens are additional scope.

Project editor groups: Basics / Story / Media & gallery / SEO, with category multi-select, curated gallery block controls, source-type switch for uploaded vs linked video, external project link, draft/preview/publish and validation summary.

Media states: queued, uploading with progress, processing, ready, failed/retry, selected and in-use deletion warning. Video sources need poster/title fields; a URL field is not an arbitrary iframe editor.

Inquiry detail separates workflow status from notification status. Show original message, contact/business data, selected service, received time, private notes, delivery attempt history and permission-gated retry. Include the important state “inquiry saved; email failed” so staff never confuse notification failure with a missing lead.

Use clearly labelled sample records only in design exploration; never put fictional inquiry personal data or invented operational totals into production seeds. Empty states are part of design, not an afterthought. Staff-only workflow copy lives in the copy deck.
