# TRAIL9INE MEDIA — Stitch prompt pack

Prepared for manual use in Stitch. No Stitch screens have been generated or inspected in this phase. These prompts do not depend on a particular Stitch feature, screen limit or export option.

## How to use

## Updated technical context — applies to every prompt

Implementation baseline: Next.js App Router + React + Node.js + TypeScript + Tailwind CSS. Motion for React is the primary animation library; optional lazy-loaded Lottie for the process diagram. Payload CMS embedded at /admin, PostgreSQL database, S3-compatible image/video storage and Resend transactional email.

The public portfolio is data-driven: categories and projects come from the dashboard, with one reusable detail template and curated gallery blocks. Four projects are initial content, not a permanent hardcoded limit. Public filters use published records and active CMS categories. Staff have draft/preview/publish controls.

An inquiry is first saved durably to the database/inbox. A background outbox worker sends email and records retries/delivery events. Public success means receipt, not guaranteed email delivery. Use “Your inquiry has been received.” Dashboard lead status and email status remain separate.

Use the technical companion (05-technical-stack-and-dashboard.md) for route/permission/source-of-truth details. Style native Payload admin conventions and custom overview/inquiry views; do not assume the dashboard is a disconnected application. GSAP/Three.js are not baseline requirements.

## Workflow

Start in one design project with Prompt 01. Supply the content deck (02-website-copy.md) and design system (03-design-system.md) through the available context input. If file attachment is unavailable, paste the relevant text. Start with Home desktop/mobile; establish its direction before expanding.

For each follow-up, paste the complete matching page copy from the content deck. It contains the intros, body copy, deliverables, FAQs and metadata; do not ask the design tool to improvise missing facts. Continue in the same design project, or supply the approved Home reference alongside the master direction in a new session.

Prompts 02–07 cover all template types. Prompts 08–09 complete the five services and four project variants. Prompts 10–12 cover public states, responsive refinement and consistency. Prompts 13–18 cover the authenticated dashboard and full-system review. A static screen does not prove working forms, Lottie, CMS, SEO or video playback.

## Prompt 01 — Master direction + Home desktop/mobile

~~~text
Design a polished, complete homepage for TRAIL9INE MEDIA, an independent Toronto creative marketing agency specialising in restaurants and hospitality, also open to other businesses. The main goals are to showcase excellent creative work, explain services clearly and generate project inquiries. This is an agency website, not a restaurant ordering site.

Create a premium editorial direction: warm paper #F5F3EE, near-black #171916, supporting text #5C6058, fine rules #D8D9D1, restrained burnt-orange #A83E24. Let food and hospitality imagery supply most of the colour. The result should feel professionally credible, calm, precise and creatively distinctive. Use a working typographic TRAIL9INE MEDIA wordmark until an official logo is supplied.

Use Manrope-style geometric sans headings and Inter-style readable body copy. Large confident headings, sentence case, careful line breaks, generous negative space. Desktop at 1440px: 80px outer gutters, 1280px content width, 12-column grid, 24px gaps. Mobile at 390px: 20px gutters and single-column reading flow. Section rhythm around 112–144px desktop and 64–80px mobile. Body text 17–18px desktop, 16–17px mobile. Buttons around 48px tall. Fine borders, 4–8px corners, almost no shadows.

Navigation: Home, About, Services, Work, Contact. Header action: Start a project. Keep navigation simple. Design mobile navigation collapsed, with an annotated open-menu state.

Build the full homepage:
1. Hero eyebrow: TORONTO CREATIVE MARKETING AGENCY.
H1: Make your brand worth a second look.
Intro: Social media, film, photography and design for brands with a story to tell. Based in Toronto, with a focus on restaurants and hospitality.
Actions: View our work; Start a project.
Follow with one expansive cinematic media poster. Label it “A closer look at our work”. Use “Play showreel” only when an approved real film is supplied. Concept media is a design-stage placeholder, not actual client work.

