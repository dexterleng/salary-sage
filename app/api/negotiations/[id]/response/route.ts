import { NextRequest, NextResponse } from "next/server";
import { getHintsPrompt } from "@/utils/promptGeneration";
import { createClient } from "@supabase/supabase-js";
import { getChatCompletionMessage } from '@/utils/openaiChat'

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

        const { data: messages } = await supabase
            .from('interview_message')
            .select()
            .eq('interviewId', "1")
            .order('id', { ascending: true })
            .throwOnError()

        let transcript = "";
        messages!.forEach((m) => (
            transcript += m.role + ": " + m.message
        ));

        const { data: interviewData } = await supabase
            .from('interview')
            .select()
            .eq('id', interviewId)
            .throwOnError();

        const interview = interviewData![0];

        const hintsPrompt = getHintsPrompt(transcript, interview.company, interview.job_title, interview.suitability_analysis, interview.market_analysis);

        const hints = await getChatCompletionMessage(hintsPrompt, "gpt-3.5-turbo") as string;
        const hintsArr = JSON.parse(hints);

        const lastMessage = messages![messages!.length - 1].message;
        const hasEnded = lastMessage.includes("<<END>>");

        const outputData = {
            interviewId: interviewId,
            hint: hintsArr[0],
            hasEnded: hasEnded,
            lastMessage: lastMessage,
        }

        return NextResponse.json(outputData, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}