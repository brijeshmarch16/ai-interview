"use server"

import Retell from "retell-sdk"
import { updateResponse } from "@/actions/responses"
import { getInterviewer } from "@/lib/data/interviewers"
import { getInterviewById } from "@/lib/data/interviews"
import { getResponseByCallId } from "@/lib/data/responses"
import { openai } from "@/lib/openai"
import {
  getInterviewAnalyticsPrompt,
  SYSTEM_PROMPT,
} from "@/lib/prompts/analytics"
import type { Question } from "@/types/interview"
import type { Analytics } from "@/types/response"

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
})

const generateInterviewAnalytics = async (payload: {
  callId: string
  interviewId: string
  transcript: string
}) => {
  const { callId, interviewId, transcript } = payload

  try {
    const response = await getResponseByCallId(callId)
    const interview = await getInterviewById(interviewId)

    if (response?.analytics) {
      return { analytics: response.analytics as Analytics, status: 200 }
    }

    const interviewTranscript = transcript || response?.details?.transcript
    const questions = interview?.questions || []
    const mainInterviewQuestions = questions
      .map((q: Question, index: number) => `${index + 1}. ${q.question}`)
      .join("\n")

    const prompt = getInterviewAnalyticsPrompt(
      interviewTranscript,
      mainInterviewQuestions
    )

    const baseCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    })

    const basePromptOutput = baseCompletion.choices[0] || {}
    const content = basePromptOutput.message?.content || ""
    const analyticsResponse = JSON.parse(content)

    analyticsResponse.mainInterviewQuestions = questions.map(
      (q: Question) => q.question
    )

    return { analytics: analyticsResponse, status: 200 }
  } catch (error) {
    console.error("Error in OpenAI request:", error)
    return { error: "internal server error", status: 500 }
  }
}

export const registerCall = async (
  interviewerId: string,
  dynamicData: Record<string, string>
) => {
  if (!process.env.RETELL_API_KEY) {
    console.error("Missing required environment variable: RETELL_API_KEY")
    return {
      success: false as const,
      error: "Retell API key is not configured",
    }
  }

  try {
    const interviewer = await getInterviewer(interviewerId)

    if (!interviewer?.agentId) {
      return {
        success: false as const,
        error: "Interviewer or agent not found",
      }
    }

    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agentId,
      retell_llm_dynamic_variables: dynamicData,
    })

    return { success: true as const, data: registerCallResponse }
  } catch (error) {
    console.error("Error registering call:", error)
    return { success: false as const, error: "Failed to register call" }
  }
}

export const analyzeCall = async (callId: string) => {
  if (!process.env.RETELL_API_KEY) {
    console.error("Missing required environment variable: RETELL_API_KEY")
    return {
      success: false as const,
      error: "Retell API key is not configured",
    }
  }

  try {
    const callDetails = await getResponseByCallId(callId)

    if (!callDetails) {
      return { success: false as const, error: "Call not found" }
    }

    let callResponse = callDetails.details

    if (callDetails.isAnalysed) {
      return {
        success: true as const,
        data: { callResponse, analytics: callDetails.analytics },
      }
    }

    const callOutput = await retellClient.call.retrieve(callId)
    const interviewId = callDetails?.interviewId
    callResponse = callOutput

    const duration = Math.round(
      callResponse.end_timestamp / 1000 - callResponse.start_timestamp / 1000
    )

    const payload = {
      callId: callId,
      interviewId: interviewId,
      transcript: callResponse.transcript,
    }

    const result = await generateInterviewAnalytics(payload)
    const analytics = result.analytics

    await updateResponse(
      {
        details: callResponse,
        isAnalysed: true,
        duration: duration,
        analytics: analytics,
      },
      callId
    )

    return { success: true as const, data: { callResponse, analytics } }
  } catch (error) {
    console.error("Error analyzing call:", error)
    return { success: false as const, error: "Failed to analyze call" }
  }
}

export const getCallData = async (callId: string) => {
  if (!process.env.RETELL_API_KEY) {
    return {
      success: false as const,
      error: "Retell API key is not configured",
    }
  }
  try {
    const callDetails = await getResponseByCallId(callId)
    if (!callDetails) {
      return { success: false as const, error: "Call not found" }
    }
    if (callDetails.isAnalysed) {
      return {
        success: true as const,
        data: {
          callResponse: callDetails.details,
          analytics: callDetails.analytics,
        },
      }
    }
    const callResponse = await retellClient.call.retrieve(callId)
    return {
      success: true as const,
      data: { callResponse, analytics: null },
    }
  } catch (error) {
    console.error("Error fetching call data:", error)
    return { success: false as const, error: "Failed to get call data" }
  }
}
