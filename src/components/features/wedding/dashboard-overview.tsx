"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { WeddingDashboardDTO } from "@/modules/wedding/wedding.types";

export interface DashboardOverviewProps {
  coupleTitle: string;
  weddingDate: string;
  dashboard?: WeddingDashboardDTO;
}

function formatInrFromPaise(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

function formatLongDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface DashboardTaskItem {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  eventTitle: string;
  eventBadgeClass: string;
  dueLabel: string;
  urgent?: boolean;
  assigneeInitials: string;
  assigneeName: string;
  assigneeAvatarClass: string;
  completed: boolean;
}

const INITIAL_UPCOMING_TASKS: DashboardTaskItem[] = [
  {
    id: "task-1",
    title: "Finalize Sangeet choreo playlist",
    priority: "HIGH",
    eventTitle: "Sangeet",
    eventBadgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    dueLabel: "Tomorrow (10 Feb)",
    urgent: true,
    assigneeInitials: "AS",
    assigneeName: "Akshay S.",
    assigneeAvatarClass: "bg-primary-container text-on-primary",
    completed: false,
  },
  {
    id: "task-2",
    title: "Confirm Mehendi artist seating & lighting",
    priority: "HIGH",
    eventTitle: "Mehendi",
    eventBadgeClass: "bg-secondary-container text-on-secondary-container",
    dueLabel: "Due 11 Feb",
    assigneeInitials: "RK",
    assigneeName: "Rahul K.",
    assigneeAvatarClass: "bg-secondary text-on-secondary",
    completed: false,
  },
  {
    id: "task-3",
    title: "Coordinate guest welcome hampers with venue",
    priority: "MEDIUM",
    eventTitle: "Reception",
    eventBadgeClass: "bg-surface-container text-on-surface-variant",
    dueLabel: "Due 11 Feb",
    assigneeInitials: "PK",
    assigneeName: "Princi K.",
    assigneeAvatarClass: "bg-primary-container text-on-primary",
    completed: false,
  },
  {
    id: "task-4",
    title: "Safa and stole distribution dry run",
    priority: "MEDIUM",
    eventTitle: "Wedding",
    eventBadgeClass: "bg-primary-fixed text-on-primary-fixed",
    dueLabel: "Due 12 Feb",
    assigneeInitials: "VM",
    assigneeName: "Vikram M.",
    assigneeAvatarClass:
      "bg-secondary-container text-on-secondary-container",
    completed: false,
  },
];

const UPCOMING_EVENTS = [
  {
    id: "evt-1",
    month: "FEB",
    day: "12",
    title: "Mehendi Sundowner",
    tag: "Mehendi",
    tagClass: "bg-primary-fixed text-on-primary-fixed",
    timeLabel: "4:00 PM onwards",
    venueLabel: "Courtyard Lawn, Leela Palace",
    dressCode: "Pastels & Florals",
    confirmedGuests: 140,
  },
  {
    id: "evt-2",
    month: "FEB",
    day: "13",
    title: "Sangeet Extravaganza",
    tag: "Sangeet",
    tagClass: "bg-secondary-fixed text-on-secondary-fixed",
    timeLabel: "7:30 PM onwards",
    venueLabel: "Grand Ballroom",
    dressCode: "Glamour & Sparkle",
    confirmedGuests: 180,
  },
  {
    id: "evt-3",
    month: "FEB",
    day: "14",
    title: "Wedding & Pheras",
    tag: "Wedding",
    tagClass: "bg-primary text-on-primary",
    timeLabel: "8:00 PM Mahurat",
    venueLabel: "Main Mandap & Royal Courtyard",
    dressCode: "Traditional Royal",
    confirmedGuests: 186,
  },
];

const EXPENSE_CATEGORIES = [
  {
    category: "Venue",
    amountLabel: "₹4,80,000",
    sharePercent: 39,
    barClass: "bg-primary-container",
  },
  {
    category: "Decor & Floral Design",
    amountLabel: "₹2,80,000",
    sharePercent: 22,
    barClass: "bg-secondary",
  },
  {
    category: "Catering",
    amountLabel: "₹2,70,000",
    sharePercent: 22,
    barClass: "bg-primary-fixed-dim",
  },
  {
    category: "Photography & Video",
    amountLabel: "₹1,50,000",
    sharePercent: 12,
    barClass: "bg-secondary-fixed-dim",
  },
  {
    category: "Music & Makeup",
    amountLabel: "₹65,000",
    sharePercent: 5,
    barClass: "bg-tertiary-fixed-dim",
  },
];

export function DashboardOverview({
  coupleTitle,
  weddingDate,
  dashboard,
}: DashboardOverviewProps) {
  const [tasks, setTasks] = useState<DashboardTaskItem[]>(
    INITIAL_UPCOMING_TASKS
  );
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const completedInWidget = tasks.filter((t) => t.completed).length;
  const baseTasksTotal =
    dashboard && dashboard.summary.tasks.total > 0
      ? dashboard.summary.tasks.total
      : 48;
  const baseTasksCompleted =
    dashboard && dashboard.summary.tasks.total > 0
      ? dashboard.summary.tasks.completed
      : 32;

  const totalTasksCount =
    baseTasksTotal + (tasks.length - INITIAL_UPCOMING_TASKS.length);
  const completedTasksCount = Math.min(
    totalTasksCount,
    baseTasksCompleted + completedInWidget
  );
  const pendingTasksCount = Math.max(0, totalTasksCount - completedTasksCount);
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  const displayDaysRemaining = dashboard?.countdown.daysRemaining ?? 101;
  const displayWeddingDateLong = formatLongDate(
    dashboard?.countdown.weddingDate ?? weddingDate
  );
  const displayWeddingDateShort = formatShortDate(
    dashboard?.countdown.weddingDate ?? weddingDate
  );
  const displayCity = dashboard?.wedding.city || "Dehradun";
  const displayEventsCount =
    dashboard && dashboard.summary.events > 0 ? dashboard.summary.events : 6;
  const displayGuestsCount =
    dashboard && dashboard.summary.guests > 0 ? dashboard.summary.guests : 186;
  const displayAttendingCount =
    dashboard && dashboard.summary.guests > 0
      ? dashboard.summary.rsvps.attending
      : 120;
  const displayPendingRsvpCount =
    dashboard && dashboard.summary.guests > 0
      ? dashboard.summary.rsvps.pending
      : 54;
  const displayExpenseFormatted =
    dashboard && dashboard.summary.totalExpensePaise > 0
      ? formatInrFromPaise(dashboard.summary.totalExpensePaise)
      : "₹12,45,000";
  const displayVendorsCount =
    dashboard && dashboard.summary.vendors > 0 ? dashboard.summary.vendors : 8;

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleQuickAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const newItem: DashboardTaskItem = {
      id: `task-${Date.now()}`,
      title: trimmed,
      priority: "MEDIUM",
      eventTitle: "Wedding",
      eventBadgeClass: "bg-primary-fixed text-on-primary-fixed",
      dueLabel: "Due 13 Feb",
      assigneeInitials: "AS",
      assigneeName: "Akshay S.",
      assigneeAvatarClass: "bg-primary-container text-on-primary",
      completed: false,
    };

    setTasks((prev) => [newItem, ...prev]);
    setNewTaskTitle("");
    setShowQuickAddTask(false);
  }

  return (
    <div className="w-full p-6 md:p-8">
      <div className="flex w-full flex-col space-y-space-xl">
        {/* Top Editorial Header & Quick Action Bar */}
        <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-2">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                Wedding Workspace Overview
              </span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span className="font-label-caption text-label-caption font-medium text-on-surface-variant">
                {displayCity} Edition
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-normal tracking-tight text-primary">
              {coupleTitle}&apos;s Wedding
            </h1>
            <div className="flex flex-wrap items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                location_on
              </span>
              <span>{displayCity}</span>
              <span className="text-outline-variant">•</span>
              <span className="material-symbols-outlined text-[16px] text-secondary">
                calendar_today
              </span>
              <span>{displayWeddingDateLong}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-space-sm">
            <Link
              href="/app/members"
              className="group flex h-10 items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 font-label-lg text-label-lg text-on-surface shadow-sm transition-all duration-150 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary transition-colors group-hover:text-primary">
                person_add
              </span>
              <span>Invite Member</span>
            </Link>
            <Link
              href="/app/events"
              className="flex h-10 items-center gap-2 rounded-xl bg-primary-container px-5 font-label-lg text-label-lg text-on-primary shadow-sm transition-all duration-150 hover:bg-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Event</span>
            </Link>
          </div>
        </div>

        {/* Row 1: 6 KPI Metrics Grid (matching GET /api/dashboard) */}
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* 1. Countdown */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                COUNTDOWN
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  hourglass_top
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {displayDaysRemaining} Days
              </div>
              <p className="mt-1 font-label-caption text-label-caption text-on-surface-variant">
                Remaining • {displayWeddingDateShort}
              </p>
            </div>
            <div className="pt-1">
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div
                  className="h-full rounded-full bg-secondary"
                  style={{ width: "72%" }}
                />
              </div>
            </div>
          </div>

          {/* 2. Ceremonies */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                CEREMONIES
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  auto_awesome
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {displayEventsCount} Scheduled
              </div>
              <p className="mt-1 truncate font-label-caption text-label-caption text-on-surface-variant">
                Haldi, Mehendi, Sangeet...
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-label-caption text-label-caption font-medium text-on-surface">
                3 Days celebration span
              </span>
            </div>
          </div>

          {/* 3. Tasks Progress */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                TASKS PROGRESS
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  task_alt
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {completedTasksCount} / {totalTasksCount}
              </div>
              <div className="mt-1 flex items-center justify-between text-on-surface-variant">
                <span className="font-label-caption text-label-caption">
                  {completionPercentage}% Completed
                </span>
                <span className="font-label-caption text-label-caption font-semibold text-secondary">
                  {pendingTasksCount} Left
                </span>
              </div>
            </div>
            <div className="pt-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div
                  className="h-full rounded-full bg-primary-container transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4. Guest RSVPs */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                GUEST RSVPs
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  groups
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {displayGuestsCount} Invited
              </div>
              <p className="mt-1 font-label-caption text-label-caption text-on-surface-variant">
                {displayAttendingCount} Attending • {displayPendingRsvpCount} Pending
              </p>
            </div>
            <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-surface-container-low">
              <div
                className="h-full bg-primary"
                style={{ width: "64.5%" }}
                title={`${displayAttendingCount} Attending`}
              />
              <div
                className="h-full bg-secondary"
                style={{ width: "29%" }}
                title={`${displayPendingRsvpCount} Pending`}
              />
              <div
                className="h-full bg-outline-variant"
                style={{ width: "6.5%" }}
                title="Not Attending"
              />
            </div>
          </div>

          {/* 5. Total Expenses */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                EXPENSES RECORDED
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  receipt_long
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {displayExpenseFormatted}
              </div>
              <p className="mt-1 truncate font-label-caption text-label-caption text-on-surface-variant">
                Across 5 expense categories
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">
                account_balance_wallet
              </span>
              <span className="font-label-caption text-label-caption text-on-surface-variant">
                Linked to events &amp; vendors
              </span>
            </div>
          </div>

          {/* 6. Booked Vendors */}
          <div className="group flex flex-col justify-between space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caption text-label-caption font-semibold tracking-wider text-on-surface-variant uppercase">
                VENDORS BOOKED
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">
                  storefront
                </span>
              </div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-medium tracking-tight text-primary tabular-nums">
                {displayVendorsCount} Active
              </div>
              <p className="mt-1 truncate font-label-caption text-label-caption text-on-surface-variant">
                Venue, Catering, Decor, Photo...
              </p>
            </div>
            <div className="flex items-center gap-1 pt-1 text-on-surface-variant">
              <span className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                {displayCity} &amp; Nearby
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: 2-Column Split Grid (Upcoming Events + Upcoming Tasks) */}
        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          {/* Left Column: Upcoming Ceremonies & Events Card (7 Cols) */}
          <div className="flex flex-col space-y-space-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-7">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md font-normal text-primary">
                  Upcoming Ceremonies &amp; Events
                </h2>
                <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-caption text-label-caption font-semibold text-on-secondary-container">
                  Next 3 Ceremonies
                </span>
              </div>
              <Link
                href="/app/events"
                className="group flex items-center gap-1 font-label-md text-label-md text-primary transition-colors hover:text-secondary hover:underline"
              >
                <span>View All Events</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Events List */}
            <div className="space-y-space-sm">
              {UPCOMING_EVENTS.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between gap-space-md rounded-xl bg-surface p-space-md transition-colors duration-150 hover:bg-surface-container-low md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-space-md">
                    {/* Date Badge */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-surface-container-lowest text-center shadow-sm">
                      <span className="font-label-caption text-label-caption leading-none font-semibold text-secondary uppercase">
                        {evt.month}
                      </span>
                      <span className="mt-1 font-headline-md text-headline-md leading-none font-medium text-primary">
                        {evt.day}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm font-medium text-primary">
                          {evt.title}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${evt.tagClass}`}
                        >
                          {evt.tag}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            schedule
                          </span>
                          <span>{evt.timeLabel}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            location_on
                          </span>
                          <span>{evt.venueLabel}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5 font-label-caption text-label-caption text-on-secondary-container">
                        <span className="material-symbols-outlined text-[14px]">
                          styler
                        </span>
                        <span>Dress code: {evt.dressCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Status Pill */}
                  <div className="flex shrink-0 items-center justify-between gap-2 md:flex-col md:items-end md:justify-center">
                    <span className="flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      <span>{evt.confirmedGuests} Confirmed</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* V1-Aligned Public Website & QR Gallery Strip */}
            <div className="flex flex-col justify-between gap-3 rounded-xl bg-surface-container-low p-space-md sm:flex-row sm:items-center">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-[18px]">
                    language
                  </span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-semibold text-on-surface">
                    Public Wedding Website &amp; Guest Gallery
                  </div>
                  <div className="font-label-caption text-label-caption text-on-surface-variant">
                    wedora.in/w/akshay-princi-14022027 • Classic Editorial Theme
                  </div>
                </div>
              </div>
              <Link
                href="/app/website"
                className="shrink-0 rounded-lg bg-surface-container-lowest px-3 py-1.5 text-center font-label-caption text-label-caption font-semibold text-primary shadow-sm transition-colors hover:bg-surface-container"
              >
                Manage Website
              </Link>
            </div>
          </div>

          {/* Right Column: Upcoming Tasks Card (5 Cols) */}
          <div className="flex flex-col space-y-space-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-5">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md font-normal text-primary">
                  Upcoming Tasks
                </h2>
                <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-caption text-label-caption font-semibold text-on-surface-variant">
                  {pendingTasksCount} Pending
                </span>
              </div>
              <Link
                href="/app/tasks"
                className="group flex items-center gap-1 font-label-md text-label-md text-primary transition-colors hover:text-secondary hover:underline"
              >
                <span>View All Tasks</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Task Items */}
            <div className="space-y-space-sm">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-space-sm rounded-xl bg-surface p-space-md transition-colors duration-150 hover:bg-surface-container-low"
                >
                  <label className="relative mt-0.5 flex cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="peer sr-only"
                      aria-label={`Mark "${task.title}" as completed`}
                    />
                    <div className="flex h-5 w-5 items-center justify-center rounded border border-outline-variant/60 bg-surface-container-lowest text-transparent transition-all peer-checked:border-primary-container peer-checked:bg-primary-container peer-checked:text-on-primary">
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    </div>
                  </label>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`font-body-md text-body-md leading-snug font-medium transition-colors ${
                          task.completed
                            ? "text-outline line-through"
                            : "text-primary"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          task.priority === "HIGH"
                            ? "bg-secondary text-on-secondary"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-label-caption text-label-caption text-on-surface-variant">
                      <span
                        className={`rounded-md px-2 py-0.5 font-semibold ${task.eventBadgeClass}`}
                      >
                        {task.eventTitle}
                      </span>
                      <span>•</span>
                      <span
                        className={`flex items-center gap-1 ${
                          task.urgent ? "font-semibold text-secondary" : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {task.urgent ? "alarm" : "calendar_today"}
                        </span>
                        <span>{task.dueLabel}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${task.assigneeAvatarClass}`}
                      >
                        {task.assigneeInitials}
                      </div>
                      <span className="font-label-caption text-label-caption text-on-surface-variant">
                        {task.assigneeName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Task Shortcut */}
            <div className="pt-space-xs">
              {showQuickAddTask ? (
                <form
                  onSubmit={handleQuickAddTask}
                  className="flex items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface p-2"
                >
                  <input
                    type="text"
                    placeholder="Enter new wedding task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                    className="h-9 flex-1 bg-transparent px-2 font-body-sm text-body-sm text-on-surface outline-none placeholder:text-outline"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-primary-container px-3 py-1.5 font-label-caption text-label-caption font-semibold text-on-primary hover:bg-primary"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickAddTask(false)}
                    className="cursor-pointer rounded-lg px-2 py-1.5 font-label-caption text-label-caption text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQuickAddTask(true)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  <span>Quick Add Next Action</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: V1-Aligned Quick Workspace Modules & Expense Category Summary */}
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          {/* Left 8 Cols: V1 Digital Experience & Sharing Modules */}
          <div className="flex flex-col justify-between space-y-space-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                  GUEST EXPERIENCE &amp; SHARING
                </span>
                <h3 className="mt-0.5 font-headline-md text-headline-md font-normal text-primary">
                  Website, QR Photo Gallery &amp; Livestream
                </h3>
              </div>
              <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-caption text-label-caption font-semibold text-on-surface">
                Token-Protected Sharing
              </span>
            </div>

            <div className="grid grid-cols-1 gap-space-md pt-space-xs sm:grid-cols-3">
              {/* Module 1: Wedding Website */}
              <Link
                href="/app/website"
                className="group flex flex-col justify-between rounded-xl border border-outline-variant/30 bg-surface p-4 transition-all hover:border-secondary hover:bg-surface-container-low"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      language
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-base font-medium text-primary">
                    Wedding Website
                  </h4>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Public celebration timeline &amp; venue map in Classic,
                    Minimal, or Modern theme.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 font-label-md text-label-md text-primary group-hover:underline">
                  <span>Configure Theme</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </span>
              </Link>

              {/* Module 2: Photo Gallery & QR */}
              <Link
                href="/app/gallery"
                className="group flex flex-col justify-between rounded-xl border border-outline-variant/30 bg-surface p-4 transition-all hover:border-secondary hover:bg-surface-container-low"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      qr_code_2
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-base font-medium text-primary">
                    QR Photo Gallery
                  </h4>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Downloadable wedding QR code for event-wise photo albums and
                    guest uploads.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 font-label-md text-label-md text-primary group-hover:underline">
                  <span>Open Gallery &amp; QR</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </span>
              </Link>

              {/* Module 3: YouTube Livestream */}
              <Link
                href="/app/livestream"
                className="group flex flex-col justify-between rounded-xl border border-outline-variant/30 bg-surface p-4 transition-all hover:border-secondary hover:bg-surface-container-low"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      videocam
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-base font-medium text-primary">
                    Ceremony Livestream
                  </h4>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Embed your YouTube livestream URL so remote guests can watch
                    live on your website.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 font-label-md text-label-md text-primary group-hover:underline">
                  <span>Set YouTube Link</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-between gap-space-sm rounded-xl bg-surface p-space-sm font-body-sm text-body-sm text-on-surface-variant sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  mail
                </span>
                <span>
                  186 guests have unique passwordless RSVP invitation links
                  ready to share via Email or WhatsApp.
                </span>
              </div>
              <Link
                href="/app/guests"
                className="shrink-0 font-label-md text-label-md font-semibold text-primary hover:underline"
              >
                Open Guest Roster →
              </Link>
            </div>
          </div>

          {/* Right 4 Cols: V1 Expense Category Summary (INR Only, No Budget Cap) */}
          <div className="flex flex-col justify-between space-y-space-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-label-caption text-label-caption font-semibold tracking-wider text-secondary uppercase">
                  EXPENSE LEDGER (INR)
                </span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-caption text-label-caption font-semibold text-on-surface">
                  5 Categories
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-normal text-primary">
                Spending by Category
              </h3>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Total recorded: <strong className="text-primary">₹12,45,000</strong> across ceremonies and vendors.
              </p>
            </div>

            <div className="space-y-space-sm py-space-xs">
              {EXPENSE_CATEGORIES.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between font-label-caption text-label-caption">
                    <span className="font-medium text-on-surface">
                      {item.category}
                    </span>
                    <span className="font-semibold text-on-surface-variant tabular-nums">
                      {item.amountLabel} ({item.sharePercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                    <div
                      className={`h-full rounded-full ${item.barClass}`}
                      style={{ width: `${item.sharePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/app/expenses"
              className="w-full rounded-xl bg-surface-container py-2.5 text-center font-label-md text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-high"
            >
              View Expense Tracker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

