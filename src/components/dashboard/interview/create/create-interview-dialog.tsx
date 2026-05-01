"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { createInterview, updateInterview } from "@/actions/interviews"
import { CustomSpinner } from "@/components/loaders/custom-spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Question } from "@/types/interview"
import type { Interviewer } from "@/types/interviewer"
import BasicInterviewInfo, {
  type BasicInterviewInfoDefaultValues,
  type BasicInterviewInfoValues,
} from "./basic-interview-info"
import CreateInterviewQuestions, {
  type InterviewQuestionsValues,
} from "./create-interview-questions"

interface CreateInterviewDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  interviewers: Interviewer[]
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    objective: string
    description: string
    questions: Question[]
    questionCount: number
    timeDuration: string
    interviewerId: string
  }
}

export default function CreateInterviewDialog(
  props: CreateInterviewDialogProps
) {
  const { interviewers, mode = "create", initialData, open, setOpen } = props

  const [step, setStep] = useState<1 | 2>(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [basicInfo, setBasicInfo] = useState<BasicInterviewInfoDefaultValues>(
    () => ({
      name: initialData?.name ?? "",
      objective: initialData?.objective ?? "",
      numQuestions: initialData?.questionCount || undefined,
      duration: initialData?.timeDuration
        ? Number(initialData.timeDuration)
        : undefined,
      interviewerId: initialData?.interviewerId ?? "",
      description: initialData?.description ?? "",
    })
  )
  const [questions, setQuestions] = useState<InterviewQuestionsValues>(() =>
    initialData?.questions?.length
      ? initialData.questions
      : [{ question: "", followUpCount: 1 }]
  )

  const goToStep2WithManual = (values: BasicInterviewInfoValues) => {
    setBasicInfo(values)
    setQuestions((currentQuestions) =>
      currentQuestions.length
        ? currentQuestions
        : [{ question: "", followUpCount: 1 }]
    )
    setStep(2)
  }

  const goToStep2WithGenerate = async (
    values: BasicInterviewInfoValues,
    documentContext: string
  ) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          objective: values.objective,
          number: values.numQuestions,
          context: documentContext,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate questions")

      const { response: generated } = await response.json()
      const questions: Question[] = generated.questions.map((q: Question) => ({
        question: q.question.trim(),
        followUpCount: 1,
      }))

      setBasicInfo({ ...values, description: generated.description })
      setQuestions(questions)
      setStep(2)
    } catch {
      toast.error("Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBack = (nextQuestions: InterviewQuestionsValues) => {
    setQuestions(nextQuestions)
    setStep(1)
  }

  const handleSaveQuestions = (nextQuestions: InterviewQuestionsValues) => {
    setQuestions(nextQuestions)
    startTransition(async () => {
      if (!basicInfo.numQuestions || !basicInfo.duration) {
        toast.error("Please complete the basic interview information.")
        setStep(1)
        return
      }

      const payload = {
        name: basicInfo.name,
        objective: basicInfo.objective,
        description: basicInfo.description,
        questions: nextQuestions,
        interviewerId: basicInfo.interviewerId,
        questionCount: basicInfo.numQuestions,
        timeDuration: String(basicInfo.duration),
      }

      if (mode === "edit" && initialData?.id) {
        const result = await updateInterview(initialData.id, payload)

        if (!result.success) {
          toast.error(result.error)
          return
        }

        toast.success("Interview updated successfully.")
      } else {
        const result = await createInterview(payload)

        if (!result.success) {
          toast.error(result.error)
          return
        }
      }

      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="gap-4 px-4 sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Interview" : "Create an Interview"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {isGenerating ? (
          <CustomSpinner />
        ) : step === 1 ? (
          <ScrollArea className="max-h-[80dvh] *:data-[slot='scroll-area-viewport']:max-h-[80dvh]">
            <BasicInterviewInfo
              interviewers={interviewers}
              mode={mode}
              defaultValues={basicInfo}
              onManual={goToStep2WithManual}
              onGenerate={goToStep2WithGenerate}
            />
          </ScrollArea>
        ) : (
          <ScrollArea className="max-h-[80dvh] *:data-[slot='scroll-area-viewport']:max-h-[80dvh]">
            <CreateInterviewQuestions
              questionCount={basicInfo.numQuestions ?? 0}
              questions={questions}
              onBack={handleBack}
              onSave={handleSaveQuestions}
              isSaving={isPending}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
