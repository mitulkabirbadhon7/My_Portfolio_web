import { Resend } from 'resend';
import { AppError } from '../utils/AppError';

export interface IContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendContactMessage(payload: IContactPayload): Promise<void> {
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!process.env.RESEND_API_KEY) {
      throw new AppError('Email service is not configured (missing API key)', 500);
    }

    if (!receiverEmail) {
      throw new AppError('Contact receiver email is not defined', 500);
    }

    const emailSubject = payload.subject?.trim()
      ? `Portfolio Contact: ${payload.subject.trim()}`
      : `New Portfolio Message from ${payload.name.trim()}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #2563eb; margin-top: 0;">New Message via Portfolio</h2>
        <p><strong>Sender Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Sender Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
        <p><strong>Subject:</strong> ${escapeHtml(payload.subject || 'General Inquiry')}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <h4 style="margin-bottom: 8px;">Message Content:</h4>
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(payload.message)}</div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">Hit "Reply" in your email client to respond directly to ${escapeHtml(payload.email)}.</p>
      </div>
    `;

    const { error } = await this.resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [receiverEmail],
      replyTo: payload.email.trim(),
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      throw new AppError(`Email delivery failed: ${error.message}`, 500);
    }
  }
}

// Basic HTML sanitizer to prevent injection inside email clients
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const emailService = new EmailService();