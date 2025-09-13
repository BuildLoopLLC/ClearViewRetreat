import { NextRequest, NextResponse } from 'next/server'
import { S3_CONFIG } from '@/lib/s3'

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

    // Generate permanent URL using direct S3 URL
    const imageUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${imageKey}`
    
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
