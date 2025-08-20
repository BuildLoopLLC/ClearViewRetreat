import { NextRequest, NextResponse } from 'next/server'
import { websiteContentOperations } from '@/lib/dynamodb-operations'

// Cache duration: 5 minutes (same as client-side)
const CACHE_DURATION = 5 * 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      )
    }

    const content = await websiteContentOperations.getBySection(section)
    
    // Sort by order
    const sortedContent = content.sort((a, b) => a.order - b.order)
    
    // Create response with caching headers
    const response = NextResponse.json(sortedContent)
    
    // Set cache headers
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`)
    response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_DURATION}`)
    response.headers.set('Vercel-CDN-Cache-Control', `public, max-age=${CACHE_DURATION}`)
    
    return response
  } catch (error: any) {
    console.error('Error fetching website content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    const updates = await request.json()
    
    await websiteContentOperations.update(id, updates)
    
    // Return success response
    const response = NextResponse.json({ success: true })
    
    // Clear cache for the updated section by setting no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('Error updating website content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
