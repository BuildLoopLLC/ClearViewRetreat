import { config } from 'dotenv'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Load environment variables
config({ path: '.env.local' })

async function setupFirebaseAdmin() {
  console.log('🔐 Setting up Firebase Admin...')
  
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
    
    // Admin user details
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@clearviewretreat.org'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
    
    console.log(`👤 Creating admin user: ${adminEmail}`)
    
    try {
      // Try to create the admin user
      const userRecord = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'ClearView Admin',
        emailVerified: true,
      })
      
      // Set custom claims for admin role
      await auth.setCustomUserClaims(userRecord.uid, { 
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin']
      })
      
      console.log('✅ Admin user created successfully!')
      console.log(`📧 Email: ${adminEmail}`)
      console.log(`🔑 Password: ${adminPassword}`)
      console.log(`🆔 UID: ${userRecord.uid}`)
      console.log('⚠️  Please save these credentials securely!')
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log('ℹ️  Admin user already exists. Updating custom claims...')
        
        // Get the existing user
        const userRecord = await auth.getUserByEmail(adminEmail)
        
        // Update custom claims
        await auth.setCustomUserClaims(userRecord.uid, { 
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        })
        
        console.log('✅ Admin user claims updated successfully!')
        console.log(`📧 Email: ${adminEmail}`)
        console.log(`🆔 UID: ${userRecord.uid}`)
      } else {
        throw error
      }
    }
    
    console.log('\n🎉 Firebase Admin setup complete!')
    console.log('You can now log in to the admin panel using the credentials above.')
    
  } catch (error: any) {
    console.error('❌ Firebase Admin setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupFirebaseAdmin()
