import type { Metadata } from "next"
import AppSidebar from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  title: "AI Interview Dashboard",
  icons: { icon: "/browser-client-icon.ico" },
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden p-6">
        {/* Mobile menu trigger - only visible on mobile */}
        <div className="mb-4 md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
