# Antigravity prompt — reference-led visual rebuild

Use alongside the existing repository and [reference analysis](06-catalis-reference-analysis.md). This prompt changes the public visual direction; it does not replace the portfolio, access-control or inquiry requirements.

~~~text
Rebuild the public presentation of the existing TRAIL9INE MEDIA application using this live website as the primary design/motion reference:
https://catalis-temlis.webflow.io/

Read docs/design/06-catalis-reference-analysis.md if supplied. Independently open the reference in a browser and inspect the main homepage at desktop/mobile sizes, its scroll sequence, and the About/Features/Contact examples. Do not rely only on extracted text or an initial screenshot.

This is a substantive visual rebuild, not another generic purple agency layout.

REFERENCE PRINCIPLES TO TRANSLATE

1. Expressive condensed editorial serif headings, with selective same-family italic emphasis.
2. Neutral, readable sans-serif body and interface text.
3. A carefully framed atmospheric hero with a fixed white navigation island and soft rounded edges.
4. Short introductions, compact capsule actions and strong visual hierarchy.
5. Layered 2D media with bounded translation/scale, not decorative dashboards.
6. Deliberate alternation of open white sections and rounded branded sections.
7. Coordinated heading entrances, restrained scroll reveals and clipped button-label transitions.
8. Large, intentional image compositions and a confident typographic closing signature.

These principles must be apparent in the rendered result. Adding animation to the rejected current layouts is not enough.

BRAND AND ORIGINALITY

Keep the actual official TRAIL9INE logo and plum–purple–indigo identity. Preserve the symbol; a large text footer signature is separate from that logo.

Translate the reference's sky/finance environment into an original creative-agency environment using real hospitality, food, production and campaign media.

Do not copy Catalis text, brand identity, finance charts, stock people, template images or its generated source code. Do not import Webflow runtime or jQuery into this React application.

The reference is useful for composition and interaction. Its pricing, fake demonstration metrics, testimonial strip, blog and long SaaS feature structure are not requirements for TRAIL9INE.

TYPOGRAPHY

The inspected reference uses Libre Caslon Condensed regular/italic for headings and Roboto for body text. Use an appropriately licensed available implementation of this type direction; inspect licences and supported fonts before installation.

Do not silently substitute another generic bold geometric sans for the display face.

Set a responsive hierarchy, not a giant fixed font on every page. Keep long service names and CMS-generated project titles readable. Use italic emphasis selectively.

PUBLIC PAGE PLAN

Home:
Framed plum/indigo atmospheric hero, centred serif/italic headline, clear introduction and two actions, one strong real-media composition; then selected work, concise agency introduction, services, short approach and closing invitation.

Suggested original hero copy:
Creative stories.
Lasting impressions.
Use italic emphasis on one meaningful word.
Supporting text:
Film, photography and marketing for restaurants and ambitious brands. Based in Toronto.
Actions:
Explore our work / Start a project.

About:
Human editorial story and deliberate studio-image pairings. Keep supplied facts, names and approved text; do not invent founder biographies.

Services:
Present five capabilities with consistent typography and relevant media. Keep useful scope descriptions; do not mirror the reference's finance-feature content.

Service detail:
Short, focused and reusable: heading, relevant media, scope, optional verified related work and inquiry action.

Work:
The requested clean 3-column desktop / 2-column tablet / 1-column mobile grid remains. Category filters, URL state and pagination remain functional. Use elegant rounded covers and readable captions. Do not replace browsing with an animated horizontal carousel.

Project detail:
Keep dynamic /work/[slug] and the saved CMS content. Use a compact editorial introduction, facts, hero and modular image/video gallery. Handle sparse and long content gracefully.

Contact:
A calm, readable form with clear labels and accurate receipt states. Preserve the required business/service fields and dashboard/email workflow.

Header/footer:
Build shared components with intentional home/interior variants. Links remain Work / Services / About / Contact. Keep navigation usable and keyboard-accessible. No public admin menu.

MOTION IMPLEMENTATION

The inspected reference explicitly loads GSAP, ScrollTrigger and SplitText, and its page-specific interactions contain text splitting, scroll-linked reveals, layered transforms and hover timelines.

Use GSAP + @gsap/react for the coordinated public presentation, with ScrollTrigger and selective SplitText as needed. Check current official documentation and installed compatibility.

Do not install Three.js: no actual 3D experience is required. Do not add Lottie unless an actual approved illustration needs it.

Audit existing Motion for React usage. Keep it only for clearly separate responsibilities; GSAP and Motion must not compete over the same element/property.

Implement:
- A short ordered hero entrance.
- Selected heading word/line reveals.
- Gentle image entrances.
- Small bounded layer movement in one or two compositions.
- Clipped button-label roll with one accessible name.
- Restrained project-image hover.
- Clear mobile-menu transitions.

Keep animation restrained:
- Prefer one-time entrances for essential copy.
- Do not require precise scroll positioning to make text readable.
- No long pinning, scroll hijacking, massive parallax or continuous marquee by default.
- Reduce or remove layered movement on mobile.
- Honour prefers-reduced-motion.
- Scope setup/cleanup with React lifecycle.
- Revert split text and triggers on unmount/breakpoint changes.
- Account for font readiness and wrapping.
- Prevent hidden content after fast scrolling, route changes or failed animation initialisation.
- Never obscure form errors, focus or loading states.

Retain a readable server-rendered baseline. Do not reveal the whole page only after a blocking animation.

PRESERVE THE WORKING APPLICATION

Inspect the actual repository before editing. Preserve records, uploads, auth, roles, inquiry persistence, notification retries and established routes.

Do not reset the database, introduce a replacement CMS, hardcode portfolio records or create source files per client.

Prove with a disposable project:
Admin create → text/media/category → draft → private preview → publish → public Work card → functioning detail route → edit/republish → unpublish.

Retain accurate public success wording:
“Thanks for telling us about your project. Your inquiry has been received.”

Keep admin task-focused. Do not apply decorative public-site animations to the editor or inbox.

IMPLEMENTATION SEQUENCE

1. Inspect current files and reference; identify reusable backend/components.
2. Establish font/colour/radius/spacing tokens and a small shared component set.
3. Implement Home and Work/detail with real CMS data.
4. Apply the system across the remaining public pages.
5. Add scoped motion after static compositions are correct.
6. Verify desktop/mobile and reduced-motion behaviour.
7. Re-run project and inquiry workflows.

Continue through implementation rather than stopping after a plan. Do not deploy externally as part of this request.

VERIFICATION

Use browser inspection and screenshots at 1440px and 390px, plus narrow/mobile/tablet checks.

Review:
- Typography and italic balance.
- Rounded framing and header proportions.
- Image crops and media dimensions.
- Section rhythm and CTA hierarchy.
- No horizontal overflow.
- Keyboard navigation and touch interactions.
- Direct project URL visits and refresh.
- Fast scrolling/back navigation/reduced motion.
- No essential text left transparent.
- No abandoned timers or triggers after navigation.

Run type checks, production build and focused tests for changed behaviour.

Report exactly what was built and verified. Separate visual inspection, browser interaction tests and scripted API tests. If reference/browser access is unavailable, disclose it rather than claiming faithful visual verification.

The end result should translate the reference's editorial elegance and motion craft into an original TRAIL9INE experience, with its real content and functioning dashboard-managed portfolio.
~~~
