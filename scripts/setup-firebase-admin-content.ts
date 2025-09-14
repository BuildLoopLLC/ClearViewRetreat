import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
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
  },
  // Board Responsibilities
  {
    section: 'about',
    subsection: 'board',
    contentType: 'text',
    content: `<h3>Board Responsibilities</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>
    <h4>Governance & Oversight</h4>
    <ul>
      <li>Strategic planning and vision setting</li>
      <li>Financial oversight and budgeting</li>
      <li>Policy development and implementation</li>
      <li>Risk management and compliance</li>
    </ul>
  </div>
  <div>
    <h4>Ministry Support</h4>
    <ul>
      <li>Program evaluation and improvement</li>
      <li>Staff support and development</li>
      <li>Community engagement and partnerships</li>
      <li>Prayer and spiritual guidance</li>
    </ul>
  </div>
</div>`,
    order: 100,
    isActive: true,
    metadata: {
      name: 'Board Responsibilities',
      description: 'Board responsibilities and governance information'
    }
  }
]

async function setupFirebaseAdminContent() {
  console.log('🔥 Setting up Firebase content using Admin SDK...')
  
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
        
        await db.collection('websiteContent').add(contentData)
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
    console.log('1. Run: npm run setup-firebase-admin')
    console.log('2. This will create an admin user in Firebase Authentication')
    console.log('3. You can then log in to the admin panel')
    
  } catch (error: any) {
    console.error('❌ Firebase content setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupFirebaseAdminContent()
