"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/features/auth/sign-out-button";
import { AuthAlertBanner } from "@/components/features/auth/auth-alert-banner";
import { createWeddingApi } from "@/lib/api/wedding";
import { ApiClientError } from "@/lib/api/client";

export interface CreateWeddingFormProps {
  userName: string;
  userEmail: string;
}

const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4:00)" },
  { value: "Europe/London", label: "Europe/London (GMT+0:00)" },
  { value: "America/New_York", label: "America/New York (GMT-5:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8:00)" },
];

function sanitizeSlugSegment(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "W";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function CreateWeddingForm({
  userName,
}: CreateWeddingFormProps) {
  const router = useRouter();

  const [brideName, setBrideName] = useState("Princi");
  const [groomName, setGroomName] = useState("Akshay");
  const [title, setTitle] = useState("Akshay & Princi's Wedding");
  const [weddingDate, setWeddingDate] = useState("2027-02-14");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [formattedAddress, setFormattedAddress] = useState(
    "Dehradun, Uttarakhand, India"
  );
  const [city, setCity] = useState("Dehradun");
  const [stateRegion, setStateRegion] = useState("Uttarakhand");
  const [country, setCountry] = useState("India");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "We're so excited to celebrate our wedding with our closest family and friends amidst the hills."
  );

  const [fieldErrors, setFieldErrors] = useState<{
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
  }>({});
  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const previewData = useMemo(() => {
    const cleanBride = brideName.trim() || "Partner 1";
    const cleanGroom = groomName.trim() || "Partner 2";
    const coupleHeadline = `${cleanBride} & ${cleanGroom}`;

    let formattedDate = "14 February 2027";
    let datePartSlug = "14022027";

    if (weddingDate && /^\d{4}-\d{2}-\d{2}$/.test(weddingDate)) {
      const parsed = new Date(`${weddingDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        formattedDate = parsed.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const [yyyy, mm, dd] = weddingDate.split("-");
        datePartSlug = `${dd}${mm}${yyyy}`;
      }
    }

    const cleanCity = city.trim();
    const cleanState = stateRegion.trim();
    const locationText =
      cleanCity && cleanState
        ? `${cleanCity}, ${cleanState} · ${timeZone}`
        : formattedAddress.trim()
          ? `${formattedAddress.trim()} · ${timeZone}`
          : `Location Pending · ${timeZone}`;

    const brideSlug = sanitizeSlugSegment(cleanBride) || "bride";
    const groomSlug = sanitizeSlugSegment(cleanGroom) || "groom";
    const slug = `${groomSlug}-${brideSlug}-${datePartSlug}`;

    return {
      coupleHeadline,
      formattedDate,
      locationText,
      slug,
      portalUrl: `wedora.in/w/${slug}`,
    };
  }, [brideName, groomName, weddingDate, city, stateRegion, formattedAddress, timeZone]);

  async function handleCopySlug() {
    try {
      await navigator.clipboard.writeText(previewData.portalUrl);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 1800);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner(null);

    const nextErrors: {
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
    } = {};

    if (!brideName.trim()) {
      nextErrors.brideName = "Bride's name is required";
    }
    if (!groomName.trim()) {
      nextErrors.groomName = "Groom's name is required";
    }
    if (!weddingDate || !/^\d{4}-\d{2}-\d{2}$/.test(weddingDate)) {
      nextErrors.weddingDate = "Please select a valid wedding date";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await createWeddingApi({
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        title: title.trim() || `${brideName.trim()} & ${groomName.trim()}`,
        description: welcomeMessage.trim() || null,
        weddingDate,
        timeZone,
        location: {
          formattedAddress: formattedAddress.trim() || null,
          city: city.trim() || null,
          state: stateRegion.trim() || null,
          country: country.trim() || null,
        },
      });

      setBanner({
        variant: "success",
        message: `Wedding workspace created! Redirecting to ${response.data.brideName} & ${response.data.groomName}'s dashboard...`,
      });

      router.push("/app");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.code === "ALREADY_HAS_WEDDING") {
          router.push("/app");
          router.refresh();
          return;
        }
        if (error.details) {
          setFieldErrors({
            brideName: error.details.brideName,
            groomName: error.details.groomName,
            weddingDate: error.details.weddingDate,
          });
        }
        setBanner({
          variant: "error",
          message: error.message,
        });
      } else {
        setBanner({
          variant: "error",
          message: "Unable to create wedding workspace right now. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const getInputClass = (hasError?: boolean) =>
    hasError
      ? "w-full h-[42px] px-3.5 bg-secondary-container/20 border border-secondary rounded text-body-md font-body-md text-on-surface focus:outline-none ring-1 ring-secondary/30 transition-all"
      : "w-full h-[42px] px-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all";

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant/50 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-tablet lg:px-margin">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary italic select-none">
              Wedora
            </span>
            <span className="font-body-sm text-body-sm text-outline-variant select-none">
              ·
            </span>
            <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase select-none">
              Wedding Workspace Setup
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden items-center gap-space-sm sm:flex">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Signed in as{" "}
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  {userName}
                </span>
              </span>
              <div className="flex h-7 items-center justify-center rounded-full border border-outline-variant/40 bg-secondary-container px-2.5 font-label-caption text-label-caption font-medium text-on-secondary-container">
                {getUserInitials(userName)}
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Split Grid */}
      <main className="w-full bg-surface pt-16">
        <div className="mx-auto w-full max-w-[1280px] px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
          <div className="grid grid-cols-12 items-start gap-gutter">
            {/* Left 7 Columns: Setup Form Card */}
            <div className="col-span-12 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm sm:p-8 lg:col-span-7">
              {/* Eyebrow Pill */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-fixed/50 px-3 py-1 font-label-caption text-label-caption tracking-wider text-on-secondary-fixed-variant uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Step 1 of 1 · Workspace Foundation
              </div>

              {/* Headline & Subtitle */}
              <h1 className="mb-2 font-headline-lg text-headline-lg tracking-tight text-primary">
                Create your wedding space.
              </h1>
              <p className="mb-8 max-w-xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Set the foundational details for your celebration. You&apos;ll
                become the Wedding Admin and can invite family members and
                collaborators next.
              </p>

              {banner ? (
                <AuthAlertBanner
                  variant={banner.variant}
                  message={banner.message}
                />
              ) : null}

              {/* Form Body */}
              <form
                id="workspace-form"
                noValidate
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Couple Names Row */}
                <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="bride-name"
                        className="font-label-md text-label-md font-semibold text-on-surface"
                      >
                        Partner 1 (Bride)
                      </label>
                      <span className="font-label-caption text-label-caption font-medium text-secondary">
                        {fieldErrors.brideName ?? "Required"}
                      </span>
                    </div>
                    <input
                      id="bride-name"
                      name="brideName"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Princi"
                      value={brideName}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setBrideName(e.target.value);
                        if (fieldErrors.brideName) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            brideName: undefined,
                          }));
                        }
                      }}
                      className={getInputClass(Boolean(fieldErrors.brideName))}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="groom-name"
                        className="font-label-md text-label-md font-semibold text-on-surface"
                      >
                        Partner 2 (Groom)
                      </label>
                      <span className="font-label-caption text-label-caption font-medium text-secondary">
                        {fieldErrors.groomName ?? "Required"}
                      </span>
                    </div>
                    <input
                      id="groom-name"
                      name="groomName"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Akshay"
                      value={groomName}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setGroomName(e.target.value);
                        if (fieldErrors.groomName) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            groomName: undefined,
                          }));
                        }
                      }}
                      className={getInputClass(Boolean(fieldErrors.groomName))}
                    />
                  </div>
                </div>

                {/* Wedding Workspace Title */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="wedding-title"
                      className="font-label-md text-label-md font-semibold text-on-surface"
                    >
                      Wedding Workspace Title
                    </label>
                    <span className="font-label-caption text-label-caption font-medium text-outline">
                      Optional
                    </span>
                  </div>
                  <input
                    id="wedding-title"
                    name="title"
                    type="text"
                    placeholder="e.g. Akshay & Princi's Wedding"
                    value={title}
                    disabled={isSubmitting}
                    onChange={(e) => setTitle(e.target.value)}
                    className={getInputClass(false)}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 font-label-caption text-label-caption text-outline">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>
                    <span>
                      Auto-generates your public wedding website slug:
                    </span>
                    <code
                      id="slug-inline"
                      className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[11px] text-primary"
                    >
                      {previewData.slug}
                    </code>
                  </div>
                </div>

                {/* Date & Timezone Row */}
                <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="wedding-date"
                        className="font-label-md text-label-md font-semibold text-on-surface"
                      >
                        Primary Wedding Date
                      </label>
                      {fieldErrors.weddingDate ? (
                        <span className="font-label-caption text-label-caption font-medium text-secondary">
                          {fieldErrors.weddingDate}
                        </span>
                      ) : null}
                    </div>
                    <input
                      id="wedding-date"
                      name="weddingDate"
                      type="date"
                      value={weddingDate}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setWeddingDate(e.target.value);
                        if (fieldErrors.weddingDate) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            weddingDate: undefined,
                          }));
                        }
                      }}
                      className={getInputClass(
                        Boolean(fieldErrors.weddingDate)
                      )}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="timezone-select"
                      className="mb-1.5 block font-label-md text-label-md font-semibold text-on-surface"
                    >
                      Primary Timezone
                    </label>
                    <div className="relative">
                      <select
                        id="timezone-select"
                        name="timeZone"
                        value={timeZone}
                        disabled={isSubmitting}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="h-[42px] w-full cursor-pointer appearance-none rounded border border-outline-variant/60 bg-surface-container-lowest pr-9 pl-3.5 font-body-md text-body-md text-on-surface transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                      >
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Sub-row */}
                <div>
                  <label
                    htmlFor="venue-search"
                    className="mb-1.5 block font-label-md text-label-md font-semibold text-on-surface"
                  >
                    Primary Destination / Main Venue
                  </label>
                  <div className="relative mb-3">
                    <span className="material-symbols-outlined absolute top-1/2 left-3.5 -translate-y-1/2 text-[18px] text-outline">
                      location_on
                    </span>
                    <input
                      id="venue-search"
                      name="formattedAddress"
                      type="text"
                      placeholder="Search city, resort, or heritage venue..."
                      value={formattedAddress}
                      disabled={isSubmitting}
                      onChange={(e) => setFormattedAddress(e.target.value)}
                      className="h-[42px] w-full rounded border border-outline-variant/60 bg-surface-container-lowest pr-3.5 pl-10 font-body-md text-body-md text-on-surface transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                    />
                  </div>

                  {/* Detailed Breakup (City / State / Country) */}
                  <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="city-input"
                        className="mb-1 block font-label-caption text-label-caption text-on-surface-variant"
                      >
                        City
                      </label>
                      <input
                        id="city-input"
                        name="city"
                        type="text"
                        value={city}
                        disabled={isSubmitting}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-[38px] w-full rounded border border-outline-variant/40 bg-surface-container-low px-3 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state-input"
                        className="mb-1 block font-label-caption text-label-caption text-on-surface-variant"
                      >
                        State / Region
                      </label>
                      <input
                        id="state-input"
                        name="state"
                        type="text"
                        value={stateRegion}
                        disabled={isSubmitting}
                        onChange={(e) => setStateRegion(e.target.value)}
                        className="h-[38px] w-full rounded border border-outline-variant/40 bg-surface-container-low px-3 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country-input"
                        className="mb-1 block font-label-caption text-label-caption text-on-surface-variant"
                      >
                        Country
                      </label>
                      <input
                        id="country-input"
                        name="country"
                        type="text"
                        value={country}
                        disabled={isSubmitting}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-[38px] w-full rounded border border-outline-variant/40 bg-surface-container-low px-3 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Welcome Note / Description */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="welcome-note"
                      className="font-label-md text-label-md font-semibold text-on-surface"
                    >
                      Welcome Message for Guests
                    </label>
                    <span className="font-label-caption text-label-caption font-medium text-outline">
                      Optional
                    </span>
                  </div>
                  <textarea
                    id="welcome-note"
                    name="description"
                    rows={3}
                    placeholder="A brief greeting that appears on your wedding website and guest invitations..."
                    value={welcomeMessage}
                    disabled={isSubmitting}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full resize-none rounded border border-outline-variant/60 bg-surface-container-lowest p-3 font-body-md text-body-md leading-relaxed text-on-surface transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                  />
                </div>

                {/* Primary Submit Section */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container font-label-lg text-label-lg text-surface-container-lowest shadow-sm transition-all duration-150 hover:bg-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span>
                      {isSubmitting
                        ? "Creating Wedding Workspace..."
                        : "Create Wedding Workspace"}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                  <div className="mt-3.5 flex items-center justify-center gap-2 font-label-caption text-label-caption text-on-surface-variant/80">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      verified_user
                    </span>
                    <span>
                      Private wedding workspace · Atomically assigns you as
                      Wedding Admin
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right 5 Columns: Live Workspace Preview Card */}
            <div className="col-span-12 lg:col-span-5">
              <div className="sticky top-20 space-y-4">
                {/* Main Preview Surface Card */}
                <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-6 shadow-sm md:p-7">
                  {/* Live Preview Bar */}
                  <div className="mb-5 flex items-center justify-between border-b border-outline-variant/30 pb-5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                      </span>
                      <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                        Workspace Blueprint Preview
                      </span>
                    </div>
                    <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-caption text-[10px] font-semibold text-primary">
                      Live Sync
                    </span>
                  </div>

                  {/* Couple Visual Anchor */}
                  <div className="relative mb-6 flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-lg border border-outline-variant/30 bg-gradient-to-br from-primary-container via-primary to-[#211827] p-5 shadow-sm select-none">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(#ffffff 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-surface-container-lowest/20 bg-surface-container-lowest/15 px-2.5 py-1 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed" />
                        <span className="font-label-caption text-label-caption font-medium tracking-wider text-surface-bright uppercase">
                          Workspace Initialized
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-surface-bright/30" />
                        <div className="h-2 w-2 rounded-full bg-surface-bright/30" />
                        <div className="h-2 w-2 rounded-full bg-surface-bright/30" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-1 font-label-caption text-label-caption font-medium tracking-wider text-primary-fixed-dim uppercase">
                        Wedding Workspace
                      </div>
                      <div
                        id="preview-couple-title"
                        className="font-headline-md text-headline-md tracking-tight text-surface-bright"
                      >
                        {previewData.coupleHeadline}
                      </div>
                    </div>
                  </div>

                  {/* Key Metadata Modules */}
                  <div className="mb-6 space-y-3">
                    {/* Countdown & Date */}
                    <div className="flex items-center gap-3 rounded-lg bg-surface-container-lowest p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-container">
                        <span className="material-symbols-outlined text-[20px] text-secondary">
                          calendar_today
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-label-caption text-label-caption font-semibold text-outline uppercase">
                          Timeline Horizon
                        </div>
                        <div
                          id="preview-date-text"
                          className="truncate font-label-md text-label-md font-semibold text-on-surface"
                        >
                          {previewData.formattedDate} · Main Auspicious Day
                        </div>
                      </div>
                    </div>

                    {/* Location Pill Tile */}
                    <div className="flex items-center gap-3 rounded-lg bg-surface-container-lowest p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-container">
                        <span className="material-symbols-outlined text-[20px] text-secondary">
                          pin_drop
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-label-caption text-label-caption font-semibold text-outline uppercase">
                          Location &amp; Zone
                        </div>
                        <div
                          id="preview-location-text"
                          className="truncate font-label-md text-label-md font-semibold text-on-surface"
                        >
                          {previewData.locationText}
                        </div>
                      </div>
                    </div>

                    {/* Dedicated URL Slug Link Box */}
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest p-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-outline">
                          public
                        </span>
                        <div className="min-w-0">
                          <span className="block font-label-caption text-label-caption text-outline">
                            Portal URL
                          </span>
                          <span
                            id="preview-slug"
                            className="block truncate font-mono text-body-sm font-semibold text-primary"
                          >
                            {previewData.portalUrl}
                          </span>
                        </div>
                      </div>
                      <button
                        id="copy-slug-btn"
                        type="button"
                        onClick={handleCopySlug}
                        title="Copy link"
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-outline transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {copiedSlug ? "done" : "content_copy"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Instant Access Perks Module (V1 Aligned) */}
                  <div className="border-t border-outline-variant/30 pt-5">
                    <div className="mb-3 font-label-caption text-label-caption font-semibold tracking-wider text-outline uppercase">
                      Included in Your Setup
                    </div>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-body-sm text-on-surface">
                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-secondary">
                          check_circle
                        </span>
                        <span>
                          <strong>Multi-event itinerary builder</strong> (Roka,
                          Mehendi, Haldi, Sangeet, Wedding, Reception)
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 text-body-sm text-on-surface">
                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-secondary">
                          check_circle
                        </span>
                        <span>
                          <strong>Family role manager</strong> with Admin and
                          Manager workspace permissions
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 text-body-sm text-on-surface">
                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-secondary">
                          check_circle
                        </span>
                        <span>
                          <strong>Interactive guest list</strong> with
                          event-specific invitations and passwordless RSVPs
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 text-body-sm text-on-surface">
                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-secondary">
                          check_circle
                        </span>
                        <span>
                          <strong>Expense &amp; vendor tracker in ₹</strong>{" "}
                          plus QR photo gallery and themed wedding website
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Editorial Helper Strip */}
                <div className="flex items-center gap-3 rounded-lg bg-surface-container-high/60 px-4 py-3">
                  <span className="material-symbols-outlined shrink-0 text-[20px] text-secondary">
                    shield
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    You can invite your partner, parents, and siblings to
                    collaborate right after workspace initialization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

