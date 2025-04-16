"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, TrendingUp, BookMarked, Users } from "lucide-react"
import { createBook } from "@/app/actions/books"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/lib/database.types"
import type { BookCondition, BookGenre, MaterialType } from "@/lib/database.types"
import { SearchButton } from "@/components/search-button"
import { MarketAnalytics } from "@/components/market-analytics"
import { NotificationBell } from "@/components/notification-bell"

// Sample quotes
const quotes = [
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The only way to do great work is to love what you do. - Steve Jobs",
]

// Step wizard types
type WizardStep = 1 | 2 | 3 | 4

type Book = Database["public"]["Tables"]["books"]["Row"] & {
  profiles?: {
    full_name: string | null
    email: string
  }
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface DashboardClientProps {
  user: Profile
  books: Book[]
}

export function DashboardClient({ user, books: initialBooks }: DashboardClientProps) {
  const [greeting, setGreeting] = useState("")
  const [quote, setQuote] = useState("")
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [materialType, setMaterialType] = useState<MaterialType | "">("")
  const [genre, setGenre] = useState<BookGenre | "">("")
  const [subject, setSubject] = useState("")
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Form fields for the final step
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState<BookCondition | "">("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")

    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setMaterialType("")
    setGenre("")
    setSubject("")
    setTitle("")
    setPrice("")
    setCondition("")
    setDescription("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("courseCode", subject)
    formData.append("price", price)
    formData.append("condition", condition)
    formData.append("materialType", materialType)
    formData.append("genre", genre)
    formData.append("description", description)

    const result = await createBook(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else if (result.success) {
      toast({
        title: "Success",
        description: result.success,
      })

      // Add the new book to the list
      if (result.data) {
        setBooks([result.data[0], ...books])
      }

      resetWizard()
    }
  }

  // Group books by genre
  const booksByGenre = books.reduce(
    (acc, book) => {
      if (!acc[book.genre]) {
        acc[book.genre] = []
      }
      acc[book.genre].push(book)
      return acc
    },
    {} as Record<string, Book[]>,
  )

  // Stats for dashboard
  const stats = [
    {
      title: "Total Listings",
      value: books.length,
      icon: <BookMarked className="h-5 w-5 text-asu-maroon dark:text-asu-gold" />,
      change: "+12% from last month",
    },
    {
      title: "Active Users",
      value: 245,
      icon: <Users className="h-5 w-5 text-asu-maroon dark:text-asu-gold" />,
      change: "+18% from last month",
    },
    {
      title: "Avg. Book Price",
      value: `$${books.length ? (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2) : "0.00"}`,
      icon: <TrendingUp className="h-5 w-5 text-asu-maroon dark:text-asu-gold" />,
      change: "-5% from last month",
    },
    {
      title: "Books Sold",
      value: 87,
      icon: <BookOpen className="h-5 w-5 text-asu-maroon dark:text-asu-gold" />,
      change: "+32% from last month",
    },
  ]

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header section */}
        <section className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-asu-maroon dark:text-asu-gold">
              {greeting}, {user.full_name || user.email.split("@")[0]} 👋
            </h1>
            <p className="text-muted-foreground italic">"{quote}"</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </section>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="market">Market Analytics</TabsTrigger>
            <TabsTrigger value="list">List a Book</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </div>
                        <div className="p-2 bg-muted rounded-md">{stat.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <section className="flex justify-center">
              <div className="w-full max-w-md">
                <SearchButton />
              </div>
            </section>

            {/* Listed books */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-asu-maroon dark:text-asu-gold">Available Books</h2>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="STEM">STEM</TabsTrigger>
                  <TabsTrigger value="Business">Business</TabsTrigger>
                  <TabsTrigger value="Arts">Arts</TabsTrigger>
                  <TabsTrigger value="Humanities">Humanities</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
                    <div key={genre} className="space-y-4">
                      <h3 className="text-xl font-semibold">{genre}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {genreBooks.map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {["STEM", "Business", "Arts", "Humanities"].map((genreTab) => (
                  <TabsContent key={genreTab} value={genreTab} className="space-y-4">
                    {booksByGenre[genreTab] ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {booksByGenre[genreTab].map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No books available in this category.</p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketAnalytics />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            {/* Book listing wizard */}
            <Card>
              <CardHeader>
                <CardTitle>List a Book</CardTitle>
                <CardDescription>Follow the steps below to list your book for sale or exchange.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress indicator */}
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step === currentStep
                              ? "bg-asu-maroon text-white dark:bg-asu-gold dark:text-black"
                              : step < currentStep
                                ? "bg-asu-gold text-black dark:bg-asu-gold/70 dark:text-black"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step}
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          {step === 1 && "Type"}
                          {step === 2 && "Genre"}
                          {step === 3 && "Subject"}
                          {step === 4 && "Details"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Material Type */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">What type of material are you listing?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["Textbook", "Lab Manual", "Notes", "Study Guide"].map((type) => (
                          <Button
                            key={type}
                            variant={materialType === type ? "default" : "outline"}
                            className="h-24 flex flex-col items-center justify-center"
                            onClick={() => setMaterialType(type as MaterialType)}
                          >
                            <BookOpen className="h-8 w-8 mb-2" />
                            {type}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Genre */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">Select a genre</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["STEM", "Business", "Arts", "Humanities"].map((type) => (
                          <Button
                            key={type}
                            variant={genre === type ? "default" : "outline"}
                            className="h-24 flex flex-col items-center justify-center"
                            onClick={() => setGenre(type as BookGenre)}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Subject */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">Enter the course code</h3>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Course Code (e.g., MAT 267)</Label>
                        <Input
                          id="subject"
                          placeholder="Enter course code"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Book Details */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">Enter book details</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Book Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter book title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="Enter price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select onValueChange={(value) => setCondition(value as BookCondition)} value={condition}>
                              <SelectTrigger id="condition">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Like New">Like New</SelectItem>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Fair">Fair</SelectItem>
                                <SelectItem value="Poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Input
                            id="description"
                            placeholder="Add details about the book"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? resetWizard : handlePrevStep}
                  disabled={currentStep === 1 && !materialType}
                >
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                <Button
                  onClick={currentStep === 4 ? handleSubmit : handleNextStep}
                  disabled={
                    isSubmitting ||
                    (currentStep === 1 && !materialType) ||
                    (currentStep === 2 && !genre) ||
                    (currentStep === 3 && !subject) ||
                    (currentStep === 4 && (!title || !price || !condition))
                  }
                >
                  {isSubmitting ? "Submitting..." : currentStep === 4 ? "List Book" : "Next"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  )
}
