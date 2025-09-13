import { 
  collection, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore'
import { db } from './firebase-client'
import { WebsiteContent } from '../types/firebase'

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
