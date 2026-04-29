"use client"

import { Rocket, Server, Terminal } from "lucide-react"
import type * as React from "react"
import { Fragment } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GET_STARTED_TABS,
  type GetStartedInlinePart,
} from "@/lib/get-started-content"

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm break-all">
      {children}
    </code>
  )
}

function StepHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-semibold">{children}</h4>
}

function renderInlinePart(part: GetStartedInlinePart, index: number) {
  if (part.type === "text") {
    return <Fragment key={index}>{part.value}</Fragment>
  }

  if (part.type === "inlineCode") {
    return <InlineCode key={index}>{part.value}</InlineCode>
  }

  if (part.type === "link") {
    return (
      <a
        key={index}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        {part.label}
      </a>
    )
  }

  return <strong key={index}>{part.value}</strong>
}

function renderInlineParts(parts: GetStartedInlinePart[]) {
  return parts.map((part, index) => renderInlinePart(part, index))
}

const ICON_BY_TYPE = {
  terminal: Terminal,
  rocket: Rocket,
  server: Server,
} as const

interface MarketingGetStartedDialogProps {
  children: React.ReactNode
  triggerAriaLabel?: string
}

export function MarketingGetStartedDialog({
  children,
  triggerAriaLabel,
}: MarketingGetStartedDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild aria-label={triggerAriaLabel}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get Started</DialogTitle>
          <DialogDescription>
            Set up AI Interview locally or deploy to production.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue={GET_STARTED_TABS[0]?.id ?? "run-locally"}
          className="overflow-hidden"
        >
          <TabsList>
            {GET_STARTED_TABS.map((tab) => {
              const Icon = ICON_BY_TYPE[tab.icon]

              return (
                <TabsTrigger key={tab.id} value={tab.id}>
                  <Icon className="mr-1.5 size-3.5" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {GET_STARTED_TABS.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-4 max-h-[70vh] space-y-6 overflow-y-auto pr-1"
            >
              {tab.steps.map((step, stepIndex) => (
                <div key={step.title} className="space-y-3">
                  <StepHeading>
                    {stepIndex + 1}. {step.title}
                  </StepHeading>
                  {step.blocks.map((block, index) => {
                    if (block.type === "code") {
                      return (
                        <pre
                          className="overflow-x-auto rounded-lg border bg-muted/60 p-4 font-mono text-sm"
                          // biome-ignore lint/suspicious/noArrayIndexKey: This is a static array that won't change, so using the index as a key is acceptable here.
                          key={index}
                        >
                          <code>{block.code}</code>
                        </pre>
                      )
                    }

                    if (block.type === "paragraph") {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is a static array that won't change, so using the index as a key is acceptable here.
                        <p
                          className="text-base leading-relaxed text-muted-foreground"
                          key={index}
                        >
                          {renderInlineParts(block.parts)}
                        </p>
                      )
                    }

                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: This is a static array that won't change, so using the index as a key is acceptable here.
                      <Table className="rounded-lg border" key={index}>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Variable</TableHead>
                            <TableHead>What to put here</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {block.rows.map((row) => (
                            <TableRow key={row.variable}>
                              <TableCell>
                                <InlineCode>{row.variable}</InlineCode>
                              </TableCell>
                              <TableCell className="whitespace-normal text-muted-foreground">
                                {renderInlineParts(row.value)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )
                  })}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
