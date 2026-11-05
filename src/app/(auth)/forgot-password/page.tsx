import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — Wedora",
  description: "Request a password reset link for your Wedora account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

