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

        const data = {
            qualitative: {
                title: "Lack of Justification for Higher Salary",
                evaluation: "Although the candidate indicated that they felt the initial offer was low, they did not provide specific reasons to justify a higher salary. In a salary negotiation, it's important to justify why you believe you deserve more, such as citing market research, previous salary, or your qualifications and achievements.",
                citation: "I think I deserve SGD$135,000 because I am worth it.",
                suggestion: "Thank you for the offer. I believe my skill set and experience warrant a higher starting salary. For instance, I have experience with all the main programming languages used at Stripe, as well as considerable internship experience. I have also demonstrated project ownership and specialized knowledge in both frontend and backend technologies. Could we discuss a higher starting salary?"
            },
            quantitative: {
                preparation: {
                    evaluation: "There is no clear evidence in the transcript that suggests the candidate did extensive research on market salaries, company benefits, and industry trends. They did not mention any specific figures or benchmarks during the negotiation, which suggests they may have been underprepared.",
                    score: 30
                },
                value_proposition: {
                    evaluation: "The candidate's value proposition was not very strong. Although they mentioned their qualifications, they did not effectively tie these to the value they could bring to the company or justify why these warranted a higher salary. Instead, they simply stated that they felt the offer was low without providing a clear rationale.",
                    score: 40
                },
                relationship_building: {
                    evaluation: "The candidate's relationship with the recruiter seemed to remain neutral throughout the negotiation. They didn't take steps to significantly strengthen the relationship, but also didn't seem to severely damage it. However, their repetitive statements that they felt they were being low-balled could potentially strain the relationship.",
                    score: 50
                },
                assertiveness: {
                    evaluation: 'The candidate was somewhat assertive in expressing their dissatisfaction with the initial offer and requesting a higher salary. However, their approach became repetitive and lacked a clear rationale or strategy. Their repeated statements that they felt they were being low-balled could come across as overly aggressive without providing a clear path towards resolution.',
                    score: 45
                }
            }
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
