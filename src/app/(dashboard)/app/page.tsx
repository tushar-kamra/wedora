import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalAuth } from "@/server/auth/session";
import { WeddingService } from "@/modules/wedding/wedding.service";
import { DashboardOverview } from "@/components/features/wedding/dashboard-overview";

export const metadata: Metadata = {
  title: "Wedding Overview Dashboard | Wedora",
  description:
    "Overview of your wedding countdown, ceremonies, tasks, guest RSVPs, expenses, and vendors.",
};

export default async function DashboardOverviewPage() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (!auth.wedding) {
    redirect("/create-wedding");
  }

  const dashboard = await WeddingService.getDashboard(auth.wedding.id);
  const coupleTitle = `${dashboard.wedding.brideName} & ${dashboard.wedding.groomName}`;

  return (
    <DashboardOverview
      coupleTitle={coupleTitle}
      weddingDate={dashboard.wedding.weddingDate}
      dashboard={dashboard}
    />
  );
}
