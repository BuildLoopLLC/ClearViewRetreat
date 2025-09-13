import { config } from 'dotenv'
import { websiteContentOperations } from '../lib/firebase-operations'

// Load environment variables
config({ path: '.env.local' })

async function testFirebaseContent() {
  console.log('🧪 Testing Firebase content operations...')
  
  try {
    // Test getting hero content
    console.log('📖 Fetching hero content...')
    const heroContent = await websiteContentOperations.getBySection('hero')
    console.log(`✅ Found ${heroContent.length} hero items:`)
    heroContent.forEach(item => {
      console.log(`  - ${item.subsection || 'main'}: ${item.content.substring(0, 50)}...`)
    })
    
    // Test getting features content
    console.log('\n📖 Fetching features content...')
    const featuresContent = await websiteContentOperations.getBySection('features')
    console.log(`✅ Found ${featuresContent.length} features items:`)
    featuresContent.forEach(item => {
      console.log(`  - ${item.subsection || 'main'}: ${item.content.substring(0, 50)}...`)
    })
    
    // Test getting all active content
    console.log('\n📖 Fetching all active content...')
    const allContent = await websiteContentOperations.getActiveContent()
    console.log(`✅ Found ${allContent.length} total active items`)
    
    console.log('\n🎉 Firebase content operations are working correctly!')
    
  } catch (error: any) {
    console.error('❌ Firebase content test failed:', error.message)
    process.exit(1)
  }
}

// Run the test
testFirebaseContent()
