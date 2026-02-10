import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const adminOnly = searchParams.get('adminOnly') === 'true'

    // If action is 'count', return just the count
    if (action === 'count') {
      let userCount = 0
      let pageToken: string | undefined
      
      // List all users (Firebase Auth doesn't have a direct count method)
      do {
        const listUsersResult = await adminAuth.listUsers(1000, pageToken)
        if (adminOnly) {
          // Filter to only admin users
          const adminUsers = listUsersResult.users.filter(user => 
            user.customClaims?.role === 'admin'
          )
          userCount += adminUsers.length
        } else {
          userCount += listUsersResult.users.length
        }
        pageToken = listUsersResult.pageToken
      } while (pageToken)
      
      return NextResponse.json({ count: userCount })
    }

    // Otherwise, return list of users with pagination
    const maxResults = parseInt(searchParams.get('limit') || '100')
    const pageToken = searchParams.get('pageToken') || undefined

    const listUsersResult = await adminAuth.listUsers(maxResults, pageToken)
    
    let users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      },
      customClaims: user.customClaims || {},
      isAdmin: user.customClaims?.role === 'admin'
    }))

    // Filter to admin users only if requested
    if (adminOnly) {
      users = users.filter(user => user.isAdmin)
    }

    return NextResponse.json({
      users,
      pageToken: listUsersResult.pageToken,
      count: users.length
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, displayName } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create the user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || 'Admin User',
      emailVerified: true,
    })

    // Set custom claims for admin role
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin']
    })

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        isAdmin: true
      }
    })
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    
    if (error.code === 'auth/email-already-exists') {
      // User exists, try to update to admin
      try {
        const existingUser = await adminAuth.getUserByEmail(body.email)
        await adminAuth.setCustomUserClaims(existingUser.uid, {
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        })
        
        return NextResponse.json({
          success: true,
          message: 'User already exists. Admin role has been granted.',
          user: {
            uid: existingUser.uid,
            email: existingUser.email,
            displayName: existingUser.displayName,
            isAdmin: true
          }
        })
      } catch (updateError) {
        return NextResponse.json(
          { error: 'Failed to update existing user to admin' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

// DELETE - Remove admin role or delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get('uid')
    const removeAdminOnly = searchParams.get('removeAdminOnly') === 'true'

    if (!uid) {
      return NextResponse.json(
        { error: 'User UID is required' },
        { status: 400 }
      )
    }

    // Get user to check if it's the super admin
    const userRecord = await adminAuth.getUser(uid)
    
    // Prevent deletion of super admin
    if (userRecord.email === 'admin@clearviewretreat.org') {
      return NextResponse.json(
        { error: 'Cannot remove admin access for the super admin account' },
        { status: 403 }
      )
    }

    if (removeAdminOnly) {
      // Just remove admin role, don't delete user
      await adminAuth.setCustomUserClaims(uid, {
        role: 'user',
        permissions: []
      })
      
      return NextResponse.json({
        success: true,
        message: 'Admin role removed successfully'
      })
    } else {
      // Delete the user completely
      await adminAuth.deleteUser(uid)
      
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      })
    }
  } catch (error: any) {
    console.error('Error deleting/removing admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove admin user' },
      { status: 500 }
    )
  }
}

