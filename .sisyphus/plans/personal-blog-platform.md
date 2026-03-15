# Premium Personal Blog Platform on Cloudflare

## TL;DR
> **Summary**: Build a static-first Astro + MDX personal blog with a premium editorial UI, strong usability, a protected admin surface, and a Git-backed AI auto-publish pipeline that deploys through Cloudflare Pages.
> **Deliverables**:
> - High-end public blog with search, tags, archives, about, RSS, sitemap, and responsive premium UI
> - Managed comments, newsletter subscription, public analytics, and owner-only admin operations console
> - AI-assisted writing plus automated publish workflow with preview, policy gates, and rollback
> - Full test stack: unit, integration, end-to-end, deploy smoke, and performance/accessibility checks
> **Effort**: XL
> **Parallel**: YES - 8 waves
> **Critical Path**: 1 -> 3 -> 5 -> 6 -> 10 -> 11 -> 9 -> 12 -> Final Verification

## Context
### Original Request
Create a plan for a personal blog with a more premium interface, better usability, explicit site-building logic, and future workflow/AI support for writing and publishing. The user already has a domain on Cloudflare and allows adapting an open-source project.

### Interview Summary
- Workspace is greenfield; no existing project, tests, or deployment setup exist.
- Chosen stack: `Astro + MDX + Cloudflare Pages`.
- User wants a premium visual direction and stronger usability, not a generic starter blog.
- User selected `full auto-publish` for AI/workflow support.
- User selected a broad v1 scope: comments, subscription, analytics, and admin are all in scope.
- User wants a complete v1 testing system, not just smoke checks.

### Metis Review (gaps addressed)
- Locked the package manager to `pnpm` so the executor gets concrete commands.
- Reduced architecture risk by keeping published content Git-backed and static-first instead of putting posts behind runtime SSR.
- Chose managed services for high-risk product areas to prevent v1 from becoming multiple bespoke backend systems.
- Added explicit auto-publish guardrails: schema validation, preview deployment, policy checks, smoke tests, audit trail, emergency pause, and rollback.
- Narrowed `admin` to an owner-only operations console rather than a full WYSIWYG CMS.

## Work Objectives
### Core Objective
Ship a premium personal blog platform that feels editorial and polished on the public side, remains easy for a single owner to operate, and safely supports AI-assisted drafting plus automated publishing without requiring manual code edits for each new post.

### Deliverables
- Astro site rooted at the repo root with TypeScript strict mode and MDX content collections.
- Static public routes for home, post detail, tag listing, archive, about, projects, RSS, sitemap, and search.
- Premium design system with non-generic typography, color tokens, layout system, motion rules, and responsive behavior.
- Article reading experience with TOC, reading progress, code block treatment, related posts, share actions, and comment embed.
- Newsletter subscription flow using Buttondown, public analytics using Cloudflare Web Analytics, and Giscus-based comments.
- Owner-only admin surface on protected `/admin` routes backed by GitHub workflow dispatch.
- AI content pipeline that creates MDX drafts in Git, validates them, opens previewable PRs, auto-publishes scheduled content, and rolls back failed releases.
- Full quality stack with unit, integration, E2E, Lighthouse, and post-deploy smoke coverage.

### Definition of Done (verifiable conditions with commands)
- `git status` runs inside an initialized repository with the expected project files tracked.
- `pnpm install` completes without lockfile drift.
- `pnpm lint` exits `0`.
- `pnpm typecheck` exits `0`.
- `pnpm test:unit` exits `0`.
- `pnpm test:integration` exits `0`.
- `pnpm test:e2e` exits `0` against local preview or deployed preview environment.
- `pnpm build` exits `0` and produces the Astro build output for Cloudflare.
- `pnpm verify:content` exits `0` for valid fixtures and exits non-zero for invalid fixtures.
- `pnpm verify:lighthouse` records reports meeting thresholds documented in this plan.

