"use client";

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

type TranscriptType = {
  role: string;
  content: string;
};

const webClient = new RetellWebClient();

export function useRetellClient(onCallEnded: () => void) {
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState("");
  const [lastUserResponse, setLastUserResponse] = useState("");
  const [activeTurn, setActiveTurn] = useState<"agent" | "user" | "">("");

  const onCallEndedRef = useRef(onCallEnded);
  onCallEndedRef.current = onCallEnded;

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      onCallEndedRef.current();
    });

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      setActiveTurn("user");
    });

    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      webClient.stopCall();
      onCallEndedRef.current();
    });

    webClient.on("update", (update) => {
      if (update.transcript) {
        const transcripts: TranscriptType[] = update.transcript;
        const roleContents: { [key: string]: string } = {};

        for (const transcript of transcripts) {
          roleContents[transcript?.role] = transcript?.content;
        }

        setLastInterviewerResponse(roleContents.agent);
        setLastUserResponse(roleContents.user);
      }
    });

    return () => {
      webClient.removeAllListeners();
    };
  }, []);

  const startCall = async (accessToken: string) => {
    await webClient.startCall({ accessToken }).catch(console.error);
  };

  const stopCall = () => {
    webClient.stopCall();
  };

  return { lastInterviewerResponse, lastUserResponse, activeTurn, startCall, stopCall };
}
