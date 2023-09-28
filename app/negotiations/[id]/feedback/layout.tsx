import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Feedback",
  description: "Practice your salary negotiation skills with AI",
};

export default async function FeedbackLayout({
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

  // TODO: check if selected practice session has ended else end it and redirect to feedback

  return (
    <div className="w-full">
      {children}
    </div>
  )
}
