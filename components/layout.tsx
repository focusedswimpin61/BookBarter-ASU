"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Book, Home, LogIn, LogOut, Menu, PlusCircle, Search, User, X, BarChart2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-provider"
import { NotificationBell } from "@/components/notification-bell"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Market Analytics", href: "/analytics", icon: BarChart2 },
    { name: "My Books", href: "/my-books", icon: Book },
    { name: "Browse Books", href: "/browse", icon: Search },
    { name: "List a Book", href: "/list", icon: PlusCircle },
    { name: "Profile", href: "/profile", icon: User },
  ]

  const categories = [
    { name: "STEM", href: "/search?genre=STEM" },
    { name: "Business", href: "/search?genre=Business" },
    { name: "Arts", href: "/search?genre=Arts" },
    { name: "Humanities", href: "/search?genre=Humanities" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border shadow-lg lg:static lg:translate-x-0 lg:shadow-none"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 px-4 border-b border-border">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="text-2xl">📚</span>
                  <span className="font-bold text-lg text-asu-maroon dark:text-asu-gold">BookBarter ASU</span>
                </Link>
              </div>

              <div className="px-4 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    className="h-9 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Main
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-asu-maroon text-white dark:bg-asu-gold dark:text-gray-900 font-medium"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}

                <div className="px-3 mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categories
                </div>
                {categories.map((category) => {
                  const isActive = pathname === category.href
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors ml-2",
                        isActive
                          ? "bg-asu-maroon text-white dark:bg-asu-gold dark:text-gray-900 font-medium"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {category.name}
                    </Link>
                  )
                })}

                {/* User section */}
                <div className="mt-6 pt-6 border-t border-border">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-3 text-sm font-medium">
                        Signed in as: <span className="font-bold">{user.full_name || user.email}</span>
                      </div>
                      <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full justify-start" onClick={handleLogin}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border bg-background">
          <div className="lg:hidden" />
          <div className="flex items-center space-x-4">
            <NotificationBell />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline-block">{user.full_name || user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline-block">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogin}>
                <LogIn className="h-4 w-4 mr-1" />
                <span className="hidden md:inline-block">Sign In</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
