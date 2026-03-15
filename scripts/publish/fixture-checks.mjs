import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = path.resolve(process.cwd());
const evidenceDir = path.resolve(cwd, '.sisyphus', 'evidence');
await fs.mkdir(evidenceDir, { recursive: true });

const run = (prompt, now) =>
  spawnSync(
    process.execPath,
    ['scripts/publish/run-pipeline.mjs', '--prompt', prompt, '--mode', 'mock-pr', '--now', now],
    { cwd, encoding: 'utf8' }
  );

const valid = run('tests/fixtures/prompts/hello-premium-world.json', '2026-03-25T00:00:00.000Z');
const invalid = run('tests/fixtures/prompts/malformed-post.json', '2026-03-25T00:00:00.000Z');

const validEvidence = [
  'Task 10 fixture checks',
  `valid exit code: ${valid.status}`,
  `valid stdout: ${valid.stdout.trim()}`,
  `valid stderr: ${valid.stderr.trim()}`,
].join('\n\n');

const invalidEvidence = [
  'Task 10 malformed fixture check',
  `invalid exit code: ${invalid.status}`,
  `invalid stdout: ${invalid.stdout.trim()}`,
  `invalid stderr: ${invalid.stderr.trim()}`,
].join('\n\n');

await fs.writeFile(path.resolve(evidenceDir, 'task-10-auto-publish.txt'), validEvidence, 'utf8');
await fs.writeFile(path.resolve(evidenceDir, 'task-10-auto-publish-error.txt'), invalidEvidence, 'utf8');

if (valid.status !== 0) {
  console.error('Valid fixture failed unexpectedly.');
  process.exit(1);
}

if (invalid.status === 0) {
  console.error('Malformed fixture should fail but exited 0.');
  process.exit(1);
}

console.log('Auto-publish fixture checks completed.');
