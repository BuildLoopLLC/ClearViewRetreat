import { config } from 'dotenv'
import { websiteContentOperations } from '../lib/firebase-client-operations-new'

// Load environment variables
config({ path: '.env.local' })

async function testNewClient() {
  console.log('🧪 Testing new Firebase client operations...')
  
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
    
    console.log('\n🎉 New Firebase client operations are working correctly!')
    
  } catch (error: any) {
    console.error('❌ New Firebase client test failed:', error.message)
    console.error('Full error:', error)
  }
}

// Run the test
testNewClient()
