import { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } from '@aws-sdk/client-s3'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'clearview-retreat-media'

async function setupPublicReadAccess() {
  try {
    console.log(`Setting up public read access for bucket: ${BUCKET_NAME}`)
    
    // Define the bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    }

    // Apply the bucket policy
    const command = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    })

    await s3Client.send(command)
    console.log('✅ Successfully configured bucket for public read access')
    console.log('📝 Note: Make sure to also enable "Block all public access" settings in the S3 console:')
    console.log('   - Uncheck "Block all public access"')
    console.log('   - Or uncheck "Block public access to buckets and objects granted through new public bucket or access point policies"')
    console.log('   - Or uncheck "Block public access to buckets and objects granted through any public bucket or access point policies"')
    
  } catch (error) {
    console.error('❌ Error setting up public read access:', error)
    
    if (error instanceof Error && error.message.includes('AccessDenied')) {
      console.log('\n🔧 Manual setup required:')
      console.log('1. Go to AWS S3 Console')
      console.log(`2. Select bucket: ${BUCKET_NAME}`)
      console.log('3. Go to "Permissions" tab')
      console.log('4. Scroll down to "Bucket policy"')
      console.log('5. Add this policy:')
      console.log(JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
          }
        ]
      }, null, 2))
      console.log('\n6. Also check "Block public access" settings and uncheck:')
      console.log('   - "Block public access to buckets and objects granted through new public bucket or access point policies"')
    }
  }
}

async function checkCurrentPolicy() {
  try {
    const command = new GetBucketPolicyCommand({
      Bucket: BUCKET_NAME
    })
    
    const result = await s3Client.send(command)
    console.log('Current bucket policy:')
    console.log(JSON.stringify(JSON.parse(result.Policy!), null, 2))
  } catch (error) {
    console.log('No existing bucket policy found')
  }
}

async function main() {
  console.log('🔍 Checking current bucket policy...')
  await checkCurrentPolicy()
  
  console.log('\n🚀 Setting up public read access...')
  await setupPublicReadAccess()
}

main().catch(console.error)
