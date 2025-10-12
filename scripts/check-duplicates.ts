// @ts-nocheck
import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Load environment variables
config({ path: '.env.local' })

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate content in Firestore...')
  
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
    
    // Get all content
    const snapshot = await db.collection('websiteContent').get()
    const allContent = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log(`📊 Total content items: ${allContent.length}`)

    // Group by section and subsection
    const grouped = allContent.reduce((acc, item) => {
      const key = `${item.section}-${item.subsection || 'main'}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {} as Record<string, any[]>)

    // Find duplicates
    const duplicates = Object.entries(grouped).filter(([key, items]) => items.length > 1)
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!')
      return
    }

    console.log(`\n❌ Found ${duplicates.length} duplicate groups:`)
    
    for (const [key, items] of duplicates) {
      console.log(`\n📝 ${key}:`)
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}`)
        console.log(`     Content: "${item.content}"`)
        console.log(`     Order: ${item.order}`)
        console.log(`     Active: ${item.isActive}`)
        console.log(`     Created: ${item.createdAt}`)
      })
    }

    // Ask if user wants to clean up
    console.log('\n🧹 To clean up duplicates, run: npm run cleanup-duplicates')
    
  } catch (error: any) {
    console.error('❌ Error checking duplicates:', error.message)
    process.exit(1)
  }
}

// Run the check
checkDuplicates()
