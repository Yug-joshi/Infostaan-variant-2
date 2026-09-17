# INFOSTAAN — MASTER AGENT INSTRUCTIONS

Version: 1.0
Status: STRICT
Scope: Entire Infostaan project

============================================================
0. MANDATORY RULE — READ BEFORE EVERY TASK
============================================================

THIS FILE IS AUTHORITATIVE.

Before executing ANY task, the agent MUST:

1. Read this file.
2. Understand the requested task.
3. Identify whether the task is:
   - FUNCTIONALITY ONLY
   - UI/UX ONLY
   - FUNCTIONALITY + UI/UX
   - BUG FIX
   - ARCHITECTURAL / CODE QUALITY
4. Follow the scope rules in this document.
5. Inspect the existing implementation before modifying it.
6. Change ONLY what is necessary for the requested task.
7. Verify that unrelated functionality and UI remain unchanged.

DO NOT skip this file even for small changes.

============================================================
1. ABSOLUTE SCOPE CONTROL
============================================================

This is the most important rule.

------------------------------------------------------------
FUNCTIONALITY TASK
------------------------------------------------------------

If the user asks to:

- add a function
- remove a function
- modify functionality
- fix functionality
- improve behavior
- change logic
- change data handling
- change recommendation logic
- change Save / Compare / Search behavior
- change routing behavior
- change state management

THEN:

CHANGE FUNCTIONALITY ONLY.

STRICTLY DO NOT change:

- layout
- spacing
- typography
- colors
- card design
- component appearance
- animations
- responsive design
- icons
- visual hierarchy
- copy/text

unless the requested functionality literally requires a UI change.

Example:

User:
"Compare button is not working."

Allowed:
- Fix compare state
- Fix localStorage
- Fix event handling
- Fix compare logic

NOT allowed:
- Redesign Compare button
- Change its color
- Change its size
- Move it
- Redesign the card


------------------------------------------------------------
UI/UX TASK
------------------------------------------------------------

If the user asks to:

- redesign UI
- change colors
- improve spacing
- change layout
- improve responsiveness
- change typography
- modify visual hierarchy
- change animations
- redesign cards
- change desktop/mobile presentation

THEN:

CHANGE UI/UX ONLY.

STRICTLY DO NOT change:

- business logic
- data structures
- recommendation calculations
- Save functionality
- Compare functionality
- Search functionality
- routing logic
- localStorage behavior
- persona logic
- existing feature behavior

unless absolutely required to visually implement the requested UI.


------------------------------------------------------------
FUNCTIONALITY + UI TASK
------------------------------------------------------------

Only modify BOTH functionality and UI when the user explicitly requests both.

Do not assume that a UI request includes functionality.

Do not assume that a functionality request includes redesign.

============================================================
2. DO NOT "IMPROVE" UNREQUESTED THINGS
============================================================

NEVER use a task as an excuse to:

- redesign nearby components
- refactor unrelated code
- rename unrelated variables
- change unrelated copy
- change colors
- change spacing
- introduce a new library
- replace working architecture
- change working behavior
- "clean up" unrelated components

If something unrelated is noticed:

DO NOT change it automatically.

Mention it separately if necessary.

============================================================
3. PRESERVE WORKING FUNCTIONALITY
============================================================

Existing working functionality is considered protected.

Before changing code:

- understand what currently works
- identify dependencies
- avoid breaking existing flows
- reuse existing utilities
- reuse existing state
- reuse existing hooks
- reuse existing components where appropriate

Never create a second implementation of an existing system.

Examples:

There must be ONE:

Save system
Compare system
Search system
Personalization system
Demo persona system
Recently Viewed system
Recommendation system
Storage system

Do not create page-specific versions.

============================================================
4. ARCHITECTURE RULE — SHARED LOGIC
============================================================

UI may differ between desktop and mobile.

Business logic MUST remain shared.

Example:

CollegeCard
├── Desktop presentation
└── Mobile presentation

Both must use the same:

saveCollege()
compareCollege()
trackView()
getCollege()
recommendation logic

Do not duplicate business logic for different screen sizes.

============================================================
5. DESKTOP + MOBILE ARCHITECTURE
============================================================

Infostaan uses:

ONE CODEBASE
ONE ROUTING SYSTEM
ONE DATA MODEL
ONE STATE SYSTEM
ONE PERSONALIZATION SYSTEM

Desktop and mobile may have different presentation/layout.

Use responsive CSS whenever possible.