2. Selected work. Heading: A taste of what we create.
Intro: Food, atmosphere and the details that give a brand its character. Explore selected content and campaigns from our restaurant collaborations.
Four projects in an asymmetric, aligned editorial grid:
Tharavadu — South Indian flavours, brought into focus. Social media / Food video / Photography.
90’s Lounge — Food, drinks and the feeling of a night out. Social media / Video / Creative content.
Piravi — A closer look at the dining experience. Social media / Content / Video.
Biryani & Barbeque — A cinematic look at every detail. Film / Creative direction / Commercial content.
Keep names and categories readable outside the imagery without hover. Action: View all work.

3. Agency introduction. Heading: Creative work, with a reason behind it.
Body: A beautiful image is a starting point. The real question is what it says about your business—and why your audience should care.
Body: Trail9ine Media brings content production and marketing together. We work with restaurants and other brands to shape a consistent presence, from the first idea to the content people see in their feed.
Link: Meet Trail9ine.

4. Services. Heading: From the idea to the everyday presence.
Five numbered ruled rows, restrained line icons, explicit detail links:
Social Media Marketing — Thoughtful planning, relevant content and consistent publishing that give your brand a recognisable voice.
Content Creation & Video Production — Short-form reels, brand stories and cinematic commercial content built around what makes your business distinctive.
Food & Commercial Photography — Food, products and spaces photographed with attention to the details that matter.
Branding & Graphic Design — Visual identity, menus and campaign graphics that help your brand speak clearly.
Paid Advertising & Digital Marketing — Campaign planning, paid media and supporting creative to reach a more relevant audience.
Avoid a generic SaaS feature-card grid.

5. Approach. Heading: Understand first. Create with purpose.
Understand — We begin with your business, your audience and what you want the work to achieve.
Create — We develop the idea, shape the content and bring the right creative skills to the project.
Connect — We prepare the work for its platforms and, where included in the scope, support publishing and reporting.
Annotate an optional thin-line Lottie joining the steps, one 2–3 second play, static reduced-motion fallback. Essential copy stays outside the animation.

6. Final invitation. Heading: Your next chapter starts with a conversation.
Body: Tell us about your business, the work you have in mind and where you could use a creative partner.
Action: Start a project.

7. Footer: shared navigation, service links, Toronto location, verified contact/social channels when available, privacy destination. No invented contact details. Put missing-asset annotations outside finished page content.

Use real supplied media where available. During exploration, food close-ups, warm interiors and studio imagery may be clearly annotated as concept assets. Do not invent client signage, reviews, results, awards, logo strips, prices or metrics. No neon gradients, glass panels, constant marquees, decorative dashboards or stock handshake images.

Motion intent: restrained section reveals, subtle arrow movement, slight image hover zoom. No custom cursor, scroll hijacking or heavy parallax. Annotate behaviour static screens cannot demonstrate.

Produce the full desktop layout and a genuinely reflowed mobile counterpart. Preserve substantive copy and all sections. Do not make the mobile hero consume the whole first screen. Use the supplied copy deck and visual-system specification. Implementation baseline is Next.js/TypeScript/Tailwind/Motion with dashboard-managed portfolio content as defined in the updated technical context above.
~~~

## Prompt 02 — About

~~~text
Using the approved Trail9ine Home reference and design system, design /about at 1440px and 390px. Use the complete About copy supplied from the content deck.

Hero: ABOUT TRAIL9INE / A creative partner for the story you’re building.
Intro: We bring together visual storytelling and marketing to help businesses show up with a clearer, more consistent identity.

Sequence: credible BTS/studio image → “Built around ideas, people and purpose” story → “A particular appetite for restaurant stories” image/text section → Understand/Create/Connect → founders Riyan and Shamil → Clarity before output / Craft in the details / Consistency over noise → “Let’s find the story in your business” inquiry invitation → shared footer.

Facts: Toronto; independent creative marketing agency; founded in 2025; co-founded by Riyan and Shamil; supported by a collaborative network of editors, designers, content planners and social media specialists. Do not invent individual roles, biographies, credentials or team size. Use annotated portrait slots if genuine portraits are absent.

