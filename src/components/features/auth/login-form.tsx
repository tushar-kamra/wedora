"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";
import { AuthAlertBanner } from "./auth-alert-banner";
import { PasswordInput } from "./password-input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner(null);

    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      nextErrors.password = "Password is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await loginApi({
        email: trimmedEmail,
        password,
      });

      const targetRoute = result.data.hasWedding ? "/app" : "/create-wedding";
      router.push(targetRoute);
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof ApiClientError) {
        if (error.details) {
          setFieldErrors({
            email: error.details.email,
            password: error.details.password,
          });
        }
        setBanner({
          variant: "error",
          message: error.message,
        });
        return;
      }

      setBanner({
        variant: "error",
        message: "Unable to sign in right now. Please try again.",
      });
    }
  }

  const emailInputClass = fieldErrors.email
    ? "w-full h-11 px-3.5 bg-secondary-container/20 border border-secondary rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none ring-1 ring-secondary/30 disabled:opacity-60"
    : "w-full h-11 px-3.5 bg-surface border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none focus:border-primary-container focus:bg-surface-container-lowest disabled:opacity-60";

  return (
    <div className="mx-auto my-auto flex w-full max-w-md flex-col">
      {/* Header Branding & Typography */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-container px-2.5 py-1 font-label-caption text-label-caption tracking-wider text-secondary uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
          WEDDING WORKSPACE
        </div>
        <h1 className="mb-2 font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
          Welcome back.
        </h1>
        <p className="font-body-md text-body-md font-light text-on-surface-variant">
          Sign in to your wedding space and pick up where you left off.
        </p>
      </div>

      {banner ? (
        <AuthAlertBanner variant={banner.variant} message={banner.message} />
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
      >
        {/* Email Address Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="email"
              className="font-label-md text-label-md font-medium text-primary"
            >
              Email Address
            </label>
            {fieldErrors.email ? (
              <span
                id="email-error"
                className="font-label-caption text-label-caption text-secondary transition-all"
              >
                {fieldErrors.email}
              </span>
            ) : null}
          </div>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={emailInputClass}
            />
          </div>
        </div>

        {/* Password Field */}
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          disabled={isSubmitting}
          error={fieldErrors.password}
          forgotPasswordHref="/forgot-password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
        />

        {/* Primary Sign In Button */}
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
              <span>Signing in...</span>
            </span>
          ) : (
            <span>Sign In to Space</span>
          )}
        </button>

        {/* Sign Up Helper */}
        <div className="pt-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have a Wedora account?{" "}
            <Link
              href="/signup"
              className="ml-0.5 font-label-md text-label-md font-medium text-primary transition-colors hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
