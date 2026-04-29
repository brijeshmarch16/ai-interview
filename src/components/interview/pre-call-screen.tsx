"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlarmClockIcon } from "lucide-react"
import Image from "next/image"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import MiniLoader from "@/components/loaders/mini-loader/miniLoader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Interview } from "@/types/database.types"
import BrandingFooter from "./branding-footer"
import ConfirmDialog from "./confirm-dialog"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

type FormValues = z.infer<typeof formSchema>

interface PreCallScreenProps {
  interview: Interview
  isLoading: boolean
  interviewTimeDuration: string
  interviewerImg: string
  onStart: (email: string, name: string) => void
  onExit: () => void
}

export default function PreCallScreen(props: PreCallScreenProps) {
  const {
    interview,
    isLoading,
    interviewTimeDuration,
    interviewerImg,
    onStart,
    onExit,
  } = props

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { email: "", firstName: "", lastName: "" },
  })

  const { control, formState } = form

  const onSubmit = (values: FormValues) => {
    onStart(values.email, `${values.firstName} ${values.lastName}`)
  }

  return (
    <div className="w-full max-w-4xl py-8">
      <Card className="w-full overflow-hidden rounded-md border-2 border-r-4 border-b-4 border-border bg-card">
        {/* Card header */}
        <div className="border-b border-border p-6 text-center">
          <h1 className="mb-1 text-2xl font-bold">
            👋 Ready to Start Your Interview?
          </h1>
          <p className="text-sm text-muted-foreground">{interview.name}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <AlarmClockIcon className="h-4 w-4" />
              <span className="font-semibold">{interviewTimeDuration} min</span>
              <span>or less</span>
            </div>
          </div>
          {interview.description && (
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {interview.description}
            </p>
          )}
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Left panel */}
          <div className="flex flex-col gap-5">
            {/* AI greeting bubble */}
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                {interviewerImg ? (
                  <Image
                    src={interviewerImg}
                    alt="AI Interviewer"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg text-primary">AI</span>
                  </div>
                )}
              </div>
              <div className="rounded-2xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground">
                Hi, I&apos;m your AI interviewer. I&apos;ll be asking you a few
                short questions about your experience, skills, and how you solve
                problems. Ready?
              </div>
            </div>

            {/* Before We Begin */}
            <div>
              <p className="mb-2 text-sm font-semibold">Before We Begin</p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  🎤 Make sure your mic is on
                </span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  🎧 Sit in a quiet space
                </span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  🔴 Tab switching will be recorded
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Don&apos;t worry — we&apos;ll guide you every step of the way. By
              continuing you&apos;re agreeing to our terms.
            </p>
          </div>

          {/* Right panel — form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div>
                <p className="mb-2 text-sm font-medium">Enter your name</p>
                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="First Name"
                            aria-invalid={fieldState.invalid}
                            className="text-sm font-normal"
                          />
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Last Name"
                            aria-invalid={fieldState.invalid}
                            className="text-sm font-normal"
                          />
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">
                  Enter your email address
                </p>
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <Input
                          {...field}
                          id="email"
                          placeholder="Enter your email address"
                          aria-invalid={fieldState.invalid}
                          className="text-sm font-normal"
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            <Button
              type="submit"
              className="h-10 w-full"
              disabled={isLoading || !formState.isValid}
            >
              {!isLoading ? "I'm Ready" : <MiniLoader />}
            </Button>

            <ConfirmDialog
              trigger={
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 w-full text-muted-foreground"
                  disabled={isLoading}
                >
                  Exit
                </Button>
              }
              title="Are you sure you want to exit the interview?"
              onConfirm={onExit}
            />
          </form>
        </div>

        <BrandingFooter />
      </Card>
    </div>
  )
}
