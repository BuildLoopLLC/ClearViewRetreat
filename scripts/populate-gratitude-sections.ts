import { getDatabase } from '../lib/sqlite'
import { randomUUID } from 'crypto'

const gratitudeSections = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>Boy Scouts of America - Troop 123</h1>

<p>We are deeply grateful to <strong>Boy Scouts of America Troop 123</strong> for their incredible partnership and support of our retreat center. Their dedication to character development, leadership, and service has been an inspiration to us all.</p>

<h2>Their Impact</h2>

<ul>
<li><strong>Service Projects</strong>: Over 200 hours of community service completed at our facilities</li>
<li><strong>Facility Improvements</strong>: Built hiking trails, maintained campgrounds, and improved accessibility</li>
<li><strong>Youth Leadership</strong>: Provided mentorship opportunities for our young retreat participants</li>
<li><strong>Community Building</strong>: Helped create lasting connections between families and our retreat community</li>
</ul>

<h2>Special Recognition</h2>

<p>We especially want to thank Scoutmaster <strong>John Smith</strong> and Assistant Scoutmaster <strong>Sarah Johnson</strong> for their tireless dedication to both their troop and our mission. Their leadership has been instrumental in creating meaningful experiences for all involved.</p>

<blockquote>
<p><em>"The partnership between Troop 123 and Clear View Retreat has been transformative for our scouts. They've learned valuable life skills while contributing to something greater than themselves."</em> - Scoutmaster John Smith</p>
</blockquote>

<img src="/images/boy-scouts-partnership.jpg" alt="Boy Scouts working on service project at Clear View Retreat" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
    order: 10,
    is_active: true,
    metadata: { 
      name: 'Gratitude Section 1',
      sectionData: JSON.stringify({
        title: 'Boy Scouts of America - Troop 123',
        gradientColors: ['from-blue-600', 'to-blue-700']
      })
    },
    user: 'admin@clearviewretreat.com'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>Global Accord Foundation</h1>

<p>Our heartfelt thanks to the <strong>Global Accord Foundation</strong> for their generous support and partnership in advancing our mission of strengthening families and building intentional intimacy through Christ-centered ministry.</p>

<h2>Their Generous Support</h2>

<ul>
<li><strong>Financial Support</strong>: Provided crucial funding for facility improvements and program development</li>
<li><strong>Strategic Guidance</strong>: Shared valuable insights on nonprofit management and community outreach</li>
<li><strong>Network Connections</strong>: Introduced us to other like-minded organizations and potential supporters</li>
<li><strong>Program Development</strong>: Collaborated on creating new retreat programs focused on family healing</li>
</ul>

<h2>Impact on Our Mission</h2>

<p>Thanks to Global Accord's support, we've been able to:</p>
<ul>
<li>Expand our retreat capacity by 40%</li>
<li>Launch new programs for military families</li>
<li>Improve accessibility throughout our facilities</li>
<li>Develop online resources for families unable to attend in-person</li>
</ul>

<h2>Words of Gratitude</h2>

<blockquote>
<p><em>"Global Accord Foundation's belief in our mission has been a true blessing. Their support has allowed us to reach more families and create deeper, more meaningful experiences."</em> - Clear View Retreat Leadership Team</p>
</blockquote>

<img src="/images/global-accord-partnership.jpg" alt="Global Accord Foundation partnership celebration" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
    order: 20,
    is_active: true,
    metadata: { 
      name: 'Gratitude Section 2',
      sectionData: JSON.stringify({
        title: 'Global Accord Foundation',
        gradientColors: ['from-green-600', 'to-green-700']
      })
    },
    user: 'admin@clearviewretreat.com'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>Local Community Partners</h1>

<p>We are incredibly grateful to our <strong>local community partners</strong> who have supported us in countless ways throughout our journey. Their generosity and belief in our mission have been the foundation of our success.</p>

<h2>Community Support</h2>

