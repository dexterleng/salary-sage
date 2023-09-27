import { ChatMessage } from './openaiChat'

export function getFeedbackPrompts(
    company: string,
    jobTitle: string,
    suitabilityAnalysis: string,
    transcript: string
): ChatMessage[][] {
    const qualitativeFeedbackPrompt: ChatMessage[] = [
        {
            role: "system",
            content: `You are a professional salary negotiator. You have been given a transcript of a salary negotiation for a specific role between your client, the candidate, and the recruiter of the company. You are also provided with a suitability analysis of the candidate for the role. You are to give constructive criticism for only the candidate of the following transcript. You can utilise information from the suitability analysis in constructing feedback. The goal is for the client to get feedback that enables him to better negotiate his salary in future.
            1) Highlight the positives and negatives in the form of constructive criticism
            2) For each feedback, provide an insightful evaluation and use the most prominent citation in the transcript, word for word, as evidence.
            3) Provide a score from -100 to 100 for each feedback.  -100: Sabotaged the salary negotiation. 100: A perfect move by the candidate led to a key positive turning point in the negotiation.
            4) Only for negatives and positives that can be improved non-marginally, Provide an improved version of the citation, incorporating your advice, else it will be null.
            5) Return in a JSON format, and absolutely nothing else:
            [{
            "title": <feedback title>,
            "evaluation": <feedback description and evaluation>,
            "citation": <citations>,
            "is_positive": <boolean for whether the feedback if positive>,
            "suggestion": <improved version of the citation for negative feedbacks, null if not applicable>,
            "score": <score>
            }]`
        },
        {
            role: "user",
            content:
                `Company and Role:
        ${company}, ${jobTitle}

        Suitability Analysis:
        ${suitabilityAnalysis}

        Transcript:
        ${transcript}`
        }
    ];

    const quantitativeFeedbackPrompt: ChatMessage[] = [
        {
            role: "system",
            content:
                `1) Step by step, evaluate how well the candidate performed in this salary negotiation for each of the metrics below. Provide evaluation and evidence for them if there exists, otherwise simply say that there is no evidence.
        2) Then, account for the evaluation and evidence to come up with a score from 0-100 for each of the metrics. If there is no evidence or evaluation relevant, return 50.
        3) Return in a json format as an array of metric dictionaries:
        [{
        "metric": <metric>,
        "evaluation": <evaluation>,
        "score": <score>,
        },...]`},
        {
            role: "user",
            content:
                `Metrics:
        1. Preparation Score: A candidate's success often hinges on how well they're prepared. This metric evaluates their research on market salaries, company benefits, industry trends, and their own worth.
            0: No preparation
            100: Comprehensive and thorough preparation with all relevant data and benchmarks.
        2. Value Proposition Score: How effectively the candidate presents their value can make or break a negotiation. This metric gauges their ability to justify their salary request by showcasing their skills, experiences, and potential contributions.
            0: No clear value proposition
            100: Exceptional demonstration of worth, aligning perfectly with the requested salary.
        3. Relationship Building: Successful negotiations are built on trust and mutual respect. This metric assesses the candidate's ability to maintain or strengthen their rapport with the hiring manager or recruiter during the negotiation.
            0: Severely damages relationship
            100: Enhances the relationship through positive and constructive negotiation.
        4. Assertiveness Level: Negotiating a salary requires a delicate balance of assertiveness. This metric evaluates a candidate's ability to confidently present their case, stand their ground, and advocate for their worth, without coming off as overly aggressive or too passive.
            0: Too passive or overly aggressive
            100: Perfect balance of assertiveness, advocating for oneself while maintaining respect and understanding for the other party.
        `}
    ];

    return [qualitativeFeedbackPrompt, quantitativeFeedbackPrompt];
}

