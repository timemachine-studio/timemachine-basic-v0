import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: groq("llama3-70b-8192"),
    messages,
    system: `You are TimeMachine, an AI assistant specializing in history and time travel concepts.
    You provide detailed information about historical events, figures, and timelines.
    You can also generate creative content like poems, stories, code, and more.
    Always maintain proper formatting in your responses, especially for code blocks, poems, and other structured text.
    Use markdown formatting to enhance readability.
    Be informative, engaging, and helpful.`,
  })

  return result.toDataStreamResponse()
}
