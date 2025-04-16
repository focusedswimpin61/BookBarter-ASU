"use server"
import type { BookCondition, BookGenre, MaterialType } from "@/lib/database.types"

// Types for our server-side data store
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

// Default guest user for server-side
export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"
export const GUEST_USER: Profile = {
  id: GUEST_USER_ID,
  email: "guest@asu.edu",
  full_name: "Guest User",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Sample books data for server-side
const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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

// Server-side function to get books by user
export async function getServerBooksByUser(): Promise<Book[]> {
  // In a real app, this would fetch from a database
  // For now, we'll just return the sample books
  return SAMPLE_BOOKS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