### Must Have
- `pnpm` package management and a single-repo layout.
- Static-first Astro architecture; public post pages must be prerendered.
- Git as the source of truth for published MDX content.
- AI auto-publish implemented as a gated workflow, never as direct write-to-production.
- Open-source starter/theme evaluation before custom UI implementation begins.
- Search implemented with a static-friendly approach (`Pagefind`).
- Managed comments (`Giscus`), managed newsletter (`Buttondown`), and public analytics (`Cloudflare Web Analytics`).
- Admin limited to owner operations: draft queue visibility, workflow dispatch, scheduled publish controls, audit visibility, emergency pause, and rollback actions.
- Accessibility baseline of WCAG 2.2 AA intent, keyboard navigation coverage, and mobile-first responsiveness.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No full runtime-rendered public article pages.
- No bespoke comments backend, bespoke email delivery system, or bespoke analytics warehouse in v1.
- No paid membership, paywall, or billing features.
- No WYSIWYG CMS or multi-user editorial suite.
- No direct AI commits to `main` without validation, preview, and publish gates.
- No generic template look with default fonts/colors/motions left uncustomized.
- No human-only acceptance criteria.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: `TDD` with `Vitest` for unit/integration and `Playwright` for browser flows.
- QA policy: Every task includes happy-path and failure-path QA scenarios.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`.
- Performance policy: Chrome DevTools Lighthouse on `/` and a fixture post route must hit Accessibility `>=95`, SEO `>=90`, Best Practices `>=90`.
- Publish safety policy: every auto-publish event must produce preview evidence, workflow logs, and a post-deploy smoke result before being considered complete.

## Integration Prerequisites Matrix
- GitHub repository: initialize local Git in Task 1 and create the remote GitHub repo before Task 10; required resources are default branch `main`, Actions enabled, PRs enabled, a writable automation token or GitHub App secret (`GITHUB_AUTOMATION_TOKEN`), and workflow dispatch permission for admin actions.
- Cloudflare Pages: create one Pages project before Task 11; required resources are the production domain, preview deployments, protected `/admin` routing behavior, Pages environment variables, and an Access application/policy protecting admin traffic.
- Giscus: enable GitHub Discussions on the chosen discussion repo before Task 7; required values are repo name, repo ID, category, and category ID.
- Buttondown: provision one publication and API key before Task 8; required secret is `BUTTONDOWN_API_KEY`, and QA uses a dedicated test audience or provider sandbox mode.
- Cloudflare Web Analytics: provision one analytics token before Task 8; required value is the public beacon token for production/preview verification.
- AI provider: provision one model key before Task 10; required secret is `AI_WRITER_API_KEY` plus any model/version config used by the workflow.
- Mock-vs-live rule: Tasks 7-10 must support mock mode for local/CI verification and live mode for preview verification; Task 11 is live-environment only; final verification requires the live credentials above to be configured.
- Secret ownership: store service secrets in GitHub Actions secrets and Cloudflare Pages environment variables; never hardcode provider identifiers or tokens in tracked files.

## Site-Building Logic
- Content lives in `src/content/blog/*.mdx`; published content enters the site only through Git commits merged to the default branch.
- Astro content collections validate frontmatter and slug rules during build and content verification.
- Public pages are generated statically from MDX collections, tag indexes, archive collections, and project/about data.
- Search index is generated at build time using `Pagefind`, so search remains fast without a live search server.
- Dynamic capabilities stay off the public rendering path: comments are embedded via Giscus, subscriptions submit to Buttondown, analytics use Cloudflare Web Analytics, and admin actions go through protected workflow endpoints.
- AI/workflow publishing creates or updates MDX draft files plus metadata, opens a PR, deploys a preview through Cloudflare Pages, runs automated gates, then auto-merges or schedules publication. If the production smoke test fails, the workflow reverts to the last good commit and records the failure in the admin audit feed.

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. Extract shared dependencies first, then parallelize feature slices.

Wave 1: foundation bootstrap (`repo bootstrap`)

Wave 2: reusable project baseline (`OSS starter selection`, `test harness`)

Wave 3: structural contracts (`content model`, `premium design system`)

Wave 4: public route implementation (`public routes + discovery`)

Wave 5: engagement plus workflow core (`article UX + comments`, `newsletter + analytics`, `AI workflow + auto-publish`)

Wave 6: live deployment plumbing (`Cloudflare deploy + rollback`)

Wave 7: owner operations integration (`admin console`)

Wave 8: final polish (`performance + accessibility polish`)

### Dependency Matrix (full, all tasks)
- 1 blocks 3, 4, 5, 6, 7, 8, 9, 10, 11, 12.
- 2 blocks 5 and informs 6; it does not block 3 or 4.
- 3 blocks all tasks that need scripts, CI commands, or test fixtures.
- 4 blocks 6, 8, 9, and 10 because content schema and route contracts must exist first.
- 5 blocks 6, 7, 8, and 12 because the shared visual system drives the UI finish.
- 6 blocks 7, 9, 10, and 12 because public route structure and metadata are reused there.
- 7 blocks 12 because reading-surface quality depends on article experience completion.
- 8 blocks 9 because admin metrics display subscription status and provider health.
- 10 blocks 11 because live preview/deploy verification depends on the workflow existing.
- 11 blocks 9 and 12 because admin controls and final polish depend on live deploy/access behavior.
- 9 blocks 12 because the admin route is included in the accessibility and polish sweep.
- 12 feeds the final verification wave after all functional slices are complete.

### Agent Dispatch Summary (wave -> task count -> categories)
- Wave 1 -> 1 task -> `unspecified-high`
- Wave 2 -> 2 tasks -> `writing`, `unspecified-high`
- Wave 3 -> 2 tasks -> `unspecified-high`, `visual-engineering`
- Wave 4 -> 1 task -> `visual-engineering`
- Wave 5 -> 3 tasks -> `visual-engineering`, `unspecified-high`, `deep`
- Wave 6 -> 1 task -> `unspecified-high`
- Wave 7 -> 1 task -> `unspecified-high`
- Wave 8 -> 1 task -> `visual-engineering`

## TODOs
> Implementation + test = one task. Every task includes agent profile, references, acceptance criteria, and QA scenarios.

- [x] 1. Bootstrap the Astro + Cloudflare workspace

  **What to do**: Initialize a root Astro project using `pnpm`, initialize Git, enable TypeScript strict mode, add the Cloudflare adapter, define root scripts (`lint`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `verify:content`, `verify:lighthouse`, `build`), create environment example files, and establish the repo directory structure for `src/`, `tests/`, `public/`, `.github/workflows/`, and `scripts/`.
  **Must NOT do**: Do not introduce feature-specific UI, dynamic product integrations, or multiple package managers.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: foundation decisions affect every downstream task.
  - Skills: `[]` - Reason: generic workspace bootstrap is sufficient.
  - Omitted: [`env-bootstrap`] - Reason: environment setup is small enough to define directly in the task.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Blocked By: none

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - confirmed stack, scope, and automation expectations.
  - External: `https://docs.astro.build/en/install-and-setup/` - Astro project setup baseline.
  - External: `https://docs.astro.build/en/guides/integrations-guide/cloudflare/` - Cloudflare adapter and deployment guidance.
  - External: `https://pnpm.io/cli/install` - package manager conventions.

  **Acceptance Criteria**:
  - [ ] `pnpm install` exits `0`.
  - [ ] `pnpm astro check` exits `0`.
  - [ ] `pnpm build` exits `0` with Cloudflare adapter enabled.
  - [ ] `package.json` contains all required scripts named in this plan.
  - [ ] `.github/workflows/`, `tests/fixtures/`, and `scripts/` exist.
  - [ ] `git status` succeeds and `.gitignore` exists.

  **QA Scenarios**:
  ```text
  Scenario: Foundation bootstrap succeeds
    Tool: Bash
    Steps: Run `pnpm install && pnpm astro check && pnpm build`
    Expected: All commands exit 0; Astro build output is generated without missing adapter errors.
    Evidence: .sisyphus/evidence/task-1-bootstrap.txt

  Scenario: Wrong package manager is rejected
    Tool: Bash
    Steps: Run `npm install`
    Expected: Command fails or prints an explicit project policy warning that pnpm is required.
    Evidence: .sisyphus/evidence/task-1-bootstrap-error.txt
  ```

  **Commit**: YES | Message: `chore(repo): bootstrap astro cloudflare workspace` | Files: `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `.github/workflows/*`, `scripts/*`

- [x] 2. Import and normalize the open-source baseline

  **What to do**: Use `satnaing/astro-paper` as the single upstream baseline, import only the parts needed for an MDX blog foundation, remove upstream branding/content/theme assumptions, document license compliance, and record every retained vs replaced subsystem so later UI work does not accidentally preserve the stock look.
  **Must NOT do**: Do not combine pieces from multiple starters, and do not leave default visual identity, sample posts, or upstream copy in place.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: this task is mostly architectural curation, audit, and normalization.
  - Skills: [] - Reason: no specialized skill is required.
  - Omitted: [`frontend-ui-ux`] - Reason: visual redesign happens in later tasks, not during baseline import.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5, 6 | Blocked By: 1

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - user allowed open-source adaptation and single-upstream decision.
  - External: `https://github.com/satnaing/astro-paper` - selected upstream baseline.
  - External: `https://github.com/satnaing/astro-paper/blob/main/LICENSE` - license obligations.

  **Acceptance Criteria**:
  - [ ] The repo contains a single documented upstream source: `astro-paper`.
  - [ ] Upstream sample content, branding, and boilerplate copy are removed.
  - [ ] A project note documents which baseline modules were retained, rewritten, or discarded.
  - [ ] `pnpm build` still exits `0` after normalization.

  **QA Scenarios**:
  ```text
  Scenario: Baseline import is clean
    Tool: Bash
    Steps: Run `pnpm build` and inspect generated HTML for upstream title or sample content strings via project search.
    Expected: Build succeeds and no upstream branding/sample post text remains.
    Evidence: .sisyphus/evidence/task-2-oss-baseline.txt

  Scenario: Multiple-upstream drift is blocked
    Tool: Bash
    Steps: Search the repo metadata and docs for more than one declared upstream starter source.
    Expected: Only `satnaing/astro-paper` is documented as baseline; no second starter appears.
    Evidence: .sisyphus/evidence/task-2-oss-baseline-error.txt
  ```

  **Commit**: YES | Message: `chore(theme): normalize astro-paper baseline` | Files: `src/*`, `public/*`, project notes describing upstream retention/removal

- [x] 3. Establish the complete quality harness and fixture set

  **What to do**: Add `Vitest`, `Playwright`, fixture-driven content validation, CI-ready test commands, and Lighthouse automation; create fixed fixtures for valid and invalid posts, preview routes, and integration mocks so every later task can follow TDD with stable inputs.
  **Must NOT do**: Do not postpone tests until the end, and do not create placeholder scripts that only echo success.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this sets the testing contract for all future slices.
  - Skills: [`test-automation`] - Reason: strong fit for unit/e2e harness design.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 4, 5, 6, 7, 8, 9, 10, 11, 12 | Blocked By: 1

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - verification strategy and test-system requirement.
  - External: `https://docs.astro.build/en/guides/testing/` - Astro testing patterns.
  - External: `https://playwright.dev/docs/intro` - browser automation and artifact capture.
  - External: `https://vitest.dev/guide/` - unit and integration test conventions.

  **Acceptance Criteria**:
  - [ ] `pnpm test:unit` exits `0`.
  - [ ] `pnpm test:e2e` exits `0` against the local preview server.
  - [ ] `pnpm verify:content` passes valid fixtures and fails invalid fixtures.
  - [ ] Lighthouse automation script outputs report files for `/` and one fixture post route.
  - [ ] CI config runs unit, content, and E2E checks in a deterministic order.

  **QA Scenarios**:
  ```text
  Scenario: Valid fixture content passes the full harness
    Tool: Bash
    Steps: Run `pnpm test:unit && pnpm test:integration && pnpm test:e2e && pnpm verify:content`
    Expected: All commands exit 0 using fixture post `hello-premium-world.mdx`.
    Evidence: .sisyphus/evidence/task-3-quality-harness.txt

  Scenario: Invalid content is rejected
    Tool: Bash
    Steps: Run `pnpm verify:content -- --fixture tests/fixtures/content/missing-title.mdx`
    Expected: Command exits non-zero and reports the missing `title` field explicitly.
    Evidence: .sisyphus/evidence/task-3-quality-harness-error.txt
  ```

  **Commit**: YES | Message: `test(repo): add astro quality harness and fixtures` | Files: `vitest.config.*`, `playwright.config.*`, `tests/**/*`, `scripts/verify-*`, `.github/workflows/*`

- [x] 4. Define the content model, route map, and build contracts

  **What to do**: Create Astro content collections for blog posts and project entries, formalize frontmatter schema, slug rules, tag/archive generation, SEO metadata contracts, RSS/sitemap integration, and the route inventory that the rest of the site must honor.
  **Must NOT do**: Do not allow untyped frontmatter, ad-hoc route names, or hidden content rules living only inside components.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: content architecture drives both build logic and automation safety.
  - Skills: [] - Reason: native Astro patterns are enough.
  - Omitted: [`frontend-ui-ux`] - Reason: this is schema and contract work, not visual design.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 6, 8, 9, 10 | Blocked By: 1, 3

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - confirms Astro + MDX and explicit site-building logic requirement.
  - External: `https://docs.astro.build/en/guides/content-collections/` - typed content collections and schema validation.
  - External: `https://docs.astro.build/en/guides/rss/` - RSS generation patterns.
  - External: `https://docs.astro.build/en/guides/integrations-guide/sitemap/` - sitemap generation.

  **Acceptance Criteria**:
  - [ ] `src/content/config.*` validates required fields for posts and projects.
  - [ ] Duplicate slugs, missing `title`, missing `description`, and invalid `publishAt` values fail `pnpm verify:content`.
  - [ ] The route inventory includes `/`, `/blog/[slug]`, `/tags/[tag]`, `/archive`, `/projects`, `/about`, `/rss.xml`, and `/search`.
  - [ ] `pnpm build` produces RSS and sitemap artifacts.

  **QA Scenarios**:
  ```text
  Scenario: Content contracts generate the public route set
    Tool: Bash
    Steps: Run `pnpm build` with fixtures for two tags, one project, and one published post.
    Expected: Build exits 0 and emits routes for home, post, tag pages, archive, projects, about, RSS, and sitemap.
    Evidence: .sisyphus/evidence/task-4-content-contracts.txt

  Scenario: Duplicate slug is blocked
    Tool: Bash
    Steps: Run `pnpm verify:content -- --fixture tests/fixtures/content/duplicate-slug/`
    Expected: Command exits non-zero and prints the conflicting slug value.
    Evidence: .sisyphus/evidence/task-4-content-contracts-error.txt
  ```

  **Commit**: YES | Message: `feat(content): define mdx schema and route contracts` | Files: `src/content/**/*`, `src/pages/**/*`, `scripts/verify-content.*`

- [x] 5. Build the premium design system and shared layout shell

  **What to do**: Replace the stock starter aesthetic with a distinctive editorial design system: custom type pairing, color tokens, spacing scale, card rules, motion language, dark/light handling only if it reinforces the brand, and shared layouts for header, footer, nav, and section framing.
  **Must NOT do**: Do not keep the upstream font stack, default color palette, or generic hero/card patterns.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this task is primarily visual identity and interaction design.
  - Skills: [`frontend-ui-ux`] - Reason: required to avoid a bland starter-like result.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 6, 7, 8, 12 | Blocked By: 1, 2, 3

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - premium interface and stronger usability are core objectives.
  - External: `https://docs.astro.build/en/basics/layouts/` - layout composition patterns.
  - External: `https://docs.astro.build/en/guides/styling/` - Astro styling approaches.

  **Acceptance Criteria**:
  - [ ] Global design tokens are centralized and reused across public pages.
  - [ ] Header, footer, nav, and section layouts work at `375px`, `768px`, and `1440px` widths.
  - [ ] Visual snapshots show the site no longer resembles the untouched upstream theme.
  - [ ] Keyboard focus states are visible and consistent across nav and primary actions.

  **QA Scenarios**:
  ```text
  Scenario: Premium shell is responsive and keyboard-usable
    Tool: Playwright
    Steps: Open `/` at 375px, 768px, and 1440px; tab through navigation; capture screenshots.
    Expected: Navigation stays usable, focus states are visible, and no layout overlap occurs.
    Evidence: .sisyphus/evidence/task-5-design-system.png

  Scenario: Upstream visual identity still leaks through
    Tool: Playwright
    Steps: Compare homepage screenshot and DOM classes against the imported baseline token names/colors.
    Expected: No default upstream accent palette, sample hero copy, or unchanged font stack remains.
    Evidence: .sisyphus/evidence/task-5-design-system-error.png
  ```

  **Commit**: YES | Message: `feat(ui): create editorial design system and shell` | Files: `src/layouts/*`, `src/components/*`, `src/styles/*`, `public/*`

