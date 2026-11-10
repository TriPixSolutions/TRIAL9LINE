# Catalis reference — inspection and TRAIL9INE adaptation

Inspected 9 November 2026.
Reference: https://catalis-temlis.webflow.io/

## Scope and evidence limits

Browser inspection covered the main homepage from hero through footer at a 1440px desktop reference width, homepage hero/navigation and a scroll sample at 390px, plus desktop About, Features and Contact V1. Home V2 and V3 hero compositions were compared. The homepage's HTML, CSS and public Webflow application scripts were inspected as read-only technical evidence.

This is an in-depth review of the main experience and shared design/motion language, not a claim to have tested every pricing, blog, contact variation, form submission, accessibility condition or animation frame. No forms were submitted. Hover effects below are source-confirmed where indicated; they were not all individually pointer-tested. Screenshots and changing DOM styles provide sampled visual evidence, not a continuous performance recording.

Downloaded sources in ../reference/catalis-analysis are research snapshots, not application dependencies or source to transplant. TRAIL9INE application files were not modified.

## 1. Why this direction differs from the earlier proposals

This reference relies on an editorial serif display face, selective italics, curved framing and carefully sequenced visual layers. The earlier bold grotesk/orange/lime proposals were a different direction.

The transferable idea is an expressive but organised composition: one dominant statement, one recognisable visual system, compact controls and carefully spaced supporting content. Adding a generic fade to the existing rejected layouts would not reproduce that effect.

This direction supersedes the earlier all-sans display recommendation for the public-facing creative direction. Body/interface text should remain a legible sans serif. The admin remains functional and should not inherit decorative display animation.

## 2. Visual system observed

### Typography

- The inspected headings compute to a custom font named Librecasloncondensed; the stylesheet loads LibreCaslonCondensed regular and italic OTF files.
- Desktop homepage H1 computed to 72px; several major H2s to 64px, with a long statement at 56px.
- At 390px the homepage H1 computed to 48px.
- The inspected body computes to Roboto, sans-serif. Inter also appears among loaded font requests, so loaded resources alone should not be mistaken for the actual primary body face.
- Roman and italic words share the same family. The contrast is typographic, not a random mixture of unrelated fonts.

For TRAIL9INE: use an appropriately licensed condensed editorial serif plus a neutral sans. Italic emphasis belongs on one meaningful word in selected headings, not every line. Inspect available font files/licences before installation; do not pull font binaries from the template as an assumed licensed asset.

### Framing and navigation

The main hero has a small white outer frame and a large rounded boundary; desktop hero CSS specifies a 2rem radius. The fixed white navigation island is centred over the main homepage hero, with rounded lower corners and a contrasting pill CTA.

Interior pages use a broader header presentation. Therefore the site does not apply one giant floating nav rectangle indiscriminately.

For TRAIL9INE: build one header component with intentional home/interior variants. Keep public links Work / Services / About / Contact, with Start a project. At mobile widths, the navigation becomes a compact white header/menu, not a compressed desktop row.

### Colour and imagery

The template uses a recurring sky/landscape photographic environment, cool blue accents, white surfaces and dark text. Much of its depth comes from actual background imagery and layered image assets, not just a CSS gradient.

For TRAIL9INE: translate the recurring colour environment to plum/purple/indigo with authentic hospitality imagery. Do not recolour food purple. A consistent rounded poster/reel frame can replace the finance-interface motif.

### Surface hierarchy

Large rounded sections alternate with generous open white space. Content areas mix four-up, two-up and three-up arrangements rather than repeating a single grid. Buttons are compact rounded capsules with clipped text layers. The footer uses a very large typographic brand treatment as a closing visual.

For TRAIL9INE: reserve large curves for section/media framing and smaller curves for controls. Keep portfolio browsing as the user's requested consistent three/two/one-column grid. Use a large text brand signature without stretching or modifying the official symbol.

## 3. Main homepage flow and useful translation

