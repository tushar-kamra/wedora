import 'server-only';
import { Resend } from 'resend';
import { getServerEnv } from '@/server/config/env';

export interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> {
  const env = getServerEnv();
  const apiKey = env.RESEND_API_KEY?.trim();

  const isPlaceholderKey =
    !apiKey || apiKey === 're_placeholder_key' || apiKey.startsWith('placeholder');

  if (isPlaceholderKey) {
    console.info(
      `\n[Wedora Dev Email] Password Reset Requested for ${name} <${to}>\nReset Link: ${resetUrl}\n`
    );
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [to],
    subject: 'Reset your Wedora password',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #1e1a20; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #fff7fd; border-radius: 16px;">
        <p style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #765562; font-weight: 600; margin: 0 0 12px;">
          Wedora • Wedding Workspace
        </p>
        <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 500; color: #1e1a20; margin: 0 0 16px;">
          Reset your password
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #4c454a; margin: 0 0 24px;">
          Hi ${name}, we received a request to reset the password for your Wedora workspace account. Click the button below to choose a new password.
        </p>
        <p style="margin: 0 0 24px;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #322231; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 12px;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #765562; margin: 0;">
          This link expires in 1 hour and can only be used once. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[Resend Error] Failed to send password reset email:', error);
  }
}

export interface SendMemberInvitationEmailParams {
  to: string;
  invitedByName: string;
  brideName: string;
  groomName: string;
  role: 'ADMIN' | 'MANAGER';
  acceptUrl: string;
}

export async function sendMemberInvitationEmail({
  to,
  invitedByName,
  brideName,
  groomName,
  role,
  acceptUrl,
}: SendMemberInvitationEmailParams): Promise<void> {
  const env = getServerEnv();
  const apiKey = env.RESEND_API_KEY?.trim();

  const isPlaceholderKey =
    !apiKey || apiKey === 're_placeholder_key' || apiKey.startsWith('placeholder');

  if (isPlaceholderKey) {
    console.info(
      `\n[Wedora Dev Email] Member Invitation sent to <${to}> (${role}) by ${invitedByName} for ${brideName} & ${groomName}\nAccept Link: ${acceptUrl}\n`
    );
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [to],
    subject: `${invitedByName} invited you to collaborate on ${brideName} & ${groomName}'s Wedding on Wedora`,
    html: `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #1e1a20; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #fff7fd; border-radius: 16px;">
        <p style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #765562; font-weight: 600; margin: 0 0 12px;">
          Wedora • Wedding Workspace Invitation
        </p>
        <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 500; color: #1e1a20; margin: 0 0 16px;">
          Join ${brideName} &amp; ${groomName}&rsquo;s Wedding Workspace
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #4c454a; margin: 0 0 24px;">
          <strong>${invitedByName}</strong> has invited you to collaborate on <strong>${brideName} &amp; ${groomName}</strong>&rsquo;s wedding workspace on Wedora as a <strong>${role}</strong>.
        </p>
        <p style="margin: 0 0 24px;">
          <a href="${acceptUrl}" style="display: inline-block; background-color: #322231; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 12px;">
            Accept Invitation
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #765562; margin: 0;">
          This invitation link expires in 7 days. Please sign in or create a Wedora account using <strong>${to}</strong> to accept.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[Resend Error] Failed to send member invitation email:', error);
  }
}

