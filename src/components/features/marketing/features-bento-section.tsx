export function FeaturesBentoSection() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-[1280px] px-margin-mobile py-space-3xl md:px-margin-tablet lg:px-margin"
    >
      <div className="flex flex-col gap-space-2xl">
        <div className="flex max-w-2xl flex-col gap-space-xs">
          <span className="font-label-md text-label-md tracking-wider text-secondary uppercase">
            Architecture for Grand Occasions
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
            One wedding. Every moving piece. One space.
          </h2>
          <p className="font-body-xl text-body-xl text-on-surface-variant">
            Purpose-built architecture designed for the multi-day flow of
            contemporary Indian celebrations.
          </p>
        </div>

        {/* 3 Columns x 2 Rows */}
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Multi-Day Sub-Events */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_view_day
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Timeline Architecture
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Plan Every Celebration
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Create and manage Roka, Engagement, Mehendi, Haldi, Sangeet,
                Cocktail, Wedding, Reception, or custom ceremonies with venues
                and dress codes.
              </p>
            </div>
            {/* Feature Widget 1 */}
            <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md">
              <div className="flex items-center justify-between font-label-caption text-label-caption text-on-surface-variant">
                <span>Sequence View</span>
                <span>3 of 6 Events</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded-md bg-surface-container-lowest px-2.5 py-1 font-label-md text-label-md text-primary shadow-xs">
                  Haldi • 10:00 AM
                </span>
                <span className="rounded-md bg-surface-container-lowest px-2.5 py-1 font-label-md text-label-md text-primary shadow-xs">
                  Sangeet • 07:30 PM
                </span>
                <span className="rounded-md bg-primary-container px-2.5 py-1 font-label-md text-label-md text-on-primary">
                  Wedding • 08:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Feature 2: Task Responsibilities */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    checklist_rtl
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Execution Grid
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Stay on Top of Everything
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Create wedding tasks, assign them to Wedding Members, link tasks
                to specific events, and filter by priority, status, or assignee.
              </p>
            </div>
            {/* Feature Widget 2 */}
            <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-space-md">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-2 font-body-sm text-body-sm text-primary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    check_circle
                  </span>
                  <span>Finalize photographer package</span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Akshay S.
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-2 font-body-sm text-body-sm text-primary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    radio_button_unchecked
                  </span>
                  <span>Confirm Sangeet sound setup</span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Rahul K.
                </span>
              </div>
            </div>
          </div>

          {/* Feature 3: Roles & Permissions */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    admin_panel_settings
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Family Collaboration
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Bring Everyone Together
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Invite parents, siblings, and close relatives by email into one
                shared wedding workspace with clear Admin and Manager roles.
              </p>
            </div>
            {/* Feature Widget 3 */}
            <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md">
              <div className="flex items-center justify-between pb-1 font-body-sm text-body-sm text-primary">
                <span className="font-label-md text-label-md">
                  Wedding Admins
                </span>
                <span className="font-label-caption text-label-caption text-secondary">
                  Full Workspace &amp; Member Control
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 font-body-sm text-body-sm text-primary">
                <span className="font-label-md text-label-md">
                  Family Managers
                </span>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Events, Tasks, Guests &amp; Vendors
                </span>
              </div>
            </div>
          </div>

          {/* Feature 4: Guest Management, Invitations & RSVP */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    mail
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Invitations &amp; RSVP
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Make Guest Management Easier
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Select which events each guest is invited to, share unique
                invitation links via Email or WhatsApp, and collect RSVPs
                without guest logins.
              </p>
            </div>
            {/* Feature Widget 4 */}
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-md">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tabular-nums">
                  287 Attending
                </span>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Across 186 Invitations
                </span>
              </div>
              <div className="flex gap-2">
                <span className="rounded bg-surface-container-lowest px-2 py-1 font-label-caption text-label-caption text-primary shadow-xs tabular-nums">
                  Confirmed: 120
                </span>
                <span className="rounded bg-surface-container-lowest px-2 py-1 font-label-caption text-label-caption text-primary shadow-xs tabular-nums">
                  Pending: 54
                </span>
              </div>
            </div>
          </div>

          {/* Feature 5: Expense Tracker & Vendors */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    account_balance_wallet
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Expenses &amp; Vendors
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Keep Track of Spending
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Record wedding expenses in INR across categories, link spending
                to events and booked vendors, and discover local vendors near
                your venue.
              </p>
            </div>
            {/* Feature Widget 5 */}
            <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container-low p-space-md">
              <div className="flex justify-between font-label-caption text-label-caption tabular-nums">
                <span className="text-on-surface-variant">
                  Total Wedding Expense
                </span>
                <span className="font-medium text-primary">₹17,42,500</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                <div className="h-full w-[68%] rounded-full bg-primary-container" />
              </div>
              <div className="flex justify-between font-label-caption text-label-caption text-secondary tabular-nums">
                <span>Venue: ₹6,00,000</span>
                <span>Catering: ₹4,20,000</span>
              </div>
            </div>
          </div>

          {/* Feature 6: QR Photo Gallery, Website & Livestream */}
          <div className="flex flex-col justify-between gap-space-lg rounded-2xl bg-surface-container-lowest p-space-xl shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    qr_code_scanner
                  </span>
                </div>
                <span className="font-label-caption text-label-caption text-on-surface-variant">
                  Gallery, Website &amp; Live
                </span>
              </div>
              <h3 className="mb-space-xs font-headline-md text-headline-md text-primary">
                Preserve Every Memory
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Generate a wedding QR code so guests can view and upload photos
                by ceremony, publish a themed wedding website, and embed your
                YouTube livestream.
              </p>
            </div>
            {/* Feature Widget 6 */}
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-md">
              <div className="flex items-center gap-space-sm">
                <svg
                  className="h-10 w-10 shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4 4h4v2h-4v-2zm2-4h2v2h-2v-2z" />
                </svg>
                <div>
                  <span className="block font-label-md text-label-md text-primary tabular-nums">
                    1,240 photos uploaded
                  </span>
                  <span className="font-label-caption text-label-caption text-on-surface-variant">
                    Grouped by wedding event
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary">
                cloud_done
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

