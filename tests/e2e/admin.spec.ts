import { expect, test } from '@playwright/test';

test('unauthenticated user is redirected to admin login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { level: 1, name: /admin access/i })).toBeVisible();
});

test('owner can login and trigger admin action', async ({ page }) => {
  await page.goto('/admin/login');

  await page.fill('#admin-key', 'local-admin-key');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { level: 1, name: /admin operations console/i })).toBeVisible();

  await page.click('button[data-action="publish"]');
  await expect(page.locator('#admin-action-status')).toContainText(/completed/i);
  await expect(page.locator('#admin-audit-feed li').first()).toBeVisible();

  const analyticsScript = page.locator('script[src="https://static.cloudflareinsights.com/beacon.min.js"]');
  await expect(analyticsScript).toHaveCount(0);
});
