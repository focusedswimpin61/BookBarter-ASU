"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, Filter, X } from "lucide-react"
import { searchBooks } from "@/app/actions/search"
import type { Database } from "@/lib/database.types"
import type { BookGenre } from "@/lib/database.types"

type Book = Database["public"]["Tables"]["books"]["Row"] & {
  profiles?: {
    full_name: string | null
    email: string
  }
}

interface SearchClientProps {
  initialQuery: string
  initialResults: Book[]
}

export function SearchClient({ initialQuery, initialResults }: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Book[]>(initialResults)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [genre, setGenre] = useState<BookGenre | "">((searchParams.get("genre") as BookGenre) || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice") as string) : 0,
    searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice") as string) : 100,
  ])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setIsSearching(true)

    // Update URL with search params
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (genre) params.set("genre", genre)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 100) params.set("maxPrice", priceRange[1].toString())

    router.push(`/search?${params.toString()}`)

    // Perform search
    const searchResults = await searchBooks(query, {
      genre: genre || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 100 ? priceRange[1] : undefined,
    })

    setResults(searchResults)
    setIsSearching(false)
  }

  const clearFilters = () => {
    setGenre("")
    setPriceRange([0, 100])

    // Remove filter params from URL
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    router.push(`/search?${params.toString()}`)

    // Re-run search without filters
    handleSearch()
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-asu-maroon dark:text-asu-gold">Search Books</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Your Textbooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, course code, or description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={genre} onValueChange={(value) => setGenre(value as BookGenre | "")}>
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="All Genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        <SelectItem value="STEM">STEM</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Humanities">Humanities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Price Range</Label>
                      <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={100}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-asu-maroon dark:text-asu-gold">
              {results.length > 0 ? `Search Results (${results.length})` : "No Results Found"}
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {query
                  ? "No books match your search criteria. Try adjusting your filters or search term."
                  : "Enter a search term to find books."}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  )
}
