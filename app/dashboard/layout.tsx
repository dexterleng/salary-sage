import { DashboardNavigationBar } from "@/components/DashboardNavigationBar"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: session, error } = await supabase.auth.getSession()

  if (error || !session) {
    return redirect('/login');
  }

  return (
    <div className="w-full">
      <DashboardNavigationBar />
      {children}
    </div>
  )
}
