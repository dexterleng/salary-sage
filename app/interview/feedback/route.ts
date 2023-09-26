import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  // requires OPENAI_API_KEY to be set in .env
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function getFeedback(interviewId: string) {
  const openai = new OpenAI({
  // requires OPENAI_API_KEY to be set in .env
  apiKey: process.env.OPENAI_API_KEY,
  });

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

  if (transcriptFetchError !== null) {
      throw transcriptFetchError;
  }

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
  const { confidence, communication, goodPoints, badPoints } = contentAsJson;

  const { error: feedbackInsertError } = await supabase
    .from('interview_feedback')
    .insert({ id: interviewId, confidence: confidence, communication: communication,
        goodPoints: goodPoints, badPoints: badPoints});

  if (feedbackInsertError !== null) {
      throw feedbackInsertError;
  }

  return contentAsJson;
}

/**
 * Given an interviewId, gives feedback to the user in the below format.
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

    const feedbackData = await getFeedback(interviewId!);

    return NextResponse.json(feedbackData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}