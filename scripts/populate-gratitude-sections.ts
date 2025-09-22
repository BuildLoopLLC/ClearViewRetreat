import { getDatabase } from '../lib/sqlite'
import { randomUUID } from 'crypto'

const gratitudeSections = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `<h1>THANK YOU TO THE BOY SCOUTS OF TROOP 374</h1>

<p><em>Click the image button in the rich text editor to upload a photo of the Boy Scouts working on their service project.</em></p>`,
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

<p>Composite of Before During After</p>

<p><em>Click the image button in the rich text editor to upload the before/during/after composite photo.</em></p>`,
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

<p><em>Click the image button in the rich text editor to upload a photo of the Girl Scouts' landscaping work.</em></p>`,
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

<p><strong>Get Fully Funded</strong></p>

<p><strong>Ministry Ventures</strong></p>`,
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

<p><strong>Christian Camp Pro</strong></p>

<p><strong>Lawrence Wilson</strong></p>

<p><strong>Retreat Finder</strong></p>

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
