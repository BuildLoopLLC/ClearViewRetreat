import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { WebsiteContent } from '../types/firebase'

// Load environment variables
config({ path: '.env.local' })

// Statistics content data
const statisticsContent: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Testimonials Statistics
  {
    section: 'statistics',
    subsection: 'stat-1-number',
    contentType: 'text',
    content: '98%',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-1-label',
    contentType: 'text',
    content: 'Guest Satisfaction',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-2-number',
    contentType: 'text',
    content: '500+',
    order: 3,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-2-label',
    contentType: 'text',
    content: 'Happy Guests',
    order: 4,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-3-number',
    contentType: 'text',
    content: '25+',
    order: 5,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-3-label',
    contentType: 'text',
    content: 'Years of Service',
    order: 6,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-4-number',
    contentType: 'text',
    content: '4.9/5',
    order: 7,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'stat-4-label',
    contentType: 'text',
    content: 'Average Rating',
    order: 8,
    isActive: true,
    metadata: {}
  },
  // Hero Statistics
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
    subsection: 'hero-stat-1-label',
    contentType: 'text',
    content: 'Guests Served',
    order: 10,
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
  },
  {
    section: 'statistics',
    subsection: 'hero-stat-2-label',
    contentType: 'text',
    content: 'Years Experience',
    order: 12,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'hero-stat-3-number',
    contentType: 'text',
    content: '50+',
    order: 13,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'hero-stat-3-label',
    contentType: 'text',
    content: 'Acres of Nature',
    order: 14,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'hero-stat-4-number',
    contentType: 'text',
    content: '100%',
    order: 15,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'hero-stat-4-label',
    contentType: 'text',
    content: 'Satisfaction',
    order: 16,
    isActive: true,
    metadata: {}
  },
  // About Statistics
  {
    section: 'statistics',
    subsection: 'about-stat-1-number',
    contentType: 'text',
    content: '25+',
    order: 17,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-1-label',
    contentType: 'text',
    content: 'Years of Ministry',
    order: 18,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-2-number',
    contentType: 'text',
    content: '1000+',
    order: 19,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-2-label',
    contentType: 'text',
    content: 'Lives Transformed',
    order: 20,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-3-number',
    contentType: 'text',
    content: '50+',
    order: 21,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-3-label',
    contentType: 'text',
    content: 'Acres of Natural Beauty',
    order: 22,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-4-number',
    contentType: 'text',
    content: '100%',
    order: 23,
    isActive: true,
    metadata: {}
  },
  {
    section: 'statistics',
    subsection: 'about-stat-4-label',
    contentType: 'text',
    content: 'Christ-Centered',
    order: 24,
    isActive: true,
    metadata: {}
  }
]

async function setupStatisticsContent() {
  console.log('📊 Setting up Statistics content using Firebase Admin SDK...')
  
  try {
    // Check if Firebase Admin is configured
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Firebase Admin configuration missing. Please check your .env.local file.')
    }

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
    
    console.log(`📝 Adding ${statisticsContent.length} statistics items to Firestore...`)
    
    let successCount = 0
    let errorCount = 0

    for (const content of statisticsContent) {
      try {
        const now = new Date().toISOString()
        const contentData = {
          ...content,
          createdAt: now,
          updatedAt: now,
        }
        
        await db.collection('websiteContent').add(contentData)
        successCount++
        console.log(`✅ Added: ${content.section} - ${content.subsection}`)
      } catch (error: any) {
        errorCount++
        console.error(`❌ Error adding ${content.section} - ${content.subsection}:`, error.message)
      }
    }

    console.log(`\n🎉 Statistics content setup complete!`)
    console.log(`✅ Successfully added: ${successCount} items`)
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} items`)
    }
    
  } catch (error: any) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupStatisticsContent()
