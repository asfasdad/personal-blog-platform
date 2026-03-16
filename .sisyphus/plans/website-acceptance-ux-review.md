# Website Acceptance and UX Review

## TL;DR
> **Summary**: Validate the live blog against the original platform requirements, then produce a release recommendation grounded in browser evidence, route/asset checks, and a weighted UX rubric.
> **Deliverables**:
> - Requirement-to-check acceptance matrix tied to the original blog plan
> - Live evidence set covering routes, assets, responsive layouts, localization, admin gating, discovery artifacts, and console/network health
> - Professional UX/visual review with weighted scoring and severity classification
> - Final `GO` / `HOLD` / `NO-GO` recommendation with blocking defects called out explicitly
> **Effort**: Medium
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 -> 2 -> 6 -> 8 -> 9 -> Final Verification

## Context
### Original Request
Create a test plan to accept the website, verify whether it meets the original goals, and assess convenience, usability, and aesthetics from a professional perspective using browser-based inspection and other checks.

### Interview Summary
- The live target is `https://blog.158247.xyz`.
- Acceptance must be judged against the original product expectations, not only against “page loads”.
- The user wants both functional acceptance and professional UX/visual assessment.

### Metis Review (gaps addressed)
- Acceptance is locked to `.sisyphus/plans/personal-blog-platform.md` deliverables, must-have rules, and definition of done to avoid generic feedback drift.
- Search, admin protection, responsive behavior, localization consistency, RSS, sitemap, and onboarding are all treated as explicit review surfaces.
- Browser-verifiable outcomes are separated from repo/ops-only items so the review does not over-claim coverage.
- The plan distinguishes first-party failures from third-party noise and uses a hard severity model for release gating.

## Work Objectives
### Core Objective
Produce a decision-complete acceptance and UX review plan that determines whether the live blog satisfies the original platform requirements and whether it is ready for release from both functional and professional-quality perspectives.

### Deliverables
- Acceptance baseline matrix mapping original requirements to executable checks.
- Browser and HTTP verification matrix for required live routes, assets, and discovery files.
- Responsive and localization audit at `375x812`, `768x1024`, and `1440x900`.
- UX and visual-quality rubric with weighted scores and explicit pass/fail thresholds.
- Defect ledger template with severity classes `Sev1` through `Sev4`.
- Final release recommendation template: `GO`, `HOLD`, or `NO-GO`.

### Definition of Done (verifiable conditions with commands)
- The acceptance matrix covers every relevant item from `.sisyphus/plans/personal-blog-platform.md:37`, `.sisyphus/plans/personal-blog-platform.md:47`, `.sisyphus/plans/personal-blog-platform.md:59`, and `.sisyphus/plans/personal-blog-platform.md:79`.
- Live verification covers `/`, `/blog/hello-world/`, `/archive`, `/about`, `/start-here`, `/search`, `/admin`, `/admin/login`, `/rss.xml`, and `/sitemap-index.xml`.
- First-party asset verification covers `/pagefind/pagefind-ui.css`, `/pagefind/pagefind-ui.js`, and `/favicon.svg`.
- Responsive/browser evidence is captured for desktop, tablet, and mobile.
- Localization review explicitly checks shell parity and mixed-language regressions.
- Final recommendation includes blocking defects, conditional defects, non-blocking polish items, and non-verifiable items.

### Must Have
- Requirement-to-check traceability back to the original platform plan.
- Deterministic browser inspection using Playwright plus route/header checks using Bash.
- Clear distinction between functional acceptance, UX assessment, and non-verifiable operational items.
- Severity-driven release rule: `Sev1` or `Sev2` means `NO-GO`; `Sev3` means `HOLD` unless explicitly accepted; `Sev4` logs only.
- Evidence for every task under `.sisyphus/evidence/website-review-*`.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No implementation or redesign work in this plan.
- No vague checks such as “looks good” or “works fine”.
- No assumption that `/admin/login` alone proves admin operations are acceptable.
- No assumption that dev fallback behavior is acceptable in production for must-have features like search.
- No mixing of first-party defects with tolerated third-party telemetry noise.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all review steps are agent-executed.
- Test decision: tests-after review using Playwright, Bash route checks, and Lighthouse.
- QA policy: Every task includes happy-path and failure/edge-path scenarios.
- Evidence: `.sisyphus/evidence/website-review-{task}-{slug}.{ext}`.
- Console/network policy: first-party `404`/`500` on required routes/assets fail acceptance; third-party analytics noise is logged separately unless it breaks interaction.
- Admin policy: unauthenticated gate behavior is mandatory; authenticated owner actions are listed as “not verifiable without credential” unless a safe test credential is supplied.

