"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={() => router.push("/search")}
    >
      <Search className="h-4 w-4" />
      <span>Advanced Search</span>
    </Button>
  )
}
