import { expect, test } from '@playwright/test';

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`shell is stable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    await expect(page.locator('header.app-layout').first()).toBeVisible();
    await expect(page.locator('footer.app-layout').first()).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });

    expect(hasHorizontalOverflow).toBeFalsy();

    await page.screenshot({
      path: `.sisyphus/evidence/task-5-design-system-${viewport.width}.png`,
      fullPage: true,
    });
  });
}

test('keyboard navigation reaches focusable controls', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.locator('#skip-to-content')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('a[href="/"]')).toBeFocused();

  await page.screenshot({
    path: '.sisyphus/evidence/task-5-design-system-focus.png',
    fullPage: false,
  });
});
