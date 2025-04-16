import { DashboardClient } from "./client"
import { getBooks } from "@/app/actions/books"
import { GUEST_USER, getCurrentUser } from "@/lib/local-store"

export default async function DashboardPage() {
  // Get books without authentication check
  const books = await getBooks()

  // Get the current user or use guest user
  const user = getCurrentUser() || GUEST_USER

  return <DashboardClient user={user} books={books} />
}
