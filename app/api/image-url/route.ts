import { NextRequest, NextResponse } from 'next/server'
import { generatePublicUrl } from '@/lib/s3'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageKey = searchParams.get('key')
    
    if (!imageKey) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      )
    }

    // Generate permanent URL using Railway bucket
    const imageUrl = generatePublicUrl(imageKey)
    
    return NextResponse.json({
      success: true,
      url: imageUrl
    })

  } catch (error) {
    console.error('Error generating image URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate image URL' },
      { status: 500 }
    )
  }
}
