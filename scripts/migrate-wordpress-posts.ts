/**
 * Migrate WordPress blog posts from WXR export XML to local SQLite.
 * Preserves: publish/created dates, content (HTML), image alt text and captions, categories, tags.
 *
 * Usage:
 *   Local file:  npx tsx scripts/migrate-wordpress-posts.ts /path/to/export.xml
 *   From URL:    npx tsx scripts/migrate-wordpress-posts.ts https://example.com/export.xml
 *   Env var:     WORDPRESS_XML_URL=https://... npx tsx scripts/migrate-wordpress-posts.ts
 */

import fs from 'fs'
import path from 'path'
import { importWordPressXml } from '../lib/wordpress-import'
import { closeDatabase } from '../lib/sqlite'

function isUrl(s: string): boolean {
  return /^https?:\/\//i.test(s)
}

async function loadXmlContent(pathOrUrl: string): Promise<string> {
  if (isUrl(pathOrUrl)) {
    const res = await fetch(pathOrUrl)
    if (!res.ok) throw new Error(`Failed to fetch XML: ${res.status} ${res.statusText}`)
    return res.text()
  }
  return fs.readFileSync(pathOrUrl, 'utf-8')
}

async function main() {
  const pathOrUrl = process.argv[2] || process.env.WORDPRESS_XML_URL || path.join(process.env.HOME || '', 'Downloads', 'clearviewretreat.WordPress.2026-03-12.xml')
  if (!pathOrUrl) {
    console.error('Usage: npx tsx scripts/migrate-wordpress-posts.ts <path-or-url-to-wordpress-export.xml>')
    process.exit(1)
  }
  if (!isUrl(pathOrUrl) && !fs.existsSync(pathOrUrl)) {
    console.error('File not found:', pathOrUrl)
    process.exit(1)
  }

  console.log('Loading WordPress export:', pathOrUrl)
  const xmlContent = await loadXmlContent(pathOrUrl)
  console.log('Parsing and importing...')

  const result = importWordPressXml(xmlContent)
  closeDatabase()

  console.log('Done. Inserted:', result.inserted, 'Skipped:', result.skipped)
  if (result.categoriesAdded > 0) {
    console.log('Added', result.categoriesAdded, 'category/categories to data/categories.json')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
