export const dynamic = "force-dynamic"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import CreateInterviewCard from "@/components/dashboard/interview/list/create-interview-card"
import InterviewCard from "@/components/dashboard/interview/list/interview-card"
import { auth } from "@/lib/auth"
import { getAllInterviewers } from "@/lib/data/interviewers"
import { getInterviewsWithDetails } from "@/lib/data/interviews"

export default async function InterviewsPage() {
  let session = null

  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error("[InterviewsPage] Failed to retrieve session:", error)
  }

  if (!session) {
    redirect("/sign-in")
  }

  const [interviews, interviewers] = await Promise.all([
    session?.user.id
      ? getInterviewsWithDetails(session.user.id)
      : Promise.resolve([]),
    getAllInterviewers(),
  ])

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="text-2xl font-semibold">Interviews</h2>
        <h3 className="text-sm text-muted-foreground">
          {interviews.length} Interviews created
        </h3>
      </div>

      <div className="relative mt-5 grid grid-cols-1 items-center gap-4 overflow-x-auto md:grid-cols-2 xl:grid-cols-4">
        <CreateInterviewCard interviewers={interviewers} />

        {interviews.map((item) => (
          <InterviewCard
            id={item.id}
            key={item.id}
            name={item.name}
            readableSlug={item.readableSlug}
            interviewerImage={item.interviewerImage ?? null}
            responseCount={item.responseCount ?? 0}
            isActive={item.isActive ?? true}
          />
        ))}
      </div>
    </div>
  )
}
