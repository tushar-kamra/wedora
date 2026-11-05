import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOptionalAuth } from "@/server/auth/session";
import { SignOutButton } from "@/components/features/auth/sign-out-button";

export const metadata: Metadata = {
  title: "Create Your Wedding Workspace | Wedora",
  description:
    "Set up your Wedora wedding workspace, primary celebration date, and venue details.",
};

export default async function CreateWeddingPlaceholderPage() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (auth.wedding) {
    redirect("/app");
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
              Wedding Setup
            </span>
          </div>
          <SignOutButton />
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 font-label-caption text-label-caption tracking-wider text-secondary uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
          Authenticated Session Active
        </div>

        <h1 className="mb-3 font-headline-lg text-headline-lg text-primary">
          Welcome, {auth.user.name}.
        </h1>
        <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
          You are signed in as{" "}
          <span className="font-medium text-on-surface">{auth.user.email}</span>.
          Your account is ready to create a new Wedding Workspace in{" "}
          <span className="font-medium text-primary">Phase 2</span>.
        </p>

        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-5">
          <p className="mb-1 font-label-md text-label-md font-medium text-primary">
            Next Milestone: Phase 2 — Wedding Setup (`/create-wedding`)
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Here you will configure Bride &amp; Groom names, primary wedding date
            (`YYYY-MM-DD`), timezone (`Asia/Kolkata`), and location, atomically
            creating your Wedding and `ADMIN` membership.
          </p>
        </div>

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

