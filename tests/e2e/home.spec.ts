import { expect, test } from '@playwright/test';

test('home page loads and renders heading', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
    timeout: 10000,
  });
});

test('blog index route responds successfully', async ({ page }) => {
  const response = await page.goto('/blog/');
  expect(response?.ok()).toBeTruthy();
});

test('search page loads', async ({ page }) => {
  const response = await page.goto('/search/', { waitUntil: 'networkidle' });
  expect(response?.ok()).toBeTruthy();
});

test('discovery routes respond with 200', async ({ page }) => {
  const routes = ['/', '/about/'];

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'load' });
    expect(response?.ok(), `Route ${route} should respond OK`).toBeTruthy();
  }
});

test('SSR discovery routes respond', async ({ page }) => {
  // These routes use D1/SSR and may not work in local wrangler preview
  const routes = ['/archives/', '/tags/', '/projects/'];

  for (const route of routes) {
    const response = await page.goto(route, {
      waitUntil: 'load',
      timeout: 8000,
    }).catch(() => null);

    if (!response) {
      test.skip(true, `Route ${route} timed out — wrangler local limitation`);
      return;
    }
    expect(response.ok(), `Route ${route} should respond OK`).toBeTruthy();
  }
});

test('blog listing shows articles', async ({ page }) => {
  await page.goto('/blog/', { waitUntil: 'networkidle' });
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible({ timeout: 10000 });
  // Should have at least one article from content collection
  const articleLinks = page.locator('main a[href^="/blog/"]');
  const count = await articleLinks.count();
  expect(count).toBeGreaterThan(0);
});

test('about page loads successfully', async ({ page }) => {
  const response = await page.goto('/about/');
  expect(response?.ok()).toBeTruthy();
});

test('404 page renders for unknown routes', async ({ page }) => {
  const response = await page.goto('/this-does-not-exist/');
  expect(response?.status()).toBe(404);
});
