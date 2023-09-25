import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Given an interviewId, retrieves its entire transcript in chronological order.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int
 * }
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
 *     ],
 *   "supabaseError": str
 * }  
 * 
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const interviewId = url.searchParams.get('interviewId');

    // Get transcript from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error: supabaseError } = await supabase
      .from('interview_transcript')
      .select('isInterviewer, transcript')
      .eq('id', interviewId)
      .order('created_at', { ascending: true });

    return NextResponse.json({ interviewId, data, supabaseError }, { status: 200 });
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
 *   "interviewId": int,
 *   "supabaseError": str
 * }
 */
export async function POST(req: Request) {
  try {
    const { interviewId, role, transcript } = await req.json();

    // Store transcript into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error: supabaseError } = await supabase
      .from('interview_transcript')
      .insert({ id: interviewId, isInterviewer: null, transcript: transcript });

    return NextResponse.json({ interviewId, supabaseError }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}