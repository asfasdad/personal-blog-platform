-- Blog CMS D1 Database Schema
-- Database: blog-cms-db (c3c9706e-2b4b-4a1d-853a-6e4d9b999af9)

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array string e.g. '["astro","cloudflare"]'
  author TEXT DEFAULT 'Author Name',
  draft INTEGER DEFAULT 1, -- 0 = published, 1 = draft
  featured INTEGER DEFAULT 0,
  pub_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_datetime DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
