"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { BookOpen, Mail, User, Edit2 } from "lucide-react"
import type { Book, Profile } from "@/lib/local-store"

interface ProfileClientProps {
  user: Profile
  books: Book[]
}

export function ProfileClient({ user, books }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || "")
  const [email, setEmail] = useState(user.email)
  const { toast } = useToast()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the database
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const activeBooks = books.filter((book) => !book.is_sold)
  const soldBooks = books.filter((book) => book.is_sold)

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url || ""} alt={user.full_name || user.email} />
                  <AvatarFallback className="text-xl bg-asu-maroon text-white dark:bg-asu-gold dark:text-gray-900">
                    {user.full_name ? getInitials(user.full_name) : user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        type="email"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} className="flex-1">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{user.full_name || "Guest User"}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Books Listed</p>
                    <p className="text-sm text-muted-foreground">{books.length} books</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books Tabs */}
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Your Books</CardTitle>
              <CardDescription>Manage your listed books</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active Listings ({activeBooks.length})</TabsTrigger>
                  <TabsTrigger value="sold">Sold Books ({soldBooks.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No active listings</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don't have any active book listings. List a book to get started.
                      </p>
                      <Button className="mt-4" onClick={() => (window.location.href = "/dashboard?tab=list")}>
                        List a Book
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sold" className="space-y-4">
                  {soldBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {soldBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No sold books</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You haven't sold any books yet. When you mark a book as sold, it will appear here.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your BookBarter ASU activity statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Listings", value: activeBooks.length },
                { label: "Sold Books", value: soldBooks.length },
                {
                  label: "Total Value",
                  value: `$${books.reduce((sum, book) => sum + book.price, 0).toFixed(2)}`,
                },
                {
                  label: "Avg. Book Price",
                  value: `$${
                    books.length ? (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2) : "0.00"
                  }`,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-muted/30 p-4 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-asu-maroon dark:text-asu-gold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  )
}
