import { config } from 'dotenv'
import { websiteContentOperations } from '../lib/dynamodb-operations'
import { WebsiteContent } from '../types/dynamodb'

// Load environment variables
config({ path: '.env.local' })

// Website content data to migrate
const websiteContent: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Hero Section
  {
    section: 'hero',
    subsection: 'tagline',
    contentType: 'text',
    content: 'A place of peace and renewal',
    order: 1,
    isActive: true,
    metadata: {
      icon: '/icon.png',
      iconAlt: 'ClearView Retreat A-frame cabin icon'
    }
  },
  {
    section: 'hero',
    subsection: 'headline',
    contentType: 'text',
    content: 'Discover ClearView Retreat',
    order: 2,
    isActive: true
  },
  {
    section: 'hero',
    subsection: 'description',
    contentType: 'text',
    content: 'A Christian retreat center offering spiritual renewal, outdoor activities, and peaceful accommodations in the heart of nature.',
    order: 3,
    isActive: true
  },
  {
    section: 'hero',
    subsection: 'cta-primary',
    contentType: 'text',
    content: 'Book Your Stay',
    order: 4,
    isActive: true,
    metadata: {
      link: '/contact',
      buttonType: 'primary'
    }
  },
  {
    section: 'hero',
    subsection: 'cta-secondary',
    contentType: 'text',
    content: 'Watch Video',
    order: 5,
    isActive: true,
    metadata: {
      videoUrl: 'https://youtu.be/NhQS3WRAnPE',
      buttonType: 'secondary'
    }
  },

  // Features Section
  {
    section: 'features',
    subsection: 'title',
    contentType: 'text',
    content: 'Why Choose ClearView Retreat',
    order: 1,
    isActive: true
  },
  {
    section: 'features',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Experience the perfect blend of spiritual growth and natural beauty',
    order: 2,
    isActive: true
  },
  {
    section: 'features',
    subsection: 'feature-1-title',
    contentType: 'text',
    content: 'Spiritual Renewal',
    order: 3,
    isActive: true
  },
  {
    section: 'features',
    subsection: 'feature-1-description',
    contentType: 'text',
    content: 'Find peace and spiritual growth in our serene chapel and prayer gardens',
    order: 4,
    isActive: true,
    metadata: {
      icon: 'MapPinIcon'
    }
  },
  {
    section: 'features',
    subsection: 'feature-2-title',
    contentType: 'text',
    content: 'Natural Beauty',
    order: 5,
    isActive: true
  },
  {
    section: 'features',
    subsection: 'feature-2-description',
    contentType: 'text',
    content: 'Surrounded by pristine forests, mountains, and wildlife for a true nature experience',
    order: 6,
    isActive: true,
    metadata: {
      icon: 'StarIcon'
    }
  },
  {
    section: 'features',
    subsection: 'feature-3-title',
    contentType: 'text',
    content: 'Community Building',
    order: 7,
    isActive: true
  },
  {
    section: 'features',
    subsection: 'feature-3-description',
    contentType: 'text',
    content: 'Build lasting relationships through shared experiences and meaningful activities',
    order: 8,
    isActive: true,
    metadata: {
      icon: 'HeartIcon'
    }
  },
  {
    section: 'features',
    subsection: 'cta',
    contentType: 'text',
    content: 'View Upcoming Events',
    order: 9,
    isActive: true
  },

  // About Section
  {
    section: 'about',
    subsection: 'title',
    contentType: 'text',
    content: 'About ClearView Retreat',
    order: 1,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'More than just a retreat center',
    order: 2,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'mission',
    contentType: 'text',
    content: 'Our mission is to provide a sacred space where individuals and groups can experience spiritual renewal, build community, and connect with God through nature.',
    order: 3,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'values-title',
    contentType: 'text',
    content: 'Our Core Values',
    order: 4,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-1-title',
    contentType: 'text',
    content: 'Faith-Centered',
    order: 5,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-1-description',
    contentType: 'text',
    content: 'Everything we do is rooted in Christian principles and designed to strengthen your faith',
    order: 6,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-2-title',
    contentType: 'text',
    content: 'Natural Connection',
    order: 7,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-2-description',
    contentType: 'text',
    content: 'We believe in the healing power of nature and its ability to bring us closer to our Creator',
    order: 8,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-3-title',
    contentType: 'text',
    content: 'Community First',
    order: 9,
    isActive: true
  },
  {
    section: 'about',
    subsection: 'value-3-description',
    contentType: 'text',
    content: 'Building meaningful relationships and fostering a sense of belonging is at the heart of our mission',
    order: 10,
    isActive: true
  },

  // Events Section
  {
    section: 'events',
    subsection: 'title',
    contentType: 'text',
    content: 'Upcoming Events & Retreats',
    order: 1,
    isActive: true
  },
  {
    section: 'events',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Join us for transformative experiences throughout the year',
    order: 2,
    isActive: true
  },
  {
    section: 'events',
    subsection: 'cta',
    contentType: 'text',
    content: 'View All Events',
    order: 3,
    isActive: true,
    metadata: {
      link: '/events'
    }
  },

  // Gallery Section
  {
    section: 'gallery',
    subsection: 'title',
    contentType: 'text',
    content: 'Photo Gallery',
    order: 1,
    isActive: true
  },
  {
    section: 'gallery',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Take a visual journey through our beautiful retreat center',
    order: 2,
    isActive: true
  },
  {
    section: 'gallery',
    subsection: 'cta',
    contentType: 'text',
    content: 'View Full Gallery',
    order: 3,
    isActive: true,
    metadata: {
      link: '/gallery'
    }
  },

  // Testimonials Section
  {
    section: 'testimonials',
    subsection: 'title',
    contentType: 'text',
    content: 'What Our Guests Say',
    order: 1,
    isActive: true
  },
  {
    section: 'testimonials',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Real experiences from real people',
    order: 2,
    isActive: true
  },
  {
    section: 'testimonials',
    subsection: 'testimonial-1',
    contentType: 'text',
    content: 'ClearView Retreat was exactly what my soul needed. The peaceful surroundings and spiritual atmosphere helped me reconnect with God in a profound way.',
    order: 3,
    isActive: true,
    metadata: {
      author: 'Sarah Johnson',
      role: 'Church Leader'
    }
  },
  {
    section: 'testimonials',
    subsection: 'testimonial-2',
    contentType: 'text',
    content: 'Our youth group had an amazing time! The activities were perfect for building community, and the staff went above and beyond to make our stay memorable.',
    order: 4,
    isActive: true,
    metadata: {
      author: 'Mike Chen',
      role: 'Youth Pastor'
    }
  },
  {
    section: 'testimonials',
    subsection: 'testimonial-3',
    contentType: 'text',
    content: 'The natural beauty of this place is breathtaking. I found myself spending hours just sitting and reflecting by the lake. It\'s truly a sanctuary.',
    order: 5,
    isActive: true,
    metadata: {
      author: 'Emily Rodriguez',
      role: 'Retreat Participant'
    }
  },

  // Contact Section
  {
    section: 'contact',
    subsection: 'title',
    contentType: 'text',
    content: 'Get In Touch',
    order: 1,
    isActive: true
  },
  {
    section: 'contact',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Ready to start your journey? We\'d love to hear from you.',
    order: 2,
    isActive: true
  },
  {
    section: 'contact',
    subsection: 'address',
    contentType: 'text',
    content: '123 Retreat Way, Mountain View, CA 94041',
    order: 3,
    isActive: true,
    metadata: {
      icon: 'MapPinIcon'
    }
  },
  {
    section: 'contact',
    subsection: 'phone',
    contentType: 'text',
    content: '(555) 123-4567',
    order: 4,
    isActive: true,
    metadata: {
      icon: 'PhoneIcon'
    }
  },
  {
    section: 'contact',
    subsection: 'email',
    contentType: 'text',
    content: 'info@clearviewretreat.org',
    order: 5,
    isActive: true,
    metadata: {
      icon: 'EnvelopeIcon'
    }
  },
  {
    section: 'contact',
    subsection: 'hours',
    contentType: 'text',
    content: 'Monday - Friday: 9:00 AM - 5:00 PM',
    order: 6,
    isActive: true,
    metadata: {
      icon: 'ClockIcon'
    }
  },

  // Footer Section
  {
    section: 'footer',
    subsection: 'tagline',
    contentType: 'text',
    content: 'A place of peace and renewal',
    order: 1,
    isActive: true
  },
  {
    section: 'footer',
    subsection: 'description',
    contentType: 'text',
    content: 'ClearView Retreat is a Christian retreat center dedicated to providing spiritual renewal, community building, and connection with nature.',
    order: 2,
    isActive: true
  },
  {
    section: 'footer',
    subsection: 'quick-links-title',
    contentType: 'text',
    content: 'Quick Links',
    order: 3,
    isActive: true
  },
  {
    section: 'footer',
    subsection: 'contact-info-title',
    contentType: 'text',
    content: 'Contact Info',
    order: 4,
    isActive: true
  },
  {
    section: 'footer',
    subsection: 'social-title',
    contentType: 'text',
    content: 'Follow Us',
    order: 5,
    isActive: true
  },
  {
    section: 'footer',
    subsection: 'copyright',
    contentType: 'text',
    content: '© 2024 ClearView Retreat. All rights reserved.',
    order: 6,
    isActive: true
  }
]

async function migrateContent() {
  console.log('🚀 Starting content migration to DynamoDB...')
  console.log(`📝 Found ${websiteContent.length} content items to migrate`)

  try {
    let successCount = 0
    let errorCount = 0

    for (const content of websiteContent) {
      try {
        const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()
        
        const contentItem: WebsiteContent = {
          ...content,
          id,
          createdAt: now,
          updatedAt: now
        }

        await websiteContentOperations.create(contentItem)
        console.log(`✅ Migrated: ${content.section} - ${content.subsection || 'main'}`)
        successCount++
        
        // Small delay to avoid overwhelming DynamoDB
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.error(`❌ Failed to migrate ${content.section} - ${content.subsection || 'main'}:`, error.message)
        errorCount++
      }
    }

    console.log('\n🎉 Content migration completed!')
    console.log(`✅ Successfully migrated: ${successCount} items`)
    if (errorCount > 0) {
      console.log(`❌ Failed to migrate: ${errorCount} items`)
    }
    
    console.log('\n📋 Next steps:')
    console.log('1. Update your components to use websiteContentOperations.getBySection()')
    console.log('2. Replace hardcoded text with dynamic content from DynamoDB')
    console.log('3. Test the content management system')

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  migrateContent()
}

export { migrateContent }
