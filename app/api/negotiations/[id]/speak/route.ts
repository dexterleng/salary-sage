const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const { GOOGLE_SERVICE_ACCOUNT_JSON, OPENAI_API_KEY } = process.env;
const googleServiceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON as string);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const formData = await request.formData();
  const file: File | null = formData.get('file') as any

  if (!file) {
    return NextResponse.json({ success: false })
  }

  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);
  // writeFileSync("/Users/macintosh/code/real/salary-sage/recording.wav", buffer);

  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY as string });
    const { text: transcription } = await openai.audio.transcriptions.create({ file, model: 'whisper-1', language: 'en' })

    const replyResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: [
        {
          role: 'user',
          content: transcription
        },
      ]
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

    const response = new NextResponse(replyAudio)
    response.headers.set('Content-Type', 'audio/mpeg3');
    return response;
  } catch (error) {
    console.log(error)
    // Handle errors such as network issues
    return NextResponse.json({ success: false, error: "Request failed" });
  }
}