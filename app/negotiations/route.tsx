import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getHiringManagerGuidelinesPrompt, getRecruiterNegotiationPrompt, getRecruiterMetaInstructionsPrompt, getSuitabilityPrompt } from '@/utils/promptGeneration'
import { getChatCompletionMessage } from '@/utils/openaiChat'
import { marketAnalysis, parsedResume, location, jobDescription, jobTitle, difficulty } from '@/utils/placeholders'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  /*
  1. Get interview params: companyName, position, min/maxExpectedMonthlyIncome
  2. Get user's profile params: firstName, lastName, yearsOfExperience, userId
  3. Call an async function to setupInterview
  4. Create a interview row with companyName, minExpectedMonthlyIncome, maxExpectedMonthlyIncome, userId: user.id and the outputs of setupInterview
  5. redirect and return
  */
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  if (!user) {
    return NextResponse.redirect(`${requestUrl.origin}/login/`, { status: 301, })
  }

  const { data: profile } = await supabase
  .from('user')
  .select()
  .eq('userId', user.id)
  .single()
  .throwOnError()

  const formData = await request.formData();
  const companyName = formData.get('companyName') as string;
  const minExpectedMonthlyIncome = parseInt(formData.get('minExpectedMonthlyIncome') as string);
  const maxExpectedMonthlyIncome = parseInt(formData.get('maxExpectedMonthlyIncome') as string);
  console.log({ companyName, minExpectedMonthlyIncome, maxExpectedMonthlyIncome })

  const interviewData = await setupInterview(parsedResume, companyName, jobTitle, profile.yearsOfExperience, jobDescription, location, difficulty)

  const { data: interview } = await supabase
    .from('interview')
    .insert({ 
      companyName, 
      minExpectedMonthlyIncome,
      maxExpectedMonthlyIncome,
      userId: user.id,
      job_title: jobTitle,
      market_analysis: interviewData.marketAnalysis,
      hm_guidelines: interviewData.hmGuidelines,
      meta_instructions: interviewData.metaInstructions,
      suitability_analysis: interviewData.suitabilityAnalysis
    })
    .select()
    .single()
    .throwOnError()

    await supabase
    .from('interview_message')
    .insert({ 
      interviewId: interview.id, 
      message: interviewData.recruiterPrompt![0].content,
      role: "system",
    })
    .select()
    .single()
    .throwOnError()

  console.log(interview)

  return NextResponse.redirect(`${requestUrl.origin}/negotiations/${interview.id}/practice/`, { status: 301 })
}

async function setupInterview(parsed_resume: string, company: string, job_title: string, years_of_experience: number, job_description: string, location: string, difficulty: number) {
  const marketAnalysis = await getMarketAnalysis(company, job_title)
  const hmGuidelinePrompt = getHiringManagerGuidelinesPrompt(company, job_title, job_description, location, String(years_of_experience), marketAnalysis)
  const metaInstructionsPrompt = getRecruiterMetaInstructionsPrompt(difficulty)
  const suitabilityPrompt = getSuitabilityPrompt(parsed_resume, company, job_title, job_description)

  const allRes = [hmGuidelinePrompt, metaInstructionsPrompt, suitabilityPrompt].map((prompt) => {
    return getChatCompletionMessage(prompt, "gpt-4")
  })

  const [hmGuidelines, metaInstructions, suitabilityAnalysis] = await Promise.all(allRes)
  const recruiterPrompt = getRecruiterNegotiationPrompt(metaInstructions ?? "", company, job_title, hmGuidelines ?? "", suitabilityAnalysis ?? "")
  return {
    company: company,
    jobTitle: job_title,
    marketAnalysis: marketAnalysis ?? "",
    hmGuidelines: hmGuidelines ?? "",
    metaInstructions: metaInstructions ?? "",
    suitabilityAnalysis: suitabilityAnalysis ?? "",
    recruiterPrompt: recruiterPrompt
  }
}

async function getMarketAnalysis(company: string, job_title: string) {
  return marketAnalysis
}
