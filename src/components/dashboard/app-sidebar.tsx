"use client";

import { LogOut, PlayCircleIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth/client";
import { BrandName } from "../ui/brand-name";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state, isMobile } = useSidebar();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/sign-in");
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="border-sidebar-border border-b p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2 group-data-[collapsible=icon]:hidden">
            <BrandName className="font-semibold text-2xl" />
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/interviews")}
                tooltip="Interviews"
              >
                <Link href="/interviews">
                  <PlayCircleIcon />
                  <span>Interviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/settings")}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2">
        <div className="rounded-md p-2">
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm">{session?.user.name}</p>
              <p className="truncate text-muted-foreground text-sm">{session?.user.email}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={handleLogout} size="icon" aria-label="Log out">
                  <LogOut className="cursor-pointer text-muted-foreground" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                hidden={state !== "collapsed" || isMobile}
              >
                Log out
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
