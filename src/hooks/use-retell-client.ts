"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

type TranscriptType = {
  role: string
  content: string
}

type StartCallResult =
  | { success: true }
  | { success: false; error: unknown }

const START_CALL_TIMEOUT_MS = 15_000
const webClient = new RetellWebClient()

export function useRetellClient(onCallEnded: () => void) {
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState("")
  const [lastUserResponse, setLastUserResponse] = useState("")
  const [activeTurn, setActiveTurn] = useState<"agent" | "user" | "">("")

  const onCallEndedRef = useRef(onCallEnded)
  const isStartingCallRef = useRef(false)

  useEffect(() => {
    onCallEndedRef.current = onCallEnded
  }, [onCallEnded])

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started")
    })

    webClient.on("call_ended", () => {
      console.log("Call ended")
      onCallEndedRef.current()
    })

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent")
    })

    webClient.on("agent_stop_talking", () => {
      setActiveTurn("user")
    })

    webClient.on("error", (error) => {
      if (isStartingCallRef.current) return

      console.error("An error occurred:", error)
      webClient.stopCall()
      onCallEndedRef.current()
    })

    webClient.on("update", (update) => {
      if (update.transcript) {
        const transcripts: TranscriptType[] = update.transcript
        const roleContents: { [key: string]: string } = {}

        for (const transcript of transcripts) {
          roleContents[transcript?.role] = transcript?.content
        }

        setLastInterviewerResponse(roleContents.agent)
        setLastUserResponse(roleContents.user)
      }
    })

    return () => {
      webClient.removeAllListeners()
    }
  }, [])

  const startCall = async (
    accessToken: string
  ): Promise<StartCallResult> => {
    isStartingCallRef.current = true
    let cleanupStartupListeners = () => {}
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const startupResult = new Promise<StartCallResult>((resolve) => {
      const finish = (result: StartCallResult) => {
        cleanupStartupListeners()
        if (timeoutId) clearTimeout(timeoutId)
        resolve(result)
      }

      const handleCallStarted = () => finish({ success: true })
      const handleCallStartError = (error: unknown) =>
        finish({ success: false, error })

      cleanupStartupListeners = () => {
        webClient.off("call_started", handleCallStarted)
        webClient.off("error", handleCallStartError)
      }

      webClient.once("call_started", handleCallStarted)
      webClient.once("error", handleCallStartError)

      timeoutId = setTimeout(
        () =>
          finish({
            success: false,
            error: new Error("Timed out while starting the call."),
          }),
        START_CALL_TIMEOUT_MS
      )
    })

    try {
      await webClient.startCall({ accessToken })
      return await startupResult
    } catch (error) {
      return { success: false, error }
    } finally {
      cleanupStartupListeners()
      if (timeoutId) clearTimeout(timeoutId)
      isStartingCallRef.current = false
    }
  }

  const stopCall = () => {
    webClient.stopCall()
  }

  return {
    lastInterviewerResponse,
    lastUserResponse,
    activeTurn,
    startCall,
    stopCall,
  }
}
