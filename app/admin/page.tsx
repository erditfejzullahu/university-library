import { auth } from '@/auth'
import BorrowRequests from '@/components/admin/BorrowRequests'
import RecentlyAdded from '@/components/admin/RecentlyAdded'
import ThreeBoxes from '@/components/admin/ThreeBoxes'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

const page = async () => {
  const session = await auth();

  return (
    <>
    <section>
      <Suspense fallback={<Skeleton className="h-28 w-full rounded-lg"/>}>
        <ThreeBoxes />
      </Suspense>
    </section>
    <section className="mt-4">
      <div className="flex flex-row gap-4 justify-between">
        <BorrowRequests session={session} />
        <RecentlyAdded />
      </div>
    </section>
    </>
  )
}

export default page