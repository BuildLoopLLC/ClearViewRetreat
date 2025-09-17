import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// Founders content data
const foundersContent = [
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<p>ClearView Retreat was born from a deep conviction that families need intentional spaces to grow together in faith, strengthen their relationships, and find renewal in God's presence. Our founders, Jim and Kim Nestle, have dedicated their lives to creating such spaces where families can experience transformation.</p>

<p>What started as a vision in their hearts has grown into a ministry that has touched thousands of lives over the past two decades. Through prayer, perseverance, and the faithful support of countless partners, ClearView Retreat has become a beacon of hope for families seeking deeper connection with God and each other.</p>`,
    order: 1,
    isActive: true,
    metadata: { 
      name: 'Founders Introduction',
      description: 'Introduction text for founders page'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>The Beginning of a Dream</h3>
<p>In 1998, Jim and Kim Nestle were serving as youth pastors at a local church when they began to notice a troubling pattern: families were struggling to stay connected in an increasingly busy and distracted world. Despite their best efforts, many parents felt ill-equipped to guide their children spiritually, and family relationships were often strained by the pressures of modern life.</p>

<p>During a particularly challenging season in their own marriage, Jim and Kim experienced firsthand the power of intentional time away together. A weekend retreat not only saved their relationship but opened their eyes to the desperate need for similar opportunities for other families.</p>

<p>"We realized that families needed more than just Sunday morning services," Jim recalls. "They needed dedicated time and space to focus on what matters most – their relationship with God and with each other."</p>

<h3>Building Something Beautiful</h3>
<p>With this vision burning in their hearts, Jim and Kim began the journey of creating ClearView Retreat. They spent years searching for the perfect location, eventually finding 50 acres of pristine mountain property that seemed to call out to them. The land featured rolling hills, a peaceful lake, and breathtaking views that would provide the perfect backdrop for spiritual renewal.</p>

<p>The early years were marked by countless hours of manual labor, as Jim and Kim, along with a small group of dedicated volunteers, built the first cabins, cleared hiking trails, and created spaces for worship and fellowship. Every nail driven and every stone placed was done with prayer and the hope that families would find healing and restoration in this special place.</p>`,
    order: 2,
    isActive: true,
    metadata: { 
      name: 'Founders Story',
      description: 'The story of how ClearView Retreat was founded'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>Our Vision for Families</h3>
<p>From the very beginning, Jim and Kim's vision for ClearView Retreat has been clear: to create a place where families can step away from the noise and distractions of everyday life to focus on what truly matters. They believe that when families are strong in their faith and connected to each other, they become powerful agents of change in their communities and the world.</p>

<p>"We envisioned a place where parents could learn to lead their families spiritually," Kim explains. "A place where couples could rediscover the joy in their marriage, where children could experience God's love in tangible ways, and where entire families could grow together in ways that simply aren't possible in the busyness of daily life."</p>

<h3>More Than a Retreat Center</h3>
<p>ClearView Retreat was never meant to be just another conference center or vacation destination. Jim and Kim's vision extended far beyond providing comfortable accommodations and beautiful scenery. They wanted to create a ministry that would:</p>

<ul>
<li>Equip parents with practical tools for spiritual leadership in their homes</li>
<li>Provide couples with resources to strengthen their marriages</li>
<li>Offer children and teens meaningful experiences that would shape their faith</li>
<li>Create opportunities for families to serve together and make a difference</li>
<li>Build a community of families committed to growing in Christ together</li>
</ul>`,
    order: 3,
    isActive: true,
    metadata: { 
      name: 'The Vision',
      description: 'The vision and mission behind ClearView Retreat'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>Challenges and Triumphs</h3>
<p>The journey of building ClearView Retreat has not been without its challenges. Jim and Kim faced financial struggles, construction delays, and moments of doubt about whether their dream would ever become reality. There were times when they questioned whether they were called to this work, and seasons when the obstacles seemed insurmountable.</p>

<p>But through it all, they held fast to their conviction that God had called them to this ministry. "Every time we were ready to give up," Jim remembers, "God would send someone with exactly what we needed – whether it was a financial gift, a skilled volunteer, or just the encouragement to keep going."</p>

<h3>Witnessing Transformation</h3>
<p>Today, as they look back on more than two decades of ministry, Jim and Kim are filled with gratitude for the countless families whose lives have been transformed at ClearView Retreat. They've watched marriages be restored, parent-child relationships healed, and entire families discover new depths of faith together.</p>

<p>"The most rewarding part of this journey," Kim shares, "is seeing families leave here not just refreshed, but equipped with practical tools and renewed hope for their future together. We've seen God work in ways we never could have imagined when we first started."</p>

<h3>Looking Forward</h3>
<p>As ClearView Retreat continues to grow and evolve, Jim and Kim remain committed to their original vision while also embracing new opportunities to serve families. They're excited about expanding their programs, reaching new communities, and continuing to be a place where families can find hope, healing, and transformation.</p>

<p>"Our prayer is that ClearView Retreat will always be a place where families encounter God in powerful ways," Jim says. "We want to continue being faithful to the vision God gave us, while also being open to how He might want to use this ministry in the years to come."</p>`,
    order: 4,
    isActive: true,
    metadata: { 
      name: 'The Journey',
      description: 'The journey of building and growing ClearView Retreat'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>Join Us in This Mission</h3>
<p>Jim and Kim's story is just the beginning. ClearView Retreat continues to grow and impact families because of the support and partnership of people like you who believe in the power of strong, faith-filled families.</p>

<p>Whether you're a family looking for a place to retreat and grow together, a church seeking to strengthen the families in your congregation, or someone who wants to support this important ministry, we invite you to be part of the ClearView Retreat story.</p>

<p><strong>Ready to experience what God can do in your family?</strong> We'd love to welcome you to ClearView Retreat, where your family can find the space, time, and resources needed to grow stronger together in faith.</p>

<div style="text-align: center; margin-top: 2rem;">
  <a href="/contact" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Plan Your Family Retreat</a>
</div>`,
    order: 5,
    isActive: true,
    metadata: { 
      name: 'Call to Action',
      description: 'Call to action for families to visit ClearView Retreat'
    }
  }
]

async function setupFoundersContent() {
  try {
    console.log('🔧 Setting up founders content...')
    
    for (const content of foundersContent) {
      // Check if content already exists
      const existing = await db.collection('websiteContent')
        .where('section', '==', content.section)
        .where('subsection', '==', content.subsection)
        .where('metadata.name', '==', content.metadata.name)
        .get()
      
      if (existing.empty) {
        await db.collection('websiteContent').add({
          ...content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        console.log(`✅ Added: ${content.metadata.name}`)
      } else {
        console.log(`⚠️  Already exists: ${content.metadata.name}`)
      }
    }
    
    console.log('✅ Founders content setup completed!')
    
  } catch (error) {
    console.error('❌ Error setting up founders content:', error)
  }
}

setupFoundersContent()
