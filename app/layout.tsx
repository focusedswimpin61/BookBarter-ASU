import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocalStoreProvider } from "@/lib/local-store-provider"
import { AuthProvider } from "@/lib/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookBarter ASU",
  description: "A platform by Sun Devils, for Sun Devils. Buy, sell, and barter textbooks with fellow ASU students.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocalStoreProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LocalStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'