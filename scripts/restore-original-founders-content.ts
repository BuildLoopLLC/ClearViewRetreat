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

// Original founders content data
const foundersContent = [
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<p>For twenty-three years (23?!, oh my!) and with five active children, God has blessed us with a delightful marriage and family life. We enjoy each other and desire to glorify God in our interactions. Why did God bless us with the home life that we have? Certainly not because we deserve "wedded bliss" and "great kids" more than any other couple or family, but simply because He chose to lead us as we sought His will in our home. He has taught us principles for relating, for living life with <em className="text-secondary-600 font-semibold">intentional intimacy</em>, and we want to share this with others.</p>

<p>Please don't misunderstand; we have had hardships and trials. We have had difficult seasons in our marriage. <strong>But, God</strong> has pulled us through. In the spring of 2011 we said goodbye to our infant son, <a href="https://www.wearejedidiah.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">Jedidiah</a>, who lived 63,660 seconds. We are not perfect spouses, nor do we have perfect kids. <strong>But, God</strong> redeems our lives and shows us how to smooth the rough spots and polish the good ones. Through all of life's trials and triumphs, our hearts are about reaching others with the hope of Christ in every moment of life.</p>`,
    order: 1,
    isActive: true,
    metadata: { 
      name: 'Founders Introduction',
      description: 'Personal introduction from Jim and Kim Nestle'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>James (Jim) Nestle</h3>

<div className="space-y-4 mb-6">
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-semibold text-secondary-900">Education</h4>
      <p className="text-secondary-600">Masters of Arts Christian Counseling and Discipleship (MACCD), BSN, RN</p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-semibold text-secondary-900">Ministry</h4>
      <p className="text-secondary-600">Grief Mentor with Grief Care Fellowship</p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-semibold text-secondary-900">Credentials</h4>
      <p className="text-secondary-600">Commissioned Minister by LifePoint Church Commissioning Council</p>
    </div>
  </div>
</div>

<p className="text-secondary-600 leading-relaxed">
  Jim spent four years working at Capital Bible Seminary as the full-time Men's Mentor and a part-time adjunct professor. A former naval officer who served as a Division Officer, Jim also held a nurse supervisory position in the Surgery Department of Johns Hopkins Hospital for three years, overseeing the management of 220 beds and the staff that performed direct patient care. During these last years, God has called Jim to challenge the men, women, and children he has mentored/counseled to be intentionally intimate in the relationships they held dear. Through this time, he realized the need for more families to see what God really intends in relationships. Jim volunteered at a <a href="http://sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">small group, family-focused retreat</a> for five weeks during the summer of 2007 to see if God was, indeed, calling his family to this life-changing ministry. These leadership positions and volunteer experience uniquely qualify him to lead staff in day-to-day duties and guests in small group discussions. Currently, Jim works full-time as an RN, trains in blacksmithing, mentors marriages, and runs CVR.
</p>`,
    order: 2,
    isActive: true,
    metadata: { 
      name: 'Jim Nestle Bio',
      description: 'Biography and background of Jim Nestle'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>Kim Nestle</h3>

<div className="space-y-4 mb-6">
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-semibold text-secondary-900">Education</h4>
      <p className="text-secondary-600">BS in Secondary Education–Speech Communication and English</p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-semibold text-secondary-900">Ministry</h4>
      <p className="text-secondary-600">Grief Mentor with Grief Care Fellowship</p>
    </div>
  </div>
</div>

<p className="text-secondary-600 leading-relaxed">
  Kim received honors in interpersonal communication at Northern Arizona University. As a homeschooling mother, Kim educated both of the Nestle's older boys; one of whom is now in university and one who finished an applied technology college this winter. With three boys still homeschooling, Kim also mentors married couples and has facilitated the grief/loss support groups at her church. Kim has participated in various community and church organizations including MOPS, Priest Lake Academy (PLA), La Leche League, and H.I.S. (Home Instruction Support), helping with the organizational, financial, administrative, and presentation aspects of these groups. She also volunteered at a small group <a href="http://sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">family-focused retreat</a> in the summer of 2007. Kim has spoken at various women's events on the topics of parenting, grief, and biblical relationships.
</p>`,
    order: 3,
    isActive: true,
    metadata: { 
      name: 'Kim Nestle Bio',
      description: 'Biography and background of Kim Nestle'
    }
  },
  {
    section: 'about',
    subsection: 'founders',
    contentType: 'html',
    content: `<h3>Experience Intentional Intimacy</h3>
<p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
  Jim and Kim's personal journey of faith, family, and intentional intimacy has inspired the ministry
  of Clear View Retreat. Come experience the same principles that have blessed their family for over two decades.
</p>`,
    order: 4,
    isActive: true,
    metadata: { 
      name: 'Call to Action',
      description: 'Call to action for families to experience intentional intimacy'
    }
  }
]

async function restoreOriginalFoundersContent() {
  try {
    console.log('🔧 Restoring original founders content...')
    
    // First, delete existing founders content
    const existing = await db.collection('websiteContent')
      .where('section', '==', 'about')
      .where('subsection', '==', 'founders')
      .get()
    
    for (const doc of existing.docs) {
      await doc.ref.delete()
      console.log(`🗑️  Deleted: ${doc.data().metadata?.name || 'Unknown'}`)
    }
    
    // Add original content
    for (const content of foundersContent) {
      await db.collection('websiteContent').add({
        ...content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log(`✅ Added: ${content.metadata.name}`)
    }
    
    console.log('✅ Original founders content restored!')
    
  } catch (error) {
    console.error('❌ Error restoring founders content:', error)
  }
}

restoreOriginalFoundersContent()
