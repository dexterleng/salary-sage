import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getFeedbackPrompts } from '@/utils/promptGeneration';
import { prependRoles, chainCompletionPrompts } from '@/utils/openaiChat'
import { Models } from 'openai/resources';

interface QualitativeFeedback {
    title: string,
    evaluation: string,
    citation: string,
    suggestion: string | null,
    is_positive: boolean,
    score: number,
}

interface QuantitativeFeedback {
    metric: string,
    evaluation: string,
    score: number
} 
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const interviewId = params.id;
        const supabase = createRouteHandlerClient({ cookies })
        // const { data: { user } } = await supabase.auth.getUser();
        // if (!user) {
        // return NextResponse.json({ success: false, error: "Request failed" });
        // } 
        const { data: chatMessages } = await supabase
        .from('interview_message')
        .select()
        .eq('interviewId', interviewId)
        .neq('role', 'system')
        .order('createdAt', { ascending: true })
        .limit(100)
        .throwOnError()
        console.log("chatMessages", chatMessages)
        const { data: interview } = await supabase
            .from('interview')
            .select()
            .eq('id', interviewId)
            .single()
            .throwOnError();

        let { data: qualitativeFeedbacksExisting } = await supabase
            .from('qualitative_feedback')
            .select()
            .eq('interviewId', interviewId)
            .limit(100)
            .throwOnError()
        
        let { data: quantitativeFeedbacksExisting } = await supabase
            .from('quantitative_feedback')
            .select()
            .eq('interviewId', interviewId)
            .limit(100)
            .throwOnError()
        
        let qualitativeFeedbacks: QualitativeFeedback[] = qualitativeFeedbacksExisting!.map(f => ({
            title: f.title,
            evaluation: f.evaluation,
            citation: f.citation,
            suggestion: f.suggestion,
            is_positive: f.is_positive,
            score: f.score
        }))
        let quantitativeFeedbacks: QuantitativeFeedback[] = quantitativeFeedbacksExisting!.map(f => ({
            metric: f.metric,
            evaluation: f.evaluation,
            score: f.score
        }))
        if (qualitativeFeedbacks!.length == 0 || quantitativeFeedbacks!.length == 0) {
            let transcript = "";
            prependRoles(chatMessages!).forEach((m) => {
                transcript += m.content + "\n"
            });
            const feedbackPrompts = getFeedbackPrompts(interview.companyName, interview.job_title, interview.suitability_analysis, transcript)
            
            const [qualitativeFeedbackStr, quantitativeFeedbackStr] = await chainCompletionPrompts(feedbackPrompts, "gpt-4")
            console.log("qualitativeFeedbackStr", qualitativeFeedbackStr)
            console.log("quantitativeFeedbackStr", quantitativeFeedbackStr)
            qualitativeFeedbacks = JSON.parse(qualitativeFeedbackStr)
            quantitativeFeedbacks = JSON.parse(quantitativeFeedbackStr)
            await supabase
            .from('qualitative_feedback')
            .insert(
                qualitativeFeedbacks.map((f) => ({
                    interviewId,
                    ...f
                }))
            )
            .throwOnError()

            await supabase
            .from('quantitative_feedback')
            .insert(
                quantitativeFeedbacks.map((f) => ({
                    interviewId,
                    ...f
                }))
            )
            .throwOnError()
        }
        
        const preparationMetric = quantitativeFeedbacks.find(f => f.metric === "preparation")
        const valueMetric = quantitativeFeedbacks.find(f => f.metric === "value_proposition")
        const relationshipMetric = quantitativeFeedbacks.find(f => f.metric === "relationship_building")
        const assertivenessMetric = quantitativeFeedbacks.find(f => f.metric === "assertiveness")

        const feedback = {
            qualitative: qualitativeFeedbacks,
            quantitative: {
                preparation: {
                    title: "Preparation",
                    evaluation: preparationMetric!.evaluation,
                    score: preparationMetric!.score
                },
                value_proposition: {
                    title: "Value Proposition",
                    evaluation: valueMetric!.evaluation,
                    score: valueMetric!.score
                },
                relationship_building: {
                    title: "Relationship Building",
                    evaluation: relationshipMetric!.evaluation,
                    score: relationshipMetric!.score
                },
                assertiveness: {
                    title: "Assertiveness",
                    evaluation: assertivenessMetric!.evaluation,
                    score: assertivenessMetric!.score
                }
            }
        }

        return NextResponse.json(feedback, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
