import Database from 'better-sqlite3'
import path from 'path'
import { randomUUID } from 'crypto'

const dbPath = path.join(process.cwd(), 'data', 'website.db')

const eventTypesContent = [
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-family-camps',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Family Camps Modal Content', isRichText: true }),
    content: `<h2>Family Camps at Clear View Retreat</h2>

<p>Our Family Camps are designed to bring your entire family together for a meaningful retreat experience. Whether you have young children, teenagers, or are a multi-generational family, our camps provide activities and programming that engage everyone.</p>

<h3>What to Expect</h3>
<ul>
  <li><strong>Age-Appropriate Activities:</strong> Programming designed for every age group, from toddlers to grandparents</li>
  <li><strong>Family Worship:</strong> Meaningful worship experiences that bring families together in praise</li>
  <li><strong>Outdoor Adventures:</strong> Hiking, nature walks, campfires, and exploration of God's creation</li>
  <li><strong>Recreation Time:</strong> Games, sports, and activities that create lasting memories</li>
  <li><strong>Intentional Family Time:</strong> Guided conversations and activities to strengthen family bonds</li>
</ul>

<h3>Typical Schedule</h3>
<p>Family Camps typically run from Friday evening through Sunday afternoon, though we also offer extended week-long camps during summer months. Each day includes a mix of structured programming and free time for your family to explore and connect.</p>

<h3>Accommodations</h3>
<p>Families are housed in comfortable cabins with modern amenities. All meals are provided in our dining hall, prepared with care by our kitchen staff.</p>

<p>Join us for a Family Camp and discover how time away from the distractions of daily life can transform your family relationships.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-marriage-retreats',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Marriage Retreats Modal Content', isRichText: true }),
    content: `<h2>Marriage Retreats at Clear View Retreat</h2>

<p>Your marriage is worth investing in. Our Marriage Retreats provide couples with dedicated time to reconnect, communicate, and strengthen their relationship foundation through biblical principles and practical guidance.</p>

<h3>What to Expect</h3>
<ul>
  <li><strong>Couples-Only Environment:</strong> Intimate gatherings designed specifically for married couples</li>
  <li><strong>Biblical Teaching:</strong> Sessions focused on God's design for marriage and family</li>
  <li><strong>Guided Conversations:</strong> Structured time for meaningful dialogue with your spouse</li>
  <li><strong>Private Couple Time:</strong> Opportunities to reconnect away from daily responsibilities</li>
  <li><strong>Small Group Discussion:</strong> Connect with other couples walking similar journeys</li>
</ul>

<h3>Topics Covered</h3>
<p>Our retreats address key areas of marriage including communication, conflict resolution, intimacy, parenting as a team, financial stewardship, and keeping Christ at the center of your relationship.</p>

<h3>Who Should Attend</h3>
<p>Whether you're newlyweds looking to build a strong foundation, or you've been married for decades and want to deepen your connection, our Marriage Retreats offer something valuable for every stage of married life.</p>

<h3>Childcare Options</h3>
<p>We understand that arranging childcare can be a barrier to attending. Contact us to discuss options and resources for childcare during our retreats.</p>

<p>Invest in your marriage—the most important human relationship you have. Register for an upcoming Marriage Retreat today.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-pastors-missionaries',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Pastors & Missionaries Modal Content', isRichText: true }),
    content: `<h2>Pastors & Missionaries Retreats</h2>

<p>Ministry can be draining. Those who pour out their lives serving others often neglect their own spiritual, emotional, and physical well-being. Our Pastors & Missionaries Retreats are designed to provide rest, renewal, and refreshment for those in full-time ministry.</p>

<h3>What to Expect</h3>
<ul>
  <li><strong>Rest & Sabbath:</strong> Permission and space to truly rest without guilt or obligation</li>
  <li><strong>Peer Fellowship:</strong> Connect with others who understand the unique challenges of ministry</li>
  <li><strong>Spiritual Refreshment:</strong> Be fed and ministered to instead of always giving out</li>
  <li><strong>Personal Retreat Time:</strong> Solitude and quiet for reflection and prayer</li>
  <li><strong>Practical Resources:</strong> Tools for sustainable ministry and avoiding burnout</li>
</ul>

<h3>Who Should Attend</h3>
<p>These retreats are designed for:</p>
<ul>
  <li>Senior and Associate Pastors</li>
  <li>Missionaries (both domestic and international)</li>
  <li>Youth and Children's Ministry Leaders</li>
  <li>Worship Leaders</li>
  <li>Ministry Spouses</li>
  <li>Church Planters</li>
</ul>

<h3>Financial Assistance</h3>
<p>We understand that many in ministry operate on limited budgets. Scholarships and subsidized rates are available for those in full-time ministry. Please contact us to discuss your situation.</p>

<p>You can't pour from an empty cup. Take time to be filled and refreshed so you can continue serving effectively.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-grieving-families',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Grieving Families Modal Content', isRichText: true }),
    content: `<h2>Grieving Families Retreats</h2>

