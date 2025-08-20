// Table names - safe for client-side import
export const TABLES = {
  WEBSITE_CONTENT: 'clearview-website-content',
  BLOG_POSTS: 'clearview-blog-posts',
  EVENTS: 'clearview-events',
  GALLERIES: 'clearview-galleries',
  GALLERY_IMAGES: 'clearview-gallery-images',
  CONTACTS: 'clearview-contacts',
  REGISTRATIONS: 'clearview-registrations',
} as const

// Note: DynamoDB client initialization moved to dynamodb-server.ts
// This file is safe for client-side imports
