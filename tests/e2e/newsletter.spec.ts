import { expect, test } from '@playwright/test';

test('public pages include Cloudflare analytics beacon script', async ({ page }) => {
  await page.goto('/');

  const beaconScript = page.locator('script[src="https://static.cloudflareinsights.com/beacon.min.js"]');
  await expect(beaconScript).toHaveCount(1);
  await expect(beaconScript).toHaveAttribute('data-cf-beacon', /token/);
});

test('newsletter validates invalid email input', async ({ page }) => {
  await page.goto('/');

  await page.fill('#newsletter-email', 'not-an-email');
  await page.click('#newsletter-submit');

  await expect(page.locator('#newsletter-error')).toBeVisible();
  await expect(page.locator('#newsletter-error')).toContainText(/valid email/i);
});

test('newsletter handles success and duplicate submissions idempotently', async ({ page }) => {
  let callCount = 0;

  await page.route('**/api/newsletter', async route => {
    callCount += 1;
    if (callCount === 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'subscribed', message: 'Subscribed successfully.' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'already_subscribed', message: 'Already subscribed.' }),
    });
  });

  await page.goto('/');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText(/subscribed successfully/i);

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText(/already subscribed/i);
});

test('newsletter shows graceful outage message when provider is unavailable', async ({ page }) => {
  await page.route('**/api/newsletter', async route => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Subscription provider unavailable.' }),
    });
  });

  await page.goto('/');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');

  await expect(page.locator('#newsletter-message')).toContainText(/temporarily unavailable|unable to subscribe|retry/i);
});
