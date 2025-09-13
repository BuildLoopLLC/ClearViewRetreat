import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// S3 bucket configuration
export const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'clearviewretreat',
  REGION: process.env.AWS_REGION || 'us-east-1',
  FOLDERS: {
    IMAGES: 'images',
    GALLERIES: 'galleries',
    BLOG_POSTS: 'blog-posts',
    EVENTS: 'events',
  } as const,
} as const

// Generate presigned URL for uploads
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

// Generate presigned URL for downloads
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_CONFIG.BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

// Delete object from S3
export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_CONFIG.BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

// Generate S3 key for different content types
export function generateS3Key(
  folder: string,
  filename: string,
  prefix?: string
): string {
  const timestamp = Date.now()
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  if (prefix) {
    return `${folder}/${prefix}/${timestamp}_${cleanFilename}`
  }
  
  return `${folder}/${timestamp}_${cleanFilename}`
}
