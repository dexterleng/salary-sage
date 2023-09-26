const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const { GOOGLE_SERVICE_ACCOUNT_JSON } = process.env;
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
    const openai = new OpenAI({ apiKey: "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" });
    const { text: transcription } = await openai.audio.transcriptions.create({ file, model: 'whisper-1', language: 'en' })

    const replyResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: [
        {
          role: "system",
          content: "Repeat what the user said but how a baby would say it. Incorporate baby speech like Goo Goo Gaa Gaa"
        },
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
    writeFileSync("/Users/macintosh/code/real/salary-sage/reply.mp3", replyAudio as any, 'binary')

    console.log(`
    input: ${transcription},
    output: ${replyText}
    `);

    const response = new NextResponse(replyAudio)
    response.headers.set('Content-Type', 'audio/mpeg3');
    return response;

    // return NextResponse.json({ success: true, transcription, replyText });
  } catch (error) {
    console.log(error)
    // Handle errors such as network issues
    return NextResponse.json({ success: false, error: "Request failed" });
  }
}
