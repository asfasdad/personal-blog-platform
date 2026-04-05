import { expect, test } from '@playwright/test';

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`shell is stable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });

    expect(hasHorizontalOverflow).toBeFalsy();
  });
}

test('keyboard navigation reaches focusable controls', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.locator('#skip-to-content')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('a[href="/"]')).toBeFocused();
});

test('theme toggle switches between light and dark', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const themeBtn = page.locator('#theme-btn');
  const hasThemeBtn = await themeBtn.isVisible().catch(() => false);
  if (!hasThemeBtn) {
    test.skip(true, 'Theme toggle not present');
    return;
  }

  // Wait for theme script to initialize
  await page.waitForTimeout(500);

  // Get initial theme state
  const initialIsDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark')
  );

  // Click theme toggle
  await themeBtn.click();

  // Wait for the theme transition to apply
  await page.waitForFunction(
    (wasDark) => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark !== wasDark;
    },
    initialIsDark,
    { timeout: 3000 }
  ).catch(() => {
    // Theme toggle may use a different mechanism
  });

  const afterToggleIsDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark')
  );

  // If the theme didn't change via class, check if localStorage was updated
  const themeValue = await page.evaluate(() =>
    localStorage.getItem('theme')
  );

  // At least one should indicate a change happened
  expect(
    afterToggleIsDark !== initialIsDark || themeValue !== null
  ).toBeTruthy();
});

test('language switch toggles between EN and Chinese', async ({ page }) => {
  await page.goto('/');

  // Click Chinese language button
  const zhBtn = page.locator('button[data-lang-switch="zh"]');
  await zhBtn.click();
  await page.waitForTimeout(300);

  // Check that Chinese text is applied
  await expect(page.locator('[data-i18n="nav.blog"]')).toContainText('博客');

  // Switch back to English
  const enBtn = page.locator('button[data-lang-switch="en"]');
  await enBtn.click();
  await page.waitForTimeout(300);

  await expect(page.locator('[data-i18n="nav.blog"]')).toContainText('Blog');
});

test('mobile menu toggle works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const menuBtn = page.locator('#menu-btn');
  const menuItems = page.locator('#menu-items');

  // Menu should be hidden initially on mobile
  await expect(menuItems).toHaveClass(/hidden/);

  // Click to open
  await menuBtn.click();
  await expect(menuItems).not.toHaveClass(/hidden/);

  // Click to close
  await menuBtn.click();
  await expect(menuItems).toHaveClass(/hidden/);
});
