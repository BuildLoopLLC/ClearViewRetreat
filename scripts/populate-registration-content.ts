import { getDatabase } from '../lib/sqlite'

// Initial content for events registration section
const registrationContent = {
  id: 'events-registration-main',
  section: 'events',
  subsection: 'registration',
  contentType: 'text',
  content: `
    <h1>Register For Retreat</h1>
    
    <h2>Click a retreat to register:</h2>
    
    <h4>Group Planning Forms (online | pdf)</h4>
    <h4>Individual Family Registration (online | pdf)</h4>
    <h4>Marriage Retreat (online | pdf)</h4>
    <h4>Pastor/Missionary Retreats (online | pdf)</h4>
    <h4>Grieving Retreat (online | pdf)</h4>
    <h4>Family Mission Trip (online | pdf)</h4>
    
    <hr>
    
    <h2>Availability</h2>
    <p>Check our calendar below for available dates and retreat types throughout the year.</p>
    
    <hr>
    
    <h2>Payment Instructions</h2>
    <p>If applicable, please make your check out to <strong>Clear View Retreat</strong> and mail to:</p>
    
    <p><strong>Clear View Retreat</strong><br>
    <strong>149 Scenic Hill Road</strong><br>
    <strong>Lancing, TN 37770</strong></p>
    
    <p>* Credit cards are accepted. Payments can be made online <a href="/events/payment">here</a>. Please note that the PayPal window will list us as both Clear View Retreat (III) and <strong>Intentional Intimacy International, Inc.</strong> (CVR). Our original name was Intentional Intimacy International, Inc. and we are now doing business as Clear View Retreat.</p>
  `,
  metadata: {
    name: 'Event Registration Page',
    title: 'Event Registration',
    description: 'Main registration page for events and retreats'
  },
  order: 0,
  isActive: true,
  user: 'admin@clearviewretreat.com'
}

async function populateRegistrationContent() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Populating events registration content...')
    
    // Check if content already exists
    const existing = db.prepare('SELECT id FROM website_content WHERE section = ? AND subsection = ?').get('events', 'registration')
    
    if (existing) {
      console.log('⚠️ Registration content already exists, updating...')
      
      // Update existing content
      const update = db.prepare(`
        UPDATE website_content 
        SET content = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
        WHERE section = ? AND subsection = ?
      `)
      
      update.run(
        registrationContent.content,
        JSON.stringify(registrationContent.metadata),
        'events',
        'registration'
      )
      
      console.log('✅ Registration content updated successfully!')
    } else {
      console.log('📝 Creating new registration content...')
      
      // Insert new content
      const insert = db.prepare(`
        INSERT INTO website_content (
          id, section, subsection, content_type, content, 
          metadata, order_index, is_active, user, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      
      insert.run(
        registrationContent.id,
        registrationContent.section,
        registrationContent.subsection,
        registrationContent.contentType,
        registrationContent.content,
        JSON.stringify(registrationContent.metadata),
        registrationContent.order,
        registrationContent.isActive ? 1 : 0,
        registrationContent.user
      )
      
      console.log('✅ Registration content created successfully!')
    }
    
    // Verify the content was added
    const verify = db.prepare('SELECT * FROM website_content WHERE section = ? AND subsection = ?').get('events', 'registration')
    if (verify) {
      console.log('✅ Verification successful - content is now available in site settings')
    } else {
      console.log('❌ Verification failed - content was not created')
    }
    
  } catch (error) {
    console.error('❌ Failed to populate registration content:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  populateRegistrationContent()
}

export { populateRegistrationContent }
