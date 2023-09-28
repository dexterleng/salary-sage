import { NextRequest, NextResponse } from "next/server";
import { getHintsPrompt, ENDSUFFIX } from "@/utils/promptGeneration";
import { createClient } from "@supabase/supabase-js";
import { getChatCompletionMessage, prependRoles } from '@/utils/openaiChat'
export const revalidate = 0

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const interviewId = params.id;
        const { data } = await supabase.auth.getUser();
        const { user } = data;
        if (!user) {
          return NextResponse.json({ error: "Unauthorised. "}, { status: 400 });
        }

        const { data: profile } = await supabase
        .from('user')
        .select()
        .eq('userId', user.id)
        .single()
        .throwOnError()

        const { data: interview } = await supabase
            .from('interview')
            .select()
            .eq('id', interviewId)
            .single()
            .throwOnError();

        const { data: chatMessages } = await supabase
            .from('interview_message')
            .select()
            .eq('interviewId', interviewId)
            .neq('role', 'system')
            .order('createdAt', { ascending: true })
            .limit(10000)
            .throwOnError()

        console.log(chatMessages)


        let transcript = "";
        prependRoles(chatMessages!).forEach((m) => {
            transcript += m.content + "\n"
        });
        const hintsPrompt = getHintsPrompt(transcript, interview.companyName, interview.job_title, interview.suitability_analysis, interview.market_analysis, String(profile.minExpectedMonthlyIncome));

        const hint = await getChatCompletionMessage(hintsPrompt, "gpt-4") as string;
        
        const lastMessage = chatMessages![chatMessages!.length - 1].content;
        const hasEnded = lastMessage.includes(ENDSUFFIX);

        const outputData = {
            interviewId: interviewId,
            hint: hint.replaceAll("\"", ""),
            hasEnded: hasEnded,
            lastMessage: lastMessage.split(ENDSUFFIX)[0],
        }
        console.log("hint: ", outputData.hint)
        console.log("lastMessage: ", lastMessage)

        return NextResponse.json(outputData, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
