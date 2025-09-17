import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

// GET - Fetch categories
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    
    const query = 'SELECT * FROM categories ORDER BY name'
    const categories = db.prepare(query).all() as Category[]
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const id = generateId()
    const now = new Date().toISOString()
    
    // Generate slug from name
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const insert = db.prepare(`
      INSERT INTO categories (id, name, slug, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.name,
      slug,
      data.description || null,
      now,
      now
    )
    
    // Return the created category
    const select = db.prepare('SELECT * FROM categories WHERE id = ?')
    const category = select.get(id) as Category
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

// PUT - Update existing category
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const data = await request.json()
    const db = getDatabase()
    const now = new Date().toISOString()
    
    const update = db.prepare(`
      UPDATE categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        updated_at = ?
      WHERE id = ?
    `)
    
    update.run(
      data.name || null,
      data.slug || null,
      data.description || null,
      now,
      id
    )
    
    // Return the updated category
    const select = db.prepare('SELECT * FROM categories WHERE id = ?')
    const category = select.get(id) as Category
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const db = getDatabase()
    
    const deleteQuery = db.prepare('DELETE FROM categories WHERE id = ?')
    const result = deleteQuery.run(id)
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
