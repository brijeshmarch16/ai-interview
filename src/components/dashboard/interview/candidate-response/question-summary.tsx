import { ScrollArea } from "@/components/ui/scroll-area";
import type { Analytics } from "@/types/response";
import QuestionAnswerCard from "./question-answer-card";

interface QuestionSummaryProps {
  questionSummaries: Analytics["questionSummaries"];
}

export function QuestionSummary({ questionSummaries }: QuestionSummaryProps) {
  if (!questionSummaries || questionSummaries.length === 0) return null;

  return (
    <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
      <p className="my-2 mb-4 font-semibold">Question Summary</p>
      <ScrollArea className="scrollbar-thin max-h-96 overflow-y-auto whitespace-pre-line rounded-lg px-2 text-sm">
        {questionSummaries.map((qs, index) => (
          <QuestionAnswerCard
            key={qs.question}
            questionNumber={index + 1}
            question={qs.question}
            answer={qs.summary}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
