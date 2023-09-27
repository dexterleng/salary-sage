import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  return NextResponse.redirect(`${requestUrl.origin}/waitlist/?message=You have joined the waitlist!`, { status: 301 })
}
