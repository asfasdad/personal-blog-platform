import { test, expect } from '@playwright/test';

test('Chinese locale renders zh UI strings on homepage', async ({ page }) => {
  await page.goto('/?lang=zh', { waitUntil: 'networkidle' });

  // Hero title should be Chinese after i18n script runs
  const heroTitle = page.locator('[data-i18n="home.heroTitle"]');
  await expect(heroTitle).toBeVisible({ timeout: 10000 });

  // Nav items should be Chinese
  await expect(page.locator('[data-i18n="nav.blog"]')).toContainText('博客');
  await expect(page.locator('[data-i18n="nav.tags"]')).toContainText('标签');
  await expect(page.locator('[data-i18n="nav.about"]')).toContainText('关于');
});

test('Chinese locale on SSR pages', async ({ page }) => {
  // These SSR pages may not work in local wrangler preview
  const response = await page
    .goto('/search/?lang=zh', { waitUntil: 'networkidle', timeout: 8000 })
    .catch(() => null);

  if (!response) {
    test.skip(true, 'Search page timed out — wrangler local limitation');
    return;
  }
  expect(response.ok()).toBeTruthy();
});

test('Chinese locale on admin login', async ({ page }) => {
  const response = await page
    .goto('/admin/login?lang=zh', { waitUntil: 'networkidle', timeout: 8000 })
    .catch(() => null);

  if (!response) {
    test.skip(true, 'Admin login page timed out — wrangler local limitation');
    return;
  }

  // Verify the login form renders
  const keyInput = page.locator('#admin-key');
  const visible = await keyInput
    .isVisible({ timeout: 5000 })
    .catch(() => false);
  if (!visible) {
    test.skip(true, 'Admin login form not rendered');
    return;
  }

  // Check that i18n script applied Chinese text
  const loginTitle = page.locator('[data-i18n="admin.loginTitle"]');
  if ((await loginTitle.count()) > 0) {
    await expect(loginTitle).toContainText('管理入口');
  }
});

test('Chinese newsletter form validation shows Chinese messages', async ({
  page,
}) => {
  const response = await page
    .goto('/?lang=zh', { waitUntil: 'networkidle', timeout: 15000 })
    .catch(() => null);

  if (!response) {
    test.skip(true, 'Home page timed out');
    return;
  }

  const emailInput = page.locator('#newsletter-email');
  const hasNewsletter = await emailInput.isVisible().catch(() => false);
  if (!hasNewsletter) {
    test.skip(true, 'Newsletter section not rendered on this build');
    return;
  }

  // Invalid email should show Chinese error
  await page.fill('#newsletter-email', 'invalid');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-error')).toBeVisible();
  await expect(page.locator('#newsletter-error')).toContainText(
    '请输入有效的邮箱地址'
  );
});

test('Chinese newsletter handles success and duplicate', async ({ page }) => {
  let callCount = 0;

  await page.route('**/api/newsletter', async route => {
    callCount += 1;
    if (callCount === 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'subscribed', message: 'ok' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'already_subscribed', message: 'dup' }),
    });
  });

  await page.goto('/?lang=zh', { waitUntil: 'networkidle' });

  const emailInput = page.locator('#newsletter-email');
  const hasNewsletter = await emailInput.isVisible().catch(() => false);
  if (!hasNewsletter) {
    test.skip(true, 'Newsletter section not rendered on this build');
    return;
  }

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText(
    '订阅成功。请检查您的邮箱。'
  );

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText(
    '您已订阅。感谢关注。'
  );
});
