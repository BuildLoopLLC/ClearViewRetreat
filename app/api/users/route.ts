import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    // If action is 'count', return just the count
    if (action === 'count') {
      let userCount = 0
      let pageToken: string | undefined
      
      // List all users (Firebase Auth doesn't have a direct count method)
      do {
        const listUsersResult = await adminAuth.listUsers(1000, pageToken)
        userCount += listUsersResult.users.length
        pageToken = listUsersResult.pageToken
      } while (pageToken)
      
      return NextResponse.json({ count: userCount })
    }

    // Otherwise, return list of users with pagination
    const maxResults = parseInt(searchParams.get('limit') || '100')
    const pageToken = searchParams.get('pageToken') || undefined

    const listUsersResult = await adminAuth.listUsers(maxResults, pageToken)
    
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      },
      customClaims: user.customClaims || {}
    }))

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

