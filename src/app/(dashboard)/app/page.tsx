import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOptionalAuth } from "@/server/auth/session";
import { SignOutButton } from "@/components/features/auth/sign-out-button";

export const metadata: Metadata = {
  title: "Wedding Dashboard | Wedora",
  description: "Collaborative Indian wedding management workspace.",
};

export default async function DashboardPlaceholderPage() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (!auth.wedding || !auth.membership) {
    redirect("/create-wedding");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-margin-mobile py-space-xl text-on-surface md:px-margin">
      <div className="w-full max-w-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between border-b border-outline-variant/20 pb-5">
          <div className="flex items-center gap-3">
            <span className="font-headline-sm text-xl font-medium tracking-tight text-primary">
              Wedora
            </span>
            <span className="h-4 w-px bg-outline-variant/40" />
            <span className="font-label-caption text-label-caption tracking-widest text-secondary uppercase">
              {auth.membership.role} Workspace
            </span>
          </div>
          <SignOutButton />
        </div>

        <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">
          {auth.wedding.brideName} &amp; {auth.wedding.groomName}
        </h1>
        <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
          Signed in as{" "}
          <span className="font-medium text-on-surface">{auth.user.name}</span>{" "}
          ({auth.user.email}) • Wedding Date: {auth.wedding.weddingDate}
        </p>

        <div className="mt-6 flex items-center justify-between pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

