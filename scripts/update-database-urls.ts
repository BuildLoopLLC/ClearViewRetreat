/**
 * Database URL Update Script: AWS S3 to Railway Bucket
 * 
 * This script updates all AWS S3 URLs in the database to point to the Railway bucket.
 * Run this AFTER running the migrate-s3-to-railway.ts script.
 * 
 * Usage: npx tsx scripts/update-database-urls.ts
 */

import Database from 'better-sqlite3'
import path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Database path
const DB_PATH = path.join(process.cwd(), 'data', 'website.db')

// AWS S3 URL patterns to replace
const AWS_S3_PATTERNS = [
  // Standard S3 URL format: https://bucket.s3.region.amazonaws.com/key
  /https:\/\/([a-z0-9-]+)\.s3\.([a-z0-9-]+)\.amazonaws\.com\//g,
  // Alternative S3 URL format: https://s3.region.amazonaws.com/bucket/key
  /https:\/\/s3\.([a-z0-9-]+)\.amazonaws\.com\/([a-z0-9-]+)\//g,
]

// Railway bucket configuration (uses Railway's injected variables)
const RAILWAY_ENDPOINT = process.env.AWS_ENDPOINT_URL || ''
const RAILWAY_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'cvr-bucket'

interface UpdateStats {
  tablesProcessed: number
  rowsScanned: number
  urlsUpdated: number
  errors: string[]
}

// Generate Railway bucket URL from key
function generateRailwayUrl(key: string): string {
  try {
    const endpointUrl = new URL(RAILWAY_ENDPOINT)
    return `${endpointUrl.protocol}//${RAILWAY_BUCKET_NAME}.${endpointUrl.host}/${key}`
  } catch {
    // Fallback if endpoint URL is invalid
    return `${RAILWAY_ENDPOINT}/${RAILWAY_BUCKET_NAME}/${key}`
  }
}

