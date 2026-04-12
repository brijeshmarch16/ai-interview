import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = createMetadata({
  title: "AI Interview",
  description: "Open-source AI voice interview platform. Paste a job description, send candidates a link, and get back a full scorecard automatically.",
  icons: { icon: "/browser-client-icon.ico" },
  ...(process.env.NEXT_PUBLIC_MARKETING_ENABLED &&
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(GeistSans.className, "min-h-screen antialiased")}>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
