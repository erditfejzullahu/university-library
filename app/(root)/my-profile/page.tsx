import { signOut } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <>
    <form className="mb-10" action={async () => {
        "use server"
        await signOut()
    }}>
        <Button>Logout</Button>
    </form>

    <BookList title='Borrowed Books' books={[]}></BookList>
    </>
  )
}

export default page