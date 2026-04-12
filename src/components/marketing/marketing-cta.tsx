import { GITHUB_REPO_URL } from "@/lib/constants";
import { Button } from "../ui/button";
import { MarketingGetStartedDialog } from "./marketing-get-started-dialog";

export default function MarketingCta() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-2 font-semibold text-xl sm:text-2xl">Deploy AI Interview in minutes</p>
        <p className="mb-5 text-base text-muted-foreground">
          Self-hosted and MIT licensed. Runs on Vercel or Docker.
        </p>
        <MarketingGetStartedDialog>
          <Button size="lg">Get Started</Button>
        </MarketingGetStartedDialog>
        <p className="mt-4 text-muted-foreground text-sm">
          If it saves you time, a star on{" "}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            GitHub
          </a>{" "}
          helps the project grow.
        </p>
      </div>
    </section>
  );
}
