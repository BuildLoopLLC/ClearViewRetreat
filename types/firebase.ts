// Firebase Firestore data models

export interface WebsiteContent {
  id: string
  section: string
  subsection?: string
  contentType: 'text' | 'image' | 'video' | 'link'
  content: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  mainImage?: string
  thumbnail?: string
  authorName: string
  authorEmail: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  content: string
  featuredImage?: string
  startDate: string
  endDate: string
  location: string
  maxAttendees?: number
  currentAttendees: number
  price: number
  authorName: string
  authorEmail: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
}

export interface Gallery {
  id: string
  title: string
  description: string
  featuredImage?: string
  authorName: string
  authorEmail: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
}

export interface GalleryImage {
  id: string
  galleryId: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface Registration {
  id: string
  eventId: string
  attendeeName: string
  attendeeEmail: string
  attendeePhone?: string
  emergencyContact?: string
  emergencyPhone?: string
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentId?: string
  createdAt: string
  updatedAt: string
}