## Execution Strategy
### Parallel Execution Waves
Wave 1: baseline lock and objective live health (`baseline matrix`, `route and asset audit`, `discovery artifacts`)

Wave 2: browser quality review (`responsive review`, `localization review`, `search/admin/onboarding flows`)

Wave 3: synthesis (`ux rubric scoring`, `defect ledger`, `release recommendation`)

### Dependency Matrix (full, all tasks)
- 1 blocks 2, 3, 4, 5, 6, 7, 8, 9 because the acceptance baseline determines what counts as pass/fail.
- 2 blocks 6, 7, 8, 9 because route and asset failures define release blockers early.
- 3 informs 7 and 9 because discovery artifacts are part of release readiness.
- 4, 5, and 6 can run in parallel after 2, then feed 7 and 8.
- 7 blocks 9 because defect severity must be determined before the final recommendation.
- 8 blocks 9 because release status depends on weighted UX and professional-quality scoring.

### Agent Dispatch Summary (wave -> task count -> categories)
- Wave 1 -> 3 tasks -> `unspecified-high`
- Wave 2 -> 3 tasks -> `visual-engineering`, `unspecified-high`
- Wave 3 -> 3 tasks -> `writing`, `deep`

## TODOs
> Review + evidence = ONE task. Every task includes agent profile, references, acceptance criteria, and QA scenarios.

