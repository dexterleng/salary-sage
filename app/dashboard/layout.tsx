import { NavigationBar } from "@/components/NavigationBar"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'
import { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Dashboard",
};

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
    <>{children}</>
  )
}
