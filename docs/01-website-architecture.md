# TRAIL9INE MEDIA — Website architecture

Status: revised planning baseline · 9 November 2026 · explicit stack + portfolio/inquiry dashboard
Scope of this delivery: architecture, proposed website copy, visual system, and Stitch prompts. UI screens, application code, and deployment are subsequent stages.

## 1. Product direction

Build a portfolio-first creative agency website for Trail9ine Media, based in Toronto, Ontario. Restaurant and hospitality marketing is the primary specialization; the language should remain welcoming to other ambitious brands.

Primary visitor: a restaurant owner or marketing decision-maker who needs to judge creative quality, understand the available services, and start a relevant conversation.

Primary conversion: a completed project inquiry. Supporting actions: browse work, watch a project video, explore a service. Booking is a future secondary action only after a real booking URL is supplied.

The experience should feel like a considered creative studio with the clarity of a professional business: generous space, concise navigation, beautiful visual evidence, substantial but readable copy, and subtle motion. Restaurant imagery belongs to the agency's portfolio; this must never read like a restaurant ordering website.

Working assumptions: English public-facing copy, Canadian spelling, no public pricing, no public/customer login (staff dashboard login is required), no ecommerce, no blog at launch. Logo, colours, fonts, project photography, footage, and contact details have not been supplied. The proposed identity is a design direction, not an existing brand system. The brand spelling follows the supplied document: TRAIL9INE MEDIA, rather than the local folder's TRIAL9LINE spelling.

## 2. Sitemap and route inventory

| Route | Purpose | Template |
|---|---|---|
| `/` | Introduce positioning, prove quality through work, guide inquiries | Home |
| `/about` | Explain people, focus, and working approach | About |
| `/services` | Compare five complementary capabilities | Services index |
| `/services/social-media-marketing` | Explain organic strategy and management | Service detail |
| `/services/content-creation-video-production` | Explain video and content production | Service detail |
| `/services/food-commercial-photography` | Explain photography | Service detail |
| `/services/branding-graphic-design` | Explain identity and design | Service detail |
| `/services/paid-advertising-digital-marketing` | Explain paid campaigns and digital support | Service detail |
| `/work` | Browse and filter selected projects | Portfolio index |
| `/work/tharavadu` | Show Tharavadu collaboration | Project detail |
| `/work/90s-lounge` | Show 90’s Lounge collaboration | Project detail |
| `/work/piravi` | Show Piravi collaboration | Project detail |
| `/work/biryani-and-barbeque` | Show cinematic food production | Project detail |
| `/contact` | Collect qualified project inquiries | Contact |

14 primary content pages from 7 page templates. Five navigation links: Home, About, Services, Work, Contact. Use “Work” as the navigation label and “Selected work” as the portfolio page heading. No separate duplicate `/portfolio` page.

Supporting scope: `/privacy` with operator-reviewed text once form processing and vendors are known; a designed 404; field validation, form submission states, mobile navigation, filtering states, video dialog states. Privacy is an additional launch support page, not one of the 14 primary pages. A consent interface depends on the actual tracking/embed choices; do not add an empty cookie banner to the design.

## 3. Visitor journeys

- First impression: Home → featured project → service used → Contact.
- Service-led search: service detail → relevant project → preselected service inquiry.
- Work-first referral: Work → project → next project or Start a project.
- Agency evaluation: About → approach → relevant work → Contact.

Every service links to related work that actually includes that service. Every project links to its relevant services. No dead-end project pages. Use normal links so browsers and crawlers can follow these journeys.

## 4. Page-by-page structure

### Home

1. Header: wordmark, navigation, Start a project action.
2. Hero: positioning eyebrow, clear headline, short introduction, View our work + Start a project. One large cinematic media panel with an identifiable play control and a static poster.
3. Selected work: four projects in an asymmetric but aligned editorial grid. Titles and service context remain outside the images.
4. Agency introduction: Toronto base, restaurant specialization, collaborative creative/strategy positioning; link to About.
5. Services: five numbered rows, each with short description, custom line icon and detail-page link. No wall of interchangeable cards.
6. Approach: Understand → Create → Connect, with a useful sentence per step and optional small line animation.
7. Inquiry invitation: distinct headline, one sentence, Start a project.
8. Footer: navigation, verified contacts/socials when available, Toronto location, privacy link.

### About

Hero → working-studio image → agency story and founding → restaurant focus → three-step approach → Riyan and Shamil → final inquiry invitation. Use genuine portraits/BTS if supplied; otherwise use clearly labelled design-stage image slots. Do not invent biographies, job titles, credentials, team size, or quote cards.

### Services index

