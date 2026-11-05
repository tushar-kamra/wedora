import type { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — Wedora",
  description: "Sign in to your Wedora wedding workspace.",
};

export default function LoginPage() {
  return <LoginForm />;
}

