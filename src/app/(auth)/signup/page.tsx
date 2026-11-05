import type { Metadata } from "next";
import { SignupForm } from "@/components/features/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account — Wedora",
  description:
    "Create your Wedora account to start planning your wedding or join your family's wedding workspace.",
};

export default function SignupPage() {
  return <SignupForm />;
}

