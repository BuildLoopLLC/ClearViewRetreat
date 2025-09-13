import { config } from 'dotenv'
import { s3Client, S3_CONFIG } from '../lib/s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

// Load environment variables
config({ path: '.env.local' })

async function testS3Connection() {
  console.log('🔍 Testing S3 Connection...')
  
  try {
    // Check if S3 credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
      console.error('❌ S3 credentials not configured in .env.local')
      console.log('Required environment variables:')
      console.log('- AWS_ACCESS_KEY_ID')
      console.log('- AWS_SECRET_ACCESS_KEY')
      console.log('- S3_BUCKET_NAME')
      console.log('- AWS_REGION (optional, defaults to us-east-1)')
      return
    }

    console.log('📋 S3 Configuration:')
    console.log(`- Bucket: ${S3_CONFIG.BUCKET_NAME}`)
    console.log(`- Region: ${S3_CONFIG.REGION}`)
    console.log(`- Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 8)}...`)

    // Test S3 connection by listing objects
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.BUCKET_NAME,
      MaxKeys: 5
    })

    const response = await s3Client.send(command)
    
    console.log('✅ S3 connection successful!')
    console.log(`📁 Bucket contains ${response.KeyCount || 0} objects`)
    
    if (response.Contents && response.Contents.length > 0) {
      console.log('📄 Recent objects:')
      response.Contents.forEach((obj, index) => {
        console.log(`  ${index + 1}. ${obj.Key} (${obj.Size} bytes)`)
      })
    }

    // Test bucket permissions by trying to list a specific folder
    const testCommand = new ListObjectsV2Command({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Prefix: 'images/',
      MaxKeys: 1
    })

    const testResponse = await s3Client.send(testCommand)
    console.log(`📂 Images folder contains ${testResponse.KeyCount || 0} objects`)

  } catch (error: any) {
    console.error('❌ S3 connection failed:', error.message)
    
    if (error.name === 'NoSuchBucket') {
      console.log('💡 The S3 bucket does not exist. Please create it first.')
    } else if (error.name === 'AccessDenied') {
      console.log('💡 Access denied. Please check your AWS credentials and bucket permissions.')
    } else if (error.name === 'InvalidAccessKeyId') {
      console.log('💡 Invalid AWS Access Key ID. Please check your credentials.')
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('💡 Invalid AWS Secret Access Key. Please check your credentials.')
    }
  }
}

// Run the test
testS3Connection()
