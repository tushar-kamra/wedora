import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getOptionalAuth } from '@/server/auth/session';
import { MembersService } from '@/modules/members/members.service';
import { MembersManagementView } from '@/components/features/members/members-management-view';

export const metadata: Metadata = {
  title: 'Wedding Members — Wedora',
  description:
    'Invite parents, siblings, and family coordinators to plan together with Admin and Manager roles.',
};

export default async function MembersPage() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect('/login');
  }

  if (!auth.wedding || !auth.membership) {
    redirect('/create-wedding');
  }

  const [members, invitations] = await Promise.all([
    MembersService.listMembers(auth.wedding.id),
    auth.membership.role === 'ADMIN'
      ? MembersService.listPendingInvitations(auth.wedding.id)
      : Promise.resolve([]),
  ]);

  const coupleTitle = `${auth.wedding.brideName} & ${auth.wedding.groomName}`;

  return (
    <MembersManagementView
      initialMembers={members}
      initialInvitations={invitations}
      currentUserRole={auth.membership.role}
      coupleTitle={coupleTitle}
    />
  );
}
