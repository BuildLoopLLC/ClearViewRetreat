import { config } from 'dotenv'
import { DescribeTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Define table names to check
const TABLES = {
  WEBSITE_CONTENT: 'clearview-website-content',
  BLOG_POSTS: 'clearview-blog-posts',
  EVENTS: 'clearview-events',
  GALLERIES: 'clearview-galleries',
  GALLERY_IMAGES: 'clearview-gallery-images',
  CONTACTS: 'clearview-contacts',
  REGISTRATIONS: 'clearview-registrations',
} as const

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function checkTables() {
  console.log('🔍 Checking DynamoDB tables status...')
  console.log('AWS Region:', process.env.AWS_REGION)
  console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set')
  console.log('AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set')

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found. Please check your .env.local file.')
    return
  }

  try {
    // List all tables first
    const listResponse = await client.send(new ListTablesCommand({}))
    const existingTables = listResponse.TableNames || []
    
    console.log(`\n📋 Found ${existingTables.length} tables in the region:`)
    existingTables.forEach(table => console.log(`  - ${table}`))

    // Check specific tables we expect
    console.log('\n🔍 Checking expected tables:')
    
    for (const [key, tableName] of Object.entries(TABLES)) {
      try {
        const describeResponse = await client.send(new DescribeTableCommand({
          TableName: tableName
        }))
        
        const table = describeResponse.Table!
        const status = table.TableStatus
        const itemCount = table.ItemCount || 0
        const sizeBytes = table.TableSizeBytes || 0
        
        console.log(`✅ ${key}: ${tableName}`)
        console.log(`   Status: ${status}`)
        console.log(`   Items: ${itemCount.toLocaleString()}`)
        console.log(`   Size: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`)
        
        if (table.GlobalSecondaryIndexes && table.GlobalSecondaryIndexes.length > 0) {
          console.log(`   GSIs: ${table.GlobalSecondaryIndexes.length}`)
        }
        
      } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
          console.log(`❌ ${key}: ${tableName} - Table not found`)
        } else if (error.name === 'AccessDeniedException') {
          console.log(`🚫 ${key}: ${tableName} - Access denied (insufficient permissions)`)
        } else {
          console.log(`⚠️  ${key}: ${tableName} - Error: ${error.message}`)
        }
      }
    }

    console.log('\n🎯 Summary:')
    const expectedTables = Object.values(TABLES)
    const foundTables = expectedTables.filter(table => existingTables.includes(table))
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))
    
    console.log(`   Expected: ${expectedTables.length}`)
    console.log(`   Found: ${foundTables.length}`)
    console.log(`   Missing: ${missingTables.length}`)
    
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables:')
      missingTables.forEach(table => console.log(`   - ${table}`))
    }
    
    if (foundTables.length === expectedTables.length) {
      console.log('\n🎉 All expected tables are present!')
    }

  } catch (error: any) {
    if (error.name === 'AccessDeniedException') {
      console.error('❌ Access denied. Check your AWS permissions.')
      console.error('   You need at least: dynamodb:ListTables, dynamodb:DescribeTable')
    } else {
      console.error('❌ Error checking tables:', error.message)
    }
  }
}

// Run if called directly
if (require.main === module) {
  checkTables()
}

export { checkTables }
