import { auth } from '@/auth'
import Header from '@/components/Header'
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import React, { ReactNode } from 'react'
import { prisma } from '@/lib/prisma';

const layout = async ({children}: {children: ReactNode}) => {
  const session = await auth();
  if(!session) redirect('/sign-in')

    after(async() => {
      if(!session?.user?.id) return;

      await prisma.user.update({
        where: {id: session?.user?.id},
        data: {
          lastActivity: new Date().toISOString()
        }
      })
    })

  return (
    <main className="root-container">
        <div className="mx-auto max-w-7xl w-full">
            <Header session={session}/>
            
            <div className="mt-20 pb-20 min-w-full">
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout