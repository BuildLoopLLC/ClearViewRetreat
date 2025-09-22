import { getDatabase } from '../lib/sqlite'
import { randomUUID } from 'crypto'

const gratitudeSections = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>THANK YOU TO THE BOY SCOUTS OF TROOP 374</h1>

<p>We are deeply grateful to <strong>Boy Scouts of America Troop 374</strong> for their incredible partnership and support of our retreat center. Their dedication to character development, leadership, and service has been an inspiration to us all.</p>

<p>Through their service projects and community involvement, Troop 374 has made a significant impact on our facilities and programs, helping us better serve families seeking hope and healing.</p>

<img src="/images/boy-scouts-troop-374.jpg" alt="Boy Scouts of Troop 374 working on service project at Clear View Retreat" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
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
    content: `<h1>THANK YOU TO THE GLOBAL ACCORD TEAM</h1>

<p>Our heartfelt thanks to the <strong>Global Accord Team</strong> for their generous support and partnership in advancing our mission of strengthening families and building intentional intimacy through Christ-centered ministry.</p>

<p>Their dedication to our cause has been instrumental in helping us reach more families and create meaningful experiences that transform lives.</p>

<img src="/images/global-accord-team.jpg" alt="Global Accord Team partnership with Clear View Retreat" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
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
    content: `<h1>THANK YOU TO THE YOUNG LADIES OF GIRL SCOUT TROOP 1367</h1>

<p>The Girl Scouts cleaned up the leaves, weeds, and gravel, and gave us hardy plants and beautiful sustainable landscaping. As the stone settles in, a beautiful brick sitting area will be revealed!</p>

<p>We are incredibly grateful for their dedication to environmental stewardship and community service. Their work has transformed our outdoor spaces and created a more welcoming environment for all our retreat participants.</p>

<img src="/images/girl-scouts-troop-1367.jpg" alt="Girl Scout Troop 1367 working on landscaping at Clear View Retreat" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`,
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
    content: `<h1>THANK YOU to these two organizations that have taught us so much about running the ministry:</h1>

<h2>Get Fully Funded</h2>
<p>Get Fully Funded has provided invaluable guidance and resources to help us develop sustainable funding strategies for our ministry.</p>

<h2>Ministry Ventures</h2>
<p>Ministry Ventures has been instrumental in helping us understand nonprofit management and organizational development.</p>

<p>Both organizations have played a crucial role in our growth and ability to serve families effectively.</p>`,
    order: 40,
    is_active: true,
    metadata: { 
      name: 'Gratitude Section 4',
      sectionData: JSON.stringify({
        title: 'Ministry Organizations',
        gradientColors: ['from-orange-600', 'to-orange-700']
      })
    },
    user: 'admin@clearviewretreat.com'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>THANK YOU to these sites that allow us to advertise in order to reach more families:</h1>

<h2>Christian Camp Pro</h2>
<p>Christian Camp Pro has been an excellent platform for connecting us with families seeking Christ-centered retreat experiences.</p>

<h2>Lawrence Wilson</h2>
<p>Lawrence Wilson's platform has helped us reach a broader audience of families looking for meaningful retreat opportunities.</p>

<h2>Retreat Finder</h2>
<p>Retreat Finder has been instrumental in helping families discover our programs and services.</p>

<p><em>(CVR does not monitor anything but its own listing and is not responsible for the other content of these sites.)</em></p>`,
    order: 50,
    is_active: true,
    metadata: { 
      name: 'Gratitude Section 5',
      sectionData: JSON.stringify({
        title: 'Advertising Partners',
        gradientColors: ['from-indigo-600', 'to-indigo-700']
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
