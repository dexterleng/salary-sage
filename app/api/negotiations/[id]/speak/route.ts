import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getChatCompletionMessage, prependRoles, recruiterPrefix } from '@/utils/openaiChat'
import { jobTitle, recruiterName } from '@/utils/placeholders'
import { ENDSUFFIX } from '@/utils/promptGeneration';
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { GOOGLE_SERVICE_ACCOUNT_JSON, OPENAI_API_KEY } = process.env;
const googleServiceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON as string);
export const revalidate = 0

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

    const { data: profile } = await supabase
      .from('user')
      .select()
      .eq('userId', user.id)
      .single()
      .throwOnError()

    const { data: messagesOrNull } = await supabase
      .from('interview_message')
      .select()
      .eq('interviewId', interviewId)
      .order('createdAt', { ascending: true })
      .limit(200)
      .throwOnError()



    const messages = messagesOrNull ?? [];

    const [nonSystemMessages, systemMessage] = [messages?.filter((m) => m.role != "system"), messages?.filter((m) => m.role == "system")[0]]

    const orderedMessages = [systemMessage, ...nonSystemMessages]

    const chatGPTMessages = orderedMessages!.map((m) => ({
      role: m.role,
      content: m.content
    }))

    // console.log("interview", interview)

    const isFirstResponse = nonSystemMessages.length == 0
    let transcription = ''
    let replyText = ''
    const receiptDatetime = new Date()
    if (isFirstResponse) {
      replyText = get_opening_statement(profile.firstName, recruiterName, interview.companyName, jobTitle)
    } else {
      const formData = await request.formData();
      const file: File | null = formData.get('file') as any

      if (!file) {
        return NextResponse.json({ success: false })
      }

      transcription = await convertSpeechToText(file)

      chatGPTMessages.push({role: "user", content: transcription})
      const conversation = prependRoles(chatGPTMessages)
      replyText = await getChatCompletionMessage(conversation, "gpt-4") as string
    }
      

    replyText = replyText.replace(recruiterPrefix, '')
    // console.log("replyText", replyText);
    const transcribeReplyText = replyText.split(ENDSUFFIX)[0]
    const replyAudio = await convertTextToSpeech(transcribeReplyText)

    console.log(`
    input: ${transcription},
    output: ${transcribeReplyText}
    `);

    let interviewMessages = [{ content: replyText, role: "assistant", createdAt: new Date().toISOString(), interviewId: interviewId }]
    if (!isFirstResponse) {
      interviewMessages.push({ content: transcription, role: "user", createdAt: receiptDatetime.toISOString(), interviewId: interviewId })
    }

    await supabase
      .from('interview_message')
      .insert(interviewMessages)
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


async function convertSpeechToText(file: File) {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY as string });
  const { text: transcription } = await openai.audio.transcriptions.create({ file, model: 'whisper-1', language: 'en' })
  return transcription
}

async function convertTextToSpeech(text: string) {
  const tts = new TextToSpeechClient({ credentials: googleServiceAccount })
  const [replyAudioResponse] = await tts.synthesizeSpeech({
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' }
  })
  const replyAudio = replyAudioResponse.audioContent
  return replyAudio
}

function get_opening_statement(candidate: string, recruiter: string, company: string, job_title: string) {
    const statements = [
        `Hello ${candidate}! This is ${recruiter} from ${company}. Thanks for taking the time to chat today. I've got some thrilling news about the ${job_title} position that I think youll be quite excited about. And later on, we can delve into the specifics and talk salary. How does that sound?`,
        `Hey there, ${candidate}! It's ${recruiter} Smith from ${company}. I hope you've got your dancing shoes on because we've got some fantastic news regarding the ${job_title} role. And once the celebrations are over, we can chat about the nitty-gritty, including the compensation. Sound good?`,
        `Good day, ${candidate}. This is ${recruiter} from ${company}. First off, thank you for making the time. I've got some great news about the ${job_title} position to share. After that, we'll touch on the offer details and any salary discussions you might want to have.`,
        `Hi ${candidate}! It's ${recruiter}from ${company}. I must say, it's an absolute pleasure to be speaking with you today. I have some wonderful news about the ${job_title} role, and I'd also love to have a candid chat about the compensation. How does that sit with you?`,
        `${candidate}! ${recruiter} here from ${company}. First off, HUGE thanks for taking the time. Brace yourself because I have some epic news about the ${job_title} position! Once we've shared that buzz, let's chat figures. How's that sound?`,
        `Hello ${candidate}, this is ${recruiter} speaking from ${company}. I genuinely appreciate you taking the time out of your busy schedule to speak with me today. I'm thrilled to discuss the offer for the ${job_title} position with you and later touch on the details, especially regarding compensation.`,
        `Hey ${candidate}! It's ${recruiter} from ${company}. First up, big thanks for hopping on the call. Got some sweet news about the ${job_title} gig. And once we've celebrated that bit, let's dive deep into the offer details and, of course, the moolah. Cool with you?`,
        `Good afternoon, ${candidate}. My name is ${recruiter}, and I represent ${company}. I'd like to start by expressing our gratitude for your time and interest. Today, I have the pleasure of sharing some positive updates regarding the ${job_title} role and, subsequently, delve into the specifics of our offer, including compensation.`,
        `${candidate}, what a joy to finally speak! It's ${recruiter} from ${company}. HUGE shoutout for making time. Ready for some awesome news on the ${job_title} front? And once the confetti settles, let's chat numbers. Sound good?`,
        `Hello ${candidate}! I'm ${recruiter} from ${company}. Before we dive in, how's your day been? Thanks so much for setting aside this time. Now, for the exciting part: I've got updates on the ${job_title} position. And, after that, let's discuss the details, especially the compensation. Shall we?`
    ]
    return statements[Math.floor(Math.random() * statements.length)]
  }
