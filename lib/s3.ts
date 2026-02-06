import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Railway bucket configuration (uses AWS SDK Generic style variables)
// These are automatically injected by Railway when you connect service to bucket
const BUCKET_ENDPOINT = process.env.AWS_ENDPOINT_URL || ''
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'cvr-bucket'
const BUCKET_REGION = process.env.AWS_DEFAULT_REGION || 'us-east-1'
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || ''
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ''

// Legacy AWS S3 configuration (for migration purposes only)
// Use LEGACY_ prefix to avoid conflicts with Railway's injected variables
const LEGACY_AWS_REGION = process.env.LEGACY_AWS_REGION || 'us-east-1'
const LEGACY_AWS_BUCKET_NAME = process.env.LEGACY_S3_BUCKET_NAME || 'clearviewretreat'
const LEGACY_AWS_ACCESS_KEY_ID = process.env.LEGACY_AWS_ACCESS_KEY_ID || ''
const LEGACY_AWS_SECRET_ACCESS_KEY = process.env.LEGACY_AWS_SECRET_ACCESS_KEY || ''

// Initialize Railway S3-compatible client (primary)
export const s3Client = new S3Client({
  region: BUCKET_REGION,
  endpoint: BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for Railway bucket compatibility
})

// Legacy AWS S3 client (for migration purposes only)
export const awsS3Client = new S3Client({
  region: LEGACY_AWS_REGION,
  credentials: {
    accessKeyId: LEGACY_AWS_ACCESS_KEY_ID,
    secretAccessKey: LEGACY_AWS_SECRET_ACCESS_KEY,
  },
})

// S3 bucket configuration
export const S3_CONFIG = {
  BUCKET_NAME: BUCKET_NAME,
  REGION: BUCKET_REGION,
  ENDPOINT: BUCKET_ENDPOINT,
  // Legacy AWS config for migration
  AWS_BUCKET_NAME: LEGACY_AWS_BUCKET_NAME,
  AWS_REGION: LEGACY_AWS_REGION,
  FOLDERS: {
    IMAGES: 'images',
    GALLERIES: 'galleries',
    BLOG_POSTS: 'blog-posts',
    EVENTS: 'events',
  } as const,
} as const

// Generate public URL for Railway bucket
export function generatePublicUrl(key: string): string {
  // Railway bucket URL format: https://BUCKET_NAME.ENDPOINT_HOST/key
  if (!BUCKET_ENDPOINT) {
    // Fallback for local development without endpoint
    return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`
  }
  const endpointUrl = new URL(BUCKET_ENDPOINT)
  return `${endpointUrl.protocol}//${BUCKET_NAME}.${endpointUrl.host}/${key}`
}

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
