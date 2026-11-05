"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupApi } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";
import { AuthAlertBanner } from "./auth-alert-banner";
import { PasswordInput } from "./password-input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
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

    const nextErrors: { name?: string; email?: string; password?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.name = "Full name is required (at least 2 characters)";
    } else if (trimmedName.length > 120) {
      nextErrors.name = "Name must be at most 120 characters";
    }

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await signupApi({
        name: trimmedName,
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
            name: error.details.name,
            email: error.details.email,
            password: error.details.password,
          });
        } else if (error.code === "EMAIL_ALREADY_EXISTS") {
          setFieldErrors({
            email: error.message,
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
        message: "Unable to create your account right now. Please try again.",
      });
    }
  }

  const getInputClass = (hasError: boolean) =>
    hasError
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
          Begin your celebration.
        </h1>
        <p className="font-body-md text-body-md font-light text-on-surface-variant">
          Create your account to set up a new wedding workspace or accept a
          family invitation.
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
        {/* Full Name Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="font-label-md text-label-md font-medium text-primary"
            >
              Full Name
            </label>
            {fieldErrors.name ? (
              <span
                id="name-error"
                className="font-label-caption text-label-caption text-secondary transition-all"
              >
                {fieldErrors.name}
              </span>
            ) : null}
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g., Akshay Saini"
            value={name}
            disabled={isSubmitting}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) {
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={getInputClass(Boolean(fieldErrors.name))}
          />
        </div>

        {/* Email Address Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="signup-email"
              className="font-label-md text-label-md font-medium text-primary"
            >
              Email Address
            </label>
            {fieldErrors.email ? (
              <span
                id="signup-email-error"
                className="font-label-caption text-label-caption text-secondary transition-all"
              >
                {fieldErrors.email}
              </span>
            ) : null}
          </div>
          <input
            id="signup-email"
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
            aria-describedby={
              fieldErrors.email ? "signup-email-error" : undefined
            }
            className={getInputClass(Boolean(fieldErrors.email))}
          />
        </div>

        {/* Password Field */}
        <PasswordInput
          id="signup-password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a strong password"
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

        {/* Primary Sign Up Button */}
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
              <span>Creating account...</span>
            </span>
          ) : (
            <span>Create Wedding Account</span>
          )}
        </button>

        {/* Sign In Helper */}
        <div className="pt-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already have a Wedora account?{" "}
            <Link
              href="/login"
              className="ml-0.5 font-label-md text-label-md font-medium text-primary transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
