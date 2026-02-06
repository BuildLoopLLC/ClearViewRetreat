/**
 * Migration Script: AWS S3 to Railway Bucket
 * 
 * This script migrates all content from AWS S3 to Railway's S3-compatible bucket.
 * 
 * Prerequisites:
 * - Set up Railway bucket credentials in .env.local
 * - AWS credentials still configured for source bucket access
 * 
 * Usage: npx tsx scripts/migrate-s3-to-railway.ts
 */

import { 
  S3Client, 
  ListObjectsV2Command, 
  GetObjectCommand, 
  PutObjectCommand 
} from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { Readable } from 'stream'

// Load environment variables
config({ path: '.env.local' })

// AWS S3 configuration (source) - uses LEGACY_ prefix to avoid conflicts
const awsConfig = {
  region: process.env.LEGACY_AWS_REGION || 'us-east-1',
  bucketName: process.env.LEGACY_S3_BUCKET_NAME || 'clearviewretreat',
  accessKeyId: process.env.LEGACY_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.LEGACY_AWS_SECRET_ACCESS_KEY || '',
}

// Railway bucket configuration (destination) - uses Railway's injected variables
// Save the endpoint before we temporarily clear it for AWS client creation
const railwayEndpoint = process.env.AWS_ENDPOINT_URL || ''
const railwayConfig = {
  endpoint: railwayEndpoint,
  bucketName: process.env.AWS_S3_BUCKET_NAME || 'cvr-bucket',
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
}

// Initialize AWS S3 client (source) - connects to actual AWS S3
// Explicitly set the AWS S3 endpoint to override any environment variable
const awsS3Client = new S3Client({
  region: awsConfig.region,
  endpoint: `https://s3.${awsConfig.region}.amazonaws.com`,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
  forcePathStyle: false, // Use virtual-hosted style for AWS
})

// Initialize Railway S3 client (destination)
const railwayS3Client = new S3Client({
  region: railwayConfig.region,
  endpoint: railwayConfig.endpoint,
  credentials: {
    accessKeyId: railwayConfig.accessKeyId,
    secretAccessKey: railwayConfig.secretAccessKey,
  },
  forcePathStyle: true,
})

interface MigrationStats {
  total: number
  successful: number
  failed: number
  skipped: number
  errors: { key: string; error: string }[]
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

// List all objects in AWS S3 bucket
async function listAllAwsObjects(): Promise<string[]> {
  const allKeys: string[] = []
  let continuationToken: string | undefined

  console.log(`\n📋 Listing objects in AWS S3 bucket: ${awsConfig.bucketName}`)

  do {
    const command = new ListObjectsV2Command({
      Bucket: awsConfig.bucketName,
      ContinuationToken: continuationToken,
    })

    const response = await awsS3Client.send(command)
    
    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key) {
          allKeys.push(object.Key)
        }
      }
    }

    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  console.log(`   Found ${allKeys.length} objects to migrate`)
  return allKeys
}

// Copy a single object from AWS S3 to Railway bucket
async function copyObject(key: string): Promise<boolean> {
  try {
    // Get object from AWS S3
    const getCommand = new GetObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    })

    const getResponse = await awsS3Client.send(getCommand)

    if (!getResponse.Body) {
      throw new Error('Empty response body from AWS S3')
    }

    // Convert body stream to buffer
    const body = await streamToBuffer(getResponse.Body as Readable)

    // Put object to Railway bucket
    const putCommand = new PutObjectCommand({
      Bucket: railwayConfig.bucketName,
      Key: key,
      Body: body,
      ContentType: getResponse.ContentType || 'application/octet-stream',
      ContentLength: getResponse.ContentLength,
      CacheControl: getResponse.CacheControl || 'max-age=31536000',
    })

    await railwayS3Client.send(putCommand)
    return true
  } catch (error) {
    throw error
  }
}

// Main migration function
async function migrateS3ToRailway(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('   AWS S3 to Railway Bucket Migration')
  console.log('═══════════════════════════════════════════════════════════════')

  // Validate configuration
  if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
    console.error('\n❌ Legacy AWS credentials not configured. Please set:')
    console.error('   - LEGACY_AWS_ACCESS_KEY_ID')
    console.error('   - LEGACY_AWS_SECRET_ACCESS_KEY')
    console.error('   - LEGACY_S3_BUCKET_NAME')
    console.error('   in .env.local')
    process.exit(1)
  }

  if (!railwayConfig.endpoint || !railwayConfig.accessKeyId || !railwayConfig.secretAccessKey) {
    console.error('\n❌ Railway bucket credentials not configured. Please set:')
    console.error('   - AWS_ENDPOINT_URL')
    console.error('   - AWS_ACCESS_KEY_ID')
    console.error('   - AWS_SECRET_ACCESS_KEY')
    console.error('   (These are auto-injected by Railway when you connect service to bucket)')
    console.error('   in .env.local')
    process.exit(1)
  }

  console.log('\n📦 Source: AWS S3')
  console.log(`   Bucket: ${awsConfig.bucketName}`)
  console.log(`   Region: ${awsConfig.region}`)
  
  console.log('\n📦 Destination: Railway Bucket')
  console.log(`   Bucket: ${railwayConfig.bucketName}`)
  console.log(`   Endpoint: ${railwayConfig.endpoint}`)

  const stats: MigrationStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  try {
    // List all objects to migrate
    const objectKeys = await listAllAwsObjects()
    stats.total = objectKeys.length

    if (objectKeys.length === 0) {
      console.log('\n✅ No objects to migrate. AWS S3 bucket is empty.')
      return
    }

    // Group objects by folder for better logging
    const folders = new Map<string, string[]>()
    for (const key of objectKeys) {
      const folder = key.split('/')[0] || 'root'
      if (!folders.has(folder)) {
        folders.set(folder, [])
      }
      folders.get(folder)!.push(key)
    }

    console.log('\n📁 Objects by folder:')
    for (const [folder, keys] of folders) {
      console.log(`   ${folder}: ${keys.length} objects`)
    }

    // Migrate objects
    console.log('\n🚀 Starting migration...\n')

    let processed = 0
    for (const key of objectKeys) {
      processed++
      const progress = `[${processed}/${stats.total}]`
      
      try {
        await copyObject(key)
        stats.successful++
        console.log(`   ✅ ${progress} ${key}`)
      } catch (error) {
        stats.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        stats.errors.push({ key, error: errorMessage })
        console.log(`   ❌ ${progress} ${key} - ${errorMessage}`)
      }
    }

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('   Migration Summary')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`   Total objects:    ${stats.total}`)
    console.log(`   ✅ Successful:    ${stats.successful}`)
    console.log(`   ❌ Failed:        ${stats.failed}`)
    console.log(`   ⏭️  Skipped:       ${stats.skipped}`)

    if (stats.errors.length > 0) {
      console.log('\n❌ Failed objects:')
      for (const { key, error } of stats.errors) {
        console.log(`   - ${key}: ${error}`)
      }
    }

    if (stats.failed === 0) {
      console.log('\n🎉 Migration completed successfully!')
      console.log('\n📝 Next steps:')
      console.log('   1. Run the database URL update script:')
      console.log('      npx tsx scripts/update-database-urls.ts')
      console.log('   2. Test the website to ensure images load correctly')
      console.log('   3. Once verified, you can remove AWS S3 credentials')
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review failed objects above.')
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateS3ToRailway().catch((error) => {
  console.error('Migration error:', error)
  process.exit(1)
})

