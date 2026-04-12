"use client";

import { Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

interface InterviewCardProps {
  name: string | null;
  id: string;
  readableSlug: string | null;
  interviewerImage: string | null;
  responseCount: number;
  isActive: boolean;
}

export default function InterviewCard(props: InterviewCardProps) {
  const { name, id, readableSlug, interviewerImage, responseCount, isActive } = props;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const host = window.location.host;
      const protocol = host.includes("localhost") ? "http" : "https";
      const slug = readableSlug ?? id;
      const url = `${protocol}://${host}/call/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("The link to your interview has been copied to your clipboard.", {
        position: "bottom-right",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link. Please copy it manually.", { position: "bottom-right" });
    }
  };

  return (
    <Link href={`/interviews/${id}`}>
      <Card className="relative h-64 w-full shrink-0 cursor-pointer gap-4 overflow-hidden rounded-md border bg-background p-3 shadow-none ring-0">
        <CardContent className="flex h-full flex-col rounded-md bg-primary/10 p-2">
          {/* Top row: Active badge + action buttons */}
          <div className="flex items-center justify-between p-2">
            <Badge
              className={`gap-1 border-0 text-[10px] text-background ${isActive ? "bg-green-500" : "bg-gray-400"}`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="icon-xs"
                aria-label={copied ? "Link copied" : "Copy interview link"}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  copyToClipboard();
                }}
              >
                {copied ? <CopyCheck /> : <Copy />}
              </Button>
            </div>
          </div>

          {/* Center: Centered title */}
          <div className="flex flex-1 items-center justify-center px-4">
            <CardTitle className="text-center font-bold text-base text-primary">{name}</CardTitle>
          </div>
        </CardContent>

        <CardFooter className="px-0">
          {/* Bottom row: response count + interviewer avatar */}
          <div className="flex w-full items-center justify-between">
            {interviewerImage && (
              <Image
                src={interviewerImage}
                alt="Picture of the interviewer"
                width={40}
                height={40}
                className="rounded-full object-cover object-center"
              />
            )}
            <span className="font-bold text-primary/90 text-sm">{responseCount} Responses</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
