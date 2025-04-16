"use server"
import type { BookCondition, BookGenre, MaterialType } from "@/lib/database.types"

// Types for our server-side data store
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
    seller_id: "00000000-0000-0000-0000-000000000000",
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
    seller_id: "00000000-0000-0000-0000-000000000000",
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
    seller_id: "00000000-0000-0000-0000-000000000000",
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Server-side function to get books
export async function getServerBooks(genre?: BookGenre): Promise<Book[]> {
  // Filter by genre if provided
  let filteredBooks = SAMPLE_BOOKS.filter((book) => !book.is_sold)

  if (genre) {
    filteredBooks = filteredBooks.filter((book) => book.genre === genre)
  }

  // Sort by created_at descending
  return filteredBooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
