import { config } from 'dotenv'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { TABLES } from '../lib/dynamodb'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Create document client for easier operations
const dynamoClient = DynamoDBDocumentClient.from(client)

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting cleanup of duplicate entries...')
    
    // Scan all content
    const scanCommand = new ScanCommand({
      TableName: TABLES.WEBSITE_CONTENT,
    })
    
    const result = await dynamoClient.send(scanCommand)
    const items = result.Items || []
    
    console.log(`📊 Found ${items.length} total items`)
    
    // Group by section and subsection to find duplicates
    const grouped = new Map<string, any[]>()
    
    items.forEach(item => {
      const key = `${item.section}-${item.subsection}`
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(item)
    })
    
    // Find duplicates (keep the one with the earliest createdAt)
    let duplicatesToDelete = 0
    
    for (const [key, group] of grouped.entries()) {
      if (group.length > 1) {
        console.log(`🔄 Found ${group.length} duplicates for ${key}`)
        
        // Sort by createdAt and keep the earliest one
        group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        
        // Delete all but the first (earliest) one
        const toDelete = group.slice(1)
        duplicatesToDelete += toDelete.length
        
        for (const duplicate of toDelete) {
          console.log(`🗑️ Deleting duplicate: ${duplicate.id} (${duplicate.createdAt})`)
          
          const deleteCommand = new DeleteCommand({
            TableName: TABLES.WEBSITE_CONTENT,
            Key: { id: duplicate.id }
          })
          
          await dynamoClient.send(deleteCommand)
        }
      }
    }
    
    console.log(`✅ Cleanup completed! Deleted ${duplicatesToDelete} duplicate entries`)
    
    // Show final count
    const finalScan = await dynamoClient.send(scanCommand)
    console.log(`📊 Final count: ${finalScan.Items?.length || 0} items`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanupDuplicates()
