import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="product"
      className="mx-auto w-full max-w-[1280px] px-margin-mobile pt-space-xl pb-space-3xl md:px-margin-tablet lg:px-margin"
    >
      <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
        {/* Left Column: Editorial Copy */}
        <div className="flex flex-col items-start gap-space-lg lg:col-span-5">
          <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container px-3 py-1 font-label-caption text-label-caption tracking-wider text-on-surface-variant uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
            The Wedding Planning Space
          </div>

          <div className="flex flex-col gap-space-sm">
            <h1 className="font-display-hero text-display-hero-mobile leading-[1.08] tracking-tight text-primary md:text-display-hero">
              Everything coming together.{" "}
              <span className="font-normal italic text-secondary">
                Beautifully.
              </span>
            </h1>
            <p className="max-w-xl font-body-xl text-body-xl leading-relaxed text-on-surface-variant">
              From the first celebration to the final photograph, bring your
              wedding plans, people and details together in one beautifully
              organized place.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-space-md pt-space-xs sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-xl font-label-lg text-label-lg text-on-primary shadow-sm transition-opacity hover:opacity-95"
            >
              Start Planning
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-surface-container-lowest px-space-lg font-label-lg text-label-lg text-on-surface shadow-sm transition-colors hover:bg-surface-container"
            >
              Explore Wedora
            </a>
          </div>

          <p className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant/80">
            <span className="material-symbols-outlined text-[16px] text-primary">
              verified
            </span>
            Made for couples and the families who make it all happen.
          </p>
        </div>

        {/* Right Column: Rich SaaS Interface Mockup */}
        <div className="w-full lg:col-span-7">
          <div className="flex w-full flex-col gap-space-md overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-xl">
            {/* Window Header / Chrome */}
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-space-md py-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary-fixed-dim" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary-fixed-dim" />
                <span className="h-2.5 w-2.5 rounded-full bg-surface-variant" />
                <span className="ml-2 font-label-caption text-label-caption text-on-surface-variant">
                  wedora.com / app / akshay-princi
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-label-caption text-label-caption text-primary">
                  Shared Workspace
                </span>
                <span className="h-2 w-2 rounded-full bg-secondary" />
              </div>
            </div>

            {/* Top Meta Row */}
            <div className="grid grid-cols-1 gap-space-sm md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md">
                <span className="font-label-caption text-label-caption tracking-wider text-on-surface-variant uppercase">
                  Wedding Location
                </span>
                <span className="mt-1 font-headline-sm text-headline-sm text-primary">
                  The Leela Palace
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Udaipur, Rajasthan
                </span>
              </div>

              <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md">
                <span className="font-label-caption text-label-caption tracking-wider text-on-surface-variant uppercase">
                  Wedding Countdown
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary tabular-nums">
                    42 Days
                  </span>
                  <span className="font-label-caption text-label-caption text-on-surface-variant">
                    to go
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  14 February 2027
                </span>
              </div>

              <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md">
                <span className="font-label-caption text-label-caption tracking-wider text-on-surface-variant uppercase">
                  RSVP Responses
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary tabular-nums">
                    132 / 186
                  </span>
                  <span className="font-label-caption text-label-caption text-on-surface-variant">
                    Responded
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                  <div className="h-full w-[71%] rounded-full bg-primary-container" />
                </div>
              </div>
            </div>

            {/* Middle Split: Timeline & Coordination Matrix */}
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-12">
              {/* Event Timeline Preview */}
              <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md md:col-span-7">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md tracking-wider text-primary uppercase">
                    Upcoming Wedding Events
                  </span>
                  <span className="font-label-caption text-label-caption text-secondary">
                    6 Events Planned
                  </span>
                </div>

                {/* Item 1 */}
                <div className="flex items-start justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                      <span className="material-symbols-outlined text-[18px]">
                        wb_twilight
                      </span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-primary">
                        Mehendi Sundowner
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Poolside Promenade • Green / Traditional
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-primary tabular-nums">
                      04:30 PM
                    </span>
                    <span className="block font-label-caption text-label-caption text-secondary">
                      12 Feb
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
                      <span className="material-symbols-outlined text-[18px]">
                        nightlife
                      </span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-primary">
                        Sangeet Night
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Grand Mewar Ballroom • Indo-Western Glamour
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-primary tabular-nums">
                      07:30 PM
                    </span>
                    <span className="block font-label-caption text-label-caption text-secondary">
                      13 Feb
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        bedtime
                      </span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-primary">
                        Wedding &amp; Phere
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Courtyard Mandap • Royal Heritage Attire
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-primary tabular-nums">
                      08:00 PM
                    </span>
                    <span className="block font-label-caption text-label-caption text-secondary">
                      14 Feb
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordination & Live Signal */}
              <div className="flex flex-col gap-space-sm md:col-span-5">
                {/* Workspace Members & RSVP Card */}
                <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md">
                  <span className="font-label-md text-label-md text-primary">
                    Wedding Workspace
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-primary-container px-2.5 py-1 font-label-caption text-label-caption text-on-primary">
                      Admins (2)
                    </span>
                    <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-caption text-label-caption text-on-surface">
                      Managers (8)
                    </span>
                    <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-label-caption text-label-caption text-on-surface-variant">
                      Vendors (8)
                    </span>
                  </div>
                  <div className="mt-space-xs flex justify-between pt-space-xs font-label-caption text-label-caption text-on-surface-variant tabular-nums">
                    <span>120 Attending</span>
                    <span>54 Pending</span>
                    <span>287 Guests</span>
                  </div>
                </div>

                {/* Task Action Banner */}
                <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-md">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md text-primary">
                      Finalize photographer package
                    </p>
                    <p className="font-label-caption text-label-caption text-on-surface-variant">
                      Completed • 32 of 48 tasks done
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

