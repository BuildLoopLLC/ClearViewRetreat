import { NextRequest, NextResponse } from 'next/server'
import { s3Client, S3_CONFIG, generateS3Key, generatePublicUrl, deleteS3Object } from '@/lib/s3'
import { PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const FILES_FOLDER = 'files' // General files folder

// GET - List files with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const prefix = searchParams.get('prefix') || FILES_FOLDER

    // List objects in S3
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000, // Get more to calculate total
    })

    const response = await s3Client.send(command)
    const allObjects = (response.Contents || []).filter(obj => obj.Key && !obj.Key.endsWith('/'))
    
    // Sort by last modified (newest first)
    allObjects.sort((a, b) => {
      const aTime = a.LastModified?.getTime() || 0
      const bTime = b.LastModified?.getTime() || 0
      return bTime - aTime
    })

    const total = allObjects.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedObjects = allObjects.slice(startIndex, endIndex)

    // Format file data
    const files = paginatedObjects.map(obj => {
      const key = obj.Key || ''
      const fileName = key.split('/').pop() || key
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''
      
      return {
        key,
        name: fileName,
        url: generatePublicUrl(key),
        size: obj.Size || 0,
        lastModified: obj.LastModified?.toISOString() || new Date().toISOString(),
        extension: fileExtension,
        contentType: getContentType(fileExtension)
      }
    })

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB for general files)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'bin'
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${uuidv4()}_${originalName}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate S3 key
    const s3Key = generateS3Key(FILES_FOLDER, fileName)

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type || getContentType(fileExtension),
      CacheControl: 'max-age=31536000', // 1 year
    })

    await s3Client.send(command)

    // Generate public URL
    const fileUrl = generatePublicUrl(s3Key)

    return NextResponse.json({
      success: true,
      url: fileUrl,
      key: s3Key,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      contentType: file.type || getContentType(fileExtension)
    })

  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// DELETE - Delete file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      )
    }

    // Delete from S3
    await deleteS3Object(key)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

// Helper function to determine content type from extension
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'txt': 'text/plain',
    'csv': 'text/csv',
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    // Video
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
  }

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream'
}

