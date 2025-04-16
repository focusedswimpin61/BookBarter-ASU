"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  signup as signupUser,
  type Profile,
} from "./local-store"

interface AuthContextType {
  user: Profile | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (email: string, fullName: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = loginUser(email, password)
    if (result.success && result.user) {
      setUser(result.user)
      router.push("/dashboard")
    }
    return result
  }

  const signup = async (email: string, fullName: string) => {
    const result = signupUser(email, fullName)
    if (result.success && result.user) {
      setUser(result.user)
      router.push("/dashboard")
    }
    return result
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
