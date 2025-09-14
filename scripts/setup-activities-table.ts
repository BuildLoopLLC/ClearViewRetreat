import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Load environment variables
config({ path: '.env.local' })

interface Activity {
  id: string
  action: string
  item: string
  section?: string
  user: string
  timestamp: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
}

// Sample activities to populate the table
const sampleActivities: Omit<Activity, 'id'>[] = [
  {
    action: 'Content updated',
    item: 'Hero section',
    section: 'hero',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    details: 'Updated primary CTA button text',
    type: 'content'
  },
  {
    action: 'Content updated',
    item: 'About section',
    section: 'about',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    details: 'Updated mission statement',
    type: 'content'
  },
  {
    action: 'Content updated',
    item: 'Features section',
    section: 'features',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    details: 'Added new retreat feature',
    type: 'content'
  },
  {
    action: 'Blog post created',
    item: 'Welcome to ClearView Retreat',
    section: 'blog',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    details: 'Published new blog post about our retreat center',
    type: 'blog'
  },
  {
    action: 'Event created',
    item: 'Spring Wellness Retreat',
    section: 'events',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    details: 'Scheduled new wellness retreat for April',
    type: 'event'
  },
  {
    action: 'Social media updated',
    item: 'Facebook link',
    section: 'footer-social',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    details: 'Updated Facebook URL and enabled the link',
    type: 'content'
  },
  {
    action: 'Statistics updated',
    item: 'Testimonials statistics',
    section: 'statistics-testimonials',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    details: 'Updated guest satisfaction percentage',
    type: 'content'
  }
]

async function setupActivitiesTable() {
  console.log('📊 Setting up Activities table using Firebase Admin SDK...')
  
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
    
    console.log(`📝 Adding ${sampleActivities.length} sample activities to Firestore...`)
    
    let successCount = 0
    let errorCount = 0

    for (const activity of sampleActivities) {
      try {
        const now = new Date().toISOString()
        const activityData = {
          ...activity,
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        }
        
        await db.collection('activities').add(activityData)
        successCount++
        console.log(`✅ Added: ${activity.action} - ${activity.item}`)
      } catch (error: any) {
        errorCount++
        console.error(`❌ Error adding ${activity.action} - ${activity.item}:`, error.message)
      }
    }

    console.log(`\n🎉 Activities table setup complete!`)
    console.log(`✅ Successfully added: ${successCount} activities`)
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} activities`)
    }
    
  } catch (error: any) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupActivitiesTable()
