import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'website.db')
const db = new Database(dbPath)

// Sample individual supporters data (you can modify this list)
const individualSupporters = [
  { name: "Mark", link: "" },
  { name: "Jim and staff", link: "" },
  { name: "Matt and staff", link: "" },
  { name: "Chantal", link: "" },
  { name: "Anastasia", link: "" },
  { name: "Racquel", link: "" },
  { name: "Steven", link: "" },
  { name: "Shawn", link: "" },
  { name: "Barb", link: "" },
  { name: "Dario", link: "" },
  { name: "Scott", link: "" },
  { name: "Darby", link: "" },
  { name: "Sam", link: "" },
  { name: "Diana", link: "" },
  { name: "Nathan", link: "" },
  { name: "Jay", link: "" },
  { name: "Lisa", link: "" },
  { name: "Michelle", link: "" },
  { name: "Neal", link: "" },
  { name: "Shelley", link: "" },
  { name: "Kalynn", link: "" },
  { name: "Jerry", link: "" },
  { name: "Charlene", link: "" },
  { name: "Bonni", link: "" },
  { name: "Chris", link: "" },
  { name: "Agnes", link: "" },
  { name: "Rachelle", link: "" },
  { name: "Frances", link: "" },
  { name: "Joe", link: "" },
  { name: "Hunter", link: "" },
  { name: "Kim", link: "" },
  { name: "Ken", link: "" },
  { name: "Benny and staff", link: "" },
  { name: "Larry", link: "" },
  { name: "Terri", link: "" },
  { name: "Kennedy", link: "" },
  { name: "Chuck", link: "" },
  { name: "Jordan", link: "" },
  { name: "Rex", link: "" },
  { name: "JohnMark", link: "" },
  { name: "Eli", link: "" },
  { name: "Thomas", link: "" },
  { name: "Kelly", link: "" },
  { name: "Coy", link: "" },
  { name: "Tim", link: "" },
  { name: "Seth", link: "" },
  { name: "G.G.", link: "" },
  { name: "Rick", link: "" },
  { name: "Wilma", link: "" },
  { name: "Debi", link: "" },
  { name: "Todd", link: "" },
  { name: "Joy", link: "" },
  { name: "Bete", link: "" },
  { name: "Luther", link: "" },
  { name: "Kevin", link: "" },
  { name: "Sherry", link: "" },
  { name: "William", link: "" },
  { name: "Cyndy", link: "" },
  { name: "Brooke", link: "" },
  { name: "Deidra", link: "" },
  { name: "Delores", link: "" },
  { name: "Olivia", link: "" },
  { name: "Audra", link: "" },
  { name: "Rhett", link: "" },
  { name: "Floyd", link: "" },
  { name: "Anita", link: "" },
  { name: "Wendell", link: "" },
  { name: "Tammy", link: "" },
  { name: "Rena", link: "" },
  { name: "Bill", link: "" },
  { name: "Cheryl", link: "" },
  { name: "Daryl", link: "" },
  { name: "Gary", link: "" },
  { name: "Danny", link: "" },
  { name: "Karen", link: "" },
  { name: "Brian", link: "" },
  { name: "Dennis", link: "" },
  { name: "Jicey", link: "" },
  { name: "Frank", link: "" },
  { name: "Sarah", link: "" },
  { name: "Nina", link: "" },
  { name: "Bailey", link: "" },
  { name: "Kristi", link: "" },
  { name: "Scot", link: "" },
  { name: "Dana", link: "" },
  { name: "Jill", link: "" },
  { name: "Christina", link: "" },
  { name: "Haley", link: "" },
  { name: "LifePoint", link: "" },
  { name: "Rodney", link: "" },
  { name: "Jeff", link: "" },
  { name: "David and son", link: "" },
  { name: "Brent", link: "" },
  { name: "Jennifer", link: "" },
  { name: "Scottie", link: "" },
  { name: "Kristin", link: "" },
  { name: "John", link: "" },
  { name: "Megan", link: "" },
  { name: "Matt", link: "" },
  { name: "Andrea", link: "" },
  { name: "Paul", link: "" },
  { name: "Susan", link: "" },
  { name: "Tony", link: "" },
  { name: "Carla", link: "" },
  { name: "Tom", link: "" },
  { name: "Fred", link: "" },
  { name: "Robert", link: "" },
  { name: "Brandon", link: "" },
  { name: "Griffin", link: "" },
  { name: "James", link: "" },
  { name: "Marie", link: "" },
  { name: "Madison", link: "" },
  { name: "Treva", link: "" },
  { name: "Robin", link: "" },
  { name: "Summer", link: "" },
  { name: "Josh", link: "" },
  { name: "Lucas", link: "" },
  { name: "Nathaniel", link: "" },
  { name: "Micah and team", link: "" },
  { name: "Don", link: "" },
  { name: "George", link: "" }
]

async function migrateIndividualSupporters() {
  try {
    console.log('Starting individual supporters migration...')

    // First, remove any existing individual supporters entries
    const deleteStmt = db.prepare(`
      DELETE FROM website_content 
      WHERE section = 'about' 
      AND subsection = 'gratitude' 
      AND metadata LIKE '%Individual Supporter%'
    `)
    deleteStmt.run()
    console.log('Cleared existing individual supporters entries')

    // Insert each supporter as a separate database entry
    const insertStmt = db.prepare(`
      INSERT INTO website_content (
        id, section, subsection, content_type, content, metadata, 
        order_index, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const now = new Date().toISOString()
    
    individualSupporters.forEach((supporter, index) => {
      const supporterId = `gratitude-supporter-${index + 1}`
      const supporterData = {
        name: supporter.name,
        link: supporter.link
      }
      
      insertStmt.run(
        supporterId,
        'about',
        'gratitude',
        'supporter',
        JSON.stringify(supporterData),
        JSON.stringify({
          name: 'Individual Supporter',
          description: `Supporter: ${supporter.name}`,
          supporterName: supporter.name,
          supporterLink: supporter.link
        }),
        index + 1,
        1,
        now,
        now
      )
    })

    console.log(`Successfully migrated ${individualSupporters.length} individual supporters`)
    
    // Verify the migration
    const count = db.prepare(`
      SELECT COUNT(*) as count 
      FROM website_content 
      WHERE section = 'about' 
      AND subsection = 'gratitude' 
      AND metadata LIKE '%Individual Supporter%'
    `).get()
    
    console.log(`Verification: ${(count as any).count} individual supporters in database`)

  } catch (error) {
    console.error('Error migrating individual supporters:', error)
  } finally {
    db.close()
  }
}

migrateIndividualSupporters()
