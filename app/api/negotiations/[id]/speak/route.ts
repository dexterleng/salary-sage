import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
// const { GOOGLE_SERVICE_ACCOUNT_JSON, OPENAI_API_KEY } = process.env;
const { OPENAI_API_KEY } = process.env;
// const googleServiceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON as string);
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

    if (true || messages!.length === 0) {
      console.log("start of negotiation")
      // Means this is the start of the negotiation

      // get hiring manager guidelines
      const hiringManagerGuidelinesPrompt = getHiringManagerGuidelinesPrompt(interview);
      console.log("hiringManagerGuidelinesPrompt: ", hiringManagerGuidelinesPrompt);
      const hmgpMessages = [{ role: "user", content: hiringManagerGuidelinesPrompt }]
      const hiringManagerGuidelines = await getChatGPTResponse(openai, hmgpMessages);
      console.log("hiringManagerGuidelines: ", hiringManagerGuidelines);
      return;

      // get suitability
      const suitabilityPrompt = getSuitabilityPrompt(interview);
      console.log("suitabilityPrompt: ", suitabilityPrompt);
      const suitabilityMessages = [{ role: "user", content: suitabilityPrompt }]
      const suitability = await getChatGPTResponse(openai, suitabilityMessages);
      console.log("suitability: ", suitability);

      // get recruiter meta instructions
      const recruiterMetaInstructionsPrompt = getRecruiterMetaInstructionsPrompt(interview);
      console.log("recruiterMetaInstructionsPrompt: ", recruiterMetaInstructionsPrompt)
      const rmipMessages = [{ role: "user", content: recruiterMetaInstructionsPrompt }]
      const recruiterMetaInstructions = await getChatGPTResponse(openai, rmipMessages);
      console.log("recruiterMetaInstructions: ", recruiterMetaInstructions)

      // get recruiter negotiations
      const recruiterNegotiationPrompt = getRecruiterNegotiationsPrompt(interview, recruiterMetaInstructions as string, hiringManagerGuidelines as string, suitability as string);
      const rnpMessages = [{ role: "user", content: recruiterNegotiationPrompt }]
      replyText = await getChatGPTResponse(openai, rnpMessages) as string;
    } else {
      const chatGPTMessages = messages!.map((m) => ({
        role: m.isUser ? "user" : "assistant",
        content: m.message
      }))
      chatGPTMessages.push({
        role: 'user',
        content: transcription
      })

      console.log(chatGPTMessages)

      const replyResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: false,
        messages: chatGPTMessages as any
      })

      replyText = replyResponse.choices[0].message.content as string;
    }
    console.log("replyText: " + replyText);

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

async function getChatGPTResponse(openai: OpenAI , messages: any) {
  const replyResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: messages as any
  })

  const replyText = replyResponse.choices[0].message.content;
  return replyText;
}

function getHiringManagerGuidelinesPrompt(interview: any) {
  /*
  const pythonProcess = spawn('python3', [
    '../../../../python_scripts/getHiringManagerGuidelinesPrompt.py',
    interview!.companyName,
    interview!.jobTitle,
    "", // job description
    "", // location
    interview!.yearsOfExperience,
    "", // market analysis
  ])
  let output = "";
  pythonProcess.stdout.on('data', (data: any) => {
    output += data
  });
  return output;
  */

  // needed to sleep, so i gave up and just did it in js
  const job_title = interview!.jobTitle;
  const location = "";
  const job_description = "";
  const market_analysis = "";
  return `You are a hiring manager for a company. 
        Your role is to generate out key metrics and restrictions necessary for your recruiters to conduct salary negotiation effectively. 

        Steps:
        1) For each of the  questions below, evaluate step-by-step what a fair estimation and range will be given the company, location, job description, market analysis and years of experience of the candidate. 
        2) Using the evaluation, provide an educated answer for each question, understanding the trade-off between attracting more quality candidates with higher compensations and keeping company expenses in check with lower compensations. 
        3) Be reasonable with the compensation and do not overinflate. Base Salary range should not be too big, variance should be about 10% around the mean.
        4) For currency, use Singapore Dollars.
        5) Output the answers to the questions as a JSON format and absolutely nothing else.
        {{
            "[category]": {{
                "[question]": {{
                    "evaluation": [evaluation],
                    "answer": [answer]
                    }}
                }}
        }}
        Company: {company}
        Role: ${job_title}

        Years of experience: {years_of_experience}
        Location: ${location}

        Job description: 
        ${job_description}

        Market analysis:
        ${market_analysis}

        Questions:
        1. Budget for the position
        - Base salary range?
        - Bonus range, if any?
        - Sign-on bonus range, if any?
        - Is there any flexibility beyond the base, bonus and sign-on bonus?

        2. Competitors
        - What is the general industry standard for this position in terms of monetary compensation?
        - What Does the Benefits Package Include?

        3. Other monetary compensations
        - What is the health insurance coverage, retirement benefits, and any other additional perks?

        4. Criticality of the role
        - Is this a role we've had difficulty filling?

        5. Alternative Compensation methods
        - How many days off per year?
        - Can we offer more vacation time, a signing bonus, or other non-standard benefits if we can't meet the base salary expectation?
        - Are there opportunities for accelerated performance reviews or early promotions?

        6. Career trajectory of this role.
        - How quickly can the candidate expect promotions or raises based on performance?

        7. External factors
        - Are there economic factors, company performance issues, or hiring freezes that could affect the negotiation?`
}

function getSuitabilityPrompt(interview: any) {
  const pythonProcess = spawn('python', [
    '../../../../python_scripts/getSuitabilityPrompt.py',
    "", // normalised resume
    interview!.companyName,
    interview!.jobTitle,
    "", // job description
  ])
  let output = "";
  pythonProcess.stdout.on('data', (data: any) => {
    output += data
  });
  return output;
}

function getRecruiterMetaInstructionsPrompt(interview: any) {
  const pythonProcess = spawn('python', [
    '../../../../python_scripts/getRecruiterMetaInstructionsPrompt.py',
    interview!.difficulty,
  ])
  let output = "";
  pythonProcess.stdout.on('data', (data: any) => {
    output += data
  });
  return output;
}

function getRecruiterNegotiationsPrompt(interview: any, metaInstructions: string, hiringManagerGuidelines: string, suitability: string) {
  const pythonProcess = spawn('python', [
    '../../../../python_scripts/getRecruiterNegotiationsPrompt.py',
    metaInstructions,
    interview!.companyName,
    interview!.jobTitle,
    hiringManagerGuidelines,
    suitability
  ])
  let output = "";
  pythonProcess.stdout.on('data', (data: any) => {
    output += data
  });
  return output;
}