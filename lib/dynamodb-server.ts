import { config } from 'dotenv'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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
export const dynamoClient = DynamoDBDocumentClient.from(client)

// Re-export table names for convenience
export { TABLES } from './dynamodb'
