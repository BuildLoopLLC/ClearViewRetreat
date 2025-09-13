import { config } from 'dotenv'
import { s3Client, S3_CONFIG } from '../lib/s3'
import { HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// Load environment variables
config({ path: '.env.local' })

async function testBucketAccess() {
  try {
    console.log('🔍 Testing S3 bucket access...')
    console.log('Bucket name:', S3_CONFIG.BUCKET_NAME)
    console.log('Region:', S3_CONFIG.REGION)
    
    // Test if bucket exists and is accessible
    const headCommand = new HeadBucketCommand({
      Bucket: S3_CONFIG.BUCKET_NAME
    })
    
    await s3Client.send(headCommand)
    console.log('✅ Bucket is accessible!')
    
    // Test upload a small object
    const testKey = 'test/connection-test.txt'
    const putCommand = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: testKey,
      Body: 'Connection test successful',
      ContentType: 'text/plain'
    })
    
    await s3Client.send(putCommand)
    console.log('✅ Upload test successful!')
    
    // Test the permanent URL
    const permanentUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${testKey}`
    console.log('🔗 Permanent URL:', permanentUrl)
    
    // Test if the URL is accessible
    try {
      const response = await fetch(permanentUrl)
      if (response.ok) {
        console.log('✅ Permanent URL is accessible!')
        const content = await response.text()
        console.log('📄 Content:', content)
      } else {
        console.log('❌ Permanent URL returned:', response.status)
      }
    } catch (error) {
      console.log('❌ Permanent URL test failed:', error)
    }
    
  } catch (error) {
    console.error('❌ Bucket access failed:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('NoSuchBucket')) {
        console.log('🔧 Bucket does not exist or is not accessible')
      } else if (error.message.includes('AccessDenied')) {
        console.log('🔧 Access denied - check bucket permissions')
      }
    }
  }
}

testBucketAccess()
