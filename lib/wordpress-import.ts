/**
 * Shared WordPress WXR import logic for blog posts.
 * Used by the CLI script and the admin import API.
 */

import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { getDatabase } from './sqlite'

const AUTHOR_EMAIL_MAP: Record<string, string> = {
  webstervilledesign: 'jody@websterville.net',
  thenestles: 'thenestles@intentionalintimacy.org',
}

const DEFAULT_AUTHOR_EMAIL = 'admin@clearviewretreat.org'

function parseWxr(xml: string): Record<string, unknown> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    trimValues: true,
    parseTagValue: false,
  })
  return parser.parse(xml) as Record<string, unknown>
}

function getChannelItems(parsed: Record<string, unknown>): unknown[] {
  const rss = parsed?.rss as Record<string, unknown> | undefined
  const channel = rss?.channel as Record<string, unknown> | undefined
  if (!channel) return []
  const item = channel.item
  if (!item) return []
  return Array.isArray(item) ? item : [item]
}

function getText(el: unknown): string {
  if (el == null) return ''
  if (typeof el === 'string') return el
  if (typeof el === 'object' && '#text' in el) return String((el as { '#text'?: string })['#text'] ?? '')
  return ''
}

function getFirstCategorySlug(categories: unknown): string {
  if (!categories) return 'uncategorized'
  const arr = Array.isArray(categories) ? categories : [categories]
  let fallback = 'uncategorized'
  for (const c of arr) {
    const obj = c as { '@_domain'?: string; '@_nicename'?: string }
    if (obj?.['@_domain'] !== 'category' || !obj?.['@_nicename']) continue
    const slug = String(obj['@_nicename'])
    if (slug !== 'uncategorized') return slug
    fallback = slug
  }
  return fallback
}

function isPodcastPost(title: string, slug: string, content: string): boolean {
  const t = title.toLowerCase()
  const s = slug.toLowerCase()
  const body = content.toLowerCase()
  if (t.includes('five minute family') || t.includes('five minute devotional')) return true
  if (s.startsWith('fmf-') || s.includes('fmf-')) return true
  if (body.includes('player.captivate.fm') || body.includes('captivate.fm/episode')) return true
  if (body.includes('simplecast.fm') || (body.includes('podcast') && body.includes('embed'))) return true
  return false
}

function getTagNames(categories: unknown): string[] {
  if (!categories) return []
  const arr = Array.isArray(categories) ? categories : [categories]
  const tags: string[] = []
  for (const c of arr) {
    const obj = c as { '@_domain'?: string; '#text'?: string }
    if (obj?.['@_domain'] === 'post_tag') {
      const name = obj['#text'] ?? (obj as { '@_nicename'?: string })['@_nicename']
      if (name) tags.push(String(name))
    }
  }
  return tags
}

function wpDateToIso(dateStr: string): string | null {
  if (!dateStr || dateStr.startsWith('0000-00-00')) return null
  const d = new Date(dateStr + 'Z')
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

function ensureCategoriesInFile(usedSlugs: Set<string>, categoriesFilePath: string): number {
  const defaultColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
  ]
  const slugToName: Record<string, string> = {
    blog: 'Blog',
    'prayer-requests': 'Prayer requests',
    uncategorized: 'Uncategorized',
    relationships: 'Relationships',
    podcast: 'Podcast',
  }
  let categories: { id: string; name: string; slug: string; description: string; color: string; createdAt: string; updatedAt: string }[] = []
  if (fs.existsSync(categoriesFilePath)) {
    try {
      categories = JSON.parse(fs.readFileSync(categoriesFilePath, 'utf-8'))
    } catch {
      categories = []
    }
  }
  const existingSlugs = new Set(categories.map((c) => c.slug))
  let added = 0
  let colorIndex = categories.length
  for (const slug of Array.from(usedSlugs)) {
    if (existingSlugs.has(slug)) continue
    const name = slugToName[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    categories.push({
      id: `cat-wp-${slug}-${Date.now()}`,
      name,
      slug,
      description: '',
      color: defaultColors[colorIndex++ % defaultColors.length],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    existingSlugs.add(slug)
    added++
  }
  if (added > 0) {
    fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2))
  }
  return added
}

export interface ImportWordPressResult {
  inserted: number
  skipped: number
  categoriesAdded: number
  totalItems: number
}

/**
 * Parse WordPress WXR XML and import published posts into SQLite.
 * Does not close the database connection (safe for API use).
 */
export function importWordPressXml(xmlContent: string, categoriesFilePath?: string): ImportWordPressResult {
  const parsed = parseWxr(xmlContent)
  const items = getChannelItems(parsed)
  const db = getDatabase()
  const usedCategorySlugs = new Set<string>()
  let inserted = 0
  let skipped = 0

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO blog_posts (
      id, title, slug, content, excerpt, main_image, thumbnail,
      author_name, author_email, published, published_at,
      created_at, updated_at, tags, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const raw of items) {
    const item = raw as Record<string, unknown>
    const postType = getText(item['wp:post_type'])
    const status = getText(item['wp:status'])
    if (postType !== 'post' || status !== 'publish') {
      skipped++
      continue
    }

    const title = getText(item.title)
    const slug = getText(item['wp:post_name']).trim() || null
    if (!title || !slug) {
      skipped++
      continue
    }

    const content = getText(item['content:encoded'])
    const excerpt = getText(item['excerpt:encoded'])

    if (isPodcastPost(title, slug, content)) {
      skipped++
      continue
    }

    const postDateGmt = getText(item['wp:post_date_gmt'])
    const modifiedGmt = getText(item['wp:post_modified_gmt'])
    const created_at = wpDateToIso(postDateGmt) ?? wpDateToIso(getText(item['wp:post_date'])) ?? new Date().toISOString()
    const updated_at = wpDateToIso(modifiedGmt) ?? created_at
    const published_at = created_at

    const categories = item.category
    const categorySlug = getFirstCategorySlug(categories)
    const tags = getTagNames(categories)
    usedCategorySlugs.add(categorySlug)

    const creator = getText(item['dc:creator'])
    const authorName = creator || 'Clear View Retreat'
    const authorEmail = AUTHOR_EMAIL_MAP[creator] ?? DEFAULT_AUTHOR_EMAIL

    const mainImage = extractFirstImageSrc(content) || null
    const thumbnail = mainImage

    const id = `wp-${getText(item['wp:post_id'])}`

    insertStmt.run(
      id,
      title,
      slug,
      content,
      excerpt,
      mainImage,
      thumbnail,
      authorName,
      authorEmail,
      1,
      published_at,
      created_at,
      updated_at,
      JSON.stringify(tags),
      categorySlug
    )
    inserted++
  }

  const filePath = categoriesFilePath ?? path.join(process.cwd(), 'data', 'categories.json')
  const categoriesAdded = ensureCategoriesInFile(usedCategorySlugs, filePath)

  return {
    inserted,
    skipped,
    categoriesAdded,
    totalItems: items.length,
  }
}