Make this a human editorial story with readable paragraph measure, deliberate pacing and logical mobile order. Avoid a timeline of invented milestones. Use the full supplied paragraphs, not lorem ipsum.
~~~

## Prompt 03 — Services overview

~~~text
Design /services for Trail9ine at 1440px and 390px using the established system and complete Services copy.

Hero: OUR SERVICES / Good ideas. Carefully made. Put to work.
Intro: From a single production to a more consistent brand presence, our services connect creative thinking with the practical needs of your business.

Create five generous numbered sections: Social Media Marketing; Content Creation & Video Production; Food & Commercial Photography; Branding & Graphic Design; Paid Advertising & Digital Marketing. Each needs the supplied description, scope line, restrained line icon, relevant visual and explicit detail-page link.

Use ruled editorial rows and alternating but aligned media arrangements. Avoid tiny cards. Follow with “A connected presence starts with connected thinking”, relevant selected work, the three supplied FAQ answers and “Let’s work out what your brand needs next” CTA.

No prices or packages. No fictional dashboards presented as campaign results. On mobile group each service title, summary, scope, media and link together. Concept service images must be labelled in handoff until replaced.
~~~

## Prompt 04 — Reusable service detail

~~~text
Design a reusable Trail9ine service-detail template using Social Media Marketing as the populated example, desktop 1440px and mobile 390px. Use the complete corresponding service copy, including scope, process and FAQ answers.

Breadcrumb Home / Services / Social Media Marketing.
H1: Give people a reason to keep following.
Intro: Build a social presence that feels like your business: relevant, recognisable and worth paying attention to.

Sequence: label/headline/intro/inquiry action → relevant social-content media → “More than keeping the feed busy” explanatory copy → numbered scope list → proposed four-stage working process → related work (Tharavadu, 90’s Lounge, Piravi) → three service-specific FAQs → “Make your next post part of a bigger picture” / Discuss social media → footer.

Keep useful content visible rather than hiding the whole page inside accordions. Do not create fake client-account results. The Contact CTA should preselect this service, still editable in the form.

Template must handle long service names, varied media ratios, service-specific FAQs and no related-work module when no real case exists. It must close the gap cleanly when optional content is absent.
~~~

## Prompt 05 — Portfolio index

~~~text
Design /work in the approved Trail9ine system, desktop and mobile.
Hero: SELECTED WORK / The stories, made visible.
Intro: A selection of restaurant collaborations, creative content and commercial production. Explore the food, atmosphere and ideas behind the work.

Filters: All projects, Video production, Social media, Photography, Creative campaigns. Clear selected state. Counts only if derived from confirmed project records; do not invent them.

Exactly four initial projects: Tharavadu, 90’s Lounge, Piravi, Biryani & Barbeque. Use supplied summaries and service labels. Vary image proportions within a disciplined grid, with names and categories outside images. Play icons only for real playable assets. No fake extra projects.

Design empty state: No projects in this category yet. Explore all work.
On mobile let filters wrap, and stack projects. No horizontal overflow or carousel as the only way to reach work.
Closing: What could we create for your brand? / Start a project. Shared footer.
~~~

## Prompt 06 — Reusable project detail

~~~text
Design a full Trail9ine project-detail template using Tharavadu, desktop and mobile. This is the agency's portfolio page, not a restaurant website.

Breadcrumb Home / Work / Tharavadu.
H1: Tharavadu.
Editorial line: South Indian flavours, brought into focus.
Industry: Restaurant & Hospitality.
Services: Social Media Marketing / Food Videography / Photography / Creative Campaigns.
Confirmed overview: Our work for Tharavadu brings South Indian cuisine, restaurant experiences and promotional campaigns into engaging social content across its locations.

Sequence: title/facts → expansive hero poster → confirmed overview → optional approved approach → flexible gallery → related services → next project (90’s Lounge) → “Let’s tell your brand’s story next” / Start a project → shared footer.

Gallery proposal: wide food hero, two editorial photographs, 9:16 reel sequence. Use actual media where available; label exploration assets in handoff. On mobile preserve aspect ratios and stack reels rather than squeezing three into a tiny row.

