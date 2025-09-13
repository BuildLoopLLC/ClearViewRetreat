import { config } from 'dotenv'
import { s3Client, S3_CONFIG, generatePresignedDownloadUrl } from '../lib/s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

// Load environment variables
config({ path: '.env.local' })

async function testPresignedUrl() {
  console.log('🔍 Testing Presigned URL Generation...')
  
  try {
    // List recent blog post images
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Prefix: 'blog-posts/',
      MaxKeys: 2
    })

    const response = await s3Client.send(command)
    
    if (response.Contents && response.Contents.length > 0) {
      const testImage = response.Contents[0]
      console.log(`📄 Testing with image: ${testImage.Key}`)
      
      // Generate presigned URL
      const presignedUrl = await generatePresignedDownloadUrl(testImage.Key!, 3600) // 1 hour
      console.log(`🔗 Presigned URL: ${presignedUrl}`)
      
      // Test the presigned URL
      console.log('🧪 Testing presigned URL accessibility...')
      try {
        const fetchResponse = await fetch(presignedUrl)
        if (fetchResponse.ok) {
          console.log('✅ Presigned URL is accessible!')
          console.log(`Status: ${fetchResponse.status}`)
          console.log(`Content-Type: ${fetchResponse.headers.get('content-type')}`)
          console.log(`Content-Length: ${fetchResponse.headers.get('content-length')} bytes`)
        } else {
          console.log(`❌ Presigned URL returned status: ${fetchResponse.status}`)
        }
      } catch (fetchError) {
        console.log('❌ Failed to fetch presigned URL:', fetchError)
      }
    } else {
      console.log('📄 No blog post images found')
    }

  } catch (error: any) {
    console.error('❌ Error testing presigned URL:', error.message)
  }
}

// Run the test
testPresignedUrl()