Hero → five substantial service rows with image samples and scope summaries → “How the services work together” editorial section → selected relevant work → FAQ accordion → inquiry invitation. No packages, fake prices, comparison tables or unexplained “growth engines”.

### Service detail

Breadcrumb → service name/benefit-led hero → evidence-led media → why this matters → what we can help with → proposed collaboration stages → relevant work → service-specific FAQs → inquiry invitation with selected service. A shared template allows each service a relevant media composition without five unrelated designs.

### Work index

Hero → category filters with counts derived from actual project records → four-project editorial grid → inquiry invitation. Filters: All projects, Video production, Social media, Photography, Creative campaigns. Do not pre-fill fictitious projects to make categories look busy.

### Project detail

Breadcrumb → client name + concise editorial headline → hero media → industry/services facts → confirmed overview → approach (publish after client approval) → flexible gallery → optional verified outcomes → related services → next project → inquiry invitation.

The initial brief contains no verified metrics or detailed production notes. Omit an outcomes section until evidence is available. Use client-approved descriptive scope rather than manufacturing a “challenge → solution → 400% growth” story.

Distinct compositions within one template:
- Tharavadu: food-led wide hero, two editorial photographs, vertical reel triptych.
- 90’s Lounge: atmosphere-led hero, landscape/portrait pairing, two vertical reels.
- Piravi: food/brand hero, quiet full-width photograph, short-form pair.
- Biryani & Barbeque: cinematic hero, wide still sequence, close-up pair, full-length film when supplied.

These are art-direction proposals, contingent on real deliverables. Hide unavailable gallery modules cleanly.

### Contact

Hero + warm introduction → two-column form/contact area → “What happens next” explanatory note → compact FAQ → footer. No address/map until there is a verified visitable business location. Toronto is sufficient; no fake street address.

## 5. Editable content architecture

Selected stack: **Next.js App Router + React + TypeScript + Node.js + Tailwind CSS**, with **Payload CMS** embedded for the authenticated dashboard, **PostgreSQL** for durable data, S3-compatible object storage for media, **Motion for React** for UI animation, optional Lottie, and **Resend** for email notifications.

The public site and staff dashboard share one application and content model. The 14 public pages remain unchanged; staff operations are additional scope. Full implementation architecture, collection fields, role rules, media handling, inquiry reliability and setup plan are in [Technical stack & dashboard](05-technical-stack-and-dashboard.md).

~~~text
Next.js / Node.js application
  ├── public pages: published services + reusable project template
  ├── /admin: Payload staff login + portfolio editor + inquiry inbox
  ├── PostgreSQL: content, categories, users, inquiries, notification outbox
  ├── private object storage: image/video originals + approved delivery
  └── inquiry endpoint → persist inquiry + outbox in one transaction
                           → scheduled email worker → Resend
                           → delivery webhook/status/retry in dashboard
~~~

### Dashboard scope

- Portfolio: create/edit, categories, image upload, video upload or approved embed URL, project links, reorderable gallery blocks, draft/preview/publish, featured work and SEO.
- Categories: add/edit/reorder; published categories and project records drive the public filters without a code change.
- Media library: reuse assets, alt text/crop/poster, progress/errors, safe replacement and reference-aware deletion.
- Inquiry inbox: saved submissions, search/status/service filters, private notes and email delivery status/retry.
- Staff: owner, editor and inquiry-manager permissions enforced server-side.
- Service/page copy and verified business details remain editable through CMS collections/globals.

No public registration. Public data excludes draft content, inquiry details and staff-only fields. Dashboard routes and screen inventory are specified in the technical companion.

### SiteSettings

Brand name; logo assets; location; verified email/phone/social URLs; booking URL (optional); default SEO/share image; footer copy. Suppress absent fields on the public website. A missing booking URL changes the CTA to Start a project linking to Contact.

### Service

ID, name, slug, order, short summary, eyebrow, H1, hero media, intro, scope items, proposed process steps, FAQ pairs, related project IDs, CTA label, SEO title/description, publication status. Related work comes from explicit associations, not guessed categories.

### Project

ID, name, slug, order/featured flag, editorial headline, client display name, industry, service IDs, category relationships (editable Category collection), confirmed overview, approved approach (optional), hero media, ordered gallery modules, verified outcomes (optional), related projects, client permission status, publication status, SEO title/description.

Gallery modules: wide image, image pair, portrait strip, video, captioned image, short text interlude. Each module has a stable ID and optional caption. One project template renders modules in CMS order. Limit design options to curated modules so editing cannot break alignment.

### MediaAsset

File or approved provider URL; type; poster; width/height or aspect ratio; alt text; caption; credit/usage rights; focal point; video duration; caption/transcript references where relevant. Video and its poster belong to the same media record. Do not expose internal approval comments in public UI.

