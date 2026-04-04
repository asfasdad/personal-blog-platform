type RuntimeLocals = {
  runtime?: {
    env?: {
      SESSION?: KVNamespace;
      BLOG_KV?: KVNamespace;
    };
  };
};

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  draft: boolean;
  pubDatetime: string;
  updatedAt: string;
};

export type AdminSettings = {
  siteTitle: string;
  siteDescription: string;
  authorName: string;
  authorBio: string;
  githubUrl: string;
  twitterUrl: string;
  enableComments: boolean;
  enableRss: boolean;
  enableSearch: boolean;
  enableNewsletter: boolean;
  googleAnalytics: string;
  cloudflareAnalytics: string;
  updatedAt: string;
};

export type AdminMedia = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

type MemoryStore = {
  posts: AdminPost[];
  settings: AdminSettings | null;
  media: AdminMedia[];
};

const DEFAULT_SETTINGS: Omit<AdminSettings, "updatedAt"> = {
  siteTitle: "Personal Blog",
  siteDescription: "A modern personal blog",
  authorName: "Author",
  authorBio: "",
  githubUrl: "",
  twitterUrl: "",
  enableComments: true,
  enableRss: true,
  enableSearch: true,
  enableNewsletter: false,
  googleAnalytics: "",
  cloudflareAnalytics: "",
};

const KEYS = {
  posts: "admin:posts",
  settings: "admin:settings",
  media: "admin:media",
} as const;

declare global {
  var __ADMIN_MEMORY_STORE__: MemoryStore | undefined;
}

const now = () => new Date().toISOString();

const toId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getKv = (locals?: RuntimeLocals): KVNamespace | null => {
  try {
    return locals?.runtime?.env?.BLOG_KV ?? locals?.runtime?.env?.SESSION ?? null;
  } catch (error) {
    void error;
    return null;
  }
};

const getMemoryStore = (): MemoryStore => {
  if (!globalThis.__ADMIN_MEMORY_STORE__) {
    globalThis.__ADMIN_MEMORY_STORE__ = {
      posts: [],
      settings: null,
      media: [],
    };
  }
  return globalThis.__ADMIN_MEMORY_STORE__;
};

