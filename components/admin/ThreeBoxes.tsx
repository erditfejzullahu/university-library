import React from 'react'

const ThreeBoxes = async () => {
    const responses = await Promise.all([
      fetch("http://localhost:3000/api/admin/books?type=CountBorrowBooks").then((res) => res.json()), // Assuming you're running the app on localhost:3000
      fetch("http://localhost:3000/api/admin/usersCount").then((res) => res.json()),
      fetch("http://localhost:3000/api/admin/books?type=CountBooks").then((res) => res.json())
    ])
    
    const [borrowBooksCount, usersCount, countBooks] = responses;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Libra te huazuar</span>
        </div>
        <div>   
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{borrowBooksCount.books}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Te gjithe perdoruesit</span> 
        </div>
        <div>
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{usersCount.users}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Te gjithe librat</span>
        </div>
        <div>
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{countBooks.books}</span>
        </div>
      </div>
    </div>
  )
}

export default ThreeBoxes