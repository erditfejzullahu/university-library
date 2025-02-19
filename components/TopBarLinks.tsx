"use client"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const TopBarLinks = () => {
    const pathname = usePathname();
    const [links, setLinks] = useState([
        {name: "Ballina", link: "/"},
        {name: "Kerkoni", link: "/search"}
    ])
  return (
    <>
    {links.map((item, i) => (
        <li key={i}><Link className={cn("text-light-100 text-base", pathname === item.link ? "!text-primary" : "")} href={item.link}>{item.name}</Link></li>
    ))}
    </>
  )
}

export default TopBarLinks