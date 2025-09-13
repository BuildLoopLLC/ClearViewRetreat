import { config } from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Load environment variables
config({ path: '.env.local' })

async function testFirestoreSimple() {
  console.log('🧪 Testing simple Firestore access...')
  
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
    
    console.log('📖 Trying to read from websiteContent collection...')
    const querySnapshot = await getDocs(collection(db, 'websiteContent'))
    console.log(`✅ Found ${querySnapshot.size} documents in websiteContent collection`)
    
    querySnapshot.forEach((doc) => {
      console.log(`  - ${doc.id}: ${doc.data().section} - ${doc.data().subsection || 'main'}`)
    })
    
    console.log('\n🎉 Simple Firestore access is working!')
    
  } catch (error: any) {
    console.error('❌ Simple Firestore test failed:', error.message)
    console.error('Full error:', error)
  }
}

// Run the test
testFirestoreSimple()
