import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Creates a new entry in the interviewData table and returns the interviewId.
 * 
 * Expect POST request with JSON body:
 * {
 *   "companyName": str,
 *   "role": str,
 *   "minExpectedComp": int
 *   "maxExpectedComp": int
 * } 
 * 
 * Returns JSON response:
 * {
 *   "interviewId": int
 * }
 * 
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const interview = await request.json();

    const { data, error: supabaseError } = await supabase
      .from('interview')
      .insert(interview)
      .select('id');
    
    if (supabaseError !== null) {
      throw supabaseError;
    } else if (data === null) {
      throw new Error("null id returned");
    }

    const interviewId = data![0].id;
    return NextResponse.json({ interviewId }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
