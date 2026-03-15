# Cloudflare Deployment Runbook

## Scope

This project deploys to Cloudflare Pages with two lanes:

- Preview deploys for pull requests.
- Production deploys for `main` only.

The workflows are:

- `.github/workflows/cloudflare-deploy.yml`
- `.github/workflows/rollback.yml`

## Required repository secrets and variables

Configure these in GitHub repository settings before the workflow is used:

- Secret: `CLOUDFLARE_API_TOKEN`
- Secret: `CLOUDFLARE_ACCOUNT_ID`
- Variable: `CLOUDFLARE_PAGES_PROJECT`
- Variable: `CLOUDFLARE_PRODUCTION_BRANCH` (default `main`)
- Variable: `CLOUDFLARE_CUSTOM_DOMAIN` (optional, used for runbook checks)

## Preview and production behavior

- Pull request events always deploy to a preview branch on Pages.
- Push to `main` deploys production.
- Manual dispatch supports either `preview` or `production` target.
- Post-deploy smoke checks must pass for:
  - `/`
  - `/blog/hello-premium-world/`
  - `/search/`
  - `/admin` access control

Smoke script:

```bash
node ./scripts/smoke/check-routes.mjs --base-url "https://<deployment-host>" --report-path ".sisyphus/evidence/task-11-cloudflare-deploy-manual.json"
```

## Custom domain binding checklist

1. Add `CNAME` for `blog.<your-domain>` to `<project>.pages.dev`.
2. In Cloudflare Pages project, attach the custom domain.
3. Wait for SSL provisioning to reach active state.
4. Validate:

```bash
curl -I https://blog.<your-domain>/
curl -I https://blog.<your-domain>/search/
curl -I https://blog.<your-domain>/admin
```

Expected outcomes:

- Public routes return `200`.
- `/admin` is not publicly readable without owner access (redirect or unauthorized).

## Protected `/admin` route strategy

Layer 1 (in app): `src/middleware.ts` enforces owner-only access for `/admin*` and `/api/admin*`.

Layer 2 (at edge): protect `/admin*` with Cloudflare Access policy:

- Application type: Self-hosted
- Path: `https://blog.<your-domain>/admin*`
- Policy: allow only owner identity group/emails

Use Layer 2 for internet-facing protection, and keep Layer 1 as app-level guardrail.

## Rollback controls

Use `.github/workflows/rollback.yml`.

- If `target_sha` is provided, that commit is rebuilt and redeployed to production.
- If omitted, workflow resolves the latest successful `cloudflare-deploy.yml` run on `main` and redeploys that commit.
- Rollback always runs smoke checks and uploads evidence.

Manual trigger example:

1. GitHub Actions -> `rollback` -> Run workflow.
2. Optional input: `target_sha`.
3. Confirm smoke artifact `task-11-cloudflare-deploy-error` is green.
