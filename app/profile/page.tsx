import { ProfileClient } from "./client"
import { getServerBooksByUser, GUEST_USER } from "@/app/actions/get-server-user-books"

export default async function ProfilePage() {
  // Get the current user's books using the server-side function
  const books = await getServerBooksByUser()

  // Use the server-side guest user
  const user = GUEST_USER

  return <ProfileClient user={user} books={books} />
}