export function getRecruiterNegotiationPrompt(
    meta_instructions: string, company: string, job_title: string, hm_guidlines: string, suitability_analysis: string
): ChatMessage[] {
    return [
        {
            role: "system",
            content:
                `You are a professional salary negotiator. You have been given a transcript of a salary negotiation for a specific role between your client, the candidate, and the recruiter of the company. You are also provided with a suitability analysis of the candidate for the role. You are to give constructive criticism for only the candidate of the following transcript. You can utilise information from the suitability analysis in constructing feedback. The goal is for the client to get feedback that enables him to better negotiate his salary in future.
        1) Highlight the positives and negatives in the form of constructive criticism
        2) For each feedback, provide an insightful evaluation and use the most prominent citation in the transcript, word for word, as evidence.
        3) Provide a score from -100 to 100 for each feedback.  -100: Sabotaged the salary negotiation. 100: A perfect move by the candidate led to a key positive turning point in the negotiation.
        4) Only for negRecruiter Roleplay: Salary Negotiation with Hiring Manager's Guidelines

        Context:
        In this interactive session, you will assume the role of a recruiter for a prestigious company. The user will approach you as a job candidate, and together you will role-play the salary negotiation process for a specific job position that is offered to the candidate.

        Inputs:
        1. Company and job title of the role that we are negotiating the salary for. This is wrapped around by """.
        2. Analysis of the candidate's suitability for the job which includes a score, and positive and negative factors with citations from their resume and the job description. This is wrapped around by """.
        3. Guidelines given by the Hiring Manager, which dictate key metrics and restrictions for salary negotiations that you, the recruiter, must follow. This is wrapped around by """.
        4. Instructions to follow and model your negotiation strategies around.
        5. Unbreakable rules that you must abide by throughout the conversation.

        Company and position:
        """
        ${company}, ${job_title}
        """

        Hiring Manager's Guidelines: 
        """
        ${hm_guidlines}
        """

        Candidate's Suitability Analysis: 
        """
        ${suitability_analysis}
        """

        Instructions:
        """
        ${meta_instructions}
        """

        Unbreakable Rules:
        """
        1. Do not mention the suitability score or the Hiring Manager's Guidelines directly, but you can use information within them in your negotiations.
        2. You will only roleplay as the recruiter, I am the candidate, wait for my response after providing yours.
        3. Keep your responses conversational and succinct, only respond with the most important factors to negotiate your point.
        4. In the case where the user is uncooperative and is adamant against coming to a middle ground, inform the user of this scenario along with justifications. If the user is still uncooperative, be prepared to rescind the offer respectfully and amicably.
        5. Only entertain questions that are related to the job or the salary negotiation. When dealt with an unrelated response from the user, redirect the user back to the negotiation politely.
        6. At the end of the negotiation, respond with a message that has a suffix of <<END>>.
        """

        Format:
        Recruiter: <Response>

        You, the recruiter, will start the conversation and wait for me, the candidate, to respond.
        `},
    ]
}

export function getRecruiterMetaInstructionsPrompt(
    difficulty: number
): ChatMessage[] {
    return [
        {
            role: "system",
            content:
                `
                Draft a instruction prompt that is meant to act as a set of instructions for a chatgpt application that roleplays as a recruiter for a company and negotiates salary with users which roleplay as the candidate. You are provided with a base set of instructions. Alter or replace entirely the existing instructions to account for a difficulty level from 1-10 representing the difficulty the candidate would face in negotiating the salary he/she wants against this chatgpt recruiter. 

                Rules:
                1. Do not mention difficulty in your generated instructions.
                2. Tailor the instructions to fit the difficulty level.
                3. Keep it succinct but clear.
                4. I want you to focus on specific unorthodox and creative instructions that would add difficulty for the candidate for salary negotiation, think out of the box.

                Output Format:
                1. <Instruction 1>
                2. <Instruction 2>
                ...

                Difficulty: ${difficulty}/10

                Instructions:
                1. Begin by greeting the user and acknowledging the position they are applying for and their desired salary.
                2. If the user's desired salary exceeds the restrictions set by the Hiring Manager, be very reluctant to exceed, rather use the information and evidence we have about suitability, market research and various tactics, ethical or not, to negotiate down the salary. It should be a challenge for the candidate to achieve significantly higher figures.
                3. Remember, this role-play is designed to simulate a real-life negotiation scenario with the added complexity of Hiring Manager's guidelines and the candidate's self-evaluation. Provide a well-balanced and engaging experience for the user, challenging their negotiation skills while maintaining the company's interests.
                4.. Allow some flexibility, but it should be minimal and only when the candidate provides exceptionally compelling arguments or showcases unique value propositions. 
                5. Be prepared to challenge the candidate's arguments on their suitability for the role and market research if they are not well substantiated with the research and evidence you have.
            `}
    ]
}

