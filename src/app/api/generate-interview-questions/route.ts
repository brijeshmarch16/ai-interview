import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { openai } from "@/lib/openai"
import {
  generateQuestionsPrompt,
  SYSTEM_PROMPT,
} from "@/lib/prompts/generate-questions"

export const maxDuration = 60

export async function POST(req: Request) {
  logger.info("generate-interview-questions request received")
  const body = await req.json()

  try {
    const baseCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt(body),
        },
      ],
      response_format: { type: "json_object" },
    })

    const basePromptOutput = baseCompletion.choices[0] || {}
    const content = basePromptOutput.message?.content

    logger.info("Interview questions generated successfully")

    return NextResponse.json(
      {
        response: JSON.parse(content ?? "{}"),
      },
      { status: 200 }
    )
  } catch {
    logger.error("Error generating interview questions")

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    )
  }
}
