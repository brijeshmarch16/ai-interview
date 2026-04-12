import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/types/interview";
import type { FormValues } from "./create-interview-dialog";

interface InterviewQuestionCardProps {
  questionNumber: number;
  questionData: Question;
  index: number;
  onDelete: (index: number) => void;
}

const depthLevels = [
  { level: 1, label: "Low" },
  { level: 2, label: "Medium" },
  { level: 3, label: "High" },
] as const;

export default function InterviewQuestionCard(props: InterviewQuestionCardProps) {
  const { questionNumber, questionData, index, onDelete } = props;
  const { control } = useFormContext<FormValues>();

  return (
    <Card>
      <CardContent>
        {/* Header row: title | depth buttons + delete */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2">
          <CardTitle className="shrink-0 text-base">Question {questionNumber}</CardTitle>

          <div className="flex items-center gap-1.5">
            <span className="mr-1 font-semibold text-muted-foreground text-sm">Depth Level:</span>

            <Controller
              control={control}
              name={`questions.${index}.followUpCount`}
              render={({ field }) => (
                <>
                  {depthLevels.map(({ level, label }) => (
                    <Button
                      key={level}
                      type="button"
                      className={`h-7 px-3 text-xs hover:bg-primary/80 ${
                        field.value === level ? "bg-primary" : "opacity-50"
                      }`}
                      onClick={() => field.onChange(level)}
                    >
                      {label}
                    </Button>
                  ))}
                </>
              )}
            />

            <button
              type="button"
              className="ml-1 shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              onClick={() => onDelete(index)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Full-width textarea */}
        <Controller
          control={control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <Textarea
              {...field}
              className="resize-none border-2 border-input transition-colors focus:border-primary"
              placeholder="e.g. Can you tell me about a challenging project you've worked on?"
              rows={3}
              onBlur={(e) => {
                field.onChange(e.target.value.trim());
                field.onBlur();
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
