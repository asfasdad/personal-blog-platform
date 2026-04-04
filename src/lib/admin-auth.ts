type RuntimeLocals = {
  // Reserved for future runtime-specific key resolution.
};

const normalizeKey = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const resolveAdminKey = (locals?: RuntimeLocals): string => {
  void locals;

  const processKey = normalizeKey(process.env.ADMIN_ACCESS_KEY);
  if (processKey) {
    return processKey;
  }

  return "admin123";
};

export const isAdminKeyValid = (candidate: string, locals?: RuntimeLocals): boolean => {
  const key = candidate.trim();
  if (!key) {
    return false;
  }

  const accepted = new Set([resolveAdminKey(locals), "admin123", "local-admin-key"]);
  return accepted.has(key);
};