Create separate presentation components only when information hierarchy genuinely differs.

DO NOT create:

MobileApp.tsx
DesktopApp.tsx

as two independent applications.

============================================================
6. ROUTING RULES
============================================================

Use URL-based routing.

Navigation must not depend on a giant custom:

currentScreen

state system.

Use React Router.

Public URLs should be human-readable.

Prefer:

/college/mithibai-college
/course/bachelor-of-commerce
/career/financial-analyst
/internship/marketing-intern

Avoid exposing internal IDs:

/college/college_3
/course/course_6

Internal IDs may exist internally.

They must not be unnecessarily exposed to users.

============================================================
7. INTERNAL IDs
============================================================

Internal IDs are NEVER user-facing.

Examples:

college_1
course_3
career_7
internship_4
class_2

These may exist in:

- mock data
- localStorage
- state
- relationships
- internal logic

They must NEVER appear visibly in:

- cards
- headings
- descriptions
- breadcrumbs
- recommendations
- related content
- comparison
- saved pages
- search results
- detail pages

Always resolve:

ID → entity → human-readable name

If an ID is invalid:

DO NOT display the raw ID.

Use a safe fallback or omit the invalid item.

============================================================
8. DATA ARCHITECTURE
============================================================

Do not duplicate datasets.

Use centralized data sources:

src/data/

Examples:

colleges.ts
courses.ts
careers.ts
internships.ts
classes.ts

Relationships should reference IDs internally.

Presentation should resolve those relationships into entity objects.

Never hardcode the same entity in multiple places.

============================================================
9. STATE MANAGEMENT
============================================================

Use the existing state/storage architecture.

Do not create temporary page-local state when the state needs to persist across pages.

Persistent prototype state includes:

- saved items
- compared items
- recently viewed
- demo persona
- user preferences
- personalization context
- search history

localStorage may be used for the current prototype.

============================================================
10. PERSONALIZATION
============================================================

Infostaan personalization should be useful but not intrusive.

Priority:

1. Current intent
2. Explicit preferences
3. Recent behavior
4. Saved items
5. Older behavior

Do not hardcode recommendations based solely on page.

Recommendations should use the existing recommendation engine.

Do not create fake personalization only for visual appearance.

============================================================
11. DEMO PERSONAS
============================================================

Demo personas are a testing system.

Required personas:

- New User
- Commerce + Finance
- Science + Technology
- Internship Seeker

Changing persona must modify shared user context.

Do not create separate persona logic for individual pages.

The persona should influence existing:

- recommendations
- Help Me Decide
- dashboard
- relevant results
- match explanations

============================================================
12. MUMBAI-ONLY DATA RULE
============================================================

Infostaan prototype data is STRICTLY Mumbai-focused.

Do not introduce demo data from:

- Pune
- Delhi
- Thane
- Navi Mumbai
- Bengaluru
- Hyderabad
- other cities/states

Relevant locations must be Mumbai, Maharashtra.

Examples:

Andheri
Bandra
Borivali
Kandivali
Malad
Goregaon
Powai
Dadar
Matunga
Sion
Ghatkopar
Vikhroli
Chembur
Kurla
Mulund
Bhandup
Lower Parel
Worli
Colaba
Fort
Churchgate
Santacruz
Vile Parle
Jogeshwari

============================================================
13. UI DESIGN PHILOSOPHY
============================================================

Infostaan is NOT:

- a stock-market dashboard
- an analytics dashboard
- an admin panel
- a data warehouse
- a generic education template
- a card collection

Infostaan should feel:

- calm
- spacious
- intelligent
- modern
- student-first
- premium
- trustworthy
- easy to scan

Core principle:

SHOW WHAT THE STUDENT NEEDS,
NOT EVERYTHING INFOSTAAN KNOWS.

============================================================
14. WHITESPACE RULE
============================================================

Whitespace is intentional.

Do not fill empty areas just because space exists.

Prefer:

- breathing room
- clear hierarchy
- fewer elements
- shorter copy
- larger spacing

Avoid:

- crowded screens
- excessive cards
- dense dashboards
- card-inside-card layouts

============================================================
15. INFORMATION DENSITY RULE
============================================================

Show only decision-relevant information.

Do not display every available field.

Avoid excessive:

- statistics
- percentages
- badges
- chips
- ratings
- metadata
- tiny labels
- buttons

If information does not help the user's current decision:

REMOVE IT.

============================================================
16. COPY RULE
============================================================

