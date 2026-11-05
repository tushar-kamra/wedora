const STEPS = [
  {
    number: "01",
    title: "Create Your Wedding Space",
    description:
      "Enter the bride and groom names, wedding date, and celebration location to launch your dedicated wedding workspace in minutes.",
    icon: "domain",
    footer: "Takes under 3 minutes",
  },
  {
    number: "02",
    title: "Bring Your People In",
    description:
      "Invite parents, siblings, and close family members as Admins or Managers, and share event-specific invitation links with guests via Email or WhatsApp.",
    icon: "send",
    footer: "Email & WhatsApp sharing",
  },
  {
    number: "03",
    title: "Plan, Celebrate & Remember",
    description:
      "Coordinate tasks, vendors, expenses, and RSVPs leading up to the wedding, publish your themed website and livestream, and collect guest photos via QR.",
    icon: "celebration",
    footer: "From Roka to Reception",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-surface-container-low py-space-3xl"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex max-w-xl flex-col gap-space-xs text-center">
          <span className="font-label-md text-label-md tracking-wider text-secondary uppercase">
            Effortless Setup
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
            Getting started is beautifully simple.
          </h2>
          <p className="font-body-xl text-body-xl text-on-surface-variant">
            Set up in minutes and invite your circle when you&apos;re ready.
          </p>
        </div>

        {/* 3 Horizontal Step Cards */}
        <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm"
            >
              <div>
                <span className="mb-space-sm block font-display-hero text-headline-xl font-light text-primary/30 select-none">
                  {step.number}
                </span>
                <h3 className="mb-space-xs font-headline-sm text-headline-sm text-primary">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
              <div className="mt-space-xl flex items-center gap-2 pt-space-md font-label-caption text-label-caption text-secondary">
                <span className="material-symbols-outlined text-[16px]">
                  {step.icon}
                </span>
                {step.footer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

