"use client"

import { useEffect, useReducer, useRef, useState } from "react"
import { toast } from "sonner"
import { registerCall } from "@/actions/retell"
import { createFeedback } from "@/actions/feedback"
import { getInterviewerAction } from "@/actions/interviewers"
import {
  createResponse,
  getResponseEmailsAction,
  updateResponse,
} from "@/actions/responses"
import { useCallTimer } from "@/hooks/use-call-timer"
import { useRetellClient } from "@/hooks/use-retell-client"
import type { Interview } from "@/types/database.types"
import type { FeedbackData } from "@/types/response"
import ActiveCallScreen from "./active-call-screen"
import EndedScreen from "./ended-screen"
import IneligibleScreen from "./ineligible-screen"
import PreCallScreen from "./pre-call-screen"
import {
  TabSwitchWarning,
  useTabSwitchPrevention,
} from "./tab-switch-prevention"

interface InterviewProps {
  interview: Interview
}

type CallState = {
  isLoading: boolean
  isStarted: boolean
  isEnded: boolean
  isCalling: boolean
  isIneligible: boolean
  callId: string
  email: string
}

type CallAction =
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | { type: "START_CALL"; callId: string; email: string }
  | { type: "END_CALL" }
  | { type: "SET_INELIGIBLE" }
  | { type: "CALL_ENDED" }

const initialCallState: CallState = {
  isLoading: false,
  isStarted: false,
  isEnded: false,
  isCalling: false,
  isIneligible: false,
  callId: "",
  email: "",
}

function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, isLoading: true }
    case "STOP_LOADING":
      return { ...state, isLoading: false }
    case "START_CALL":
      return {
        ...state,
        isLoading: false,
        isStarted: true,
        isCalling: true,
        callId: action.callId,
        email: action.email,
      }
    case "END_CALL":
      return { ...state, isEnded: true, isLoading: false }
    case "SET_INELIGIBLE":
      return { ...state, isIneligible: true, isLoading: false }
    case "CALL_ENDED":
      return { ...state, isCalling: false, isEnded: true }
    default:
      return state
  }
}

export default function Call({ interview }: InterviewProps) {
  const [callState, dispatchCall] = useReducer(callReducer, initialCallState)
  const {
    isLoading,
    isStarted,
    isEnded,
    isCalling,
    isIneligible,
    callId,
    email,
  } = callState

  const [interviewerImg, setInterviewerImg] = useState("")
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userName, setUserName] = useState("")

  // Refs to avoid stale closures in callbacks stored by hooks
  const callIdRef = useRef(callId)
  const {
    tabSwitchCount,
    isDialogOpen: tabSwitchDialogOpen,
    handleUnderstand,
  } = useTabSwitchPrevention()
  const tabSwitchCountRef = useRef(tabSwitchCount)

  useEffect(() => {
    callIdRef.current = callId
  }, [callId])
  useEffect(() => {
    tabSwitchCountRef.current = tabSwitchCount
  }, [tabSwitchCount])

  const interviewTimeDuration = interview?.timeDuration ?? "1"

  const handleCallEnded = () => {
    dispatchCall({ type: "CALL_ENDED" })
    updateResponse(
      { isEnded: true, tabSwitchCount: tabSwitchCountRef.current },
      callIdRef.current
    )
  }

  const {
    lastInterviewerResponse,
    lastUserResponse,
    activeTurn,
    startCall,
    stopCall,
  } = useRetellClient(handleCallEnded)

  const handleTimeUp = () => {
    stopCall()
    dispatchCall({ type: "END_CALL" })
  }

  const { elapsedSeconds, progressPercent } = useCallTimer(
    interviewTimeDuration,
    isCalling,
    handleTimeUp
  )
  const remainingSeconds = Math.max(
    0,
    Number(interviewTimeDuration) * 60 - elapsedSeconds
  )

  useEffect(() => {
    if (!interview.interviewerId) return
    const fetchInterviewer = async () => {
      const data = await getInterviewerAction(interview.interviewerId ?? "")
      if (data?.image) setInterviewerImg(data.image)
    }
    fetchInterviewer()
  }, [interview.interviewerId])

  const startConversation = async (candidateEmail: string, name: string) => {
    dispatchCall({ type: "START_LOADING" })

    const data = {
      mins: interview?.timeDuration ?? "",
      objective: interview?.objective ?? "",
      questions: interview?.questions?.map((q) => q.question).join(", ") ?? "",
      name: name || "not provided",
    }

    const emailsList = await getResponseEmailsAction(interview.id)
    const existingEmails: string[] = emailsList.map(
      (item: { email: string }) => item.email
    )
    const ineligible =
      existingEmails.includes(candidateEmail) ||
      (interview?.respondents &&
        !interview?.respondents.includes(candidateEmail))

    if (ineligible) {
      dispatchCall({ type: "SET_INELIGIBLE" })
    } else {
      const result = await registerCall(interview?.interviewerId ?? "", data)

      if (!result.success) {
        console.error("Failed to register call:", result.error)
        dispatchCall({ type: "STOP_LOADING" })
        return
      }

      const { call_id, access_token } = result.data

      if (access_token) {
        await startCall(access_token)
        setUserName(name)
        dispatchCall({
          type: "START_CALL",
          callId: call_id,
          email: candidateEmail,
        })

        await createResponse({
          interviewId: interview.id,
          callId: call_id,
          email: candidateEmail,
          name,
        })
      } else {
        console.error("Failed to register call: no access token")
        dispatchCall({ type: "STOP_LOADING" })
        return
      }
    }

    dispatchCall({ type: "STOP_LOADING" })
  }

  const onEndCallClick = async () => {
    if (isStarted) {
      dispatchCall({ type: "START_LOADING" })
      stopCall()
      await updateResponse({ isEnded: true, tabSwitchCount }, callId)
      dispatchCall({ type: "END_CALL" })
    } else {
      dispatchCall({ type: "END_CALL" })
    }
  }

  const handleFeedbackSubmit = async (
    formData: Omit<FeedbackData, "interview_id">
  ) => {
    try {
      await createFeedback({ ...formData, interview_id: interview.id })
      toast.success("Thank you for your feedback!")
      setIsFeedbackSubmitted(true)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      {isStarted && !isEnded && (
        <TabSwitchWarning
          isDialogOpen={tabSwitchDialogOpen}
          onUnderstand={handleUnderstand}
        />
      )}

      {!isStarted && !isEnded && !isIneligible && (
        <PreCallScreen
          interview={interview}
          isLoading={isLoading}
          interviewTimeDuration={interviewTimeDuration}
          interviewerImg={interviewerImg}
          onStart={startConversation}
          onExit={onEndCallClick}
        />
      )}

      {isStarted && !isEnded && !isIneligible && (
        <ActiveCallScreen
          interview={interview}
          isLoading={isLoading}
          interviewerImg={interviewerImg}
          lastInterviewerResponse={lastInterviewerResponse}
          lastUserResponse={lastUserResponse}
          activeTurn={activeTurn}
          progressPercent={progressPercent}
          remainingSeconds={remainingSeconds}
          userName={userName}
          onEndInterview={onEndCallClick}
        />
      )}

      {isEnded && !isIneligible && (
        <EndedScreen
          isStarted={isStarted}
          email={email}
          isFeedbackSubmitted={isFeedbackSubmitted}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}

      {isIneligible && <IneligibleScreen />}
    </div>
  )
}
