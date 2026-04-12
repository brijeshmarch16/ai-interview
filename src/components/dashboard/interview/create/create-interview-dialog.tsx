"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createInterview, updateInterview } from "@/actions/interviews";
import { CustomSpinner } from "@/components/loaders/custom-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Question } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import BasicInterviewInfo from "./basic-interview-info";
import CreateInterviewQuestions from "./create-interview-questions";

const schema = z.object({
  name: z.string().min(1, "Interview name is required"),
  objective: z.string().min(1, "Objective is required"),
  numQuestions: z.number().int().min(1).max(5),
  duration: z.number().int().min(1).max(15),
  interviewerId: z.string().min(1, "Please select an interviewer"),
  description: z.string().min(1, "Description is required"),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      followUpCount: z.number().int().min(1).max(3),
    }),
  ),
});

export type FormValues = z.infer<typeof schema>;

const STEP1_FIELDS = ["name", "objective", "numQuestions", "duration", "interviewerId"] as const;

interface CreateInterviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  interviewers: Interviewer[];
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    objective: string;
    description: string;
    questions: Question[];
    questionCount: number;
    timeDuration: string;
    interviewerId: string;
  };
}

export default function CreateInterviewDialog(props: CreateInterviewDialogProps) {
  const { interviewers, mode = "create", initialData, open, setOpen } = props;

  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      objective: initialData?.objective ?? "",
      numQuestions: initialData?.questionCount ?? undefined,
      duration: initialData?.timeDuration ? Number(initialData.timeDuration) : undefined,
      interviewerId: initialData?.interviewerId ?? "",
      description: initialData?.description ?? "",
      questions: initialData?.questions?.length
        ? initialData.questions
        : [{ question: "", followUpCount: 1 }],
    },
  });

  const goToStep2WithManual = async () => {
    const valid = await form.trigger(STEP1_FIELDS);
    if (!valid) return;

    // In edit mode with existing questions, keep them; otherwise start with one empty question
    const existing = form.getValues("questions");
    if (!existing.length || mode === "create") {
      form.setValue("questions", [{ question: "", followUpCount: 1 }]);
    }
    setStep(2);
  };

  const goToStep2WithGenerate = async (documentContext: string) => {
    const valid = await form.trigger(STEP1_FIELDS);
    if (!valid) return;

    setIsGenerating(true);
    try {
      const values = form.getValues();
      const response = await fetch("/api/generate-interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          objective: values.objective,
          number: values.numQuestions,
          context: documentContext,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const { response: generated } = await response.json();
      const questions: Question[] = generated.questions.map((q: Question) => ({
        question: q.question.trim(),
        followUpCount: 1,
      }));

      form.setValue("questions", questions);
      form.setValue("description", generated.description);
      setStep(2);
    } catch {
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      if (mode === "edit" && initialData?.id) {
        const result = await updateInterview(initialData.id, {
          name: values.name,
          objective: values.objective,
          description: values.description,
          questions: values.questions,
          interviewerId: values.interviewerId,
          questionCount: values.numQuestions,
          timeDuration: String(values.duration),
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success("Interview updated successfully.");
      } else {
        const result = await createInterview({
          name: values.name,
          objective: values.objective,
          description: values.description,
          questions: values.questions,
          interviewerId: values.interviewerId,
          questionCount: values.numQuestions,
          timeDuration: String(values.duration),
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }
      }

      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="gap-4 px-4 sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Interview" : "Create an Interview"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {isGenerating ? (
              <CustomSpinner />
            ) : step === 1 ? (
              <ScrollArea className="max-h-[80dvh] *:data-[slot='scroll-area-viewport']:max-h-[80dvh]">
                <BasicInterviewInfo
                  interviewers={interviewers}
                  mode={mode}
                  onManual={goToStep2WithManual}
                  onGenerate={goToStep2WithGenerate}
                />
              </ScrollArea>
            ) : (
              <ScrollArea className="max-h-[80dvh] *:data-[slot='scroll-area-viewport']:max-h-[80dvh]">
                <CreateInterviewQuestions
                  questionCount={form.watch("numQuestions")}
                  onBack={() => setStep(1)}
                  isSaving={isPending}
                />
              </ScrollArea>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
