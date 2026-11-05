interface AuthAlertBannerProps {
  variant: "error" | "success";
  message: string;
  icon?: string;
}

export function AuthAlertBanner({
  variant,
  message,
  icon,
}: AuthAlertBannerProps) {
  if (variant === "error") {
    return (
      <div
        role="alert"
        className="mb-5 rounded-lg border border-secondary/30 bg-secondary-container/40 p-3 text-on-secondary-container transition-all duration-200"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined shrink-0 text-[18px] text-secondary">
            {icon ?? "lock_reset"}
          </span>
          <p className="font-body-sm text-body-sm text-secondary">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="mb-5 rounded-lg border border-primary-container/30 bg-surface-container p-3 text-primary transition-all duration-200"
    >
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined shrink-0 text-[18px] text-primary-container">
          {icon ?? "verified"}
        </span>
        <p className="font-body-sm text-body-sm text-primary">{message}</p>
      </div>
    </div>
  );
}

