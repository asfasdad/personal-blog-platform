import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/blog/', '/search/', '/admin/login'];

for (const route of routes) {
  test(`critical accessibility violations are clean on ${route}`, async ({ page }) => {
    await page.goto(route);
    const axe = new AxeBuilder({ page });
    const scan = await axe.analyze();
    const criticalViolations = scan.violations.filter(
      violation => violation.impact === 'critical'
    );

    expect(
      criticalViolations,
      `Critical a11y violations on ${route}`
    ).toEqual([]);
  });
}
