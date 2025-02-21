"use client"
import React, { FormHTMLAttributes } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const ResetButton = () => {
    const resetForm = () => {
        const form = document.querySelector(".search-form") as HTMLFormElement
        form.reset();
    }
  return (
    <Button type='reset' onClick={resetForm} className='!p-0 flex-1'>
        <Link href={'/search'} className="font-bebas-neue text-2xl p-6 py-2">Fshij kerkimin</Link>
    </Button>
  )
}

export default ResetButton