- [x] 6. Implement the public routes and discovery experience

  **What to do**: Build the homepage, post index behavior, archive, tag pages, projects page, about page, static search with `Pagefind`, SEO metadata plumbing, and content cards that highlight both writing and projects without overwhelming the reading flow.
  **Must NOT do**: Do not add client-heavy search services, infinite scrolling, or route duplication that weakens SEO.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is UX-heavy public surface work.
  - Skills: [`frontend-ui-ux`] - Reason: discovery pages must balance aesthetics and clarity.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 7, 8, 9, 10, 12 | Blocked By: 1, 3, 4, 5

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - route inventory and site-building logic sections.
  - External: `https://pagefind.app/docs/` - static search generation and runtime usage.
  - External: `https://docs.astro.build/en/guides/on-demand-rendering/` - keep search/admin boundaries clear.

  **Acceptance Criteria**:
  - [ ] Home, archive, tags, projects, about, and search routes render from fixture content.
  - [ ] `Pagefind` index generation runs as part of build and search returns the fixture post by title and tag.
  - [ ] Canonical metadata, OG metadata, and structured title/description fields render on key routes.
  - [ ] Empty-state UI exists for no-search-results and no-projects conditions.

  **QA Scenarios**:
  ```text
  Scenario: Discovery routes work from fixture content
    Tool: Playwright
    Steps: Visit `/`, `/archive`, `/tags/ai`, `/projects`, `/about`, and `/search`; search for `premium world`.
    Expected: All routes load with 200 status and search returns `Hello Premium World`.
    Evidence: .sisyphus/evidence/task-6-public-routes.txt

  Scenario: Search empty state behaves correctly
    Tool: Playwright
    Steps: Visit `/search` and query `zzzz-no-match`.
    Expected: No crash; a clear empty-state message appears and no stale result cards remain.
    Evidence: .sisyphus/evidence/task-6-public-routes-error.txt
  ```

  **Commit**: YES | Message: `feat(site): add discovery routes and static search` | Files: `src/pages/**/*`, `src/components/**/*`, `pagefind config`, metadata helpers

