"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BookGenre } from "@/lib/database.types"
import { getBooks } from "@/lib/local-store"

interface PriceData {
  genre: BookGenre
  averagePrice: number
  count: number
  minPrice: number
  maxPrice: number
}

export function MarketAnalytics() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [selectedGenre, setSelectedGenre] = useState<BookGenre | "All">("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Calculate price analytics from books
    const books = getBooks()
    const genres: BookGenre[] = ["STEM", "Business", "Arts", "Humanities"]

    const genreData = genres.map((genre) => {
      const genreBooks = books.filter((book) => book.genre === genre)
      const prices = genreBooks.map((book) => book.price)
      const averagePrice = prices.length ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0
      const minPrice = prices.length ? Math.min(...prices) : 0
      const maxPrice = prices.length ? Math.max(...prices) : 0

      return {
        genre,
        averagePrice,
        count: genreBooks.length,
        minPrice,
        maxPrice,
      }
    })

    setPriceData(genreData)
    setLoading(false)
  }, [])

  // Calculate the maximum count for scaling the bars
  const maxCount = Math.max(...priceData.map((data) => data.count))
  const maxAvgPrice = Math.max(...priceData.map((data) => data.averagePrice))

  const filteredData = selectedGenre === "All" ? priceData : priceData.filter((data) => data.genre === selectedGenre)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-asu-maroon dark:text-asu-gold">Market Analytics</CardTitle>
        <CardDescription>Current textbook market trends and pricing data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="price">Price Analysis</TabsTrigger>
            <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Average Price by Genre</h3>
              <div className="flex space-x-2">
                {["All", "STEM", "Business", "Arts", "Humanities"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre as BookGenre | "All")}
                    className={`text-xs px-2 py-1 rounded ${
                      selectedGenre === genre
                        ? "bg-asu-maroon text-white dark:bg-asu-gold dark:text-gray-900"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end space-x-6 pb-4">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asu-maroon dark:border-asu-gold"></div>
                </div>
              ) : (
                filteredData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.averagePrice / maxAvgPrice) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full bg-asu-maroon/80 dark:bg-asu-gold/80 rounded-t-md relative group"
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${data.averagePrice.toFixed(2)}
                      </div>
                    </motion.div>
                    <div className="mt-2 text-xs text-center">{data.genre}</div>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {filteredData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-muted/30 p-3 rounded-md"
                >
                  <div className="text-xs text-muted-foreground">{data.genre}</div>
                  <div className="text-lg font-bold">${data.averagePrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Range: ${data.minPrice.toFixed(2)} - ${data.maxPrice.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Listing Volume by Genre</h3>
              <div className="flex space-x-2">
                {["All", "STEM", "Business", "Arts", "Humanities"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre as BookGenre | "All")}
                    className={`text-xs px-2 py-1 rounded ${
                      selectedGenre === genre
                        ? "bg-asu-maroon text-white dark:bg-asu-gold dark:text-gray-900"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end space-x-6 pb-4">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asu-maroon dark:border-asu-gold"></div>
                </div>
              ) : (
                filteredData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full bg-asu-gold/80 dark:bg-asu-maroon/80 rounded-t-md relative group"
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.count} listings
                      </div>
                    </motion.div>
                    <div className="mt-2 text-xs text-center">{data.genre}</div>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {filteredData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-muted/30 p-3 rounded-md"
                >
                  <div className="text-xs text-muted-foreground">{data.genre}</div>
                  <div className="text-lg font-bold">{data.count} listings</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((data.count / priceData.reduce((sum, d) => sum + d.count, 0)) * 100).toFixed(1)}% of market
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
