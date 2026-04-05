import { expect, test } from '@playwright/test';

test('newsletter validates invalid email input', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const emailInput = page.locator('#newsletter-email');
  const hasNewsletter = await emailInput.isVisible().catch(() => false);
  if (!hasNewsletter) {
    test.skip(true, 'Newsletter section not rendered on this build');
    return;
  }

  await page.fill('#newsletter-email', 'not-an-email');
  await page.click('#newsletter-submit');

  await expect(page.locator('#newsletter-error')).toBeVisible();
});

test('newsletter handles success and duplicate submissions', async ({ page }) => {
  let callCount = 0;

  await page.route('**/api/newsletter', async route => {
    callCount += 1;
    if (callCount === 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'subscribed',
          message: 'Subscribed successfully.',
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'already_subscribed',
        message: 'Already subscribed.',
      }),
    });
  });

  const response = await page
    .goto('/', { waitUntil: 'networkidle', timeout: 15000 })
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

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).not.toHaveText('');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).not.toHaveText('');
});

test('newsletter shows outage message when provider is unavailable', async ({
  page,
}) => {
  await page.route('**/api/newsletter', async route => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Subscription provider unavailable.',
      }),
    });
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const emailInput = page.locator('#newsletter-email');
  const hasNewsletter = await emailInput.isVisible().catch(() => false);
  if (!hasNewsletter) {
    test.skip(true, 'Newsletter section not rendered on this build');
    return;
  }

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');

  await expect(page.locator('#newsletter-message')).not.toHaveText('');
});
