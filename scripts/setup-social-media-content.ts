import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { WebsiteContent } from '../types/firebase'

// Load environment variables
config({ path: '.env.local' })

// Social media content data
const socialMediaContent: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Facebook
  {
    section: 'footer',
    subsection: 'social-facebook-url',
    contentType: 'link',
    content: 'https://facebook.com/clearviewretreat',
    order: 10,
    isActive: true,
    metadata: {
      platform: 'Facebook',
      icon: 'facebook'
    }
  },
  {
    section: 'footer',
    subsection: 'social-facebook-enabled',
    contentType: 'text',
    content: 'true',
    order: 11,
    isActive: true,
    metadata: {
      platform: 'Facebook',
      type: 'enabled'
    }
  },
  // Instagram
  {
    section: 'footer',
    subsection: 'social-instagram-url',
    contentType: 'link',
    content: 'https://instagram.com/clearviewretreat',
    order: 12,
    isActive: true,
    metadata: {
      platform: 'Instagram',
      icon: 'instagram'
    }
  },
  {
    section: 'footer',
    subsection: 'social-instagram-enabled',
    contentType: 'text',
    content: 'true',
    order: 13,
    isActive: true,
    metadata: {
      platform: 'Instagram',
      type: 'enabled'
    }
  },
  // YouTube
  {
    section: 'footer',
    subsection: 'social-youtube-url',
    contentType: 'link',
    content: 'https://youtube.com/@clearviewretreat',
    order: 14,
    isActive: true,
    metadata: {
      platform: 'YouTube',
      icon: 'youtube'
    }
  },
  {
    section: 'footer',
    subsection: 'social-youtube-enabled',
    contentType: 'text',
    content: 'true',
    order: 15,
    isActive: true,
    metadata: {
      platform: 'YouTube',
      type: 'enabled'
    }
  },
  // Twitter/X
  {
    section: 'footer',
    subsection: 'social-twitter-url',
    contentType: 'link',
    content: 'https://twitter.com/clearviewretreat',
    order: 16,
    isActive: true,
    metadata: {
      platform: 'Twitter',
      icon: 'twitter'
    }
  },
  {
    section: 'footer',
    subsection: 'social-twitter-enabled',
    contentType: 'text',
    content: 'false',
    order: 17,
    isActive: true,
    metadata: {
      platform: 'Twitter',
      type: 'enabled'
    }
  },
  // LinkedIn
  {
    section: 'footer',
    subsection: 'social-linkedin-url',
    contentType: 'link',
    content: 'https://linkedin.com/company/clearviewretreat',
    order: 18,
    isActive: true,
    metadata: {
      platform: 'LinkedIn',
      icon: 'linkedin'
    }
  },
  {
    section: 'footer',
    subsection: 'social-linkedin-enabled',
    contentType: 'text',
    content: 'false',
    order: 19,
    isActive: true,
    metadata: {
      platform: 'LinkedIn',
      type: 'enabled'
    }
  }
]

async function setupSocialMediaContent() {
  console.log('📱 Setting up Social Media content using Firebase Admin SDK...')
  
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
    
    console.log(`📝 Adding ${socialMediaContent.length} social media items to Firestore...`)
    
    let successCount = 0
    let errorCount = 0

    for (const content of socialMediaContent) {
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

    console.log(`\n🎉 Social media content setup complete!`)
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
setupSocialMediaContent()
