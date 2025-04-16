"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type Book, type Profile, getBooks, getProfiles, GUEST_USER_ID } from "./local-store"

interface LocalStoreContextType {
  books: Book[]
  profiles: Profile[]
  guestUser: Profile
  isLoaded: boolean
  refreshData: () => void
}

const LocalStoreContext = createContext<LocalStoreContextType | undefined>(undefined)

export function LocalStoreProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const guestUser: Profile = {
    id: GUEST_USER_ID,
    email: "guest@asu.edu",
    full_name: "Guest User",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const loadData = () => {
    if (typeof window !== "undefined") {
      setBooks(getBooks())
      setProfiles(getProfiles())
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const refreshData = () => {
    loadData()
  }

  return (
    <LocalStoreContext.Provider value={{ books, profiles, guestUser, isLoaded, refreshData }}>
      {children}
    </LocalStoreContext.Provider>
  )
}

export function useLocalStore() {
  const context = useContext(LocalStoreContext)
  if (context === undefined) {
    throw new Error("useLocalStore must be used within a LocalStoreProvider")
  }
  return context
}
