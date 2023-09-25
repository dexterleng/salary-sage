import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="w-full flex flex-col items-center bg-[url('/images/hero-bg.png')]">
      <div className="flex h-[calc(100vh-55px)] justify-center gap-8">
        <div className="animate-in flex flex-col gap-8 px-3 py-16 lg:py-24 justify-center">
          <TypographyH1>
            <div className="text-[64px] leading-tight">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E8365] via-[#15B57B] to-[#0C7C76]">Salary Negotiation</div>
              made easier with AI
            </div>
          </TypographyH1>
          <TypographyH2>Practice negotiation to get the pay you deserve.</TypographyH2>
          <Link href="/sign-up"><Button size="lg" className="w-fit">Get Started</Button></Link>
        </div>
        <Image src="/images/hero-image.svg" alt="Hero image for Salary Sage" width={600} height={600} />
      </div>
    </div>
  )
}
