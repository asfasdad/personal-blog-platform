import { test, expect } from '@playwright/test';

test('zh shell newsletter should display zh UI strings and not show English', async ({ page }) => {
  await page.goto('/?lang=zh');

  await expect(page.getByRole('heading', { name: '通讯订阅' })).toBeVisible();
  await expect(page.locator('label[for="newsletter-email"]')).toHaveText('邮箱地址');
  await expect(page.getByRole('button', { name: '订阅' })).toBeVisible();
  await expect(page.locator('text=将新文章和项目笔记发送至您的邮箱。绝不垃圾邮件。')).toBeVisible();
  await expect(page.getByRole('link', { name: '新手上手指南' })).toBeVisible();

  await expect(page.locator('text=Personal Blog on GitHub')).toHaveCount(0);
  await expect(page.locator('text=GitHub').first()).toBeVisible();
  await expect(page.locator('text=Subscribe')).toHaveCount(0);
  await expect(page.locator('text=Newsletter')).toHaveCount(0);
});

test('zh search and admin routes should show localized shell text', async ({ page }) => {
  await page.goto('/search/?lang=zh');
  await expect(page.getByRole('heading', { name: '搜索' })).toBeVisible();
  await expect(page.locator('#search-status')).toContainText(/搜索已就绪|正在加载搜索索引/);

  await page.goto('/admin/login?lang=zh');
  await expect(page.getByRole('heading', { name: '管理入口' })).toBeVisible();
  await expect(page.getByLabel('访问密钥')).toBeVisible();
  await expect(page.getByRole('button', { name: '打开管理控制台' })).toBeVisible();
});

test('zh newsletter should handle invalid, success, duplicate, and unavailable states', async ({ page }) => {
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

    if (callCount === 2) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'already_subscribed', message: 'dup' }),
      });
      return;
    }

    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'down' }),
    });
  });

  await page.goto('/?lang=zh');

  await page.fill('#newsletter-email', 'invalid');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-error')).toBeVisible();
  await expect(page.locator('#newsletter-error')).toContainText('请输入有效的邮箱地址。');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText('订阅成功。请检查您的邮箱。');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText('您已订阅。感谢关注。');

  await page.fill('#newsletter-email', 'owner-test@example.com');
  await page.click('#newsletter-submit');
  await expect(page.locator('#newsletter-message')).toContainText('订阅服务暂不可用，请稍后再试。');
});
