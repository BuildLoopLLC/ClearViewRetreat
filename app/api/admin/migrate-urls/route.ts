import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

// One-time migration endpoint to update AWS S3 URLs to Railway bucket URLs
// DELETE THIS FILE AFTER RUNNING THE MIGRATION

const RAILWAY_ENDPOINT = process.env.AWS_ENDPOINT_URL || ''
const RAILWAY_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'cvr-bucket'

function generateRailwayUrl(key: string): string {
  try {
    const endpointUrl = new URL(RAILWAY_ENDPOINT)
    return `${endpointUrl.protocol}//${RAILWAY_BUCKET_NAME}.${endpointUrl.host}/${key}`
  } catch {
    return `${RAILWAY_ENDPOINT}/${RAILWAY_BUCKET_NAME}/${key}`
  }
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
      railwayBucket: `${RAILWAY_BUCKET_NAME}.${new URL(RAILWAY_ENDPOINT).host}`
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
  return NextResponse.json({
    message: 'POST to this endpoint with ?secret=migrate-to-railway-2024 to run the migration',
    warning: 'DELETE THIS FILE AFTER MIGRATION'
  })
}

