import { Spinner } from "../ui/spinner"

export function CustomSpinner() {
  return (
    <div className="flex min-h-60 w-full flex-col items-center justify-center gap-4">
      <Spinner className="size-10 text-primary" />
      <div className="space-y-2 text-center">
        <p className="text-lg font-bold text-primary">Creating Questions</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          We're creating intelligent questions based on the interview
          objectives. This will take few moments...
        </p>
      </div>
    </div>
  )
}