<p>Loss touches every family differently. Our Grieving Families Retreats provide a safe, compassionate environment for families who have experienced the death of a loved one to process their grief together and find hope in community.</p>

<h3>What to Expect</h3>
<ul>
  <li><strong>Compassionate Care:</strong> Trained facilitators who understand grief and loss</li>
  <li><strong>Family-Centered Approach:</strong> Activities designed for entire families to grieve together</li>
  <li><strong>Age-Appropriate Support:</strong> Specialized programming for children, teens, and adults</li>
  <li><strong>Memory Honoring:</strong> Meaningful ways to remember and honor your loved one</li>
  <li><strong>Community Connection:</strong> Support from other families walking similar paths</li>
</ul>

<h3>A Safe Space</h3>
<p>We understand that grief is complex and deeply personal. Our retreats are not about "fixing" anyone or rushing the grieving process. Instead, we provide a safe space to feel, share, remember, and begin to heal—at your own pace.</p>

<h3>Types of Loss</h3>
<p>Our retreats welcome families grieving various types of loss, including:</p>
<ul>
  <li>Loss of a child</li>
  <li>Loss of a parent</li>
  <li>Loss of a spouse</li>
  <li>Loss of a sibling</li>
  <li>Miscarriage and infant loss</li>
</ul>

<h3>Timing</h3>
<p>There is no "right time" to attend a grief retreat. Whether your loss is recent or happened years ago, if you're still processing grief, our retreats can help.</p>

<p>You don't have to grieve alone. Join us for a Grieving Families Retreat and find comfort in community.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-facility-rental',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Facility Rental Modal Content', isRichText: true }),
    content: `<h2>Cabins & Facility Rental</h2>

<p>Clear View Retreat offers beautiful facilities available for rent to churches, organizations, and groups who want to plan their own retreats and gatherings. Our scenic mountain location provides the perfect backdrop for your event.</p>

<h3>Available Facilities</h3>
<ul>
  <li><strong>Cabins:</strong> Comfortable sleeping accommodations for various group sizes</li>
  <li><strong>Meeting Spaces:</strong> Large and small gathering rooms with A/V equipment</li>
  <li><strong>Dining Hall:</strong> Full-service kitchen and dining accommodations</li>
  <li><strong>Outdoor Spaces:</strong> Amphitheater, fire pit areas, hiking trails, and recreation fields</li>
  <li><strong>Chapel:</strong> Beautiful worship space for services and ceremonies</li>
</ul>

<h3>Rental Options</h3>
<p>We offer flexible rental arrangements:</p>
<ul>
  <li><strong>Full Facility Rental:</strong> Exclusive use of all buildings and grounds</li>
  <li><strong>Partial Rental:</strong> Specific cabins and meeting spaces</li>
  <li><strong>Day Use:</strong> Facilities for single-day events and gatherings</li>
</ul>

<h3>Services Available</h3>
<p>We can provide additional services to support your event:</p>
<ul>
  <li>Full meal service by our kitchen staff</li>
  <li>Technical support for A/V needs</li>
  <li>Activity coordination and equipment</li>
  <li>Program consultation and planning assistance</li>
</ul>

<h3>Ideal For</h3>
<p>Our facilities are perfect for church retreats, youth group weekends, family reunions, ministry training events, women's or men's retreats, leadership development, and more.</p>

<p>Contact us to schedule a tour or discuss your event needs.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-mission-trips',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Family Mission Trips Modal Content', isRichText: true }),
    content: `<h2>Family Mission Trips</h2>

<p>Serving together as a family creates powerful memories and teaches valuable lessons about faith, compassion, and making a difference. Our Family Mission Trips provide meaningful service opportunities that families can experience together.</p>

<h3>What to Expect</h3>
<ul>
  <li><strong>Meaningful Service:</strong> Hands-on projects that make a real difference in communities</li>
  <li><strong>Age-Appropriate Tasks:</strong> Activities suited for all ages, from young children to grandparents</li>
  <li><strong>Cultural Immersion:</strong> Learn about and connect with the communities you serve</li>
  <li><strong>Spiritual Formation:</strong> Daily devotions and reflection on serving like Jesus</li>
  <li><strong>Family Bonding:</strong> Work alongside your family members toward a common goal</li>
