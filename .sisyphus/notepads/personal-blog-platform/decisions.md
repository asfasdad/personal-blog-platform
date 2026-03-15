# Decisions

## Task 1: Bootstrap
- Adopt Astro + Cloudflare adapter with TS strict mode
- PNPM as package manager, with defined scripts
- Local git initialized for task isolation (no pushes yet)
- Post-task: if PNPM install blocks, fall back to npm-based workflow and re-run PNPM when environment allows.
- Fixed: wired Astro commands for pnpm on Windows by adding an astro script alias and updating build to use astro build.
- Fixed: removed unnecessary React deps and the bootstrap placeholder file to keep Task 1 scoped to minimal Astro + Cloudflare foundations.

## Task 2: Upstream Baseline Import
- Selected satnaing/astro-paper as single upstream baseline per plan requirements
- Decision: Import structure only (layouts, components, utils), not content or branding
- Decision: Remove all upstream identity - replaced "AstroPaper" with "Personal Blog", removed author attribution, sample posts
- Decision: Simplify configuration - removed experimental fonts, OG image generation, complex Shiki transformers for baseline
- Decision: Keep Tailwind CSS v4 with @tailwindcss/vite plugin (upstream uses this)
- Decision: Add Pagefind dependency for future search implementation (placeholder for now)
- Decision: Keep `output: 'server'` with Cloudflare adapter despite warnings - required for compatibility with current adapter version
- Decision: Accept build warnings about Node.js imports - these are from Astro's internal modules and don't block build
- Decision: Document all imported/discarded modules in upstream-baseline.md for future reference
- Decision: Single sample post (hello-world.md) as fixture for testing, not upstream samples
- Decision: Keep dynamic post/tag pagination routes in SSR mode (no `prerender` flags) because Cloudflare adapter prerenderer produced a 500 error in this environment; build remains green without prerender flags.

## Task 3: Quality Harness and Fixtures
- Decision: Treat Task 3 as complete only when both positive and negative content verification paths are demonstrated (`verify:content` success plus invalid fixture failure).
- Decision: Keep e2e on local Astro dev with `start-server-and-test` and dedicated port `4417` for deterministic startup in Windows.
- Decision: Keep Lighthouse verification as real report generation into `.sisyphus/evidence/` so later tasks can compare score regressions.

## Task 4: Content Contracts and Route Inventory
- Decision: Switch canonical article paths from `/posts/*` to `/blog/*` and keep legacy `/posts/*` routes temporarily for compatibility during migration.
- Decision: Add `projects` collection in `src/content.config.ts` and publish a fixture project entry to force route-contract coverage on `/projects`.
- Decision: Add `/archive` route as the primary archive contract while retaining `/archives` implementation temporarily to avoid regressions in downstream tasks.
- Decision: Prerender only `rss.xml` now (`export const prerender = true`) to guarantee RSS artifact output under server mode without forcing prerender across all dynamic routes yet.

## Task 5: Premium Design System and Shared Shell
- Decision: Use editorial serif-forward typography stacks with separate UI/display/body roles to avoid generic starter typography.
- Decision: Move shell emphasis to reusable `surface`/`surface-strong`/`shadow-soft` tokens in `global.css` and consume those in header/footer/index sections.
- Decision: Keep dark mode enabled but align both themes to the same warm editorial brand palette family instead of separate visual identities.
- Decision: Add deterministic Playwright shell checks at `375x812`, `768x1024`, and `1440x900`, plus keyboard-tab focus checks, as direct Task 5 acceptance evidence.

## Task 6: Public Routes and Discovery
- Decision: Keep dev-mode search resilient by loading Pagefind UI at runtime and showing an explicit fallback message when Pagefind assets are absent.
- Decision: Keep default `build` command on stable Cloudflare server build; generate/consume Pagefind assets in preview/static contexts, while dev gracefully falls back when assets are absent.
- Decision: Keep `/posts/*` and `/archives/*` routes as compatibility aliases while canonical navigation points to `/blog/*` and `/archive/*`.

## Task 7: Article UX and Comments
- Decision: Generate TOC entries client-side from rendered article headings so MD/MDX structure remains source-of-truth and TOC stays aligned after content edits.
- Decision: Keep comments non-blocking by loading Giscus script only after article content exists, with explicit status states (`idle`, `loading`, `loaded`, `error`).
- Decision: Add a shared-tag related-post section and keep previous/next navigation; this gives both semantic relation and chronological neighbor navigation.
- Decision: Enable dynamic-route prerender only during e2e dev runs via `E2E_PRERENDER=1` to keep test coverage while avoiding Cloudflare build prerender failures.

## Task 8: Newsletter and Public Analytics
- Decision: Keep newsletter submission through a server-side proxy endpoint (`/api/newsletter`) so provider keys never leak to the browser.
- Decision: Normalize duplicate subscription responses as idempotent success from the user perspective to avoid confusing failure states.
- Decision: Inject Cloudflare Web Analytics only on non-admin routes at layout level to preserve admin privacy boundaries.
- Decision: Keep dev/proxy outages non-blocking in UI by surfacing retry guidance instead of hard failures.

## Task 9: Owner Admin Operations Console
- Decision: Enforce owner-only access in middleware for both `/admin` UI and `/api/admin` control plane endpoints.
- Decision: Keep admin action execution API GitHub-dispatch compatible, with explicit mock fallback when CI secrets are not present.
- Decision: Mark admin pages as `noindex` and exclude analytics injection for admin routes to satisfy privacy and indexing constraints.
- Decision: Keep admin auth simple for v1 (`ADMIN_ACCESS_KEY` cookie/header), with Cloudflare Access integration reserved for deployment wiring task.

## Task 10: AI Drafting and Auto-Publish Pipeline
- Decision: Keep prompt-to-draft generation deterministic and fixture-driven (`scripts/publish/run-pipeline.mjs`) so CI can verify behavior without live LLM calls.
- Decision: Enforce policy gates before draft acceptance (required fields, valid publishAt, tags type, placeholder-text rejection) and quarantine invalid prompts with non-zero exit.
- Decision: Emit a single machine-readable audit artifact (`.sisyphus/evidence/task-10-pipeline-last.json`) per run for admin/workflow visibility.
- Decision: Keep PR behavior mockable (`mock-pr-upsert`) unless GitHub credentials are present; never write directly to default branch as a publish side-effect.

## Task 11: Cloudflare Deploy + Rollback Controls
- Decision: Add a dedicated Cloudflare deployment workflow (`cloudflare-deploy.yml`) with target resolution for PR preview vs `main` production.
- Decision: Add deterministic rollback workflow (`rollback.yml`) that can redeploy an explicit SHA or auto-select the latest successful deploy run on `main`.
- Decision: Keep smoke checks as a standalone script (`scripts/smoke/check-routes.mjs`) so both CI workflows and local validation use identical route/access checks.
- Decision: Document custom-domain binding and Cloudflare Access path-protection strategy in repo (`docs/cloudflare-deployment.md`) instead of dashboard-only tribal steps.
