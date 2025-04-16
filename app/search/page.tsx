import { SearchClient } from "./client"
import { searchBooks } from "@/app/actions/search"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; genre?: string; minPrice?: string; maxPrice?: string }
}) {
  const query = searchParams.q || ""
  const genre = searchParams.genre as any
  const minPrice = searchParams.minPrice ? Number.parseFloat(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number.parseFloat(searchParams.maxPrice) : undefined

  // Get search results without authentication check
  const searchResults = await searchBooks(query, {
    genre,
    minPrice,
    maxPrice,
  })

  return <SearchClient initialQuery={query} initialResults={searchResults} />
}
