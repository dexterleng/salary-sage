import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Practice",
  description: "Practice your salary negotiation skills with AI",
};

export default async function PracticeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login/')
  }

  // TODO: check if selected practice session has ended and redirect to dashboard if so

  // TODO: check if selected practice session has already started before and resume if so

  return (
    <div className="w-full">
      {children}
    </div>
  )
}
