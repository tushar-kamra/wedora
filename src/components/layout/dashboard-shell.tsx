"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutApi } from "@/lib/api/auth";
import type { MemberRole } from "@/modules/members/membership.model";

export interface DashboardShellProps {
  userName: string;
  userEmail: string;
  role: MemberRole;
  coupleTitle: string;
  weddingDateLabel: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/app", icon: "grid_view", exact: true },
  { label: "Events", href: "/app/events", icon: "event_available" },
  { label: "Tasks", href: "/app/tasks", icon: "check_box" },
  { label: "Guests & RSVPs", href: "/app/guests", icon: "group" },
  { label: "Expenses", href: "/app/expenses", icon: "payments" },
  { label: "Vendors", href: "/app/vendors", icon: "storefront" },
  { label: "Wedding Website", href: "/app/website", icon: "language" },
  { label: "Photo Gallery & QR", href: "/app/gallery", icon: "photo_camera" },
  { label: "Livestream", href: "/app/livestream", icon: "videocam" },
  {
    label: "Members",
    href: "/app/members",
    icon: "person_add",
    dividerBefore: true,
  },
  { label: "Wedding Settings", href: "/app/settings", icon: "tune" },
];

export function DashboardShell({
  userName,
  userEmail,
  role,
  coupleTitle,
  weddingDateLabel,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logoutApi();
    } catch {
      // Redirect even if session already expired
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function isNavActive(item: NavItem): boolean {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="flex min-h-0 flex-col">
        {/* Brand & Active Wedding Switcher Card */}
        <div className="px-space-lg pt-space-lg pb-space-md">
          <div className="mb-space-md flex items-center justify-between">
            <Link
              href="/app"
              className="flex items-center gap-space-xs"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <span className="font-headline-md text-headline-md font-medium tracking-tight text-primary">
                Wedora
              </span>
              <span className="mb-1 h-1.5 w-1.5 rounded-full bg-secondary" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container lg:hidden"
              aria-label="Close navigation sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          <Link
            href="/app"
            onClick={() => setMobileSidebarOpen(false)}
            className="group flex w-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-space-sm text-left transition-colors hover:border-secondary"
          >
            <div className=" flex min-w-0 flex-col pr-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="truncate font-label-md text-label-md font-semibold text-on-surface">
                  {coupleTitle}
                </span>
                <span className="shrink-0 rounded bg-secondary-container px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-wider text-on-secondary-container uppercase">
                  {role}
                </span>
              </div>
              <span className="mt-0.5 truncate font-label-caption text-label-caption text-on-surface-variant">
                {weddingDateLabel}
              </span>
            </div>
            <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant group-hover:text-primary">
              unfold_more
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-space-sm pb-space-sm">
          <nav className="space-y-0.5" aria-label="Workspace navigation">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item);
              return (
                <div key={item.href}>
                  {item.dividerBefore ? (
                    <div className="my-space-xs border-t border-outline-variant/60 pt-space-xs" />
                  ) : null}
                  <Link
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "flex items-center gap-3 rounded-lg bg-primary px-3 py-2 font-body-sm text-body-sm font-medium text-on-primary shadow-sm transition-all"
                        : "flex items-center gap-3 rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile & Sign Out */}
      <div className="border-t border-outline-variant bg-surface-container-low p-space-sm">
        <div className="flex items-center justify-between rounded-xl p-space-xs transition-colors hover:bg-surface-container">
          <div className="flex min-w-0 items-center gap-space-sm pr-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                person
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-label-md text-label-md leading-tight font-semibold text-on-surface">
                {userName}
              </span>
              <span className="mt-0.5 truncate font-label-caption text-label-caption leading-tight text-on-surface-variant">
                {userEmail}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-full w-[260px] border-r border-outline-variant bg-surface-container-low lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-primary/30 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-[260px] border-r border-outline-variant bg-surface-container-low shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      {/* Main Content Wrapper */}
      <div className="lg:pl-[260px]">
        {/* Fixed Top Header Bar */}
        <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/40 bg-surface/85 px-6 backdrop-blur-xl lg:left-[260px] lg:justify-end lg:px-8">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation sidebar"
            className="inline-flex items-center gap-2 rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface lg:hidden"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
            <span className="font-headline-sm text-base font-medium text-primary">
              Wedora
            </span>
          </button>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <Link
                href="/create-wedding"
                title="Wedding Setup Blueprint"
                className="hidden items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-caption text-label-caption text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary sm:inline-flex"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  auto_awesome
                </span>
                <span>{coupleTitle} Workspace</span>
              </Link>
              <Link
                href="/app/members"
                title="Manage Wedding Members"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  group
                </span>
              </Link>
            </div>
            <div className="h-4 w-px bg-outline-variant" />
            <div className="flex items-center gap-space-xs">
              <div
                title={`${userName} (${userEmail})`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
              >
                <span className="material-symbols-outlined text-[18px] text-on-primary">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="relative min-h-screen bg-surface pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

