"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutApi } from "@/lib/api/auth";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logoutApi();
    } catch {
      // Even if session was already invalidated, redirect to /login
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-outline-variant/50 bg-surface px-4 font-label-md text-label-md font-medium text-primary transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}

