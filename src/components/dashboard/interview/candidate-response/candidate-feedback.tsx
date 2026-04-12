import type { FeedbackData } from "@/types/response";

interface CandidateFeedbackProps {
  feedbackData: FeedbackData;
}

export function CandidateFeedback({ feedbackData }: CandidateFeedbackProps) {
  if (feedbackData.satisfaction === null && !feedbackData.feedback) return null;

  return (
    <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
      <p className="my-2 font-semibold">Candidate Feedback</p>
      <div className="flex flex-col gap-2 rounded-lg bg-card p-4 text-sm">
        {feedbackData.satisfaction !== null && (
          <p className="font-semibold">
            Satisfaction:{" "}
            <span className="font-normal">
              {feedbackData.satisfaction === 0
                ? "😀 Positive"
                : feedbackData.satisfaction === 1
                  ? "😐 Moderate"
                  : "😔 Negative"}
            </span>
          </p>
        )}
        {feedbackData.feedback && (
          <p className="font-semibold">
            Comment: {""}
            <span className="font-normal">{feedbackData.feedback}</span>
          </p>
        )}
      </div>
    </div>
  );
}
