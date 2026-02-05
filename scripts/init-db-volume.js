#!/usr/bin/env node

/**
 * Initialize Railway volume database from git database on first deploy
 * This runs before the Next.js app starts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GIT_DB_PATH = path.join(process.cwd(), 'data', 'website.db');
const VOLUME_DB_PATH = path.join(process.cwd(), 'data', 'website.db');

console.log('🔍 Checking database initialization...');

// Check if we're in Railway with a volume
const hasVolume = process.env.RAILWAY_VOLUME_MOUNT_PATH;
const isRailway = process.env.RAILWAY_ENVIRONMENT;

if (!isRailway) {
  console.log('📍 Running locally - skipping volume initialization');
  process.exit(0);
}

if (!hasVolume) {
  console.log('📍 No volume detected - using git database');
  process.exit(0);
}

console.log('🔧 Railway volume detected at:', process.env.RAILWAY_VOLUME_MOUNT_PATH);

// Check if database exists and has data
const dbExists = fs.existsSync(VOLUME_DB_PATH);
const dbHasData = dbExists && fs.statSync(VOLUME_DB_PATH).size > 0;

if (dbHasData) {
  console.log('✅ Database already initialized in volume');
  
  // Check table count to verify it has data
  try {
    const Database = require('better-sqlite3');
    const db = new Database(VOLUME_DB_PATH, { readonly: true });
    const result = db.prepare('SELECT COUNT(*) as count FROM website_content').get();
    console.log(`📊 Database has ${result.count} content records`);
    db.close();
    process.exit(0);
  } catch (error) {
    console.log('⚠️  Database exists but might be empty, reinitializing...');
  }
}

console.log('📦 Initializing database in volume from git...');

try {
  // Ensure data directory exists
  const dataDir = path.dirname(VOLUME_DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Check if there's a seed database in the deployment
  const seedDbPath = path.join(process.cwd(), '.seed', 'website.db');
  
  if (fs.existsSync(seedDbPath)) {
    // Copy seed database to volume
    fs.copyFileSync(seedDbPath, VOLUME_DB_PATH);
    console.log('✅ Copied seed database to volume');
  } else {
    // Create empty database and let SQLite initialization handle it
    console.log('⚠️  No seed database found - will create empty database');
    console.log('💡 Run migration scripts after deployment to populate data');
  }

  // Verify the copy
  if (fs.existsSync(VOLUME_DB_PATH)) {
    const size = fs.statSync(VOLUME_DB_PATH).size;
    console.log(`✅ Database initialized: ${(size / 1024).toFixed(2)} KB`);
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Failed to initialize database:', error.message);
  process.exit(1);
}

