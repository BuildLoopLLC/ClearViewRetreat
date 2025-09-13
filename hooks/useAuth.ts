import { useState, useEffect } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Check if user has admin role
        try {
          // Force token refresh to get latest claims
          await user.getIdToken(true)
          const tokenResult = await user.getIdTokenResult()
          const role = tokenResult.claims.role
          setIsAdmin(role === 'admin')
        } catch (error) {
          console.error('Error checking admin role:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Check admin role after sign in
      try {
        // Force token refresh to get latest claims
        await userCredential.user.getIdToken(true)
        const tokenResult = await userCredential.user.getIdTokenResult()
        const role = tokenResult.claims.role
        setIsAdmin(role === 'admin')
      } catch (error) {
        console.error('Error checking admin role:', error)
        setIsAdmin(false)
      }
      
      return { success: true, user: userCredential.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setIsAdmin(false)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    signIn,
    logout,
    isAuthenticated: !!user,
    isAdmin,
  }
}