### Inquiry

Full name (required), business name (required), email (required), phone (optional), service interest (required, including “Not sure yet”), project message (required), privacy acknowledgement. No budget field or required file upload at launch. Multi-service needs can be described in the message.

After server validation, rate limiting and spam checks, save the inquiry and notification outbox event in one database transaction. Only then acknowledge receipt. A scheduled worker sends email, records provider status and retries temporary failures. A failed email never removes the dashboard record. Keep lead status separate from email status; details are in the technical companion. Agree retention and reviewed privacy text before launch.

Form states: default, focus, invalid field, submitting, success, delivery failure. Preserve typed values on failure, expose an accessible status message, re-enable retry, and never show success before the database transaction commits. Email delivery can remain pending after successful receipt. If the inquiry endpoint/database is not configured, keep the build in preview rather than displaying a simulated success.

Success copy: “Thanks for telling us about your project. Your inquiry has been received.”
Failure copy: “Your inquiry couldn’t be sent. Your details are still here—please try again.”

## 6. SEO and discoverability

Page-specific proposed titles and descriptions are in `content/02-website-copy.md`. Final keywords require market research; no traffic, ranking, or lead-volume claims are made here.

- Give every public page a useful title, descriptive H1, concise description, canonical URL and share image. Keep important copy and navigation available in rendered HTML.
- Use descriptive internal links between services and real work. Avoid near-duplicate Toronto landing pages and keyword repetition.
- Provide meaningful image descriptions based on the actual asset, not a keyword list. Media placeholders are not final alt text.
- Publish sitemap and sensible robots configuration; preview environments stay out of indexing. Check public indexing controls again at launch.
- Use verified business data only for Organization structured data. Do not invent addresses, ratings, reviews, or a staffed storefront. Add breadcrumb data where it matches the page.
- Add video metadata only for real eligible videos and their actual details. A poster alone is not a completed video SEO implementation.
- Changing a published slug requires a redirect; unpublished drafts must not enter the public sitemap.

Planning reference: [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). This architecture applies its emphasis on useful content, clear page structure, descriptive links and discoverable media; it does not promise rankings.

## 7. Media, accessibility and performance intent

Use fixed media dimensions, responsive image sizes, poster-first video loading and lazy loading below the fold. Do not lazy-load the main hero image. Load video players only when needed; avoid four simultaneous background streams. Prefer one intentional hero film to a video in every card.

Set a WCAG 2.2 AA implementation target; design approval is not a compliance certification. Provide visible focus, keyboard navigation, explicit field labels, usable contrast, accessible filter/accordion states, caption support, and dialog focus handling. Hover is optional enhancement; touch visitors receive the same content.

Motion respects system reduced-motion preferences, with a static Lottie fallback. Long-running decorative movement needs a pause/stop mechanism or should end automatically. [W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html) documents using the reduced-motion media query to prevent nonessential motion.

Proposed production QA targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile when field data is available. These are targets, not measured results. Test an ordinary mobile connection; optimise actual media and third-party players before adding animation libraries.

## 8. Component inventory

Public components: Header/mobile menu; footer; breadcrumb; CTA link/button; hero/media frame; project card; numbered service row; section heading; process step; FAQ accordion; filter button group; project gallery modules; video dialog; labelled form field; select; textarea; status banner; next-project navigation; 404 state.

Admin components: authenticated shell, project table/editor, category manager, media picker/uploader, gallery block editor, preview/publish controls, inquiry inbox/detail, status badges, retry action and role-aware settings. See the technical companion and dashboard Stitch prompts.\n\n## 9. Delivery sequence

1. Review architecture and working visual direction.
2. Use the master Stitch prompt to establish Home desktop/mobile.
3. Design the six remaining template types with the shared design system.
4. Create five service-detail content variants and four project compositions; verify all 14 routes.
5. Design the admin overview, portfolio/category/media editors and inquiry inbox, including desktop/mobile states.
6. Refine public/admin UI, then implement the selected Next.js stack, Payload dashboard, media publishing and transactional inquiry/email flow.
7. Verify accessibility, links, responsive layouts, forms, SEO and real performance before launch.

## 10. Inputs to resolve before production

Official logo/brand files; approved font licensing; original work media and usage permission; client approval of project descriptions; any real results; official email/phone/socials; booking URL if wanted; founders' portraits and approved bios; staff names/roles; Node-capable hosting and domain access; PostgreSQL/object-storage configuration; verified email sender/recipient and scheduler; privacy owner and form retention decisions. The CMS choice is now Payload; provider accounts and compatible package versions are implementation inputs.

These do not prevent architecture or UI exploration. Missing public facts remain labelled in design handoff, never fabricated in production.
