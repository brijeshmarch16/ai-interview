import type { Metadata } from "next"
import Image from "next/image"
import Call from "@/components/interview"
import { getInterviewById } from "@/lib/data/interviews"
import { createMetadata } from "@/lib/metadata"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{
    interviewId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { interviewId } = await params
  const interview = await getInterviewById(interviewId)

  return createMetadata({ title: interview?.name ?? "AI Interview" })
}

interface PopUpMessageProps {
  title: string
  description: string
  image: string
}

function PopUpMessage({ title, description, image }: PopUpMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-lg border-2 border-r-4 border-b-4 border-border bg-card p-8 transition-all">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={image}
              alt="Graphic"
              width={200}
              height={200}
              className="mb-4"
            />
            <h1 className="text-md mb-2 font-medium">{title}</h1>
            <p className="text-center">{description}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-row justify-center align-middle">
          <div className="text-md mr-2 text-center font-semibold">
            Powered by{" "}
            <span className="font-bold">
              AI <span className="text-primary">Interview</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function InterviewInterface({ params }: Props) {
  const { interviewId } = await params
  const interview = await getInterviewById(interviewId)

  if (!interview) {
    return (
      <PopUpMessage
        title="Invalid URL"
        description="The interview link you're trying to access is invalid. Please check the URL and try again."
        image="/invalid-url.png"
      />
    )
  }

  if (!interview.isActive) {
    return (
      <PopUpMessage
        title="Interview Is Unavailable"
        description="We are not currently accepting responses. Please contact the sender for more information."
        image="/closed.png"
      />
    )
  }

  return <Call interview={interview} />
}