The content deck's proposed approach is an internal draft, not a verified production account. Omit it from finished public frames until approved. No metrics, quotes, invented challenges, dates or production details.

Reusable modules: wide image, image pair, portrait strip, video, captioned image, short text interlude. Other projects will vary the gallery while sharing this template. Omit unavailable modules rather than creating fake deliverables.
~~~

## Prompt 07 — Contact

~~~text
Design /contact using Trail9ine's system at 1440px and 390px.
Hero: GET IN TOUCH / Tell us what you’re building.
Intro: A new launch, a better social presence or content that finally feels like your brand. Let’s start with what you have in mind.

Desktop: introduction/contact information left, spacious form right. Mobile: intro, form, supporting contact details.
Persistent form labels:
Full name (required); Business / company name (required); Email address (required); Phone number (optional); Service interested in (required); Tell us about your project (required).
Service options: five service names plus Not sure yet.
Textarea helper: What does your business do, and what would you like help with?
Privacy acknowledgement linked to reviewed Privacy Policy. No newsletter opt-in.
Action: Send inquiry.

Design empty, focused, invalid, submitting, success and server-failure states.
Success: Thanks for telling us about your project. Your inquiry has been received.
Failure: Your inquiry couldn’t be sent. Your details are still here—please try again.
Keep values on failure. Labels are not placeholders.

Supporting heading: A conversation is a good place to start.
Location: Toronto, Ontario, Canada. Do not invent street address, email, phone or social URL. No map or fake booking widget. Mark missing verified channels only in handoff.

What happens next: We’ll review your inquiry and get in touch to learn more about the project, discuss the scope and explore the next steps.
Include the three supplied Contact FAQs. No unconfirmed reply deadline. Booking can be secondary only when a real booking URL exists.
~~~

## Prompt 08 — All five service variants

~~~text
Expand the approved service-detail template into all five pages, desktop and mobile. Use each complete matching section of the copy deck, including its intro, explanatory copy, scope, proposed process, FAQs and CTA.

1. /services/social-media-marketing
H1: Give people a reason to keep following.
Media: social content strip.
Related work: Tharavadu, 90’s Lounge, Piravi.
CTA: Discuss social media.

2. /services/content-creation-video-production
H1: Stories people want to watch.
Media: cinematic landscape poster and portrait reels.
Related work: all four projects.
CTA: Plan a video project.

3. /services/food-commercial-photography
H1: Make the details do the talking.
Media: food/product editorial image pairing.
Related work: Tharavadu only from the supplied scope.
CTA: Discuss a photography project.

4. /services/branding-graphic-design
H1: A clearer identity. A more consistent impression.
Media: identity/menu/campaign composition, concept assets clearly annotated.
No verified branding case supplied: omit related-work module.
CTA: Discuss branding and design.

5. /services/paid-advertising-digital-marketing
H1: Put a clear message in front of the right audience.
Media: relevant campaign creative, no invented analytics.
No verified paid case supplied: omit related-work module.
CTA: Discuss digital marketing.

Keep one coherent template with service-specific media. Do not reuse the same paragraphs across services or imply that “creative campaigns” means paid media. Check long titles wrap cleanly.
~~~

## Prompt 09 — All four project compositions

~~~text
Using the approved project template and each complete project section from the copy deck, design all four project pages at desktop and mobile sizes.

Tharavadu: South Indian flavours, brought into focus.
Wide hero, editorial photo pair, portrait reel sequence.
Services: social media, food video, photography, creative campaigns.
Next: 90’s Lounge.

90’s Lounge: A menu. An atmosphere. A reason to look closer.
Atmosphere hero, landscape/portrait pairing, two portrait video posters.
Services: social media, video, creative content.
Next: Piravi.

Piravi: The dining experience, one detail at a time.
Food-led hero, quiet full-width frame, short-form pair.
Services: social media, content creation, video.
Next: Biryani & Barbeque.

