import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function RootPage() {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    session = null
  }
  redirect(session ? "/interviews" : "/sign-in")
}
