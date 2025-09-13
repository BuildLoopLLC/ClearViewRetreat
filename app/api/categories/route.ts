import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import fs from 'fs'
import path from 'path'

// Helper function to log activities
async function logActivity(activityData: {
  action: string
  item: string
  section?: string
  user: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    })
    
    if (!response.ok) {
      console.error('Failed to log activity:', await response.text())
    }
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  createdAt: string
  updatedAt: string
}

// Initialize Firestore
const db = adminDb

// File-based storage as fallback
const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Load categories from file
function loadCategoriesFromFile(): Category[] {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading categories from file:', error)
  }
  return []
}

// Save categories to file
function saveCategoriesToFile(categories: Category[]): void {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
  } catch (error) {
    console.error('Error saving categories to file:', error)
  }
}

// Default categories for initialization
const defaultCategories: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Retreats', 
    slug: 'retreats', 
    description: 'Retreat experiences and programs', 
    color: 'bg-blue-100 text-blue-800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-2', 
    name: 'Wellness', 
    slug: 'wellness', 
    description: 'Health and wellness topics', 
    color: 'bg-green-100 text-green-800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-3', 
    name: 'Events', 
    slug: 'events', 
    description: 'Upcoming events and activities', 
    color: 'bg-purple-100 text-purple-800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-4', 
    name: 'News', 
    slug: 'news', 
    description: 'Latest news and updates', 
    color: 'bg-orange-100 text-orange-800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-5', 
    name: 'Tips & Advice', 
    slug: 'tips', 
    description: 'Helpful tips and guidance', 
    color: 'bg-pink-100 text-pink-800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Initialize default categories if they don't exist
async function initializeDefaultCategories() {
  try {
    const categoriesSnapshot = await db.collection('categories').get()
    if (categoriesSnapshot.empty) {
      // Add default categories to Firestore
      const batch = db.batch()
      defaultCategories.forEach(category => {
        const docRef = db.collection('categories').doc(category.id)
        batch.set(docRef, category)
      })
      await batch.commit()
      console.log('Default categories initialized')
    }
  } catch (error) {
    console.error('Error initializing default categories:', error)
  }
}

export async function GET() {
  try {
    // Try Firestore first
    try {
      await initializeDefaultCategories()
      const categoriesSnapshot = await db.collection('categories').orderBy('createdAt', 'asc').get()
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[]
      
      return NextResponse.json(categories, {
        headers: {
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      })
    } catch (firestoreError) {
      console.log('Firestore not available, using file storage:', firestoreError)
      
      // Fallback to file storage
      let categories = loadCategoriesFromFile()
      
      // Initialize default categories if file is empty
      if (categories.length === 0) {
        categories = defaultCategories
        saveCategoriesToFile(categories)
      }
      
      return NextResponse.json(categories, {
        headers: {
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      })
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Try Firestore first
    try {
      // Check if category with same slug already exists
      const existingCategory = await db.collection('categories')
        .where('slug', '==', data.slug)
        .limit(1)
        .get()
      
      if (!existingCategory.empty) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        )
      }

      // Create new category in Firestore
      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        color: data.color || 'bg-blue-100 text-blue-800',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = await db.collection('categories').add(categoryData)
      const newCategory: Category = {
        id: docRef.id,
        ...categoryData
      }

      // Log activity
      await logActivity({
        action: 'Category created',
        item: data.name,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Created new category: ${data.name}`,
        type: 'category'
      })

      return NextResponse.json(newCategory, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    } catch (firestoreError) {
      console.log('Firestore not available, using file storage:', firestoreError)
      
      // Fallback to file storage
      let categories = loadCategoriesFromFile()
      
      // Check if category with same slug already exists
      const existingCategory = categories.find(cat => cat.slug === data.slug)
      if (existingCategory) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        )
      }

      // Create new category
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        color: data.color || 'bg-blue-100 text-blue-800',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      categories.push(newCategory)
      saveCategoriesToFile(categories)

      // Log activity
      await logActivity({
        action: 'Category created',
        item: data.name,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Created new category: ${data.name}`,
        type: 'category'
      })

      return NextResponse.json(newCategory, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    }
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id } = data
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Try Firestore first
    try {
      // Check if category exists
      const categoryDoc = await db.collection('categories').doc(id).get()
      if (!categoryDoc.exists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      // Check if slug is being changed and if new slug already exists
      if (data.slug && data.slug !== categoryDoc.data()?.slug) {
        const existingCategory = await db.collection('categories')
          .where('slug', '==', data.slug)
          .limit(1)
          .get()
        
        if (!existingCategory.empty) {
          return NextResponse.json(
            { error: 'A category with this slug already exists' },
            { status: 400 }
          )
        }
      }

      // Update category in Firestore
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }

      await db.collection('categories').doc(id).update(updateData)
      
      const updatedCategory: Category = {
        id,
        ...categoryDoc.data(),
        ...updateData
      } as Category

      // Log activity
      await logActivity({
        action: 'Category updated',
        item: data.name || categoryDoc.data()?.name,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Updated category: ${data.name || categoryDoc.data()?.name}`,
        type: 'category'
      })

      return NextResponse.json(updatedCategory, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    } catch (firestoreError) {
      console.log('Firestore not available, using file storage:', firestoreError)
      
      // Fallback to file storage
      let categories = loadCategoriesFromFile()
      const categoryIndex = categories.findIndex(cat => cat.id === id)
      
      if (categoryIndex === -1) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      // Check if slug is being changed and if new slug already exists
      if (data.slug && data.slug !== categories[categoryIndex].slug) {
        const existingCategory = categories.find(cat => cat.slug === data.slug)
        if (existingCategory) {
          return NextResponse.json(
            { error: 'A category with this slug already exists' },
            { status: 400 }
          )
        }
      }

      // Update category
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }

      categories[categoryIndex] = {
        ...categories[categoryIndex],
        ...updateData
      }

      saveCategoriesToFile(categories)

      // Log activity
      await logActivity({
        action: 'Category updated',
        item: data.name || categories[categoryIndex].name,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Updated category: ${data.name || categories[categoryIndex].name}`,
        type: 'category'
      })

      return NextResponse.json(categories[categoryIndex], {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    }
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Try Firestore first
    try {
      // Get category data before deleting
      const categoryDoc = await db.collection('categories').doc(id).get()
      if (!categoryDoc.exists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const categoryData = categoryDoc.data()

      // Delete category from Firestore
      await db.collection('categories').doc(id).delete()

      // Log activity
      await logActivity({
        action: 'Category deleted',
        item: categoryData?.name || `Category ${id}`,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Deleted category: ${categoryData?.name || id}`,
        type: 'category'
      })

      return NextResponse.json({ success: true }, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    } catch (firestoreError) {
      console.log('Firestore not available, using file storage:', firestoreError)
      
      // Fallback to file storage
      let categories = loadCategoriesFromFile()
      const categoryIndex = categories.findIndex(cat => cat.id === id)
      
      if (categoryIndex === -1) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const categoryData = categories[categoryIndex]

      // Delete category
      categories.splice(categoryIndex, 1)
      saveCategoriesToFile(categories)

      // Log activity
      await logActivity({
        action: 'Category deleted',
        item: categoryData.name || `Category ${id}`,
        section: 'blog',
        user: 'admin@clearviewretreat.com', // In production, get from auth
        details: `Deleted category: ${categoryData.name || id}`,
        type: 'category'
      })

      return NextResponse.json({ success: true }, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
