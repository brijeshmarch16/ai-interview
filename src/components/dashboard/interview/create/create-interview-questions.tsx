"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Plus } from "lucide-react"
import { useEffect, useRef } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import InterviewQuestionCard from "./interview-question-card"

const interviewQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      followUpCount: z.number().int().min(1).max(3),
    })
  ),
})

type InterviewQuestionsFormValues = z.infer<typeof interviewQuestionsSchema>
export type InterviewQuestionsValues = InterviewQuestionsFormValues["questions"]

interface CreateInterviewQuestionsProps {
  questionCount: number
  questions: InterviewQuestionsValues
  onBack: (questions: InterviewQuestionsValues) => void
  onSave: (questions: InterviewQuestionsValues) => void
  isSaving: boolean
}

export default function CreateInterviewQuestions(
  props: CreateInterviewQuestionsProps
) {
  const { questionCount, questions, onBack, onSave, isSaving } = props
  const form = useForm<
    InterviewQuestionsFormValues,
    unknown,
    InterviewQuestionsFormValues
  >({
    resolver: zodResolver(interviewQuestionsSchema),
    mode: "onChange",
    defaultValues: {
      questions,
    },
  })

  const { control, formState } = form

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
    keyName: "rhfId",
  })

  const endOfListRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(fields.length)

  const handleDeleteQuestion = (index: number) => {
    if (fields.length === 1) {
      update(0, { ...fields[0], question: "", followUpCount: 1 })
      return
    }
    remove(index)
  }

  const handleAddQuestion = () => {
    if (fields.length < questionCount) {
      append({ question: "", followUpCount: 1 })
    }
  }

  const handleBack = () => {
    onBack(form.getValues("questions"))
  }

  const handleSubmit = form.handleSubmit(({ questions }) => {
    onSave(questions)
  })

  useEffect(() => {
    if (fields.length > prevLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevLengthRef.current = fields.length
  }, [fields.length])

  useEffect(() => {
    form.trigger()
  }, [form])

  const canSave =
    !isSaving && fields.length >= questionCount && formState.isValid

  return (
    <FormProvider {...form}>
      <form
        className="flex w-full flex-col gap-4 px-3 py-1"
        onSubmit={handleSubmit}
      >
        <Button
          variant="outline"
          type="button"
          size="sm"
          className="w-fit"
          onClick={handleBack}
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </Button>

        <p className="text-sm text-muted-foreground">
          We will be using these questions during the interviews. Please make
          sure they are ok.
        </p>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <InterviewQuestionCard
              key={field.rhfId}
              questionNumber={index + 1}
              onDelete={handleDeleteQuestion}
              index={index}
            />
          ))}
          <div ref={endOfListRef} />
        </div>

        {fields.length < questionCount && (
          <div className="flex justify-center">
            <button
              type="button"
              className="rounded-full opacity-75 hover:opacity-100"
              onClick={handleAddQuestion}
            >
              <Plus size={40} strokeWidth={2.2} className="text-primary" />
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!canSave}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
