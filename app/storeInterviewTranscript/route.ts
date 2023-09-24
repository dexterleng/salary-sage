import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Given an interviewId, and a transcript, stores it in the interview_transcript table.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int
 *   "transcript": str
 * }
 */
export async function POST(req: Request) {
  try {
    const { interviewId, transcript } = await req.json();

    // Store transcript into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase
      .from('interview_transcript')
      .insert({ id: interviewId, transcript: transcript });

    return NextResponse.json({ interviewId, error }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}