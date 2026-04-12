import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics, CallData } from "@/types/response";
import { CircularProgress } from "./circular-progress";

interface GeneralSummaryProps {
  analytics: Analytics | null;
  callData: CallData | null;
}

export function GeneralSummary({ analytics, callData }: GeneralSummaryProps) {
  return (
    <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
      <p className="my-2 font-semibold">General Summary</p>

      <div className="my-2 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {analytics?.overallScore !== undefined && (
          <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
            <div className="flex flex-row gap-2 align-middle">
              <CircularProgress value={analytics?.overallScore} showValueLabel={true} />
              <p className="my-auto font-medium text-xl">Overall Hiring Score</p>
            </div>
            <div className="">
              <div className="font-medium">
                <span className="font-normal">Feedback: </span>
                {analytics?.overallFeedback === undefined ? (
                  <Skeleton className="h-5 w-50" />
                ) : (
                  analytics?.overallFeedback
                )}
              </div>
            </div>
          </div>
        )}
        {analytics?.communication && (
          <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
            <div className="flex flex-row gap-2 align-middle">
              <CircularProgress
                value={analytics?.communication.score}
                maxValue={10}
                minValue={0}
                showValueLabel={true}
                valueLabel={
                  <div className="flex items-baseline">
                    {analytics?.communication.score ?? 0}
                    <span className="ml-0.5 text-xl">/10</span>
                  </div>
                }
              />
              <p className="my-auto font-medium text-xl">Communication</p>
            </div>
            <div className="font-medium">
              <span className="font-normal">Feedback: </span>
              {analytics?.communication.feedback === undefined ? (
                <Skeleton className="h-5 w-50" />
              ) : (
                analytics?.communication.feedback
              )}
            </div>
          </div>
        )}
        {callData?.call_analysis && (
          <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
            <div className="flex flex-row gap-2 align-middle">
              <p className="my-auto">User Sentiment: </p>
              <p className="my-auto font-medium">
                {callData?.call_analysis?.user_sentiment === undefined ? (
                  <Skeleton className="h-5 w-50" />
                ) : (
                  callData?.call_analysis?.user_sentiment
                )}
              </p>

              <div
                className={`${
                  callData?.call_analysis?.user_sentiment === "Neutral"
                    ? "text-yellow-500"
                    : callData?.call_analysis?.user_sentiment === "Negative"
                      ? "text-red-500"
                      : callData?.call_analysis?.user_sentiment === "Positive"
                        ? "text-green-500"
                        : "text-transparent"
                } text-xl`}
              >
                ●
              </div>
            </div>
            <div className="">
              <div className="font-medium">
                <span className="font-normal">Call Summary: </span>
                {callData?.call_analysis?.call_summary === undefined ? (
                  <Skeleton className="h-5 w-50" />
                ) : (
                  callData?.call_analysis?.call_summary
                )}
              </div>
            </div>
            <p className="font-medium">{callData?.call_analysis?.call_completion_rating_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
