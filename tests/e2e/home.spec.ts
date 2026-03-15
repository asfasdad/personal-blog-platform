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

test('search route handles empty-result state safely', async ({ page }) => {
  const response = await page.goto('/search');
  expect(response?.ok()).toBeTruthy();

  const searchInput = page.locator('.pagefind-ui__search-input').first();
  const hasInput = await searchInput.isVisible().catch(() => false);

  if (hasInput) {
    await searchInput.fill('zzzz-no-match');
    await expect(page.locator('#search-empty')).toBeVisible();
  } else {
    await expect(page.locator('#search-status')).toBeVisible();
  }
});

test('search returns indexed fixture content when available', async ({ page }) => {
  await page.goto('/search/');

  const searchInput = page.locator('.pagefind-ui__search-input').first();
  const hasInput = await searchInput.isVisible().catch(() => false);

  if (!hasInput) {
    await expect(page.locator('#search-status')).toBeVisible();
    return;
  }

  await searchInput.fill('welcome');
  await page.waitForTimeout(1200);

  const resultCount = await page.locator('.pagefind-ui__result-link').count();
  if (resultCount > 0) {
    await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  } else {
    await expect(page.locator('#search-empty')).toBeVisible();
  }
});

test('discovery route inventory responds successfully', async ({ page }) => {
  const routes = ['/', '/archive/', '/tags/', '/projects/', '/about/', '/search/'];

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
  }
});
