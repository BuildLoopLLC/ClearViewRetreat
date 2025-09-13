import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Load environment variables
config({ path: '.env.local' })

async function addAdminUser() {
  console.log('🔐 Adding Admin User...')
  
  try {
    // Check if Firebase Admin is configured
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Firebase Admin configuration missing. Please check your .env.local file.')
    }

    // Initialize Firebase Admin if not already initialized
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }

    const auth = getAuth()
    
    // Get email and password from command line arguments
    const email = process.argv[2]
    const password = process.argv[3]
    const displayName = process.argv[4] || 'Admin User'
    
    if (!email || !password) {
      console.log('Usage: npx tsx scripts/add-admin-user.ts <email> <password> [displayName]')
      console.log('Example: npx tsx scripts/add-admin-user.ts john@example.com MyPassword123 "John Admin"')
      process.exit(1)
    }
    
    console.log(`👤 Adding admin user: ${email}`)
    
    try {
      // Try to create the admin user
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: displayName,
        emailVerified: true,
      })
      
      // Set custom claims for admin role
      await auth.setCustomUserClaims(userRecord.uid, { 
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin']
      })
      
      console.log('✅ Admin user created successfully!')
      console.log(`📧 Email: ${email}`)
      console.log(`🔑 Password: ${password}`)
      console.log(`👤 Display Name: ${displayName}`)
      console.log(`🆔 UID: ${userRecord.uid}`)
      console.log('⚠️  Please save these credentials securely!')
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log('ℹ️  User already exists. Updating to admin role...')
        
        // Get the existing user
        const userRecord = await auth.getUserByEmail(email)
        
        // Update custom claims
        await auth.setCustomUserClaims(userRecord.uid, { 
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        })
        
        console.log('✅ User updated to admin successfully!')
        console.log(`📧 Email: ${email}`)
        console.log(`👤 Display Name: ${userRecord.displayName || displayName}`)
        console.log(`🆔 UID: ${userRecord.uid}`)
      } else {
        throw error
      }
    }
    
    console.log('\n🎉 Admin user setup complete!')
    console.log('The user can now log in to the admin panel.')
    
  } catch (error: any) {
    console.error('❌ Admin user setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
addAdminUser()
