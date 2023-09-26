import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { getFeedback } from '../feedback/route';

const openai = new OpenAI({
  // requires OPENAI_API_KEY to be set in .env
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

/**
 * Given an interviewId, gives feedback to the user in the form of text.
 * 
 * Expects GET request with url parameter: interviewId
 * 
 * Returns JSON response:
 * {
 *   "interviewId": int,
 *   "feedback": str
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

    if (transcriptFetchError !== null) {
      throw transcriptFetchError;
    }
    
    // Get interview feedback from Supabase
    let { data: feedbackData, error: feedbackFetchError } = await supabase
      .from('interview_feedback')
      .select('confidence, communication, goodPoints, badPoints')
      .eq('id', interviewId);
    
    if (feedbackFetchError !== null) {
      throw feedbackFetchError;
    }

    if (feedbackData?.length === 0) {
      console.log("No feedback found, generating feedback...");
      feedbackData = await getFeedback(interviewId ?? "");
    }

    // Send prompt to OpenAI
    // TODO: insert real prompt here
    const prompt = `You have been provided with the transcript of a negotiation, along with
    feedback from the interviewer. Provide feedback to the candidate on their negotiation skills.
    Your response should be in the form of text.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {"role": "system", "content": JSON.stringify(transcriptData)},
        {"role": "system", "content": JSON.stringify(feedbackData)},
        {"role": "system", "content": prompt}
      ]
    });
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}