</ul>

<h3>Types of Service Projects</h3>
<p>Our mission trips may include:</p>
<ul>
  <li>Home repair and construction projects</li>
  <li>Community cleanup and beautification</li>
  <li>Children's ministry and VBS programs</li>
  <li>Food distribution and meal service</li>
  <li>Visiting nursing homes and care facilities</li>
  <li>Supporting local ministries and nonprofits</li>
</ul>

<h3>Trip Destinations</h3>
<p>We offer both local and regional mission trip opportunities. Some trips are based from our retreat center, while others may travel to partner communities and organizations.</p>

<h3>Preparing Your Family</h3>
<p>We provide pre-trip preparation materials and family devotional guides to help your family spiritually prepare for the experience and maximize the impact of your service.</p>

<p>Give your family the gift of serving together. Join us for a Family Mission Trip.</p>`
  },
  {
    id: randomUUID(),
    section: 'events',
    subsection: 'events-type-other-options',
    content_type: 'html',
    metadata: JSON.stringify({ name: 'Other Options Modal Content', isRichText: true }),
    content: `<h2>Other Retreat Options</h2>

<p>In addition to our scheduled retreats, Clear View Retreat offers custom programming and special events throughout the year. If you don't see exactly what you're looking for, let's talk!</p>

<h3>Custom Retreats</h3>
<p>We can work with your church, organization, or group to design a custom retreat experience tailored to your specific needs and goals. Our team can help with:</p>
<ul>
  <li>Program design and scheduling</li>
  <li>Theme development</li>
  <li>Activity selection</li>
  <li>Speaker coordination</li>
  <li>Logistics and meal planning</li>
</ul>

<h3>Special Events</h3>
<p>Throughout the year, we host special events and programs including:</p>
<ul>
  <li><strong>Seasonal Celebrations:</strong> Easter, Thanksgiving, and Christmas gatherings</li>
  <li><strong>Day Retreats:</strong> Single-day experiences for local groups</li>
  <li><strong>Workshops & Training:</strong> Focused learning experiences on specific topics</li>
  <li><strong>Youth Events:</strong> Specialized programming for teenagers and young adults</li>
  <li><strong>Senior Retreats:</strong> Gatherings designed for older adults</li>
</ul>

<h3>Partner Churches</h3>
<p>We partner with local churches to provide retreat experiences for their congregations. If your church is interested in bringing a group to Clear View Retreat, we'd love to discuss how we can serve your church family.</p>

<h3>Private Family Retreats</h3>
<p>Looking for a private getaway for just your family? We offer cabin rentals and can provide optional activities and services for private family retreats.</p>

<p>Whatever your retreat vision, let's explore how Clear View Retreat can help make it a reality. Contact us to start the conversation.</p>`
  }
]

function populateEventTypesContent() {
  const db = new Database(dbPath)
  
  try {
    console.log('Starting event types content population...')
    
    // First, clear existing event types content
    const subsections = [
      'events-type-family-camps',
      'events-type-marriage-retreats',
      'events-type-pastors-missionaries',
      'events-type-grieving-families',
      'events-type-facility-rental',
      'events-type-mission-trips',
      'events-type-other-options'
    ]
    
    const deleteStmt = db.prepare('DELETE FROM website_content WHERE section = ? AND subsection = ?')
    
    for (const subsection of subsections) {
      deleteStmt.run('events', subsection)
    }
    
    console.log('Cleared existing event types content')
    
    // Insert new event types content
    const insertStmt = db.prepare(`
      INSERT INTO website_content (id, section, subsection, content_type, metadata, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
    
    for (const item of eventTypesContent) {
      insertStmt.run(item.id, item.section, item.subsection, item.content_type, item.metadata, item.content)
      console.log(`Inserted content for: ${item.subsection}`)
    }
    
    console.log(`\nSuccessfully populated ${eventTypesContent.length} event types content items`)
    
    // Verify the content was inserted
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM website_content WHERE section = ? AND subsection = ?')
    
    for (const subsection of subsections) {
      const row = countStmt.get('events', subsection) as { count: number }
      console.log(`Verification: ${row.count} item(s) for ${subsection}`)
    }
    
  } catch (error) {
    console.error('Error populating event types content:', error)
  } finally {
    db.close()
  }
}

populateEventTypesContent()
