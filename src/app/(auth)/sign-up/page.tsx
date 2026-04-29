"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import MiniLoader from "@/components/loaders/mini-loader/miniLoader"
import { BrandName } from "@/components/ui/brand-name"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordField } from "@/components/ui/password-field"
import { signUp } from "@/lib/auth/client"

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*]/, {
      message: "Password must contain at least one special character",
    }),
})

export default function SignUpPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const { control, formState } = form
  const { isValid, isDirty, isSubmitting } = formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/interviews",
    })

    if (error) {
      toast.error(error.message ?? "Sign up failed.", {
        icon: <TriangleAlert className="size-4" />,
      })
      return
    }

    router.push("/interviews")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-2">
              <BrandName className="text-3xl font-semibold" />
            </div>
          </div>
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your full name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your email"
                          type="email"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <PasswordField
                        {...field}
                        id={field.name}
                        label="Password"
                        invalid={fieldState.invalid}
                        error={fieldState.error}
                        placeholder="Enter your password"
                      />
                    )}
                  />

                  <Field>
                    <Button
                      type="submit"
                      disabled={!isValid || !isDirty || isSubmitting}
                    >
                      {isSubmitting && <MiniLoader />}
                      Create account
                    </Button>
                    <FieldDescription className="text-center">
                      Already have an account?{" "}
                      <Link href="/sign-in">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
