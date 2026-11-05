export function AuthEditorialPanel() {
  return (
    <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low p-8 shadow-sm sm:p-12 lg:w-[55%] lg:p-14">
      {/* Ambient Background Gradients */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary-fixed/20 blur-3xl" />

      {/* Header Statement: Editorial Branding */}
      <div className="relative z-10 mb-8 max-w-xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-secondary" />
          <span className="font-label-caption text-label-caption font-semibold tracking-widest text-secondary uppercase">
            Multi-Day Master Itinerary
          </span>
        </div>
        <h2 className="mb-3 font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
          Every detail, coming together.
        </h2>
        <p className="font-body-xl text-body-xl leading-relaxed font-light text-on-surface-variant">
          One shared space for your plans, your people and every moment that
          matters.
        </p>
      </div>

      {/* SaaS Visual Workspace Composition */}
      <div className="relative z-10 my-auto flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest/90 p-3 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="font-mono font-label-md text-label-md text-primary">
              wedora.com/app/akshay-princi
            </span>
          </div>
          <span className="font-label-caption text-label-caption font-medium text-secondary">
            Synced
          </span>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          {/* Celebration Countdown Card */}
          <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-5 shadow-xs">
            <div>
              <div className="mb-3 flex items-center justify-between font-label-caption text-label-caption text-on-surface-variant">
                <span className="tracking-wider uppercase">
                  Celebration Countdown
                </span>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  calendar_today
                </span>
              </div>
              <div className="mb-1 font-headline-lg text-headline-lg font-light text-primary tabular-nums">
                42 Days
              </div>
              <div className="font-body-sm text-body-sm text-secondary">
                The Leela Palace • Udaipur
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded bg-surface-container-low/50 p-2.5 pt-4">
              <span className="font-label-caption text-label-caption text-on-surface-variant">
                12 Feb – 14 Feb 2027
              </span>
              <span className="font-label-caption text-label-caption font-medium text-primary">
                6 Gatherings
              </span>
            </div>
          </div>

          {/* Guest RSVP Response Card */}
          <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-5 shadow-xs">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-label-caption text-label-caption tracking-wider text-secondary uppercase">
                  Guest RSVP Response
                </span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-caption text-label-caption font-medium text-primary tabular-nums">
                  287 Attending
                </span>
              </div>
              <div className="my-3">
                <div className="mb-1.5 flex justify-between font-label-caption text-label-caption text-on-surface-variant tabular-nums">
                  <span>120 Confirmed</span>
                  <span>54 Pending</span>
                </div>
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full bg-primary-container"
                    style={{ width: "70%" }}
                  />
                  <div
                    className="h-full bg-secondary"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 font-body-sm text-body-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
                Wedding Admins
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Family Managers
              </span>
            </div>
          </div>
        </div>

        {/* Key Itinerary Moments Card */}
        <div className="rounded-lg bg-surface-container-lowest p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                event_note
              </span>
              <span className="font-label-md text-label-md font-semibold text-primary">
                Key Itinerary Moments
              </span>
            </div>
            <span className="font-label-caption text-label-caption text-on-surface-variant">
              3 Featured Events
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded bg-surface-container-low p-2.5">
              <div className="mb-0.5 font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                Day 01 • Sundowner
              </div>
              <div className="font-headline-sm text-[15px] text-primary">
                Mehendi Celebration
              </div>
            </div>
            <div className="rounded bg-surface-container-low p-2.5">
              <div className="mb-0.5 font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                Day 02 • Evening
              </div>
              <div className="font-headline-sm text-[15px] text-primary">
                Sangeet Gala
              </div>
            </div>
            <div className="rounded bg-surface-container-low p-2.5">
              <div className="mb-0.5 font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                Day 03 • Auspicious
              </div>
              <div className="font-headline-sm text-[15px] text-primary">
                Pheras &amp; Union
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Architectural Footer Caption */}
      <div className="relative z-10 mt-4 flex items-center justify-between pt-6 font-label-caption text-label-caption text-on-surface-variant">
        <span>Private Multi-Event Wedding Workspace</span>
        <span>Wedora © 2026</span>
      </div>
    </div>
  );
}

