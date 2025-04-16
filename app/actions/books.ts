"use server"

import { revalidatePath } from "next/cache"
import type { BookCondition, BookGenre, MaterialType } from "@/lib/database.types"
import {
  getBooks as getLocalBooks,
  addBook,
  updateBook,
  deleteBook as deleteLocalBook,
  GUEST_USER_ID,
  getCurrentUser,
} from "@/lib/local-store"

export async function getBooks(genre?: BookGenre) {
  // Get books from local store
  const books = getLocalBooks()

  // Filter by genre if provided
  let filteredBooks = books.filter((book) => !book.is_sold)

  if (genre) {
    filteredBooks = filteredBooks.filter((book) => book.genre === genre)
  }

  // Sort by created_at descending
  return filteredBooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getBooksByUser() {
  // Get books from local store
  const books = getLocalBooks()

  // Get current user or use guest
  const currentUser = getCurrentUser()
  const userId = currentUser?.id || GUEST_USER_ID

  // Filter by seller_id
  const userBooks = books.filter((book) => book.seller_id === userId)

  // Sort by created_at descending
  return userBooks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function createBook(formData: FormData) {
  try {
    // Extract form data
    const title = formData.get("title") as string
    const courseCode = formData.get("courseCode") as string
    const priceStr = formData.get("price") as string
    const condition = formData.get("condition") as BookCondition
    const materialType = formData.get("materialType") as MaterialType
    const genre = formData.get("genre") as BookGenre
    const description = (formData.get("description") as string) || null

    // Validate form data
    if (!title || !courseCode || !priceStr || !condition || !materialType || !genre) {
      return {
        error: "All fields except description are required",
      }
    }

    const price = Number.parseFloat(priceStr)
    if (isNaN(price)) {
      return {
        error: "Invalid price format",
      }
    }

    // Get current user or use guest
    const currentUser = getCurrentUser()
    const sellerId = currentUser?.id || GUEST_USER_ID

    // Add book to local store
    const newBook = addBook({
      title,
      course_code: courseCode,
      price,
      condition,
      material_type: materialType,
      genre,
      description,
      seller_id: sellerId,
      is_sold: false,
    })

    // Revalidate the dashboard path to show the new book
    revalidatePath("/dashboard")

    return {
      success: "Book listed successfully",
      data: [newBook],
    }
  } catch (error: any) {
    return {
      error: "An unexpected error occurred: " + (error.message || "Unknown error"),
    }
  }
}

export async function updateBookStatus(id: string, isSold: boolean) {
  try {
    // Update book in local store
    const updatedBook = updateBook(id, { is_sold: isSold })

    if (!updatedBook) {
      return {
        error: "Book not found",
      }
    }

    // Revalidate the dashboard path to show the updated book
    revalidatePath("/dashboard")

    return {
      success: `Book marked as ${isSold ? "sold" : "available"}`,
      data: [updatedBook],
    }
  } catch (error: any) {
    return {
      error: "An unexpected error occurred: " + (error.message || "Unknown error"),
    }
  }
}

export async function deleteBook(id: string) {
  try {
    // Delete book from local store
    const success = deleteLocalBook(id)

    if (!success) {
      return {
        error: "Book not found",
      }
    }

    // Revalidate the dashboard path to show the updated book list
    revalidatePath("/dashboard")

    return {
      success: "Book deleted successfully",
    }
  } catch (error: any) {
    return {
      error: "An unexpected error occurred: " + (error.message || "Unknown error"),
    }
  }
}
