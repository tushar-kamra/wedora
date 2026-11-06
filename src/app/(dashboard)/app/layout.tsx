import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getOptionalAuth } from "@/server/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

function formatWeddingDateShort(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (!auth.wedding || !auth.membership) {
    redirect("/create-wedding");
  }

  const coupleTitle = `${auth.wedding.brideName} & ${auth.wedding.groomName}`;
  const weddingDateLabel = formatWeddingDateShort(auth.wedding.weddingDate);
  const role = auth.membership.role;

  return (
    <DashboardShell
      userName={auth.user.name}
      userEmail={auth.user.email}
      role={role}
      coupleTitle={coupleTitle}
      weddingDateLabel={weddingDateLabel}
    >
      {children}
    </DashboardShell>
  );
}

