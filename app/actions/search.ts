"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type SearchResult = {
  id: string
  title: string
  author: string
  price: number
  condition: string
  cover_image?: string
  created_at: string
  user_id: string
  status: string
  description?: string
}

export async function search(query: string): Promise<SearchResult[]> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (!query) {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching books:", error)
      return []
    }

    return data as SearchResult[]
  }

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "available")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error searching books:", error)
    return []
  }

  return data as SearchResult[]
}

// Add the missing searchBooks export
export async function searchBooks(query: string): Promise<SearchResult[]> {
  // This function can either be an alias to the existing search function
  // or implement a slightly different search logic if needed
  return search(query)
}