const readJson = async <T>(kv: KVNamespace | null, key: string, fallback: T): Promise<T> => {
  if (!kv) {
    return fallback;
  }
  const raw = await kv.get(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = async (kv: KVNamespace | null, key: string, value: unknown): Promise<void> => {
  if (!kv) {
    return;
  }
  await kv.put(key, JSON.stringify(value));
};

export const listPosts = async (locals?: RuntimeLocals): Promise<AdminPost[]> => {
  const kv = getKv(locals);
  if (!kv) {
    return getMemoryStore().posts;
  }
  const items = await readJson<AdminPost[]>(kv, KEYS.posts, []);
  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
};

export const getPost = async (locals: RuntimeLocals | undefined, id: string): Promise<AdminPost | null> => {
  const posts = await listPosts(locals);
  return posts.find(post => post.id === id || post.slug === id) ?? null;
};

export const createPost = async (
  locals: RuntimeLocals | undefined,
  input: Omit<AdminPost, "id" | "updatedAt" | "pubDatetime">
): Promise<AdminPost> => {
  const kv = getKv(locals);
  const posts = await listPosts(locals);
  const created: AdminPost = {
    ...input,
    id: toId(),
    pubDatetime: now(),
    updatedAt: now(),
  };
  const next = [created, ...posts.filter(post => post.slug !== created.slug)];

  if (kv) {
    await writeJson(kv, KEYS.posts, next);
  } else {
    getMemoryStore().posts = next;
  }

  return created;
};

export const updatePost = async (
  locals: RuntimeLocals | undefined,
  id: string,
  patch: Partial<Omit<AdminPost, "id" | "slug" | "pubDatetime">>
): Promise<AdminPost | null> => {
  const kv = getKv(locals);
  const posts = await listPosts(locals);
  const index = posts.findIndex(post => post.id === id || post.slug === id);
  if (index < 0) {
    return null;
  }

  const current = posts[index];
  const updated: AdminPost = {
    ...current,
    ...patch,
    updatedAt: now(),
  };

  const next = [...posts];
  next[index] = updated;

  if (kv) {
    await writeJson(kv, KEYS.posts, next);
  } else {
    getMemoryStore().posts = next;
  }

  return updated;
};

export const deletePost = async (locals: RuntimeLocals | undefined, id: string): Promise<boolean> => {
  const kv = getKv(locals);
  const posts = await listPosts(locals);
  const next = posts.filter(post => post.id !== id && post.slug !== id);
  if (next.length === posts.length) {
    return false;
  }

  if (kv) {
    await writeJson(kv, KEYS.posts, next);
  } else {
    getMemoryStore().posts = next;
  }
  return true;
};

export const readSettings = async (locals?: RuntimeLocals): Promise<AdminSettings> => {
  const kv = getKv(locals);
  if (!kv) {
    const memory = getMemoryStore();
    return (
      memory.settings ?? {
        ...DEFAULT_SETTINGS,
        updatedAt: now(),
      }
    );
  }

  const settings = await readJson<AdminSettings | null>(kv, KEYS.settings, null);
  return (
    settings ?? {
      ...DEFAULT_SETTINGS,
      updatedAt: now(),
    }
  );
};

export const saveSettings = async (
  locals: RuntimeLocals | undefined,
  patch: Record<string, unknown>
): Promise<AdminSettings> => {
  const kv = getKv(locals);
  const current = await readSettings(locals);
  const toStringValue = (value: unknown, fallback = "") => {
    if (typeof value === "string") {
      return value;
    }
    if (value == null) {
      return fallback;
    }
    return String(value);
  };
  const toBooleanValue = (value: unknown, fallback = false) => {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      return normalized === "true" || normalized === "1" || normalized === "on";
    }
    return fallback;
  };

  const next: AdminSettings = {
    ...current,
    siteTitle: toStringValue(patch.siteTitle, current.siteTitle),
    siteDescription: toStringValue(patch.siteDescription, current.siteDescription),
    authorName: toStringValue(patch.authorName, current.authorName),
    authorBio: toStringValue(patch.authorBio, current.authorBio),
    githubUrl: toStringValue(patch.githubUrl, current.githubUrl),
    twitterUrl: toStringValue(patch.twitterUrl, current.twitterUrl),
    enableComments: toBooleanValue(patch.enableComments, current.enableComments),
    enableRss: toBooleanValue(patch.enableRss, current.enableRss),
    enableSearch: toBooleanValue(patch.enableSearch, current.enableSearch),
    enableNewsletter: toBooleanValue(patch.enableNewsletter, current.enableNewsletter),
    googleAnalytics: toStringValue(patch.googleAnalytics, current.googleAnalytics),
    cloudflareAnalytics: toStringValue(patch.cloudflareAnalytics, current.cloudflareAnalytics),
    updatedAt: now(),
  };

  if (kv) {
    await writeJson(kv, KEYS.settings, next);
  } else {
    getMemoryStore().settings = next;
  }
  return next;
};

export const listMedia = async (locals?: RuntimeLocals): Promise<AdminMedia[]> => {
  const kv = getKv(locals);
  if (!kv) {
    return getMemoryStore().media;
  }
  const items = await readJson<AdminMedia[]>(kv, KEYS.media, []);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

export const addMedia = async (
  locals: RuntimeLocals | undefined,
  input: Omit<AdminMedia, "id" | "createdAt">
): Promise<AdminMedia> => {
  const kv = getKv(locals);
  const media = await listMedia(locals);
  const created: AdminMedia = {
    ...input,
    id: toId(),
    createdAt: now(),
  };
  const next = [created, ...media];

  if (kv) {
    await writeJson(kv, KEYS.media, next);
  } else {
    getMemoryStore().media = next;
  }

  return created;
};

export const removeMedia = async (locals: RuntimeLocals | undefined, id: string): Promise<boolean> => {
  const kv = getKv(locals);
  const media = await listMedia(locals);
  const next = media.filter(item => item.id !== id);
  if (next.length === media.length) {
    return false;
  }

  if (kv) {
    await writeJson(kv, KEYS.media, next);
  } else {
    getMemoryStore().media = next;
  }
  return true;
};

export const buildStats = async (locals?: RuntimeLocals) => {
  const posts = await listPosts(locals);
  const published = posts.filter(post => !post.draft).length;
  const drafts = posts.filter(post => post.draft).length;
  const thisMonth = posts.filter(post => {
    const postDate = new Date(post.pubDatetime);
    const current = new Date();
    return postDate.getFullYear() === current.getFullYear() && postDate.getMonth() === current.getMonth();
  }).length;

  return {
    totalPosts: posts.length,
    publishedPosts: published,
    draftPosts: drafts,
    thisMonth,
  };
};
