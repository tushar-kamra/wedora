"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordApi } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";
import { AuthAlertBanner } from "./auth-alert-banner";
import { PasswordInput } from "./password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner(null);

    if (!token) {
      setBanner({
        variant: "error",
        message:
          "Missing or invalid password reset token. Please request a new reset link.",
      });
      return;
    }

    const nextErrors: { password?: string; confirmPassword?: string } = {};
    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await resetPasswordApi({
        token,
        password,
      });

      setIsSubmitting(false);
      setPassword("");
      setConfirmPassword("");
      setBanner({
        variant: "success",
        message:
          "Your password has been updated. Redirecting you to sign in...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof ApiClientError) {
        if (error.details?.password) {
          setFieldErrors({ password: error.details.password });
        }
        setBanner({
          variant: "error",
          message: error.message,
        });
        return;
      }

      setBanner({
        variant: "error",
        message: "Unable to reset password right now. Please try again.",
      });
    }
  }

  return (
    <div className="mx-auto my-auto flex w-full max-w-md flex-col">
      {/* Header Branding & Typography */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-container px-2.5 py-1 font-label-caption text-label-caption tracking-wider text-secondary uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
          SECURITY CREDENTIALS
        </div>
        <h1 className="mb-2 font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
          Set a new password.
        </h1>
        <p className="font-body-md text-body-md font-light text-on-surface-variant">
          Choose a strong password for your Wedora wedding workspace account.
        </p>
      </div>

      {!token && !banner ? (
        <AuthAlertBanner
          variant="error"
          message="No reset token detected in the URL. Open the link from your password reset email or request a new link."
        />
      ) : null}

      {banner ? (
        <AuthAlertBanner variant={banner.variant} message={banner.message} />
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
      >
        <PasswordInput
          id="new-password"
          name="password"
          label="New Password"
          autoComplete="new-password"
          placeholder="Enter new password"
          hint="At least 8 characters"
          value={password}
          disabled={isSubmitting}
          error={fieldErrors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
        />

        <PasswordInput
          id="confirm-password"
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          disabled={isSubmitting}
          error={fieldErrors.confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword) {
              setFieldErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
            }
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded bg-primary-container font-label-lg text-label-lg text-on-primary shadow-sm transition-all duration-200 hover:bg-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin text-on-primary"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
              <span>Updating password...</span>
            </span>
          ) : (
            <span>Update Password</span>
          )}
        </button>

        <div className="pt-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Need a fresh link?{" "}
            <Link
              href="/forgot-password"
              className="ml-0.5 font-label-md text-label-md font-medium text-primary transition-colors hover:underline"
            >
              Request password reset
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
