import { BrandName } from "../ui/brand-name";
import { Button } from "../ui/button";
import { MarketingGetStartedDialog } from "./marketing-get-started-dialog";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-border/40 border-b bg-background/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2">
          <BrandName className="font-semibold text-2xl text-foreground" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <MarketingGetStartedDialog triggerAriaLabel="Open setup options dialog">
            <Button>Get Started</Button>
          </MarketingGetStartedDialog>
        </div>
      </div>
    </header>
  );
}
