"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookX, Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const [count, setCount] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = "/"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BookX className="h-24 w-24 text-asu-maroon dark:text-asu-gold" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-asu-gold dark:bg-asu-maroon"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-asu-maroon dark:text-asu-gold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Books
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Redirecting to home page in <span className="font-bold">{count}</span> seconds...
        </p>
      </motion.div>
    </div>
  )
}