| Reference role | TRAIL9INE adaptation |
|---|---|
| Atmospheric centred opening with layered product visuals | Plum/indigo framed hero, serif/italic statement, real production image and optional reel |
| Large statement with a central image composition | Brief agency introduction with BTS imagery |
| Supporting metric strip | Omit unless real evidence exists; do not replace with invented agency numbers |
| Coloured benefits area | Five clearly described agency capabilities |
| Image-rich feature panels | Selected projects and/or service samples |
| Additional capability group | Compact working approach only if it adds distinct information |
| Public pricing | Omit; public pricing is outside the brief |
| Moving review strip | Omit until real testimonials exist; project imagery may provide a quieter alternative |
| Article preview cards | Do not add a blog merely to mirror template length |
| Rounded closing scene | One coherent branded inquiry invitation |
| Large footer word treatment | TRAIL9INE text signature plus clear useful links |

Recommended TRAIL9INE Home sequence: framed hero → selected work → concise agency statement → services → short approach → inquiry invitation → footer.

The reference is a finance/SaaS template. Its content model and exact section order are not the agency's information architecture.

## 4. Animation inventory

Evidence classifications: visual = browser samples observed; DOM = changing transforms inspected; source = declared in the public page-specific configuration. A configured effect is not proof that every instance ran under every condition.

| Effect | Evidence | What is happening | TRAIL9INE decision |
|---|---|---|---|
| Opening heading sequence | Visual + source | Character splitting, opacity and vertical entrance; description uses word splitting; CTA sequence follows | Adopt selectively, with a short complete sequence |
| Large statement reveal | Visual + source | ScrollTrigger config includes scrub: 0.8, with split text opacity/position changes tied to scroll | Use a softer one-time reveal for essential copy; at most one restrained scroll-linked statement |
| Layered image cards | DOM + source | Overlays translate/scale relative to the main composition during scrolling | Use real reel/poster layers in one hero/BTS composition |
| Button label roll | Source | Duplicate clipped text layers translate on hover | Adopt with one accessible label; decorative duplicate hidden from assistive technology |
| Card hover scale | Source | Blog-card image scales on pointer entry/exit | Adapt to project cards, with keyboard/touch equivalents |
| Footer link line | Source | Underline moves through a clipped region on hover | Optional small shared link treatment |
| Badge entrance | Source | Badge size/opacity or related transforms animate | Use sparingly; avoid an animated label above every heading |
| Continuous review strip | Visual + DOM + source | Duplicated horizontal groups translate continuously; transforms changed between observations | Not required; no fake reviews and no uncontrolled loop |
| Mobile navigation | Visual + source | Menu opens/closes; nav-specific timelines exist | Adopt the clear interaction, with robust ARIA/focus handling |
| Hero/closing visual motion | Source + static visual context | Page-specific layered image timelines; no observed WebGL canvas required | Translate to subtle 2D motion, not a new 3D feature |

Source timing examples, not universal values: opening text actions include 0.4-second durations and stagger groups; one heading scroll configuration uses start “50% bottom”, end “bottom 50%” and scrub 0.8. These are evidence of sequencing mechanics, not a specification to copy into every TRAIL9INE element.

Important: some sampled scroll positions leave reference text partly transparent while the reveal is in progress. Preserve TRAIL9INE readability rather than requiring visitors to scroll to an exact position to finish reading essential copy.

## 5. Confirmed technology versus inference

| Technology | Finding |
|---|---|
| Webflow | Confirmed by page metadata, generated classes, runtime files and public template identity |
| Webflow interactions | Both legacy ix2 initialisation and ix3 registration appear in the page application script |
| GSAP | Loaded explicitly from a versioned 3.15.0 script URL |
| ScrollTrigger | Loaded explicitly and referenced by the page-specific interaction configuration |
| SplitText | Loaded explicitly; configuration includes character/word splitting |
| jQuery | Explicit 3.5.1 runtime script present |
| CSS transforms/layout | Confirmed: translation, scaling, rounded overflow clipping, flex/grid and selective backdrop blur |
| Image formats | Background AVIF and other image assets appear in public resources |
| Three.js/WebGL | No Three.js script found among inspected dependencies; main homepage DOM had zero canvas elements |
| Lottie | No Lottie element found on inspected main homepage; generic runtime mentions alone do not establish usage |
| Video | Main homepage DOM sample had zero video elements; attractive moving compositions need not be actual videos |
| Backend/database | Cannot be established from the public frontend; do not infer a Node/PostgreSQL application behind this template |
| React/Next.js | Not established for this reference; the proposed TRAIL9INE stack is separate |

