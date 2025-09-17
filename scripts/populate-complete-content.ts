import { getDatabase } from '../lib/sqlite'

// Complete content data for all sections
const completeContent = [
  // HERO SECTION
  {
    id: 'hero-tagline',
    section: 'hero',
    subsection: 'tagline',
    contentType: 'text',
    content: 'Where Faith Meets Nature',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'hero-headline',
    section: 'hero',
    subsection: 'headline',
    contentType: 'text',
    content: 'Discover <span class="text-primary-600">ClearView</span> Retreat',
    metadata: {},
    order: 2,
    isActive: true
  },
  {
    id: 'hero-description',
    section: 'hero',
    subsection: 'description',
    contentType: 'text',
    content: 'A serene mountain retreat center where individuals and groups can find <span class="text-primary-600">spiritual renewal</span>, personal growth, and meaningful connections in a beautiful natural setting.',
    metadata: {},
    order: 3,
    isActive: true
  },
  {
    id: 'hero-primary-cta',
    section: 'hero',
    subsection: 'primary_cta',
    contentType: 'text',
    content: 'Plan Your Visit',
    metadata: { href: '/contact', variant: 'primary' },
    order: 4,
    isActive: true
  },
  {
    id: 'hero-secondary-cta',
    section: 'hero',
    subsection: 'secondary_cta',
    contentType: 'text',
    content: 'Watch Video',
    metadata: { href: '#', variant: 'secondary', modal: true, videoUrl: 'https://youtu.be/NhQS3WRAnPE' },
    order: 5,
    isActive: true
  },

  // STATISTICS SECTION
  {
    id: 'stat-guest-count',
    section: 'statistics',
    subsection: 'hero-stat-guest-count',
    contentType: 'text',
    content: '500+',
    metadata: { label: 'Guests Served' },
    order: 1,
    isActive: true
  },
  {
    id: 'stat-years',
    section: 'statistics',
    subsection: 'hero-stat-years',
    contentType: 'text',
    content: '25+',
    metadata: { label: 'Years of Ministry' },
    order: 2,
    isActive: true
  },
  {
    id: 'stat-satisfaction',
    section: 'statistics',
    subsection: 'testimonials-stat-satisfaction',
    contentType: 'text',
    content: '98%',
    metadata: { label: 'Guest Satisfaction' },
    order: 3,
    isActive: true
  },
  {
    id: 'stat-retreats',
    section: 'statistics',
    subsection: 'hero-stat-retreats',
    contentType: 'text',
    content: '200+',
    metadata: { label: 'Retreats Hosted' },
    order: 4,
    isActive: true
  },

  // FEATURES SECTION
  {
    id: 'features-title',
    section: 'features',
    subsection: 'title',
    contentType: 'text',
    content: 'Why Choose ClearView Retreat?',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'features-subtitle',
    section: 'features',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Experience the perfect blend of natural beauty and spiritual growth',
    metadata: {},
    order: 2,
    isActive: true
  },
  {
    id: 'feature-1-title',
    section: 'features',
    subsection: 'feature-1-title',
    contentType: 'text',
    content: 'Spiritual Renewal',
    metadata: {},
    order: 3,
    isActive: true
  },
  {
    id: 'feature-1-description',
    section: 'features',
    subsection: 'feature-1-description',
    contentType: 'text',
    content: 'Find peace and spiritual growth in our serene mountain setting, designed to foster deep reflection and connection with God.',
    metadata: {},
    order: 4,
    isActive: true
  },
  {
    id: 'feature-2-title',
    section: 'features',
    subsection: 'feature-2-title',
    contentType: 'text',
    content: 'Natural Beauty',
    metadata: {},
    order: 5,
    isActive: true
  },
  {
    id: 'feature-2-description',
    section: 'features',
    subsection: 'feature-2-description',
    contentType: 'text',
    content: 'Surrounded by breathtaking mountain views and pristine wilderness, our location provides the perfect backdrop for meaningful experiences.',
    metadata: {},
    order: 6,
    isActive: true
  },
  {
    id: 'feature-3-title',
    section: 'features',
    subsection: 'feature-3-title',
    contentType: 'text',
    content: 'Community Connection',
    metadata: {},
    order: 7,
    isActive: true
  },
  {
    id: 'feature-3-description',
    section: 'features',
    subsection: 'feature-3-description',
    contentType: 'text',
    content: 'Build lasting relationships and strengthen bonds with family, friends, and fellow believers in a supportive, Christ-centered environment.',
    metadata: {},
    order: 8,
    isActive: true
  },

  // ABOUT SECTION
  {
    id: 'about-title',
    section: 'about',
    subsection: 'title',
    contentType: 'text',
    content: 'About ClearView Retreat',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'about-subtitle',
    section: 'about',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'A place where faith meets nature, and hearts find renewal',
    metadata: {},
    order: 2,
    isActive: true
  },
  {
    id: 'about-description',
    section: 'about',
    subsection: 'description',
    contentType: 'text',
    content: 'For over 25 years, ClearView Retreat has been a sanctuary for individuals and groups seeking spiritual growth, personal renewal, and meaningful connections. Our mission is to provide a Christ-centered environment where guests can step away from the busyness of life and focus on what matters most.',
    metadata: {},
    order: 3,
    isActive: true
  },
  {
    id: 'about-bullet-1',
    section: 'about',
    subsection: 'bullet-1',
    contentType: 'text',
    content: 'Christ-centered programming and activities',
    metadata: {},
    order: 4,
    isActive: true
  },
  {
    id: 'about-bullet-2',
    section: 'about',
    subsection: 'bullet-2',
    contentType: 'text',
    content: 'Beautiful mountain setting with modern amenities',
    metadata: {},
    order: 5,
    isActive: true
  },
  {
    id: 'about-bullet-3',
    section: 'about',
    subsection: 'bullet-3',
    contentType: 'text',
    content: 'Experienced staff dedicated to your spiritual growth',
    metadata: {},
    order: 6,
    isActive: true
  },
  {
    id: 'about-bullet-4',
    section: 'about',
    subsection: 'bullet-4',
    contentType: 'text',
    content: 'Flexible programming for individuals, couples, and groups',
    metadata: {},
    order: 7,
    isActive: true
  },

  // EVENTS SECTION
  {
    id: 'events-title',
    section: 'events',
    subsection: 'title',
    contentType: 'text',
    content: 'Upcoming Events & Retreats',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'events-subtitle',
    section: 'events',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Join us for meaningful experiences that will transform your life',
    metadata: {},
    order: 2,
    isActive: true
  },

  // TESTIMONIALS SECTION
  {
    id: 'testimonials-title',
    section: 'testimonials',
    subsection: 'title',
    contentType: 'text',
    content: 'What Our Guests Say',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'testimonials-subtitle',
    section: 'testimonials',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Hear from those who have experienced the transformative power of ClearView Retreat',
    metadata: {},
    order: 2,
    isActive: true
  },
  {
    id: 'testimonial-1',
    section: 'testimonials',
    subsection: 'testimonial-1',
    contentType: 'text',
    content: 'ClearView Retreat was exactly what our marriage needed. The peaceful setting and Christ-centered programming helped us reconnect with each other and with God.',
    metadata: { author: 'Sarah & Michael Johnson', location: 'Married Couples Retreat' },
    order: 3,
    isActive: true
  },
  {
    id: 'testimonial-2',
    section: 'testimonials',
    subsection: 'testimonial-2',
    contentType: 'text',
    content: 'The natural beauty of this place combined with the spiritual programming created an environment where I could truly hear God\'s voice and find direction for my life.',
    metadata: { author: 'David Chen', location: 'Personal Retreat' },
    order: 4,
    isActive: true
  },
  {
    id: 'testimonial-3',
    section: 'testimonials',
    subsection: 'testimonial-3',
    contentType: 'text',
    content: 'Our youth group had an incredible time at ClearView. The staff was amazing, the facilities were perfect, and the spiritual impact on our students was profound.',
    metadata: { author: 'Pastor Lisa Rodriguez', location: 'Youth Group Retreat' },
    order: 5,
    isActive: true
  },

  // CONTACT SECTION
  {
    id: 'contact-title',
    section: 'contact',
    subsection: 'title',
    contentType: 'text',
    content: 'Get In Touch',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'contact-subtitle',
    section: 'contact',
    subsection: 'subtitle',
    contentType: 'text',
    content: 'Ready to experience the transformation that awaits at ClearView Retreat?',
    metadata: {},
    order: 2,
    isActive: true
  },
  {
    id: 'contact-phone',
    section: 'contact',
    subsection: 'phone',
    contentType: 'text',
    content: '(555) 123-4567',
    metadata: {},
    order: 3,
    isActive: true
  },
  {
    id: 'contact-email',
    section: 'contact',
    subsection: 'email',
    contentType: 'text',
    content: 'info@clearviewretreat.com',
    metadata: {},
    order: 4,
    isActive: true
  },
  {
    id: 'contact-address',
    section: 'contact',
    subsection: 'address',
    contentType: 'text',
    content: '123 Mountain View Drive<br>Retreat Valley, CO 80424',
    metadata: {},
    order: 5,
    isActive: true
  },

  // FOOTER SECTION
  {
    id: 'footer-description',
    section: 'footer',
    subsection: 'description',
    contentType: 'text',
    content: 'ClearView Retreat - Where Faith Meets Nature. A Christ-centered retreat center dedicated to spiritual renewal and personal growth.',
    metadata: {},
    order: 1,
    isActive: true
  },
  {
    id: 'footer-copyright',
    section: 'footer',
    subsection: 'copyright',
    contentType: 'text',
    content: '© 2024 ClearView Retreat. All rights reserved.',
    metadata: {},
    order: 2,
    isActive: true
  },

  // GRATITUDE SECTION (keeping existing)
  {
    id: 'gratitude-intro',
    section: 'about',
    subsection: 'gratitude',
    contentType: 'html',
    content: 'Many people and organizations have blessed us in this journey, and we would like to thank them for their encouragement, support, advice, and action on our behalf.',
    metadata: { name: 'Gratitude Introduction', description: 'Introduction text for gratitude page' },
    order: 1,
    isActive: true
  },
  {
    id: 'gratitude-quote',
    section: 'about',
    subsection: 'gratitude',
    contentType: 'html',
    content: '**To those of you who have joined us in prayer and fasting, we can never say thank you enough for falling at the feet of the Lord on our behalf.**',
    metadata: { name: 'Gratitude Quote', description: 'Highlighted quote about prayer and fasting' },
    order: 2,
    isActive: true
  },
  {
    id: 'gratitude-supporters',
    section: 'about',
    subsection: 'gratitude',
    contentType: 'json',
    content: '["Mark","Jim and staff","Matt and staff","Chantal","Anastasia","Racquel","Steven","Shawn","Barb","Dario","Scott","Darby","Sam","Diana","Nathan","Jay","Lisa","Michelle","Neal","Shelley","Kalynn","Jerry","Charlene","Bonni","Chris","Agnes","Rachelle","Frances","Joe","Hunter","Kim","Ken","Benny and staff","Larry","Terri","Kennedy","Chuck","Jordan","Rex","JohnMark","Eli","Thomas","Kelly","Coy","Tim","Seth","G.G.","Rick","Wilma","Mark","Debi","Todd","Joy","Bete","Luther","Kevin","Sherry","Michelle","Steven","William","Cyndy","Brooke","Deidra","Delores","Olivia","Audra","Tim","Rhett","Kevin","Floyd","Anita","Wendell","Tammy","Rena","Bill","Cheryl","Daryl","Gary","Ken","Danny","Karen","Brian","Dennis","Jicey","Frank","Sarah","Nina","Bailey","Kristi","Scot","Dana","Kristi","Jill","Christina","Haley","LifePoint","Rodney","Karen","Jeff","David and son","Brent","Jennifer","Scottie","Kristin","John","Megan","Matt","Kevin","Joe","Lisa","Andrea","Paul","Susan","Tony","Carla","Tom","Fred","Robert","Brandon","Griffin","James","Marie","Madison","Treva","Robin","Steven","Summer","Josh","Lucas","Nathaniel","Micah and team","Don","George"]',
    metadata: { name: 'Individual Supporters', description: 'List of individual supporters' },
    order: 3,
    isActive: true
  }
]

async function populateCompleteContent() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Populating complete content...')
    
    // Clear existing data
    db.prepare('DELETE FROM website_content').run()
    console.log('🗑️ Cleared existing data')
    
    // Insert complete content
    const insert = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, 
        metadata, order_index, is_active, user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const item of completeContent) {
      insert.run(
        item.id,
        item.section,
        item.subsection || null,
        item.contentType,
        item.content,
        JSON.stringify(item.metadata),
        item.order,
        item.isActive ? 1 : 0,
        'admin@clearviewretreat.com'
      )
    }
    
    console.log(`✅ Populated ${completeContent.length} content items`)
    
    // Verify data by section
    const sections = ['hero', 'statistics', 'features', 'about', 'events', 'testimonials', 'contact', 'footer']
    for (const section of sections) {
      const count = db.prepare('SELECT COUNT(*) as count FROM website_content WHERE section = ?').get(section)
      console.log(`📊 ${section}: ${count.count} items`)
    }
    
    console.log('🎉 Complete content population finished!')
    
  } catch (error) {
    console.error('❌ Population failed:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  populateCompleteContent()
}

export { populateCompleteContent }