- [ ] 1. Lock the acceptance baseline and traceability matrix

  **What to do**: Derive a matrix that maps original deliverables, definition-of-done items, and must-have rules to concrete acceptance checks, expected outcomes, evidence files, and release severity if failed.
  **Must NOT do**: Do not invent new product requirements or downgrade any original must-have without an explicit user decision.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: this task is traceability and review-structure design.
  - Skills: [] - Reason: source material is already in-repo.
  - Omitted: [`requirements-clarifier`] - Reason: the baseline is already explicit enough in the existing plan.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2, 3, 4, 5, 6, 7, 8, 9 | Blocked By: none

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:37` - deliverables baseline.
  - Source: `.sisyphus/plans/personal-blog-platform.md:47` - definition of done baseline.
  - Source: `.sisyphus/plans/personal-blog-platform.md:59` - must-have baseline.
  - Source: `.sisyphus/plans/personal-blog-platform.md:79` - verification baseline.

  **Acceptance Criteria**:
  - [ ] Every original must-have and relevant deliverable is mapped to at least one executable acceptance check.
  - [ ] Each matrix row has expected result, severity on failure, and evidence target.
  - [ ] Non-browser-verifiable items are separated into a dedicated section.

  **QA Scenarios**:
  ```text
  Scenario: Acceptance matrix is complete
    Tool: Read + Bash
    Steps: Compare the matrix against `.sisyphus/plans/personal-blog-platform.md` sections for deliverables, definition of done, and must-have rules.
    Expected: No required item is left unmapped.
    Evidence: .sisyphus/evidence/website-review-1-baseline-matrix.md

  Scenario: Scope creep is blocked
    Tool: Read
    Steps: Inspect the matrix for checks unrelated to the original blog plan.
    Expected: No invented features or redesign work appears.
    Evidence: .sisyphus/evidence/website-review-1-baseline-matrix-error.md
  ```

  **Commit**: YES | Message: `docs(review): define acceptance baseline and scope` | Files: `.sisyphus/plans/website-acceptance-ux-review.md`, acceptance matrix artifacts

- [ ] 2. Verify required live routes and first-party assets

  **What to do**: Run route/header checks for required live URLs and first-party assets, capturing status codes, redirects, and failures for public routes, admin entry points, and search assets.
  **Must NOT do**: Do not treat dev fallback copy as a production pass for must-have features.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: deterministic live verification with release-gating impact.
  - Skills: [] - Reason: Bash and HTTP checks are sufficient.
  - Omitted: [`deploy-release`] - Reason: this task reviews the deployment; it does not ship changes.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 6, 7, 8, 9 | Blocked By: 1

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:39` - required public route families.
  - Source: `.sisyphus/plans/personal-blog-platform.md:65` - search is a must-have.
  - Source: `docs/cloudflare-deployment.md:30` - smoke-check route expectations.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:42` - search fallback was intended for dev resilience, not production acceptance.

  **Acceptance Criteria**:
  - [ ] `/`, `/blog/hello-world/`, `/archive`, `/about`, `/start-here`, `/admin/login`, `/rss.xml`, and `/sitemap-index.xml` return the expected response class.
  - [ ] `/admin` is not publicly readable without owner access.
  - [ ] `/pagefind/pagefind-ui.css`, `/pagefind/pagefind-ui.js`, and `/favicon.svg` are explicitly classified pass/fail with status evidence.
  - [ ] Any first-party `404` or `500` on required assets/routes is marked at least `Sev2`.

  **QA Scenarios**:
  ```text
  Scenario: Required routes and assets are healthy
    Tool: Bash
    Steps: Run `curl -I` checks against the required routes and first-party assets.
    Expected: Required public routes return 200-class responses; admin gate denies access; required assets return 200.
    Evidence: .sisyphus/evidence/website-review-2-routes-assets.txt

  Scenario: Search asset regression is caught
    Tool: Bash
    Steps: Check `/pagefind/pagefind-ui.css` and `/pagefind/pagefind-ui.js` directly.
    Expected: Any 404/500 is recorded as a release-blocking or hold-level defect per severity policy.
    Evidence: .sisyphus/evidence/website-review-2-routes-assets-error.txt
  ```

  **Commit**: YES | Message: `docs(review): add route and asset verification matrix` | Files: evidence logs and review docs

- [ ] 3. Validate discovery and SEO-supporting artifacts

  **What to do**: Verify RSS, sitemap, canonical metadata presence on key public pages, and noindex/privacy expectations on admin pages.
  **Must NOT do**: Do not assume route existence alone proves SEO readiness.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: requires a mix of HTTP and DOM inspection.
  - Skills: [] - Reason: standard browser and header checks are enough.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 7, 9 | Blocked By: 1

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:39` - RSS and sitemap are deliverables.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:33` - RSS prerender guarantee decision.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:61` - admin pages should be `noindex` and analytics-free.

  **Acceptance Criteria**:
  - [ ] `rss.xml` and `sitemap-index.xml` are reachable and return XML content types.
  - [ ] Home, article, and onboarding pages expose canonical links.
  - [ ] Admin pages expose `noindex` behavior and do not inject public analytics.

  **QA Scenarios**:
  ```text
  Scenario: Discovery artifacts are valid
    Tool: Bash + Playwright
    Steps: Check RSS and sitemap headers, then inspect canonical and robots meta on representative pages.
    Expected: Discovery artifacts are reachable and metadata aligns with route intent.
    Evidence: .sisyphus/evidence/website-review-3-discovery-seo.md

  Scenario: Admin privacy boundary is enforced
    Tool: Playwright
    Steps: Open `/admin/login` and inspect DOM for `noindex` and absence of analytics beacon.
    Expected: Admin page is excluded from indexing and public analytics scripts are absent.
    Evidence: .sisyphus/evidence/website-review-3-discovery-seo-error.md
  ```

  **Commit**: YES | Message: `docs(review): add discovery and seo acceptance checks` | Files: evidence logs and review docs

