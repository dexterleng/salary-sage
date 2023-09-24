import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Given an interviewId, retrieves its entire transcript in chronological order.
 * 
 * Expects POST request with JSON body:
 * {
 *   "interviewId": int
 * }
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
    const { data, error } = await supabase
      .from('interview_transcript')
      .select()
      .eq('id', interviewId)
      .order('created_at', { ascending: true });
    
    const transcript_arr = data?.map((row) => row.transcript);

    return NextResponse.json({ interviewId, transcript_arr, error }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}