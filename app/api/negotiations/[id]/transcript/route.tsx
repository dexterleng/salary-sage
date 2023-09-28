import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const interviewId = params.id;
        const supabase = createRouteHandlerClient({ cookies })

        const { data: chatMessages } = await supabase
        .from('interview_message')
        .select()
        .eq('interviewId', interviewId)
        .neq('role', 'system')
        .order('createdAt', { ascending: true })
        .limit(100)
        .throwOnError()
    
        
        const transcript = chatMessages!.map(m => ({
            isUser: m.role == "user",
            message: m.content,
            createdAt: m.createdAt
        }))

        return NextResponse.json(transcript, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
