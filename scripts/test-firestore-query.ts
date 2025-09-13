import { config } from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'

// Load environment variables
config({ path: '.env.local' })

async function testFirestoreQuery() {
  console.log('🧪 Testing Firestore query...')
  
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('📖 Testing simple query for hero section...')
    const q = query(
      collection(db, 'websiteContent'),
      where('section', '==', 'hero')
    )
    
    const querySnapshot = await getDocs(q)
    console.log(`✅ Found ${querySnapshot.size} hero documents`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`  - ${doc.id}: ${data.subsection || 'main'} - ${data.content.substring(0, 30)}...`)
    })
    
    console.log('\n🎉 Firestore query is working!')
    
  } catch (error: any) {
    console.error('❌ Firestore query test failed:', error.message)
    console.error('Full error:', error)
  }
}

// Run the test
testFirestoreQuery()
