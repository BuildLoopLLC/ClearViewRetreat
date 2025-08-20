// Base interface for all items
export interface BaseItem {
  id: string
  createdAt: string
  updatedAt: string
}

// Website content model for editable static content
export interface WebsiteContent extends BaseItem {
  section: string // e.g., 'hero', 'about', 'features', 'footer'
  subsection?: string // e.g., 'tagline', 'headline', 'description'
  contentType: 'text' | 'image' | 'link' | 'html'
  content: string // The actual content (text, image URL, HTML, etc.)
  order: number // For ordering within a section
  isActive: boolean // Whether this content is currently displayed
  metadata?: Record<string, any> // Additional data like alt text, target URL, etc.
}

// Blog post model
export interface BlogPost extends BaseItem {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  published: boolean
  publishedAt?: string
  authorName: string
}

// Event model
export interface Event extends BaseItem {
  title: string
  slug: string
  description: string
  content?: string
  startDate: string
  endDate: string
  location?: string
  featuredImage?: string
  registrationRequired: boolean
  maxParticipants?: number
  currentParticipants: number
  published: boolean
  authorName: string
}

// Gallery model
export interface Gallery extends BaseItem {
  title: string
  description?: string
  featuredImage?: string
  authorName: string
}

// Gallery image model
export interface GalleryImage extends BaseItem {
  title?: string
  altText?: string
  url: string
  order: number
  galleryId: string
}

// Contact model
export interface Contact extends BaseItem {
  name: string
  email: string
  phone?: string
  message: string
  read: boolean
}

// Registration model
export interface Registration extends BaseItem {
  eventId: string
  eventTitle: string
  name: string
  email: string
  phone?: string
  numberOfPeople: number
  specialRequests?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST'
}

// Admin authentication (simple password-based)
export interface AdminAuth {
  username: string
  passwordHash: string
  lastLogin?: string
}

// DynamoDB specific types
export interface DynamoDBItem<T> {
  PK: string // Partition key
  SK: string // Sort key
  data: T
  GSI1PK?: string // Global Secondary Index 1 Partition Key
  GSI1SK?: string // Global Secondary Index 1 Sort Key
  GSI2PK?: string // Global Secondary Index 2 Partition Key
  GSI2SK?: string // Global Secondary Index 2 Sort Key
}