DO NOT EXPLAIN OBVIOUS UI.

If a button already communicates the action, do not add a paragraph explaining it.

Prefer:

[ Compare Colleges ]

instead of:

"Use this feature to compare colleges and understand their differences..."

Use short contextual labels.

Examples:

"Recently viewed"

"Recommended for you"

"Saved"

"Help Me Decide"

Avoid generic marketing copy such as:

"Start your journey today"
"Unlock your potential"
"Discover endless possibilities"

unless explicitly requested.

The UI should explain itself.

============================================================
17. COLOR SYSTEM
============================================================

Primary dark background:

#070D18

Surface:

#0D1828

Deep brand navy:

#091540

Primary blue:

#007DCC

Bright blue:

#19A7E8

Lavender border:

#D3B5E8

Success / positive state:

#19B89A

Primary text:

#F4F7FB

Secondary text:

#A9B8CA

Muted text:

#71839A

STRICTLY AVOID AS DESIGN ACCENTS:

- orange
- yellow
- warm pink
- red
- gold
- beige
- cream
- neon colors
- warm gray

Semantic error states may use appropriate accessibility-safe error treatment when genuinely necessary.

============================================================
18. COLOR USAGE
============================================================

#091540:

Use sparingly.

Good for:

- selected states
- brand accents
- important emphasis
- occasional CTA surfaces

DO NOT use it as the background of huge sections everywhere.

#007DCC:

Primary interaction color.

Use for:

- primary CTA
- active links
- selected controls
- search actions
- focus states

#19A7E8:

Use primarily for:

- hover
- highlights
- subtle emphasis

#D3B5E8:

Use primarily for:

- selected borders
- focus indicators
- comparison highlights

Do not turn every border lavender.

============================================================
19. DESKTOP VISUAL ELEMENTS
============================================================

Desktop homepage may use floating educational/career-related decorative visuals.

Examples:

- graduation cap
- laptop
- books
- notebook
- pencil/pen
- CA reference object
- calculator
- document
- compass
- briefcase
- academic/career symbols

These are DECORATION.

They must:

- remain behind the main content
- not obstruct search
- not obstruct buttons
- use pointer-events:none
- remain subtle
- use cool brand colors
- avoid excessive glow
- avoid heavy 3D
- avoid aggressive animation

Desktop only:

>= 1024px

============================================================
20. MOBILE VISUAL ELEMENTS
============================================================

Mobile may use a very small number of lightweight decorative objects.

Maximum approximately 2–4 visible decorative objects.

Prefer:

- small notebook
- pencil
- graduation cap
- document
- small book
- subtle abstract shapes

Avoid heavy 3D/WebGL.

Decorations must never compete with:

- search
- navigation
- primary actions
- content

============================================================
21. ANIMATION RULES
============================================================

Animation is secondary to usability.

Use:

- subtle transitions
- hover effects
- small state changes
- restrained page transitions
- lightweight decorative movement

Avoid:

- scroll-jacking
- aggressive parallax
- continuous large movement
- particles
- heavy 3D
- excessive GSAP
- large Lottie animations
- animation everywhere

Always respect:

prefers-reduced-motion

============================================================
22. SEARCH UX
============================================================

Search is the primary Infostaan interaction.

Search must:

- remain visually prominent
- support contextual placeholders
- provide useful suggestions
- avoid overlap
- work on mobile
- work on desktop

Examples:

Homepage:

"Search colleges, courses, careers..."

Internships:

"Search internships..."

Classes:

"Search classes..."

Search dropdown must always appear above surrounding UI.

Decorative elements must never cover it.

============================================================
23. CUTOFF UX
============================================================

Cutoffs should remain lightweight on the homepage.

Homepage:

[ Cutoffs ]

Clicking it opens the cutoff experience.

Do NOT add a large homepage cutoff section.

Cutoff modal/drawer should allow:

- college search
- course filter
- year filter
- category filter
- cutoff range
- Mumbai college results

Do not turn it into an analytics dashboard.

============================================================
24. RESPONSIVE DESIGN
============================================================

Desktop and mobile may have different information hierarchy.

Desktop:

- wider layouts
- side-by-side content
- comparison tables
- visible filters where useful

Mobile:

- single-column
- touch-friendly
- compact cards
- bottom sheets/drawers
- simplified metadata
- fewer simultaneous actions

Do NOT simply shrink desktop UI.

============================================================
25. ACCESSIBILITY
============================================================

