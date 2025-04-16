"use server"

import type { BookGenre } from "@/lib/database.types"
import { searchBooks as searchLocalBooks } from "@/lib/local-store"

export async function searchBooks(
  query: string,
  filters?: { genre?: BookGenre; minPrice?: number; maxPrice?: number },
) {
  // Use the local store search function
  return searchLocalBooks(query, filters)
}
