import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import './globals.css'
import { Mulish } from 'next/font/google'
import { cookies } from 'next/headers'
import { NavigationBar } from '@/components/NavigationBar'
import UpdateSettingsDialog from './dashboard/UpdateSettingsDialog'
import { useState } from 'react'

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
})

export const metadata = {
  title: 'SalarySage',
  description: 'Practice your salary negotiation skills with AI',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData: any;
  if (user) {
    const { data } = await supabase
      .from("user")
      .select()
      .eq("userId", user.id)
      .single();
    userData = data;
  }

  return (
    <html lang="en" className={`${mulish.variable}`}>
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <NavigationBar user={user} userData={userData} />
          {children}
        </main>
      </body>
    </html>
  )
}