Biryani & Barbeque: Food, framed for the screen.
One cinematic dark media section in the shared paper system, wide still sequence, close-up pair and main film poster.
Services: cinematic video, creative direction, commercial content.
Next: Tharavadu.

Use confirmed overviews as factual narrative. Proposed approaches remain internal notes until approved. Omit results, quotes, dates, locations and awards not supplied. Galleries are proposals dependent on real media, not claims of deliverables.

Avoid repeated stock imagery across clients. Label non-client concept media in handoff. Keep consistent type, facts, navigation and CTA styles while varying visual pacing. Mobile gallery groups stack without forced landscape orientation or horizontal overflow.
~~~

## Prompt 10 — Interaction and supporting states

~~~text
Create a Trail9ine component/state board matching the approved pages:
- Desktop active/focus navigation; mobile menu closed/open and close action.
- Buttons/links: default, hover, focus and busy/disabled where applicable.
- Project card default/hover/focus; separate media playback from project navigation.
- Portfolio filters selected/unselected, result summary, empty/reset.
- FAQ collapsed/expanded with a long answer.
- Video poster, loading, playable, unavailable/error and visible dialog close.
- Form focused/filled, required error, invalid email, submitting, success and server failure with retained values.
- Contact service preselected via a service-page CTA, still editable.
- 404: “This page isn’t in the frame.” / “The link may have changed. Explore our work or head back to the homepage.” Actions: View our work / Back to home.

Annotate keyboard focus, dialog focus return, static reduced-motion fallback and optional process Lottie. Do not claim working backend or motion from static screens. Do not invent a final legal policy.
~~~

## Prompt 11 — Responsive refinement

~~~text
Review the entire Trail9ine family at 1440px and 390px. Specify changes at 834/768px, 360px and 320px.

Check long headlines, service names, founder names, form labels, filter wrapping, portrait-video proportions and footer links. Fix clipping, crowding and horizontal overflow through deliberate reflow rather than shrinking all text.

Keep body copy readable, touch controls generous and field labels visible. No mobile interaction depends on hover. Stack columns in logical reading order and remove blank gaps left by desktop media placement. Keep all substantive sections.

Provide a compact handoff table: component / desktop / tablet / mobile behaviour. Distinguish visual changes from implementation accessibility requirements.
~~~

## Prompt 12 — Final consistency/content audit

~~~text
Audit route coverage:
/; /about; /services; /services/social-media-marketing; /services/content-creation-video-production; /services/food-commercial-photography; /services/branding-graphic-design; /services/paid-advertising-digital-marketing; /work; /work/tharavadu; /work/90s-lounge; /work/piravi; /work/biryani-and-barbeque; /contact.

Verify all 14 primary pages with desktop/mobile counterparts from seven templates. Also cover 404 and form/filter/media states. Reserve privacy layout if needed; legal copy is pending operator details.

Compare every page against the content deck. Remove lorem ipsum, invented facts, fake metrics/testimonials, prices and fake contacts. Do not surface internal project-approach notes as approved copy. List missing real assets separately.

Unify header/footer, buttons, icons, rules, section spacing, media corners, captions and grid baselines. Verify four distinct project compositions and five specific service pages. Do not fabricate related case studies.

Specify destinations for every CTA. Start a project goes to Contact; Book a consultation needs a real booking link. Provide remaining issues. Distinguish completed design from implemented functionality, accessibility validation and SEO checks.
~~~


## Prompt 13 — Dashboard shell, sign-in and overview

~~~text
Design the staff-only TRAIL9INE MEDIA dashboard at /admin, using Payload CMS embedded in a Next.js/TypeScript application. Match the public brand but make the UI practical and calm. Use Payload's native shell/collection conventions, supported theme customisation and custom overview components. No separate customer portal.

Desktop 1440px: compact roughly 240px sidebar, page header and flexible content workspace. Mobile 390px: collapsible navigation, stacked content and accessible controls.

Sidebar: Overview, Projects, Categories, Media, Inquiries, Services, Page content, Settings. Users is owner-only. Editors do not see inquiry navigation; inquiry managers do not see content publishing controls. Include an annotated role matrix, not just hidden menu items.

