const { spawnSync } = require('node:child_process');
const path = require('node:path');

const args = process.argv.slice(2);
const command = args[0];
const isWindows = process.platform === 'win32';

const binName = command === 'check' ? 'astro-check' : 'astro';
const binPath = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  isWindows ? `${binName}.cmd` : binName,
);

const childArgs = command === 'check' ? args.slice(1) : args;

const result = spawnSync(binPath, childArgs, {
  stdio: 'inherit',
  shell: isWindows,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
