"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type FieldErrorType = { message?: string } | undefined;

type PasswordFieldProps = Omit<React.ComponentProps<typeof InputGroupInput>, "type"> & {
  label: string;
  invalid?: boolean;
  error?: FieldErrorType;
};

export function PasswordField(props: PasswordFieldProps) {
  const { id, label, invalid, error, disabled, ...rest } = props;
  const [isVisible, setIsVisible] = useState(false);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const toggleLabel = isVisible ? "Hide password" : "Show password";

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <InputGroup data-disabled={disabled ? true : undefined}>
        <InputGroupInput
          {...rest}
          id={fieldId}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={invalid}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label={toggleLabel}
            disabled={disabled}
            onClick={() => setIsVisible((value) => !value)}
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}
