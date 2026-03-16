import { NextRequest, NextResponse } from 'next/server'
import { syncPodcastFeed } from '@/lib/podcast-feed'

/**
 * Cron endpoint for hourly podcast RSS sync.
 * Call this URL every hour (e.g. via cron-job.org, Railway cron, or Vercel Cron).
 *
 * Secured by CRON_SECRET: pass it as query param or header:
 *   GET /api/cron/podcast-sync?secret=YOUR_CRON_SECRET
 *   or Header: Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const provided =
      request.nextUrl.searchParams.get('secret') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const result = await syncPodcastFeed()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Cron podcast sync error:', error)
    return NextResponse.json(
      {
        inserted: 0,
        skipped: 0,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    )
  }
}
