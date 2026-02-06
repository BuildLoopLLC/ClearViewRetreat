import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { s3Client, S3_CONFIG, generateS3Key, generatePublicUrl } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp
    const image = sharp(buffer)
    const metadata = await image.metadata()

    // Resize main image if too large (max 1920px width)
    let processedImage = image
    if (metadata.width && metadata.width > 1920) {
      processedImage = image.resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
    }

    // Process main image
    const mainImageBuffer = await processedImage
      .jpeg({ quality: 85 })
      .toBuffer()

    // Generate thumbnail (300x200, cropped to center)
    const thumbnailBuffer = await image
      .resize(300, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer()

    // Determine folder based on type
    let folder: string = S3_CONFIG.FOLDERS.IMAGES
    if (type === 'blog-main-image') {
      folder = S3_CONFIG.FOLDERS.BLOG_POSTS
    } else if (type === 'event-image') {
      folder = S3_CONFIG.FOLDERS.EVENTS
    } else if (type === 'gallery-image') {
      folder = S3_CONFIG.FOLDERS.GALLERIES
    }

    // Generate S3 keys
    const mainImageKey = generateS3Key(folder, fileName)
    const thumbnailKey = generateS3Key(folder, `thumb_${fileName}`)

    // Upload main image to S3
    const mainImageCommand = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: mainImageKey,
      Body: mainImageBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000', // 1 year
    })

    // Upload thumbnail to S3
    const thumbnailCommand = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000', // 1 year
    })

    // Execute uploads
    await Promise.all([
      s3Client.send(mainImageCommand),
      s3Client.send(thumbnailCommand)
    ])

    // Generate permanent URLs using Railway bucket URLs
    const imageUrl = generatePublicUrl(mainImageKey)
    const thumbnailUrl = generatePublicUrl(thumbnailKey)


    return NextResponse.json({
      success: true,
      url: imageUrl,
      thumbnailUrl: thumbnailUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      }
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle DELETE requests to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('imageUrl')
    const thumbnailUrl = searchParams.get('thumbnailUrl')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Extract S3 keys from URLs (handles both Railway and legacy AWS URLs)
    const extractS3Key = (url: string) => {
      try {
        const urlObj = new URL(url)
        // Railway URL: https://bucket.endpoint/key or https://endpoint/bucket/key
        // AWS URL: https://bucket.s3.region.amazonaws.com/key
        const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname
        return pathname
      } catch {
        // Fallback for malformed URLs
        const urlParts = url.split('/')
        return urlParts.slice(3).join('/')
      }
    }

    const mainImageKey = extractS3Key(imageUrl)
    const thumbnailKey = thumbnailUrl ? extractS3Key(thumbnailUrl) : null

    // Delete from S3
    const { deleteS3Object } = await import('@/lib/s3')
    
    try {
      await deleteS3Object(mainImageKey)
      if (thumbnailKey) {
        await deleteS3Object(thumbnailKey)
      }
    } catch (error) {
      console.log('File not found or already deleted:', error)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}