import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/features/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — Wedora",
  description: "Set a new password for your Wedora account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto my-auto w-full max-w-md font-body-sm text-body-sm text-on-surface-variant">
          Loading password reset form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

