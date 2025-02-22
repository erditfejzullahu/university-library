import ThreeBoxes from '@/components/admin/ThreeBoxes'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

const page = () => {

  return (
    <section>
      <Suspense fallback={<Skeleton className="h-28 w-full rounded-lg"/>}>
        <ThreeBoxes />
      </Suspense>
    </section>
  )
}

export default page