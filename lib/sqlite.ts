import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'website.db')

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Create database connection
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL') // Enable WAL mode for better performance
    initializeDatabase()
  }
  return db
}

// Initialize database schema
function initializeDatabase() {
  if (!db) return

  // Create website_content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS website_content (
      id TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      subsection TEXT,
      content_type TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user TEXT
    )
  `)

  // Create activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      item TEXT NOT NULL,
      section TEXT,
      user TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      details TEXT,
      type TEXT NOT NULL DEFAULT 'content',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create blog_posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      main_image TEXT,
      thumbnail TEXT,
      author_name TEXT NOT NULL,
      author_email TEXT NOT NULL,
      published BOOLEAN DEFAULT 0,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      tags TEXT,
      category TEXT NOT NULL
    )
  `)

  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_section ON website_content(section);
    CREATE INDEX IF NOT EXISTS idx_subsection ON website_content(subsection);
    CREATE INDEX IF NOT EXISTS idx_section_subsection ON website_content(section, subsection);
    CREATE INDEX IF NOT EXISTS idx_active ON website_content(is_active);
    CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
    CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user);
    CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
    CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
    CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
    CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  `)

  console.log('✅ SQLite database initialized')
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

// Helper function to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