A timeline named “Hero Three Loop” is not evidence of Three.js; the name refers to an interaction label and must not be confused with a rendering library.

## 6. Recommended implementation for TRAIL9INE

Retain Next.js/TypeScript/Tailwind, Payload, the actual configured database and inquiry backend. Adapt visual principles without importing Webflow runtime or jQuery into the React application.

For this reference-led direction, use GSAP + @gsap/react as the main public presentation engine, with ScrollTrigger and selective SplitText. This is a revised recommendation relative to the earlier Motion-first plan because the new reference has explicit coordinated text/scroll sequencing.

Do not animate the same element's transform/opacity with both GSAP and Motion. Keep existing Motion only where it has a clearly separate working responsibility; do not replace it everywhere merely for package uniformity. CSS is sufficient for many focus/colour interactions.

Use scoped React animation setup/cleanup; respond to breakpoint and reduced-motion changes; revert text splitting and triggers on unmount. Handle font readiness and text reflow. Keep important content available before hydration and when motion is disabled.

Proposed starting motion values (original project choices, not measured template values):
- Opening sequence: roughly 0.7–1.1 seconds overall, restrained stagger.
- Section entrance: 0.45–0.65 seconds, 12–24px movement.
- Media hover: scale up to approximately 1.025, around 0.3 seconds.
- Layer motion: small bounded offsets; reduced or removed on mobile.
- No long pinned sections, scroll takeover or mandatory smooth-scroll library.
- No continuous loop by default.

Implement real media fallbacks and lazy-load secondary players. A reference-like composition must remain sound without video, animation or a perfectly populated gallery.

## 7. Public-page adaptation

Home: centred editorial-serif opening, selective italic word, framed brand atmosphere, one strong media composition; Work visible soon after.

About: open text + staggered real studio/people image pair. Do not reuse stock template subjects as founders.

Services: shared serif hierarchy, concise scope, a mix of relevant sample imagery and structured descriptions; five capabilities remain easy to compare.

Service detail: compact heading, relevant visual, scope and short inquiry invitation; no template-length filler.

Work: retain consistent 3/2/1-column grid; apply rounded image treatment, good caption hierarchy and restrained hover. No permanent moving carousel as the only way to browse.

Project detail: dynamic CMS record, clear facts and modular gallery. Animations enhance the actual published content; they must never be a substitute for a working route.

Contact: calm rounded form grouping, explicit labels and genuine saved-inquiry feedback. Keep required business/service fields even though the reference uses a simpler form.

Admin: clear functional typography and restrained feedback. No split text, decorative parallax or marketing-style animation in the editor/inbox.

## 8. Verification and next implementation boundary

This research did not change the website's application code, install GSAP or test the current local app. It establishes a reference-led direction and a concrete handoff for the developer.

Implementation must prove:
- All required pages use the new system, not just Home.
- Real project records and media still work through create/draft/preview/publish/detail/unpublish.
- 390px mobile and desktop layouts are inspected in a browser.
- Fast scrolling, direct route loading and back navigation do not leave text invisible.
- Reduced motion disables decorative sequences.
- Form persistence, staff permissions and background notifications survive the UI changes.

## Sources

- [Catalis main homepage](https://catalis-temlis.webflow.io/)
- [About](https://catalis-temlis.webflow.io/about)
- [Features](https://catalis-temlis.webflow.io/features)
- [Contact V1](https://catalis-temlis.webflow.io/contact/contact-v1)
- [Home V2](https://catalis-temlis.webflow.io/home/home-v2)
- [Home V3](https://catalis-temlis.webflow.io/home/home-v3)
- [Page-specific Webflow interaction script](https://cdn.prod.website-files.com/690a3d4b70be67fbdfcdc08a/js/webflow.459743b6.e15722ff015d5abf.js)
- [Shared stylesheet](https://cdn.prod.website-files.com/690a3d4b70be67fbdfcdc08a/css/catalis-temlis.webflow.shared.53a618a0b.min.css)
- [GSAP React integration](https://gsap.com/resources/React/)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
