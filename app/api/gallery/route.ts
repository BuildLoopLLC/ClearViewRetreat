import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

// Valid gallery types
const GALLERY_TYPES = ['retreat-center', 'events', 'nature', 'community', 'cabins'] as const
type GalleryType = typeof GALLERY_TYPES[number]

// GET - Fetch gallery images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const galleryType = searchParams.get('type') as GalleryType | null
    const category = searchParams.get('category')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const db = getDatabase()
    
    let query = 'SELECT * FROM gallery_images WHERE 1=1'
    const params: any[] = []
    
    if (galleryType) {
      if (!GALLERY_TYPES.includes(galleryType)) {
        return NextResponse.json(
          { error: 'Invalid gallery type' },
          { status: 400 }
        )
      }
      query += ' AND gallery_type = ?'
      params.push(galleryType)
    }
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    if (!includeInactive) {
      query += ' AND is_active = 1'
    }
    
    query += ' ORDER BY order_index ASC, created_at DESC'
    
    const rows = db.prepare(query).all(...params)
    
    // Format the response
    const images = (rows as any[]).map(row => ({
      id: row.id,
      galleryType: row.gallery_type,
      title: row.title,
      description: row.description,
      url: row.url,
      thumbnailUrl: row.thumbnail_url,
      category: row.category,
      order: row.order_index,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
    
    return NextResponse.json(images)
  } catch (error: any) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

// POST - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.galleryType || !data.title || !data.url) {
      return NextResponse.json(
        { error: 'Gallery type, title, and URL are required' },
        { status: 400 }
      )
    }
    
    if (!GALLERY_TYPES.includes(data.galleryType)) {
      return NextResponse.json(
        { error: 'Invalid gallery type' },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    const id = generateId()
    
    // Get current max order for this gallery type
    const maxOrderResult = db.prepare(
      'SELECT MAX(order_index) as maxOrder FROM gallery_images WHERE gallery_type = ?'
    ).get(data.galleryType) as { maxOrder: number | null }
    const newOrder = data.order ?? ((maxOrderResult?.maxOrder ?? -1) + 1)
    
    const insert = db.prepare(`
      INSERT INTO gallery_images (
        id, gallery_type, title, description, url, thumbnail_url, 
        category, order_index, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.galleryType,
      data.title,
      data.description || null,
      data.url,
      data.thumbnailUrl || null,
      data.category || null,
      newOrder,
      data.isActive !== false ? 1 : 0
    )
    
    return NextResponse.json({ 
      success: true, 
      id,
      order: newOrder
    })
  } catch (error: any) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}

// PUT - Update gallery image(s)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    const db = getDatabase()
    const data = await request.json()
    
    // Handle bulk reorder action
    if (action === 'reorder' && Array.isArray(data.images)) {
      const updateOrder = db.prepare(
        'UPDATE gallery_images SET order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
      
      const transaction = db.transaction((images: { id: string; order: number }[]) => {
        for (const image of images) {
          updateOrder.run(image.order, image.id)
        }
      })
      
      transaction(data.images)
      
      return NextResponse.json({ success: true })
    }
    
    // Handle single image update
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.url !== undefined) {
      updates.push('url = ?')
      values.push(data.url)
    }
    if (data.thumbnailUrl !== undefined) {
      updates.push('thumbnail_url = ?')
      values.push(data.thumbnailUrl)
    }
    if (data.category !== undefined) {
      updates.push('category = ?')
      values.push(data.category)
    }
    if (data.order !== undefined) {
      updates.push('order_index = ?')
      values.push(data.order)
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?')
      values.push(data.isActive ? 1 : 0)
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const updateQuery = `UPDATE gallery_images SET ${updates.join(', ')} WHERE id = ?`
    const result = db.prepare(updateQuery).run(...values)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}

// DELETE - Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    
    // Get the image info before deleting (for cleanup)
    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(id) as any
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // Delete from database
    const result = db.prepare('DELETE FROM gallery_images WHERE id = ?').run(id)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      deletedImage: {
        url: image.url,
        thumbnailUrl: image.thumbnail_url
      }
    })
  } catch (error: any) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
}

