import { getDatabase } from '../lib/sqlite'

// Sample data to populate the database
const sampleData = [
  // Hero section
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

  // About gratitude section
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
  },

  // Features section
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
  }
]

async function migrateData() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Starting migration to SQLite...')
    
    // Clear existing data
    db.prepare('DELETE FROM website_content').run()
    console.log('🗑️ Cleared existing data')
    
    // Insert sample data
    const insert = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, 
        metadata, order_index, is_active, user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const item of sampleData) {
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
    
    console.log(`✅ Migrated ${sampleData.length} items to SQLite`)
    
    // Verify data
    const count = db.prepare('SELECT COUNT(*) as count FROM website_content').get()
    console.log(`📊 Total items in database: ${count.count}`)
    
    // Show some sample data
    const heroContent = db.prepare('SELECT * FROM website_content WHERE section = ?').all('hero')
    console.log('🎯 Hero section content:', heroContent.length, 'items')
    
    const gratitudeContent = db.prepare('SELECT * FROM website_content WHERE section = ? AND subsection = ?').all('about', 'gratitude')
    console.log('🙏 Gratitude section content:', gratitudeContent.length, 'items')
    
    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
}

export { migrateData }
