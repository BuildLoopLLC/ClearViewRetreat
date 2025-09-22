import { getDatabase } from '../lib/sqlite'
import { randomUUID } from 'crypto'

const gratitudeSections = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'gratitude',
    content_type: 'text',
    content: `# Boy Scouts of America - Troop 123

We are deeply grateful to **Boy Scouts of America Troop 123** for their incredible partnership and support of our retreat center. Their dedication to character development, leadership, and service has been an inspiration to us all.

## Their Impact

- **Service Projects**: Over 200 hours of community service completed at our facilities
- **Facility Improvements**: Built hiking trails, maintained campgrounds, and improved accessibility
- **Youth Leadership**: Provided mentorship opportunities for our young retreat participants
- **Community Building**: Helped create lasting connections between families and our retreat community

## Special Recognition

We especially want to thank Scoutmaster **John Smith** and Assistant Scoutmaster **Sarah Johnson** for their tireless dedication to both their troop and our mission. Their leadership has been instrumental in creating meaningful experiences for all involved.

*"The partnership between Troop 123 and Clear View Retreat has been transformative for our scouts. They've learned valuable life skills while contributing to something greater than themselves."* - Scoutmaster John Smith`,
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
    content: `# Global Accord Foundation

Our heartfelt thanks to the **Global Accord Foundation** for their generous support and partnership in advancing our mission of strengthening families and building intentional intimacy through Christ-centered ministry.

## Their Generous Support

- **Financial Support**: Provided crucial funding for facility improvements and program development
- **Strategic Guidance**: Shared valuable insights on nonprofit management and community outreach
- **Network Connections**: Introduced us to other like-minded organizations and potential supporters
- **Program Development**: Collaborated on creating new retreat programs focused on family healing

## Impact on Our Mission

Thanks to Global Accord's support, we've been able to:
- Expand our retreat capacity by 40%
- Launch new programs for military families
- Improve accessibility throughout our facilities
- Develop online resources for families unable to attend in-person

## Words of Gratitude

*"Global Accord Foundation's belief in our mission has been a true blessing. Their support has allowed us to reach more families and create deeper, more meaningful experiences."* - Clear View Retreat Leadership Team`,
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
    content: `# Local Community Partners

We are incredibly grateful to our **local community partners** who have supported us in countless ways throughout our journey. Their generosity and belief in our mission have been the foundation of our success.

## Community Support

- **Local Churches**: Provided prayer support, volunteers, and financial contributions
- **Business Partners**: Offered in-kind donations, services, and expertise
- **Volunteer Groups**: Contributed thousands of hours of service and support
- **Community Leaders**: Advocated for our mission and helped spread awareness

## Special Recognition

We want to especially thank:
- **First Baptist Church** for their ongoing prayer support and volunteer teams
- **Mountain View Construction** for their pro-bono work on facility improvements
- **Community Food Bank** for providing meals for our retreat participants
- **Local Rotary Club** for their fundraising efforts and community connections

## The Ripple Effect

The support of our local community has created a ripple effect, touching not just our retreat center, but families throughout the region who have found hope, healing, and renewed purpose through our programs.`,
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
    content: `# Call to Action

## Join Us in This Mission

Your support makes everything possible. Whether through prayer, volunteering, or financial contributions, you can help us continue to strengthen families and build intentional intimacy through Christ-centered ministry.

### How You Can Help

- **Prayer Support**: Join our prayer team and lift up our mission and families
- **Volunteer**: Share your time and talents with our retreat programs
- **Financial Support**: Help us reach more families through your generous giving
- **Spread the Word**: Share our mission with others who might benefit

### Contact Us

Ready to get involved? We'd love to hear from you and discuss how you can be part of this meaningful work.

**Together, we can make a difference in the lives of families seeking hope, healing, and deeper connections.**`,
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
