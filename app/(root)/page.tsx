import { auth } from "@/auth"
import BookList from "@/components/BookList"
import BookOverview from "@/components/BookOverview"
import { prisma } from "@/lib/prisma"

const Home = async () => {
  const session = await auth();

  const latestBooks = await prisma.books.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList 
        title="Latest Books"
        books={latestBooks.slice(1)} // later slice(1) to remove first
        containerClassName="mt-28"
      />
    </>
  )
}

export default Home