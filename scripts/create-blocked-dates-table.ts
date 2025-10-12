import { getDatabase } from '../lib/sqlite'

async function createBlockedDatesTable() {
  try {
    const db = getDatabase()
    
    console.log('🚀 Creating blocked dates table...')
    
    // Create blocked_dates table
    const createBlockedDatesTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS blocked_dates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        reason TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    createBlockedDatesTable.run()
    console.log('✅ Blocked dates table created successfully!')
    
    // Insert some sample blocked date ranges
    const sampleBlockedDates = [
      {
        id: 'blocked_2024_holidays',
        title: 'Holiday Season',
        startDate: '2024-12-20',
        endDate: '2024-12-31',
        reason: 'Holiday break - facility closed',
        isActive: 1
      },
      {
        id: 'blocked_2024_maintenance',
        title: 'Facility Maintenance',
        startDate: '2024-11-01',
        endDate: '2024-11-05',
        reason: 'Annual facility maintenance and repairs',
        isActive: 1
      },
      {
        id: 'blocked_2024_staff_retreat',
        title: 'Staff Retreat',
        startDate: '2024-09-15',
        endDate: '2024-09-17',
        reason: 'Internal staff retreat - facility unavailable',
        isActive: 1
      }
    ]
    
    console.log('📝 Inserting sample blocked date ranges...')
    
    const insertBlockedDate = db.prepare(`
      INSERT OR REPLACE INTO blocked_dates (
        id, title, start_date, end_date, reason, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    
    for (const blockedDate of sampleBlockedDates) {
      insertBlockedDate.run(
        blockedDate.id,
        blockedDate.title,
        blockedDate.startDate,
        blockedDate.endDate,
        blockedDate.reason,
        blockedDate.isActive
      )
    }
    
    console.log('✅ Sample blocked date ranges inserted successfully!')
    
    // Verify blocked dates were created
    const blockedCount = db.prepare('SELECT COUNT(*) as count FROM blocked_dates').get()
    console.log(`📊 Total blocked date ranges in database: ${blockedCount.count}`)
    
    console.log('\n🎉 Blocked dates table setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Failed to create blocked dates table:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  createBlockedDatesTable()
}

export { createBlockedDatesTable }
