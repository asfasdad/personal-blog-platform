# Production Fixes for Search, RSS, Assets, and Localization

## TL;DR
> **Summary**: Repair the live production defects that currently block a clean acceptance outcome: broken search assets, failing RSS feed, missing favicon, and mixed-language shell text after Chinese switch.
> **Deliverables**:
> - Deterministic smoke and E2E coverage that fails on the currently reported defects
> - Single-source canonical domain configuration aligned to `https://blog.158247.xyz`
> - Working production Pagefind assets, healthy `rss.xml`, and shipped favicon asset
> - Completed zh shell/newsletter localization on key public routes
> **Effort**: Short
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> Final Verification

## Context
### Original Request
Generate a repair work plan for the issues found during acceptance review instead of starting the full review execution now.

### Interview Summary
- User chose the fix-plan path for the currently discovered production defects.
- Scope is limited to search, RSS, favicon/static assets, and mixed-language UI consistency.
- This is repair planning only; implementation will happen in execution mode later.

### Metis Review (gaps addressed)
- Lock the canonical domain to one source of truth and explicitly update every consumer.
- Treat Pagefind as a build/deploy artifact problem first, not a search-system rewrite.
- Use TDD ordering so current production failures become hard regressions in smoke/E2E before code fixes begin.
- Keep localization scope constrained to shared shell and newsletter/public onboarding surfaces, not a full i18n architecture rewrite.

## Work Objectives
### Core Objective
Produce a decision-complete repair plan that resolves the currently known production defects with the smallest safe change set and closes the verification gaps that allowed them through.

### Deliverables
- Updated smoke coverage for `/rss.xml`, `/favicon.svg`, `/pagefind/pagefind-ui.js`, and `/pagefind/pagefind-ui.css`.
- Tightened E2E coverage so production search must return indexed results and zh shell text must be consistent on audited routes.
- Canonical site configuration aligned to `https://blog.158247.xyz` in both Astro config and app config.
- Explicit Pagefind generation/deployment path that guarantees `dist/client/pagefind/*` exists before deploy.
- Minimal favicon asset shipped from `public/` and referenced consistently.
- zh localization completion for homepage shell, newsletter, onboarding, and shared social labels where currently hardcoded.

### Definition of Done (verifiable conditions with commands)
- `pnpm verify:smoke --base-url "https://blog.158247.xyz"`-equivalent coverage passes for required routes and assets after implementation.
- `curl -I https://blog.158247.xyz/rss.xml` returns `200` and XML content type.
- `curl -I https://blog.158247.xyz/favicon.svg` returns `200`.
- `curl -I https://blog.158247.xyz/pagefind/pagefind-ui.js` returns `200`.
- `curl -I https://blog.158247.xyz/pagefind/pagefind-ui.css` returns `200`.
- `pnpm test:e2e` passes with strict search and zh-shell assertions.
- `pnpm build` produces a deployable output that contains `dist/client/pagefind/` and the favicon asset.

