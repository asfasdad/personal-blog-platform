import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDraft, evaluateSchedule, validatePrompt } from './pipeline-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const getArg = name => {
  const index = args.indexOf(name);
  if (index < 0 || index === args.length - 1) return undefined;
  return args[index + 1];
};

const promptPathArg = getArg('--prompt');
const nowArg = getArg('--now') ?? new Date().toISOString();
const modeArg = getArg('--mode') ?? 'mock-pr';

if (!promptPathArg) {
  console.error('Missing required argument: --prompt <path>');
  process.exit(1);
}

const resolvedPromptPath = path.resolve(projectRoot, promptPathArg);
const auditDir = path.resolve(projectRoot, '.sisyphus', 'evidence');
await fs.mkdir(auditDir, { recursive: true });

const readPrompt = async () => {
  const raw = await fs.readFile(resolvedPromptPath, 'utf8');
  return JSON.parse(raw);
};

const writeAudit = async payload => {
  const target = path.resolve(auditDir, 'task-10-pipeline-last.json');
  await fs.writeFile(target, JSON.stringify(payload, null, 2), 'utf8');
};

try {
  const prompt = await readPrompt();
  const errors = validatePrompt(prompt);
  if (errors.length > 0) {
    const blocked = {
      status: 'quarantined',
      prompt: promptPathArg,
      errors,
      timestamp: nowArg,
      prAction: 'blocked-no-pr',
    };
    await writeAudit(blocked);
    console.error(`Prompt validation failed: ${errors.join('; ')}`);
    process.exit(1);
  }

  const draft = buildDraft({ prompt, now: nowArg });
  const schedule = evaluateSchedule(draft.publishAt, nowArg);
  const targetPath = path.resolve(projectRoot, draft.outputPath);
  await fs.writeFile(targetPath, draft.markdown, 'utf8');

  const audit = {
    status: schedule.previewReady ? 'preview-ready' : 'scheduled',
    prompt: promptPathArg,
    draftPath: draft.outputPath,
    slug: draft.slug,
    title: draft.title,
    schedule,
    prAction: modeArg === 'mock-pr' ? 'mock-pr-upsert' : 'manual-mode',
    timestamp: nowArg,
  };

  await writeAudit(audit);
  console.log(JSON.stringify(audit, null, 2));
} catch (error) {
  const failed = {
    status: 'failed',
    prompt: promptPathArg,
    error: error instanceof Error ? error.message : String(error),
    timestamp: nowArg,
  };
  await writeAudit(failed);
  console.error(failed.error);
  process.exit(1);
}