<ul>
<li><strong>Local Churches</strong>: Provided prayer support, volunteers, and financial contributions</li>
<li><strong>Business Partners</strong>: Offered in-kind donations, services, and expertise</li>
<li><strong>Volunteer Groups</strong>: Contributed thousands of hours of service and support</li>
<li><strong>Community Leaders</strong>: Advocated for our mission and helped spread awareness</li>
</ul>

<h2>Special Recognition</h2>

<p>We want to especially thank:</p>
<ul>
<li><strong>First Baptist Church</strong> for their ongoing prayer support and volunteer teams</li>
<li><strong>Mountain View Construction</strong> for their pro-bono work on facility improvements</li>
<li><strong>Community Food Bank</strong> for providing meals for our retreat participants</li>
<li><strong>Local Rotary Club</strong> for their fundraising efforts and community connections</li>
</ul>

<h2>The Ripple Effect</h2>

<p>The support of our local community has created a ripple effect, touching not just our retreat center, but families throughout the region who have found hope, healing, and renewed purpose through our programs.</p>

<img src="/images/community-partners.jpg" alt="Local community partners gathering at Clear View Retreat" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
    order: 30,
    is_active: true,
    metadata: { 
      name: 'Gratitude Section 3',
      sectionData: JSON.stringify({
        title: 'Local Community Partners',
        gradientColors: ['from-purple-600', 'to-purple-700']
      })
    },
    user: 'admin@clearviewretreat.com'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>Join Us in This Mission</h1>

<p>Your support makes everything possible. Whether through prayer, volunteering, or financial contributions, you can help us continue to strengthen families and build intentional intimacy through Christ-centered ministry.</p>

<h2>How You Can Help</h2>

<ul>
<li><strong>Prayer Support</strong>: Join our prayer team and lift up our mission and families</li>
<li><strong>Volunteer</strong>: Share your time and talents with our retreat programs</li>
<li><strong>Financial Support</strong>: Help us reach more families through your generous giving</li>
<li><strong>Spread the Word</strong>: Share our mission with others who might benefit</li>
</ul>

<h2>Contact Us</h2>

<p>Ready to get involved? We'd love to hear from you and discuss how you can be part of this meaningful work.</p>

<p><strong>Together, we can make a difference in the lives of families seeking hope, healing, and deeper connections.</strong></p>

<img src="/images/join-our-mission.jpg" alt="Community members joining hands in support of Clear View Retreat mission" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
    order: 100,
    is_active: true,
    metadata: { 
      name: 'Call to Action',
      sectionData: JSON.stringify({
        title: 'Join Us in This Mission',
        gradientColors: ['from-primary-50', 'to-accent-50']
      })
    },
    user: 'admin@clearviewretreat.com'
  }
]

async function populateGratitudeSections() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Populating gratitude sections...')
    
    // Clear existing gratitude sections (but keep intro and supporters)
    db.prepare('DELETE FROM website_content WHERE subsection = ? AND metadata LIKE ?').run('gratitude', '%"Gratitude Section%')
    db.prepare('DELETE FROM website_content WHERE subsection = ? AND metadata LIKE ?').run('gratitude', '%"Call to Action"%')
    console.log('🗑️ Cleared existing gratitude sections')
    
    // Insert gratitude sections
    const insert = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, order_index, is_active, metadata, user, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
    
    for (const section of gratitudeSections) {
      insert.run(
        section.id,
        section.section,
        section.subsection,
        section.content_type,
        section.content,
        section.order,
        section.is_active ? 1 : 0,
        JSON.stringify(section.metadata),
        section.user
      )
      console.log(`✅ Added: ${section.metadata.name}`)
    }
    
    console.log('🎉 Gratitude sections populated successfully!')
    
    // Show summary
    const count = db.prepare('SELECT COUNT(*) as count FROM website_content WHERE subsection = ?').get('gratitude')
    console.log(`📊 Total gratitude content items: ${count.count}`)
    
  } catch (error) {
    console.error('❌ Error populating gratitude sections:', error)
  }
}

populateGratitudeSections()