- [ ] 4. Run the responsive shell review across desktop, tablet, and mobile

  **What to do**: Inspect the site shell at `1440x900`, `768x1024`, and `375x812`, checking navigation discoverability, menu behavior, CTA visibility, spacing, overflow, and footer readability on representative public routes.
  **Must NOT do**: Do not rely on a single viewport or only the homepage.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: responsive layout and shell quality are UI-heavy review areas.
  - Skills: [`playwright`] - Reason: deterministic browser viewport inspection is required.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8, 9 | Blocked By: 1, 2

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:40` - premium design system requirement.
  - Source: `.sisyphus/plans/personal-blog-platform.md:68` - keyboard navigation and mobile responsiveness.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:39` - exact viewport evidence policy.

  **Acceptance Criteria**:
  - [ ] The shell is navigable and readable at all three required viewports.
  - [ ] Mobile menu opens/closes correctly and preserves access to navigation and language switcher.
  - [ ] No clipping, horizontal overflow, or hidden primary CTA occurs on audited pages.

  **QA Scenarios**:
  ```text
  Scenario: Responsive shell behaves correctly
    Tool: Playwright
    Steps: Open `/`, `/blog/hello-world/`, and `/start-here/` at `1440x900`, `768x1024`, and `375x812`; inspect nav, CTA visibility, and footer readability.
    Expected: Layout remains usable with no clipped or unreachable primary controls.
    Evidence: .sisyphus/evidence/website-review-4-responsive.md

  Scenario: Mobile menu regression is caught
    Tool: Playwright
    Steps: At `375x812`, open the mobile menu and verify nav items, language switcher, and search remain reachable.
    Expected: Menu behavior is deterministic, labels are readable, and no key control is trapped or hidden.
    Evidence: .sisyphus/evidence/website-review-4-responsive-error.md
  ```

  **Commit**: YES | Message: `docs(review): add responsive acceptance checks` | Files: evidence logs and review docs

