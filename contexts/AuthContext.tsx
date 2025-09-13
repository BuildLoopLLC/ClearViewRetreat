'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthContextType {
  user: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
