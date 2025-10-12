import { getDatabase } from '../lib/sqlite'

async function createEventsTable() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Creating events table...')
    
    // Create events table
    const createEventsTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('family-camp', 'marriage-retreat', 'ministry-event', 'grieving-retreat', 'family-mission-trip', 'special-event')),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        description TEXT,
        max_attendees INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    createEventsTable.run()
    console.log('✅ Events table created successfully!')
    
    // Insert some sample events
    const sampleEvents = [
      {
        id: 'event_2024_spring_family_camp',
        title: 'Spring Family Camp',
        type: 'family-camp',
        startDate: '2024-03-15',
        endDate: '2024-03-17',
        description: 'A wonderful weekend retreat for families to connect and grow together.',
        maxAttendees: 50,
        isActive: 1
      },
      {
        id: 'event_2024_marriage_retreat',
        title: 'Marriage Retreat Weekend',
        type: 'marriage-retreat',
        startDate: '2024-04-05',
        endDate: '2024-04-07',
        description: 'Strengthen your marriage with this intimate retreat for couples.',
        maxAttendees: 20,
        isActive: 1
      },
      {
        id: 'event_2024_pastor_retreat',
        title: 'Pastor & Missionary Retreat',
        type: 'ministry-event',
        startDate: '2024-05-10',
        endDate: '2024-05-12',
        description: 'A time of rest and renewal for ministry leaders.',
        maxAttendees: 30,
        isActive: 1
      },
      {
        id: 'event_2024_grieving_retreat',
        title: 'Grieving Families Retreat',
        type: 'grieving-retreat',
        startDate: '2024-06-14',
        endDate: '2024-06-16',
        description: 'A supportive environment for families dealing with loss.',
        maxAttendees: 15,
        isActive: 1
      },
      {
        id: 'event_2024_mission_trip',
        title: 'Family Mission Trip',
        type: 'family-mission-trip',
        startDate: '2024-07-20',
        endDate: '2024-07-27',
        description: 'Serve together as a family in this week-long mission experience.',
        maxAttendees: 25,
        isActive: 1
      }
    ]
    
    console.log('📝 Inserting sample events...')
    
    const insertEvent = db.prepare(`
      INSERT OR REPLACE INTO events (
        id, title, type, start_date, end_date, description, 
        max_attendees, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    
    for (const event of sampleEvents) {
      insertEvent.run(
        event.id,
        event.title,
        event.type,
        event.startDate,
        event.endDate,
        event.description,
        event.maxAttendees,
        event.isActive
      )
    }
    
    console.log('✅ Sample events inserted successfully!')
    
    // Verify events were created
    const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get()
    console.log(`📊 Total events in database: ${eventCount.count}`)
    
    console.log('\n🎉 Events table setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Failed to create events table:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  createEventsTable()
}

export { createEventsTable }
