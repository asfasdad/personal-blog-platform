import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('integration content fixtures', () => {
  it('loads valid fixture frontmatter marker', () => {
    const filePath = path.resolve(
      process.cwd(),
      'tests/fixtures/content/valid/hello-premium-world.mdx',
    );
    const content = readFileSync(filePath, 'utf8');
    expect(content.includes('title: Hello Premium World')).toBe(true);
  });
});
