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
  const jobTitle = formData.get('jobTitle') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const yearsOfExperience = parseInt(formData.get('yearsOfExperience') as string);
  const currentMonthlyIncome = parseInt(formData.get('currentMonthlyIncome') as string);
  const minExpectedMonthlyIncome = parseInt(formData.get('minExpectedMonthlyIncome') as string);
  const maxExpectedMonthlyIncome = parseInt(formData.get('maxExpectedMonthlyIncome') as string);

  console.log({ yearsOfExperience, currentMonthlyIncome, minExpectedMonthlyIncome, maxExpectedMonthlyIncome })

  await supabase
    .from('user')
    .update({ jobTitle: jobTitle ?? "Software Engineer", firstName, lastName, yearsOfExperience, currentMonthlyIncome, minExpectedMonthlyIncome, maxExpectedMonthlyIncome, userId: user.id })
    .eq('userId', user.id)
    .throwOnError();

  return NextResponse.redirect(`${requestUrl.origin}/dashboard/`, { status: 301 })
}
