import Parser from 'rss-parser'
import crypto from 'crypto'
import { getDatabase } from './sqlite'

const PODCAST_CATEGORY = 'podcast'
const DEFAULT_AUTHOR = 'Clear View Retreat'
const DEFAULT_AUTHOR_EMAIL = 'admin@clearviewretreat.org'
const SETTINGS_ID = 'main'

export interface PodcastSettings {
  feedUrl: string
  lastSyncedAt: string | null
}

export interface PodcastSyncResult {
  inserted: number
  skipped: number
  error?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getAudioEnclosureUrl(item: Parser.Item): string | null {
  const enc = item.enclosure as { url?: string; type?: string } | undefined
  if (!enc?.url) return null
  const type = (enc.type || '').toLowerCase()
  if (type.startsWith('audio/')) return enc.url
  if (/\.(mp3|m4a|aac|ogg|wav|opus)(\?|$)/i.test(enc.url)) return enc.url
  return null
}

function stableId(guid: string | undefined, link: string | undefined): string {
  const key = (guid || link || '').trim() || crypto.randomUUID()
  const hash = crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)
  return `podcast-${hash}`
}

export function getPodcastSettings(): PodcastSettings {
  const db = getDatabase()
  const row = db.prepare(
    'SELECT feed_url, last_synced_at FROM podcast_feed_settings WHERE id = ?'
  ).get(SETTINGS_ID) as { feed_url: string; last_synced_at: string | null } | undefined

  if (!row) {
    return { feedUrl: '', lastSyncedAt: null }
  }
  return {
    feedUrl: row.feed_url || '',
    lastSyncedAt: row.last_synced_at || null,
  }
}

export function savePodcastFeedUrl(feedUrl: string): void {
  const db = getDatabase()
  const now = new Date().toISOString()
  db.prepare(
    `INSERT INTO podcast_feed_settings (id, feed_url, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET feed_url = excluded.feed_url, updated_at = excluded.updated_at`
  ).run(SETTINGS_ID, feedUrl.trim(), now)
}

export async function syncPodcastFeed(): Promise<PodcastSyncResult> {
  const settings = getPodcastSettings()
  if (!settings.feedUrl) {
    return { inserted: 0, skipped: 0, error: 'No podcast feed URL configured' }
  }

  const parser = new Parser({
    timeout: 15000,
    customFields: {
      item: [
        ['content:encoded', 'contentEncoded'],
        ['itunes:summary', 'itunesSummary'],
        ['itunes:image', 'itunesImage'],
        ['itunes:duration', 'itunesDuration'],
      ],
    },
  })

  let feed: Parser.Output<{ contentEncoded?: string; itunesSummary?: string; itunesImage?: { $?: { href?: string } }; itunesDuration?: string }>
  try {
    feed = await parser.parseURL(settings.feedUrl)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { inserted: 0, skipped: 0, error: `Failed to fetch feed: ${message}` }
  }

  const db = getDatabase()
  const insert = db.prepare(`
    INSERT INTO blog_posts (
      id, title, slug, content, excerpt, main_image, thumbnail,
      author_name, author_email, published, published_at,
      created_at, updated_at, tags, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
  `)
  const getBySlug = db.prepare('SELECT id FROM blog_posts WHERE slug = ?')
  const getById = db.prepare('SELECT id FROM blog_posts WHERE id = ?')

  let inserted = 0
  let skipped = 0
  const now = new Date().toISOString()

  for (const item of feed.items || []) {
    const guid = item.guid || item.link
    const id = stableId(guid, item.link)
    if (!item.title) continue

    const existing = getById.get(id) as { id: string } | undefined
    if (existing) {
      skipped++
      continue
    }

    const pubDate = item.pubDate ? (item.isoDate || new Date(item.pubDate).toISOString()) : now
    const dateStr = pubDate.slice(0, 10)
    let slug = `${slugify(item.title)}-${dateStr}`
    let suffix = 0
    while (getBySlug.get(slug)) {
      suffix++
      slug = `${slugify(item.title)}-${dateStr}-${suffix}`
    }

    const textContent = item.contentEncoded || item.content || item.contentSnippet || item.itunesSummary || ''
    const excerpt = (item.contentSnippet || item.itunesSummary || textContent.slice(0, 300)).slice(0, 500)
    const imageHref = typeof item.itunesImage === 'object' && item.itunesImage?.$?.href
      ? item.itunesImage.$.href
      : (item.enclosure?.url && /\.(jpg|jpeg|png|gif|webp)/i.test(item.enclosure.url) ? item.enclosure.url : null)

    const audioUrl = getAudioEnclosureUrl(item)
    const audioBlock = audioUrl
      ? `<div class="podcast-audio mb-6"><audio controls preload="metadata" style="width:100%;max-width:600px;" src="${escapeHtml(audioUrl)}">Your browser does not support the audio element. <a href="${escapeHtml(audioUrl)}">Download episode</a>.</audio></div>\n\n`
      : ''
    const content = audioBlock + (textContent || excerpt || '(No content)')

    insert.run(
      id,
      item.title,
      slug,
      content || excerpt || '(No content)',
      excerpt,
      imageHref,
      imageHref,
      DEFAULT_AUTHOR,
      DEFAULT_AUTHOR_EMAIL,
      pubDate,
      pubDate,
      pubDate,
      JSON.stringify([]),
      PODCAST_CATEGORY
    )
    inserted++
  }

  if (inserted > 0 || skipped >= 0) {
    db.prepare(
      'UPDATE podcast_feed_settings SET last_synced_at = ?, updated_at = ? WHERE id = ?'
    ).run(now, now, SETTINGS_ID)
  }

  return { inserted, skipped }
}
