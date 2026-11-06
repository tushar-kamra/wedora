'use client';

import { type FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  inviteMemberApi,
  removeMemberApi,
  revokeInvitationApi,
  updateMemberRoleApi,
} from '@/lib/api/members';
import { ApiClientError } from '@/lib/api/client';
import type {
  MemberInvitationDTO,
  WeddingMemberDTO,
} from '@/modules/members/members.types';
import type { MemberRole } from '@/modules/members/membership.model';

export interface ActiveMemberItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  initials: string;
  subtitle: string;
  role: MemberRole;
  isPrimaryOwner?: boolean;
  joinedDate: string;
  lastActive: string;
  isOnline?: boolean;
  avatarVariant: 'primary' | 'primary-container' | 'surface-highest' | 'secondary';
}

export interface PendingInvitationItem {
  id: string;
  email: string;
  relationshipNote: string;
  role: MemberRole;
  invitedByName: string;
  invitedByRole: string;
  expiresRelative: string;
  expiresDate: string;
  status: 'PENDING' | 'REVOKED' | 'ACCEPTED';
  acceptUrl?: string;
}

const AVATAR_VARIANTS: ActiveMemberItem['avatarVariant'][] = [
  'primary',
  'primary-container',
  'surface-highest',
  'secondary',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'W';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

function formatShortDate(isoStr: string): string {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatExpiresRelative(isoStr: string): string {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return 'In 7 days';
  const diffDays = Math.max(
    1,
    Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  return `In ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}

function mapDtoToMemberItem(
  dto: WeddingMemberDTO,
  index: number
): ActiveMemberItem {
  return {
    id: dto.membershipId,
    userId: dto.user.id,
    name: dto.user.name,
    email: dto.user.email,
    initials: getInitials(dto.user.name),
    subtitle: dto.isPrimaryCreator
      ? 'Primary Workspace Owner'
      : dto.role === 'ADMIN'
        ? 'Workspace Admin'
        : 'Family Collaborator • Manager',
    role: dto.role,
    isPrimaryOwner: dto.isPrimaryCreator,
    joinedDate: formatShortDate(dto.joinedAt),
    lastActive: index === 0 ? 'Just now' : 'Active member',
    isOnline: index === 0,
    avatarVariant: AVATAR_VARIANTS[index % AVATAR_VARIANTS.length]!,
  };
}

function mapDtoToInvitationItem(dto: MemberInvitationDTO): PendingInvitationItem {
  return {
    id: dto.id,
    email: dto.email,
    relationshipNote:
      dto.role === 'ADMIN' ? 'Invited Co-Admin' : 'Family Collaborator',
    role: dto.role,
    invitedByName: dto.invitedBy.name,
    invitedByRole: 'Admin',
    expiresRelative: formatExpiresRelative(dto.expiresAt),
    expiresDate: formatShortDate(dto.expiresAt),
    status: dto.status,
    acceptUrl: dto.acceptUrl,
  };
}

function getAvatarClasses(variant: ActiveMemberItem['avatarVariant']) {
  switch (variant) {
    case 'primary':
      return 'bg-primary text-on-primary';
    case 'primary-container':
      return 'bg-primary-container text-on-primary';
    case 'secondary':
      return 'bg-secondary text-on-secondary';
    case 'surface-highest':
    default:
      return 'bg-surface-container-highest text-on-surface';
  }
}

export interface MembersManagementViewProps {
  initialMembers?: WeddingMemberDTO[];
  initialInvitations?: MemberInvitationDTO[];
  currentUserRole?: MemberRole;
  coupleTitle?: string;
}

export function MembersManagementView({
  initialMembers = [],
  initialInvitations = [],
  currentUserRole = 'ADMIN',
  coupleTitle = 'Princi & Akshay',
}: MembersManagementViewProps) {
  const [members, setMembers] = useState<ActiveMemberItem[]>(() =>
    initialMembers.map((m, i) => mapDtoToMemberItem(m, i))
  );
  const [invitations, setInvitations] = useState<PendingInvitationItem[]>(() =>
    initialInvitations.map((inv) => mapDtoToInvitationItem(inv))
  );

  const isAdmin = currentUserRole === 'ADMIN';

  // Filter & Search State
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('MANAGER');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const adminCount = useMemo(
    () => members.filter((m) => m.role === 'ADMIN').length,
    [members]
  );
  const managerCount = useMemo(
    () => members.filter((m) => m.role === 'MANAGER').length,
    [members]
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.subtitle.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [members, roleFilter, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteError(null);

    const normalizedEmail = inviteEmail.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    setIsInviting(true);
    try {
      const response = await inviteMemberApi({
        email: normalizedEmail,
        role: inviteRole,
      });

      const createdItem = mapDtoToInvitationItem(response.data);
      setInvitations((prev) => [createdItem, ...prev]);
      setInviteEmail('');
      showToast(
        `Invitation link sent to ${response.data.email} (${response.data.role}) with a 7-day magic token.`
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setInviteError(error.message);
      } else {
        setInviteError('Failed to send invitation. Please try again.');
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId: string, nextRole: MemberRole) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    if (target.role === 'ADMIN' && nextRole === 'MANAGER' && adminCount <= 1) {
      showToast('Cannot demote the last Admin. At least one Admin is required.');
      return;
    }

    try {
      const response = await updateMemberRoleApi(memberId, { role: nextRole });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, role: response.data.role } : m
        )
      );
      showToast(`Updated ${target.name}'s role to ${response.data.role}.`);
    } catch (error) {
      if (error instanceof ApiClientError) {
        showToast(error.message);
      } else {
        showToast('Unable to update member role right now.');
      }
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    if (target.role === 'ADMIN' && adminCount <= 1) {
      showToast('Cannot remove the last Admin of the wedding workspace.');
      return;
    }

    try {
      await removeMemberApi(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast(`Removed ${target.name} from the wedding workspace.`);
    } catch (error) {
      if (error instanceof ApiClientError) {
        showToast(error.message);
      } else {
        showToast('Unable to remove member right now.');
      }
    }
  };

  const handleRevokeInvitation = async (inviteId: string) => {
    const target = invitations.find((i) => i.id === inviteId);
    try {
      await revokeInvitationApi(inviteId);
      setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
      if (target) {
        showToast(`Revoked pending invitation for ${target.email}.`);
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        showToast(error.message);
      } else {
        showToast('Unable to revoke invitation right now.');
      }
    }
  };

  const handleCopyInviteLink = async (invite: PendingInvitationItem) => {
    const url =
      invite.acceptUrl ??
      `${window.location.origin}/member-invitations/${invite.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback if clipboard blocked
    }
    setCopiedInviteId(invite.id);
    showToast(`Copied invitation link for ${invite.email}.`);
    setTimeout(() => {
      setCopiedInviteId((prev) => (prev === invite.id ? null : prev));
    }, 2500);
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-10 px-6 py-8 lg:px-12 lg:py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl bg-primary p-4 text-on-primary shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-secondary-container">
              mark_email_read
            </span>
            <span className="text-body-md text-surface-container-lowest">
              {toastMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-on-primary-container hover:text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* 1. Editorial Page Header */}
      <div className="flex flex-col justify-between gap-6 pb-2 lg:flex-row lg:items-end">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container/40 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-label-caption font-semibold uppercase tracking-wider text-secondary">
              Family &amp; Collaborators
            </span>
          </div>
          <h1 className="font-headline text-headline-xl font-normal tracking-tight text-primary">
            Wedding Members
          </h1>
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            Invite parents, siblings, and close relatives to plan together. Admins manage
            members and workspace settings; Managers collaborate across events, tasks,
            guests, expenses, and vendors.
          </p>
        </div>

        {/* Right Meta Status Badge */}
        <div className="flex shrink-0 items-center gap-4 self-start rounded-xl bg-surface-container-lowest p-3 px-4 shadow-xs lg:self-auto">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-label-caption font-bold shadow-xs ${getAvatarClasses(
                  member.avatarVariant
                )}`}
              >
                {member.initials}
              </div>
            ))}
          </div>
          <div className="h-6 w-px bg-surface-container-high" />
          <div className="flex flex-col">
            <span className="text-label-md font-semibold text-primary">
              {members.length} Active {members.length === 1 ? 'Member' : 'Members'}
            </span>
            <span className="text-label-caption font-medium text-secondary">
              {invitations.length} Pending{' '}
              {invitations.length === 1 ? 'Invitation' : 'Invitations'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Invite Member Card */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-xs lg:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
              </div>
              <div>
                <h2 className="font-headline text-headline-md font-medium tracking-tight text-primary">
                  Invite New Member or Planner
                </h2>
                <p className="mt-0.5 text-body-sm text-on-surface-variant">
                  Invitations are sent via email with a secure 7-day magic onboarding link.
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 text-label-caption text-on-surface-variant sm:flex">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                verified_user
              </span>
              <span>Role-Based Access Control</span>
            </div>
          </div>

          <form
            onSubmit={handleInviteSubmit}
            noValidate
            className="grid grid-cols-1 items-center gap-4 md:grid-cols-12"
          >
            {/* Email Input */}
            <div className="relative md:col-span-6">
              <label htmlFor="inviteEmailInput" className="sr-only">
                Email address
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[19px]">mail</span>
              </div>
              <input
                id="inviteEmailInput"
                type="email"
                value={inviteEmail}
                disabled={!isAdmin || isInviting}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (inviteError) setInviteError(null);
                }}
                placeholder="e.g., rahul.kapoor@example.com"
                required
                className="h-11 w-full rounded-xl bg-surface-container-low pl-10 pr-4 text-body-md text-on-surface transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>

            {/* Role Selector Dropdown */}
            <div className="relative md:col-span-4">
              <label htmlFor="inviteRoleSelect" className="sr-only">
                Workspace Role
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[19px]">badge</span>
              </div>
              <select
                id="inviteRoleSelect"
                value={inviteRole}
                disabled={!isAdmin || isInviting}
                onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl bg-surface-container-low pl-10 pr-8 text-label-md text-on-surface transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              >
                <option value="MANAGER">
                  MANAGER — Manage events, tasks, guests, vendors
                </option>
                <option value="ADMIN">
                  ADMIN — Full workspace &amp; member governance
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!isAdmin || isInviting}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-label-lg text-on-primary shadow-xs transition-colors hover:bg-primary-container disabled:opacity-60"
              >
                <span>{isInviting ? 'Sending...' : 'Invite'}</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          {inviteError && (
            <p role="alert" className="text-body-sm font-medium text-error">
              {inviteError}
            </p>
          )}

          {/* Reassurance Footer Note */}
          <div className="flex items-center gap-2 pt-1 text-label-caption text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline">
              lock
            </span>
            <span>
              Only Admins can invite new members or change permission tiers. All members
              collaborate on the shared wedding plan in real time.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section 1 — Active Wedding Members Table */}
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-xs">
        <div className="flex flex-col justify-between gap-4 bg-surface-container-lowest p-6 md:flex-row md:items-center lg:p-7">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-headline text-headline-md font-medium tracking-tight text-primary">
                Active Wedding Members
              </h2>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-caption font-bold text-on-surface">
                {members.length}
              </span>
            </div>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">
              Family leaders and coordinators actively building {coupleTitle}&apos;s
              celebration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter Chips */}
            <div className="inline-flex gap-1 rounded-xl bg-surface-container-low p-1">
              <button
                type="button"
                onClick={() => setRoleFilter('ALL')}
                className={`rounded-full px-3 py-1.5 text-label-md transition-all ${
                  roleFilter === 'ALL'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                All ({members.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('ADMIN')}
                className={`rounded-full px-3 py-1.5 text-label-md transition-all ${
                  roleFilter === 'ADMIN'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Admins ({adminCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('MANAGER')}
                className={`rounded-full px-3 py-1.5 text-label-md transition-all ${
                  roleFilter === 'MANAGER'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Managers ({managerCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[17px]">search</span>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or email..."
                aria-label="Filter members by name or email"
                className="h-9 w-full rounded-lg bg-surface-container-low pl-9 pr-3 text-body-sm text-on-surface transition-all placeholder:text-outline focus:bg-surface-container focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-label-caption uppercase tracking-wider text-on-surface-variant">
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Member
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Permission Role
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3.5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-body-md">
              {filteredMembers.map((member, index) => {
                const isOnlyAdmin = member.role === 'ADMIN' && adminCount <= 1;
                return (
                  <tr
                    key={member.id}
                    className={`transition-colors hover:bg-surface-container-low/60 ${
                      index % 2 === 1
                        ? 'bg-surface-container-low/20'
                        : 'bg-surface-container-lowest'
                    }`}
                  >
                    <td className="min-w-[280px] px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-label-lg font-bold shadow-xs ${getAvatarClasses(
                            member.avatarVariant
                          )}`}
                        >
                          {member.initials}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-label-lg font-semibold text-on-surface">
                              {member.name}
                            </span>
                            {member.isPrimaryOwner && (
                              <span className="rounded bg-secondary-container px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
                                Owner
                              </span>
                            )}
                          </div>
                          <span className="truncate text-body-sm text-outline">
                            {member.email}
                          </span>
                          <span className="mt-0.5 text-label-caption text-secondary">
                            {member.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {member.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-label-caption font-semibold uppercase tracking-wide text-on-primary shadow-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-label-caption font-semibold uppercase tracking-wide text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          MANAGER
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-body-sm text-on-surface-variant">
                      {member.joinedDate}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {member.isOnline ? (
                        <div className="flex items-center gap-1.5 text-label-md font-medium text-primary">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                          {member.lastActive}
                        </div>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant">
                          {member.lastActive}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {!isAdmin || (member.isPrimaryOwner && isOnlyAdmin) ? (
                        <span
                          title="At least one Primary Admin is required per workspace"
                          className="inline-flex cursor-not-allowed select-none items-center gap-1 rounded-lg bg-surface-container-low px-2.5 py-1 text-label-caption text-outline"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            lock
                          </span>
                          {member.isPrimaryOwner ? 'Primary Admin' : 'Admin Only'}
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <div className="relative">
                            <select
                              aria-label={`Change permission for ${member.name}`}
                              value={member.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  member.id,
                                  e.target.value as MemberRole
                                )
                              }
                              className="h-8 cursor-pointer appearance-none rounded-lg bg-surface-container-low pl-2.5 pr-6 text-label-md font-semibold text-primary transition-colors hover:bg-surface-container focus:outline-none"
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="MANAGER">MANAGER</option>
                            </select>
                            <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-2 text-[16px] text-on-surface-variant">
                              arrow_drop_down
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="rounded px-2 py-1 text-label-md text-outline transition-colors hover:bg-error-container/40 hover:text-error"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-body-md text-on-surface-variant"
                  >
                    No members match your current filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Subtle Table Governance Info Footer */}
        <div className="flex items-center gap-2.5 bg-surface-container-low/70 p-4 px-6 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-secondary">
            info
          </span>
          <span>
            At least one Admin is required per workspace to manage member invitations and
            wedding settings.
          </span>
        </div>
      </div>

      {/* 4. Section 2 — Pending Member Invitations Table */}
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-xs">
        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-headline text-headline-md font-medium tracking-tight text-primary">
                Pending Member Invitations
              </h2>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-label-caption font-bold text-on-secondary-container">
                {invitations.length}
              </span>
            </div>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">
              Invitations awaiting acceptance. You can copy or preview magic links or
              revoke invitations at any time.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-label-caption uppercase tracking-wider text-on-surface-variant">
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Invitee Email
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Assigned Role
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Invited By
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Expires In
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-body-md">
              {invitations.map((invite, index) => (
                <tr
                  key={invite.id}
                  className={`transition-colors hover:bg-surface-container-low/60 ${
                    index % 2 === 1
                      ? 'bg-surface-container-low/20'
                      : 'bg-surface-container-lowest'
                  }`}
                >
                  <td className="min-w-[240px] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">
                          outgoing_mail
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-label-lg font-medium text-on-surface">
                          {invite.email}
                        </span>
                        <span className="text-label-caption text-secondary">
                          {invite.relationshipNote}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 text-label-caption font-semibold uppercase text-primary">
                      {invite.role}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-body-sm font-medium text-on-surface">
                      {invite.invitedByName}
                    </span>
                    <span className="block text-label-caption text-outline">
                      {invite.invitedByRole}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-body-sm font-medium text-primary">
                      {invite.expiresRelative}
                    </span>
                    <span className="block text-label-caption text-outline">
                      {invite.expiresDate}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-label-caption font-semibold uppercase tracking-wide text-secondary">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {invite.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-3 text-label-md">
                      {invite.acceptUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCopyInviteLink(invite)}
                            className="font-semibold text-primary underline decoration-outline/40 underline-offset-4 transition-colors hover:text-secondary"
                          >
                            {copiedInviteId === invite.id
                              ? 'Copied!'
                              : 'Copy Invite Link'}
                          </button>
                          <span className="text-surface-container-high">•</span>
                          <Link
                            href={new URL(invite.acceptUrl).pathname}
                            className="font-medium text-on-surface-variant transition-colors hover:text-primary"
                          >
                            Preview
                          </Link>
                          <span className="text-surface-container-high">•</span>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRevokeInvitation(invite.id)}
                        className="rounded px-2 py-1 text-secondary transition-colors hover:bg-error-container/40 hover:text-error"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {invitations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-body-md text-on-surface-variant"
                  >
                    No pending invitations right now. Use the form above to invite a
                    family member or coordinator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. V1 Permission & Governance Cards */}
      <div className="grid grid-cols-1 gap-6 pb-12 pt-2 md:grid-cols-3">
        <div className="space-y-2.5 rounded-xl bg-surface-container-lowest p-6 shadow-xs">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[18px]">
              admin_panel_settings
            </span>
          </div>
          <h3 className="text-label-lg font-semibold text-primary">
            Wedding Admins
          </h3>
          <p className="text-body-sm leading-relaxed text-on-surface-variant">
            Full workspace ownership: invite or remove members, assign roles, update
            wedding details, and configure the public website and livestream.
          </p>
        </div>

        <div className="space-y-2.5 rounded-xl bg-surface-container-lowest p-6 shadow-xs">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[18px]">
              family_restroom
            </span>
          </div>
          <h3 className="text-label-lg font-semibold text-primary">
            Family Managers
          </h3>
          <p className="text-body-sm leading-relaxed text-on-surface-variant">
            Day-to-day execution access across ceremonies, tasks, guest lists, RSVPs,
            shared expenses, vendor contacts, and photo moderation.
          </p>
        </div>

        <div className="space-y-2.5 rounded-xl bg-surface-container-lowest p-6 shadow-xs">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[18px]">
              mark_email_unread
            </span>
          </div>
          <h3 className="text-label-lg font-semibold text-primary">
            7-Day Magic Invitation Links
          </h3>
          <p className="text-body-sm leading-relaxed text-on-surface-variant">
            Each email invitation carries a single-use token valid for 7 days and verifies
            that the signed-in email matches the invited address.
          </p>
        </div>
      </div>
    </div>
  );
}
