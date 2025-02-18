import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import "@/styles/admin.css";
import React, { ReactNode } from 'react'
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { prisma } from '@/lib/prisma';

const layout = async ({children}: {children: ReactNode}) => {
    const session = await auth()

    if(!session?.user?.id) redirect('/sign-in');

    const isAdmin = await prisma.user.findUnique({
      where: {id: session.user.id}
    }).then(user => user?.role === "ADMIN")

    if(!isAdmin){
      redirect('/')
    }
    
  return (
    <main className="flex min-h-screen w-full flex-row">
        <Sidebar session={session}/>

        <div className="admin-container">
            <Header session={session}/>
            {children}
        </div>
    </main>
  )
}

export default layout