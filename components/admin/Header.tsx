import { Session } from 'next-auth'
import React from 'react'

const Header = ({session}: {session: Session}) => {
  return (
    <header className="admin-header">
        <div className="">
            <h2 className="text-2xl font-semibold text-dark-400">{session?.user?.name}</h2>
            <p className="text-base text-slate-500">Monitor of all your users and book here</p>
        </div>

        <p>Search</p>
    </header>
  )
}

export default Header