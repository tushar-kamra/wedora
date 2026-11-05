const BENEFITS = [
  {
    icon: "event_note",
    title: "All plans in one place",
    description:
      "Centralized multi-event schedules from Roka and Mehendi to Sangeet, Wedding, and Reception, with venues, timings, and dress codes in one command center.",
    tag: "Master Itinerary • Multi-Event",
  },
  {
    icon: "groups",
    title: "People, working together",
    description:
      "Invite bride, groom, parents, siblings, and trusted family members as Admins or Managers. Replace scattered WhatsApp groups and Excel sheets.",
    tag: "Admin & Manager Collaboration",
  },
  {
    icon: "account_tree",
    title: "Every detail organized",
    description:
      "Assign wedding tasks to family members, track wedding expenses in INR across categories, maintain booked vendors, and discover local vendors nearby.",
    tag: "Tasks • Vendors • Expenses",
  },
  {
    icon: "photo_library",
    title: "Memories, kept together",
    description:
      "Share a wedding QR code so guests can view and upload photos directly to event-organized albums without creating an account or installing an app.",
    tag: "Private Gallery • QR Uploads",
  },
] as const;

export function ValuePropositionSection() {
  return (
    <section
      id="about"
      className="w-full bg-surface-container-low py-space-3xl"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-space-2xl px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex max-w-2xl flex-col gap-space-sm">
          <span className="font-label-md text-label-md tracking-wider text-secondary uppercase">
            The Wedora Standard
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
            A lot goes into one beautiful celebration.
          </h2>
          <p className="font-body-xl text-body-xl leading-relaxed text-on-surface-variant">
            Multiple events, endless details, family coordination, guests,
            vendors and memories. Wedora gives everything a place, so everyone
            stays on the same page.
          </p>
        </div>

        {/* 4-Column Benefit Grid */}
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-space-md flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary-container">
                  <span className="material-symbols-outlined">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="mb-space-xs font-headline-sm text-headline-sm text-primary">
                  {benefit.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {benefit.description}
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm font-label-caption text-label-caption text-secondary">
                {benefit.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

