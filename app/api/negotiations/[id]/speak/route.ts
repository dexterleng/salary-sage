import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getChatCompletionMessage } from '@/utils/openaiChat'
import { getHiringManagerGuidelinesPrompt, getSuitabilityPrompt, getRecruiterMetaInstructionsPrompt, getRecruiterNegotiationPrompt } from '@/utils/promptGeneration';
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { GOOGLE_SERVICE_ACCOUNT_JSON, OPENAI_API_KEY } = process.env;
const { OPENAI_API_KEY } = process.env;
const googleServiceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON as string);
const spawn = require('child_process').spawn;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = params.id;
    const supabase = createRouteHandlerClient({ cookies })
    const { data } = await supabase.auth.getUser();
    const { user } = data;
    if (!user) {
      return NextResponse.json({ success: false, error: "Request failed" });
    }

    const { data: interview } = await supabase
      .from('interview')
      .select()
      .eq('id', interviewId)
      .eq('userId', user.id)
      .single()
      .throwOnError()

    const { data: messages } = await supabase
      .from('interview_message')
      .select()
      .eq('interviewId', interviewId)
      .order('createdAt', { ascending: true })
      .throwOnError()

    console.log("interview", interview)

    const formData = await request.formData();
    const file: File | null = formData.get('file') as any

    if (!file) {
      return NextResponse.json({ success: false })
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY as string });
    const { text: transcription } = await openai.audio.transcriptions.create({ file, model: 'whisper-1', language: 'en' })

    let replyText = "";

    const { data: recruiterMetaInstructionsData } = await supabase
      .from('interview')
      .select('meta_instructions')
      .eq('id', interviewId)
      .throwOnError()
    const recruiterMetaInstructions = recruiterMetaInstructionsData![0].meta_instructions;
    
    const { data: hiringManagerGuidelinesData } = await supabase
      .from('interview')
      .select('hm_guidelines')
      .eq('id', interviewId)
      .throwOnError()
    const hiringManagerGuidelines = hiringManagerGuidelinesData![0].hm_guidelines;

    const { data: suitabilityData } = await supabase
      .from('interview')
      .select('suitability_analysis')
      .eq('id', interviewId)
      .throwOnError()
    const suitability = suitabilityData![0].suitability_analysis;

    // get recruiter negotiations
    const recruiterNegotiationPrompt = getRecruiterNegotiationPrompt(recruiterMetaInstructions as string, 
                                                                     interview.companyName,
                                                                     interview.jobTitle,
                                                                     hiringManagerGuidelines as string,
                                                                     suitability as string);

    replyText = await getChatCompletionMessage(recruiterNegotiationPrompt, "gpt-3.5-turbo") as string

    console.log("replyText", replyText);

    const tts = new TextToSpeechClient({ credentials: googleServiceAccount })
    const [replyAudioResponse] = await tts.synthesizeSpeech({
      input: { text: replyText },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    })
    const replyAudio = replyAudioResponse.audioContent

    console.log(`
    input: ${transcription},
    output: ${replyText}
    `);

    await supabase
      .from('interview_message')
      .insert([
        { message: transcription, role: "user", createdAt: new Date().toISOString(), interviewId: interviewId },
        { message: replyText, role: "assistant", createdAt: new Date((new Date()).getTime() + 10).toISOString(), interviewId: interviewId },
      ])
      .throwOnError()

    const response = new NextResponse(replyAudio)
    response.headers.set('Content-Type', 'audio/mpeg3');
    return response;
  } catch (error) {
    console.log(error)
    // Handle errors such as network issues
    return NextResponse.json({ success: false, error: "Request failed" });
  }
}