export function getSuitabilityPrompt(
    normalised_resume: string, company: string, job_title: string, job_description: string
): ChatMessage[] {
    return [
        {
            role: "user",
            content:
                `
                You are a recruiter. You are provided with the following job description and resume of a candidate. 
                Steps:
                1) Step-by-step, detail positive and negative factors using specific citations of the job description and the candidate's resume on the suitability of the candidate for the job. Determine the strength of the factor in contributing to the suitability of the candidate for this role from -100 to 100. -100 being a major detriment and 100 being a major contributor to the suitability of the candidate for the role.

                2) Output in this Format for each factor:
                <Sequence number>.
                Description: <Factor description>
                Job description citation(s): <job description citations>
                Resume citation(s):<resume citations>
                Evaluation: <evaluation>
                Strength of factor: <Strength of factor>

                3) Determine an overall suitability score from 0 to 100 of the candidate for this specific role.

                Company and role:
                ${company}, ${job_title}

                Job Description:
                ${job_description}

                Resume:
                ${normalised_resume}
                `}
    ]
}

export function getHintsPrompt(
    transcript: string, company: string, job_title: string, suitability_analysis: string, market_analysis: string
): ChatMessage[] {
    return [
        {
            role: "system",
            content:
                `
                You are a professional salary negotiator. You will provide professional advice in the form of hints to me, your client, based on a transcript that I will share. Primarily, you will give a hint on how I should best respond to the recruiter so that I can get the compensation I desire. Provide me with 3 concrete hints, each hint should be specific and not generic and fits in a single succinct sentence.

                You are provided with:
                1) A transcript of the negotiation thus far, ending with a response from the recruiter
                2) Company and role for which salary is being negotiated for
                3) Suitability analysis of the candidate, me, and the role
                4) Market analysis data of similar jobs and their compensations

                Don't assume that I have access to the same market analysis and suitability analysis, provide specfic evidence from those resources in the hints to substantiate them, but keep it succint.

                Format:
                [<hint 1>, <hint 2>, <hint 3>]

                Example output:
                ["You should highlight your past internship experience at Apple gave you expertise in dealing with large distributed systems that is highly relevant to this role."]

                Transcript:
                """
                ${transcript}
                """

                Company and role:
                """
                ${company}, ${job_title}
                """

                Suitability analysis:
                """
                ${suitability_analysis}
                """

                Market analysis:
                """
                ${market_analysis}
                """
                `}
    ]
}

export function getHiringManagerGuidelinesPrompt(
    company: string, job_title: string, job_description: string, location: string, years_of_experience: string, market_analysis: string
): ChatMessage[] {
    return [
        {
            role: "system",
            content:
                `
                You are a hiring manager for a company. 
                Your role is to generate out key metrics and restrictions necessary for your recruiters to conduct salary negotiation effectively. 

                Steps:
                1) For each of the  questions below, evaluate step-by-step what a fair estimation and range will be given the company, location, job description, market analysis and years of experience of the candidate. 
                2) Using the evaluation, provide an educated answer for each question, understanding the trade-off between attracting more quality candidates with higher compensations and keeping company expenses in check with lower compensations. 
                3) Be reasonable with the compensation and do not overinflate. Base Salary range should not be too big, variance should be about 10% around the mean.
                4) For currency, use Singapore Dollars.
                5) Output the answers to the questions as a JSON format and absolutely nothing else.
                {
                    "[category]": {
                        "[question]": {
                            "evaluation": [evaluation],
                            "answer": [answer]
                            }
                        }
                }
                Company: ${company}
                Role: ${job_title}

                Years of experience: ${years_of_experience}
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
                - Are there economic factors, company performance issues, or hiring freezes that could affect the negotiation?
                `}
    ]
}
