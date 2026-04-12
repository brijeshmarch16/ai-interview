"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedbackData } from "@/types/response";

enum SatisfactionLevel {
  Positive = "😀",
  Moderate = "😐",
  Negative = "😔",
}

const SATISFACTION_LABELS: Record<SatisfactionLevel, string> = {
  [SatisfactionLevel.Positive]: "Great",
  [SatisfactionLevel.Moderate]: "Okay",
  [SatisfactionLevel.Negative]: "Poor",
};

const formSchema = z
  .object({
    satisfaction: z.nativeEnum(SatisfactionLevel).nullable(),
    feedback: z.string(),
  })
  .refine((d) => d.satisfaction !== null || d.feedback.trim().length > 0, {
    message: "Please select a rating or add feedback",
    path: ["satisfaction"],
  });

type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  onSubmit: (data: Omit<FeedbackData, "interview_id">) => void;
  email: string;
}

export default function FeedbackForm({ onSubmit, email }: FeedbackFormProps) {
  const { control, handleSubmit, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satisfaction: SatisfactionLevel.Positive,
      feedback: "",
    },
  });

  const satisfaction = useWatch({ control, name: "satisfaction" });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      satisfaction: Object.values(SatisfactionLevel).indexOf(
        values.satisfaction as SatisfactionLevel,
      ),
      feedback: values.feedback,
      email,
    });
  };

  return (
    <form className="flex flex-col gap-6 p-2 sm:p-4" onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-semibold text-lg tracking-tight">Share your experience</h2>
        <p className="text-muted-foreground text-sm">How satisfied are you with the platform?</p>
      </div>

      <FieldGroup>
        {/* Emoji Rating */}
        <Field data-invalid={!!formState.errors.satisfaction}>
          <FieldContent>
            <div className="flex items-center justify-around gap-2 rounded-xl border bg-muted/40 p-3 sm:gap-4 sm:p-4">
              {Object.values(SatisfactionLevel).map((emoji) => {
                const isSelected = satisfaction === emoji;
                return (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setValue("satisfaction", emoji, { shouldValidate: true })}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-200",
                      "hover:bg-background hover:shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isSelected
                        ? "scale-105 bg-background shadow-sm ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100",
                    )}
                    aria-pressed={isSelected}
                    aria-label={SATISFACTION_LABELS[emoji]}
                  >
                    <span
                      className={cn(
                        "text-3xl transition-transform duration-200 sm:text-4xl",
                        isSelected && "scale-110",
                      )}
                    >
                      {emoji}
                    </span>
                    <span
                      className={cn(
                        "font-medium text-xs transition-colors duration-200",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {SATISFACTION_LABELS[emoji]}
                    </span>
                  </button>
                );
              })}
            </div>
          </FieldContent>
          {formState.errors.satisfaction && (
            <FieldError>{formState.errors.satisfaction.message}</FieldError>
          )}
        </Field>

        {/* Feedback Textarea */}
        <Controller
          control={control}
          name="feedback"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="feedback">
                Additional feedback{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  id="feedback"
                  placeholder="Tell us what went well or what could be improved..."
                  aria-invalid={fieldState.invalid}
                  className="min-h-25 resize-none sm:min-h-30"
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full">
        Submit Feedback
      </Button>
    </form>
  );
}
