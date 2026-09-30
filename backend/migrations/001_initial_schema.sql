-- Migration 001: Initial schema for Storii
-- Tables: schema_migrations, users, questions, experiences

-- 1. Schema migrations tracker
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users table (for Google OAuth & local user accounts)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(128) PRIMARY KEY,
  google_id VARCHAR(128) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Questions table
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  category VARCHAR(64) NOT NULL,
  author_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  answer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Experiences (answers) table
CREATE TABLE IF NOT EXISTS experiences (
  id VARCHAR(64) PRIMARY KEY,
  question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  context VARCHAR(255),
  author_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_experiences_question_id ON experiences(question_id);
CREATE INDEX IF NOT EXISTS idx_experiences_author_id ON experiences(author_id);
CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON experiences(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
