import './globals.css'
import { Mulish } from 'next/font/google'

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
})

export const metadata = {
  title: 'SalarySage',
  description: 'Practice your salary negotiation skills with AI',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mulish.variable}`}>
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
