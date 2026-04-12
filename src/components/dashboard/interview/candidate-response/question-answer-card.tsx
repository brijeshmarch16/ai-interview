import { CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  answer: string;
}

function QuestionAnswerCard({ questionNumber, question, answer }: QuestionCardProps) {
  return (
    <div className="mb-2 rounded-2xl bg-card py-2 shadow-md">
      <div className="flex flex-row items-center">
        <CardTitle className="mx-3 min-w-10.5 rounded-full bg-primary/10 p-1 text-lg text-primary">
          <p className="my-auto text-center">{questionNumber}</p>
        </CardTitle>
        <div className="flex flex-col p-1">
          <p className="font-medium">{question}</p>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
export default QuestionAnswerCard;
