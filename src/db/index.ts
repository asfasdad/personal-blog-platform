/**
 * D1 Database Repository Layer
 *
 * Provides typed CRUD operations for posts, settings, and media
 * stored in Cloudflare D1.
 */

// ─── Types ────────────────────────────────────────────────────────

export interface DbPost {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  tags: string | null; // JSON array string
  author: string;
  draft: number; // 0 | 1
  featured: number; // 0 | 1
  pub_datetime: string;
  mod_datetime: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  slug: string;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  featured?: boolean;
  pubDatetime?: string;
}

export interface UpdatePostInput {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
  modDatetime?: string;
}

export interface DbSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface DbMedia {
  id: number;
  filename: string;
  url: string;
  content_type: string | null;
  size: number | null;
  created_at: string;
}

// ─── D1 Binding Accessor ─────────────────────────────────────────

export function getD1(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime;
  if (!runtime?.env) return null;
  return (runtime.env as Record<string, unknown>).DB as D1Database | null;
}

// ─── R2 Binding Accessor ─────────────────────────────────────────

export function getR2(locals: App.Locals): R2Bucket | null {
  const runtime = locals.runtime;
  if (!runtime?.env) return null;
  return (runtime.env as Record<string, unknown>).MEDIA as R2Bucket | null;
}

// ─── Posts Repository ─────────────────────────────────────────────

export const PostsRepo = {
  async findAll(db: D1Database, opts?: { draft?: boolean; limit?: number; offset?: number }): Promise<DbPost[]> {
    let sql = "SELECT * FROM posts";
    const params: unknown[] = [];

    if (opts?.draft !== undefined) {
      sql += " WHERE draft = ?";
      params.push(opts.draft ? 1 : 0);
    }

    sql += " ORDER BY pub_datetime DESC";

    if (opts?.limit) {
      sql += " LIMIT ?";
      params.push(opts.limit);
    }
    if (opts?.offset) {
      sql += " OFFSET ?";
      params.push(opts.offset);
    }

    const result = await db.prepare(sql).bind(...params).all<DbPost>();
    return result.results;
  },

  async findBySlug(db: D1Database, slug: string): Promise<DbPost | null> {
    const result = await db
      .prepare("SELECT * FROM posts WHERE slug = ?")
      .bind(slug)
      .first<DbPost>();
    return result ?? null;
  },

  async findById(db: D1Database, id: number): Promise<DbPost | null> {
    const result = await db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .bind(id)
      .first<DbPost>();
    return result ?? null;
  },

  async create(db: D1Database, input: CreatePostInput): Promise<DbPost | null> {
    const tagsJson = input.tags ? JSON.stringify(input.tags) : null;
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO posts (slug, title, description, content, tags, author, draft, featured, pub_datetime, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        input.slug,
        input.title,
        input.description ?? null,
        input.content,
        tagsJson,
        input.author ?? "Author Name",
        input.draft ? 1 : 0,
        input.featured ? 1 : 0,
        input.pubDatetime ?? now,
        now,
        now
      )
      .run();

    return PostsRepo.findBySlug(db, input.slug);
  },

  async update(db: D1Database, slug: string, input: UpdatePostInput): Promise<DbPost | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (input.title !== undefined) {
      fields.push("title = ?");
      params.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push("description = ?");
      params.push(input.description);
    }
    if (input.content !== undefined) {
      fields.push("content = ?");
      params.push(input.content);
    }
    if (input.tags !== undefined) {
      fields.push("tags = ?");
      params.push(JSON.stringify(input.tags));
    }
    if (input.draft !== undefined) {
      fields.push("draft = ?");
      params.push(input.draft ? 1 : 0);
    }
    if (input.featured !== undefined) {
      fields.push("featured = ?");
      params.push(input.featured ? 1 : 0);
    }

    const now = new Date().toISOString();
    fields.push("mod_datetime = ?");
    params.push(input.modDatetime ?? now);
    fields.push("updated_at = ?");
    params.push(now);

    params.push(slug);

    await db
      .prepare(`UPDATE posts SET ${fields.join(", ")} WHERE slug = ?`)
      .bind(...params)
      .run();

    return PostsRepo.findBySlug(db, slug);
  },

  async delete(db: D1Database, slug: string): Promise<boolean> {
    const result = await db
      .prepare("DELETE FROM posts WHERE slug = ?")
      .bind(slug)
      .run();
    return result.meta.changes > 0;
  },

  async count(db: D1Database, opts?: { draft?: boolean }): Promise<number> {
    let sql = "SELECT COUNT(*) as count FROM posts";
    const params: unknown[] = [];

    if (opts?.draft !== undefined) {
      sql += " WHERE draft = ?";
      params.push(opts.draft ? 1 : 0);
    }

    const result = await db.prepare(sql).bind(...params).first<{ count: number }>();
    return result?.count ?? 0;
  },

  async countThisMonth(db: D1Database): Promise<number> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const result = await db
      .prepare("SELECT COUNT(*) as count FROM posts WHERE pub_datetime >= ? AND draft = 0")
      .bind(firstDay)
      .first<{ count: number }>();
    return result?.count ?? 0;
  },
};

// ─── Settings Repository ──────────────────────────────────────────

export const SettingsRepo = {
  async get(db: D1Database, key: string): Promise<string | null> {
    const result = await db
      .prepare("SELECT value FROM settings WHERE key = ?")
      .bind(key)
      .first<{ value: string }>();
    return result?.value ?? null;
  },

  async set(db: D1Database, key: string, value: string): Promise<void> {
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?`
      )
      .bind(key, value, now, value, now)
      .run();
  },

  async getAll(db: D1Database): Promise<DbSetting[]> {
    const result = await db.prepare("SELECT * FROM settings").all<DbSetting>();
    return result.results;
  },

  async delete(db: D1Database, key: string): Promise<boolean> {
    const result = await db
      .prepare("DELETE FROM settings WHERE key = ?")
      .bind(key)
      .run();
    return result.meta.changes > 0;
  },
};

// ─── Media Repository ─────────────────────────────────────────────

export const MediaRepo = {
  async findAll(db: D1Database, opts?: { limit?: number; offset?: number }): Promise<DbMedia[]> {
    let sql = "SELECT * FROM media ORDER BY created_at DESC";
    const params: unknown[] = [];

    if (opts?.limit) {
      sql += " LIMIT ?";
      params.push(opts.limit);
    }
    if (opts?.offset) {
      sql += " OFFSET ?";
      params.push(opts.offset);
    }

    const result = await db.prepare(sql).bind(...params).all<DbMedia>();
    return result.results;
  },

  async create(db: D1Database, input: Omit<DbMedia, "id" | "created_at">): Promise<DbMedia | null> {
    const now = new Date().toISOString();
    await db
      .prepare(
        "INSERT INTO media (filename, url, content_type, size, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(input.filename, input.url, input.content_type, input.size, now)
      .run();

    const result = await db
      .prepare("SELECT * FROM media WHERE url = ? ORDER BY id DESC LIMIT 1")
      .bind(input.url)
      .first<DbMedia>();
    return result ?? null;
  },

  async delete(db: D1Database, id: number): Promise<boolean> {
    const result = await db
      .prepare("DELETE FROM media WHERE id = ?")
      .bind(id)
      .run();
    return result.meta.changes > 0;
  },

  async count(db: D1Database): Promise<number> {
    const result = await db
      .prepare("SELECT COUNT(*) as count FROM media")
      .first<{ count: number }>();
    return result?.count ?? 0;
  },
};
