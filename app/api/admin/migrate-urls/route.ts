import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

// One-time migration endpoint to update AWS S3 URLs to image proxy URLs
// DELETE THIS FILE AFTER RUNNING THE MIGRATION

function generateRailwayUrl(key: string): string {
  // Use the image proxy API since Railway buckets are private
  return `/api/images/${key}`
}

function replaceAwsUrl(content: string): { updated: string; count: number } {
  let count = 0
  let updated = content

  // Pattern 1: https://bucket.s3.region.amazonaws.com/key
  updated = updated.replace(
    /https:\/\/([a-z0-9-]+)\.s3\.([a-z0-9-]+)\.amazonaws\.com\/([^\s"'<>]+)/gi,
    (match, bucket, region, key) => {
      count++
      return generateRailwayUrl(key)
    }
  )

  // Pattern 2: https://s3.region.amazonaws.com/bucket/key
  updated = updated.replace(
    /https:\/\/s3\.([a-z0-9-]+)\.amazonaws\.com\/([a-z0-9-]+)\/([^\s"'<>]+)/gi,
    (match, region, bucket, key) => {
      count++
      return generateRailwayUrl(key)
    }
  )

  // Pattern 3: Railway bucket direct URLs (convert to proxy)
  // https://bucket-name.t3.storageapi.dev/key
  updated = updated.replace(
    /https:\/\/([a-z0-9-]+)\.t3\.storageapi\.dev\/([^\s"'<>]+)/gi,
    (match, bucket, key) => {
      count++
      return generateRailwayUrl(key)
    }
  )

  return { updated, count }
}

export async function POST(request: NextRequest) {
  // Simple security: require a secret key
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  if (secret !== 'migrate-to-railway-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDatabase()
    let totalUpdated = 0
    const results: string[] = []

    // Update website_content table
    const contentRows = db.prepare('SELECT id, content FROM website_content').all() as { id: string; content: string }[]
    const updateContentStmt = db.prepare('UPDATE website_content SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    
    for (const row of contentRows) {
      const { updated, count } = replaceAwsUrl(row.content)
      if (count > 0) {
        updateContentStmt.run(updated, row.id)
        totalUpdated += count
        results.push(`website_content ${row.id}: ${count} URLs`)
      }
    }

    // Update blog_posts table
    const blogRows = db.prepare('SELECT id, title, content, main_image, thumbnail FROM blog_posts').all() as {
      id: string
      title: string
      content: string
      main_image: string | null
      thumbnail: string | null
    }[]
    
    const updateBlogStmt = db.prepare(`
      UPDATE blog_posts 
      SET content = ?, main_image = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)

    for (const row of blogRows) {
      let rowCount = 0
      const contentResult = replaceAwsUrl(row.content)
      rowCount += contentResult.count

      let mainImage = row.main_image
      let thumbnail = row.thumbnail

      if (mainImage) {
        const result = replaceAwsUrl(mainImage)
        mainImage = result.updated
        rowCount += result.count
      }

      if (thumbnail) {
        const result = replaceAwsUrl(thumbnail)
        thumbnail = result.updated
        rowCount += result.count
      }

      if (rowCount > 0) {
        updateBlogStmt.run(contentResult.updated, mainImage, thumbnail, row.id)
        totalUpdated += rowCount
        results.push(`blog_posts "${row.title}": ${rowCount} URLs`)
      }
    }

    return NextResponse.json({
      success: true,
      totalUpdated,
      details: results,
      note: 'URLs now use /api/images/ proxy'
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'check-categories') {
    try {
      const db = getDatabase()
      const categories = db.prepare('SELECT * FROM categories').all()
      const blogPosts = db.prepare('SELECT id, title, slug, category, published, main_image, created_at FROM blog_posts ORDER BY created_at DESC').all()
      return NextResponse.json({ categories, blogPosts, count: blogPosts.length })
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }
  }
  
  if (action === 'check-latest-post') {
    try {
      const db = getDatabase()
      const latestPost = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 1').get()
      return NextResponse.json({ latestPost })
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }
  }
  
  if (action === 'add-default-category') {
    try {
      const db = getDatabase()
      const existing = db.prepare('SELECT * FROM categories WHERE slug = ?').get('general')
      if (!existing) {
        db.prepare(`
          INSERT INTO categories (id, name, slug, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          'cat-default-general',
          'General',
          'general',
          'General blog posts',
          new Date().toISOString(),
          new Date().toISOString()
        )
      }
      const categories = db.prepare('SELECT * FROM categories').all()
      return NextResponse.json({ success: true, categories })
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }
  }
  
  return NextResponse.json({
    message: 'POST to this endpoint with ?secret=migrate-to-railway-2024 to run the migration',
    actions: [
      'GET ?action=check-categories - Check categories and blog posts',
      'GET ?action=check-latest-post - Check the latest blog post details',
      'GET ?action=add-default-category - Add default General category'
    ],
    warning: 'DELETE THIS FILE AFTER MIGRATION'
  })
}