### Must Have
- Use `https://blog.158247.xyz` as the canonical public site URL everywhere this plan touches.
- Preserve the current Pagefind-based search system; repair generation and deployment instead of replacing it.
- Add failing tests/checks before implementation for all reported defects.
- Keep favicon scope minimal: ship one working `public/favicon.svg` and keep the existing head reference.
- Limit localization fixes to shared shell/newsletter/onboarding/public labels exposed by current browsing flows.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No search-system replacement.
- No broad SEO redesign beyond direct domain alignment and broken-output repair.
- No full multilingual routing architecture.
- No icon pack expansion beyond the single required favicon asset.
- No weakening of tests to accommodate current broken production behavior.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: `TDD` using smoke checks first, then strict Playwright assertions, then build artifact verification.
- QA policy: Every task includes happy-path and failure-path scenarios.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`.
- Production policy: search asset `404`, RSS `500`, and missing favicon are release blockers.
- Localization policy: mixed-language shell text on audited zh routes is at least a hold-level defect until fixed.

## Execution Strategy
### Parallel Execution Waves
Wave 1: test hardening and config alignment (`smoke/e2e strengthening`, `canonical domain ownership`)

Wave 2: functional repairs (`RSS fix`, `Pagefind generation/deploy fix`, `favicon asset`)

Wave 3: polish and regression closure (`zh shell/newsletter localization`, `final verification`)

### Dependency Matrix (full, all tasks)
- 1 blocks 3, 4, 5, 6 because new checks must fail before fixes start.
- 2 informs 3 and 4 because RSS/canonical output depends on domain ownership.
- 3 and 4 can run in parallel after 1 and 2.
- 5 depends on 1 but can run parallel with 3 and 4.
- 6 depends on 1 and can start after the localization target list is locked; it does not block 3 or 5.
- Final verification depends on 1 through 6.

### Agent Dispatch Summary (wave -> task count -> categories)
- Wave 1 -> 2 tasks -> `unspecified-high`
- Wave 2 -> 3 tasks -> `unspecified-high`
- Wave 3 -> 1 task -> `visual-engineering`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Harden smoke and E2E coverage to fail on the current production defects

  **What to do**: Update the smoke script to check `/rss.xml`, `/favicon.svg`, `/pagefind/pagefind-ui.js`, and `/pagefind/pagefind-ui.css` in addition to current routes. Tighten E2E so search must show results for a known indexed term and zh mode must assert translated shell/newsletter labels instead of tolerating fallback states.
  **Must NOT do**: Do not keep the current “fallback status text is acceptable” logic for production search coverage.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this defines the regression contract for all downstream fixes.
  - Skills: [`test-automation`] - Reason: existing smoke and Playwright coverage needs tightening, not replacement.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 3, 4, 5, 6 | Blocked By: none

  **References**:
  - Pattern: `scripts/smoke/check-routes.mjs:100` - current smoke flow only covers `/`, `/blog/hello-world/`, `/search/`, and `/admin`.
  - Pattern: `tests/e2e/home.spec.ts:14` - current search E2E explicitly accepts missing Pagefind UI.
  - Pattern: `src/pages/search.astro:10` - search route requires Pagefind CSS/JS assets.
  - Source: `.sisyphus/plans/personal-blog-platform.md:65` - search is a must-have feature.

  **Acceptance Criteria**:
  - [ ] Smoke checks fail if `/rss.xml` is non-200.
  - [ ] Smoke checks fail if `/favicon.svg` is non-200.
  - [ ] Smoke checks fail if either Pagefind asset returns non-200.
  - [ ] E2E search test requires at least one result for a deterministic indexed term such as `welcome`.
  - [ ] E2E zh-shell test requires translated labels for homepage shell and newsletter.

  **QA Scenarios**:
  ```text
  Scenario: Tightened checks fail against current broken production
    Tool: Bash + Playwright
    Steps: Run smoke checks against production plus the updated search and zh-shell E2E assertions before any fixes are applied.
    Expected: Smoke fails on RSS/Pagefind/favicon and E2E fails on strict search and untranslated zh shell.
    Evidence: .sisyphus/evidence/task-1-test-hardening.txt

  Scenario: Tests do not allow false-green fallback states
    Tool: Read
    Steps: Inspect updated smoke and E2E files for any acceptance of missing Pagefind UI or untranslated labels.
    Expected: No fallback-to-pass logic remains for these surfaces.
    Evidence: .sisyphus/evidence/task-1-test-hardening-error.txt
  ```

  **Commit**: YES | Message: `test(smoke): cover rss favicon and pagefind assets` | Files: `scripts/smoke/check-routes.mjs`, `tests/e2e/home.spec.ts`, new/updated zh-shell E2E spec files

- [x] 2. Align canonical domain configuration to `https://blog.158247.xyz`

  **What to do**: Replace placeholder domain values in Astro/site config with `https://blog.158247.xyz`, document `astro.config.mjs` as the build-time canonical source and `src/config.ts` as app-level consumer config, and ensure no remaining `example.com` references affect public output.
  **Must NOT do**: Do not introduce a second runtime-only source of truth for the public site URL.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this is a foundational config fix that influences RSS, sitemap, canonical tags, and public metadata.
  - Skills: [] - Reason: simple but high-impact config alignment.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 3, 4 | Blocked By: none

  **References**:
  - Pattern: `astro.config.mjs:25` - build-time `site` still uses `https://example.com`.
  - Pattern: `src/config.ts:2` - app config `website` still uses `https://example.com`.
  - Pattern: `src/layouts/Layout.astro:65` - canonical links are emitted from layout metadata.
  - Pattern: `src/pages/robots.txt.ts:7` - sitemap URL is derived from site config.

  **Acceptance Criteria**:
  - [ ] `astro.config.mjs` uses `https://blog.158247.xyz`.
  - [ ] `src/config.ts` uses `https://blog.158247.xyz`.
  - [ ] Grep finds no remaining `https://example.com` references in runtime/build config for public output.
  - [ ] Representative public pages and RSS/robots outputs use the correct domain.

  **QA Scenarios**:
  ```text
  Scenario: Canonical domain is unified
    Tool: Bash
    Steps: Search the repo for `example.com`, then build and inspect generated public outputs for canonical URLs, RSS URLs, and robots sitemap URL.
    Expected: Public-facing URLs use `https://blog.158247.xyz` consistently.
    Evidence: .sisyphus/evidence/task-2-canonical-domain.txt

  Scenario: Split-brain config is prevented
    Tool: Read
    Steps: Inspect config files and changed call sites for additional ad hoc domain constants.
    Expected: Only the intended config surfaces hold the canonical domain.
    Evidence: .sisyphus/evidence/task-2-canonical-domain-error.txt
  ```

  **Commit**: YES | Message: `fix(config): align canonical site domain sources` | Files: `astro.config.mjs`, `src/config.ts`, any direct public URL consumers

- [x] 3. Repair RSS generation and lock it to a deterministic production output

  **What to do**: Fix `src/pages/rss.xml.ts` so the feed returns `200` in production, emits valid XML, uses the canonical domain, and does not depend on brittle runtime assumptions. Prefer the smallest reliable solution: keep the current RSS route, ensure its dependencies are stable under the Cloudflare build/runtime path, and add `export const prerender = true` only if that is required to guarantee correctness without harming the current server build.
  **Must NOT do**: Do not rewrite the content model or feed format, and do not expand into a broader SEO overhaul.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this is a focused runtime/build defect with limited blast radius.
  - Skills: [] - Reason: Astro RSS support already exists; the task is stabilization.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: Final Verification | Blocked By: 1, 2

  **References**:
  - Pattern: `src/pages/rss.xml.ts:1` - current feed implementation.
  - Pattern: `src/utils/getPath.ts:11` - feed item link construction path.
  - Pattern: `.sisyphus/notepads/personal-blog-platform/decisions.md:33` - RSS prerender was previously considered to guarantee artifact output.
  - Source: `docs/cloudflare-deployment.md:47` - discovery artifact validation belongs in production checks.

  **Acceptance Criteria**:
  - [ ] `GET /rss.xml` returns `200` in production.
  - [ ] `content-type` includes XML.
  - [ ] Feed body contains the real production domain and valid item links.
  - [ ] CI/smoke coverage fails if RSS regresses again.

  **QA Scenarios**:
  ```text
  Scenario: RSS is healthy in build and production
    Tool: Bash
    Steps: Run local build checks, then request `/rss.xml` from production and save headers/body.
    Expected: XML feed returns 200, contains `<rss` or valid feed markup, and uses `https://blog.158247.xyz` links.
    Evidence: .sisyphus/evidence/task-3-rss-fix.txt

  Scenario: Broken feed input fails loudly
    Tool: Bash
    Steps: Run the relevant build/feed verification path with intentionally invalid assumptions still guarded by the tightened checks.
    Expected: CI or smoke fails visibly instead of silently shipping a broken feed.
    Evidence: .sisyphus/evidence/task-3-rss-fix-error.txt
  ```

  **Commit**: YES | Message: `fix(rss): resolve feed generation failure` | Files: `src/pages/rss.xml.ts`, any directly required helpers/config

- [x] 4. Generate and deploy Pagefind assets reliably for production search

  **What to do**: Keep the current Pagefind-based search route and add an explicit post-build generation step that creates `dist/client/pagefind/*` on every production build. Update the deploy path and verification so the generated assets are included in the deployed artifact and the search UI can load without fallback messaging.
  **Must NOT do**: Do not replace Pagefind with a different search system, and do not leave generation implicit or environment-dependent.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: this spans build scripts, deploy packaging, and regression checks.
  - Skills: [`test-automation`] - Reason: the repair is only safe if paired with stricter verification.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: Final Verification | Blocked By: 1, 2

  **References**:
  - Pattern: `package.json:18` - current build is only `astro build` with no Pagefind generation step.
  - Pattern: `src/pages/search.astro:10` - search route references `/pagefind/pagefind-ui.css` and `/pagefind/pagefind-ui.js`.
  - Pattern: `.github/workflows/cloudflare-deploy.yml:41` - deploy workflow currently runs only `pnpm build` before deploy.
  - Pattern: `.sisyphus/notepads/personal-blog-platform/decisions.md:42` - fallback behavior was meant for resilience, not production acceptance.

  **Acceptance Criteria**:
  - [ ] Build pipeline generates `dist/client/pagefind/` on every production build.
  - [ ] Production serves `pagefind-ui.js` and `pagefind-ui.css` with `200` status.
  - [ ] Search E2E returns at least one result for the known indexed term and no fallback copy is shown.
  - [ ] Deployment workflow or artifact verification explicitly checks for generated Pagefind assets.

  **QA Scenarios**:
  ```text
  Scenario: Pagefind assets are generated and deployed
    Tool: Bash
    Steps: Run production build, inspect `dist/client/pagefind/`, deploy preview/production artifact, then request both Pagefind asset URLs.
    Expected: Assets exist in build output and return 200 when deployed.
    Evidence: .sisyphus/evidence/task-4-pagefind-fix.txt

  Scenario: Search fallback cannot mask broken assets
    Tool: Playwright
    Steps: Open `/search/`, search for `welcome`, and observe UI state.
    Expected: A real result appears; the fallback “unavailable” status path does not appear in production verification.
    Evidence: .sisyphus/evidence/task-4-pagefind-fix-error.txt
  ```

  **Commit**: YES | Message: `fix(search): generate and deploy pagefind assets reliably` | Files: `package.json`, build/deploy workflow files, search-related verification scripts

- [x] 5. Add the missing favicon asset and verify head references stay correct

  **What to do**: Add a minimal `public/favicon.svg` that matches the current site identity well enough for v1 repair scope, keep the existing head reference in `Layout.astro`, and verify the asset is copied into the deployed static output.
  **Must NOT do**: Do not expand this task into a full icon suite or manifest redesign.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: small, bounded asset repair with direct production impact.
  - Skills: [] - Reason: no special skill required.
  - Omitted: [`frontend-ui-ux`] - Reason: this is not a brand redesign task.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: Final Verification | Blocked By: 1

  **References**:
  - Pattern: `src/layouts/Layout.astro:64` - current favicon reference.
  - Pattern: `public/` - currently contains no favicon asset.
  - Source: live production check showed `/favicon.svg` returning `404`.

  **Acceptance Criteria**:
  - [ ] `public/favicon.svg` exists.
  - [ ] Built output contains the favicon asset.
  - [ ] `GET /favicon.svg` returns `200` in production.
  - [ ] Smoke checks fail if favicon regresses again.

  **QA Scenarios**:
  ```text
  Scenario: Favicon is shipped end-to-end
    Tool: Bash
    Steps: Build, inspect output/static asset copy, then request `/favicon.svg` from production.
    Expected: Asset exists locally and returns 200 when deployed.
    Evidence: .sisyphus/evidence/task-5-favicon-fix.txt

  Scenario: Head reference does not drift
    Tool: Read
    Steps: Inspect `Layout.astro` and the deployed page head for favicon linkage.
    Expected: Head still points to `/favicon.svg` and matches the shipped asset path.
    Evidence: .sisyphus/evidence/task-5-favicon-fix-error.txt
  ```

  **Commit**: YES | Message: `fix(assets): add favicon asset` | Files: `public/favicon.svg`, `src/layouts/Layout.astro` only if needed, smoke checks if not already covered

- [x] 6. Complete zh localization for shared shell and newsletter surfaces

  **What to do**: Audit hardcoded English strings that remain visible after switching to zh on the audited public routes and add them to the existing client-side translation system. Cover homepage shell, newsletter component states/labels, onboarding entry text, and shared social labels exposed in current browsing flows.
  **Must NOT do**: Do not implement locale-specific content routing or translate all article bodies; keep this to the shared shell/public UI surfaces observed in review.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is UI text consistency and polish across shared components.
  - Skills: [`playwright`] - Reason: browser verification is necessary for route-by-route zh parity.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: Final Verification | Blocked By: 1

  **References**:
  - Pattern: `src/scripts/i18n.ts:6` - current translation dictionary and switcher behavior.
  - Pattern: `src/components/NewsletterSignup.astro:9` - newsletter remains hardcoded English.
  - Pattern: `src/constants.ts:18` - social link titles derive from English-only strings.
  - Pattern: `src/pages/start-here.astro:14` - onboarding page currently mixes EN and zh intentionally and needs explicit scope handling.

  **Acceptance Criteria**:
  - [ ] Homepage shell labels are translated after `?lang=zh`.
  - [ ] Newsletter heading, field label, submit/loading states, success/error copy, and related shell text are translated after `?lang=zh`.
  - [ ] Shared social labels exposed in the audited shell no longer remain English-only after zh switch.
  - [ ] E2E zh-shell assertions pass on production-representative routes.

  **QA Scenarios**:
  ```text
  Scenario: zh shell is consistent on audited public routes
    Tool: Playwright
    Steps: Visit `/`, `/search/?lang=zh`, `/admin/login?lang=zh`, and homepage newsletter section with zh active.
    Expected: Shared UI labels and messages are shown in zh with no remaining hardcoded English in scoped surfaces.
    Evidence: .sisyphus/evidence/task-6-zh-shell-fix.txt

  Scenario: Hardcoded English regressions are caught
    Tool: Grep + Playwright
    Steps: Search for known hardcoded strings in shared components, then verify in-browser rendered text after zh switch.
    Expected: Scoped shared surfaces do not expose the old English-only strings.
    Evidence: .sisyphus/evidence/task-6-zh-shell-fix-error.txt
  ```

  **Commit**: YES | Message: `fix(i18n): complete zh shell and newsletter localization` | Files: `src/scripts/i18n.ts`, shared components/pages with hardcoded shell copy

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Real Manual QA - unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- `test(smoke): cover rss favicon and pagefind assets`
- `test(e2e): make search and zh shell assertions strict`
- `fix(config): align canonical site domain sources`
- `fix(rss): resolve feed generation failure`
- `fix(search): generate and deploy pagefind assets reliably`
- `fix(assets): add favicon asset`
- `fix(i18n): complete zh shell and newsletter localization`

## Success Criteria
- The executor can fix all four reported surfaces without making new product decisions.
- The repaired site passes strict route/asset/search/localization verification.
- The same defects cannot silently pass CI or smoke checks again.
