import Link from 'next/link'
import React from 'react'

const RecentlyAdded = () => {
  return (
    <div className="flex-1 bg-white rounded-lg p-4">
        <div className="flex flex-row justify-between items-center">
            <div>
                <span className="text-xl  text-dark-100 font-semibold">Librat e shtuar se fundmi</span>
            </div>
            <div>
                <Link href={"/admin/all-borrow-requests"} className="bg-light-300 text-primary-admin font-medium py-1.5 px-4 rounded-lg">Shiko te gjitha</Link>
            </div>
        </div>
    </div>
  )
}

export default RecentlyAdded