Create:
1. Staff sign-in with labelled email/password, show/hide password, recovery link, error and submitting states. No public “Create account”.
2. Overview with real-data placeholders/empty states for published projects, drafts, new inquiries and failed notification count. Recent inquiry rows and recently edited projects are visible only when permitted.
3. Session-expired state, permission denied and mobile navigation open/closed.

Brand: paper #F5F3EE, ink #171916, white panels, restrained #A83E24 primary action, consistent sans type. Use labelled status badges. Avoid decorative charts and fabricated growth statistics. If sample records are used to explore density, mark them as design examples outside the production-looking content.

Functional motion only: short menu/status transitions, reduced-motion alternatives. Provide desktop/mobile counterparts and name each screen.
~~~

## Prompt 14 — Portfolio management and reusable editor

~~~text
Design Trail9ine's Payload-based portfolio workspace, desktop and mobile, using the approved dashboard shell.

Routes: /admin/collections/projects, /admin/collections/projects/create and /admin/collections/projects/[id].

List screen: Add project action, search, category/status filters, cover thumbnail, title, categories, publication state, featured marker and updated time. Include empty list, filtered-empty, loading and error states.

Editor: use feasible native field tabs/collapsible groups rather than an unconstrained custom page builder.
Basics: title, editable generated slug, client name, editorial headline, industry, service relationships, multi-category selection.
Story: confirmed overview, optional approved approach, optional verified outcomes, client/media approval confirmation.
Media & gallery: cover/poster, add/reorder/replace/remove curated gallery blocks; wide image, image pair, portrait strip, video, captioned image and short text interlude. Add a validated external project/client link.
SEO: title, description and share image.
Publishing: Save draft, Preview, Publish, Unpublish, Archive; featured flag/order; clear validation and unsaved-change states.

Video block source switch: Uploaded video / YouTube or Vimeo link. Show title, poster and optional caption/transcript references. Do not show arbitrary HTML/iframe code fields. Media upload opens the shared library/picker.

Create a complete new-project flow: add title → assign categories → upload/select cover → add two gallery modules → save draft → preview → publish. Include publish validation failure, upload failure and confirmation of publication. Draft text says it is staff-only until published.

Show the public-facing preview as the existing reusable project template, not a new page design. The published project appears in Work/category filters and can be featured on Home; CMS publication triggers this in implementation. Support future projects without code changes.

Check mobile editing of long titles, multi-select values and block reordering. Provide accessible non-drag move-up/down controls alongside drag handles.
~~~

## Prompt 15 — Categories and media library

~~~text
Design Trail9ine dashboard Categories and Media screens using the approved Payload admin shell at desktop/mobile sizes.

Categories: /admin/collections/categories.
Fields: name, slug, display order, active state. Initial records: Video production, Social media, Photography, Creative campaigns. All projects is a public filter option, not an editable category. Support add/edit/reorder and project association counts derived from data.
Show an in-use deletion warning with affected projects and reassignment guidance. New categories become available for project assignment and public filters once active/published content uses them. Do not hardcode five permanent filter chips.

Media: /admin/collections/media.
Grid/list, search, image/video filter, upload action and shared select-media picker. Show thumbnail/poster, type, size and usage. Detail supports alt text, caption, focal point, credits/rights and replacement.

Upload states: queued, uploading/progress, processing, ready, failed/retry. Images and videos have type/size validation. Proposed limits: 15MB image, 100MB hosted video, configurable after hosting tests. Large video progress represents direct authenticated object-storage upload.
Video sources: uploaded MP4/WebM or approved YouTube/Vimeo URL; source title and poster required for publication. External client/project links are a separate field.

Include existing-file selection, in-use deletion blocked, broken/invalid URL, unsupported file, too-large file and missing poster. Draft assets are staff-only; do not imply a public media directory. No fake upload completion if an operation fails.
~~~

## Prompt 16 — Inquiry inbox, detail and email status

~~~text
Design Trail9ine's inquiry workspace at /admin/collections/inquiries and /admin/collections/inquiries/[id], desktop 1440px and mobile 390px.