- [x] 7. Build the article reading experience and comments integration

  **What to do**: Implement the post detail template with rich MDX component rendering, TOC, reading progress, code block styling, image treatment, related posts, share actions, and `Giscus` comments mounted below the article without degrading the static reading experience.
  **Must NOT do**: Do not make comments a blocking dependency for article rendering, and do not ship a generic markdown page without editorial treatment.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: article UX is visual, interactive, and content-heavy.
  - Skills: [`frontend-ui-ux`] - Reason: polished reading surfaces are central to the product.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 12 | Blocked By: 1, 3, 4, 5, 6

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - premium UI and usability requirements.
  - External: `https://docs.astro.build/en/guides/markdown-content/` - Astro Markdown/MDX rendering behavior.
  - External: `https://giscus.app/` - managed comments integration.

  **Acceptance Criteria**:
  - [ ] The fixture post route renders title, metadata, TOC, progress indicator, code blocks, and related-post links.
  - [ ] Giscus loads in the comment section only after the article content is present.
  - [ ] If the comment embed is blocked or fails to load, the article still renders fully with a graceful fallback message.
  - [ ] Internal heading links in the TOC navigate correctly.

  **QA Scenarios**:
  ```text
  Scenario: Article experience is complete
    Tool: Playwright
    Steps: Open `/blog/hello-premium-world/`, scroll through the page, click a TOC heading, and confirm the comments area loads.
    Expected: TOC navigation works, progress UI updates, and Giscus frame or placeholder becomes visible after content render.
    Evidence: .sisyphus/evidence/task-7-article-experience.txt

  Scenario: Comments fail without breaking the article
    Tool: Playwright
    Steps: Block the Giscus script request and reload `/blog/hello-premium-world/`.
    Expected: Article content remains readable and a fallback message appears in the comments section.
    Evidence: .sisyphus/evidence/task-7-article-experience-error.txt
  ```

  **Commit**: YES | Message: `feat(blog): add premium article experience and comments` | Files: `src/pages/blog/**/*`, `src/components/article/*`, comment embed integration files

