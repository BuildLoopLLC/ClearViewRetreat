import { config } from 'dotenv'
import FormData from 'form-data'
import fs from 'fs'
import fetch from 'node-fetch'

// Load environment variables
config({ path: '.env.local' })

async function testUpload() {
  try {
    console.log('🧪 Testing image upload with permanent URLs...')
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ])
    
    // Write test image to temporary file
    const tempFile = '/tmp/test-image.png'
    fs.writeFileSync(tempFile, testImageBuffer)
    
    // Create form data
    const formData = new FormData()
    formData.append('file', fs.createReadStream(tempFile), {
      filename: 'test-image.png',
      contentType: 'image/png'
    })
    formData.append('type', 'blog-main-image')
    
    // Test upload
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ Upload successful!')
    console.log('📸 Image URL:', result.url)
    console.log('🖼️  Thumbnail URL:', result.thumbnailUrl)
    console.log('📁 File name:', result.fileName)
    
    // Test if the URLs are accessible
    console.log('\n🔍 Testing URL accessibility...')
    
    try {
      const imageResponse = await fetch(result.url)
      if (imageResponse.ok) {
        console.log('✅ Image URL is accessible')
      } else {
        console.log('❌ Image URL returned:', imageResponse.status)
      }
    } catch (error) {
      console.log('❌ Image URL test failed:', error)
    }
    
    try {
      const thumbnailResponse = await fetch(result.thumbnailUrl)
      if (thumbnailResponse.ok) {
        console.log('✅ Thumbnail URL is accessible')
      } else {
        console.log('❌ Thumbnail URL returned:', thumbnailResponse.status)
      }
    } catch (error) {
      console.log('❌ Thumbnail URL test failed:', error)
    }
    
    // Clean up
    fs.unlinkSync(tempFile)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testUpload()
