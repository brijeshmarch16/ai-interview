"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Interviewer } from "@/types/interviewer"
import FileUpload from "./file-upload"

const basicInterviewInfoSchema = z.object({
  name: z.string().min(1, "Interview name is required"),
  objective: z.string().min(1, "Objective is required"),
  numQuestions: z.number().int().min(1).max(5),
  duration: z.number().int().min(1).max(15),
  interviewerId: z.string().min(1, "Please select an interviewer"),
  description: z.string().min(1, "Description is required"),
})

export type BasicInterviewInfoValues = z.output<typeof basicInterviewInfoSchema>
export type BasicInterviewInfoDefaultValues = Omit<
  BasicInterviewInfoValues,
  "numQuestions" | "duration"
> & {
  numQuestions?: number
  duration?: number
}

interface BasicInterviewInfoProps {
  interviewers: Interviewer[]
  mode: "create" | "edit"
  defaultValues: BasicInterviewInfoDefaultValues
  onManual: (values: BasicInterviewInfoValues) => void
  onGenerate: (
    values: BasicInterviewInfoValues,
    documentContext: string
  ) => void
}

export default function BasicInterviewInfo(props: BasicInterviewInfoProps) {
  const {
    interviewers,
    mode = "create",
    defaultValues,
    onManual,
    onGenerate,
  } = props

  const [documentContext, setDocumentContext] = useState("")
  const form = useForm<
    BasicInterviewInfoValues,
    unknown,
    BasicInterviewInfoValues
  >({
    resolver: zodResolver(basicInterviewInfoSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultValues,
      numQuestions: defaultValues.numQuestions as number,
      duration: defaultValues.duration as number,
    },
  })

  const { control } = form
  const { isValid } = form.formState

  const submitManual = form.handleSubmit((values) => onManual(values))
  const submitGenerate = form.handleSubmit((values) =>
    onGenerate(values, documentContext)
  )

  return (
    <FormProvider {...form}>
      <form className="px-3">
        <FieldGroup>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Interview Name</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Name of the Interview"
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="objective"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Objective of Interview
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="h-24 w-full border border-border"
                    placeholder="e.g. Find best candidates based on their technical skills and previous projects."
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Interview Description
                  <span className="mt-0.5 block text-xs font-light text-muted-foreground italic">
                    Note: Interviewees will see this description.
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    {...field}
                    id={field.name}
                    className="resize-none"
                    placeholder="Enter your interview description."
                    rows={3}
                    onBlur={(e) => field.onChange(e.target.value.trim())}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex flex-wrap gap-4">
            <Controller
              name="numQuestions"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="min-w-35 flex-1"
                >
                  <FieldLabel htmlFor={field.name}>
                    Number of Questions (Max 05)
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      step="1"
                      max="5"
                      min="1"
                      placeholder="e.g. 3"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        let value = e.target.value
                        if (
                          value === "" ||
                          (Number.isInteger(Number(value)) && Number(value) > 0)
                        ) {
                          if (Number(value) > 5) value = "5"
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          )
                        }
                      }}
                    />
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="duration"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="min-w-35 flex-1"
                >
                  <FieldLabel htmlFor={field.name}>
                    Duration (Max 15 Minutes)
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative flex items-center">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        step="1"
                        max="15"
                        min="1"
                        className="pr-12"
                        placeholder="e.g. 10"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          let value = e.target.value
                          if (
                            value === "" ||
                            (Number.isInteger(Number(value)) &&
                              Number(value) > 0)
                          ) {
                            if (Number(value) > 15) value = "15"
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            )
                          }
                        }}
                      />
                      <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
                        mins
                      </span>
                    </div>
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="interviewerId"
            control={control}
            render={({ field, fieldState }) => {
              const selectedInterviewer = interviewers.find(
                (i) => i.id === field.value
              )
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Select an Interviewer</FieldLabel>
                  <FieldContent>
                    <div className="flex gap-4">
                      {interviewers.map((item) => (
                        <div key={item.id} className="relative">
                          <Button
                            type="button"
                            variant="outline"
                            className={`h-auto flex-col border-2 px-4 py-2 hover:bg-background ${field.value === item.id ? "border-primary" : "border-border"}`}
                            onClick={() => field.onChange(item.id)}
                          >
                            <Image
                              src={item.image}
                              alt="Picture of the interviewer"
                              width={50}
                              height={50}
                              className="h-20 w-25 object-cover"
                            />
                            <CardTitle className="text-center text-xs">
                              {item.name}
                            </CardTitle>
                          </Button>
                        </div>
                      ))}
                    </div>
                    {selectedInterviewer && (
                      <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
                        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                          {selectedInterviewer.description}
                        </p>
                        {selectedInterviewer.audio && (
                          <audio
                            key={selectedInterviewer.audio}
                            controls
                            className="mb-3 h-8 w-full"
                            src={`/audio/${selectedInterviewer.audio}`}
                          >
                            <track kind="captions" />
                          </audio>
                        )}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {(
                            [
                              ["Empathy", selectedInterviewer.empathy],
                              ["Rapport", selectedInterviewer.rapport],
                              ["Exploration", selectedInterviewer.exploration],
                              ["Speed", selectedInterviewer.speed],
                            ] as [string, number][]
                          ).map(([label, value]) => (
                            <div
                              key={label}
                              className="flex items-center gap-2"
                            >
                              <span className="w-20 shrink-0 text-xs">
                                {label}
                              </span>
                              <div className="h-1.5 flex-1 rounded-full bg-border">
                                <div
                                  className="h-1.5 rounded-full bg-primary"
                                  style={{ width: `${value * 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )
            }}
          />

          <Field>
            <FieldLabel>Upload job description</FieldLabel>
            <FileUpload
              onUpload={(context) => setDocumentContext(context)}
              onReset={() => setDocumentContext("")}
            />
          </Field>

          <Field>
            <div className="mt-1 flex w-full flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={!isValid}
                onClick={submitManual}
              >
                {mode === "edit"
                  ? "Edit questions manually"
                  : "Create questions myself"}
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={submitGenerate}
                disabled={!isValid}
              >
                {mode === "edit"
                  ? "✨ Regenerate questions"
                  : "✨ Generate questions"}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  )
}
