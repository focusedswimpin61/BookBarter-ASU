"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Users, BookMarked, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigateToLogin = () => {
    router.push("/login")
  }

  const navigateToSignup = () => {
    router.push("/signup")
  }

  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-asu-maroon dark:text-asu-gold" />,
      title: "Extensive Textbook Listings",
      description: "Browse through a wide selection of textbooks from all ASU courses and departments.",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-asu-maroon dark:text-asu-gold" />,
      title: "Market Analytics",
      description: "View price trends and demand for textbooks to make informed buying and selling decisions.",
    },
    {
      icon: <Users className="h-10 w-10 text-asu-maroon dark:text-asu-gold" />,
      title: "Peer-to-Peer Exchange",
      description: "Connect directly with other ASU students for seamless textbook exchanges.",
    },
    {
      icon: <BookMarked className="h-10 w-10 text-asu-maroon dark:text-asu-gold" />,
      title: "Course-Specific Search",
      description: "Find exactly what you need with our advanced course-specific search functionality.",
    },
  ]

  const testimonials = [
    {
      quote: "BookBarter saved me hundreds of dollars on textbooks this semester!",
      author: "Sarah J., Computer Science Major",
    },
    {
      quote: "I sold all my old textbooks in just two days. The platform is so easy to use!",
      author: "Michael T., Business Administration",
    },
    {
      quote: "The course-specific search made finding the exact books I needed incredibly simple.",
      author: "Priya K., Biomedical Engineering",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="font-bold text-xl text-asu-maroon dark:text-asu-gold">BookBarter ASU</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <Button onClick={navigateToDashboard}>Go to Dashboard</Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={navigateToLogin}>
                  Sign In
                </Button>
                <Button onClick={navigateToSignup}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-6"
            >
              <div className="flex flex-col mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <img src="/images/asu-logo.png" alt="ASU Logo" className="h-12 md:h-16 w-auto object-contain" />
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-asu-maroon dark:text-asu-gold leading-tight">
                    The Smarter Way to Exchange Textbooks at ASU
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Save money and reduce waste by buying, selling, and exchanging textbooks directly with fellow Sun
                  Devils.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={user ? navigateToDashboard : navigateToSignup} className="text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={navigateToDashboard} className="text-lg">
                  Browse Books
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon/20 to-asu-gold/20 z-10"></div>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FKiVswaBJ58B8729sJuS3IAIWqyweW.png"
                  alt="ASU student browsing books in library"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-asu-maroon/10 dark:bg-asu-gold/10"
                  style={{
                    backgroundPosition: `${scrollY * 0.5}px ${scrollY * 0.5}px`,
                  }}
                ></motion.div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-asu-gold/20 dark:bg-asu-maroon/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-asu-maroon/20 dark:bg-asu-gold/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,500+", label: "Active Listings" },
              { value: "4,800+", label: "Students" },
              { value: "$125,000+", label: "Money Saved" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-3xl md:text-4xl font-bold text-asu-maroon dark:text-asu-gold">{stat.value}</span>
                <span className="text-sm md:text-base text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-asu-maroon dark:text-asu-gold mb-4">
              Why Choose BookBarter ASU?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed specifically for ASU students, with features that make textbook exchange simple,
              efficient, and affordable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-asu-maroon dark:text-asu-gold mb-4">
              What Students Are Saying
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied ASU students who are already saving money with BookBarter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-md border border-border relative"
              >
                <div className="absolute -top-4 left-6 text-4xl text-asu-maroon/20 dark:text-asu-gold/20">❝</div>
                <p className="text-lg mb-4 pt-4">{testimonial.quote}</p>
                <p className="text-sm text-muted-foreground font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-asu-maroon to-asu-maroon/80 dark:from-asu-gold/90 dark:to-asu-gold/70 rounded-xl p-8 md:p-12 text-white dark:text-gray-900 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Saving?</h2>
                <p className="text-lg md:text-xl opacity-90">
                  Join BookBarter ASU today and connect with fellow students to buy, sell, and exchange textbooks.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={user ? navigateToDashboard : navigateToSignup}
                  className="text-lg"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={navigateToDashboard}
                  className="bg-transparent border-white text-white hover:bg-white/10 dark:border-gray-900 dark:text-gray-900 dark:hover:bg-gray-900/10 text-lg"
                >
                  Browse Books
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">📚</span>
              <span className="font-bold text-xl text-asu-maroon dark:text-asu-gold">BookBarter ASU</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} BookBarter ASU. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Made with ❤️ by ASU students, for ASU students.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
