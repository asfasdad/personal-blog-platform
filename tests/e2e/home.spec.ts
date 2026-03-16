import { expect, test } from '@playwright/test';

test('home page loads and renders welcome heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page).toHaveTitle(/Personal Blog/i);
});

test('blog index route responds successfully', async ({ page }) => {
  const response = await page.goto('/blog/');
  expect(response?.ok()).toBeTruthy();
});

test('search route requires Pagefind UI and returns deterministic results for hello', async ({ page }) => {
  await page.goto('/search/');
  await expect(page.locator('#search-status')).not.toContainText(/unavailable/i);
  const searchInput = page.locator('.pagefind-ui__search-input').first();
  const isVisible = await searchInput.isVisible().catch(() => false);
  expect(isVisible).toBeTruthy();
  await searchInput.fill('hello');
  await page.waitForTimeout(1200);
  const count = await page.locator('.pagefind-ui__result-link').count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
});

test('discovery route inventory responds successfully', async ({ page }) => {
  const routes = ['/', '/archive/', '/tags/', '/projects/', '/about/', '/search/'];

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
  }
});
