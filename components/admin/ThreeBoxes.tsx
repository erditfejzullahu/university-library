"use client"
import { useCounts } from '@/hooks/data-fetch'
import React from 'react'
import ErrorState from '../ErrorState'

const ThreeBoxes = () => {
    const {usersCount, booksCount, borrowBooksCount, error, errors} = useCounts()
    console.log(errors, ' ????');
    
  return (
    <div className="grid grid-cols-3 gap-4">
      {errors.borrowBooksCount ? (<ErrorState />) : ( <div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Libra te huazuar</span>
        </div>
        <div>   
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{borrowBooksCount?.book}</span>
        </div>
      </div>)}
      {errors.usersCount ? ( <ErrorState />) : (<div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Te gjithe perdoruesit</span> 
        </div>
        <div>
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{usersCount?.users}</span>
        </div>
      </div>)}
      {errors.booksCount ? ( <ErrorState />) : (<div className="bg-white rounded-xl flex flex-col gap-4 p-4">
        <div>
          <span className="text-gray-600 font-ibm-plex-sans text-base">Te gjithe librat</span>
        </div>
        <div>
          <span className="text-black font-ibm-plex-sans text-lg font-semibold">{booksCount?.book}</span>
        </div>
      </div>)}
    </div>
  )
}

export default ThreeBoxes