- [ ] 5. Audit localization consistency and bilingual shell parity

  **What to do**: Validate whether the shell and onboarding experience achieve the intended bilingual standard on desktop and mobile, including navigation, labels, onboarding links, search copy, and footer text.
  **Must NOT do**: Do not count mixed-language shell content as a clean pass.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: language consistency directly affects usability and polish.
  - Skills: [`playwright`] - Reason: requires live shell inspection and viewport comparison.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8, 9 | Blocked By: 1, 2

  **References**:
  - Source: `docs/first-time-guide-zh.md:53` - bilingual behavior expectation now documented.
  - Source: `.sisyphus/plans/personal-blog-platform.md:21` - stronger usability and premium feel requirement.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:36` - non-generic premium shell intent.

  **Acceptance Criteria**:
  - [ ] Shell labels on key public routes are consistently translated after language switch.
  - [ ] Mixed-language chrome is explicitly logged as pass/fail with severity.
  - [ ] Onboarding content is judged for discoverability and linguistic clarity.

  **QA Scenarios**:
  ```text
  Scenario: Chinese shell parity is achieved
    Tool: Playwright
    Steps: Switch to `?lang=zh`, inspect `/`, `/search/`, `/start-here/`, and `/admin/login` on desktop and mobile.
    Expected: Core shell labels are translated consistently and onboarding remains understandable.
    Evidence: .sisyphus/evidence/website-review-5-localization.md

  Scenario: Mixed-language regression is surfaced
    Tool: Playwright
    Steps: Record any remaining English labels or untranslated states after language switch.
    Expected: Each inconsistency is logged with page, viewport, and severity.
    Evidence: .sisyphus/evidence/website-review-5-localization-error.md
  ```

  **Commit**: YES | Message: `docs(review): add localization acceptance checks` | Files: evidence logs and review docs

- [ ] 6. Validate critical interaction flows: search, onboarding, and admin access

  **What to do**: Review the critical first-use flows for search, first-time guidance, and unauthenticated admin protection, including fallbacks, error messaging, and whether the flow matches the original product promises.
  **Must NOT do**: Do not mark search as acceptable if production assets fail and the page falls back to a non-functional message.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: combines UX, browser behavior, and release-gating functionality.
  - Skills: [`playwright`] - Reason: flow validation is browser-centric.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 7, 8, 9 | Blocked By: 1, 2, 3

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:39` - search and about/onboarding-related routes are deliverables.
  - Source: `.sisyphus/plans/personal-blog-platform.md:43` - owner-only admin surface requirement.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:42` - search fallback intent.
  - Source: `.sisyphus/notepads/personal-blog-platform/decisions.md:59` - middleware-enforced admin gate.
  - Source: `docs/first-time-guide-zh.md:1` - first-time use guidance expectation.

  **Acceptance Criteria**:
  - [ ] Search route loads required assets and supports a known-query success path and no-result path.
  - [ ] Onboarding path from homepage to `/start-here/` is discoverable and complete for first-time users.
  - [ ] `/admin` denies unauthenticated access and `/admin/login` renders usable login UI.
  - [ ] Any flow-breaking issue is classified with release severity.

  **QA Scenarios**:
  ```text
  Scenario: Critical user flows succeed
    Tool: Playwright + Bash
    Steps: From `/`, open `/start-here/`; open `/search/`; verify `/admin` denies access and `/admin/login` renders.
    Expected: Onboarding is reachable, admin gate works, and search provides production-grade functionality.
    Evidence: .sisyphus/evidence/website-review-6-critical-flows.md

  Scenario: Flow-breaking defects are captured
    Tool: Playwright + Bash
    Steps: Trigger search asset loading, inspect console/network, and record broken first-party flow states.
    Expected: Broken search assets, unusable onboarding, or failed admin gating are recorded as blockers or hold-level defects.
    Evidence: .sisyphus/evidence/website-review-6-critical-flows-error.md
  ```

  **Commit**: YES | Message: `docs(review): add critical flow acceptance checks` | Files: evidence logs and review docs

- [ ] 7. Build the defect ledger and severity classification

  **What to do**: Convert all findings into a structured defect ledger with exact location, reproducible steps, evidence links, requirement violated, and severity class.
  **Must NOT do**: Do not mix subjective polish notes with objective functional defects in the same severity bucket.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: this is structured synthesis and severity classification.
  - Skills: [] - Reason: no special framework is needed.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 9 | Blocked By: 2, 3, 4, 5, 6

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:67` - admin must remain owner-only.
  - Source: `.sisyphus/plans/personal-blog-platform.md:68` - accessibility and mobile responsiveness intent.
  - Source: `.sisyphus/plans/personal-blog-platform.md:76` - generic unfinished shell quality is not allowed.

  **Acceptance Criteria**:
  - [ ] Every finding is mapped to a violated requirement or explicit acceptance criterion.
  - [ ] Each defect includes severity, reproducible steps, and evidence path.
  - [ ] The ledger distinguishes `Sev1`, `Sev2`, `Sev3`, and `Sev4` consistently.

  **QA Scenarios**:
  ```text
  Scenario: Defect ledger is complete
    Tool: Read
    Steps: Cross-check all route, asset, responsive, and localization findings against the final defect ledger.
    Expected: No observed issue is missing from the ledger.
    Evidence: .sisyphus/evidence/website-review-7-defect-ledger.md

  Scenario: Severity drift is prevented
    Tool: Read
    Steps: Review severity assignment for broken first-party assets, required-route failures, and mixed-language/polish findings.
    Expected: Functional blockers remain blocker-level; polish issues are not over-escalated.
    Evidence: .sisyphus/evidence/website-review-7-defect-ledger-error.md
  ```

  **Commit**: YES | Message: `docs(review): add severity model and defect ledger` | Files: review docs and evidence summaries

