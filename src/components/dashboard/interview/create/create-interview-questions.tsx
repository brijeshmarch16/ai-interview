"use client"

import { ChevronLeft, Plus } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { FormValues } from "./create-interview-dialog"
import InterviewQuestionCard from "./interview-question-card"

interface CreateInterviewQuestionsProps {
  questionCount: number
  onBack: () => void
  isSaving: boolean
}

export default function CreateInterviewQuestions(
  props: CreateInterviewQuestionsProps
) {
  const { questionCount, onBack, isSaving } = props
  const { control, formState } = useFormContext<FormValues>()

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

  useEffect(() => {
    if (fields.length > prevLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevLengthRef.current = fields.length
  }, [fields.length])

  const canSave =
    !isSaving && fields.length >= questionCount && formState.isValid

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-1">
      <Button
        variant="outline"
        type="button"
        size="sm"
        className="w-fit"
        onClick={onBack}
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </Button>

      <p className="text-sm text-muted-foreground">
        We will be using these questions during the interviews. Please make sure
        they are ok.
      </p>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <InterviewQuestionCard
            key={field.rhfId}
            questionNumber={index + 1}
            questionData={field}
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
    </div>
  )
}
