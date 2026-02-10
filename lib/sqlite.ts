import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// SQLite database configuration and initialization
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

  // Create events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('family-camp', 'marriage-retreat', 'ministry-event', 'grieving-retreat', 'family-mission-trip', 'special-event')),
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      description TEXT,
      max_attendees INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create blocked_dates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blocked_dates (
      id TEXT PRIMARY KEY,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create registrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      phone TEXT,
      num_attendees INTEGER DEFAULT 1,
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `)

  // Create gallery_images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      gallery_type TEXT NOT NULL CHECK (gallery_type IN ('retreat-center', 'events', 'nature', 'community', 'cabins')),
      title TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      category TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create staff_members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      bio TEXT,
      image_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create email_settings table (SMTP configuration)
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      smtp_host TEXT,
      smtp_port INTEGER DEFAULT 587,
      smtp_secure INTEGER DEFAULT 0,
      smtp_user TEXT,
      smtp_password TEXT,
      from_email TEXT,
      from_name TEXT DEFAULT 'Clear View Retreat',
      reply_to TEXT,
      is_configured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create email_notification_settings table (what triggers notifications)
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_notification_settings (
      id TEXT PRIMARY KEY,
      notification_type TEXT NOT NULL CHECK (notification_type IN ('event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form')),
      is_enabled INTEGER DEFAULT 1,
      send_to_admin INTEGER DEFAULT 1,
      send_to_user INTEGER DEFAULT 0,
      admin_subject_template TEXT,
      user_subject_template TEXT,
      admin_body_template TEXT,
      user_body_template TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create email_recipients table (which admins get notifications)
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_recipients (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      notification_types TEXT NOT NULL DEFAULT '["event_registration","contact_form","newsletter_signup","volunteer_form"]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create contact_submissions table (store form submissions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      newsletter_opt_in INTEGER DEFAULT 0,
      status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create newsletter_subscribers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      source TEXT DEFAULT 'website',
      is_active INTEGER DEFAULT 1,
      subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      unsubscribed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create registration_event_types table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registration_event_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      form_link TEXT,
      pdf_link TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
    CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
    CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
    CREATE INDEX IF NOT EXISTS idx_blocked_dates_start ON blocked_dates(start_date);
    CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(user_email);
    CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery_images(gallery_type);
    CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
    CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(order_index);
    CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_images(is_active);
    CREATE INDEX IF NOT EXISTS idx_staff_order ON staff_members(order_index);
    CREATE INDEX IF NOT EXISTS idx_staff_active ON staff_members(is_active);
    CREATE INDEX IF NOT EXISTS idx_email_notification_type ON email_notification_settings(notification_type);
    CREATE INDEX IF NOT EXISTS idx_email_recipients_active ON email_recipients(is_active);
    CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
    CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
    CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);
    CREATE INDEX IF NOT EXISTS idx_registration_types_order ON registration_event_types(order_index);
    CREATE INDEX IF NOT EXISTS idx_registration_types_active ON registration_event_types(is_active);
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
