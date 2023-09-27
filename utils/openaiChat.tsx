import OpenAI from "openai";

export interface ChatMessage {
    role: string;
    content: string;
}

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
