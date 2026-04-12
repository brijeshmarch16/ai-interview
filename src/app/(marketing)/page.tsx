import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketingCta from "@/components/marketing/marketing-cta";
import MarketingFeatures from "@/components/marketing/marketing-features";
import MarketingFooter from "@/components/marketing/marketing-footer";
import MarketingHeader from "@/components/marketing/marketing-header";
import MarketingHero from "@/components/marketing/marketing-hero";
import MarketingHowItWorks from "@/components/marketing/marketing-how-it-works";
import { auth } from "@/lib/auth";

const getGithubStars = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.github.com/repos/brijeshmarch16/ai-interview", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) return 0;
    const data = (await response.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
};

export default async function LandingPage() {
  if (process.env.NEXT_PUBLIC_MARKETING_ENABLED !== "true") {
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      redirect(session ? "/interviews" : "/sign-in");
    } catch {
      redirect("/sign-in");
    }
  }

  const stars = await getGithubStars();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <MarketingHeader />

      <main className="flex flex-1 flex-col">
        <MarketingHero stars={stars} />

        <MarketingHowItWorks />

        <MarketingFeatures />

        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
