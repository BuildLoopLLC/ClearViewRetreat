import { getDatabase } from '../lib/sqlite'

// History content data
const historyContent = [
  {
    id: 'history-intro',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'Our organization was founded with a vision to strengthen families and build intentional intimacy through Christ-centered ministry.',
    metadata: { name: 'History Introduction' },
    order: 1,
    isActive: true
  },
  {
    id: 'foundation-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'The Foundation of Intentional Intimacy International',
    metadata: { name: 'Foundation Section Title' },
    order: 2,
    isActive: true
  },
  {
    id: 'foundation-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: `Jim and Kim Nestle established Intentional Intimacy International (III) in the spring of 2008. Their vision was born from a deep conviction that families need intentional time away from the distractions of daily life to focus on what matters most—their relationships with God and each other.

<p>After years of ministry experience and witnessing the struggles families face in maintaining strong, Christ-centered relationships, Jim and Kim felt called to create a space where families could step away from their busy schedules and reconnect with their faith and each other.</p>

<p>The retreat center was strategically located in the beautiful mountains of Tennessee, providing a natural setting that would help families disconnect from technology and reconnect with God's creation. The name "ClearView" was chosen to reflect the clarity of vision and purpose that families often discover during their time at the retreat.</p>

<p>From the beginning, the mission was clear: to provide a Christ-centered environment where families could experience spiritual renewal, strengthen their relationships, and return home with a renewed sense of purpose and connection.</p>`,
    metadata: { name: 'Foundation Section Content' },
    order: 3,
    isActive: true
  },
  {
    id: 'partnership-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Our Partnership with Churches',
    metadata: { name: 'Partnership Section Title' },
    order: 4,
    isActive: true
  },
  {
    id: 'partnership-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: `ClearView Retreat wants to partner with your church leadership to provide meaningful retreat experiences for your congregation. We understand that church leaders often carry the burden of planning and organizing retreats, and we're here to help ease that load.

<p>Our partnership approach includes:</p>
<ul>
<li>Customized programming that aligns with your church's values and mission</li>
<li>Flexible scheduling to accommodate your congregation's needs</li>
<li>Experienced staff who handle the details so you can focus on ministry</li>
<li>Affordable pricing that makes retreats accessible to all families</li>
<li>Follow-up resources to help maintain the spiritual growth experienced at the retreat</li>
</ul>

<p>We believe that when families are strengthened, the entire church community benefits. Our goal is to support your ministry by providing a space where your families can grow closer to God and to each other.</p>`,
    metadata: { name: 'Partnership Section Content' },
    order: 5,
    isActive: true
  },
  {
    id: 'different-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Why We\'re Different',
    metadata: { name: 'Different Section Title' },
    order: 6,
    isActive: true
  },
  {
    id: 'different-intro',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'By bringing families away from familiar, sometimes stressful environments, we create space for God to work in ways that might not be possible in the midst of daily routines. Our approach is intentionally different from typical retreat centers.',
    metadata: { name: 'Different Section Intro' },
    order: 7,
    isActive: true
  },
  {
    id: 'different-point-1-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Small Group Focus',
    metadata: { name: 'Different Point 1 Title' },
    order: 8,
    isActive: true
  },
  {
    id: 'different-point-1-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'We want each group that comes away together to be small enough that everyone can participate meaningfully. Large groups often lead to surface-level interactions, but smaller groups allow for deeper sharing, authentic relationships, and more personalized spiritual growth.',
    metadata: { name: 'Different Point 1 Content' },
    order: 9,
    isActive: true
  },
  {
    id: 'different-point-2-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Easing the Burden on Leaders',
    metadata: { name: 'Different Point 2 Title' },
    order: 10,
    isActive: true
  },
  {
    id: 'different-point-2-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'We want to ease the burden on church leaders by handling all the logistics, programming, and details. You can focus on shepherding your people while we provide the space, activities, and support needed for a meaningful retreat experience.',
    metadata: { name: 'Different Point 2 Content' },
    order: 11,
    isActive: true
  },
  {
    id: 'different-point-3-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Focus on Relationships',
    metadata: { name: 'Different Point 3 Title' },
    order: 12,
    isActive: true
  },
  {
    id: 'different-point-3-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'We want to focus on relationships—between spouses, parents and children, and families with God. Our programming is designed to facilitate meaningful conversations, shared experiences, and spiritual growth that strengthens the bonds within families.',
    metadata: { name: 'Different Point 3 Content' },
    order: 13,
    isActive: true
  },
  {
    id: 'different-point-4-title',
    section: 'about',
    subsection: 'history',
    contentType: 'text',
    content: 'Natural Setting',
    metadata: { name: 'Different Point 4 Title' },
    order: 14,
    isActive: true
  },
  {
    id: 'different-point-4-content',
    section: 'about',
    subsection: 'history',
    contentType: 'html',
    content: 'We want to provide a natural setting that helps families disconnect from technology and reconnect with God\'s creation. The beauty of the mountains, the peace of the forest, and the simplicity of our facilities all work together to create an environment conducive to spiritual reflection and family bonding.',
    metadata: { name: 'Different Point 4 Content' },
    order: 15,
    isActive: true
  }
]

async function populateHistoryContent() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Populating history content...')
    
    // Clear existing history data
    db.prepare('DELETE FROM website_content WHERE section = ? AND subsection = ?').run('about', 'history')
    console.log('🗑️ Cleared existing history data')
    
    // Insert history content
    const insert = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, 
        metadata, order_index, is_active, user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const item of historyContent) {
      insert.run(
        item.id,
        item.section,
        item.subsection,
        item.contentType,
        item.content,
        JSON.stringify(item.metadata),
        item.order,
        item.isActive ? 1 : 0,
        'admin@clearviewretreat.com'
      )
    }
    
    console.log(`✅ Populated ${historyContent.length} history content items`)
    
    // Verify data
    const count = db.prepare('SELECT COUNT(*) as count FROM website_content WHERE section = ? AND subsection = ?').get('about', 'history')
    console.log(`📊 History content: ${count.count} items`)
    
    console.log('🎉 History content population finished!')
    
  } catch (error) {
    console.error('❌ Population failed:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  populateHistoryContent()
}

export { populateHistoryContent }
