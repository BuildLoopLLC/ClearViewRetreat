import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function setupBoardResponsibilities() {
  try {
    console.log('Setting up board responsibilities content...')

    // Board Responsibilities content
    const boardResponsibilitiesContent = {
      section: 'about',
      subsection: 'board',
      contentType: 'text',
      content: `<h3>Board Responsibilities</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>
    <h4>Governance & Oversight</h4>
    <ul>
      <li>Strategic planning and vision setting</li>
      <li>Financial oversight and budgeting</li>
      <li>Policy development and implementation</li>
      <li>Risk management and compliance</li>
    </ul>
  </div>
  <div>
    <h4>Ministry Support</h4>
    <ul>
      <li>Program evaluation and improvement</li>
      <li>Staff support and development</li>
      <li>Community engagement and partnerships</li>
      <li>Prayer and spiritual guidance</li>
    </ul>
  </div>
</div>`,
      order: 100,
      isActive: true,
      metadata: {
        name: 'Board Responsibilities',
        description: 'Board responsibilities and governance information'
      }
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'website-content'), boardResponsibilitiesContent)
    console.log('✅ Board responsibilities content added with ID:', docRef.id)

    console.log('✅ Board responsibilities setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up board responsibilities:', error)
  }
}

setupBoardResponsibilities()