- [x] 8. Add newsletter subscription and public analytics

  **What to do**: Integrate `Buttondown` for newsletter signup, add resilient subscription UI states, wire Cloudflare Web Analytics for public traffic measurement, and expose light summary stats for admin consumption without creating a custom analytics backend.
  **Must NOT do**: Do not implement a bespoke mailing system, and do not add heavy third-party tracking that hurts privacy or performance.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: combines external integrations, forms, and observability contracts.
  - Skills: [] - Reason: integrations are simple enough to define without a specialist skill.
  - Omitted: [`deploy-release`] - Reason: this is integration work, not production rollout.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 9 | Blocked By: 1, 3, 5, 6

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - subscription and analytics are explicit v1 scope.
  - External: `https://buttondown.com/api-emails` - newsletter API and automation constraints.
  - External: `https://developers.cloudflare.com/web-analytics/` - Cloudflare Web Analytics setup.

  **Acceptance Criteria**:
  - [ ] Valid email submission shows success state and invalid email submission shows a field-level error.
  - [ ] Duplicate subscription attempts are handled idempotently with a clear user-facing response.
  - [ ] Cloudflare Web Analytics script loads on public pages and is omitted from owner-only admin routes.
  - [ ] The subscription component degrades gracefully if the provider is unavailable.

  **QA Scenarios**:
  ```text
  Scenario: Newsletter signup succeeds
    Tool: Playwright
    Steps: Visit `/`, submit `owner-test@example.com` in the newsletter form, and observe the success state.
    Expected: The form reports success without page breakage and logs the provider response in test mode.
    Evidence: .sisyphus/evidence/task-8-newsletter-analytics.txt

  Scenario: Provider outage is handled gracefully
    Tool: Playwright
    Steps: Mock the Buttondown API to return 503, then submit the newsletter form.
    Expected: A non-destructive retry/error message appears and the page remains interactive.
    Evidence: .sisyphus/evidence/task-8-newsletter-analytics-error.txt
  ```

  **Commit**: YES | Message: `feat(growth): add newsletter and public analytics` | Files: subscription component/API proxy files, analytics include, test mocks

