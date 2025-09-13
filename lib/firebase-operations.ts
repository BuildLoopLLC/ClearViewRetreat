import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'
import { 
  WebsiteContent, 
  BlogPost, 
  Event, 
  Gallery, 
  GalleryImage, 
  Contact, 
  Registration 
} from '../types/firebase'

// Website content operations
export const websiteContentOperations = {
  async create(content: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const contentData = {
      ...content,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'websiteContent'), contentData)
    return docRef.id
  },

  async getBySection(section: string): Promise<WebsiteContent[]> {
    const q = query(
      collection(db, 'websiteContent'),
      where('section', '==', section),
      orderBy('order', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebsiteContent))
  },

  async getActiveContent(): Promise<WebsiteContent[]> {
    const q = query(
      collection(db, 'websiteContent'),
      where('isActive', '==', true),
      orderBy('section', 'asc'),
      orderBy('order', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebsiteContent))
  },

  async update(id: string, updates: Partial<WebsiteContent>): Promise<void> {
    const docRef = doc(db, 'websiteContent', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'websiteContent', id)
    await deleteDoc(docRef)
  },
}

// Blog post operations
export const blogPostOperations = {
  async create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const postData = {
      ...post,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'blogPosts'), postData)
    return docRef.id
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(
      collection(db, 'blogPosts'),
      where('slug', '==', slug),
      where('published', '==', true)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost
  },

  async getPublished(): Promise<BlogPost[]> {
    const q = query(
      collection(db, 'blogPosts'),
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost))
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<void> {
    const docRef = doc(db, 'blogPosts', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'blogPosts', id)
    await deleteDoc(docRef)
  },
}

// Event operations
export const eventOperations = {
  async create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const eventData = {
      ...event,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'events'), eventData)
    return docRef.id
  },

  async getPublished(): Promise<Event[]> {
    const q = query(
      collection(db, 'events'),
      where('published', '==', true),
      orderBy('startDate', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event))
  },

  async getBySlug(slug: string): Promise<Event | null> {
    const q = query(
      collection(db, 'events'),
      where('slug', '==', slug),
      where('published', '==', true)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as Event
  },

  async update(id: string, updates: Partial<Event>): Promise<void> {
    const docRef = doc(db, 'events', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'events', id)
    await deleteDoc(docRef)
  },
}

// Gallery operations
export const galleryOperations = {
  async create(gallery: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const galleryData = {
      ...gallery,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'galleries'), galleryData)
    return docRef.id
  },

  async getById(id: string): Promise<Gallery | null> {
    const docRef = doc(db, 'galleries', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Gallery
  },

  async getPublished(): Promise<Gallery[]> {
    const q = query(
      collection(db, 'galleries'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Gallery))
  },

  async update(id: string, updates: Partial<Gallery>): Promise<void> {
    const docRef = doc(db, 'galleries', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'galleries', id)
    await deleteDoc(docRef)
  },
}

// Gallery image operations
export const galleryImageOperations = {
  async create(image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const imageData = {
      ...image,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'galleryImages'), imageData)
    return docRef.id
  },

  async getByGalleryId(galleryId: string): Promise<GalleryImage[]> {
    const q = query(
      collection(db, 'galleryImages'),
      where('galleryId', '==', galleryId),
      orderBy('order', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryImage))
  },

  async update(id: string, updates: Partial<GalleryImage>): Promise<void> {
    const docRef = doc(db, 'galleryImages', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'galleryImages', id)
    await deleteDoc(docRef)
  },
}

// Contact operations
export const contactOperations = {
  async create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const contactData = {
      ...contact,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'contacts'), contactData)
    return docRef.id
  },

  async getAll(): Promise<Contact[]> {
    const q = query(
      collection(db, 'contacts'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Contact))
  },

  async markAsRead(id: string): Promise<void> {
    const docRef = doc(db, 'contacts', id)
    await updateDoc(docRef, {
      read: true,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'contacts', id)
    await deleteDoc(docRef)
  },
}

// Registration operations
export const registrationOperations = {
  async create(registration: Omit<Registration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString()
    const registrationData = {
      ...registration,
      createdAt: now,
      updatedAt: now,
    }
    
    const docRef = await addDoc(collection(db, 'registrations'), registrationData)
    return docRef.id
  },

  async getByEventId(eventId: string): Promise<Registration[]> {
    const q = query(
      collection(db, 'registrations'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Registration))
  },

  async update(id: string, updates: Partial<Registration>): Promise<void> {
    const docRef = doc(db, 'registrations', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'registrations', id)
    await deleteDoc(docRef)
  },
}

// Storage operations
export const storageOperations = {
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  },

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  },
}
