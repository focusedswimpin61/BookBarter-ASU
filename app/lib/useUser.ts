"use client"
import { createContext, useContext, useState } from "react"
import type React from "react"

import type { User } from "firebase/auth"

const UserContext = createContext<any>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
