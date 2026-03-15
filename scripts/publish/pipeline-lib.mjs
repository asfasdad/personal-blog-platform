import path from 'node:path';

const PLACEHOLDER_PATTERNS = [/lorem ipsum/i, /\bTODO\b/i, /\bTBD\b/i, /placeholder/i];

const toSlug = value =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const validatePrompt = prompt => {
  const errors = [];

  if (!prompt || typeof prompt !== 'object') {
    errors.push('prompt payload must be an object');
    return errors;
  }

  const title = String(prompt.title ?? '').trim();
  const summary = String(prompt.summary ?? '').trim();
  const publishAt = String(prompt.publishAt ?? '').trim();
  const tags = prompt.tags;

  if (!title) errors.push('title is required');
  if (!summary) errors.push('summary is required');
  if (!Array.isArray(tags)) {
    errors.push('tags must be an array of strings');
  } else if (tags.length === 0 || tags.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
    errors.push('tags must contain non-empty strings');
  }

  const publishDate = new Date(publishAt);
  if (!publishAt || Number.isNaN(publishDate.getTime())) {
    errors.push('publishAt must be a valid ISO date');
  }

  const composed = `${title} ${summary}`;
  if (PLACEHOLDER_PATTERNS.some(pattern => pattern.test(composed))) {
    errors.push('prompt contains placeholder text');
  }

  return errors;
};

export const buildDraft = ({ prompt, now }) => {
  const title = String(prompt.title).trim();
  const summary = String(prompt.summary).trim();
  const tags = prompt.tags.map(tag => String(tag).trim());
  const publishAt = new Date(String(prompt.publishAt)).toISOString();
  const slug = toSlug(title);
  const pubDatetime = new Date(now).toISOString();

  const markdown = `---\n` +
    `author: Author Name\n` +
    `title: ${title}\n` +
    `description: ${summary}\n` +
    `pubDatetime: ${pubDatetime}\n` +
    `publishAt: ${publishAt}\n` +
    `draft: false\n` +
    `featured: false\n` +
    `tags:\n${tags.map(tag => `  - ${tag}`).join('\n')}\n` +
    `---\n\n` +
    `## Why this post exists\n\n${summary}\n\n` +
    `## Publish checklist\n\n` +
    `- Content contract validated\n` +
    `- Route generation verified\n` +
    `- Preview-ready audit recorded\n`;

  const fileName = `${slug}.md`;
  const outputPath = path.join('src', 'content', 'blog', fileName);

  return { slug, outputPath, markdown, publishAt, title };
};

export const evaluateSchedule = (publishAt, nowIso) => {
  const now = new Date(nowIso).getTime();
  const planned = new Date(publishAt).getTime();
  return {
    publishAt,
    now: nowIso,
    previewReady: planned <= now,
    reason: planned <= now ? 'eligible-now' : 'scheduled-future',
  };
};
