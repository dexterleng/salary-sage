import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function getTranscript(interviewId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error: supabaseError } = await supabase
    .from('interview_transcript')
    .select('isInterviewer, transcript')
    .eq('id', interviewId)
    .order('created_at', { ascending: true });

  if (supabaseError !== null) {
    throw supabaseError;
  }
  return data;
}

export async function storeTranscript(interviewId: string, isInterviewer: boolean, transcript: string) {
  // Store transcript into Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error: supabaseError } = await supabase
    .from('interview_transcript')
    .insert({ id: interviewId, isInterviewer: isInterviewer, transcript: transcript });

  if (supabaseError !== null) {
    throw supabaseError;
  }
}

/**
 * Given an interviewId, retrieves its entire transcript in chronological order.
 * 
 * Expects GET request with url parameter: interviewId
 * 
 * Returns JSON response:
 * {
 *   "interviewId": int,
 *   "data": 
 *     [
 *       {
 *         "isInterviewer": bool,
 *         "transcript": str
 *       }
 *     ]
 * }  
 * 
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const interviewId = url.searchParams.get('interviewId');

    const data = await getTranscript(interviewId ?? "");

    return NextResponse.json({ interviewId, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * Given an interviewId, and a transcript, stores it in the interview_transcript table.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int,
 *   "isInterviewer": bool,
 *   "transcript": str
 * }
 * 
 * Returns JSON response:
 * {
 *   "interviewId": int
 * }
 */
export async function POST(req: Request) {
  try {
    const { interviewId, isInterviewer, transcript } = await req.json();
    await storeTranscript(interviewId, isInterviewer, transcript);
    return NextResponse.json({ interviewId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}