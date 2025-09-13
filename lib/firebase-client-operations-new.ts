import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { WebsiteContent } from '../types/firebase'

// Initialize Firebase client
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

// Website content operations (client-side, read-only)
export const websiteContentOperations = {
  async getBySection(section: string): Promise<WebsiteContent[]> {
    const q = query(
      collection(db, 'websiteContent'),
      where('section', '==', section)
    )
    
    const querySnapshot = await getDocs(q)
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebsiteContent))
    
    // Sort by order after fetching
    return results.sort((a, b) => a.order - b.order)
  },

  async getActiveContent(): Promise<WebsiteContent[]> {
    const q = query(
      collection(db, 'websiteContent'),
      where('isActive', '==', true)
    )
    
    const querySnapshot = await getDocs(q)
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebsiteContent))
    
    // Sort by section and order after fetching
    return results.sort((a, b) => {
      if (a.section !== b.section) {
        return a.section.localeCompare(b.section)
      }
      return a.order - b.order
    })
  },
}
