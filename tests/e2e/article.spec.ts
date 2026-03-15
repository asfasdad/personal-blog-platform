import { expect, test } from '@playwright/test';

test('article page renders reading experience details', async ({ page }) => {
  await page.goto('/blog/hello-world');

  await expect(page.getByRole('heading', { level: 1, name: /hello world/i })).toBeVisible();
  await expect(page.locator('#post-toc')).toBeVisible();
  await expect(page.locator('#post-toc-list a')).toHaveCount(3);
  await expect(page.locator('#article pre code')).toContainText('Hello, World!');
  await expect(page.getByRole('heading', { level: 2, name: /related posts/i })).toBeVisible();
  await expect(page.locator('section:has(h2:has-text("Related Posts")) a').first()).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await expect(page.locator('#myBar')).not.toHaveCSS('width', '0px');

  const firstTocLink = page.locator('#post-toc-list a').first();
  await firstTocLink.click();
  await expect(page).toHaveURL(/#.+/);

  await expect(page.locator('#comments')).toBeVisible();
  await expect(page.locator('#comments')).not.toHaveAttribute('data-state', 'idle');
});

test('comments show graceful fallback when giscus script is blocked', async ({ context, page }) => {
  await context.route('https://giscus.app/client.js', route => route.abort());
  await page.goto('/blog/hello-world');

  await expect(page.locator('#comments')).toBeVisible();
  await expect(page.locator('#comments-fallback')).toBeVisible();
  await expect(page.locator('#comments')).toHaveAttribute('data-state', 'error');
});
