"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient, useSession } from "@/lib/auth/client"
import ChangePasswordDialog from "./change-password-dialog"

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email address").nonempty("Email is required"),
})

type FormValues = z.infer<typeof formSchema>

interface AccountSettingsProps {
  session: { user: { name: string; email: string } }
}

export default function AccountSettings({ session }: AccountSettingsProps) {
  const { data: liveSession } = useSession()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  const { control, reset, getValues, trigger } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: session.user.name,
      email: session.user.email,
    },
  })

  useEffect(() => {
    if (liveSession?.user) {
      reset({
        name: liveSession.user.name,
        email: liveSession.user.email,
      })
    }
  }, [liveSession, reset])

  const handleSave = async () => {
    const valid = await trigger()
    if (!valid) return

    setSaving(true)
    try {
      const { error: nameError } = await authClient.updateUser({
        name: getValues("name"),
      })
      if (nameError) {
        toast.error(nameError.message ?? "Failed to update name.")
        return
      }

      const currentEmail = liveSession?.user.email ?? session.user.email
      if (getValues("email") !== currentEmail) {
        const { error: emailError } = await authClient.changeEmail({
          newEmail: getValues("email"),
        })
        if (emailError) {
          toast.error(emailError.message ?? "Failed to update email.")
          return
        }
      }

      toast.success("Profile updated.")
      reset({ name: getValues("name"), email: getValues("email") })
      setEditing(false)
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: liveSession?.user.name ?? session.user.name,
      email: liveSession?.user.email ?? session.user.email,
    })
    setEditing(false)
  }

  const editActions = (
    <Button
      type="button"
      variant="outline"
      className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
      onClick={() => setEditing(true)}
    >
      Edit
    </Button>
  )

  const saveActions = (
    <>
      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={saving}
      >
        Cancel
      </Button>
    </>
  )

  return (
    <>
      <Card className="w-full rounded-md">
        <CardContent>
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    disabled={!editing || saving}
                    aria-invalid={fieldState.invalid}
                    placeholder="Jane Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    disabled={!editing || saving}
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex items-center gap-3">
              {!editing ? editActions : saveActions}

              {/* Password */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangePasswordOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {changePasswordOpen && (
        <ChangePasswordDialog
          open={changePasswordOpen}
          onOpenChange={setChangePasswordOpen}
        />
      )}
    </>
  )
}
