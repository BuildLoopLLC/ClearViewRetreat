import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

console.log('🔍 Testing Firebase Configuration...')
console.log('')

// Check if all required environment variables are present
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

let allPresent = true

console.log('📋 Checking environment variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
  } else {
    console.log(`❌ ${varName}: MISSING`)
    allPresent = false
  }
})

console.log('')

if (allPresent) {
  console.log('✅ All Firebase environment variables are present!')
  console.log('')
  console.log('🔧 Testing Firebase initialization...')
  
  try {
    // Try to initialize Firebase
    const { initializeApp } = require('firebase/app')
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    
    const app = initializeApp(firebaseConfig)
    console.log('✅ Firebase initialized successfully!')
    console.log(`📱 Project ID: ${app.options.projectId}`)
    
  } catch (error: any) {
    console.log('❌ Firebase initialization failed:')
    console.log(`   Error: ${error.message}`)
    console.log('')
    console.log('💡 Common issues:')
    console.log('   - Invalid API key format')
    console.log('   - Project ID mismatch')
    console.log('   - Missing quotes around values in .env.local')
  }
} else {
  console.log('❌ Some environment variables are missing!')
  console.log('')
  console.log('💡 Make sure your .env.local file contains all required variables:')
  requiredVars.forEach(varName => {
    console.log(`   ${varName}=your_value_here`)
  })
}
