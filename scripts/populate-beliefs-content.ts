import { Database } from 'sqlite3'
import path from 'path'
import { randomUUID } from 'crypto'

const dbPath = path.join(process.cwd(), 'data', 'website.db')

const beliefsContent = [
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Beliefs Quote' },
    content: 'It is our hope that God\'s church—that is, His people, not some building—would be one body… unified for Him, working for Him, glorifying Him, impassioned for Him.'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Statement of Faith Title' },
    content: 'Our Statement of Faith'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Statement of Faith Content' },
    content: `We believe in God, the Creator of the heavens and earth, who exists eternally in three persons: Father, Son, and Holy Spirit. We believe that God is sovereign, holy, just, and loving, and that He has revealed Himself through His creation, His Word, and most fully through His Son, Jesus Christ.

We believe that Jesus Christ is fully God and fully man, conceived by the Holy Spirit and born of the Virgin Mary. He lived a sinless life, died on the cross as a sacrifice for our sins, was buried, and rose again on the third day. He ascended into heaven and will return to judge the living and the dead.

We believe in the Holy Spirit, who convicts the world of sin, righteousness, and judgment. He regenerates, sanctifies, and empowers all who believe in Jesus Christ. We believe that the Holy Spirit indwells every believer and provides guidance, comfort, and spiritual gifts for the building up of the church.

We believe that the Bible is the inspired, infallible, and authoritative Word of God. It is our guide for faith and practice, and we are committed to studying, teaching, and living according to its truth.

We believe that salvation is by grace alone, through faith alone, in Christ alone. It is a free gift from God that cannot be earned or deserved. All who repent of their sins and trust in Jesus Christ as Lord and Savior are saved and have eternal life.

We believe in the church as the body of Christ, made up of all believers throughout history. The local church is a community of believers who gather for worship, fellowship, teaching, and service. We believe in the priesthood of all believers and the importance of every member using their gifts for the building up of the body.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Values Title' },
    content: 'Our Core Values'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 1 Title' },
    content: 'Biblical Authority'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 1 Content' },
    content: `We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and practice. Every aspect of our ministry is grounded in Scripture, and we are committed to teaching and living according to biblical truth. We believe that God's Word is living and active, capable of transforming lives and guiding us in all our decisions.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 2 Title' },
    content: 'Family Focus'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 2 Content' },
    content: `We believe that strong families are the foundation of a healthy society and the primary context for spiritual growth. Our ministry is specifically designed to strengthen marriages and family relationships through intentional time together, meaningful conversations, and shared experiences that draw families closer to God and to each other.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 3 Title' },
    content: 'Intentional Relationships'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 3 Content' },
    content: `We believe that meaningful relationships require intentional effort and investment. In our fast-paced world, it's easy to let relationships drift or become superficial. Our retreats provide a dedicated space and time for families to focus on each other, engage in deep conversations, and build lasting memories together.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 4 Title' },
    content: 'Community'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Core Value 4 Content' },
    content: `We believe in the importance of Christian community and the power of shared experiences. Our retreats bring together families from different churches and backgrounds, creating opportunities for mutual encouragement, learning, and spiritual growth. We believe that iron sharpens iron, and that we grow stronger together.`
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Theological Discussion Title' },
    content: 'A Note on Theological Discussion'
  },
  {
    id: randomUUID(),
    section: 'about',
    subsection: 'beliefs',
    content_type: 'text',
    metadata: { name: 'Theological Discussion Content' },
    content: `Of course, there are many issues within the realm of faith where Christians may have different perspectives. We recognize that believers can have honest disagreements on secondary theological matters while still maintaining unity in the essential truths of the Christian faith.

Our focus is not on debating theological nuances, but on creating an environment where families can grow in their relationship with God and with each other. We believe that the core message of the gospel—God's love, grace, and redemption through Jesus Christ—is what unites us and what we want to share with others.

We welcome families from various denominational backgrounds and theological traditions, as long as they share our commitment to the essential truths of Christianity as outlined in our Statement of Faith. Our goal is to create a space where families can focus on what matters most: loving God and loving each other.`
  }
]

async function populateBeliefsContent() {
  const db = new Database(dbPath)
  
  try {
    console.log('Starting beliefs content population...')
    
    // First, clear existing beliefs content
    await new Promise<void>((resolve, reject) => {
      db.run(
        'DELETE FROM website_content WHERE section = ? AND subsection = ?',
        ['about', 'beliefs'],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })
    
    console.log('Cleared existing beliefs content')
    
    // Insert new beliefs content
    for (const item of beliefsContent) {
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
    
    console.log(`Successfully populated ${beliefsContent.length} beliefs content items`)
    
    // Verify the content was inserted
    const count = await new Promise<number>((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM website_content WHERE section = ? AND subsection = ?',
        ['about', 'beliefs'],
        (err, row: any) => {
          if (err) reject(err)
          else resolve(row.count)
        }
      )
    })
    
    console.log(`Verification: ${count} beliefs content items in database`)
    
  } catch (error) {
    console.error('Error populating beliefs content:', error)
  } finally {
    db.close()
  }
}

populateBeliefsContent()
