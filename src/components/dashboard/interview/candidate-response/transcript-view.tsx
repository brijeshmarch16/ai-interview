import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptViewProps {
  transcriptHtml: string;
}

export function TranscriptView({ transcriptHtml }: TranscriptViewProps) {
  return (
    <div className="max-h-125 min-h-37.5 rounded-xl bg-muted p-4 px-5">
      <p className="my-2 mb-4 font-semibold">Transcript</p>
      <ScrollArea className="scrollbar-thin h-96 overflow-y-auto whitespace-pre-line rounded-lg px-2 text-sm">
        <div
          className="rounded-lg bg-card p-4 text-sm leading-5"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: transcript is sanitized with DOMPurify before rendering
          dangerouslySetInnerHTML={{ __html: transcriptHtml }}
        />
      </ScrollArea>
    </div>
  );
}
