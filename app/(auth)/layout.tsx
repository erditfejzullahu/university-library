import { BookOpenText } from 'lucide-react'
import Image from 'next/image'
import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <main className="auth-container">
        <section className="auth-form">
            <div className="auth-box">
                <div className="flex flex-row items-center gap-2">
                    <BookOpenText className="text-white size-10"/>
                    <span className="text-white font-bebas-neue text-2xl">ShokuLibrit</span>
                </div>

                <div>{children}</div>
            </div>
        </section>

        <section className='auth-illustration'>
          <Image src={"/images/auth-illustration.png"} alt='auth illustration' width={1000} height={1000} className="size-full object-cover"/>
        </section>
    </main>
  )
}

export default layout