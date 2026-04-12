import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "AI Interview",
  icons: { icon: "/browser-user-icon.ico" },
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
