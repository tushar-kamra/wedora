export function ImpactSection() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-margin-mobile py-space-3xl md:px-margin-tablet lg:px-margin">
      <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
        {/* Left Column: Metrics & Content */}
        <div className="flex flex-col gap-space-xl lg:col-span-6">
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-md text-label-md tracking-wider text-secondary uppercase">
              Peace of Mind
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
              More time for the moments that matter.
            </h2>
            <p className="font-body-xl text-body-xl leading-relaxed text-on-surface-variant">
              Wedding planning involves so many people and so many little
              details. Wedora helps bring everything together, so you can spend
              less time coordinating and more time enjoying the journey.
            </p>
          </div>

          {/* 3 Metrics Grid */}
          <div className="grid grid-cols-3 gap-space-md pt-space-xs">
            <div className="flex flex-col">
              <span className="font-headline-xl text-headline-xl-mobile font-medium tracking-tight text-primary tabular-nums md:text-headline-xl">
                48 hrs
              </span>
              <span className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Planning time saved per week
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-xl text-headline-xl-mobile font-medium tracking-tight text-primary tabular-nums md:text-headline-xl">
                100%
              </span>
              <span className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Zero WhatsApp group confusion
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-xl text-headline-xl-mobile font-medium tracking-tight text-primary tabular-nums md:text-headline-xl">
                ₹17.4L
              </span>
              <span className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Expenses tracked with clarity
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Testimonial Card */}
        <div className="lg:col-span-6">
          <div className="flex flex-col gap-space-xl rounded-2xl bg-surface-container-lowest p-space-xl shadow-xl md:p-space-2xl">
            <div className="flex items-center gap-space-xs text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                format_quote
              </span>
              <span className="font-label-caption text-label-caption tracking-widest uppercase">
                Verified Wedding Workspace
              </span>
            </div>
            <blockquote className="font-headline-lg text-headline-md leading-relaxed font-normal italic text-primary md:text-headline-lg">
              “Wedora made our 3-day celebration feel calm, organized, and truly
              joyful for both our families. Everyone knew their tasks, RSVPs
              updated effortlessly, and all our guest photos landed in one
              private gallery.”
            </blockquote>
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-md">
              <div>
                <p className="font-label-lg text-label-lg text-primary">
                  Meera &amp; Rohan Singhania
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  The Oberoi Udaivilas • 480 Guests
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high font-headline-sm text-primary">
                M&amp;R
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

