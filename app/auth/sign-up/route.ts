import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const firstName = String(formData.get('firstName'))
  const lastName = String(formData.get('lastName'))
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const inviteCode = String(formData.get('inviteCode'))
  const supabase = createRouteHandlerClient({ cookies })

  if (inviteCode !== "CS3216") {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up?error=Invalid invite code`,
      { status: 301 }
    )
  }

  const { error, data } = await supabase.auth.signUp({ email, password })

  if (error || !data || !data.user) {
    console.log(error)
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

  await supabase.from('user').insert({
    userId: data.user.id,
    firstName,
    lastName
  });

  return NextResponse.redirect(
    `${requestUrl.origin}/dashboard`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}
