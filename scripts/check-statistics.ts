import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

async function checkStatistics() {
  try {
    console.log('🔍 Checking statistics content in database...')
    
    // Get all statistics content
    const snapshot = await db.collection('websiteContent')
      .where('section', '==', 'statistics')
      .get()
    
    console.log(`📊 Found ${snapshot.size} statistics items`)
    
    if (snapshot.size === 0) {
      console.log('❌ No statistics found in database!')
      return
    }
    
    // Group by subsection
    const stats: Record<string, { number?: string; label?: string }> = {}
    
    snapshot.forEach(doc => {
      const data = doc.data()
      const subsection = data.subsection
      const content = data.content
      
      if (subsection?.includes('hero-stat')) {
        const baseKey = subsection.replace(/-number|-label$/, '')
        if (!stats[baseKey]) {
          stats[baseKey] = {}
        }
        
        if (subsection.includes('-number')) {
          stats[baseKey].number = content
        } else if (subsection.includes('-label')) {
          stats[baseKey].label = content
        }
      }
    })
    
    console.log('\n📈 Hero Statistics:')
    Object.entries(stats).forEach(([key, stat]) => {
      console.log(`  ${key}: ${stat.number || 'MISSING'} - ${stat.label || 'MISSING'}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking statistics:', error)
  }
}

checkStatistics()
