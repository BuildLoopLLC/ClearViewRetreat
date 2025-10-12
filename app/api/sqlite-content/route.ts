import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

// GET - Fetch content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const subsection = searchParams.get('subsection')
    const id = searchParams.get('id')
    
    const db = getDatabase()
    
    // If ID is provided, fetch single item by ID
    if (id) {
      const query = 'SELECT * FROM website_content WHERE id = ?'
      const row = db.prepare(query).get(id) as any
      
      if (!row) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        )
      }
      
      // Convert metadata from JSON string back to object and normalize field names
      const content = {
        ...row,
        contentType: row.content_type, // Convert content_type to contentType
        order: row.order_index, // Convert order_index to order
        isActive: row.is_active === 1, // Convert is_active to isActive boolean
        createdAt: row.created_at, // Convert created_at to createdAt
        updatedAt: row.updated_at, // Convert updated_at to updatedAt
        metadata: row.metadata ? JSON.parse(row.metadata) : {}
      }
      
      return NextResponse.json(content)
    }
    
    // Otherwise, fetch by section (existing logic)
    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      )
    }
    
    let query = 'SELECT * FROM website_content WHERE section = ? AND is_active = 1'
    let params: any[] = [section]
    
    if (subsection) {
      query += ' AND subsection = ?'
      params.push(subsection)
    }
    
    query += ' ORDER BY order_index, created_at'
    
    const rows = db.prepare(query).all(...params)
    
    // Convert metadata from JSON string back to object and normalize field names
    const content = rows.map((row: any) => ({
      ...row,
      contentType: row.content_type, // Convert content_type to contentType
      order: row.order_index, // Convert order_index to order
      isActive: row.is_active === 1, // Convert is_active to isActive boolean
      createdAt: row.created_at, // Convert created_at to createdAt
      updatedAt: row.updated_at, // Convert updated_at to updatedAt
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }))
    
    return NextResponse.json(content)
  } catch (error: any) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const db = getDatabase()
    const id = generateId()
    
    const insert = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, 
        metadata, order_index, is_active, user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.section,
      data.subsection || null,
      data.contentType || 'text',
      data.content,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.order || 0,
      data.isActive !== false ? 1 : 0,
      data.user || 'admin@clearviewretreat.com'
    )
    
    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}

// PUT - Update existing content
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const db = getDatabase()
    
    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    
    if (data.content !== undefined) {
      updates.push('content = ?')
      values.push(data.content)
    }
    if (data.metadata !== undefined) {
      updates.push('metadata = ?')
      values.push(JSON.stringify(data.metadata))
    }
    if (data.order !== undefined) {
      updates.push('order_index = ?')
      values.push(data.order)
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?')
      values.push(data.isActive ? 1 : 0)
    }
    if (data.user) {
      updates.push('user = ?')
      values.push(data.user)
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const updateQuery = `UPDATE website_content SET ${updates.join(', ')} WHERE id = ?`
    const result = db.prepare(updateQuery).run(...values)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE - Delete content
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
    const result = db.prepare('DELETE FROM website_content WHERE id = ?').run(id)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
