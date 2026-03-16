import { NextResponse } from 'next/server'
import { syncPodcastFeed } from '@/lib/podcast-feed'

export async function POST() {
  try {
    const result = await syncPodcastFeed()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Podcast sync error:', error)
    return NextResponse.json(
      { inserted: 0, skipped: 0, error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
