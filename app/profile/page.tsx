import { ProfileClient } from "./client"
import { getBooksByUser } from "@/app/actions/books"
import { getCurrentUser, GUEST_USER } from "@/lib/local-store"

export default async function ProfilePage() {
  // Get the current user's books
  const books = await getBooksByUser()

  // Get the current user or use guest user
  const user = getCurrentUser() || GUEST_USER

  return <ProfileClient user={user} books={books} />
}
