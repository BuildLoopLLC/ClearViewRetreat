import { config } from 'dotenv'
import { s3Client, S3_CONFIG } from '../lib/s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

// Load environment variables
config({ path: '.env.local' })

async function testImageAccess() {
  console.log('🔍 Testing Image Access...')
  
  try {
    // List recent blog post images
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Prefix: 'blog-posts/',
      MaxKeys: 5
    })

    const response = await s3Client.send(command)
    
    if (response.Contents && response.Contents.length > 0) {
      console.log('📄 Recent blog post images:')
      response.Contents.forEach((obj, index) => {
        const imageUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${obj.Key}`
        console.log(`  ${index + 1}. ${obj.Key}`)
        console.log(`     URL: ${imageUrl}`)
        console.log(`     Size: ${obj.Size} bytes`)
        console.log('')
      })
    } else {
      console.log('📄 No blog post images found')
    }

    // Test a specific image URL
    if (response.Contents && response.Contents.length > 0) {
      const testImage = response.Contents[0]
      const testUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${testImage.Key}`
      
      console.log('🧪 Testing image URL accessibility...')
      console.log(`Test URL: ${testUrl}`)
      
      try {
        const fetchResponse = await fetch(testUrl)
        if (fetchResponse.ok) {
          console.log('✅ Image URL is accessible!')
          console.log(`Status: ${fetchResponse.status}`)
          console.log(`Content-Type: ${fetchResponse.headers.get('content-type')}`)
        } else {
          console.log(`❌ Image URL returned status: ${fetchResponse.status}`)
        }
      } catch (fetchError) {
        console.log('❌ Failed to fetch image:', fetchError)
      }
    }

  } catch (error: any) {
    console.error('❌ Error testing image access:', error.message)
  }
}

// Run the test
testImageAccess()
