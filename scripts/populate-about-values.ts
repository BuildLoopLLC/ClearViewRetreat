import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
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

async function populateAboutValues() {
  try {
    console.log('🚀 Starting to populate about values content...')

    const valuesContent = [
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'Our Core Values',
        order: 10,
        isActive: true,
        metadata: {
          name: 'Values Section Title',
          description: 'Title for the values section'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'Biblical Authority',
        order: 11,
        isActive: true,
        metadata: {
          name: 'Value 1 Title',
          description: 'First core value title'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and practice.',
        order: 12,
        isActive: true,
        metadata: {
          name: 'Value 1 Description',
          description: 'First core value description'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'Family Focus',
        order: 13,
        isActive: true,
        metadata: {
          name: 'Value 2 Title',
          description: 'Second core value title'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'We believe that strong families are the foundation of a strong society and that God\'s design for family relationships is essential for spiritual growth.',
        order: 14,
        isActive: true,
        metadata: {
          name: 'Value 2 Description',
          description: 'Second core value description'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'Intentional Relationships',
        order: 15,
        isActive: true,
        metadata: {
          name: 'Value 3 Title',
          description: 'Third core value title'
        }
      },
      {
        section: 'about',
        subsection: 'main',
        contentType: 'text',
        content: 'We believe that meaningful relationships require intentional effort and that God calls us to love one another deeply and authentically.',
        order: 16,
        isActive: true,
        metadata: {
          name: 'Value 3 Description',
          description: 'Third core value description'
        }
      }
    ]

    // Update existing values content
    for (const content of valuesContent) {
      const query = db.collection('websiteContent')
        .where('section', '==', content.section)
        .where('subsection', '==', content.subsection)
        .where('metadata.name', '==', content.metadata.name)

      const snapshot = await query.get()
      
      if (!snapshot.empty) {
        // Update existing document
        const doc = snapshot.docs[0]
        await doc.ref.update({
          content: content.content,
          updatedAt: new Date().toISOString()
        })
        console.log(`✅ Updated: ${content.metadata.name}`)
      } else {
        // Create new document
        await db.collection('websiteContent').add({
          ...content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        console.log(`✅ Created: ${content.metadata.name}`)
      }
    }

    console.log('🎉 Successfully populated about values content!')
  } catch (error) {
    console.error('❌ Error populating about values content:', error)
  }
}

populateAboutValues()
