import type { Metadata } from 'next';
import { getOptionalAuth } from '@/server/auth/session';
import { MembersService } from '@/modules/members/members.service';
import {
  MemberInvitationCard,
  type MemberInvitationPreviewData,
} from '@/components/features/members/member-invitation-card';

export const metadata: Metadata = {
  title: 'Accept Wedding Workspace Invitation — Wedora',
  description:
    'Review and accept your invitation to collaborate on a Wedora wedding workspace.',
};

interface MemberInvitationPageProps {
  params: Promise<{ token: string }>;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function MemberInvitationPage({
  params,
}: MemberInvitationPageProps) {
  const { token } = await params;
  const auth = await getOptionalAuth();

  let initialData: MemberInvitationPreviewData | undefined;

  try {
    const publicInvite = await MembersService.getPublicInvitation(
      token,
      Boolean(auth)
    );
    initialData = {
      token,
      email: publicInvite.email,
      role: publicInvite.role,
      status: publicInvite.status,
      expiresAt: formatDateLabel(publicInvite.expiresAt),
      wedding: {
        title:
          publicInvite.wedding.title ??
          `${publicInvite.wedding.brideName} & ${publicInvite.wedding.groomName}`,
        brideName: publicInvite.wedding.brideName,
        groomName: publicInvite.wedding.groomName,
        weddingDate: formatDateLabel(publicInvite.wedding.weddingDate),
        city: publicInvite.wedding.city ?? 'India',
      },
      invitedByName: publicInvite.invitedByName,
      currentUserEmail: auth?.user.email ?? null,
    };
  } catch {
    // If token is a UI demo token or invalid, MemberInvitationCard handles fallback/expired display
  }

  return <MemberInvitationCard token={token} initialData={initialData} />;
}
