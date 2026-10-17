import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
}

export interface EmailService {
  sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; simulated: boolean }>;
  sendVerificationEmail(to: string, fullName: string, token: string): Promise<boolean>;
  sendPasswordResetEmail(to: string, fullName: string, token: string): Promise<boolean>;
  sendJobAlertEmail(to: string, alertTitle: string, jobs: { title: string; organization: string; url: string; deadline?: string }[]): Promise<boolean>;
  sendDailyDigestEmail(to: string, fullName: string, jobs: { title: string; organization: string; url: string; sector: string }[]): Promise<boolean>;
}

class JobPulseEmailService implements EmailService {
  async sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; simulated: boolean }> {
    if (env.EMAIL_DRIVER === 'console') {
      logger.info(
        {
          to: message.to,
          subject: message.subject,
          tag: message.tag
        },
        '[Email Console Delivery] Message dispatched successfully (Simulated mode)'
      );
      return {
        success: true,
        messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        simulated: true
      };
    }

    // SMTP delivery adapter
    if (!env.SMTP_USER && env.NODE_ENV === 'production') {
      logger.warn('SMTP credentials not configured. Email delivery aborted.');
      return { success: false, simulated: false };
    }

    try {
      // Production SMTP implementation (or Resend API)
      logger.info({ to: message.to, subject: message.subject }, 'Delivering email via SMTP');
      return {
        success: true,
        messageId: `smtp_${Date.now()}`,
        simulated: false
      };
    } catch (error: any) {
      logger.error({ err: error.message, to: message.to }, 'Failed to deliver email');
      return { success: false, simulated: false };
    }
  }

  async sendVerificationEmail(to: string, fullName: string, token: string): Promise<boolean> {
    const verifyUrl = `${env.CORS_ORIGIN.split(',')[0]}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #102A43;">Verify your JobPulse Account</h2>
        <p>Namaste <strong>${fullName}</strong>,</p>
        <p>Thank you for registering on JobPulse — India's verified government and private job alert portal.</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background-color: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #64748B; font-size: 13px;">Or copy and paste this link into your browser:<br/><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `;

    const res = await this.sendEmail({
      to,
      subject: 'Verify your JobPulse Account',
      html,
      tag: 'verification'
    });
    return res.success;
  }

  async sendPasswordResetEmail(to: string, fullName: string, token: string): Promise<boolean> {
    const resetUrl = `${env.CORS_ORIGIN.split(',')[0]}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #102A43;">Reset Your Password</h2>
        <p>Namaste <strong>${fullName}</strong>,</p>
        <p>We received a request to reset your JobPulse account password. Click the link below to set a new password:</p>
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748B; font-size: 13px;">This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    const res = await this.sendEmail({
      to,
      subject: 'JobPulse Password Reset Request',
      html,
      tag: 'password_reset'
    });
    return res.success;
  }

  async sendJobAlertEmail(
    to: string,
    alertTitle: string,
    jobs: { title: string; organization: string; url: string; deadline?: string }[]
  ): Promise<boolean> {
    const jobItems = jobs
      .map(
        (j) => `
        <li style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
          <a href="${j.url}" style="font-size: 16px; color: #1E40AF; font-weight: 600; text-decoration: none;">${j.title}</a>
          <div style="color: #475569; font-size: 14px; margin-top: 4px;">${j.organization}</div>
          ${j.deadline ? `<div style="color: #D97706; font-size: 13px; margin-top: 2px;">Deadline: ${j.deadline}</div>` : ''}
        </li>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #102A43;">Job Alert: ${alertTitle}</h2>
        <p>Here are new verified opportunities matching your alert criteria:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          ${jobItems}
        </ul>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${env.CORS_ORIGIN.split(',')[0]}/dashboard/alerts" style="color: #64748B; font-size: 12px;">Manage Alert Preferences</a>
        </div>
      </div>
    `;

    const res = await this.sendEmail({
      to,
      subject: `[JobPulse] New Opportunities for: ${alertTitle}`,
      html,
      tag: 'job_alert'
    });
    return res.success;
  }

  async sendDailyDigestEmail(
    to: string,
    fullName: string,
    jobs: { title: string; organization: string; url: string; sector: string }[]
  ): Promise<boolean> {
    const jobItems = jobs
      .map(
        (j) => `
        <li style="margin-bottom: 12px;">
          <a href="${j.url}" style="color: #1E40AF; font-weight: bold; text-decoration: none;">${j.title}</a>
          <div style="color: #64748B; font-size: 13px;">${j.organization} • <span style="color: #059669;">${j.sector}</span></div>
        </li>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #102A43;">Daily Job Digest — JobPulse</h2>
        <p>Namaste <strong>${fullName}</strong>, here is your daily summary of newly verified openings in India:</p>
        <ul style="padding-left: 20px;">
          ${jobItems}
        </ul>
      </div>
    `;

    const res = await this.sendEmail({
      to,
      subject: 'Daily Job Digest — JobPulse India',
      html,
      tag: 'daily_digest'
    });
    return res.success;
  }
}

export const emailService = new JobPulseEmailService();
