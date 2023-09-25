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
 * Given an interviewId and a user's response, ends the interview appropriately.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int
 *   "userResponse": str
 * }
 * 
 * Returns a StreamingTextResponse
 * 
 */
export async function POST(req: Request) {
  try {
    // Get interview data from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { interviewId } = await req.json();

    // Get interview transcript from Supabase
    const { data: transcriptData, error: transcriptFetchError } = await supabase
      .from('interview_transcript')
      .select('isInterviewer, transcript')
      .eq('id', interviewId)
      .order('created_at', { ascending: true });

    // Send prompt to OpenAI
    // TODO: insert real prompt here
    const prompt = `You have been provided with the transcript of a negotiation. 
    Please end the interview appropriately as the interviewer.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {"role": "system", "content": JSON.stringify(transcriptData)},
        {"role": "system", "content": prompt}
      ]
    });
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}