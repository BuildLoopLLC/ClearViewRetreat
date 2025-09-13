import { config } from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { WebsiteContent } from '../types/firebase'

// Load environment variables
config({ path: '.env.local' })

// Initial website content data
const initialContent: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Hero Section
  {
    section: 'hero',
    subsection: 'tagline',
    contentType: 'text',
    content: 'Where Faith Meets Nature',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'hero',
    subsection: 'headline',
    contentType: 'text',
    content: 'Discover Peace and Renewal at ClearView Retreat',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'hero',
    subsection: 'description',
    contentType: 'text',
    content: 'A serene mountain retreat center where individuals and groups can find spiritual renewal, personal growth, and meaningful connections in a beautiful natural setting.',
    order: 3,
    isActive: true,
    metadata: {}
  },
  {
    section: 'hero',
    subsection: 'primary_cta',
    contentType: 'text',
    content: 'Plan Your Visit',
    order: 4,
    isActive: true,
    metadata: { href: '/contact', variant: 'primary' }
  },
  {
    section: 'hero',
    subsection: 'secondary_cta',
    contentType: 'text',
    content: 'Watch Video',
    order: 5,
    isActive: true,
    metadata: { href: '#', variant: 'secondary', modal: true, videoUrl: 'https://youtu.be/NhQS3WRAnPE' }
  },

  // Features Section
  {
    section: 'features',
    subsection: 'title',
    contentType: 'text',
    content: 'Why Choose ClearView Retreat',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'features',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Experience the perfect blend of spiritual growth, natural beauty, and meaningful community',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'features',
    subsection: 'cta',
    contentType: 'text',
    content: 'Learn More About Us',
    order: 3,
    isActive: true,
    metadata: { href: '/about' }
  },

  // About Section
  {
    section: 'about',
    subsection: 'title',
    contentType: 'text',
    content: 'Our Mission',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'about',
    subsection: 'mission',
    contentType: 'text',
    content: 'To provide a sacred space where individuals and groups can experience spiritual renewal, personal growth, and deeper connections with God and nature.',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'about',
    subsection: 'values_title',
    contentType: 'text',
    content: 'Our Values',
    order: 3,
    isActive: true,
    metadata: {}
  },

  // Events Section
  {
    section: 'events',
    subsection: 'title',
    contentType: 'text',
    content: 'Upcoming Events & Retreats',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'events',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Join us for meaningful experiences that will inspire and renew your spirit',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'events',
    subsection: 'cta',
    contentType: 'text',
    content: 'View All Events',
    order: 3,
    isActive: true,
    metadata: { href: '/events' }
  },

  // Gallery Section
  {
    section: 'gallery',
    subsection: 'title',
    contentType: 'text',
    content: 'Experience Our Beautiful Grounds',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'gallery',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Take a visual journey through our peaceful retreat center',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'gallery',
    subsection: 'cta',
    contentType: 'text',
    content: 'View Full Gallery',
    order: 3,
    isActive: true,
    metadata: { href: '/gallery' }
  },

  // Testimonials Section
  {
    section: 'testimonials',
    subsection: 'title',
    contentType: 'text',
    content: 'What Our Guests Say',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'testimonials',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Hear from those who have experienced the transformative power of our retreat center',
    order: 2,
    isActive: true,
    metadata: {}
  },

  // Contact Section
  {
    section: 'contact',
    subsection: 'title',
    contentType: 'text',
    content: 'Plan Your Visit',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'contact',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Ready to experience the peace and renewal of ClearView Retreat? We\'d love to help you plan your visit.',
    order: 2,
    isActive: true,
    metadata: {}
  },

  // Footer Section
  {
    section: 'footer',
    subsection: 'description',
    contentType: 'text',
    content: 'A serene mountain retreat center where individuals and groups can find spiritual renewal, personal growth, and meaningful connections in a beautiful natural setting.',
    order: 1,
    isActive: true,
    metadata: {}
  },
  {
    section: 'footer',
    subsection: 'address',
    contentType: 'text',
    content: '123 Mountain View Road, Peaceful Valley, CA 90210',
    order: 2,
    isActive: true,
    metadata: {}
  },
  {
    section: 'footer',
    subsection: 'phone',
    contentType: 'text',
    content: '(555) 123-4567',
    order: 3,
    isActive: true,
    metadata: {}
  },
  {
    section: 'footer',
    subsection: 'email',
    contentType: 'text',
    content: 'info@clearviewretreat.org',
    order: 4,
    isActive: true,
    metadata: {}
  }
]

async function setupFirebaseContent() {
  console.log('🔥 Setting up Firebase content (Firestore only)...')
  
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error('Firebase configuration missing. Please check your .env.local file.')
    }

    // Initialize Firebase (without Auth)
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log(`📝 Adding ${initialContent.length} content items to Firestore...`)
    
    let successCount = 0
    let errorCount = 0

    for (const content of initialContent) {
      try {
        const now = new Date().toISOString()
        const contentData = {
          ...content,
          createdAt: now,
          updatedAt: now,
        }
        
        await addDoc(collection(db, 'websiteContent'), contentData)
        successCount++
        console.log(`✅ Added: ${content.section} - ${content.subsection || 'main'}`)
      } catch (error: any) {
        errorCount++
        console.error(`❌ Error adding ${content.section} - ${content.subsection || 'main'}:`, error.message)
      }
    }

    console.log(`\n🎉 Firebase content setup complete!`)
    console.log(`✅ Successfully added: ${successCount} items`)
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} items`)
    }
    
    console.log('\n📝 Next steps:')
    console.log('1. Enable Authentication in your Firebase Console')
    console.log('2. Run: npm run setup-firebase-admin')
    console.log('3. This will create an admin user in Firebase Authentication')
    
  } catch (error: any) {
    console.error('❌ Firebase content setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupFirebaseContent()
