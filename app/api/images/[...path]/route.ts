import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

// Railway bucket client
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'cvr-bucket'

// Cache for 1 year (images don't change)
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    
    if (!imagePath) {
      return NextResponse.json({ error: 'Image path required' }, { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imagePath,
    })

    const response = await s3Client.send(command)
    
    if (!response.Body) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const buffer = await streamToBuffer(response.Body as Readable)
    
    // Determine content type
    const contentType = response.ContentType || 'image/jpeg'
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': CACHE_CONTROL,
        'Content-Length': buffer.length.toString(),
      },
    })
    
  } catch (error: any) {
    console.error('Image proxy error:', error)
    
    if (error.name === 'NoSuchKey') {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}

