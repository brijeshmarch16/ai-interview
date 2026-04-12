import Image from "next/image";
import { GITHUB_REPO_URL } from "@/lib/constants";
import { GithubIcon } from "../icons/github-icon";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { NumberTicker } from "../ui/number-ticker";
import { MarketingGetStartedDialog } from "./marketing-get-started-dialog";

interface MarketingHeroProps {
  stars: number;
}

export default function MarketingHero({ stars }: MarketingHeroProps) {
  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <h1 className="font-extrabold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        AI voice interviews.{" "}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Open source, self-hosted.
        </span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Paste a job description, send a link, and get a full scorecard back in minutes.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <MarketingGetStartedDialog triggerAriaLabel="Get started with setup guide">
          <Button size="lg">Get Started</Button>
        </MarketingGetStartedDialog>
        <Button asChild size="lg" variant="outline">
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="size-4" />
            Star on GitHub 🌟
            <NumberTicker value={stars} />
          </a>
        </Button>
      </div>

      {/* Browser-frame dashboard screenshot */}
      <Card className="mt-8 w-full max-w-4xl gap-0 overflow-hidden p-0 sm:mt-12">
        <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-2.5">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-yellow-400" />
          <span className="size-3 rounded-full bg-green-400" />
          <span className="ml-3 flex-1 rounded bg-muted px-3 py-1 text-muted-foreground text-xs">
            ai-interview.brijeshkumaryadav.com
          </span>
        </div>
        <Image
          src="/screenshot.png"
          alt="AI Interview dashboard showing interview management and candidate scoring"
          width={896}
          height={504}
          className="w-full"
          unoptimized
          priority
        />
      </Card>
    </section>
  );
}