This is a lightweight lead inbox. Every accepted public contact submission is durably saved here before its email notification is sent. Do not design a full CRM, newsletter sender or email composer.

Inbox: search name/business/email; status, service and date filters; columns/rows for received time, name/business, service, lead status and email notification status. Distinguish New / In progress / Closed / Spam from Pending / Provider accepted / Delivered / Failed / Bounced. Use readable labelled badges, not colour alone.

Detail: received time/reference, all submitted contact fields, project message, selected service, privacy acknowledgement metadata where needed, change lead status, private staff notes and email attempt history. Retry notification is permission-gated. Keep personal details restricted to authorised staff.

Critical alternate state:
“The inquiry is saved, but its email notification needs attention.”
Show Failed notification, last safe error category, attempts, next retry or retry action. Never imply the lead is missing or ask the visitor to resubmit. Provider accepted is not the same as Delivered.

Show empty inbox, no matches, loading, save-note error, retry queued and unavailable/permission denied states. Opening an inquiry does not automatically change its workflow status. No invented live inquiry totals; design examples must be labelled in handoff.

Public success wording for linked flow: “Thanks for telling us about your project. Your inquiry has been received.” This appears only after durable database receipt. Public failure preserves entered values if persistence fails.

On mobile use readable summary cards and a focused detail view, not a whole-page wide table. Keep status and note actions accessible.
~~~

## Prompt 17 — Settings, editable content and staff access

~~~text
Complete the Trail9ine dashboard using the established Payload conventions and technical companion.

Settings at /admin/globals/site-settings: verified email/phone/socials, optional booking URL, location, default SEO/share image and brand assets. Missing booking URL means public CTA is Start a project. Do not expose email/storage/database API keys in these editable business fields.

Page content: Home and About editable copy/media groups. Services use their collection and shared public detail template. Preserve type/grid integrity through constrained fields; avoid unlimited free-form layout editing.

Owner-only staff area /admin/collections/users: staff list, account details and role selection. Roles:
Owner — settings/accounts/content/inquiries.
Editor — projects/categories/media/service/page content; no inquiries or account management.
Inquiry manager — inbox/notes/status/notification retry; no content publishing or user management.

Design owner/editor/inquiry-manager navigation variations, protected-action messages, save validation and unsaved changes. Authentication uses Payload's supported recovery flow. No public staff registration and no secrets in UI.

Keep any account invitations/recovery as system auth flows; do not add a general messaging or marketing feature. Provide mobile layouts for settings and role forms. Record which screens are native panels themed vs custom views.
~~~

## Prompt 18 — Complete system handoff audit

~~~text
Audit the complete Trail9ine public and admin design.

Public: 14 primary routes from the architecture, privacy support layout and 404. Seven reusable public templates, all desktop/mobile variants. Four seeded projects must not become a hardcoded maximum.

Admin: sign-in/overview, project list/create/edit, category management, media upload/library, inquiry inbox/detail, service/page content, settings, owner accounts and permission/session states. Follow /admin and Payload collection/global conventions.

Verify the two complete journeys:
A. Staff creates category/project → uploads image/video or adds approved link → composes reusable gallery → saves draft → previews privately → publishes → public category filter/detail/Home reflect the saved content.
B. Visitor submits inquiry → database receipt → dashboard inbox record → asynchronous email notification → delivery or failure/retry shown separately from lead status.

Cross-check copy, type, spacing, empty/error states, role visibility, long text and touch/keyboard interactions. No fake KPIs, public draft content, exposed staff notes, arbitrary embed HTML, provider secrets, prices or fabricated client facts.

Use implementation baseline Next.js/React/Node/TypeScript/Tailwind, Payload/PostgreSQL/object storage, Motion/optional Lottie and Resend/outbox. UI design must not claim those integrations are already working.

Deliver a screen inventory, components/native-vs-custom map, CTA destinations, responsive rules, data/state annotations and unresolved real-asset/configuration list. Explicitly distinguish design completion from built/tested software.
~~~
