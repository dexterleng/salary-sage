import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const interviewId = params.id;

        // get out transcript
        const { data: messages } = await supabase
            .from('interview_message')
            .select()
            .eq('interviewId', interviewId)
            .order('id', { ascending: true })
            .throwOnError()

        // set has ended to true
        await supabase
            .from("interview")
            .update({ hasEnded: true })
            .eq("id", interviewId)
            .throwOnError();

        // get out interview data
        const { data: interview } = await supabase
            .from('interview')
            .select()
            .eq('id', interviewId)
            .throwOnError();

        const hasEnded = interview![0].hasEnded;

        const companyName = interview![0].company;
        const jobTitle = interview![0].jobTitle;
        const suitabilityAnalysis = interview![0].suitabilityAnalysis;

        let transcript = "";
        messages!.forEach((m) => (
            transcript += m.role + ": " + m.content + "\n"
        ));

        // TODO: call getFeedback with the necessary params
        // TODO: store feedback in the database

        const outputData = {
            hasEnded: hasEnded,
        }

        return NextResponse.json(outputData, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