- [x] 9. Build the owner-only admin operations console

  **What to do**: Implement a protected admin surface on `/admin` routes with Cloudflare Access or an equivalent owner-only gate, showing workflow status, draft queue, scheduled publish queue, audit feed, emergency pause toggle, and rollback controls that call GitHub workflow dispatch endpoints rather than editing content directly.
  **Must NOT do**: Do not turn admin into a full CMS editor, and do not bypass Git-based publish flow.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this task spans auth boundary, operational UI, and workflow orchestration.
  - Skills: [] - Reason: generic app architecture is enough.
  - Omitted: [`frontend-ui-ux`] - Reason: visual polish follows the shared system and is secondary to operational safety.

  **Parallelization**: Can Parallel: YES | Wave 7 | Blocks: 12 | Blocked By: 1, 3, 4, 5, 6, 8, 10, 11

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - admin is in scope, but only as an operations console.
  - External: `https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/` - Cloudflare Access protection patterns.
  - External: `https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch` - workflow dispatch control plane.

  **Acceptance Criteria**:
  - [ ] Unauthenticated access to the admin surface is denied by Cloudflare Access or an equivalent owner-only gate.
  - [ ] The admin dashboard lists at least draft status, latest workflow run, latest deploy status, and emergency pause state.
  - [ ] Triggering publish, rollback, and pause actions issues auditable requests to the workflow layer.
  - [ ] Admin routes are excluded from public analytics tracking and SEO indexing.

  **QA Scenarios**:
  ```text
  Scenario: Owner can operate the publishing controls
    Tool: Playwright
    Steps: Authenticate through the configured owner path, open `/admin`, trigger a test workflow dispatch, and verify the audit feed updates.
    Expected: Admin loads only for the owner, the workflow action fires, and the audit row appears.
    Evidence: .sisyphus/evidence/task-9-admin-console.txt

  Scenario: Public access is blocked
    Tool: Playwright
    Steps: Open `/admin` in a fresh unauthenticated browser context.
    Expected: Access is denied or redirected to the configured Cloudflare Access gate; no admin data renders.
    Evidence: .sisyphus/evidence/task-9-admin-console-error.txt
  ```

  **Commit**: YES | Message: `feat(admin): add owner operations console` | Files: `src/pages/admin*`, workflow proxy files, access docs/config, audit UI components

