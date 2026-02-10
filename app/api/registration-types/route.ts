import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

export interface RegistrationEventType {
  id: string
  name: string
  description: string | null
  form_link: string | null
  pdf_link: string | null
  order_index: number
  is_active: boolean
}

// GET - Get all registration event types
export async function GET() {
  try {
    const db = getDatabase()
    const types = db.prepare(`
      SELECT * FROM registration_event_types 
      ORDER BY order_index ASC
    `).all() as any[]

    return NextResponse.json(types.map(t => ({
      ...t,
      is_active: Boolean(t.is_active)
    })))
  } catch (error: any) {
    console.error('Error fetching registration types:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new registration event type
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const db = getDatabase()
    const id = generateId()

    // Get the max order_index
    const maxOrder = db.prepare('SELECT MAX(order_index) as max FROM registration_event_types').get() as any
    const orderIndex = (maxOrder?.max || 0) + 1

    db.prepare(`
      INSERT INTO registration_event_types (id, name, description, form_link, pdf_link, order_index, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      data.name,
      data.description || null,
      data.form_link || null,
      data.pdf_link || null,
      orderIndex
    )

    return NextResponse.json({ 
      success: true, 
      id,
      type: {
        id,
        name: data.name,
        description: data.description || null,
        form_link: data.form_link || null,
        pdf_link: data.pdf_link || null,
        order_index: orderIndex,
        is_active: true
      }
    })
  } catch (error: any) {
    console.error('Error creating registration type:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a registration event type
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = getDatabase()

    // Handle reorder action
    if (action === 'reorder') {
      const { items } = data
      if (!items || !Array.isArray(items)) {
        return NextResponse.json({ error: 'Items array is required' }, { status: 400 })
      }

      const updateStmt = db.prepare('UPDATE registration_event_types SET order_index = ? WHERE id = ?')
      
      for (let i = 0; i < items.length; i++) {
        updateStmt.run(i, items[i].id)
      }

      return NextResponse.json({ success: true })
    }

    // Regular update
    db.prepare(`
      UPDATE registration_event_types 
      SET name = ?, description = ?, form_link = ?, pdf_link = ?, is_active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name,
      data.description || null,
      data.form_link || null,
      data.pdf_link || null,
      data.is_active ? 1 : 0,
      id
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating registration type:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete a registration event type
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = getDatabase()
    db.prepare('DELETE FROM registration_event_types WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting registration type:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

