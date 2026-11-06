import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalAuth } from "@/server/auth/session";
import { CreateWeddingForm } from "@/components/features/wedding/create-wedding-form";

export const metadata: Metadata = {
  title: "Create Your Wedding Workspace | Wedora",
  description:
    "Set up your Wedora wedding workspace, primary celebration date, and venue details.",
};

export default async function CreateWeddingPage() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (auth.wedding) {
    redirect("/app");
  }

  return (
    <CreateWeddingForm
      userName={auth.user.name}
      userEmail={auth.user.email}
    />
  );
}
