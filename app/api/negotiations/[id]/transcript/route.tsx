import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const interviewId = params.id;
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
        return NextResponse.json({ success: false, error: "Request failed" });
        } 

        const data = [
            {
                isUser: true,
                message: "Hi there I am Robert. Nice to meet you.",
                createdAt: new Date().toISOString(),
            }
        ]

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
