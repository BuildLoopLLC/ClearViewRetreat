import { getDatabase } from '../lib/sqlite'

// Combined content for all three registration sections
const registrationContent = {
  id: 'events-registration-combined',
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
    
    <h3>Event Types</h3>
    <ul>
      <li><strong>Family Camp</strong> - Multi-day family retreats with activities for all ages</li>
      <li><strong>Marriage Retreat</strong> - Weekend retreats focused on strengthening marriages</li>
      <li><strong>Ministry Event</strong> - Special events for pastors, missionaries, and ministry leaders</li>
      <li><strong>Grieving Retreat</strong> - Supportive retreats for families dealing with loss</li>
      <li><strong>Family Mission Trip</strong> - Service-oriented trips for families</li>
      <li><strong>Special Event</strong> - Unique events and celebrations</li>
    </ul>
    
    <h3>How to Use the Calendar</h3>
    <ul>
      <li>Click on any date to see event details</li>
      <li>Colored indicators show different event types</li>
      <li>Navigate between months using arrow buttons</li>
      <li>Click "Go to Today" to return to current month</li>
    </ul>
    
    <hr>
    
    <h2>Payment Instructions</h2>
    
    <p>If applicable, please make your check out to <strong>Clear View Retreat</strong> and mail to:</p>
    
    <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
      <p style="font-weight: 600; margin: 0;"><strong>Clear View Retreat</strong></p>
      <p style="font-weight: 600; margin: 0;"><strong>149 Scenic Hill Road</strong></p>
      <p style="font-weight: 600; margin: 0;"><strong>Lancing, TN 37770</strong></p>
    </div>
    
    <p><strong>Payment Options:</strong></p>
    <ul>
      <li>Credit cards are accepted</li>
      <li>Payments can be made online <a href="/events/payment" style="color: #2563eb; text-decoration: underline;">here</a></li>
      <li>PayPal payments are also accepted</li>
    </ul>
    
    <p><strong>Important Note:</strong> Please note that the PayPal window will list us as both Clear View Retreat (III) and <strong>Intentional Intimacy International, Inc.</strong> (CVR). Our original name was Intentional Intimacy International, Inc. and we are now doing business as Clear View Retreat.</p>
    
    <p><strong>Questions about payment?</strong> If you have any questions about payment methods or need assistance, please <a href="/contact" style="color: #2563eb; text-decoration: underline;">contact us</a> and we'll be happy to help.</p>
  `,
  metadata: {
    name: 'Event Registration Page',
    title: 'Event Registration',
    description: 'Complete registration page content with links, calendar, and payment instructions'
  },
  order: 1,
  isActive: true,
  user: 'admin@clearviewretreat.com'
}

async function populateSingleRegistration() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Populating single registration content...')
    
    // Check if content already exists
    const existing = db.prepare('SELECT id FROM website_content WHERE section = ? AND subsection = ?').get(registrationContent.section, registrationContent.subsection)
    
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
        registrationContent.section,
        registrationContent.subsection
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
    
    // Verify content was added
    console.log('\n📊 Verification:')
    const verify = db.prepare('SELECT * FROM website_content WHERE section = ? AND subsection = ?').get(registrationContent.section, registrationContent.subsection)
    if (verify) {
      console.log('✅ Event Registration: Available in site settings')
    } else {
      console.log('❌ Event Registration: Not found')
    }
    
    console.log('\n🎉 Single registration content populated successfully!')
    
  } catch (error) {
    console.error('❌ Failed to populate registration content:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  populateSingleRegistration()
}

export { populateSingleRegistration }
