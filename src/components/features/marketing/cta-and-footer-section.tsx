import Link from "next/link";

export function CtaAndFooterSection() {
  return (
    <>
      {/* FINAL CALL TO ACTION: Plum Accent Card */}
      <section className="mx-auto w-full max-w-[1280px] px-margin-mobile pb-space-3xl md:px-margin-tablet lg:px-margin">
        <div className="relative flex flex-col items-center gap-space-lg overflow-hidden rounded-3xl bg-primary-container p-space-2xl text-center text-on-primary shadow-xl md:p-space-3xl">
          {/* Subtle Decorative Atmospheric Circles */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-tertiary-container/30 blur-3xl" />

          <div className="z-10 flex max-w-2xl flex-col gap-space-sm">
            <span className="font-label-md text-label-md tracking-wider text-secondary-container uppercase">
              Begin in Minutes
            </span>
            <h2 className="font-display-hero text-headline-xl tracking-tight text-surface md:text-display-hero">
              Let’s bring it all together.
            </h2>
            <p className="font-body-xl text-body-xl leading-relaxed text-primary-fixed">
              Your wedding deserves a space as thoughtful as the celebration
              itself.
            </p>
          </div>

          <div className="z-10 flex flex-col items-center gap-space-md pt-space-sm sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-xl font-label-lg text-label-lg text-primary shadow-md transition-colors hover:bg-surface-container"
            >
              Get Started with Wedora
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <p className="z-10 font-body-sm text-body-sm text-primary-fixed/80">
            Built for Indian weddings • Invite your family members in minutes
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(73,55,71,0.03)]">
        <div className="mx-auto max-w-[1280px] px-margin-mobile py-space-3xl md:px-margin-tablet lg:px-margin">
          <div className="grid grid-cols-1 gap-space-2xl pb-space-2xl md:grid-cols-4">
            <div className="flex flex-col gap-space-sm md:col-span-1">
              <span className="font-headline-md text-headline-md tracking-tight text-primary">
                Wedora
              </span>
              <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                The operating system for collaborative Indian weddings.
                Multi-event schedules, effortless guest RSVPs, vendor discovery,
                expense tracking, and private QR photo galleries.
              </p>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                Product
              </span>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Multi-Event Timelines
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Guest Invitations &amp; RSVP
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Expenses &amp; Vendor Discovery
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    QR Gallery &amp; Wedding Website
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                Workspace
              </span>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                <li>
                  <a
                    href="#about"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    The Wedora Standard
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Create Wedding Workspace
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                Privacy &amp; Trust
              </span>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                <li>
                  <a
                    href="#about"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Private Wedding Workspaces
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Token-Protected Invitations
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Private Photo Galleries
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Role-Based Member Access
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-space-sm pt-space-lg font-label-caption text-label-caption text-on-surface-variant md:flex-row">
            <p>© 2026 Wedora Technologies Inc. All rights reserved.</p>
            <p className="tracking-normal">
              Designed for modern Indian celebrations across Udaipur, Dehradun,
              Mumbai, and beyond.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