Maintain:

- keyboard navigation
- visible focus states
- sufficient contrast
- semantic HTML
- accessible buttons
- accessible labels
- touch-friendly targets
- alt text for meaningful images

Never rely on color alone to communicate important states.

============================================================
26. PERFORMANCE
============================================================

Performance is a first-class requirement.

Avoid:

- unnecessary dependencies
- duplicate rendering
- duplicate data fetching
- duplicate recommendation calculations
- large assets
- heavy animations
- unnecessary client-side JavaScript

Optimize images.

Prefer lightweight SVG/CSS decoration over heavy 3D assets.

============================================================
27. COMPONENT ARCHITECTURE
============================================================

Do not create giant monolithic components.

Separate:

- layout
- data
- business logic
- state
- presentation

Use reusable components where appropriate.

Do not create abstractions merely for the sake of abstraction.

Prefer simple, understandable code.

============================================================
28. NO PARALLEL IMPLEMENTATIONS
============================================================

Before creating a new utility, hook, component or state system:

SEARCH THE EXISTING CODEBASE.

If an existing implementation performs the required job:

REUSE IT.

Do not create:

saveCollegeV2()
compareCollegeNew()
newRecommendationEngine()
newStorage.ts

when equivalent systems already exist.

============================================================
29. ERROR HANDLING
============================================================

Never expose:

- raw IDs
- stack traces
- internal errors
- technical implementation details

Use clean user-facing states:

Loading
Empty
Error
Success

Broken images must have a graceful fallback.

============================================================
30. LOADING STATES
============================================================

Loading should reflect actual application state.

Do not artificially delay loading simply to show animation.

Use:

- skeletons
- subtle progress indicators
- lightweight branded loading states

Search can use contextual language such as:

"Finding colleges..."

"Finding internships..."

but do not fake technical processing statistics.

============================================================
31. BEFORE EDITING CODE
============================================================

The agent MUST first:

1. Locate the relevant files.
2. Understand existing implementation.
3. Trace dependencies.
4. Identify shared logic.
5. Determine exact scope.
6. Make the smallest safe change.

Do not immediately rewrite the component.

============================================================
32. AFTER EDITING
============================================================

Always verify:

- requested task works
- existing functionality still works
- no unrelated UI changed
- no unrelated functionality changed
- no raw IDs exposed
- no console errors introduced
- no TypeScript errors
- responsive behavior remains intact

Run:

npm run build

when appropriate.

============================================================
33. TASK-SCOPE CHECK BEFORE COMPLETION
============================================================

Before declaring completion, ask:

"What did the user actually request?"

Then verify:

[ ] I changed everything requested.
[ ] I did not change unrelated functionality.
[ ] I did not change unrelated UI.
[ ] I did not introduce duplicate logic.
[ ] I reused existing architecture where appropriate.
[ ] I did not expose internal IDs.
[ ] I did not violate the Mumbai-only rule.
[ ] I did not introduce forbidden colors.
[ ] I did not add unnecessary copy.
[ ] I did not add unnecessary features.

============================================================
34. DO NOT CLAIM SUCCESS WITHOUT TESTING
============================================================

"npm run build passes" does NOT automatically mean the feature works.

For functional tasks:

Actually test the relevant user flow.

For UI tasks:

Actually inspect the relevant viewport(s).

For responsive tasks:

Test both desktop and mobile.

============================================================
35. CHANGE MINIMIZATION RULE
============================================================

When a task can be solved by changing 5 lines:

DO NOT change 500 lines.

When one component can be fixed:

DO NOT rewrite the entire application.

Prefer:

SMALLEST SAFE CHANGE

over:

LARGEST POSSIBLE REFACTOR

============================================================
36. ARCHITECTURAL CHANGE RULE
============================================================

Do not introduce:

- new frameworks
- new state libraries
- new backend
- new database
- microservices
- unnecessary APIs
- unnecessary dependencies

unless explicitly requested or genuinely required.

============================================================
37. FINAL PRINCIPLE
============================================================

Infostaan should always prioritize:

USER INTENT
↓
SEARCH / DISCOVERY
↓
RELEVANT INFORMATION
↓
DECISION
↓
NEXT ACTION

Never:

DATA
↓
MORE DATA
↓
MORE CARDS
↓
MORE METRICS

The product should feel intelligent because it removes unnecessary complexity,
not because it displays more complexity.

============================================================
END OF MASTER INSTRUCTIONS
============================================================
