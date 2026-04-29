import { Separator } from "../ui/separator"

export default function MarketingFooter() {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground">
      <Separator className="mb-8" />© {new Date().getFullYear()} AI Interview.
      All rights reserved.
    </footer>
  )
}
