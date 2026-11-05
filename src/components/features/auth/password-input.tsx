"use client";

import { useState, type InputHTMLAttributes } from "react";
import Link from "next/link";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  error?: string;
  forgotPasswordHref?: string;
  hint?: string;
}

export function PasswordInput({
  id,
  label,
  error,
  forgotPasswordHref,
  hint,
  ...inputProps
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const inputClassName = error
    ? "w-full h-11 pl-3.5 pr-11 bg-secondary-container/20 border border-secondary rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none ring-1 ring-secondary/30 disabled:opacity-60"
    : "w-full h-11 pl-3.5 pr-11 bg-surface border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md placeholder:text-outline transition-all outline-none focus:border-primary-container focus:bg-surface-container-lowest disabled:opacity-60";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-label-md text-label-md font-medium text-primary"
        >
          {label}
        </label>
        {forgotPasswordHref ? (
          <Link
            href={forgotPasswordHref}
            className="font-label-md text-label-md text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        ) : null}
      </div>

      <div className="relative flex items-center">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={inputClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 flex cursor-pointer items-center justify-center p-1 text-on-surface-variant transition-colors hover:text-primary focus:outline-none"
        >
          <span className="material-symbols-outlined text-[18px] text-outline transition-colors hover:text-primary">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {error ? (
        <span
          id={`${id}-error`}
          className="font-label-caption text-label-caption text-secondary transition-all"
        >
          {error}
        </span>
      ) : hint ? (
        <span
          id={`${id}-hint`}
          className="font-label-caption text-label-caption text-on-surface-variant"
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