- [x] 10. Implement the AI drafting and auto-publish pipeline

  **What to do**: Create GitHub Actions workflows and supporting scripts that generate MDX drafts from structured prompts, validate frontmatter/content policy, prepare preview-ready PRs, compute `publishAt` eligibility, and record audit events. Keep Git history as the source of truth, and leave live preview deployment plus production rollback enforcement to the Cloudflare deployment task.
  **Must NOT do**: Do not allow the AI workflow to push directly to production without PR, preview, or validation gates; do not generate content from unbounded external web scraping.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: workflow safety, gating logic, and rollback orchestration are the riskiest slice.
  - Skills: [] - Reason: repo-native automation is sufficient.
  - Omitted: [`deploy-release`] - Reason: release mechanics are handled in task 11 after the workflow exists.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 11, 9, 12 | Blocked By: 1, 3, 4, 6

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - full auto-publish decision and guardrails.
  - External: `https://docs.github.com/en/actions` - workflow orchestration patterns.
  - External: `https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule` - scheduled publication triggers.
  - External: `https://developers.cloudflare.com/pages/configuration/preview-deployments/` - preview deployment behavior.

  **Acceptance Criteria**:
  - [ ] A workflow can generate a draft from a structured prompt fixture and open or update a PR instead of committing to the default branch.
  - [ ] `pnpm verify:content` plus policy checks reject missing metadata, duplicate slugs, placeholder text, and broken links/images.
  - [ ] Scheduled publication logic correctly marks only eligible content as preview-ready based on `publishAt`.
  - [ ] Workflow runs emit audit records and status outputs that can be consumed later by the admin console and Cloudflare deploy task.

  **QA Scenarios**:
  ```text
  Scenario: Valid AI draft reaches preview-ready state safely
    Tool: Bash
    Steps: Trigger the workflow with fixture prompt `tests/fixtures/prompts/hello-premium-world.json` and a mocked green status context.
    Expected: A PR is created or updated, the draft is marked preview-ready, and an audit record exists.
    Evidence: .sisyphus/evidence/task-10-auto-publish.txt

  Scenario: Invalid AI draft is quarantined
    Tool: Bash
    Steps: Trigger the workflow with fixture prompt `tests/fixtures/prompts/malformed-post.json` that yields missing metadata or forbidden placeholders.
    Expected: The workflow fails before merge, labels the draft as blocked/quarantined, and does not publish.
    Evidence: .sisyphus/evidence/task-10-auto-publish-error.txt
  ```

  **Commit**: YES | Message: `feat(workflow): add ai draft and auto-publish pipeline` | Files: `.github/workflows/*`, `scripts/publish/*`, admin workflow integration files, policy fixtures

- [x] 11. Wire Cloudflare deployment, preview verification, and rollback controls

  **What to do**: Connect the repo to Cloudflare Pages, configure preview and production environments, attach the main domain plus protected `/admin` route strategy, define environment variable handling, add post-deploy smoke tests, and implement deterministic rollback to the last passing production commit.
  **Must NOT do**: Do not deploy from untracked local state, and do not rely on manual dashboard-only steps without documenting them in repo automation/docs.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: deployment and rollback cross repo, Cloudflare, and workflow boundaries.
  - Skills: [] - Reason: no special deployment skill is required for planning this slice.
  - Omitted: [`rollback-hotfix`] - Reason: this is planned release hardening, not incident response execution.

  **Parallelization**: Can Parallel: YES | Wave 6 | Blocks: 9, 12 | Blocked By: 1, 3, 6, 10

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - Cloudflare domain baseline and deploy target.
  - External: `https://developers.cloudflare.com/pages/` - Pages deployment primitives.
  - External: `https://developers.cloudflare.com/pages/configuration/custom-domains/` - custom domain and subdomain binding.
  - External: `https://developers.cloudflare.com/pages/functions/` - dynamic route constraints on Pages.

  **Acceptance Criteria**:
  - [ ] Preview deployments are created for PRs and production deploys are tied to the default branch only.
  - [ ] The custom domain and protected `/admin` route strategy are documented and testable.
  - [ ] Post-deploy smoke checks verify `/`, `/blog/hello-premium-world/`, `/search`, and `/admin` access control.
  - [ ] Rollback command or workflow restores the last known-good production deployment reference.

  **QA Scenarios**:
  ```text
  Scenario: Preview and production deployment paths are healthy
    Tool: Bash
    Steps: Trigger a preview deploy from a test PR, then trigger a production deploy from the default branch and run smoke checks.
    Expected: Both deploys succeed, preview URL is distinct from production, and smoke checks pass.
    Evidence: .sisyphus/evidence/task-11-cloudflare-deploy.txt

  Scenario: Rollback path works after a failed smoke check
    Tool: Bash
    Steps: Simulate a broken production deploy smoke result, then invoke the rollback workflow.
    Expected: Production returns to the previous good revision and the failed revision is recorded in the audit trail.
    Evidence: .sisyphus/evidence/task-11-cloudflare-deploy-error.txt
  ```

  **Commit**: YES | Message: `ci(cloudflare): add preview deploy and rollback controls` | Files: Cloudflare config/docs, `.github/workflows/*`, smoke test scripts, environment examples

