"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { FeedbackData } from "@/types/response";
import FeedbackForm from "./feedback-form";
import { ScreenStatusCard } from "./screen-status-card";

interface EndedScreenProps {
  isStarted: boolean;
  email: string;
  isFeedbackSubmitted: boolean;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onFeedbackSubmit: (data: Omit<FeedbackData, "interview_id">) => void;
}

export default function EndedScreen(props: EndedScreenProps) {
  const {
    isStarted,
    email,
    isFeedbackSubmitted,
    isDialogOpen,
    onDialogOpenChange,
    onFeedbackSubmit,
  } = props;
  return (
    <ScreenStatusCard
      title={
        isStarted
          ? "Thank you for taking the time to participate in this interview"
          : "Thank you very much for considering."
      }
      description="You can close this tab now."
    >
      {!isFeedbackSubmitted && (
        <AlertDialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <AlertDialogTrigger asChild>
            <Button className="mt-4 mb-2 h-10 w-full bg-primary text-primary-foreground">
              Provide Feedback
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Provide Feedback</AlertDialogTitle>
              <AlertDialogDescription>
                Share your experience about the interview process.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FeedbackForm email={email} onSubmit={onFeedbackSubmit} />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ScreenStatusCard>
  );
}
