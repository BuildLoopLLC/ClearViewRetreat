import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

// GET - Fetch staff members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const db = getDatabase()
    
    let query = 'SELECT * FROM staff_members'
    if (!includeInactive) {
      query += ' WHERE is_active = 1'
    }
    query += ' ORDER BY order_index ASC, created_at ASC'
    
    const rows = db.prepare(query).all()
    
    // Format the response
    const staff = (rows as any[]).map(row => ({
      id: row.id,
      name: row.name,
      title: row.title,
      email: row.email,
      phone: row.phone,
      bio: row.bio,
      imageUrl: row.image_url,
      order: row.order_index,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
    
    return NextResponse.json(staff)
  } catch (error: any) {
    console.error('Error fetching staff members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff members' },
      { status: 500 }
    )
  }
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400 }
      )
    }
    
    const db = getDatabase()
    const id = generateId()
    
    // Get current max order
    const maxOrderResult = db.prepare(
      'SELECT MAX(order_index) as maxOrder FROM staff_members'
    ).get() as { maxOrder: number | null }
    const newOrder = data.order ?? ((maxOrderResult?.maxOrder ?? -1) + 1)
    
    const insert = db.prepare(`
      INSERT INTO staff_members (
        id, name, title, email, phone, bio, image_url, order_index, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.name,
      data.title,
      data.email || null,
      data.phone || null,
      data.bio || null,
      data.imageUrl || null,
      newOrder,
      data.isActive !== false ? 1 : 0
    )
    
    return NextResponse.json({ 
      success: true, 
      id,
      order: newOrder
    })
  } catch (error: any) {
    console.error('Error creating staff member:', error)
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    )
  }
}

// PUT - Update staff member(s)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    const db = getDatabase()
    const data = await request.json()
    
    // Handle bulk reorder action
    if (action === 'reorder' && Array.isArray(data.staff)) {
      const updateOrder = db.prepare(
        'UPDATE staff_members SET order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
      
      const transaction = db.transaction((staffList: { id: string; order: number }[]) => {
        for (const member of staffList) {
          updateOrder.run(member.order, member.id)
        }
      })
      
      transaction(data.staff)
      
      return NextResponse.json({ success: true })
    }
    
    // Handle single staff member update
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    
    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    if (data.email !== undefined) {
      updates.push('email = ?')
      values.push(data.email)
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?')
      values.push(data.phone)
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?')
      values.push(data.bio)
    }
    if (data.imageUrl !== undefined) {
      updates.push('image_url = ?')
      values.push(data.imageUrl)
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
    
    const updateQuery = `UPDATE staff_members SET ${updates.join(', ')} WHERE id = ?`
    const result = db.prepare(updateQuery).run(...values)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating staff member:', error)
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete staff member
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
    
    // Get the staff member info before deleting
    const member = db.prepare('SELECT * FROM staff_members WHERE id = ?').get(id) as any
    
    if (!member) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      )
    }
    
    // Delete from database
    const result = db.prepare('DELETE FROM staff_members WHERE id = ?').run(id)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Failed to delete staff member' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      deletedMember: {
        imageUrl: member.image_url
      }
    })
  } catch (error: any) {
    console.error('Error deleting staff member:', error)
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    )
  }
}

