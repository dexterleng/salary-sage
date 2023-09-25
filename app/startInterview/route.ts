import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  // requires OPENAI_API_KEY to be set in .env
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

/**
 * Given an interviewId, starts an interview.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int
 * }
 */
export async function POST(req: Request) {
  try {
    // Get interview data from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { interviewId } = await req.json();
    const { data } = await supabase
      .from('interview')
      .select('*')
      .eq('id', interviewId);
    const { companyName, role, minExpectedComp, maxExpectedComp } = data![0];

    // Send prompt to OpenAI
    // TODO: insert real prompt here
    const prompt = `You are a negotiator. You are negotiating with a candidate for \
a ${role} position at ${companyName}. The candidate's expected total compensation \
is between $${minExpectedComp} and $${maxExpectedComp}. You will have a conversation \
with the candidate to determine the candidate's expected total compensation. \
Please ask your first question.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {"role": "system", "content": prompt}
      ]
    });
    const stream = OpenAIStream(response);

    // Store prompt into Supabase
    const { error: supabaseError } = await supabase
      .from('interview_transcript')
      .insert({ id: interviewId, transcript: prompt });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}