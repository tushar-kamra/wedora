'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { acceptMemberInvitationApi } from '@/lib/api/members';
import { ApiClientError } from '@/lib/api/client';

export interface MemberInvitationPreviewData {
  token: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  wedding: {
    title: string;
    brideName: string;
    groomName: string;
    weddingDate: string;
    city: string;
  };
  invitedByName: string;
  currentUserEmail?: string | null;
}

interface MemberInvitationCardProps {
  token: string;
  initialData?: MemberInvitationPreviewData;
}

export function MemberInvitationCard({
  token,
  initialData,
}: MemberInvitationCardProps) {
  const router = useRouter();

  const isExpiredToken = token.toLowerCase().includes('expired');
  const isRevokedToken = token.toLowerCase().includes('revoked');

  const invitation: MemberInvitationPreviewData = initialData ?? {
    token,
    email: 'rahul.kapoor@example.com',
    role: token.toLowerCase().includes('admin') ? 'ADMIN' : 'MANAGER',
    status: isExpiredToken
      ? 'EXPIRED'
      : isRevokedToken
        ? 'REVOKED'
        : 'PENDING',
    expiresAt: '19 Feb 2027',
    wedding: {
      title: 'Princi Weds Akshay',
      brideName: 'Princi Kapoor',
      groomName: 'Akshay Saini',
      weddingDate: '14 Feb 2027',
      city: 'Udaipur',
    },
    invitedByName: 'Akshay Saini',
    currentUserEmail: null,
  };

  const [status, setStatus] = useState<MemberInvitationPreviewData['status']>(
    invitation.status
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAcceptInvitation = async () => {
    if (status !== 'PENDING') return;
    setErrorMessage(null);
    setIsAccepting(true);

    try {
      await acceptMemberInvitationApi(token);
      setStatus('ACCEPTED');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.code === 'UNAUTHENTICATED') {
          router.push(
            `/login?next=${encodeURIComponent(`/member-invitations/${token}`)}`
          );
          return;
        }
        if (error.code === 'TOKEN_EXPIRED') {
          setStatus('EXPIRED');
          return;
        }
        if (error.code === 'INVITATION_ALREADY_ACCEPTED') {
          setStatus('ACCEPTED');
          return;
        }
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'Unable to accept invitation right now. Please try again.'
        );
      }
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-surface text-on-surface antialiased">
      {/* Top Minimal Editorial Header */}
      <header className="w-full border-b border-outline-variant/20 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-headline text-headline-md font-medium tracking-tight text-primary">
              Wedora
            </span>
            <span className="mb-1 h-1.5 w-1.5 rounded-full bg-secondary" />
          </Link>

          <div className="flex items-center gap-3">
            {invitation.currentUserEmail ? (
              <span className="rounded-lg bg-surface-container-low px-3.5 py-2 text-label-md font-medium text-on-surface-variant">
                Signed in as{' '}
                <strong className="font-semibold text-on-surface">
                  {invitation.currentUserEmail}
                </strong>
              </span>
            ) : (
              <>
                <Link
                  href={`/login?next=${encodeURIComponent(`/member-invitations/${token}`)}`}
                  className="rounded-lg px-3.5 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                >
                  Log In
                </Link>
                <Link
                  href={`/signup?next=${encodeURIComponent(`/member-invitations/${token}`)}`}
                  className="rounded-xl bg-primary px-4 py-2 text-label-md font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-container"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Centered Invitation Card */}
      <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-6 py-12">
        <div className="relative w-full overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-xs md:p-10">
          {/* Top Decorative Gradient Accent */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary-container/30 blur-3xl" />

          <div className="relative space-y-7">
            {/* Eyebrow Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container/50 px-3 py-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  mail
                </span>
                <span className="text-label-caption font-semibold uppercase tracking-wider text-on-secondary-container">
                  Workspace Invitation
                </span>
              </div>
              <span className="rounded-full bg-surface-container-low px-3 py-1 text-label-caption font-semibold uppercase tracking-wider text-primary">
                Role: {invitation.role}
              </span>
            </div>

            {/* Wedding Title & Context */}
            <div className="space-y-2">
              <h1 className="font-headline text-headline-lg font-normal tracking-tight text-primary">
                {invitation.wedding.title}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                <strong className="font-semibold text-on-surface">
                  {invitation.invitedByName}
                </strong>{' '}
                has invited you to collaborate on{' '}
                <span className="font-medium text-on-surface">
                  {invitation.wedding.brideName} &amp; {invitation.wedding.groomName}
                </span>
                &apos;s wedding workspace.
              </p>
            </div>

            {/* Wedding Summary Strip */}
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-surface-container-low p-4 sm:grid-cols-3">
              <div>
                <p className="text-label-caption uppercase tracking-wider text-on-surface-variant">
                  Wedding Date
                </p>
                <p className="mt-0.5 text-label-lg font-semibold text-primary">
                  {invitation.wedding.weddingDate}
                </p>
              </div>
              <div>
                <p className="text-label-caption uppercase tracking-wider text-on-surface-variant">
                  City
                </p>
                <p className="mt-0.5 text-label-lg font-semibold text-primary">
                  {invitation.wedding.city}
                </p>
              </div>
              <div>
                <p className="text-label-caption uppercase tracking-wider text-on-surface-variant">
                  Invited Email
                </p>
                <p className="mt-0.5 truncate text-label-md font-semibold text-secondary">
                  {invitation.email}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-error/30 bg-error-container/50 p-4 text-body-sm font-medium text-on-error-container"
              >
                {errorMessage}
              </div>
            )}

            {/* Status-Specific Body */}
            {status === 'PENDING' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-outline-variant/30 bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-secondary">
                      verified_user
                    </span>
                    <div className="space-y-1">
                      <p className="text-label-md font-semibold text-on-surface">
                        {invitation.role === 'ADMIN'
                          ? 'Admin Access — Full Workspace & Member Governance'
                          : 'Manager Access — Events, Tasks, Guests, Expenses & Vendors'}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        To accept this invitation, make sure you are signed in with{' '}
                        <span className="font-medium text-on-surface">
                          {invitation.email}
                        </span>
                        . This link expires on {invitation.expiresAt}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAcceptInvitation}
                    disabled={isAccepting}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-lg font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-container disabled:opacity-60"
                  >
                    <span>
                      {isAccepting ? 'Joining Workspace...' : 'Accept & Join Wedding'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                  <Link
                    href="/app/members"
                    className="flex h-12 items-center justify-center rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-5 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  >
                    Back to Members
                  </Link>
                </div>
              </div>
            )}

            {status === 'ACCEPTED' && (
              <div
                role="status"
                className="space-y-5 rounded-xl bg-secondary-container/35 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">
                    check_circle
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-label-lg font-semibold text-primary">
                      You&apos;ve joined {invitation.wedding.title}!
                    </h2>
                    <p className="text-body-sm text-on-surface-variant">
                      Your <strong className="font-semibold">{invitation.role}</strong>{' '}
                      membership is now active. Head to the wedding dashboard to view
                      ceremonies, tasks, and guest RSVPs.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => router.push('/app')}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-label-lg font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-container"
                  >
                    <span>Open Wedding Dashboard</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            )}

            {(status === 'EXPIRED' || status === 'REVOKED') && (
              <div
                role="alert"
                className="space-y-4 rounded-xl bg-error-container/50 p-5 text-on-error-container"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[22px] text-error">
                    error
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-label-lg font-semibold text-on-error-container">
                      {status === 'EXPIRED'
                        ? 'This Invitation Link Has Expired'
                        : 'This Invitation Has Been Revoked'}
                    </h2>
                    <p className="text-body-sm text-on-error-container/90">
                      For security, magic invitation links expire 7 days after they are
                      sent. Please ask a Wedding Admin ({invitation.invitedByName}) to
                      send a fresh invitation from the Members page.
                    </p>
                  </div>
                </div>

                <div>
                  <Link
                    href="/app/members"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-container"
                  >
                    Return to Workspace
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-label-caption text-outline">
        Wedora — Collaborative Indian Wedding Management Platform
      </footer>
    </div>
  );
}
