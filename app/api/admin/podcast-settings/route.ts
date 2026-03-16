import { NextRequest, NextResponse } from 'next/server'
import { getPodcastSettings, savePodcastFeedUrl } from '@/lib/podcast-feed'

export async function GET() {
  try {
    const settings = getPodcastSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching podcast settings:', error)
    return NextResponse.json(
      { error: 'Failed to load podcast settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const feedUrl = typeof body.feedUrl === 'string' ? body.feedUrl.trim() : ''
    savePodcastFeedUrl(feedUrl)
    const settings = getPodcastSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving podcast settings:', error)
    return NextResponse.json(
      { error: 'Failed to save podcast settings' },
      { status: 500 }
    )
  }
}