- [ ] 8. Score usability and visual quality with a weighted rubric

  **What to do**: Produce a professional review using a weighted rubric with exact categories and thresholds: navigation clarity (15), onboarding clarity (15), reading comfort (15), localization consistency (10), mobile ergonomics (15), visual polish/trust (20), and failure-state quality (10).
  **Must NOT do**: Do not reduce the review to personal taste; every score change must cite observable evidence.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: requires synthesis of UX heuristics, product goals, and live evidence.
  - Skills: [`playwright`] - Reason: rubric must be grounded in real browser observations.
  - Omitted: [`frontend-ui-ux`] - Reason: this is evaluation, not design generation.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 9 | Blocked By: 4, 5, 6

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:21` - premium visual and usability target.
  - Source: `.sisyphus/plans/personal-blog-platform.md:40` - premium design system deliverable.
  - Source: `.sisyphus/plans/personal-blog-platform.md:68` - accessibility and mobile-first intent.
  - External: `https://www.w3.org/WAI/WCAG22/quickref/` - accessibility quick reference.

  **Acceptance Criteria**:
  - [ ] Every rubric category receives a score, evidence note, and confidence level.
  - [ ] The rubric cleanly separates objective defects from subjective editorial suggestions.
  - [ ] The final weighted score feeds the release recommendation without overriding blocker defects.

  **QA Scenarios**:
  ```text
  Scenario: UX rubric is evidence-based
    Tool: Read + Playwright evidence review
    Steps: For each category, verify that the score cites route/viewport-specific observations.
    Expected: No category is scored without evidence.
    Evidence: .sisyphus/evidence/website-review-8-ux-rubric.md

  Scenario: Subjective drift is blocked
    Tool: Read
    Steps: Inspect the rubric for unsupported aesthetic claims.
    Expected: All claims are tied to observed layout, copy, or interaction evidence.
    Evidence: .sisyphus/evidence/website-review-8-ux-rubric-error.md
  ```

  **Commit**: YES | Message: `docs(review): add ux rubric and scoring model` | Files: review docs and evidence summaries

- [ ] 9. Produce the final release recommendation and non-verifiable item register

  **What to do**: Synthesize all evidence into a single acceptance decision: `GO`, `HOLD`, or `NO-GO`. Include a non-verifiable register for items that require repo/ops credentials or workflow access beyond live browser inspection.
  **Must NOT do**: Do not mark the site `GO` if any must-have feature is broken in production without an explicit user override.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: final recommendation requires disciplined synthesis and release judgment.
  - Skills: [] - Reason: this is analysis, not browser execution.
  - Omitted: [] - Reason: no omission needed.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: Final Verification | Blocked By: 7, 8

  **References**:
  - Source: `.sisyphus/plans/personal-blog-platform.md:59` - must-have release baseline.
  - Source: `.sisyphus/plans/personal-blog-platform.md:70` - must-not-have baseline.
  - Source: `.sisyphus/plans/personal-blog-platform.md:671` - success criteria baseline.
  - Source: `docs/cloudflare-deployment.md:55` - public/admin route expectations.

  **Acceptance Criteria**:
  - [ ] Final recommendation is exactly one of `GO`, `HOLD`, or `NO-GO`.
  - [ ] The recommendation cites all `Sev1`/`Sev2` issues and any open `Sev3` conditions.
  - [ ] Non-verifiable items are listed separately with required follow-up evidence.

  **QA Scenarios**:
  ```text
  Scenario: Release recommendation is defensible
    Tool: Read
    Steps: Compare the final recommendation against the defect ledger and rubric score.
    Expected: Recommendation aligns with severity policy and does not ignore blockers.
    Evidence: .sisyphus/evidence/website-review-9-release-recommendation.md

  Scenario: Overclaiming is blocked
    Tool: Read
    Steps: Inspect the final summary for any claims about admin operations, rollback behavior, or workflow internals not verified by evidence.
    Expected: Such items appear only in the non-verifiable register.
    Evidence: .sisyphus/evidence/website-review-9-release-recommendation-error.md
  ```

  **Commit**: YES | Message: `docs(review): add release recommendation template` | Files: final review report and evidence summaries

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Real Manual QA - unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- `docs(review): define acceptance baseline and scope`
- `docs(review): add route and asset verification matrix`
- `docs(review): add responsive localization and UX rubric`
- `docs(review): add severity model and release recommendation template`
- `docs(evidence): record live acceptance findings`

## Success Criteria
- The executor can run the review with zero judgment calls.
- The final output clearly states `GO`, `HOLD`, or `NO-GO` and why.
- All must-have requirements are either validated, failed with severity, or explicitly marked non-verifiable with rationale.
