"use client"

import { v4 as uuidv4 } from "uuid"
import type { BookCondition, BookGenre, MaterialType } from "@/lib/database.types"

// Types for our local data store
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  title: string
  course_code: string
  price: number
  condition: BookCondition
  material_type: MaterialType
  genre: BookGenre
  description: string | null
  seller_id: string
  is_sold: boolean
  created_at: string
  updated_at: string
}

// Default guest user
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"
const GUEST_USER: Profile = {
  id: GUEST_USER_ID,
  email: "guest@asu.edu",
  full_name: "Guest User",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Sample books data
const SAMPLE_BOOKS: Book[] = [
  {
    id: uuidv4(),
    title: "Introduction to Computer Science",
    course_code: "CSE 110",
    price: 45.99,
    condition: "Good",
    material_type: "Textbook",
    genre: "STEM",
    description: "Great introductory textbook for CS students",
    seller_id: GUEST_USER_ID,
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Calculus for Engineers",
    course_code: "MAT 265",
    price: 55.0,
    condition: "Like New",
    material_type: "Textbook",
    genre: "STEM",
    description: "Barely used calculus textbook",
    seller_id: GUEST_USER_ID,
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Introduction to Psychology",
    course_code: "PSY 101",
    price: 30.5,
    condition: "Fair",
    material_type: "Textbook",
    genre: "Humanities",
    description: "Psychology textbook with some highlighting",
    seller_id: GUEST_USER_ID,
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Helper function to initialize local storage
const initializeLocalStorage = () => {
  if (typeof window === "undefined") return

  // Initialize profiles if not exists
  if (!localStorage.getItem("profiles")) {
    localStorage.setItem("profiles", JSON.stringify([GUEST_USER]))
  }

  // Initialize books if not exists
  if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify(SAMPLE_BOOKS))
  }

  // Initialize current user if not exists
  if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(null))
  }
}

// Helper to get profiles from local storage
export const getProfiles = (): Profile[] => {
  if (typeof window === "undefined") return [GUEST_USER]

  initializeLocalStorage()
  return JSON.parse(localStorage.getItem("profiles") || "[]")
}

// Helper to get books from local storage
export const getBooks = (): Book[] => {
  if (typeof window === "undefined") return SAMPLE_BOOKS

  initializeLocalStorage()
  return JSON.parse(localStorage.getItem("books") || "[]")
}

// Helper to save profiles to local storage
export const saveProfiles = (profiles: Profile[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem("profiles", JSON.stringify(profiles))
}

// Helper to save books to local storage
export const saveBooks = (books: Book[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem("books", JSON.stringify(books))
}

// Helper to get a profile by ID
export const getProfileById = (id: string): Profile | null => {
  const profiles = getProfiles()
  return profiles.find((profile) => profile.id === id) || null
}

// Helper to add a book
export const addBook = (book: Omit<Book, "id" | "created_at" | "updated_at">): Book => {
  const books = getBooks()

  const newBook: Book = {
    ...book,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  books.push(newBook)
  saveBooks(books)

  return newBook
}

// Helper to update a book
export const updateBook = (id: string, updates: Partial<Book>): Book | null => {
  const books = getBooks()
  const index = books.findIndex((book) => book.id === id)

  if (index === -1) return null

  books[index] = {
    ...books[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  saveBooks(books)
  return books[index]
}

// Helper to delete a book
export const deleteBook = (id: string): boolean => {
  const books = getBooks()
  const filteredBooks = books.filter((book) => book.id !== id)

  if (filteredBooks.length === books.length) return false

  saveBooks(filteredBooks)
  return true
}

// Helper to search books
export const searchBooks = (
  query: string,
  filters?: { genre?: BookGenre; minPrice?: number; maxPrice?: number },
): Book[] => {
  let books = getBooks().filter((book) => !book.is_sold)

  // Apply text search if query exists
  if (query) {
    const lowerQuery = query.toLowerCase()
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.course_code.toLowerCase().includes(lowerQuery) ||
        (book.description && book.description.toLowerCase().includes(lowerQuery)),
    )
  }

  // Apply filters if they exist
  if (filters) {
    if (filters.genre) {
      books = books.filter((book) => book.genre === filters.genre)
    }

    if (filters.minPrice !== undefined) {
      books = books.filter((book) => book.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      books = books.filter((book) => book.price <= filters.maxPrice!)
    }
  }

  // Sort by created_at descending
  return books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Authentication functions
export const getCurrentUser = (): Profile | null => {
  if (typeof window === "undefined") return null

  initializeLocalStorage()
  const user = JSON.parse(localStorage.getItem("currentUser") || "null")
  return user
}

export const login = (email: string, password: string): { success: boolean; message: string; user?: Profile } => {
  if (typeof window === "undefined") return { success: false, message: "Cannot login on server" }

  const profiles = getProfiles()

  // Simple email-based login (no real password check in this demo)
  const user = profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { success: false, message: "User not found. Please sign up." }
  }

  // In a real app, you would check the password hash here
  // For this demo, we'll just accept any password

  localStorage.setItem("currentUser", JSON.stringify(user))
  return { success: true, message: "Login successful", user }
}

export const signup = (email: string, fullName: string): { success: boolean; message: string; user?: Profile } => {
  if (typeof window === "undefined") return { success: false, message: "Cannot signup on server" }

  const profiles = getProfiles()

  // Check if user already exists
  if (profiles.some((profile) => profile.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "User with this email already exists" }
  }

  // Create new user
  const newUser: Profile = {
    id: uuidv4(),
    email,
    full_name: fullName,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  profiles.push(newUser)
  saveProfiles(profiles)

  // Auto login
  localStorage.setItem("currentUser", JSON.stringify(newUser))

  return { success: true, message: "Account created successfully", user: newUser }
}

export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.setItem("currentUser", JSON.stringify(null))
}

// Export the guest user ID for reference
export { GUEST_USER_ID, GUEST_USER }
