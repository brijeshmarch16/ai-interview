import { notFound } from "next/navigation"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import InterviewDetailClient from "@/components/dashboard/interview/detail/interview-detail-client"
import { getAllInterviewers } from "@/lib/data/interviewers"
import { getInterviewById } from "@/lib/data/interviews"
import {
  getInterviewStats,
  getResponsesPaginated,
  PAGE_SIZE,
} from "@/lib/data/responses"

export const dynamic = "force-dynamic"

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(0),
  search: parseAsString.withDefault(""),
  status: parseAsString.withDefault("ALL"),
})

export default async function InterviewDetailPage(
  props: PageProps<"/interviews/[interviewId]">
) {
  const { params, searchParams } = props

  const [{ interviewId }, { page, search, status }] = await Promise.all([
    params,
    searchParamsCache.parse(searchParams),
  ])

  const [interview, { data: responses, total }, stats, interviewers] =
    await Promise.all([
      getInterviewById(interviewId),
      getResponsesPaginated({
        interviewId,
        page,
        pageSize: PAGE_SIZE,
        search,
        status,
      }),
      getInterviewStats(interviewId),
      getAllInterviewers(),
    ])

  if (!interview) {
    notFound()
  }

  return (
    <InterviewDetailClient
      interview={interview}
      data={responses}
      stats={stats}
      interviewers={interviewers}
      totalCount={total}
      statsTotal={stats.totalCount}
    />
  )
}
