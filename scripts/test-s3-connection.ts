import { config } from 'dotenv'
import { s3Client, S3_CONFIG } from '../lib/s3'
import { ListBucketsCommand } from '@aws-sdk/client-s3'

// Load environment variables
config({ path: '.env.local' })

async function testS3Connection() {
  try {
    console.log('🔍 Testing S3 connection...')
    console.log('Bucket name:', S3_CONFIG.BUCKET_NAME)
    console.log('Region:', S3_CONFIG.REGION)
    
    // Test basic S3 connection
    const command = new ListBucketsCommand({})
    const result = await s3Client.send(command)
    
    console.log('✅ S3 connection successful!')
    console.log('Available buckets:')
    result.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (created: ${bucket.CreationDate})`)
    })
    
    // Check if our bucket exists
    const ourBucket = result.Buckets?.find(bucket => bucket.Name === S3_CONFIG.BUCKET_NAME)
    if (ourBucket) {
      console.log(`✅ Bucket "${S3_CONFIG.BUCKET_NAME}" found!`)
    } else {
      console.log(`❌ Bucket "${S3_CONFIG.BUCKET_NAME}" not found!`)
      console.log('Available buckets:', result.Buckets?.map(b => b.Name).join(', '))
    }
    
  } catch (error) {
    console.error('❌ S3 connection failed:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('InvalidAccessKeyId')) {
        console.log('🔧 Check your AWS_ACCESS_KEY_ID')
      } else if (error.message.includes('SignatureDoesNotMatch')) {
        console.log('🔧 Check your AWS_SECRET_ACCESS_KEY')
      } else if (error.message.includes('NoSuchBucket')) {
        console.log('🔧 Bucket does not exist')
      }
    }
  }
}

testS3Connection()
