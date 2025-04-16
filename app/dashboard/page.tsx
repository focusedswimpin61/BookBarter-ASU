import { DashboardClient } from "./client"
import { getServerBooks } from "@/app/actions/get-server-books"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string; genre?: string }
}) {
  const { tab = "browse", genre } = searchParams

  // Get books using the server-side function
  const books = await getServerBooks(genre as any)

  return <DashboardClient initialTab={tab} books={books} />
}
