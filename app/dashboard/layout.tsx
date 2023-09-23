import { DashboardNavigationBar } from "@/components/DashboardNavigationBar"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export default async function DashboardLayout({
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

  return (
    <div className="w-full">
      <DashboardNavigationBar user={user} />
      {children}
    </div>
  )
}
