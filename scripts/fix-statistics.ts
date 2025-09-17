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

async function fixStatistics() {
  try {
    console.log('🔧 Fixing missing statistics...')
    
    // Add missing hero statistics
    const missingStats = [
      {
        section: 'statistics',
        subsection: 'hero-stat-1-number',
        contentType: 'text',
        content: '500+',
        order: 9,
        isActive: true,
        metadata: {}
      },
      {
        section: 'statistics',
        subsection: 'hero-stat-2-number',
        contentType: 'text',
        content: '25+',
        order: 11,
        isActive: true,
        metadata: {}
      }
    ]
    
    for (const stat of missingStats) {
      // Check if it already exists
      const existing = await db.collection('websiteContent')
        .where('section', '==', stat.section)
        .where('subsection', '==', stat.subsection)
        .get()
      
      if (existing.empty) {
        await db.collection('websiteContent').add({
          ...stat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        console.log(`✅ Added ${stat.subsection}: ${stat.content}`)
      } else {
        console.log(`⚠️  ${stat.subsection} already exists`)
      }
    }
    
    console.log('✅ Statistics fix completed!')
    
  } catch (error) {
    console.error('❌ Error fixing statistics:', error)
  }
}

fixStatistics()