// Replace AWS S3 URL with Railway bucket URL
function replaceAwsUrl(content: string): { updated: string; count: number } {
  let count = 0
  let updated = content

  // Pattern 1: https://bucket.s3.region.amazonaws.com/key
  updated = updated.replace(
    /https:\/\/([a-z0-9-]+)\.s3\.([a-z0-9-]+)\.amazonaws\.com\/([^\s"'<>]+)/g,
    (match, bucket, region, key) => {
      count++
      return generateRailwayUrl(key)
    }
  )

  // Pattern 2: https://s3.region.amazonaws.com/bucket/key
  updated = updated.replace(
    /https:\/\/s3\.([a-z0-9-]+)\.amazonaws\.com\/([a-z0-9-]+)\/([^\s"'<>]+)/g,
    (match, region, bucket, key) => {
      count++
      return generateRailwayUrl(key)
    }
  )

  return { updated, count }
}

// Update website_content table
function updateWebsiteContent(db: Database.Database, stats: UpdateStats): void {
  console.log('\n📝 Updating website_content table...')
  
  try {
    const rows = db.prepare('SELECT id, content FROM website_content').all() as { id: string; content: string }[]
    stats.rowsScanned += rows.length

    const updateStmt = db.prepare('UPDATE website_content SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')

    for (const row of rows) {
      const { updated, count } = replaceAwsUrl(row.content)
      if (count > 0) {
        updateStmt.run(updated, row.id)
        stats.urlsUpdated += count
        console.log(`   ✅ Updated ${count} URL(s) in content ID: ${row.id}`)
      }
    }
  } catch (error) {
    const errorMsg = `Failed to update website_content: ${error instanceof Error ? error.message : 'Unknown error'}`
    stats.errors.push(errorMsg)
    console.error(`   ❌ ${errorMsg}`)
  }
}

// Update blog_posts table
function updateBlogPosts(db: Database.Database, stats: UpdateStats): void {
  console.log('\n📝 Updating blog_posts table...')
  
  try {
    const rows = db.prepare('SELECT id, title, content, main_image, thumbnail FROM blog_posts').all() as {
      id: string
      title: string
      content: string
      main_image: string | null
      thumbnail: string | null
    }[]
    stats.rowsScanned += rows.length

    const updateStmt = db.prepare(`
      UPDATE blog_posts 
      SET content = ?, main_image = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)

    for (const row of rows) {
      let totalCount = 0

      const contentResult = replaceAwsUrl(row.content)
      totalCount += contentResult.count

      let mainImage = row.main_image
      let thumbnail = row.thumbnail

      if (mainImage) {
        const result = replaceAwsUrl(mainImage)
        mainImage = result.updated
        totalCount += result.count
      }

      if (thumbnail) {
        const result = replaceAwsUrl(thumbnail)
        thumbnail = result.updated
        totalCount += result.count
      }

      if (totalCount > 0) {
        updateStmt.run(contentResult.updated, mainImage, thumbnail, row.id)
        stats.urlsUpdated += totalCount
        console.log(`   ✅ Updated ${totalCount} URL(s) in blog post: "${row.title}"`)
      }
    }
  } catch (error) {
    const errorMsg = `Failed to update blog_posts: ${error instanceof Error ? error.message : 'Unknown error'}`
    stats.errors.push(errorMsg)
    console.error(`   ❌ ${errorMsg}`)
  }
}

// Update events table (if it has image fields)
function updateEvents(db: Database.Database, stats: UpdateStats): void {
  console.log('\n📝 Checking events table...')
  
  try {
    // Check if events table has any image-related columns
    const tableInfo = db.prepare("PRAGMA table_info(events)").all() as { name: string }[]
    const hasImageColumn = tableInfo.some(col => 
      col.name.includes('image') || col.name.includes('photo') || col.name.includes('thumbnail')
    )

    if (!hasImageColumn) {
      console.log('   ℹ️  No image columns found in events table')
      return
    }

    const rows = db.prepare('SELECT id, title, description FROM events').all() as {
      id: string
      title: string
      description: string | null
    }[]
    stats.rowsScanned += rows.length

    const updateStmt = db.prepare('UPDATE events SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')

    for (const row of rows) {
      if (row.description) {
        const { updated, count } = replaceAwsUrl(row.description)
        if (count > 0) {
          updateStmt.run(updated, row.id)
          stats.urlsUpdated += count
          console.log(`   ✅ Updated ${count} URL(s) in event: "${row.title}"`)
        }
      }
    }
  } catch (error) {
    const errorMsg = `Failed to update events: ${error instanceof Error ? error.message : 'Unknown error'}`
    stats.errors.push(errorMsg)
    console.error(`   ❌ ${errorMsg}`)
  }
}

// Main function
async function updateDatabaseUrls(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('   Database URL Update: AWS S3 → Railway Bucket')
  console.log('═══════════════════════════════════════════════════════════════')

  // Validate configuration
  if (!RAILWAY_ENDPOINT) {
    console.error('\n❌ RAILWAY_BUCKET_ENDPOINT not configured in .env.local')
    process.exit(1)
  }

  console.log('\n📦 Target: Railway Bucket')
  console.log(`   Bucket: ${RAILWAY_BUCKET_NAME}`)
  console.log(`   Endpoint: ${RAILWAY_ENDPOINT}`)

  const stats: UpdateStats = {
    tablesProcessed: 0,
    rowsScanned: 0,
    urlsUpdated: 0,
    errors: [],
  }

  try {
    // Open database
    console.log(`\n📂 Opening database: ${DB_PATH}`)
    const db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')

    // Create backup
    const backupPath = `${DB_PATH}.backup-${Date.now()}`
    console.log(`\n💾 Creating backup: ${backupPath}`)
    db.backup(backupPath)

    // Update each table
    updateWebsiteContent(db, stats)
    stats.tablesProcessed++

    updateBlogPosts(db, stats)
    stats.tablesProcessed++

    updateEvents(db, stats)
    stats.tablesProcessed++

    // Close database
    db.close()

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('   Update Summary')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`   Tables processed: ${stats.tablesProcessed}`)
    console.log(`   Rows scanned:     ${stats.rowsScanned}`)
    console.log(`   URLs updated:     ${stats.urlsUpdated}`)
    console.log(`   Errors:           ${stats.errors.length}`)

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      for (const error of stats.errors) {
        console.log(`   - ${error}`)
      }
    }

    if (stats.urlsUpdated > 0) {
      console.log('\n🎉 Database URLs updated successfully!')
      console.log(`   Backup saved to: ${backupPath}`)
    } else {
      console.log('\nℹ️  No AWS S3 URLs found in database.')
    }

    console.log('\n📝 Next steps:')
    console.log('   1. Test the website to ensure all images load correctly')
    console.log('   2. Check rich text content in admin panel')
    console.log('   3. Once verified, you can remove the backup file and AWS credentials')

  } catch (error) {
    console.error('\n❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the update
updateDatabaseUrls().catch((error) => {
  console.error('Update error:', error)
  process.exit(1)
})

