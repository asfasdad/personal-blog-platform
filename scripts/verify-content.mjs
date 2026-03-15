import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_FIELDS = ['title', 'description', 'pubDatetime'];
const DATE_FIELDS = ['pubDatetime', 'publishAt'];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const fixtureIndex = args.findIndex(arg => arg === '--fixture');
  if (fixtureIndex >= 0 && args[fixtureIndex + 1]) {
    return path.resolve(process.cwd(), args[fixtureIndex + 1]);
  }
  return path.resolve(process.cwd(), 'tests/fixtures/content/valid/hello-premium-world.mdx');
};

const collectFiles = targetPath => {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return [targetPath];
  const stack = [targetPath];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) files.push(fullPath);
    }
  }

  return files.sort();
};

const parseFrontmatter = source => {
  const lines = source.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return {};

  const data = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') break;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    data[key] = value;
  }

  return data;
};

const slugify = text =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const validateFiles = files => {
  const errors = [];
  const seenSlugs = new Map();

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const data = parseFrontmatter(source);

    for (const field of REQUIRED_FIELDS) {
      if (!data[field] || String(data[field]).trim() === '') {
        errors.push(`${file}: missing required frontmatter field \`${field}\``);
      }
    }

    for (const field of DATE_FIELDS) {
      if (!data[field] || String(data[field]).trim() === '') {
        continue;
      }

      const parsed = new Date(String(data[field]));
      if (Number.isNaN(parsed.getTime())) {
        errors.push(`${file}: invalid date value for \`${field}\``);
      }
    }

    const baseName = path.basename(file, path.extname(file));
    const slug = data.slug ? String(data.slug) : slugify(String(data.title ?? baseName));
    if (seenSlugs.has(slug)) {
      errors.push(`${file}: duplicate slug \`${slug}\` (already used by ${seenSlugs.get(slug)})`);
    } else {
      seenSlugs.set(slug, file);
    }
  }

  return errors;
};

try {
  const targetPath = parseArgs();
  if (!fs.existsSync(targetPath)) {
    console.error(`Fixture path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const files = collectFiles(targetPath);
  if (files.length === 0) {
    console.error(`No markdown fixture files found under: ${targetPath}`);
    process.exit(1);
  }

  const errors = validateFiles(files);
  if (errors.length > 0) {
    console.error('Content verification failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Content verification passed for ${files.length} file(s).`);
  process.exit(0);
} catch (error) {
  console.error('verify-content crashed:', error);
  process.exit(1);
}
