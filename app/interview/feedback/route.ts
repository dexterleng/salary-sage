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
 * Given an interviewId, gives feedback to the user.
 * 
 * Expects GET request with url parameter: interviewId
 * 
 * Returns JSON response:
 * {
 *   "interviewId": int,
 *   "confidence": int,
 *   "communication": int,
 *   "goodPoints": [str],
 *   "badPoints": [str]
 * }
 * 
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const interviewId = url.searchParams.get('interviewId');

    // Get interview data from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get interview transcript from Supabase
    const { data: transcriptData, error: transcriptFetchError } = await supabase
      .from('interview_transcript')
      .select('isInterviewer, transcript')
      .eq('id', interviewId)
      .order('created_at', { ascending: true });

    // Send prompt to OpenAI
    // TODO: insert real prompt here
    const prompt = `You have been provided with the transcript of a negotiation. Provide feedback to the
    candidate on their negotiation skills. Your response should be of the format:
    {
      "confidence": int,
      "communication": int,
      "goodPoints": [str],
      "badPoints": [str]
    }`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {"role": "system", "content": JSON.stringify(transcriptData)},
        {"role": "system", "content": prompt}
      ]
    });
    const contentAsJson = JSON.parse(response.choices[0].message.content ?? '');
    return NextResponse.json(contentAsJson, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}