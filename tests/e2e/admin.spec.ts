import { expect, test } from '@playwright/test';

const loginAsAdmin = async (page) => {
  await page.goto('/admin/login');

  const keyInput = page.locator('#admin-key');
  await expect(keyInput).toBeVisible();

  for (const key of ['admin123', 'local-admin-key']) {
    await keyInput.fill(key);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    if (!page.url().includes('/admin/login?error=invalid')) {
      return;
    }
  }

  throw new Error('Failed to login with known admin keys.');
};

test('unauthenticated user is redirected to admin login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { level: 1, name: /admin access/i })).toBeVisible();
});

test('admin modules work end-to-end', async ({ request }) => {
  const baseOrigin = process.env.PLAYWRIGHT_TEST_BASE_URL ?? `http://127.0.0.1:${process.env.E2E_PORT ?? '47653'}`;
  const headers = {
    'x-admin-access-key': 'admin123',
    origin: baseOrigin,
    referer: `${baseOrigin}/admin`,
  };
  const uniqueSuffix = `${Date.now()}`;
  const postTitle = `E2E Admin Post ${uniqueSuffix}`;

  const createPostResponse = await request.post('/api/admin/posts/create', {
    headers,
    data: {
      title: postTitle,
      description: 'Created by automated E2E test',
      tags: ['e2e', 'admin'],
      content: '# E2E Post\n\nCreated through API test.',
      action: 'publish',
    },
  });
  expect(createPostResponse.ok()).toBeTruthy();
  const createPostJson = await createPostResponse.json();
  const postId = String(createPostJson.id);
  expect(postId.length).toBeGreaterThan(0);

  const listPostsResponse = await request.get('/api/admin/posts', { headers });
  expect(listPostsResponse.ok()).toBeTruthy();
  const listPostsJson = await listPostsResponse.json();
  expect(Array.isArray(listPostsJson.posts)).toBeTruthy();
  expect(listPostsJson.posts.some((post: { id: string; title: string }) => post.id === postId && post.title === postTitle)).toBeTruthy();

  const updatePostResponse = await request.put(`/api/admin/posts/${postId}`, {
    headers,
    data: {
      title: postTitle,
      description: 'Updated by automated E2E test',
      tags: ['e2e', 'admin', 'updated'],
      content: '# E2E Post\n\nUpdated through API test.',
      draft: false,
    },
  });
  expect(updatePostResponse.ok()).toBeTruthy();

  const getPostResponse = await request.get(`/api/admin/posts/${postId}`, { headers });
  expect(getPostResponse.ok()).toBeTruthy();
  const getPostJson = await getPostResponse.json();
  expect(getPostJson.post.description).toBe('Updated by automated E2E test');

  const settingsTitle = `Personal Blog ${uniqueSuffix}`;
  const saveSettingsResponse = await request.post('/api/admin/settings', {
    headers,
    data: {
      siteTitle: settingsTitle,
      siteDescription: 'E2E settings update',
      postsPerPage: 12,
      commentsEnabled: true,
    },
  });
  expect(saveSettingsResponse.ok()).toBeTruthy();

  const getSettingsResponse = await request.get('/api/admin/settings', { headers });
  expect(getSettingsResponse.ok()).toBeTruthy();
  const getSettingsJson = await getSettingsResponse.json();
  expect(getSettingsJson.settings.siteTitle).toBe(settingsTitle);

  const mediaName = `sample-${uniqueSuffix}.svg`;
  const mediaUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZWQiLz48L3N2Zz4=';
  const createMediaResponse = await request.post('/api/admin/media', {
    headers,
    data: {
      name: mediaName,
      url: mediaUrl,
      mimeType: 'image/svg+xml',
      size: 97,
    },
  });
  expect(createMediaResponse.ok()).toBeTruthy();
  const createMediaJson = await createMediaResponse.json();
  const mediaId = String(createMediaJson.media.id);
  expect(mediaId.length).toBeGreaterThan(0);

  const listMediaResponse = await request.get('/api/admin/media', { headers });
  expect(listMediaResponse.ok()).toBeTruthy();
  const listMediaJson = await listMediaResponse.json();
  const createdMedia = listMediaJson.media.find((media: { id: string; name: string }) => media.name === mediaName);
  if (!createdMedia) {
    throw new Error('Created media was not found in /api/admin/media list response.');
  }

  const statsResponse = await request.get('/api/admin/stats', { headers });
  expect(statsResponse.ok()).toBeTruthy();
  const statsJson = await statsResponse.json();
  expect(typeof statsJson.totalPosts).toBe('number');
  expect(typeof statsJson.publishedPosts).toBe('number');

  const deleteMediaResponse = await request.post(`/api/admin/media/${String(createdMedia.id)}`, { headers });
  expect(deleteMediaResponse.ok()).toBeTruthy();

  const deletePostResponse = await request.post(`/api/admin/posts/${postId}`, { headers });
  expect(deletePostResponse.ok()).toBeTruthy();

  const deletedPostResponse = await request.get(`/api/admin/posts/${postId}`, { headers });
  expect(deletedPostResponse.status()).toBe(404);
});

test('admin frontend works: nav, language switch, and publish flow', async ({ page }) => {
  const uniqueSuffix = `${Date.now()}`;
  const postTitle = `UI Publish Post ${uniqueSuffix}`;

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await loginAsAdmin(page);
  await expect(page).toHaveURL(/\/admin/);

  await page.goto('/admin/posts');
  await expect(page.getByRole('link', { name: /Posts/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Media/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();

  await page.click('a[href="/admin/media"]');
  await expect(page).toHaveURL(/\/admin\/media/);

  await page.click('a[href="/admin/settings"]');
  await expect(page).toHaveURL(/\/admin\/settings/);

  await page.click('a[href="/admin/posts"]');
  await expect(page).toHaveURL(/\/admin\/posts/);

  await page.click('a[href="/admin/posts/new"]');
  await expect(page).toHaveURL(/\/admin\/posts\/new/);

  await page.click('button[data-lang-switch="zh"]');
  await expect(page.locator('[data-i18n="admin.postTitle"]')).toContainText('文章标题');
  await expect(page.locator('[data-i18n="admin.postContent"]')).toContainText('正文');

  await page.fill('#post-title', postTitle);
  await page.fill('#post-content', '# UI publish test\n\nCreated by Playwright.');
  await page.click('button[value="publish"]');

  await expect(page).toHaveURL(/\/admin\/posts/);
  await expect(page.locator('#posts-table')).toContainText(postTitle);
});
