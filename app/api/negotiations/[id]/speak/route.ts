import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { GOOGLE_SERVICE_ACCOUNT_JSON, OPENAI_API_KEY } = process.env;
const googleServiceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON as string);

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

    const chatGPTMessages = messages!.map((m) => ({
      role: m.isUser ? "user" : "assistant",
      content: m.message
    }))
    chatGPTMessages.push({
      role: 'user',
      content: transcription
    })
    chatGPTMessages.push({
      role: "system",
      content: `You have been provided with the transcript of a negotiation. Please continue the conversation.`,
    })

    console.log(chatGPTMessages)

    const replyResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: chatGPTMessages as any
    })

    const replyText = replyResponse.choices[0].message.content;

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
        { message: transcription, isUser: true, createdAt: new Date().toISOString(), interviewId: interviewId },
        { message: replyText, isUser: false, createdAt: new Date((new Date()).getTime() + 10).toISOString(), interviewId: interviewId },
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
