import { Database } from 'sqlite3'
import path from 'path'
import { randomUUID } from 'crypto'

const dbPath = path.join(process.cwd(), 'data', 'website.db')

const foundersContent = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'founders',
    content_type: 'text',
    metadata: { name: 'Founders Introduction' },
    content: `Jim and Kim Nestle are the heart and soul behind ClearView Retreat. Their journey began with a simple yet profound vision: to create a space where families could step away from the distractions of daily life and reconnect with what matters most.

With over 25 years of ministry experience, Jim and Kim have dedicated their lives to strengthening families and building intentional relationships. Their passion for helping others grow closer to God and to each other is evident in every aspect of ClearView Retreat.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'founders',
    content_type: 'text',
    metadata: { name: 'Founders Story' },
    content: `# The Story Behind ClearView Retreat

The vision for ClearView Retreat was born out of Jim and Kim's own experiences in ministry and family life. After years of serving in various church leadership roles, they began to notice a common theme: families were struggling to find meaningful time together in our fast-paced world.

"We saw so many families who wanted to grow closer to God and to each other, but life was just too busy," Jim recalls. "There were always meetings, activities, and responsibilities pulling families in different directions. We knew there had to be a better way."

The idea for ClearView Retreat came during a particularly challenging season in their own ministry. Kim remembers, "We were both so busy serving others that we realized we weren't taking time to invest in our own family relationships. That's when we knew we needed to create something that would help families prioritize what really matters."

## A Vision Takes Shape

The concept was simple yet revolutionary: create a retreat center where families could come together in a natural, peaceful setting, away from the distractions of modern life. A place where they could focus on building stronger relationships with God and with each other.

"We wanted to provide more than just a place to stay," Kim explains. "We wanted to create an experience that would transform families. A place where parents and children could have real conversations, where couples could reconnect, and where everyone could grow closer to God together."

The name "ClearView" came from their desire to help families gain a clear view of what's truly important in life. "When you step away from the noise and busyness, you can see clearly what God has for your family," Jim says.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'founders',
    content_type: 'text',
    metadata: { name: 'The Vision' },
    content: `# Our Vision for Families

Jim and Kim's vision for ClearView Retreat goes beyond just providing a place to stay. They envision a ministry that transforms families through intentional time together and meaningful experiences.

## Core Principles

**Family First**: We believe that strong families are the foundation of a healthy society. Our retreat center is designed to help families prioritize their relationships with God and with each other.

**Intentional Disconnection**: In a world filled with constant distractions, we provide a space where families can truly disconnect from technology and reconnect with what matters most.

**Natural Setting**: We believe that God speaks through His creation. Our retreat center is nestled in a beautiful natural setting that provides the perfect backdrop for spiritual growth and family bonding.

**Small Group Focus**: Rather than hosting large conferences, we focus on small groups of families who can truly connect and support one another.

## The Impact We Hope to Make

"Our dream is to see families leave ClearView Retreat with a renewed sense of purpose and connection," Jim shares. "We want them to go home with practical tools for building stronger relationships and a deeper commitment to following God together."

Kim adds, "We've seen families come here feeling disconnected and leave feeling like they're truly a team. That's what drives us every day - knowing that we're helping families build the kind of relationships that will last a lifetime."`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'founders',
    content_type: 'text',
    metadata: { name: 'The Journey' },
    content: `# The Journey to ClearView Retreat

The path to establishing ClearView Retreat was not without its challenges, but Jim and Kim's faith and determination carried them through every obstacle.

## Early Ministry Years

Jim and Kim began their ministry journey over 25 years ago, serving in various capacities within their local church. Jim's background in pastoral ministry and Kim's experience in family counseling provided them with unique insights into the challenges facing modern families.

"We learned early on that families need more than just good teaching," Kim reflects. "They need practical tools and opportunities to apply what they're learning in real-life situations."

## The Turning Point

The idea for ClearView Retreat began to take shape during a particularly difficult season in their ministry. "We were both so focused on serving others that we realized we were neglecting our own family," Jim admits. "That's when we knew we needed to create something that would help families, including our own, prioritize what really matters."

## Building the Dream

The process of establishing ClearView Retreat required years of planning, fundraising, and hard work. "There were times when we wondered if this vision would ever become reality," Kim remembers. "But God was faithful every step of the way."

From securing the perfect property to building the facilities, every aspect of ClearView Retreat was carefully planned to serve families. "We wanted every detail to reflect our commitment to helping families grow closer to God and to each other," Jim explains.

## The First Retreat

The first family retreat at ClearView Retreat was a moment Jim and Kim will never forget. "Seeing families connect and grow together in this space was everything we had hoped for and more," Kim says with tears in her eyes.

Jim adds, "That's when we knew we were exactly where God wanted us to be. This wasn't just our dream - it was His plan for helping families across our region."`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'founders',
    content_type: 'text',
    metadata: { name: 'Call to Action' },
    content: `# Join Us in This Mission

Jim and Kim's vision for ClearView Retreat continues to grow, and they invite you to be part of this meaningful ministry.

## For Families

If you're looking for a way to strengthen your family relationships and grow closer to God together, ClearView Retreat is here for you. Our founders have created a space where your family can step away from the busyness of life and focus on what matters most.

"We believe every family deserves the opportunity to grow closer to God and to each other," Jim says. "That's why we've made ClearView Retreat accessible to families from all walks of life."

## For Churches

Churches looking to provide meaningful retreat experiences for their families will find a partner in ClearView Retreat. "We want to support local churches in their mission to strengthen families," Kim explains. "We're here to help you create experiences that will have lasting impact on your congregation."

## For Supporters

The ministry of ClearView Retreat is made possible through the support of individuals and organizations who share our vision for strong families. "We're grateful for everyone who has supported this ministry," Jim says. "Together, we're making a difference in the lives of families across our region."

## Contact Us

To learn more about ClearView Retreat or to schedule your family's retreat experience, we'd love to hear from you. Jim and Kim are always excited to share their vision and help you plan the perfect retreat for your family.

"Our door is always open," Kim says with a warm smile. "We believe that every family has a story worth telling, and we'd be honored to be part of yours."`
  }
]

async function populateFoundersContent() {
  const db = new Database(dbPath)
  
  try {
    console.log('Starting founders content population...')
    
    // First, clear existing founders content
    await new Promise<void>((resolve, reject) => {
      db.run(
        'DELETE FROM website_content WHERE section = ? AND subsection = ?',
        ['about', 'founders'],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })
    
    console.log('Cleared existing founders content')
    
    // Insert new founders content
    for (const item of foundersContent) {
      await new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT INTO website_content (id, section, subsection, content_type, metadata, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
          [item.id, item.section, item.subsection, item.content_type, JSON.stringify(item.metadata), item.content],
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })
    }
    
    console.log(`Successfully populated ${foundersContent.length} founders content items`)
    
    // Verify the content was inserted
    const count = await new Promise<number>((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM website_content WHERE section = ? AND subsection = ?',
        ['about', 'founders'],
        (err, row: any) => {
          if (err) reject(err)
          else resolve(row.count)
        }
      )
    })
    
    console.log(`Verification: ${count} founders content items in database`)
    
  } catch (error) {
    console.error('Error populating founders content:', error)
  } finally {
    db.close()
  }
}

populateFoundersContent()
