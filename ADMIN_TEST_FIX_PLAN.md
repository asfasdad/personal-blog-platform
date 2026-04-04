# Admin Backend Test & Fix Plan

## Goal

Make the admin backend pass end-to-end acceptance for:

1. login/auth guard
2. dashboard stats
3. posts list/search/filter/create/edit/delete
4. media upload/list/delete
5. settings load/save

## Baseline Failures (observed)

- Login with `admin123` redirects to `/admin/login?error=invalid` on production.
- Admin APIs return `401 Unauthorized` when not authenticated (expected), but module-level flows are incomplete after login.
- `POST /api/admin/posts/create`, `PUT/DELETE /api/admin/posts/[id]`, and `POST /api/admin/settings` are stubbed with comments and no durable storage.
- Media page is client-only preview with no backend upload/list/delete API.
- Posts delete button in UI is TODO and does not call backend.
- Dashboard uses content collection directly and does not represent runtime admin data mutations.

## Root Cause Summary

- Admin write flows are implemented as placeholders.
- No durable runtime storage wiring for admin modules.
- UI pages are only partially connected to backend APIs.

## Fix Strategy

### 1) Shared admin storage layer

- Add a server-side admin store helper using Cloudflare KV (`SESSION`) with typed entities:
  - posts
  - settings
  - media
- Add robust fallback for local/dev when KV binding is unavailable.

### 2) Auth consistency

- Use runtime/admin env resolution for access key.
- Keep simple-password behavior compatible with current setup.

### 3) API completion

- Implement fully functional admin APIs:
  - `GET /api/admin/posts`
  - `POST /api/admin/posts/create`
  - `GET/PUT/DELETE /api/admin/posts/[id]`
  - `GET/POST /api/admin/settings`
  - `GET/POST/DELETE /api/admin/media`
  - `GET /api/admin/stats`

### 4) Frontend admin wiring

- Connect posts delete action to API.
- Ensure post edit page supports API-driven loading.
- Connect media page to backend CRUD.
- Load settings from API and persist back.
- Load dashboard stats from API.

### 5) Verification loop

- Run `lsp_diagnostics` on changed files.
- Run `pnpm build`.
- Run targeted E2E admin tests and full e2e regression.
- Re-test production admin paths with browser automation.

## Acceptance Criteria

- Login succeeds with configured simple password and accesses `/admin`.
- Posts CRUD reflects immediately in admin list via API.
- Media upload/list/delete works through backend endpoints.
- Settings page loads stored values and saves updates.
- Dashboard stats reflect backend post counts.
- Automated tests and smoke checks pass.
