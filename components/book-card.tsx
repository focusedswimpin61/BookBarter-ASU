"use client"

import { useState } from "react"
import { Copy, Check, Heart, Share, BookOpen, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import type { Book } from "@/lib/local-store"
import { getProfileById } from "@/lib/local-store"

interface BookCardProps {
  book: Book & {
    profiles?: {
      full_name: string | null
      email: string
    }
  }
}

export function BookCard({ book }: BookCardProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get seller profile
  const sellerProfile = book.profiles || getProfileById(book.seller_id)

  const sellerName = sellerProfile?.full_name || sellerProfile?.email?.split("@")[0] || "Unknown Seller"
  const sellerEmail = sellerProfile?.email || "guest@asu.edu"

  const copyEmailToClipboard = () => {
    try {
      navigator.clipboard.writeText(sellerEmail).then(() => {
        setCopied(true)
        toast({
          title: "Email copied!",
          description: `${sellerEmail} has been copied to your clipboard.`,
        })
        setTimeout(() => setCopied(false), 2000)
      })
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = sellerEmail
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        toast({
          title: "Email copied!",
          description: `${sellerEmail} has been copied to your clipboard.`,
        })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Please manually select and copy the email address.",
          variant: "destructive",
        })
      }

      document.body.removeChild(textArea)
    }
  }

  const toggleLike = () => {
    setLiked(!liked)
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked ? "Book removed from your favorites" : "Book added to your favorites",
    })
  }

  const shareBook = () => {
    if (navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Check out this book: ${book.title} for $${book.price}`,
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: "Shared successfully",
            description: "Book information has been shared",
          })
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      copyEmailToClipboard()
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing. The seller's email has been copied instead.",
      })
    }
  }

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border relative"
    >
      {/* Quick action buttons that appear on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 flex space-x-1 z-10"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={toggleLike}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{liked ? "Remove from favorites" : "Add to favorites"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={shareBook}
              >
                <Share className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this book</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg line-clamp-2">{book.title}</h3>
          <Badge variant="outline" className="bg-asu-gold/20 text-foreground whitespace-nowrap">
            {book.course_code}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-asu-maroon dark:text-asu-gold">${book.price.toFixed(2)}</span>
          <Badge
            variant={
              book.condition === "Like New"
                ? "default"
                : book.condition === "Good"
                  ? "secondary"
                  : book.condition === "Fair"
                    ? "outline"
                    : "destructive"
            }
          >
            {book.condition}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {book.material_type}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(book.created_at)}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">Seller: {sellerName}</p>
          {book.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{book.description}</p>}
        </div>

        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
          <div className="text-sm font-medium truncate">{sellerEmail}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2" onClick={copyEmailToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy seller's email to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}
