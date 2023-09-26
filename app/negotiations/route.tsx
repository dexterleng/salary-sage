import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  if (!user) {
    return NextResponse.redirect(`${requestUrl.origin}/login/`, { status: 301, })
  }

  const formData = await request.formData();
  const companyName = formData.get('companyName') as string;
  const minExpectedMonthlyIncome = parseInt(formData.get('minExpectedMonthlyIncome') as string);
  const maxExpectedMonthlyIncome = parseInt(formData.get('maxExpectedMonthlyIncome') as string);

  console.log({ companyName, minExpectedMonthlyIncome, maxExpectedMonthlyIncome })

  const { data: interview } = await supabase
    .from('interview')
    .insert({ companyName, minExpectedMonthlyIncome, maxExpectedMonthlyIncome, userId: user.id })
    .throwOnError()
    .select()
    .single()

  console.log(interview)

  return NextResponse.redirect(`${requestUrl.origin}/negotiations/${interview.id}/practice/`, { status: 301 })
}