- [x] 12. Finish performance, accessibility, and editorial polish

  **What to do**: Tune final spacing, typography, image loading, motion timing, and component states; remove unused client-side code; meet the Lighthouse thresholds; and close any remaining accessibility issues discovered by Playwright and DevTools audits.
  **Must NOT do**: Do not chase visual flourish at the expense of readability, mobile performance, or keyboard accessibility.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is a polish pass over the final user experience.
  - Skills: [`frontend-ui-ux`] - Reason: needed to land the premium finish without regressing usability.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 8 | Blocks: none | Blocked By: 1, 3, 5, 6, 7, 9, 10, 11

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md` - stronger usability and premium feel are first-class requirements.
  - External: `https://developer.chrome.com/docs/lighthouse/overview/` - Lighthouse audit interpretation.
  - External: `https://playwright.dev/docs/accessibility-testing` - automated accessibility checks with Playwright.

  **Acceptance Criteria**:
  - [ ] Lighthouse Accessibility score is `>=95` on `/` and `/blog/hello-premium-world/`.
  - [ ] Lighthouse SEO score is `>=90` on `/` and `/blog/hello-premium-world/`.
  - [ ] Lighthouse Best Practices score is `>=90` on `/` and `/blog/hello-premium-world/`.
  - [ ] No critical Playwright accessibility violations remain on home, post, search, and admin routes.

  **QA Scenarios**:
  ```text
  Scenario: Final polish meets performance and accessibility gates
    Tool: Bash
    Steps: Run `pnpm verify:lighthouse` and the final Playwright accessibility suite against preview or local production build.
    Expected: All documented thresholds are met and reports are saved.
    Evidence: .sisyphus/evidence/task-12-polish.txt

  Scenario: Regression reintroduces an accessibility issue
    Tool: Playwright
    Steps: Run the accessibility suite against a build where focus styles or alt text are intentionally broken.
    Expected: The suite fails with a route-specific violation report.
    Evidence: .sisyphus/evidence/task-12-polish-error.txt
  ```

  **Commit**: YES | Message: `fix(ui): finalize accessibility and performance polish` | Files: UI components, styles, audit scripts, test snapshots/reports

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
  Tool: `task(subagent_type="oracle")`
  Steps: Compare the implemented repo against tasks 1-12, the route inventory, the integration prerequisites, and every `Must Have` / `Must NOT Have` rule.
  Expected: Oracle approves only if every required deliverable exists, no forbidden architecture slipped in, and no unresolved decision remains.
  Evidence: `.sisyphus/evidence/f1-plan-compliance.md`

- [ ] F2. Code Quality Review - unspecified-high
  Tool: `Bash`
  Steps: Run `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm build` and review changed files for dead code, placeholder content, and untracked secrets.
  Expected: All commands exit `0`, no placeholder/sample content remains, and no credential leakage is present.
  Evidence: `.sisyphus/evidence/f2-code-quality.txt`

- [ ] F3. Real UI QA Sweep - unspecified-high (+ playwright if UI)
  Tool: `Playwright`
  Steps: Visit `/`, `/blog/hello-premium-world/`, `/archive`, `/search`, `/projects`, and `/admin` in preview or production; capture screenshots, keyboard-nav flows, and comment/subscription/admin states.
  Expected: Public UI matches the premium design intent, mobile and desktop layouts hold, key routes work, and admin access control behaves correctly.
  Evidence: `.sisyphus/evidence/f3-ui-qa.zip`

- [ ] F4. Scope Fidelity Check - deep
  Tool: `task(category="deep")`
  Steps: Audit implemented features versus the scope section, verifying that paid membership, bespoke comment/email backends, public SSR article rendering, and full CMS behavior were not introduced.
  Expected: Deep approves only if implemented scope matches this plan exactly and optional extras are either absent or clearly isolated.
  Evidence: `.sisyphus/evidence/f4-scope-fidelity.md`

## Commit Strategy
- Use one green commit per task.
- Keep commit messages conventional and scope-specific.
- Never combine baseline scaffolding with feature automation in the same commit.
- Land automation only after the core blog is already buildable and testable.

## Success Criteria
- The site feels visually distinct from a stock starter while staying fast, readable, and mobile-friendly.
- New posts can be authored as MDX, validated automatically, previewed, and published through workflow controls without hand-editing production files.
- Public features (search, comments, subscription, analytics) work without creating bespoke backend systems that the owner must maintain.
- The admin surface gives the owner enough operational control to pause, inspect, publish, schedule, and roll back safely.
- The executor can finish implementation without making architectural decisions not already specified here.
