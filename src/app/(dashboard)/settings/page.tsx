export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/dashboard/settings/account-settings";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  let session = null;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("[SettingsPage] Failed to retrieve session:", error);
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="font-semibold text-2xl">Settings</h2>
        <h3 className="text-muted-foreground text-sm">Manage your account</h3>
      </div>

      <div className="mt-5">
        <AccountSettings session={session} />
      </div>
    </div>
  );
}
