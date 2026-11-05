"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthAlertBanner } from "./auth-alert-banner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError(undefined);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  const emailInputClass = emailError
    ? "w-full h-11 px-3.5 bg-secondary-container/20 border border-secondary rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none ring-1 ring-secondary/30 disabled:opacity-60"
    : "w-full h-11 px-3.5 bg-surface border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none focus:border-primary-container focus:bg-surface-container-lowest disabled:opacity-60";

  return (
    <div className="mx-auto my-auto flex w-full max-w-md flex-col">
      {/* Header Branding & Typography */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-container px-2.5 py-1 font-label-caption text-label-caption tracking-wider text-secondary uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
          ACCOUNT RECOVERY
        </div>
        <h1 className="mb-2 font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
          Reset your password.
        </h1>
        <p className="font-body-md text-body-md font-light text-on-surface-variant">
          Enter the email address associated with your Wedora account and
          we&apos;ll send you a secure password reset link.
        </p>
      </div>

      {submitted ? (
        <AuthAlertBanner
          variant="success"
          icon="mark_email_read"
          message="If an account exists for that email address, we've sent instructions to reset your password."
        />
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="forgot-email"
              className="font-label-md text-label-md font-medium text-primary"
            >
              Email Address
            </label>
            {emailError ? (
              <span
                id="forgot-email-error"
                className="font-label-caption text-label-caption text-secondary transition-all"
              >
                {emailError}
              </span>
            ) : null}
          </div>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "forgot-email-error" : undefined}
            className={emailInputClass}
          />
        </div>

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
              <span>Sending reset link...</span>
            </span>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>

        <div className="pt-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Remember your password?{" "}
            <Link
              href="/login"
              className="ml-0.5 font-label-md text-label-md font-medium text-primary transition-colors hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

