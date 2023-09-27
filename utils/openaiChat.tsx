import OpenAI from "openai";

export interface ChatMessage {
    role: string;
    content: string;
}

export const recruiterPrefix = "Recruiter: "
export const candidatePrefix = "Candidate: "

export async function getChatCompletionMessage(
    messages: ChatMessage[], model: string ="gpt-3.5-turbo"
) {
    const { OPENAI_API_KEY } = process.env;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY as string });

    const formattedMessages = messages.map( msg => ({
        role: msg.role,
        content: msg.content.replace(/ +/g, ' ').trim()
    })

    )
    const replyResponse = await openai.chat.completions.create({
        model: model,
        stream: false,
        messages: formattedMessages as any
      })
    return replyResponse.choices[0].message.content;
}

export async function chainCompletionPrompts(prompts: ChatMessage[][], model="gpt-3.5-turbo") {
  let currPrompts: ChatMessage[] = [];
  let responses: string[] = [];

  for (let prompt of prompts) {
      currPrompts = currPrompts.concat(prompt);
      const response = await getChatCompletionMessage(currPrompts, model) as string;
      currPrompts.push({ role: "assistant", content: response });
      responses.push(response);
  }

  return responses;
}
    

export function prependRoles(
    messages: ChatMessage[]
) {
    return messages.map(m => {
        let content = m.content
        if (m.role == "user") {
          content = candidatePrefix + content
        } else if (m.role == "assistant") {
          content = recruiterPrefix + content
        }
        return {role: m.role, content: content}
      })
}
